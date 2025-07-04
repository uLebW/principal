import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-completar-perfil',
  templateUrl: './completar-perfil.page.html',
  styleUrls: ['./completar-perfil.page.scss'],
  standalone:false
})
export class CompletarPerfilPage implements OnInit {
  FormPerfil: FormGroup;

  constructor(
    private fb: FormBuilder,
    private supa: SupabaseService,
    private router: Router,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.FormPerfil = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      telefono: [''],
      avatar_url: ['']
    });
  }

  async guardar(){
    if(this.FormPerfil.valid){
      try{
        await this.supa.guardarPerfil(this.FormPerfil.value);
        this.router.navigateByUrl('/home', {replaceUrl: true});
      } catch(error){
         const alert = await this.alertController.create({
          header: 'Error Inesperado',
          message: 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.',
          buttons: ['Ok'],
        });
        await alert.present();
      }
    }
  }

}
