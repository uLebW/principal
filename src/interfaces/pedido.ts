import { ItemPedido } from "./itemPedido"

export interface Pedido{
    id_pedido?: string,
    id_usuario: string,
    fecha_pedido?: string,
    total: number,
    direccion: string,
    items_pedido?: ItemPedido[]
}