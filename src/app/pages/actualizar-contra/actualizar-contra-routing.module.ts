import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActualizarContraPage } from './actualizar-contra.page';

const routes: Routes = [
  {
    path: '',
    component: ActualizarContraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActualizarContraPageRoutingModule {}
