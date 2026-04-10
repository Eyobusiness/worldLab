import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router'; // Import ajouté ici
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideServiceWorker } from '@angular/service-worker';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { Interceptorapi } from './core/interceptor/interceptorapi';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    // Ajout de withViewTransitions() ici
    provideRouter(
      routes,
      withViewTransitions({
        skipInitialTransition: true, // Optionnel : évite l'animation au tout premier chargement
      }),
    ),

    provideClientHydration(withEventReplay()),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideHttpClient(withFetch(), withInterceptors([Interceptorapi])),
  ],
};
