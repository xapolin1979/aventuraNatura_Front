import { Component } from '@angular/core';
import { CrearEventosComponent } from '../components/crear-eventos/crear-eventos.component';
import { EditarEventosComponent } from '../components/editar-eventos/editar-eventos.component';
import { ParticipantesComponent } from '../components/participantes/participantes.component';
import { CalendarioComponent } from '../components/calendario/calendario.component';
import { FinanzasComponent } from '../components/finanzas/finanzas.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-administrar-eventos',
  standalone: true,
  imports: [CrearEventosComponent,EditarEventosComponent,ParticipantesComponent,CalendarioComponent,FinanzasComponent,CommonModule],
  templateUrl: './administrar-eventos.component.html',
  styleUrl: './administrar-eventos.component.css'
})
export class AdministrarEventosComponent {
  createEvent:boolean=false;
  updateEvent:boolean=true;
  participants:boolean=false;
  calendar:boolean=false;
  finance:boolean=false;
   crearEvento=()=>{
    this.createEvent=true;
    this.updateEvent=false;
    this.participants=false;
    this.calendar=false;
    this.finance=false;
   }
   editarEvento=()=>{
    this.updateEvent=true;
    this.participants=false;
    this.createEvent=false;
    this.calendar=false;
    this.finance=false;
   }

   calendario=()=>{
  this.calendar=true;
  this.finance=false;
  this.participants=false;
  this.createEvent=false;
  this.updateEvent=false;
   }
   finanzas=()=>{
  this.finance=true;
  this.calendar=false;
  this.participants=false;
  this.createEvent=false;
  this.updateEvent=false;
   }
}
