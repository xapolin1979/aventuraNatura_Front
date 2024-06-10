import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventosGeneralService } from '../services/eventos-general.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-public-events',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './public-events.component.html',
  styleUrls: ['./public-events.component.css']
})
export class PublicEventsComponent implements OnInit {
  infoEventos: any[] = [];
  datosEventos: any[] = [];
  ordenDate: boolean = true;
  ordenPrecio: boolean = true;
  ordenName: boolean = true;
  selectedCategoria: string = ''; 

  constructor(public eventosGeneralService: EventosGeneralService) {}

  ngOnInit(): void {
    this.eventosGeneralService.eventosGeneral().subscribe({
      next: (response) => {
        this.datosEventos = response.data;
        this.infoEventos = [...this.datosEventos]; 
        console.log(this.infoEventos);
      },
      error: (error) => {
        console.log('Hay algún error', error);
      }
    });
  }
  formatDate(date: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(date).toLocaleString('es-ES', options);
  }
  
  
  filtrarPorCategoria() {
   
    if (this.selectedCategoria === '') {
      // Restaurar los datos originales si no se ha seleccionado ninguna categoría
      this.datosEventos = [...this.infoEventos];
    } else {
      // Filtrar los eventos por la categoría seleccionada
      this.datosEventos = this.infoEventos.filter(evento => evento.category_id === parseInt(this.selectedCategoria));
    }


  }



  ordenarData() {
    this.ordenDate = !this.ordenDate;
    this.datosEventos.sort((a, b) => {
      const fechaA: any = new Date(a.start_date);
      const fechaB: any = new Date(b.start_date);
      return this.ordenDate ? fechaA.getTime() - fechaB.getTime() : fechaB.getTime() - fechaA.getTime();
    });
  }
  
  ordenarPrecio() {
    this.ordenPrecio = !this.ordenPrecio;
    this.datosEventos.sort((a, b) => {
      const precioA = a.price_per_person;
      const precioB = b.price_per_person;
      return this.ordenPrecio ? precioA - precioB : precioB - precioA;
    });
  }
  



   
  }

