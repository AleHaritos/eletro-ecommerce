import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/auth'
import { Usuario } from '../interfaces/interface';
import { Observable, catchError, map, retry } from 'rxjs';
import { Util } from '../util';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private util: Util
  ) { }

  tokenId: string | null = null
  admin!: boolean

  signUpBackend(usuario: Usuario): Observable<Usuario> {
    return this.http.post(`${this.util.backUrl()}/usuario`, usuario)
      .pipe(
        map((res: any) => res),
        catchError((e: any) => this.util.errorHandler(e))
      )
  }

  signInBackend(usuario: Usuario): Observable<any> {
    return this.http.post(`${this.util.backUrl()}/usuario/login`, usuario)
      .pipe(
        map((res: any) => res),
        catchError((e: any) => this.util.errorHandler(e))
      )
  }

  signOut(): void {
    const auth = firebase.getAuth();

    firebase.signOut(auth)
      .then((res: any) => {
        this.tokenId = null
        localStorage.removeItem('token')
        localStorage.removeItem('canActivate')
        window.location.reload()
      })
  }

  signInFirebase(usuario: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const auth = firebase.getAuth()

      firebase.signInWithEmailAndPassword(auth, usuario.email, usuario.senha)
        .then((res: any) => {

          firebase.onAuthStateChanged(auth, user => {
            if (user) {
              user.getIdToken()
                .then(token => {
                  this.tokenId = token
                  localStorage.setItem('token', token)
                  resolve(true)
                })

            }
          })

        })
    })

  }

  signUpFirebase(usuario: Usuario): void {
    const auth = firebase.getAuth()

    //Registrar no firebase o usuario
    firebase.createUserWithEmailAndPassword(auth, usuario.email, usuario.senha)
      .then((res: any) => {

        //Logar após o registro
        firebase.signInWithEmailAndPassword(auth, usuario.email, usuario.senha)
          .then((res: any) => {

            //Pegar TokenID
            firebase.onAuthStateChanged(auth, user => {
              if (user) {
                user.getIdToken()
                  .then(token => {
                    this.tokenId = token
                    localStorage.setItem('token', token)
                    setTimeout(() => window.location.reload(), 500)
                  })
              }
            })
          })
      })
  }

  verificarAdmin(): Promise<any> {
    return new Promise((resolve, reject) => {
      const auth = firebase.getAuth()
      firebase.onAuthStateChanged(auth, user => {
        if (user) {
          this.http.post(`${this.util.backUrl()}/usuario/admin`, { email: user.email })
            .pipe(
              map((res: any) => res)
            )
            .subscribe((res: any) => {
              this.admin = res.admin
              localStorage.setItem('canActivate', res.admin)
              resolve(res)
            })
        }
      })
    })
  }

   canActivate(): boolean {
      //CanActivate para ADM
      if(this.tokenId === null && localStorage.getItem('token') !== null) {
        this.tokenId = localStorage.getItem('token')
      }
     
      this.admin = localStorage.getItem('canActivate') === 'true'? this.admin = true : this.admin = false

      if(this.tokenId === null || localStorage.getItem('token') === null || this.admin !== true) {
        this.router.navigate(['/'])
      }
      
      return this.tokenId !== null && this.admin === true
    }

}
