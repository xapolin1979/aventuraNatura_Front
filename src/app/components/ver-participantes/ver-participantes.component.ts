import { Component ,Input,Output, EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParticipantsService } from '../../services/participants.service';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-ver-participantes',
  standalone: true,
  imports: [CommonModule,FormsModule, ReactiveFormsModule],
  templateUrl: './ver-participantes.component.html',
  styleUrl: './ver-participantes.component.css'
})
export class VerParticipantesComponent {
@Input() event_id:any;
@Output() volver = new EventEmitter<void>();
filtroNombre:string = '';
ordenAscendente:boolean = true; 
participantes:any;
editadoCorrectamente:boolean=false;
idParticipanteABorrar: number | null = null;

logoEmail: string = '@';
id_participante:any;
registerForm = new FormGroup({
  name: new FormControl('', Validators.required),
  surname: new FormControl('', Validators.required),
  email: new FormControl('', [Validators.required, Validators.email]),
  phone: new FormControl('', [Validators.required]),
  persons: new FormControl('', Validators.required),
});

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
       console.log(this.participantes)  
       
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

abrirModal(id_participant: number): void {

  this.id_participante=id_participant;

  const participante = this.participantes.find((p: any) => p.id_participants === id_participant);


  if (participante) {
    this.registerForm.patchValue({
      name: participante.name,
      surname: participante.surname,
      email: participante.email,
      phone: participante.phone,
      persons: participante.persons
    });

    this.editadoCorrectamente = true; 
  } else {
    console.log('No se encontró el participante con el ID especificado');
  }
}

onSubmit(){
  if (this.registerForm.valid) {
    const editedParticipant = {
      id_participants:this.id_participante, 
      name: this.registerForm.value.name,
      surname: this.registerForm.value.surname,
      email: this.registerForm.value.email,
      phone: this.registerForm.value.phone,
      persons: this.registerForm.value.persons
    };

    this.participantsService.actualizarParticipante(editedParticipant.id_participants, editedParticipant).subscribe({
      next: (response) => {
        console.log('Participante actualizado exitosamente', response);
        this.editadoCorrectamente = false; 
        this.loadParticipants(); 
       
      },
      error: (error) => {
        console.error('Error al actualizar el participante', error);
       
      }
    });
  } else {
    console.log('Formulario inválido. Verifica los campos.');
   
  }
}
  
cerrar():void{
  this.editadoCorrectamente = false; 

}




borrar(id_participant: number): void {
  this.idParticipanteABorrar = id_participant;

}


borrarParticipante(): void {
  if (this.idParticipanteABorrar !== null) {
    this.participantsService.borrarParticipante(this.idParticipanteABorrar).subscribe({
      next: (response) => {
        console.log('Participante borrado exitosamente', response);
        this.loadParticipants();
        this.idParticipanteABorrar = null; 
      },
      error: (error) => {
        console.error('Error al borrar el participante', error);
      }
    });
  } else {
    console.error('No se ha seleccionado un participante para borrar');
  }
}

  
}










