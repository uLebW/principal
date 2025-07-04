import { Component, OnInit } from '@angular/core';
import { IonList, IonItem, IonContent, IonIcon, IonLabel } from "@ionic/angular/standalone";
import { PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-user-options',
  templateUrl: './user-options.component.html',
  styleUrls: ['./user-options.component.scss'],
  standalone:false
})
export class UserOptionsComponent  implements OnInit {

   constructor(
    private popoverController: PopoverController,
    private router: Router,
    private supabaseService: SupabaseService
  ) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  async goToProfile() {
    // Cierra el popover antes de navegar
    await this.popoverController.dismiss();
    this.router.navigateByUrl('/profile'); // Ajusta la ruta a tu página de perfil
  }

  async goToCart() {
    await this.popoverController.dismiss();
    this.router.navigateByUrl('/cart'); // Ajusta la ruta a tu página de carrito
  }

  async logout() {
    await this.popoverController.dismiss();
    // Lógica para cerrar sesión (ej. limpiar tokens, redirigir a login)
    console.log('Cerrando sesión...');
    await this.supabaseService.cerrarSesion();
    this.router.navigateByUrl('/login', {replaceUrl:true}); // Ajusta la ruta a tu página de login
  }
}


