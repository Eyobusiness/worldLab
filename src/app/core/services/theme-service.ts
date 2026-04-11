import { Injectable, signal, effect, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  isDark = signal<boolean>(true);

  /**
   * Sidebar :
   *  - Desktop (≥768px) : ouvert par défaut
   *  - Mobile (<768px)  : fermé par défaut
   */
  sidebarOpen = signal<boolean>(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    // Restaure le thème sauvegardé
    if (this.isBrowser) {
      const saved = localStorage.getItem('theme');
      this.isDark.set(saved ? saved === 'dark' : true);
    }

    // Synchronise theme + localStorage + classe HTML + barre d’adresse mobile
    effect(() => {
      const dark = this.isDark();
      if (this.isBrowser) {
        localStorage.setItem('theme', dark ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', dark);
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) {
          meta.setAttribute('content', dark ? '#0b1120' : '#f9fafb');
        }
      }
    });

    // Ferme le menu si on passe en mobile après un resize
    if (this.isBrowser) {
      window.addEventListener('resize', () => {
        if (window.innerWidth < 768) {
          this.sidebarOpen.set(false);
        } else {
          this.sidebarOpen.set(true);
        }
      });
    }
  }

  toggleTheme() {
    this.isDark.update((v) => !v);
  }

  toggleSidebar() {
    this.sidebarOpen.update((v) => !v);
  }
}
