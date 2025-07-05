import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-actualizar-contra',
  templateUrl: './actualizar-contra.page.html',
  styleUrls: ['./actualizar-contra.page.scss'],
  standalone: false
})
export class ActualizarContraPage implements OnInit {
  resetForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: SupabaseService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async presentToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      color: color
    });
    await toast.present();
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  ngOnInit() {}

  async onRequestReset() {
    if (this.resetForm.invalid) {
      this.presentToast('Por favor, ingresa un correo electrónico válido.', 'danger');
      return;
    }

    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Enviando enlace...',
      spinner: 'crescent'
    });
    await loading.present();

    const email = this.resetForm.value.email;
    const redirectToUrl = `${window.location.origin}/cambiar-con`;

    try {
      const { data, error } = await this.authService.requestPasswordReset(email, redirectToUrl);

      if (error) {
        this.presentAlert('Error', `No se pudo enviar el correo de restablecimiento: ${error.message}`);
      } else {
        this.presentAlert(
          'Correo Enviado',
          'Si tu correo está registrado, recibirás un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y spam.'
        );
        this.router.navigateByUrl('/login'); // O a una página de confirmación
      }
    } catch (e: any) {
      this.presentAlert('Error', 'Ocurrió un error inesperado. Inténtalo de nuevo.');
    } finally {
      this.isLoading = false;
      await loading.dismiss();
    }
  }

}
