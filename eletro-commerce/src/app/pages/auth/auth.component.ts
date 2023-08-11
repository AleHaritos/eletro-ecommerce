import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/interface';
import { AuthService } from 'src/app/services/auth.service';
import { Util } from 'src/app/util';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(
    private activedRoute: ActivatedRoute,
    private util: Util,
    private router: Router,
    private authService: AuthService
  ) { }

    type: boolean = true

   formsLogin: FormGroup = new FormGroup({
    email: new FormControl(null, [ Validators.email, Validators.required]),
    senha: new FormControl(null, [ Validators.required ]),
   })

   formRegister: FormGroup = new FormGroup({
    nome: new FormControl('', [Validators.required]),
    email: new FormControl(null, [ Validators.email, Validators.required]),
    senha: new FormControl(null, [ Validators.required ]),
    senha2: new FormControl(null, [ Validators.required ]),
    telefone: new FormControl(null, [ Validators.required, Validators.pattern("[9]{1}[0-9]{4,5}-[0-9]{4}$") ]),
   })

   togglePassword: boolean = false
   typeInput: string = this.togglePassword ? 'text' : 'password'


  ngOnInit(): void {
    this.activedRoute.params.subscribe((res: any) => {
      this.type = res.type == 'login' ? true : false
    })
  }


  toggleInputPassword() {
    this.togglePassword = !this.togglePassword
    this.typeInput = this.togglePassword ? 'text' : 'password'
  }


  submit(): void {
    if (this.type == true) {
      if(this.formsLogin.valid) {
        let user: Usuario = {email: this.formsLogin.get('email')?.value, senha: this.formsLogin.get('senha')?.value, nome: '' }
        this.authService.signInBackend(user).subscribe((res) => {
          if (res) {    
            this.authService.signInFirebase(user)
              .then(res => {
                if (res == true) {
                  setTimeout(() => window.location.reload(), 500)
                  this.util.snackBar('Login efetuado com sucesso', 1)
                  this.router.navigate(['/'])
                  localStorage.removeItem('cart')
                }
              })
          } else {    
              this.util.snackBar('Erro no login!', 3)    
          }
        })
      }
    } else {
      if (this.formRegister.valid) {
        let user: Usuario = {
          email: this.formRegister.get('email')?.value,
          senha: this.formRegister.get('senha')?.value,
          nome: this.formRegister.get('nome')?.value,
          telefone: this.formRegister.get('telefone')?.value,
          admin: false
        }
        if (this.formRegister.get('senha')?.value != this.formRegister.get('senha2')?.value) {
          this.util.snackBar('As senhas não conferem! Por favor verificar', 3)
          return;
        }
        this.authService.signUpBackend(user).subscribe(() => {
          this.authService.signUpFirebase(user)
          this.util.snackBar('Cadastrado com Sucesso!', 1)
          localStorage.removeItem('cart')
          this.router.navigate(['/'])
        })
      }
    }
  }
}
