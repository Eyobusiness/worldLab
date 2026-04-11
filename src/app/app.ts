import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from './core/services/theme-service';
import { PwaInstallBanner } from './layout/pwa-install-banner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, PwaInstallBanner],
  template: `
    <router-outlet />
    <app-pwa-install />
  `,
})
export class App {
  /** Initialise le thème (classe `dark` sur la balise html) sur toutes les routes, y compris /login. */
  private _theme = inject(ThemeService);
}
