import { Producto } from "./producto";

export interface ItemCarrito{
    id_item?: string,
    id_producto: string,
    cantidad: number,
    precio_unitario: number,
    producto?: Producto
}