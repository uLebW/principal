import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/services/supabase.service';
import { Perfil } from 'src/interfaces/perfilUs';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { Direccion } from 'src/interfaces/dirrecionUs';
import { ServPefilService } from 'src/app/services/serv-pefil.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone:false
})
export class PerfilPage implements OnInit {

   profileForm: FormGroup; // Usaremos FormGroup para el perfil
  addresses: Direccion[] = [];
  mostrarDireccForm: boolean = false;
  actualDirec: Direccion = {
    calle: '', estado: '', numExt: '', colonia: '', ciudad: '', codPostal: '',
    numInt: ''
  };

  // Variable para almacenar la URL pública del avatar o un placeholder
  avatarUrl: string = 'https://placehold.co/120x120/aec9f5/000?text=Avatar'; // Placeholder inicial

  constructor(
    private fb: FormBuilder, // Inyectar FormBuilder
    private servPerfilService: ServPefilService,
    private alertController: AlertController, // Inyectar AlertController
    private loadingController: LoadingController // Inyectar LoadingController
  ) {
    // Inicializar el formulario del perfil
    this.profileForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      telefono: [''],
      // El avatar se manejará por separado y su URL se actualizará aquí
    });
  }

  ngOnInit() {
    this.loadProfileData();
  }

  async loadProfileData() {
    const loading = await this.loadingController.create({
      message: 'Cargando perfil...',
    });
    await loading.present();

    try {
      // Cargar perfil
      const perfil = await this.servPerfilService.getProfile();
      if (perfil) {
        this.profileForm.patchValue({
          nombre: perfil.nombre || '',
          apellido: perfil.apellido || '',
          telefono: perfil.telefono || ''
        });
        if (perfil.avatar_url) {
          this.avatarUrl = this.servPerfilService.getPublicUrl(perfil.avatar_url);
        }
      }

      // Cargar direcciones
      const { data: direcciones, error: dirError } = await this.servPerfilService.conseguirDrecc();
      if (dirError) {
        console.error('Error al cargar direcciones:', dirError.message);
        this.presentAlert('Error', 'No se pudieron cargar las direcciones.');
      } else if (direcciones) {
        this.addresses = direcciones;
      }

    } catch (error: any) {
      console.error('Error al cargar datos del perfil:', error.message);
      this.presentAlert('Error', `Ocurrió un error al cargar tu perfil: ${error.message}`);
    } finally {
      await loading.dismiss();
    }
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
    const file = input.files[0];

    const loading = await this.loadingController.create({
      message: 'Subiendo avatar...',
    });
    await loading.present();

    try {
      const filePath = await this.servPerfilService.uploadAvatar(file);
      const publicUrl = this.servPerfilService.getPublicUrl(filePath);

      this.avatarUrl = publicUrl; // Actualiza la imagen en el HTML

      // Actualiza la URL del avatar en el perfil en Supabase
      await this.servPerfilService.actualizarPerfil({ avatar_url: filePath });

      this.presentAlert('Éxito', 'Avatar actualizado correctamente.');
    } catch (error: any) {
      console.error('Error al subir o actualizar avatar:', error.message);
      this.presentAlert('Error', `No se pudo subir el avatar: ${error.message}`);
    } finally {
      await loading.dismiss();
    }
  }

  async saveProfile() {
    if (this.profileForm.invalid) {
      this.presentAlert('Campos incompletos', 'Por favor, completa todos los campos requeridos del perfil.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Guardando cambios...',
    });
    await loading.present();

    try {
      await this.servPerfilService.actualizarPerfil(this.profileForm.value);
      this.presentAlert('Éxito', 'Perfil actualizado correctamente.');
    } catch (error: any) {
      console.error('Error al guardar el perfil:', error.message);
      this.presentAlert('Error', `No se pudieron guardar los cambios: ${error.message}`);
    } finally {
      await loading.dismiss();
    }
  }

  agregarDirec() {
    this.mostrarDireccForm = true;
    this.actualDirec = {
      calle: '', estado: '', numExt: '', colonia: '', ciudad: '', codPostal: ''
      , numInt:''
    }; // Limpiar el formulario
  }

  async guaradrDirec() {
    // Validaciones básicas para la dirección
    if (!this.actualDirec.calle || !this.actualDirec.estado || !this.actualDirec.numExt || !this.actualDirec.colonia || !this.actualDirec.ciudad || !this.actualDirec.codPostal) {
      this.presentAlert('Campos incompletos', 'Por favor, rellena todos los campos de la dirección.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Guardando dirección...',
    });
    await loading.present();

    try {
      if (this.actualDirec.id) {
        // Actualizar dirección existente
        await this.servPerfilService.updateAddress(this.actualDirec);
        this.presentAlert('Éxito', 'Dirección actualizada correctamente.');
      } else {
        // Añadir nueva dirección
        await this.servPerfilService.addAddress(this.actualDirec);
        this.presentAlert('Éxito', 'Dirección añadida correctamente.');
      }
      this.mostrarDireccForm = false;
      await this.loadProfileData(); // Recargar todas las direcciones
    } catch (error: any) {
      console.error('Error al guardar dirección:', error.message);
      this.presentAlert('Error', `No se pudo guardar la dirección: ${error.message}`);
    } finally {
      await loading.dismiss();
    }
  }

  editarDirec(address: Direccion) {
    this.mostrarDireccForm = true;
    this.actualDirec = { ...address }; // Copiar la dirección para editar
  }

  async eliminarDirec(id: string | undefined) {
    if (!id) {
      this.presentAlert('Error', 'ID de dirección no válido para eliminar.');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de que quieres eliminar esta dirección?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Eliminando dirección...',
            });
            await loading.present();
            try {
              await this.servPerfilService.deleteAddress(id);
              this.presentAlert('Éxito', 'Dirección eliminada correctamente.');
              await this.loadProfileData(); // Recargar direcciones
            } catch (error: any) {
              console.error('Error al eliminar dirección:', error.message);
              this.presentAlert('Error', `No se pudo eliminar la dirección: ${error.message}`);
            } finally {
              await loading.dismiss();
            }
          }
        }
      ]
    });
    await alert.present();
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
