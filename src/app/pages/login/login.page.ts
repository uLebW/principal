import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {

  credenciales = this.fb.nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  })

  constructor(
    private fb: FormBuilder,
    private authService: SupabaseService,
    private loaadin: LoadingController,
    private alerta: AlertController,
    private router: Router
  ) {
    this.authService.obtenerUsuario().subscribe((user) => {
      if (user) {
        this.router.navigateByUrl('/home', { replaceUrl: true })
      }
    })
  }

  get email() {
    return this.credenciales.controls.email
  }

  get password() {
    return this.credenciales.controls.password
  }


  async login() {
    const loadin = await this.loaadin.create()
    await loadin.present()

    this.authService.inicio(this.credenciales.getRawValue())
      .then(async (data) => {
        await loadin.dismiss()
        if (data.error) {
          this.showAlert('Fallo en el Login', data.error.message)
        }
      })
  }

  async showAlert(title, msg) {
    const alert = await this.alerta.create({
      header: title,
      message: msg,
      buttons: ['OK'],
    })
    await alert.present()
  }


  async olvidarContr() {
   this.router.navigateByUrl('/actualizar-contra');
  }

  ngOnInit() {
  }

}
