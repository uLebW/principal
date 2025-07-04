import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { PedidosService } from 'src/app/services/pedidos.service';
import { Pedido } from 'src/interfaces/pedido';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
  standalone:false
})
export class PedidosPage implements OnInit {
  pedidos: Pedido[] = [];
  isLoading: boolean = true;
  errorMe: string | null = null;

  constructor(
    private pedidosService: PedidosService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.loadPedidos();
  }
   async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async presentToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: color
    });
    await toast.present();
  }

  ionViewWillEnter() {
    // Recargar pedidos cada vez que se entra a la vista
    this.loadPedidos();
  }
  async loadPedidos(){
    this.isLoading = true;
    this.errorMe= null;
    this.pedidos = [];

    const loading = await this.loadingController.create({
      message:  'Cargando tus pedidos...',
      spinner: 'circular'
    })
    await loading.present();

    try{
      const {data, error} = await this.pedidosService.getPedidosDelUsuario();
      if(error){
        this.errorMe = 'No se pudieron cargar los pedidos. Intentelo de nuevo.';
        this.presentAlert('Error', this.errorMe);
      }else if(data){
        this.pedidos = data;
        if(this.pedidos.length === 0){
          this.presentToast('No tienes pedidos aún. Haz alguno y vuleve.')
        }
      }
    }catch (e:any){
      this.errorMe = 'Ocurrio un error inesperado.';
      this.presentAlert('Error',this.errorMe);
    }finally{
      this.isLoading= false;
      await loading.dismiss();
    }
  }

  formatDate(dateString: string): string{
    if(!dateString) return '';
    const options: Intl.DateTimeFormatOptions = {year: 'numeric', month: 'long', day: 'numeric',
      hour:'2-digit', minute:'2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

}
