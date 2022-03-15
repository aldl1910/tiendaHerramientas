import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    public afAuth: AngularFireAuth
  ){}

  // MÉTODO PARA REGISTRAR A LOS USUARIOS
  doRegister(value){
    return new Promise<any>((resolve, reject) => {
      this.afAuth.createUserWithEmailAndPassword(value.email, value.password)
        .then(
          res => resolve(res),
          err => reject(err))
   })
  }

  // MÉTODO PARA INCIAR SESION CON LOS USUARIOS
  doLogin(value){
    return new Promise<any>((resolve, reject) => {
      this.afAuth.signInWithEmailAndPassword(value.email, value.password)
        .then(
          res => resolve(res),
          err => reject(err))
   })
  }

  // MÉTODO PARA CERRAR SESION
  doLogout(){
    return new Promise((resolve, reject) => {
      this.afAuth.signOut()
        .then(
          res => resolve(res),
          err => reject(err))
    })
  }
}
