import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header';
import { Footer } from './footer';
import { Menu } from './menu';
import { ThemeService } from '../core/services/theme-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Header, Footer, Menu],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-[#0B1120] text-gray-900 dark:text-white font-sans">
      <!-- ① Header fixé en haut, toujours pleine largeur -->
      <app-header></app-header>

      <!-- ② Sidebar : fixed, géré en interne (overlay mobile, permanent desktop) -->
      <app-menu></app-menu>

      <!-- ③ Zone principale : marge-gauche uniquement sur desktop quand sidebar ouverte -->
      <div
        class="flex flex-col min-h-screen pt-16 transition-all duration-300 ease-in-out"
        [ngClass]="{
          'md:pl-64': themeService.sidebarOpen(),
          'md:pl-0': !themeService.sidebarOpen(),
        }"
      >
        <!-- Contenu des pages -->
        <main class="flex-1 p-4 md:p-6 custom-scrollbar overflow-y-auto">
          <router-outlet></router-outlet>
        </main>

        <!-- Footer toujours en bas du contenu principal -->
        <app-footer></app-footer>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(240, 165, 0, 0.2);
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(240, 165, 0, 0.4);
      }
    `,
  ],
})
export class Main {
  public themeService = inject(ThemeService);
  protected readonly title = signal('WorldLab Explorer');
}
