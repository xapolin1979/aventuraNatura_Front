import { Component } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login-yregistro',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login-yregistro.component.html',
  styleUrl: './login-yregistro.component.css',
})
export class LoginYregistroComponent {
  logoEmail: string = '@';
  registradoCorrectamente: boolean = false;
   loginIncorrecto:boolean=false;
   alertRegistro:boolean=false;
   modalRegister:boolean=false;




  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    rePassword: new FormControl('', [Validators.required]),
    name: new FormControl('', Validators.required),
    phone: new FormControl('', [Validators.required]),
    aceptarTerminos: new FormControl(false, Validators.requiredTrue),
  });

  loginForm= new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),


  })

  constructor(public AuthService: AuthService, public router: Router) {}

  onSubmitRegister() {
    if (this.registerForm.valid) {
      if (
        this.registerForm.value.password !== this.registerForm.value.rePassword
      ) {
       
        this.registerForm.get('rePassword')?.setErrors({ mismatch: true });

        return;
      }

      const registroData = {
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        name: this.registerForm.value.name,
        phone: this.registerForm.value.phone,
      };

      this.AuthService.registrarUsuario(registroData).subscribe({
        next: (response) => {
          console.log(response);
          this.modalRegistroClose()
          this.registerForm.reset();
          this.registradoCorrectamente = true;
         
          setTimeout(() => {
            this.registradoCorrectamente = false;
          }, 3000);
        },
        error: (error) => {
          this.alertRegistro=true;
          this.modalRegistroClose()
          setTimeout(() => {
            this.modalRegistroOpen();
            this.alertRegistro = false;
          }, 3000);
          console.error('Error al registrar usuario:', error);
        },
      });
    } else {
      console.log('Formulario inválido. Revise los campos resaltados.');
      this.registerForm.markAllAsTouched();
    }
  }



  onSubmitLogin(){
   
    if (this.loginForm.valid) {
      const loginData = {
        email: this.loginForm.value.email!,
        password: this.loginForm.value.password!,
      };

      this.AuthService.loginUsuario(loginData).subscribe({
        next: (response) => {
          console.log(response);
          this.router.navigate(['/usuario']);
          window.scrollTo(0, 0);
       
        },
        error: (error) => {
          console.error('Error al iniciar sesión:', error);
          this.loginForm.reset();
          this.loginIncorrecto = true;
          setTimeout(() => {
            this.loginIncorrecto = false;
          }, 3000);
        },
      });
    } else {
      console.log('Login inválido. Revise los campos resaltados.');
      this.loginForm.markAllAsTouched();
    }



  }

  modalRegistroOpen():void{
this.modalRegister=true;  
  }
      

  modalRegistroClose():void{
    this.modalRegister=false;  
  }



}
