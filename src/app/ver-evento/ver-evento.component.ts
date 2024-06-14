import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventosGeneralService } from '../services/eventos-general.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environments.map-box';
import mapboxgl from 'mapbox-gl';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ParticipantsService } from '../services/participants.service';

@Component({
  selector: 'app-ver-evento',
  standalone: true,
  imports: [CommonModule,FormsModule, ReactiveFormsModule],
  templateUrl: './ver-evento.component.html',
  styleUrl: './ver-evento.component.css'
})
export class VerEventoComponent {

  id_event: any;
  infoEvento:any;
  niveles:any = {
    1: 'Baja',
    2: 'Media',
    3: 'Alta'
};
edades:any = {
  1: 'Todas las edades',
  2: 'A partir de 14 años',
  3: 'A partir de 18 años'
};
map: any;

logoEmail: string = '@';
registerForm = new FormGroup({
  name: new FormControl('', Validators.required),
  surname: new FormControl('', Validators.required),
  email: new FormControl('', [Validators.required, Validators.email]),
  phone: new FormControl('', [Validators.required]),
  persons: new FormControl('', Validators.required),
  aceptarTerminos: new FormControl(false, Validators.requiredTrue),
});

personasApuntadas:any;
disponibilidad:any;
modal:boolean=false;

constructor(private route: ActivatedRoute ,private eventosGeneralService:EventosGeneralService,private participantsService:ParticipantsService) { }

ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    this.id_event = params.get('id');
  });

  this.eventosGeneralService.getEventoId(this.id_event).subscribe({
    next: (response) => {
      this.infoEvento = response.data;
      console.log(this.infoEvento);
      this.initializeMap();
    },
    error: (error) => {
      console.log('Algo a fallado', error);
    }
  });

  this.participantsService.getParticipantesdelEvento(this.id_event).subscribe({
    next: (response) => {
      this.personasApuntadas = response.data;
      console.log(this.personasApuntadas);

      let sumaInscritos = 0;
      this.personasApuntadas.forEach((persona: any) => {
        sumaInscritos += persona.persons;
      });

      const maxPersonas = Number(this.infoEvento.max_persons);
      this.disponibilidad = maxPersonas - sumaInscritos;

      if (this.disponibilidad <= 0) {
        this.disponibilidad = 'No quedan plazas disponibles';
      } else {
        this.disponibilidad = 'Quedan ' + this.disponibilidad + ' plazas';
      }
    },
    error: (error) => {
      console.log('Algo a fallado', error);
    }
  });
}



onSubmit() {
  if (this.registerForm.invalid) {
    this.registerForm.markAllAsTouched();
    return;
  }
// Obtener participantes del evento
      let sumaInscritos = 0;
      this.personasApuntadas.forEach((persona: any) => {
        sumaInscritos += persona.persons;
      });

      // Verificar disponibilidad de plazas
      const maxPersonas = Number(this.infoEvento.max_persons);
      const plazasDisponibles = maxPersonas - sumaInscritos;
      
      if (plazasDisponibles <= 0) {
        alert('No quedan plazas disponibles para este evento.');
        this.registerForm.reset();
        return;
      }

      // Verificar si se excede el límite de plazas
      const inscritos: any = {
        event_id: this.id_event,
        name: this.registerForm.value.name,
        surname: this.registerForm.value.surname,
        email: this.registerForm.value.email,
        phone: this.registerForm.value.phone,
        persons: this.registerForm.value.persons,
      };

      if (inscritos.persons > plazasDisponibles) {
        alert(`Solo quedan ${plazasDisponibles} plazas para apuntarse al evento.`);
        return;
      }

      // Inscribir participante si hay plazas disponibles
      this.participantsService.inscribirParticipante(inscritos).subscribe({
        next: (response) => {
          console.log(response);
          this.modal=true;
          setTimeout(() => {
            this.modal=false;
            this.registerForm.reset();
            window.location.reload();
          }, 4000);

         
        },
        error: (error) => {
          console.log('Algo a fallado', error);
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

initializeMap(): void {
  mapboxgl.accessToken = environment.mapboxKey;
  this.map = new mapboxgl.Map({
    container: 'map-mapbox',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [parseFloat(this.infoEvento.lng), parseFloat(this.infoEvento.lat)],
    zoom: 15,
  });

  const lng = parseFloat(this.infoEvento.lng);
  const lat = parseFloat(this.infoEvento.lat);

  const marker = new mapboxgl.Marker()
    .setLngLat([lng, lat])
    .addTo(this.map);

  const markerElement = marker.getElement();
  markerElement.style.cursor = 'pointer'; 

  markerElement.addEventListener('click', () => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  });
}





}