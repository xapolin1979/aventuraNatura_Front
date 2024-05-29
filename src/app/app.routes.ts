import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PublicEventsComponent } from './public-events/public-events.component';
export const routes: Routes = [
    {path:'',component:HomeComponent},
    {path:'events',component:PublicEventsComponent}

];
