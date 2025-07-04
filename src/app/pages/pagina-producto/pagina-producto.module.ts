import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaginaProductoPageRoutingModule } from './pagina-producto-routing.module';

import { PaginaProductoPage } from './pagina-producto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaginaProductoPageRoutingModule
  ],
  declarations: [PaginaProductoPage]
})
export class PaginaProductoPageModule {}
