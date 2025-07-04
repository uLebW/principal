import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActualizarContraPageRoutingModule } from './actualizar-contra-routing.module';

import { ActualizarContraPage } from './actualizar-contra.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ActualizarContraPageRoutingModule
  ],
  declarations: [ActualizarContraPage]
})
export class ActualizarContraPageModule {}
