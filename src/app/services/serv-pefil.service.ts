import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { Direccion } from 'src/interfaces/dirrecionUs';
import { Perfil } from 'src/interfaces/perfilUs';

@Injectable({
  providedIn: 'root'
})
export class ServPefilService {
    private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // Helper para obtener el ID del usuario actual
  private async getUserId(): Promise<string | null> {
    const { data: { user } } = await this.supabase.auth.getUser();
    return user?.id || null;
  }

  // ==========================================================
  // MÉTODOS PARA EL PERFIL
  // ==========================================================

  /**
   * Obtiene el perfil del usuario actual.
  */
  async getProfile(): Promise<Perfil | null> {
    const userId = await this.getUserId();
    if (!userId) {
      console.warn('No hay usuario autenticado para obtener el perfil.');
      return null;
    }

    const { data, error } = await this.supabase
      .from('profiles') 
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 es "no rows found"
      throw error;
    }
    return data as Perfil; // Retorna null si no se encuentra (PGRST116)
  }

  /**
   * Actualiza el perfil del usuario actual.
   */
  async actualizarPerfil(perfilData: Omit<Perfil, 'id' | 'correo'>): Promise<Perfil | null> {
    const userId = await this.getUserId();
    if (!userId) {
      console.warn('No hay usuario autenticado para actualizar el perfil.');
      return null;
    }

    // Obtener el email del usuario de auth para guardarlo en el perfil
    const { data: { user } } = await this.supabase.auth.getUser();
    const userEmail = user?.email || null;

    const { data, error } = await this.supabase
      .from('profiles')
      .upsert({
        id: userId,
        correo: userEmail, 
        ...perfilData
      }, { onConflict: 'id' }) // Si ya existe un perfil con ese ID, actualízalo
      .select() // Para obtener el registro actualizado
      .single();

    if (error) {
      throw error;
    }
    return data as Perfil;
  }


  // MÉTODOS PARA GESTIÓN DE AVATAR (Supabase Storage)


  /**
   * Sube un archivo de avatar a Supabase Storage.
   */
  async uploadAvatar(file: File): Promise<string> {
    const userId = await this.getUserId();
    if (!userId) {
      throw new Error('No hay usuario autenticado para subir el avatar.');
    }

    const fileExtension = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExtension}`; // Nombre único
    const filePath = `${userId}/${fileName}`; // Carpeta por usuario

    const { data, error } = await this.supabase.storage
      .from('avatars') 
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true // Sobrescribe si el archivo ya existe (útil para el mismo nombre)
      });

    if (error) {
      throw error;
    }
    return data.path; // Retorna el path dentro del bucket, e.g., "usuario_id/imagen.png"
  }

  /**
   * Obtiene la URL pública de un archivo de avatar.
   */
  getPublicUrl(path: string): string | null {
    if (!path) return null;
    const { data } = this.supabase.storage
      .from('avatars')
      .getPublicUrl(path);
    return data.publicUrl;
  }

  // ==========================================================
  // MÉTODOS PARA DIRECCIONES
  // ==========================================================

  /**
   * Obtiene todas las direcciones del usuario actual..
   */
  async conseguirDrecc(): Promise<{ data: Direccion[] | null; error: any }> {
    const userId = await this.getUserId();
    if (!userId) {
      console.warn('No hay usuario autenticado para obtener direcciones.');
      return { data: null, error: new Error('Usuario no autenticado') };
    }

    const { data, error } = await this.supabase
      .from('direcciones')
      .select('*')
      .eq('user_id', userId); // Filtrar por el ID del usuario

    return { data: data as Direccion[], error };
  }

  /**
   * Añade una nueva dirección para el usuario actual.
   */
  async addAddress(direccion: Direccion): Promise<{ data: Direccion[] | null; error: any }> {
    const userId = await this.getUserId();
    if (!userId) {
      throw new Error('Usuario no autenticado para añadir dirección.');
    }

    const { data, error } = await this.supabase
      .from('direcciones')
      .insert({ ...direccion, user_id: userId }) // Asigna el user_id
      .select(); // Para obtener el registro insertado

    if (error) {
      throw error;
    }
    return { data: data as Direccion[], error };
  }

  /**
   * Actualiza una dirección existente.
   */
  async updateAddress(direccion: Direccion): Promise<{ data: Direccion[] | null; error: any }> {
    const userId = await this.getUserId();
    if (!userId) {
      throw new Error('Usuario no autenticado para actualizar dirección.');
    }
    if (!direccion.id) {
      throw new Error('ID de dirección requerido para la actualización.');
    }

    const { data, error } = await this.supabase
      .from('direcciones')
      .update(direccion)
      .eq('id', direccion.id)
      .eq('user_id', userId)
      .select();

    if (error) {
     throw error.message;
    }
    return { data: data as Direccion[], error };
  }

  /**
   * Elimina una dirección por su ID.
   */
  async deleteAddress(id: string): Promise<{ data: Direccion[] | null; error: any }> {
    const userId = await this.getUserId();
    if (!userId) {
      throw new Error('Usuario no autenticado para eliminar dirección.');
    }

    const { data, error } = await this.supabase
      .from('direcciones')
      .delete()
      .eq('id', id)
      .eq('user_id', userId); 

    if (error) {
      throw error;
    }
    return { data, error };
  }
}
