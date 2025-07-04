import { Injectable } from '@angular/core';
import { Pedido } from 'src/interfaces/pedido';
import { ItemPedido } from 'src/interfaces/itemPedido';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  private supabase : SupabaseClient;
  constructor() { 
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

   async getPedidosDelUsuario(): Promise<{ data: Pedido[] | null; error: any }> {
    const { data: user, error: userError } = await this.supabase.auth.getUser();

    if (userError || !user?.user) {
      console.error('Error al obtener usuario autenticado:', userError);
      return { data: null, error: userError || new Error('Usuario no autenticado.') };
    }

    const userId = user.user.id;

    // Obtener pedidos del usuario
    const { data: pedidos, error: pedidosError } = await this.supabase
      .from('pedidos')
      .select(`
        *,
        items_pedido (
          id_item_pedido,
          cantidad,
          precio_unitario,
          productos (
            id,
            nombre,
            imagen_url
          )
        )
      `)
      .eq('id_usuario', userId)
      .order('fecha_pedido', { ascending: false }); // Ordenar por fecha, los más recientes primero

    if (pedidosError) {
      console.error('Error al obtener los pedidos:', pedidosError);
      return { data: null, error: pedidosError };
    }

    // Mapear los datos para asegurar que los productos estén directamente anidados si es necesario
    const formattedPedidos: Pedido[] = pedidos.map((pedido: any) => ({
      ...pedido,
      items_pedido: pedido.items_pedido.map((item: any) => ({
        ...item,
        producto: item.productos // Renombrar 'productos' a 'producto' para que coincida con la interfaz ItemPedido
      }))
    }));

    return { data: formattedPedidos as Pedido[], error: null };
  }
}
