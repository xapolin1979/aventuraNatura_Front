import { Component } from '@angular/core';
import { environment } from '../../../environments/environments.map-box';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { EventsService } from '../../services/events.service';
import { PhotosService } from '../../services/photos.service';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-crear-eventos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './crear-eventos.component.html',
  styleUrl: './crear-eventos.component.css',
})
export class CrearEventosComponent {
  logoEmail: string = '@';
  map: any;
  geoLocation?: number[];
  marker: any; //
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
  constructor(
    private EventsService: EventsService,
    public UserService: UserService,
    private PhotosService: PhotosService
  ) {}

  ngOnInit(): void {
    //Mapa mapBox
    mapboxgl.accessToken = environment.mapboxKey;
    this.map = new mapboxgl.Map({
      container: 'map-mapbox',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [2.098309466667274, 41.550073185590435],
      zoom: 6,
    });

    this.addGeocoder();

    this.UserService.getUser().subscribe({
      next: (response) => {
        this.id_user = response.data.id_user;
        console.log('id del usuario ' + response.data.id_user);
      },
      error: (error) => {
        console.log('usuario no encontrado' + error);
      },
    });
  }

  // Buscador del mapa

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

  //Marker de la geolocalización
  addMarker(lng: number, lat: number): void {
    const marker = new mapboxgl.Marker({
      draggable: false,
    })
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

  //Almacena los datos del formulario
  onSubmitEvent() {
    if (this.registerEvent.invalid) {
      // Marca todos los controles como tocados para mostrar errores
      Object.keys(this.registerEvent.controls).forEach((field) => {
        const control = this.registerEvent.get(field);
        if (control) {
          control.markAsTouched({ onlySelf: true });
        }
      });
    } else {
      // Procesa el formulario si es válido
      this.nextCreateEvent = true;
      this.mapBoxEvento = true;
    }
  }

  //Registro del evento con los datos almacenados del formulario y las cordenadas del mapa

  registrarEvento(geolocation: any): void {
    if (!geolocation || geolocation.length < 2) {
      console.log('Faltan coordenadas de geolocalización');
      this.localizacionEvento = true;
      setTimeout(() => {
        this.localizacionEvento = false;
      }, 4000);
      return;
    }
    // Formatear las fechas
    const formattedStartDate = this.formatDate(
      this.registerEvent.value.start_date
    );
    const formattedEndDate = this.formatDate(this.registerEvent.value.end_date);

    const nuevoEvento = {
      user_id: this.id_user,
      category_id: this.registerEvent.value.category_id,
      name_event: this.registerEvent.value.name_event,
      difficulty: this.registerEvent.value.difficulty,
      max_persons: this.registerEvent.value.max_persons,
      start_date: formattedStartDate,
      end_date: formattedEndDate,
      lat: geolocation[1],
      lng: geolocation[0],
      info_event: this.registerEvent.value.info_event,
      for_whom: this.registerEvent.value.for_whom,
      price_per_person: this.registerEvent.value.price_per_person,
      material: this.registerEvent.value.material,
    };

    console.log(nuevoEvento);
 // crea el evento
    this.EventsService.creaateEvent(nuevoEvento).subscribe({
      next: (response) => {
        console.log(response.data.id_event);
        this.event_id = response.data.id_event;
      
      },
      error: (error) => {
        console.log('El evento no se a creado correctamente', error);
      },
    });
   
    this.mapBoxEvento = false;
    this.fotosEvento = true;
  }

  // Funcion para formatear las fechas
  formatDate(date: any): string {
    const d = new Date(date);
    return d.toISOString().slice(0, 19).replace('T', ' ');
  }

  //archivos seleccionados en el input
  onFileSelected(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
  }

  // Subir fotos al servidor
  subirFoto() {
    const formData = new FormData();

    for (let file of this.selectedFiles) {
      formData.append('file', file);
    }

    this.PhotosService.insertPhotos(this.event_id!, formData).subscribe({
      next: (response) => {
        console.log(response);
        this.cargarFotos();
        this.insertarPhotos.reset();
      },
      error: (error) => {
        console.log('No se inserto la photo', error);
      },
    });
  }

  // cargar las fotos del servidor
  cargarFotos(): void {
    if (this.event_id) {
      this.PhotosService.verFotosEvento(this.event_id).subscribe({
        next: (response) => {
          this.verFotos = response.data;
        },
        error: (error) => {
          console.log('No se puede ver la foto', error);
        },
      });
    }
  }

  //Borrar las fotos del servidor y actualizar imagenes en el front
  eliminarFoto(id_photo: number): void {
    this.PhotosService.deletePhoto(id_photo).subscribe({
      next: (response) => {
        console.log(response);
        this.verFotos = this.verFotos.filter(
          (photo: any) => photo.id_photos !== id_photo
        );
      },
      error: (error) => {
        console.log('No se puede borrar la foto', error);
      },
    });
  }


//Borrar el evento y sus fotos 

cancelarEvento(){

   this.EventsService.deleteEvent(this.event_id).subscribe({
    next: (response) => {
      console.log(response);
      this.verFotos=[]
      this.registerEvent.reset();
      // Eliminar marcador actual
      if (this.marker) {
        this.marker.remove();
      }

      // Restablecer geocodificador
      this.resetGeocoder();
      this.nextCreateEvent = false;
      this.mapBoxEvento = false;
      this.fotosEvento = false;

    },
    error: (error) => {
      console.log('No se puede borrar el evento', error);
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






}

