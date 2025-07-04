import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CompletarPerfilPageRoutingModule } from './completar-perfil-routing.module';

import { CompletarPerfilPage } from './completar-perfil.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    CompletarPerfilPageRoutingModule
  ],
  declarations: [CompletarPerfilPage]
})
export class CompletarPerfilPageModule {}
