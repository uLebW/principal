import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosService } from 'src/app/services/productos.service';
import { PopoverController } from '@ionic/angular';
import { Categoria } from 'src/interfaces/categoria';
import { IonItem } from "@ionic/angular/standalone";

@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.component.html',
  styleUrls: ['./filtros.component.scss'],
  standalone:false
})
export class FiltrosComponent  implements OnInit {

    @Input() selectedCategoryId: number | null = null;
  categories: Categoria[] = [];

  constructor(
    private popoverController: PopoverController,
    private servProd: ProductosService 
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  async loadCategories() {
    try {
      const { data, error } = await this.servProd.getCategorias();

      if (error) {
        console.error('Error al cargar categorías:', error);
     
      } else if (data) {
        this.categories = data;
      }
    } catch (error) {
      console.error('Ocurrió un error inesperado al cargar categorías:', error);
    }
  }

  selectCategory(categoryId: number | null) {
    this.popoverController.dismiss({
      categoryId: categoryId
    });
  }
}
