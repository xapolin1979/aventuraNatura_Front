import { Component } from '@angular/core';
import { HomeEventsComponent } from '../components/home-events/home-events.component';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HomeEventsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private router: Router, private authService: AuthService) {}

  publicarEvento() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/usuario']);
    } else {
      this.router.navigate(['/login']);
    }
  }


}
