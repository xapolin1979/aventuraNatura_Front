import { Component,Input,Output, EventEmitter } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-upload-event',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './upload-event.component.html',
  styleUrl: './upload-event.component.css'
})
export class UploadEventComponent {
  @Input() editar_id:any;
  @Output() volver = new EventEmitter<void>();



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




  onSubmitEvent() {
    if (this.registerEvent.invalid) {
      Object.keys(this.registerEvent.controls).forEach((field) => {
        const control = this.registerEvent.get(field);
        if (control) {
          control.markAsTouched({ onlySelf: true });
        }
      });
}

}


}