import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './helpers/http.interceptor';
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes,withViewTransitions()),provideHttpClient(withInterceptors([authInterceptor]))]
}; 

