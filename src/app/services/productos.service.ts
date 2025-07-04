import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { Producto } from 'src/interfaces/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
   }


   async getProductos(): Promise<{ data: Producto[] | null; error: any}>{
    const {data, error} = await this.supabase.from('productos').select('*');

    if (error){
      console.error('Error al obtener productos')
    }
    return{data:data as Producto[], error};
   }

   async getProductoById(id: string): Promise<{ data: Producto | null; error: any }> {
    const { data, error } = await this.supabase
      .from('productos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error al obtener el producto con ID ${id}:`, error.message);
    }
    return { data: data as Producto, error };
  }
}
