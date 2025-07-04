import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserOptionComponent } from './components/user-option/user-option.component';
import { IonicModule } from '@ionic/angular';
import { CartaDirecionComponent } from './components/carta-direcion/carta-direcion.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [UserOptionComponent,CartaDirecionComponent],
  exports:[UserOptionComponent,CartaDirecionComponent],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
