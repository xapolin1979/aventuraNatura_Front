import { Component, OnInit } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';
import { EventsService } from '../../services/events.service';
import { ParticipantsService } from '../../services/participants.service';

interface Evento {
  id_event: number;
  start_date: string;
  price_per_person: string;
}

@Component({
  selector: 'app-finanzas',
  standalone: true,
  imports: [],
  templateUrl: './finanzas.component.html',
  styleUrls: ['./finanzas.component.css']
})
export class FinanzasComponent implements OnInit {
  chartLine: any;
  chartBar: any;
  infoEvents: Evento[] = [];
  totalVentasPorAnio: { [key: string]: number[] } = {};

  constructor(public eventsService: EventsService, public participantsService: ParticipantsService) {}

  ngOnInit(): void {
    this.eventsService.getEvent().subscribe({
      next: (response) => {
        this.infoEvents = response.data;
        console.log('Eventos obtenidos:', this.infoEvents);

        this.infoEvents.forEach((event) => {
          const startDate = new Date(event.start_date);
          const year = startDate.getFullYear().toString(); // Convertir a string

          if (!this.totalVentasPorAnio[year]) {
            this.totalVentasPorAnio[year] = new Array(12).fill(0);
          }

          this.participantsService.getParticipantesdelEvento(event.id_event).subscribe({
            next: (response) => {
              const personas = response.data;
              let totalEvento = 0;

              personas.forEach((persona: any) => {
                const inscritos = persona.persons;
                const precio = parseFloat(event.price_per_person);
                totalEvento += inscritos * precio;
              });

              const monthIndex = startDate.getMonth();
              this.totalVentasPorAnio[year][monthIndex] += totalEvento;

              this.updateCharts();
            },
            error: (error) => {
              console.log('Error al obtener participantes del evento:', error);
            }
          });
        });
      },
      error: (error) => {
        console.log('Error al obtener eventos:', error);
      }
    });

    this.initializeCharts();
  }

  initializeCharts(): void {
    const years = Object.keys(this.totalVentasPorAnio);

    const lineDatasets = years.map(year => {
      return {
        label: `Ventas ${year}`,
        data: this.totalVentasPorAnio[year] || new Array(12).fill(0),
        fill: false,
        borderColor: '#ff6619', 
        tension: 0.1
      };
    });

    this.chartLine = new Chart('lineChart', {
      type: 'line' as ChartType,
      data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        datasets: lineDatasets
      }
    });

    const barDatasets = years.map(year => {
      return {
        label: `Facturación ${year}`,
        data: this.totalVentasPorAnio[year] || new Array(12).fill(0),
        backgroundColor: '#ff6619', 
        borderColor: '#ff6619', 
        borderWidth: 1
      };
    });

    this.chartBar = new Chart('barChart', {
      type: 'bar' as ChartType,
      data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        datasets: barDatasets
      }
    });
  }

  updateCharts(): void {
    const years = Object.keys(this.totalVentasPorAnio);

    const lineDatasets = years.map(year => {
      return {
        label: `Ventas ${year}`,
        data: this.totalVentasPorAnio[year] || new Array(12).fill(0),
        fill: false,
        borderColor: '#ff6619', 
      };
    });

    this.chartLine.data.datasets = lineDatasets;
    this.chartLine.update();

    const barDatasets = years.map(year => {
      return {
        label: `Facturación ${year}`,
        data: this.totalVentasPorAnio[year] || new Array(12).fill(0),
        backgroundColor: '#ff6619', 
        borderColor: '#ff6619', 
        borderWidth: 1
      };
    });

    this.chartBar.data.datasets = barDatasets;
    this.chartBar.update();
  }
}
