import { Component,Input,Output, EventEmitter} from '@angular/core';
import { environment } from '../../../environments/environments.map-box';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { EventsService } from '../../services/events.service';
@Component({
  selector: 'app-ubicacion',
  standalone: true,
  imports: [],
  templateUrl: './ubicacion.component.html',
  styleUrl: './ubicacion.component.css'
})
export class UbicacionComponent {
  @Input() ubicaccion_id:any;
  @Output() volver = new EventEmitter<void>();
  map: any;
  geoLocation?: number[];
  marker: any;
  cambiarEvento:any;
  editadoCorrectamente:boolean = false;
 constructor(public eventsService: EventsService) {}

  ngOnChanges(): void {
    if (this.ubicaccion_id !== undefined) {
     console.log(this.ubicaccion_id)
    }
  }
  ngOnInit(): void {
    mapboxgl.accessToken = environment.mapboxKey;
    this.map = new mapboxgl.Map({
      container: 'map-mapbox',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [2.098309466667274, 41.550073185590435],
      zoom: 6,
    });


   this.eventsService.getEventId(this.ubicaccion_id).subscribe({
     next: (response) => {
      this.cambiarEvento=response.data;
       console.log( this.cambiarEvento);
       const markerCoordinates = [this.cambiarEvento.lng, this.cambiarEvento.lat];
       this.marker = new mapboxgl.Marker()
         .setLngLat(markerCoordinates)
         .addTo(this.map);
 
       // Añadir el geocodificador después de colocar el marcador inicial
       this.addGeocoder();
     },
     error: (error) => {
       console.log('No se puede ver los eventos', error)
     }
   })
    



  }

  addGeocoder(): void {
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: 'Buscar lugar...',
      countries: 'es',
      marker: false,
    });

    this.map.addControl(geocoder, 'top-left');

    geocoder.on('result', (event) => {
      const lngLat = event.result.geometry.coordinates;
      this.geoLocation = lngLat;
      this.map.flyTo({ center: lngLat, zoom: 12 });

      if (this.marker) {
        this.marker.remove();
      }

      console.log(this.geoLocation);
      this.marker = this.addMarker(lngLat[0], lngLat[1]);
    });
  }

  
  addMarker(lng: number, lat: number): void {
    const marker = new mapboxgl.Marker({ draggable: false })
      .setLngLat([lng, lat])
      .addTo(this.map);

    marker.on('dragend', () => {
      const newLngLat = marker.getLngLat();
      this.geoLocation = [newLngLat.lng, newLngLat.lat];
      console.log(this.geoLocation);
      this.editarUbicacion(this.geoLocation);
    });
    return marker;
  }




  editarUbicacion(geolocation: any): void {
    console.log('Geolocalización recibida:', geolocation);
  
    if (!geolocation || geolocation.length < 2) {
      console.log('Faltan coordenadas de geolocalización');
      return;
    }
  
    // Convertir las coordenadas a números y asegurarse de que sean válidas
    const lat = parseFloat(geolocation[1]);
    const lng = parseFloat(geolocation[0]);
  
    if (isNaN(lat) || isNaN(lng)) {
      console.log('Coordenadas no válidas:', lat, lng);
      return;
    }
  
    // Actualizar las coordenadas en cambiarEvento
    this.cambiarEvento.lat = lat;
    this.cambiarEvento.lng = lng;
    console.log('cambiarEvento después de actualizar:', this.cambiarEvento);

    this.eventsService.updateEvent(this.ubicaccion_id, this.cambiarEvento).subscribe({
      next: (response) => {
        console.log('Ubicación actualizada con exito:', response);
        this.editadoCorrectamente=true;
      },  
      error: (error) => {     
        console.log('Error al actualizar la ubicación:', error);      
      }

  });
}
  


onVolver() {
  this.volver.emit();
}



cerrarModal() {
  this.editadoCorrectamente=false;
  this.onVolver();
 
}


}