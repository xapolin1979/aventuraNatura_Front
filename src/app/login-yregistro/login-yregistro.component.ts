import { Component } from '@angular/core';
import { FormsModule,ReactiveFormsModule ,FormGroup,FormControl,Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login-yregistro',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule ],
  templateUrl: './login-yregistro.component.html',
  styleUrl: './login-yregistro.component.css'
})
export class LoginYregistroComponent {
  logoEmail:string="@";

  registerForm = new FormGroup({
      'email':new FormControl('',[Validators.required,Validators.email]),
      'password':new FormControl('',[Validators.required]),
      'rePassword': new FormControl('', [Validators.required]),
      'nombreOrganizador':new FormControl('',Validators.required),
      'phone':new FormControl('',[Validators.required]),
      'aceptarTerminos': new FormControl(false, Validators.requiredTrue),
  });
  

  onSubmit() {
    if (this.registerForm.valid) {
      if (this.registerForm.value.password !== this.registerForm.value.rePassword) {
        console.log('Las contraseñas no coinciden.');
        return;
      }

      // Enviar solo los campos requeridos
      const registroData = {
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        nombreOrganizador: this.registerForm.value.nombreOrganizador,
        phone: this.registerForm.value.phone
      };

      console.log('Datos del formulario:', registroData);
      // Aquí deberías enviar los datos a tu servicio de registro
    } else {
      console.log('Formulario inválido. Revise los campos resaltados.');
      this.registerForm.markAllAsTouched();
    }
  }

}



