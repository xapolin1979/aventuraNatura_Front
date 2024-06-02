import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
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
   constructor(public  authService: AuthService,private router: Router) {}


cerrarSesion(){
  this.authService.closeSesion().subscribe(() => {
    this.authService.logout();
    this.router.navigate(['/']);
  });
 
}


}
