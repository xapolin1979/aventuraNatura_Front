import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
email:string='ginesti@outlook.es';
location:string='Sabadell (Barcelona)'
   constructor(public  authService: AuthService) {}


cerrarSesion(){
  this.authService.logout().subscribe({
    next:(response)=>{
      console.log(response)
    },
    error:(error)=>{
      console.log('Nose pudo hacer logout'+ error)
    }
  })
}


}
