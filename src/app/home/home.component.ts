import { Component } from '@angular/core';
import { HomeEventsComponent } from '../components/home-events/home-events.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HomeEventsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
