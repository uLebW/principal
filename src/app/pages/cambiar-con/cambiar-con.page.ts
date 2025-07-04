import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-cambiar-con',
  templateUrl: './cambiar-con.page.html',
  styleUrls: ['./cambiar-con.page.scss'],
  standalone:false
})
export class CambiarConPage implements OnInit {
 updatePasswordForm: FormGroup;
  isLoading: boolean = false;
  isPasswordVisible: boolean = false; // Para alternar visibilidad de la contraseña

  constructor(
    private fb: FormBuilder,
    private authService: SupabaseService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController,
    private router: Router
  ) {
    this.updatePasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() {
    // Supabase maneja la autenticación temporal al llegar a esta página vía el enlace de correo.
    // No necesitamos obtener tokens o sesiones aquí, simplemente actualizamos el usuario actual.
  }

  // Custom validator para verificar que las contraseñas coinciden
  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  async onUpdatePassword() {
    if (this.updatePasswordForm.invalid) {
      this.presentToast('Por favor, corrige los errores en el formulario.', 'danger');
      return;
    }

    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Actualizando contraseña...',
      spinner: 'crescent'
    });
    await loading.present();

    const newPassword = this.updatePasswordForm.value.newPassword;

    try {
      const { data, error } = await this.authService.updatePassword(newPassword);

      if (error) {
        console.error('Error al actualizar contraseña:', error.message);
        this.presentAlert('Error', `No se pudo actualizar tu contraseña: ${error.message}`);
      } else {
        this.presentAlert(
          'Contraseña Actualizada',
          'Tu contraseña ha sido cambiada exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña.'
        );
        this.router.navigateByUrl('/login'); // Redirige a la página de inicio de sesión
      }
    } catch (e: any) {
      console.error('Error inesperado al actualizar contraseña:', e);
      this.presentAlert('Error', 'Ocurrió un error inesperado. Inténtalo de nuevo.');
    } finally {
      this.isLoading = false;
      await loading.dismiss();
    }
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
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

}
