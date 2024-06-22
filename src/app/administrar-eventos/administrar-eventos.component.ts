import { Component } from '@angular/core';
import { CrearEventosComponent } from '../components/crear-eventos/crear-eventos.component';
import { EditarEventosComponent } from '../components/editar-eventos/editar-eventos.component';
import { CalendarioComponent } from '../components/calendario/calendario.component';
import { FinanzasComponent } from '../components/finanzas/finanzas.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-administrar-eventos',
  standalone: true,
  imports: [CrearEventosComponent,EditarEventosComponent,CalendarioComponent,FinanzasComponent,CommonModule],
  templateUrl: './administrar-eventos.component.html',
  styleUrl: './administrar-eventos.component.css'
})
export class AdministrarEventosComponent {
  createEvent:boolean=true;
  updateEvent:boolean=false;
  calendar:boolean=false;
  finance:boolean=false;
   crearEvento=()=>{
    this.createEvent=true;
    this.updateEvent=false;
    this.calendar=false;
    this.finance=false;
   }
   editarEvento=()=>{
    this.updateEvent=true;
    this.createEvent=false;
    this.calendar=false;
    this.finance=false;
   }

   calendario=()=>{
  this.calendar=true;
  this.finance=false;
  this.createEvent=false;
  this.updateEvent=false;
   }
   finanzas=()=>{
  this.finance=true;
  this.calendar=false;
  this.createEvent=false;
  this.updateEvent=false;
   }
}
