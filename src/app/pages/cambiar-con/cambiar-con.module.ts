import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CambiarConPageRoutingModule } from './cambiar-con-routing.module';

import { CambiarConPage } from './cambiar-con.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CambiarConPageRoutingModule
  ],
  declarations: [CambiarConPage]
})
export class CambiarConPageModule {}
