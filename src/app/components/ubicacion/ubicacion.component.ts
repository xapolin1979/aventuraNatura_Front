import { Component,Input,Output, EventEmitter} from '@angular/core';
import { environment } from '../../../environments/environments.map-box';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

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
  localizacionEvento: boolean = false;




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

    this.addGeocoder();
/* 
    this.userService.getUser().subscribe({
      next: (response) => {
        this.id_user = response.data.id_user;
        console.log('ID del usuario: ' + response.data.id_user);
      },
      error: (error) => {
        console.log('Usuario no encontrado: ' + error);
      },
    }); */
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
      this.registrarEvento(this.geoLocation);
    });
    return marker;
  }
  registrarEvento(geolocation: any): void {
    if (!geolocation || geolocation.length < 2) {
      console.log('Faltan coordenadas de geolocalización');
      this.localizacionEvento = true;
      setTimeout(() => {
        this.localizacionEvento = false;
      }, 4000);
      return;
    }

}



onVolver() {
  this.volver.emit();
}

}