import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';
import interactionPlugin from '@fullcalendar/interaction'; 
import { CalendarOptions } from '@fullcalendar/core'; 
import { EventsService } from '../../services/events.service';
@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [FullCalendarModule,CommonModule],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.css'
})
export class CalendarioComponent {
events: any[] = [];
constructor(public eventsService: EventsService) {}
verModal: boolean = false
eventInfo:any={};
categoria:any={};
numeroParticipantes:number=0

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin,interactionPlugin],
    locale: esLocale,
    editable: true, 
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'dayGridMonth' 
   
  },
  eventColor: '#ff6619',
  events: this.events,
  eventClick: this.handleEventClick.bind(this)
}

ngOnInit(): void {

  this.eventsService.getEvent().subscribe({
    next: (response) => {
      this.events = response.data.map((event: any) => ({
        title: event.name_event,
        start: event.start_date,
        extendedProps: event  
    
      }));
      this.calendarOptions.events = this.events;
      console.log(this.events);
    },
    error: (error) => {
      console.log('No se puede ver los eventos', error)
    }
  })


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
handleEventClick(arg: any) {

 this.eventInfo = arg.event.extendedProps;
  this.categoria = this.eventInfo.Category;
  this.numeroParticipantes=this.eventInfo.participants.reduce((total: number, participant: any) => {
    return total + participant.persons;
  }, 0);
  
  console.log('Total de personas:', this.numeroParticipantes);
  console.log('Información del evento:', this.eventInfo,this.categoria);
  this.verModal=true;
}

cerrarModal(){
  this.verModal=false;
}
}