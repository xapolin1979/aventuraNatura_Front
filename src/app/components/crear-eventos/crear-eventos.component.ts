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

import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-crear-eventos',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './crear-eventos.component.html',
  styleUrl: './crear-eventos.component.css'
})
export class CrearEventosComponent {

  logoEmail: string = '@';
  map: any;
  geoLocation?: number[];
  marker: any; // 
  nextCreateEvent:boolean=false;
  localizacionEvento:boolean=false;
  mapBoxEvento:boolean=false;
  fotosEvento:boolean=false;
  crearEvento:any;



 registerEvent = new FormGroup({
  name_event: new FormControl('', Validators.required),
  category_id:new FormControl('', Validators.required),
  info_event: new FormControl('', Validators.required),
  difficulty: new FormControl('', Validators.required),
  max_persons: new FormControl('', Validators.required),
  start_date: new FormControl('', Validators.required),
  end_date: new FormControl('', Validators.required),
  for_whom: new FormControl('', Validators.required),
  price_per_person: new FormControl('', Validators.required),
  material: new FormControl('', Validators.required),

});



constructor(private EventsService:EventsService, public UserService:UserService){}



ngOnInit(): void {

    mapboxgl.accessToken = environment.mapboxKey;

    this.map = new mapboxgl.Map({
      container: 'map-mapbox',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [2.098309466667274, 41.550073185590435],
      zoom: 9
    });

    this.addGeocoder();

    this.UserService.getUser().subscribe({

      next:(response)=>{
        console.log(response)
      },
      error:(error)=>{
        console.log('usuario no encontrado' +error)
      }
    })
   
  }


  
  addGeocoder(): void {
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: 'Buscar lugar...',
      countries: 'es', 
      marker: false ,
      
    });

    this.map.addControl(geocoder,'top-left');

    
    geocoder.on('result', (event) => {
      const lngLat = event.result.geometry.coordinates;
      this.geoLocation = lngLat; 
      console.log(this.geoLocation);
      this.map.flyTo({ center: lngLat, zoom: 12 });

       
        if (this.marker) {
          this.marker.remove();
        }

     
      this.marker = this.addMarker(lngLat[0], lngLat[1]);
    });


    
  }

  addMarker(lng: number, lat: number): void {
    const marker = new mapboxgl.Marker({
      draggable: true,
    })
      .setLngLat([lng, lat])
      .addTo(this.map);

    
    marker.on('dragend', () => {
      const newLngLat = marker.getLngLat(); 
      this.geoLocation = [newLngLat.lng, newLngLat.lat]; 
      console.log(this.geoLocation);
      this.registrarEvento(this.geoLocation)
    });

    return marker;
   
  }



  onSubmitEvent(){
    if (this.registerEvent.invalid) {
      // Marca todos los controles como tocados para mostrar errores
      Object.keys(this.registerEvent.controls).forEach(field => {
        const control = this.registerEvent.get(field);
        if (control) { 
          control.markAsTouched({ onlySelf: true });
        }
      });
    } else {
      // Procesa el formulario si es válido
      this.nextCreateEvent = true;
      this.mapBoxEvento=true;

    }
  
  }

    
  registrarEvento(geolocation:any):void{
    if (!geolocation || geolocation.length < 2) {
      console.log('Faltan coordenadas de geolocalización');
      this.localizacionEvento=true;
      setTimeout(() => {
        this.localizacionEvento = false;
      }, 4000);
      return;
    }
    


    const enviar={
      category_id:this.registerEvent.value.category_id,
      name_event: this.registerEvent.value.name_event ,
      difficulty: this.registerEvent.value.difficulty,
      max_persons:this.registerEvent.value.max_persons,
      start_date: this.registerEvent.value.start_date,
      end_date: this.registerEvent.value.end_date,
      lat: geolocation[1], 
      lng: geolocation[0] ,  
      info_event:this.registerEvent.value.info_event ,
      for_whom: this.registerEvent.value.for_whom,
      price_per_person: this.registerEvent.value.price_per_person,
      material: this.registerEvent.value.material, 
    

    }


     this.EventsService.creaateEvent(enviar).subscribe({

      next:(response)=>{

        console.log(response);
      },
      error:(error)=>{

        console.log('El evento no se a insertado correctamente'+ error)
      }
    }) 
    this.mapBoxEvento=false;
    this.fotosEvento=true;
}





}
