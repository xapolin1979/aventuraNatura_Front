import { Component,Input,Output, EventEmitter } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EventsService } from '../../services/events.service';
@Component({
  selector: 'app-upload-event',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './upload-event.component.html',
  styleUrl: './upload-event.component.css'
})
export class UploadEventComponent {
  @Input() editar_id: any;
  @Output() volver = new EventEmitter<void>();
  editadoCorrectamente:boolean = false;
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
  id_user:any;
  lat: number | undefined;
  lng: number | undefined;

  constructor(private eventsService: EventsService) { }

  ngOnInit(): void {
    if (this.editar_id) {
      this.eventsService.getEventId(this.editar_id).subscribe({
        next: (response) => {
          console.log(response.data);
          const data = response.data;
          this.lat = parseFloat(data.lat);  
          this.lng = parseFloat(data.lng);  
           this.id_user = data.user_id;
          // Asignar valores al formulario
          this.registerEvent.patchValue({
            name_event: data.name_event,
            category_id: data.category_id,
            info_event: data.info_event,
            difficulty: data.difficulty,
            max_persons: data.max_persons,
            start_date: this.formatDate(data.start_date),
            end_date: this.formatDate(data.end_date),
            for_whom: data.for_whom,
            price_per_person: data.price_per_person,
            material: data.material,
          });
        },
        error: (error) => {
          console.log('Algo ha fallado', error);
        }
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  onSubmitEvent(): void {
    if (this.registerEvent.invalid) {
     
      Object.keys(this.registerEvent.controls).forEach(field => {
        const control = this.registerEvent.get(field);
        if (control) {
          control.markAsTouched({ onlySelf: true });
        }
      });
      return;  
    }

  
    const cambiarEvento = {
      user_id: this.id_user,  
      category_id: this.registerEvent.value.category_id,
      name_event: this.registerEvent.value.name_event,
      difficulty: this.registerEvent.value.difficulty,
      max_persons: this.registerEvent.value.max_persons,
      start_date: this.registerEvent.value.start_date,
      end_date: this.registerEvent.value.end_date,
      lat:this.lat,
      lng: this.lng,
      info_event: this.registerEvent.value.info_event,
      for_whom: this.registerEvent.value.for_whom,
      price_per_person: this.registerEvent.value.price_per_person,
      material: this.registerEvent.value.material,
    };
    
    console.log('Datos a enviar:', cambiarEvento);

 
    this.eventsService.updateEvent(this.editar_id, cambiarEvento).subscribe({
      next: (response) => {
        console.log('Evento actualizado correctamente:', response);
        this.editadoCorrectamente = true;
      },
      error: (error) => {
        console.log('Error al actualizar el evento:', error);
       
      }
    });
  }

  onVolver(): void {
    this.volver.emit();
  }

  cerrarModal() {
    this.editadoCorrectamente=false;
    this.onVolver();
    window.location.reload()
  }

}