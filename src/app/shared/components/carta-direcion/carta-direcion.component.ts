import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Direccion } from 'src/interfaces/dirrecionUs';

@Component({
  selector: 'app-carta-direcion',
  templateUrl: './carta-direcion.component.html',
  styleUrls: ['./carta-direcion.component.scss'],
  standalone:false
})
export class CartaDirecionComponent  implements OnInit {

  @Input() address!: Direccion;
  @Output() editar = new EventEmitter<Direccion>();
  @Output() elimianr = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {}

  clickEditar(){
    this.editar.emit(this.address);
  }

  clickEliminar(){
    if(this.address.id){
      this.elimianr.emit(this.address.id);
    }
  }
}
