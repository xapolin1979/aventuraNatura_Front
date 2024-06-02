import { Component } from '@angular/core';
import { environment } from '../../../environments/environments.map-box';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';



@Component({
  selector: 'app-crear-eventos',
  standalone: true,
  imports: [],
  templateUrl: './crear-eventos.component.html',
  styleUrl: './crear-eventos.component.css'
})
export class CrearEventosComponent {

  logoEmail: string = '@';
  map: any;
  geoLocation?: number[];






  ngOnInit(): void {
    mapboxgl.accessToken = environment.mapboxKey;

    this.map = new mapboxgl.Map({
      container: 'map-mapbox',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [1.520862, 41.591158],
      zoom: 9
    });

    this.addGeocoder();
  }

  addGeocoder(): void {
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: 'Buscar lugar...',
      countries: 'es', // Limitar la búsqueda a España
      marker: false // Deshabilitar el marcador predeterminado del geocoder
    });

    this.map.addControl(geocoder,'top-left');

    // Evento cuando se selecciona un lugar
    geocoder.on('result', (event) => {
      const lngLat = event.result.geometry.coordinates;
      this.geoLocation = lngLat; 
      console.log(this.geoLocation )
      this.map.flyTo({ center: lngLat, zoom: 12 });

      // Eliminar marcador anterior si existe
      if (this.map.getLayer('marker')) {
        this.map.removeLayer('marker');
        this.map.removeSource('marker');
      }

      // Agregar nuevo marcador en la ubicación seleccionada
      this.addMarker(lngLat[0], lngLat[1]);
    });
  }

  addMarker(lng: number, lat: number): void {
    new mapboxgl.Marker({
      draggable: false,
    })
      .setLngLat([lng, lat])
      .addTo(this.map);
  }


}




