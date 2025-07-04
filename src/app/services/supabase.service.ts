import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseClient, User, createClient } from '@supabase/supabase-js'
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Perfil } from 'src/interfaces/perfilUs';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  private supabase: SupabaseClient;
  private currentUser: BehaviorSubject<User | boolean> = new BehaviorSubject(null)

  constructor(private router: Router) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)

    this.supabase.auth.onAuthStateChange((event, sess) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        console.log('SET USER')

        this.currentUser.next(sess.user)
      } else if (event === 'SIGNED_OUT') {
        console.log('SET USER - SIGNED OUT')
        this.currentUser.next(false)
        this.router.navigateByUrl('/login', { replaceUrl: true })
      } else {
        console.log('Auth: ', event);
        this.currentUser.next(false)
      }
    })
    this.loadUser()
  }

  async loadUser() {
    if (this.currentUser.value) {
      return
    }

    const user = await this.supabase.auth.getUser()

    if (user.data.user) {
      this.currentUser.next(user.data.user)
    } else {
      this.currentUser.next(false)
    }
  }

  registro(credenciales: { email; password }) {
    return this.supabase.auth.signUp(credenciales)
  }

  inicio(credenciales: { email; password }) {
    return this.supabase.auth.signInWithPassword(credenciales)
  }

  async cerrarSesion() {
    await this.supabase.auth.signOut()
  }

  obtenerUsuario(): Observable<User | boolean> {
    return this.currentUser.asObservable()
  }

  consgID(): string {
    if (this.currentUser.value) {
      return (this.currentUser.value as User).id
    } else {
      return null
    }
  }

  InicarConEmail(email: string) {
    return this.supabase.auth.signInWithOtp({ email })
  }

  //MOMDIFICACIONES PARA EL PERFIL
 

  async guardarPerfil(dataPerf: Omit<Perfil, 'id' | 'correo'>){
    const user = await this.supabase.auth.getUser();

    if(!user.data.user){
      throw new Error('No existe usuario autenticado')
    }

    const userId = user.data.user.id;
    const userEmial = user.data.user.email;

    const {data, error} = await this.supabase
    .from('profiles').upsert({
      id:userId,
      correo:userEmial,
      ...dataPerf
    },{onConflict: 'id'});

    if (error){
      console.error('Error al gurdar el perfil');
      throw error;
    }
    return data
  }


  async obtenerPeril(): Promise<Perfil | null>{
    const user = await this.supabase.auth.getUser();
    if (!user.data.user) {
      return null;
    }

    const userId = user.data.user.id;
    const { data, error } = await this.supabase
      .from('perfiles')
      .select('*')
      .eq('id', userId)
      .single(); // Esperamos solo un resultado

    if (error && error.code !== 'PGRST116') { // PGRST116 es "no rows found"
      console.error('Error al obtener el perfil:', error.message);
      throw error;
    }
    return data;
  }

  //Funciones para el cambio de constraeña

  async requestPasswordReset(email: string, redirectTo: string): Promise<any> {
    const { data, error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo,
    });
    return { data, error };
  }
  async updatePassword(newPassword: string): Promise<any>{
    const {data, error} = await this.supabase.auth.updateUser({password: newPassword});
    return {data,error};
  }

  onAuthChange(callback: (event: string, session: any) => void){
    return this.supabase.auth.onAuthStateChange((event, session)=>{
      callback(event,session);
    })
  }
}

