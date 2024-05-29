import { Component } from '@angular/core';
import { EventosGeneralService } from '../../services/eventos-general.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-home-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-events.component.html',
  styleUrl: './home-events.component.css'
})
export class HomeEventsComponent {

  datosEventos:any;
  constructor(public eventosGeneralService:EventosGeneralService){}

     ngOnInit(){

      this.eventosGeneralService.eventosGeneral().subscribe(
        response => {
          this.datosEventos=response.data;
          console.log(this.datosEventos);
         
        },
        error => {
          console.error(error);
        
        }
      );
     }
}
