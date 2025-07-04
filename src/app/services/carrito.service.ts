import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { Carrito } from 'src/interfaces/carrito';
import { ItemCarrito } from 'src/interfaces/itemCarrito';
import { Producto } from 'src/interfaces/producto';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private supabase: SupabaseClient

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }


  async getOrCreateCart(): Promise<{ Carrito: Carrito | null; error: any }> {
    const user = await this.supabase.auth.getUser();
    if (!user.data.user) {
      return { Carrito: null, error: { message: 'Usuario no valido' } }
    }

    const userId = user.data.user.id;

    let { data: Carrito, error: selectError } = await this.supabase
      .from('carritos').select('*').eq('id_usuario', userId)
      .maybeSingle();

    if (selectError) {
      console.error('Error al buscar carrito:', selectError.message);
      return { Carrito: null, error: selectError };
    }

    // Si no hay carrito, crearlo
    if (!Carrito) {
      const { data: newCarrito, error: insertError } = await this.supabase
        .from('carritos')
        .insert({ id_usuario: userId })
        .select('*')
        .single();

      if (insertError) {
        console.error('Error al crear Carrito:', insertError.message);
        return { Carrito: null, error: insertError };
      }
      Carrito = newCarrito;
    }
    return { Carrito: Carrito as Carrito, error: null };
  }

  // CODIGO PARA OBTENER LOS ITEMS DEL CARRITO ACTUAL
  async getCarritoItems(): Promise<{ items: ItemCarrito[] | null; error: any }> {
    const { Carrito, error: cartError } = await this.getOrCreateCart();

    if (cartError || !Carrito) {
      return { items: null, error: cartError || { message: 'No se obtuvo el carrito' } }
    }

    //Hacemos una union para conseguir los detalles del prodcuto
    const { data: items, error } = await this.supabase
      .from('items_carrito')
      .select(`*, productos (id, nombre, imagen_url, precio)`)
      .eq('id_carrito', Carrito.id_carrito);

    if (error) {
      return { items: null, error };
    }

    const mapeado: ItemCarrito[] = items.map((item:any)=>({
      ...item,
      producto:{
        id: item.productos.id,
        nombre: item.productos.nombre,
        imagen_url: item.productos.imagen_url,
        precio: item.productos.precio
      }as Producto
    }));

    return {items: mapeado, error:null};
  }

  //FUNCION PARA AÑADIR AL CARRITO
  async addToCarrito(prodcutoId: string, cantidad: number =1): Promise<{data: ItemCarrito | null; error: any}>{
    const { Carrito , error: cartError} = await this.getOrCreateCart();
    if(cartError ||!Carrito){
      return {data: null, error: cartError || {message: 'No se pudo obtener el carrito'}}
    }

    const {data: producto, error: producError} = await this.supabase
    .from('productos').select('precio')
    .eq('id',prodcutoId).single();

    if(producError || !producto){
       return { data: null, error: producError || {message: 'Producto inexistente'}}
    }

    // Busacr el item en el carrito
    const { data: itemExist, error: fecthError} = await this.supabase
    .from('items_carrito').select('*')
    .eq('id_carrito', Carrito.id_carrito)
    .eq('id_producto', prodcutoId)
    .maybeSingle();

    if(fecthError){
      return {data: null, error: fecthError};
    }

    let resultado;
     if (itemExist) {
  console.log('Actualizando ítem existente. ID:', itemExist.id_item, 'Nueva cantidad:', itemExist.cantidad + cantidad);
  resultado = await this.supabase
    .from('items_carrito')
    .update({ cantidad: itemExist.cantidad + cantidad })
    .eq('id_item', itemExist.id_item)
    .select('*')
    .single();
} else {
  console.log('Insertando nuevo ítem. ID Carrito:', Carrito.id_carrito, 'ID Producto:', prodcutoId, 'Cantidad:', cantidad, 'Precio:', producto.precio);
  resultado = await this.supabase
    .from('items_carrito')
    .insert({
      id_carrito: Carrito.id_carrito,
      id_producto: prodcutoId,
      cantidad: cantidad, // El valor de 'cantidad' que se va a insertar
      precio_unitario: producto.precio
    })
    .select('*')
    .single();
}

    if(resultado.error){
      console.error('Error al añadir o actualizar Carrito', resultado.error.message);
    }
    return {data: resultado.data as ItemCarrito, error: resultado.error};
  }

  //acuralizar la cantidad del carrito de un item seleccionado
   async updateItemQuantity(itemId: string, newCantidad: number): Promise<{ data: ItemCarrito | null; error: any }> {
    if (newCantidad <= 0) {
      const {success, error: removerError} = await this.removeFromCart(itemId);
      if(removerError){
        return {data: null, error: removerError}
      }
      return {data:null, error:null}; // Si la cantidad es 0 o menos, remover
    }

    const { data, error } = await this.supabase
      .from('items_carrito')
      .update({ cantidad: newCantidad })
      .eq('id_item', itemId)
      .select('*')
      .single();

    if (error) {
      console.error('Error al actualizar cantidad del ítem:', error.message);
    }
    return { data: data as ItemCarrito, error };
  }

  //Elimnar item de carrito
   async removeFromCart(itemId: string): Promise<{ success: boolean; error: any }> {
    const { error } = await this.supabase
      .from('items_carrito')
      .delete()
      .eq('id_item', itemId);

    if (error) {
      console.error('Error al eliminar ítem del carrito:', error.message);
      return { success: false, error };
    }
    return { success: true, error: null };
  }

  //Vaciar carrito
  async limparCart(): Promise<{success: boolean; error: any}>{
    const {Carrito , error: cartError} = await this.getOrCreateCart();
    if(cartError || !Carrito){
      return {success:false , error: cartError  || { message: 'No se obtuvo o no existe un carrito'}}
    }

    const {error} = await this.supabase.from('items_carrito')
    .delete().eq('id_carrito', Carrito.id_carrito);
    if(error){
      return {success: false, error};
    }
    return{ success: true, error: null};
  }


  //FUNCIONES PARA EL PEDID

  //CREAR UN NUEVO PEDIDO
  async checkout(direccion: string): Promise<{ pedidoId: string | null; error: any }> {
    const { Carrito, error: cartError } = await this.getOrCreateCart();
    if (cartError || !Carrito) {
      return { pedidoId: null, error: cartError || { message: 'No se pudo obtener el Carrito.' } };
    }

    const { items, error: itemsError } = await this.getCarritoItems();
    if (itemsError || !items || items.length === 0) {
      return { pedidoId: null, error: itemsError || { message: 'El Carrito está vacío.' } };
    }

    const total = items.reduce((sum, item) => sum + (item.cantidad * item.precio_unitario), 0);
    const userId = Carrito.id_usuario;

    // 1. Crear el Pedido
    const { data: newPedido, error: pedidoError } = await this.supabase
      .from('pedidos')
      .insert({
        id_usuario: userId,
        total: total,
        direccion: direccion
      })
      .select('id_pedido')
      .single();

    if (pedidoError || !newPedido) {
      console.error('Error al crear el pedido:', pedidoError?.message);
      return { pedidoId: null, error: pedidoError };
    }

    const pedidoId = newPedido.id_pedido;

    // 2. Mover los ítems del Carrito a ítems_pedido
    const itemsToInsert = items.map(item => ({
      id_pedido: pedidoId,
      id_producto: item.id_producto,
      cantidad: item.cantidad,
      precio_unitario: item.precio_unitario
    }));

    const { error: itemsPedidoError } = await this.supabase
      .from('items_pedido')
      .insert(itemsToInsert);

    if (itemsPedidoError) {
      console.error('Error al insertar ítems del pedido:', itemsPedidoError.message);
      return { pedidoId: null, error: itemsPedidoError };
    }

    // 3. Vaciar el Carrito
    await this.limparCart();

    return { pedidoId: pedidoId, error: null };
  }

}