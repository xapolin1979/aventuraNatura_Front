import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventosGeneralService } from '../services/eventos-general.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environments.map-box';
import mapboxgl from 'mapbox-gl';
@Component({
  selector: 'app-ver-evento',
  standalone: true,
  imports: [CommonModule],
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
  2: 'A partir de 12 años',
  3: 'A partir de 18 años'
};
map: any;
constructor(private route: ActivatedRoute ,private eventosGeneralService:EventosGeneralService) { }

ngOnInit():void{

  this.route.paramMap.subscribe(params => {
     this.id_event=params.get('id');
  });
  
  this.eventosGeneralService.getEventoId( this.id_event).subscribe({
    next:(response)=>{
      this.infoEvento=response.data;
      console.log( this.infoEvento);
      this.initializeMap()
    },
    error:(error)=>{
      console.log('Algo a fallado',error)
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