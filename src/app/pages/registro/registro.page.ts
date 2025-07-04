import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone:false
})
export class RegistroPage implements OnInit {

  registerForm!: FormGroup; // Usamos "!" para indicar que se inicializará en ngOnInit

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private alertController: AlertController,
    private supabaseService: SupabaseService
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async register() {
    if (this.registerForm.valid) {
      const { email, password } = this.registerForm.value;

      try {
        const { data, error } = await this.supabaseService.registro({ email, password });

        if (error) {
          // Error de registro de Supabase
          console.error('Error al registrar usuario:', error.message);
          const alert = await this.alertController.create({
            header: 'Error en el Registro',
            message: error.message || 'Hubo un problema al crear tu cuenta. Inténtalo de nuevo.',
            buttons: ['Ok'],
          });
          await alert.present();
        } else {
          // Registro exitoso
          console.log('Usuario registrado exitosamente:', data);
          const alert = await this.alertController.create({
            header: '¡Registro Exitoso!',
            message: 'Tu cuenta ha sido creada. Por favor, revisa tu correo electrónico para verificarla antes de iniciar sesión.', //Mensaje de verificación
            buttons: [
              {
                text: 'Ok',
                handler: () => {
                  this.router.navigateByUrl('/home', { replaceUrl: true }); // Enviar al login
                },
              },
            ],
          });
          await alert.present();
        }
      } catch (e) {
        // Manejo para cualquier otro error
        console.error('Error inesperado durante el registro:', e);
        const alert = await this.alertController.create({
          header: 'Error Inesperado',
          message: 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.',
          buttons: ['Ok'],
        });
        await alert.present();
      }

    } else {
      this.registerForm.markAllAsTouched();
      const alert = await this.alertController.create({
        header: 'Error de Formulario',
        message: 'Por favor, completa todos los campos requeridos y corrige los errores.',
        buttons: ['Ok'],
      });
      await alert.present();
    }
  }

  async PaosUnoRegistro(){
    if(this.registerForm.valid){
      const {email, password} = this.registerForm.value;
       const { data, error } = await this.supabaseService.registro({ email, password });

       try {
       

        if (error) {
          // Error de registro de Supabase
          console.error('Error al registrar usuario:', error.message);
          const alert = await this.alertController.create({
            header: 'Error en el Registro',
            message: error.message || 'Hubo un problema al crear tu cuenta. Inténtalo de nuevo.',
            buttons: ['Ok'],
          });
          await alert.present();
        } else {
          // Registro exitoso
          const alert = await this.alertController.create({
            header: '¡Registro Exitoso!',
            message: 'Por favor, revisa tu correo electrónico para verificarla antes de iniciar sesión. Tambien completa la información de tu perfil', //Mensaje de verificación
            buttons: [
              {
                text: 'Ok',
                handler: () => {
                  this.router.navigateByUrl('/completar-perfil', { replaceUrl: true }); // Enviar al login
                },
              },
            ],
          });
          await alert.present();
        }
      } catch (e) {
        // Manejo para cualquier otro error
        console.error('Error inesperado durante el registro:', e);
        const alert = await this.alertController.create({
          header: 'Error Inesperado',
          message: 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.',
          buttons: ['Ok'],
        });
        await alert.present();
      }

    } else {
      this.registerForm.markAllAsTouched();
      const alert = await this.alertController.create({
        header: 'Error de Formulario',
        message: 'Por favor, completa todos los campos requeridos y corrige los errores.',
        buttons: ['Ok'],
      });
      await alert.present();
    }
  }

}
