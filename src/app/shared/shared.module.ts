import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserOptionComponent } from './components/user-option/user-option.component';
import { IonicModule } from '@ionic/angular';
import { CartaDirecionComponent } from './components/carta-direcion/carta-direcion.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FiltrosComponent } from './filtros/filtros.component';

@NgModule({
  declarations: [UserOptionComponent,CartaDirecionComponent,FiltrosComponent],
  exports:[UserOptionComponent,CartaDirecionComponent, FiltrosComponent],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
