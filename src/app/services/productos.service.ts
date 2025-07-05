import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { Producto } from 'src/interfaces/producto';
import { Categoria } from 'src/interfaces/categoria';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
   }


   async getProductos(searchTerm: string = '', categoryId: number | null = null): Promise<{ data: Producto[] | null, error: any }> {
    try {
      let query = this.supabase.from('productos').select('*');

    
      if (searchTerm) {
        query = query.ilike('nombre', `%${searchTerm}%`); 
      }

      
      if (categoryId !== null) {
        query = query.eq('idCategoria', categoryId); 
      }

      const { data, error } = await query;

      return { data: data as Producto[], error };
    } catch (error) {
      return { data: null, error }; 
    }
  }
  // Funcio para conseguir las categotias

  async getCategorias(): Promise<{ data: Categoria[] | null, error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('categorias') 
        .select('id, nombre'); 

      return { data: data as Categoria[], error };
    } catch (error) {
      return { data: null, error };
    }
  }

   async getProductoById(id: string): Promise<{ data: Producto | null; error: any }> {
    const { data, error } = await this.supabase
      .from('productos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }
    return { data: data as Producto, error };
  }
}
