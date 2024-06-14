import { Component ,Input,Output, EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParticipantsService } from '../../services/participants.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-ver-participantes',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './ver-participantes.component.html',
  styleUrl: './ver-participantes.component.css'
})
export class VerParticipantesComponent {
@Input() event_id:any;
@Output() volver = new EventEmitter<void>();
filtroNombre:string = '';
ordenAscendente:boolean = true; 
participantes:any;

  constructor(public participantsService:ParticipantsService){}

ngOnChanges(): void {
  if (this.event_id !== undefined) {
    this.loadParticipants();
  }
}
loadParticipants(): void {
  
  this.participantsService.getParticipantesdelEvento(this.event_id).subscribe({
    next: (response) => {
      this.participantes = response.data;
      console.log(  this.participantes);
    },
  error: (error) => {
    console.log('No se pudo ver los participantes',error);
  }
  });
}


buscar(): any[] {
  if (this.filtroNombre.trim() === '') {
    return this.participantes; 
  } else {
    return this.participantes.filter((participante: any) =>
      participante.name.toLowerCase().includes(this.filtroNombre.toLowerCase())
    );
  }
}

ordenar() {
  this.participantes.sort((a: any, b: any) => {
    if (this.ordenAscendente) {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });
}


cambiarOrden() {
  this.ordenAscendente = !this.ordenAscendente;
  this.ordenar(); 
}

onVolver() {
  this.volver.emit();
}


}



