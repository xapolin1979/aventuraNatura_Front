import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environments.map-box';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { EventsService } from '../../services/events.service';
import { PhotosService } from '../../services/photos.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-crear-eventos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './crear-eventos.component.html',
  styleUrls: ['./crear-eventos.component.css'],
})
export class CrearEventosComponent implements OnInit {
  logoEmail: string = '@';
  map: any;
  geoLocation?: number[];
  marker: any;
  nextCreateEvent: boolean = false;
  localizacionEvento: boolean = false;
  mapBoxEvento: boolean = false;
  fotosEvento: boolean = false;
  crearEvento: any;

  id_user?: number;
  event_id?: number;
  verFotos: any;

  registerEvent = new FormGroup({
    name_event: new FormControl('', Validators.required),
    category_id: new FormControl('', Validators.required),
    info_event: new FormControl('', Validators.required),
    difficulty: new FormControl('', Validators.required),
    max_persons: new FormControl('', Validators.required),
    start_date: new FormControl('', Validators.required),
    end_date: new FormControl('', Validators.required),
    for_whom: new FormControl('', Validators.required),
    price_per_person: new FormControl('', Validators.required),
    material: new FormControl('', Validators.required),
  });

  insertarPhotos = new FormGroup({
    photo: new FormControl('', Validators.required),
  });

  selectedFiles: File[] = [];
  creadoCorrectamente:boolean = false;
  borradoCorrectamente:boolean = false;
  constructor(
    private eventsService: EventsService,
    public userService: UserService,
    private photosService: PhotosService
  ) {}

  ngOnInit(): void {
    mapboxgl.accessToken = environment.mapboxKey;
    this.map = new mapboxgl.Map({
      container: 'map-mapbox',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [2.098309466667274, 41.550073185590435],
      zoom: 6,
    });

    this.addGeocoder();

    this.userService.getUser().subscribe({
      next: (response) => {
        this.id_user = response.data.id_user;
        console.log('ID del usuario: ' + response.data.id_user);
      },
      error: (error) => {
        console.log('Usuario no encontrado: ' + error);
      },
    });
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

  onSubmitEvent() {
    if (this.registerEvent.invalid) {
      Object.keys(this.registerEvent.controls).forEach((field) => {
        const control = this.registerEvent.get(field);
        if (control) {
          control.markAsTouched({ onlySelf: true });
        }
      });
    } else {
      this.nextCreateEvent = true;
      this.mapBoxEvento = true;
    }
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
  
    const formattedStartDate = this.formatDate(this.registerEvent.value.start_date);
    const formattedEndDate = this.formatDate(this.registerEvent.value.end_date);
  
    const nuevoEvento = {
      user_id: this.id_user,
      category_id: this.registerEvent.value.category_id,
      name_event: this.registerEvent.value.name_event,
      difficulty: this.registerEvent.value.difficulty,
      max_persons: this.registerEvent.value.max_persons,
      start_date: formattedStartDate,
      end_date: formattedEndDate,
      lat: parseFloat(geolocation[1].toFixed(8)),  
      lng: parseFloat(geolocation[0].toFixed(8)),
      info_event: this.registerEvent.value.info_event,
      for_whom: this.registerEvent.value.for_whom,
      price_per_person: this.registerEvent.value.price_per_person,
      material: this.registerEvent.value.material,
    };
  
    console.log('Datos del nuevo evento:', nuevoEvento);
  
    this.eventsService.createEvent(nuevoEvento).subscribe({
      next: (response) => {
        console.log('Evento creado con ID:', response.data.id_event);
        this.event_id = response.data.id_event;
        this.mapBoxEvento = false;
        this.fotosEvento = true;
      },
      error: (error) => {
        console.log('Error al crear el evento:', error);
      },
    });
  }
  

  formatDate(date: any): string {
    const d = new Date(date);
    const offset = d.getTimezoneOffset();
    d.setMinutes(d.getMinutes() - offset);
    return d.toISOString().slice(0, 19).replace('T', ' ');
  }
  

  onFileSelected(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
  }

  subirFoto() {
    const formData = new FormData();

    for (let file of this.selectedFiles) {
      formData.append('file', file);
    }

    this.photosService.insertPhotos(this.event_id!, formData).subscribe({
      next: (response) => {
        console.log(response);
        this.cargarFotos();
        this.insertarPhotos.reset();
      },
      error: (error) => {
        console.log('No se insertó la foto:', error);
      },
    });
  }

  cargarFotos(): void {
    if (this.event_id) {
      this.photosService.verFotosEvento(this.event_id).subscribe({
        next: (response) => {
          this.verFotos = response.data;
        },
        error: (error) => {
          console.log('No se pueden ver las fotos:', error);
        },
      });
    }
  }

  eliminarFoto(id_photo: number): void {
    this.photosService.deletePhoto(id_photo).subscribe({
      next: (response) => {
        console.log(response);
        this.verFotos = this.verFotos.filter(
          (photo: any) => photo.id_photos !== id_photo
        );
      },
      error: (error) => {
        console.log('No se puede borrar la foto:', error);
      },
    });
  }

  cancelarEvento() {
    if (!this.event_id) return;

    this.eventsService.deleteEvent(this.event_id).subscribe({
      next: (response) => {
        console.log(response);
        this.borradoCorrectamente = true;
       setTimeout(() => {
          this.borradoCorrectamente = false;
   },3000);
        this.verFotos = [];
        this.registerEvent.reset();

        if (this.marker) {
          this.marker.remove();
        }

        this.resetGeocoder();
        this.nextCreateEvent = false;
        this.mapBoxEvento = false;
        this.fotosEvento = false;
      },
      error: (error) => {
        console.log('No se puede borrar el evento:', error);
      },
    });
  }

  resetGeocoder() {
    const geocoderContainer = document.querySelector('.mapboxgl-ctrl-geocoder');
    if (geocoderContainer) {
      geocoderContainer.remove();
    }
    this.addGeocoder();
  }

  finalizarCreacionDelEvento() {
   this.creadoCorrectamente = true;
 
  }

  cerrarModal(){
    this.creadoCorrectamente = false;
    this.registerEvent.reset();
    if (this.marker) {
      this.marker.remove();
    }

    this.resetGeocoder();
    this.nextCreateEvent = false;
    this.mapBoxEvento = false;
    this.fotosEvento = false;
  }

}











