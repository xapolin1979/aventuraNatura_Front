import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventsService } from '../../services/events.service';
import { VerParticipantesComponent } from '../ver-participantes/ver-participantes.component';
import { UbicacionComponent } from '../ubicacion/ubicacion.component';
import { UploadEventComponent } from '../upload-event/upload-event.component';
import { FotografiasComponent } from '../fotografias/fotografias.component';
@Component({
  selector: 'app-editar-eventos',
  standalone: true,
  imports: [CommonModule,FormsModule,VerParticipantesComponent,UbicacionComponent,UploadEventComponent,FotografiasComponent],
  templateUrl: './editar-eventos.component.html',
  styleUrl: './editar-eventos.component.css'
})
export class EditarEventosComponent {
  eventos:any = [];
  enviarId?:number;
  filtroNombre:string = '';
  ordenAscendente:boolean = true; 
  iraParticipantes:boolean = false;
  iraEventos:boolean = false;
  mostrarUbicacion = false;
  mostrarEditar = false;
  niveles:any = {
    1: 'Baja',
    2: 'Media',
    3: 'Alta'
};
edades:any = {
  1: 'Todas las edades',
  2: 'A partir de 12 años',
  3: 'A partir de 18 años'
};

  constructor(private EventsService:EventsService){}


  ngOnInit(): void {
    
    this.EventsService.getEvent().subscribe({
      next: (response) => {
        this.eventos = [...response.data];
        console.log(this.eventos)
      },
      error: (error) => {
        console.log('No se puede ver los eventos',error)
      }
    })


  }
  formatDate(date: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(date).toLocaleString('es-ES', options);
  }
  truncarTexto(texto: string, longitud: number): string {
    if (texto.length > longitud) {
      return texto.substring(0, longitud) + '...';
    }
    return texto;
  }


  buscar(): any[] {
    if (this.filtroNombre.trim() === '') {
      return this.eventos; 
    } else {
      return this.eventos.filter((evento: any) =>
        evento.name_event.toLowerCase().includes(this.filtroNombre.toLowerCase())
      );
    }
  }
  
  ordenar() {
    this.eventos.sort((a: any, b: any) => {
      if (this.ordenAscendente) {
        return a.name_event.localeCompare(b.name_event);
      } else {
        return b.name_event.localeCompare(a.name_event);
      }
    });
  }
  

  cambiarOrden() {
    this.ordenAscendente = !this.ordenAscendente;
    this.ordenar(); 
}

recogerIdEvento(id:number){
this.enviarId=id;
this.cambiarVista();
}
recogerIdEventoUbicacion(id:number){
  this.enviarId=id;
  this.cambiarUbicacion()
}
recogerIdEvent(id:number){
  this.enviarId=id;
  this.cambiarEvento();
}


cambiarVista(): void {
  this.iraParticipantes = !this.iraParticipantes;
  this.iraEventos = !this.iraEventos;
}
cambiarUbicacion(){
  this.iraParticipantes = !this.iraParticipantes;
  this.mostrarUbicacion = !this.mostrarUbicacion;
  
}
cambiarEvento(){
  this.iraEventos = !this.iraEventos;
  this.mostrarEditar = !this.mostrarEditar;
}



}
