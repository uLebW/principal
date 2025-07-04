import { Producto } from "./producto";

export interface ItemPedido{
    id_item_pedido?: string,
    id_producto: string,
    cantidad: number,
    precio_unitario: number,
    producto?: Producto
}