import { Component, OnInit } from '@angular/core';
import { AlertController, PopoverController } from '@ionic/angular';
import { UserOptionComponent } from '../shared/components/user-option/user-option.component';
import { Producto } from 'src/interfaces/producto';
import { LoadingController } from '@ionic/angular';
import { ProductosService } from '../services/productos.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit{

  productos: Producto[] = [];
  cargandoProd: boolean = true;
  errorCarga: boolean = false;

  constructor(private popoverControl: PopoverController
    ,private loadContr: LoadingController,
    private alerta: AlertController,
    private servProd: ProductosService
  ) {}

  ngOnInit(): void {
      this.cargaproductos();
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverControl.create({
      component: UserOptionComponent,
      event: ev,
      translucent: true,
      cssClass: 'my-custom-popover',
    });
    await popover.present();
  }

  async cargaproductos(){
    this.cargandoProd = true;
    this.errorCarga = false;
    const cargando = await this.loadContr.create({
      message: 'Cargando inventario...',
      spinner:'crescent'
    });
    await cargando.present();

    try{
      const {data, error} = await this.servProd.getProductos();

      if(error){
        this.errorCarga= true;
        this.presentAlert('Error', 'No se pudieron cargar los productos.')
      }else if(data){
        this.productos =data;
      }
    }catch (error:any){
      this.errorCarga = true;
      this.presentAlert('Error','Ocurrio un error inesperado');
    } finally{
      this.cargandoProd = false;
      await cargando.dismiss();
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

   async presentAlert(header: string, message: string) {
    const alert = await this.alerta.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
