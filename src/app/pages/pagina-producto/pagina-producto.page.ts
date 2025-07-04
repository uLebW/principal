import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { CarritoService } from 'src/app/services/carrito.service';
import { ProductosService } from 'src/app/services/productos.service';
import { Producto } from 'src/interfaces/producto';

@Component({
  selector: 'app-pagina-producto',
  templateUrl: './pagina-producto.page.html',
  styleUrls: ['./pagina-producto.page.scss'],
  standalone:false
})
export class PaginaProductoPage implements OnInit {
  producto: Producto | undefined;
  cargando: boolean = true;
  mensajeError: string | null = null

  constructor(
    private servPrd: ProductosService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private activatedRoute: ActivatedRoute,
    private carritoService: CarritoService,
    private toastController: ToastController
  ) { }

  

  ngOnInit() {
    this.cargandoDetalles();
  }

  async cargandoDetalles(){
    this.cargando = true;
    this. mensajeError = null;

    const carga = await this.loadingController.create({
      message:'Cargando detalles...',
      spinner:'crescent'
    });
    await carga.present();

    try{
      const idProducto = this.activatedRoute.snapshot.paramMap.get('id');
      if(idProducto){
        const {data, error} = await this.servPrd.getProductoById(idProducto);

        if(error){
        this.mensajeError = 'Hubo un problema durante la carga. Intentelo de nuevo.';
        this.presentAlert('Error', this.mensajeError);
      }else if(data){
        this.producto = data;
      }else{
        this.mensajeError ='Producto no encontrado';
        this.presentAlert(this.mensajeError, 'El producto que buscas no existe en nuestro inventario.');
      }

      }else{
        this.mensajeError = 'Producto inviable';
        this.presentAlert('Error de dirección', this.mensajeError);
      }
    }catch(e:any){
      this.mensajeError = 'Ocurrio un error inesperado en la carga.';
      this.presentAlert('Error', this.mensajeError);
    }finally{
      this.cargando = false;
      await carga.dismiss();
    }
  }

   // Carga de valoración
  getEstrellas(rating: number | undefined):string[]{
    const estrellas: string [] = [];
    if(rating === undefined || rating === null){
      for(let i =0; i<5; i++){
        estrellas.push('star-outline');
      }
      return estrellas
    }

    const fullEstre = Math.floor(rating);
    const mediaEstrella = rating % 1 !==0 && rating - fullEstre >= 0.5;
    for(let i = 0; i < fullEstre; i++){
      estrellas.push('star');
    }
    if(mediaEstrella){
      estrellas.push('star-half');
    }
    const vacio = 5 - estrellas.length;
    for (let i = 0; i<vacio; i++){
      estrellas.push('star-outline');
    }
    return estrellas
  }

   // Función para añadir el producto al carrito
  async addToCart(producto: Producto) {
    if (!producto.id) {
      this.presentToast('Error: El producto no tiene un ID válido para añadir al carrito.', 'danger');
      return;
    }

    const toast = await this.toastController.create({
      message: 'Añadiendo al carrito...',
      duration: 2000,
      color: 'medium',
      position: 'bottom'
    });
    await toast.present();

    const { data, error } = await this.carritoService.addToCarrito(producto.id, 1); // Añade 1 unidad

    await toast.dismiss(); // Cierra el toast de "Añadiendo..."

    if (error) {
      console.error('Error al añadir al carrito:', error);
      this.presentToast('Error al añadir al carrito.', 'danger');
    } else if (data) {
      this.presentToast('Producto añadido al carrito.', 'success');
      // Opcional: podrías emitir un evento o actualizar un contador de carrito aquí
    }
  }


  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }
   // Helper para mostrar mensajes temporales
  async presentToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: color
    });
    await toast.present();
  }

}
