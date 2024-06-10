import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PublicEventsComponent } from './public-events/public-events.component';
import { LoginYregistroComponent } from './login-yregistro/login-yregistro.component';
import { AdministrarEventosComponent } from './administrar-eventos/administrar-eventos.component';
import { AuthGuard } from './guards/auth.guard'; 
import { VerEventoComponent } from './ver-evento/ver-evento.component';
export const routes: Routes = [
    {path:'',component:HomeComponent},
    {path:'events',component:PublicEventsComponent},
    {path:'event/:id',component:VerEventoComponent},
    {path:'login',component:LoginYregistroComponent},
    {path:'usuario',component:AdministrarEventosComponent,canActivate: [AuthGuard]},
  

];

