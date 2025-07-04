import { Component, OnInit } from '@angular/core';
import { CarritoService } from 'src/app/services/carrito.service';
import { ItemCarrito } from 'src/interfaces/itemCarrito';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
  standalone: false
})
export class CarritoPage implements OnInit {
  cartItems: ItemCarrito[] = [];
  isLoadingCart: boolean = true;
  hasCartError: boolean = false;
  totalPrecio: number = 0;
  constructor(private carritoService: CarritoService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.loadItems();
  }

  ionViewWillEnter() {
    this.loadItems();
  }

  async loadItems() {
    this.isLoadingCart = true;
    this.hasCartError = false;

    const loading = await this.loadingController.create({
      message: 'Cargando carrito',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      const { items, error } = await this.carritoService.getCarritoItems();
      if (error) {
        this.hasCartError = true;
        this.presentAlert('Error', 'No se pudieron cargar los items del carrito');
      } else if (items) {
        this.cartItems = items;
        this.calculaTotal();
      }
    } catch (e: any) {
      this.hasCartError = true;
      this.presentAlert('Error', 'Error inesperado')
    } finally {
      this.isLoadingCart = false;
      await loading.dismiss();
    }
  }

  calculaTotal() {
    this.totalPrecio = this.cartItems.reduce((sum, item) => sum + (item.cantidad * item.precio_unitario), 0)
  }

  async incrementaCantidad(item: ItemCarrito) {
    item.cantidad++;
    await this.updateItem(item);
  }

  async bajarCantidad(item: ItemCarrito) {
    item.cantidad--;
    if (item.cantidad <= 0) {
      await this.confirmaEliminacion(item);
    } else {
      await this.updateItem(item);
    }
  }

  async updateItem(item: ItemCarrito) {
    const toast = await this.toastController.create({
      message: 'Actualizando carrito...',
      duration: 2000,
      color: 'medium',
      position: 'bottom'
    });
    await toast.present();

    const { data, error } = await this.carritoService.updateItemQuantity(item.id_item!, item.cantidad);
    if (error) {
      this.presentAlert('Error', 'No se pudo actualizar la cantidad del producto');
      this.loadItems();
    } else {
      this.calculaTotal();
      await toast.dismiss();
    }
  }

  async confirmaEliminacion(item: ItemCarrito) {
    const alert = await this.alertController.create({
      header: 'Eliminar Producto',
      message: `¿Quieres eliminar "${item.producto.nombre}" del carrito?`,
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          item.cantidad = 1;
          this.calculaTotal();
        },
      },
      {
        text: 'Eliminar',
        handler: async () => {
          await this.removeItem(item);
        }
      }]
    });
    await alert.present();
  }

  async removeItem(item: ItemCarrito){
    const loading = await this.loadingController.create({
      message: 'Eliminando producto...',
      spinner:'crescent'
    });
    await loading.present();

    const {success, error} = await this.carritoService.removeFromCart(item.id_item!);
    await loading.dismiss();

    if(error){
      this.presentAlert('Error', 'No se pudo eliminar el producto del carrito');
    }else if(success){
      this.presentToast('Producto eliminado');
      this.loadItems();
    }
  }


   async limpairCartio() {
    const alert = await this.alertController.create({
      header: 'Vaciar Carrito',
      message: '¿Estás seguro de que quieres eliminar TODOS los productos de tu carrito?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Sí, Vaciar',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Vaciando carrito...',
              spinner: 'crescent'
            });
            await loading.present();

            const { success, error } = await this.carritoService.limparCart();
            await loading.dismiss();

            if (error) {
              console.error('Error al vaciar el carrito:', error);
              this.presentAlert('Error', 'No se pudo vaciar el carrito. Inténtalo de nuevo.');
            } else if (success) {
              this.presentToast('Tu carrito ha sido vaciado.');
              this.loadItems(); // Recargar el carrito para mostrar que está vacío
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async presentAlert(header: string, message: string){
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
    await toast.present();
  }


     async checkout() {
    const alert = await this.alertController.create({
      header: 'Confirmar Pedido',
      inputs: [
        {
          name: 'direccion',
          type: 'textarea',
          placeholder: 'Ingresa tu dirección de envío'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            // El handler del botón Cancelar no necesita devolver un valor si solo cancela.
            // Pero por consistencia, o si se espera un Promise<boolean>, podrías poner 'return false;'
            return false; // Indica al AlertController que no cierre el alert automáticamente.
          }
        },
        {
          text: 'Confirmar',
          handler: async (data) => {
            if (!data.direccion || data.direccion.trim() === '') {
              this.presentToast('Por favor, ingresa una dirección de envío.');
              return false; // **IMPORTANTE: No cierres el alert si la dirección está vacía.**
            }

            const loading = await this.loadingController.create({
              message: 'Procesando pedido...',
              spinner: 'crescent'
            });
            await loading.present();

            const { pedidoId, error } = await this.carritoService.checkout(data.direccion);
            await loading.dismiss();

            if (error) {
              console.error('Error al procesar pedido:', error);
              this.presentAlert('Error en el Pedido', 'No se pudo completar tu pedido: ' + error.message);
              return false; // **IMPORTANTE: Mantén el alert abierto o maneja el cierre según tu UI**
                           // O si quieres que se cierre después del alert de error, usa 'return true;'
            } else if (pedidoId) {
              this.presentAlert('¡Pedido Realizado!', `Tu pedido #${pedidoId} ha sido procesado exitosamente.`);
              this.loadItems(); // Vaciar la vista del carrito
              return true; // **IMPORTANTE: Cierra el alert si el pedido fue exitoso.**
            }

            // Si por alguna razón ninguna de las condiciones anteriores se cumple,
            // asegura un retorno. Por ejemplo, si 'pedidoId' es null sin error.
            return false; // O 'true' dependiendo de si quieres que se cierre en este caso.
          },
        },
      ],
    });
    await alert.present();
  }
}
