import { Component, OnInit } from '@angular/core';
import { IonList } from "@ionic/angular/standalone";
import { PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-user-option',
  templateUrl: './user-option.component.html',
  styleUrls: ['./user-option.component.scss'],
  standalone: false
})
export class UserOptionComponent implements OnInit {

  constructor(
    private popoverController: PopoverController,
    private router: Router,
    private supabaseService: SupabaseService
  ) { }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  async goToProfile() {
    // Cierra el popover antes de navegar
    await this.popoverController.dismiss();
    this.router.navigateByUrl('/perfil'); // Ajusta la ruta a tu página de perfil
  }

  async goToCart() {
    await this.popoverController.dismiss();
    this.router.navigateByUrl('/carrito'); // Ajusta la ruta a tu página de carrito
  }

  async logout() {
    await this.popoverController.dismiss();
    // Lógica para cerrar sesión (ej. limpiar tokens, redirigir a login)
    console.log('Cerrando sesión...');
    await this.supabaseService.cerrarSesion();
  }

}
