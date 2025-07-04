import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaginaProductoPage } from './pagina-producto.page';

const routes: Routes = [
  {
    path: '',
    component: PaginaProductoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaginaProductoPageRoutingModule {}
