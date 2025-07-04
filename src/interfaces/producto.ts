export interface Producto{
    id?: string,
    nombre: string,
    precio: number,
    descripcion: string,
    stock: number,
    imagen_url:string,
    idCategoria: number,
    calificacion: number
}