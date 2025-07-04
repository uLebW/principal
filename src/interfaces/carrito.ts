import { ItemCarrito } from "./itemCarrito";

export interface Carrito {
    id_carrito?: string,
    id_usuario: string,
    fecha_creacion?: string,
    ultima_actualizacion?: string,
    items?: ItemCarrito[];
}