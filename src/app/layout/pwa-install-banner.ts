import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';

/** Chrome/Edge : affiche un bandeau quand l’installation PWA est proposée par le navigateur. */
@Component({
  selector: 'app-pwa-install',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (visible()) {
      <div
        class="fixed bottom-0 left-0 right-0 z-200 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:bottom-4 md:left-auto md:right-4 md:max-w-sm md:p-0 md:pb-4"
        role="dialog"
        aria-label="Installer l’application"
      >
        <div
          class="flex flex-col gap-2 rounded-2xl border border-white/10 bg-[#0d1224]/95 p-4 shadow-2xl backdrop-blur-md md:flex-row md:items-center md:justify-between"
        >
          <p class="text-sm text-white/90">
            Installez <strong class="text-[#c9a84c]">WorldLab</strong> sur votre écran d’accueil pour un accès rapide.
          </p>
          <div class="flex shrink-0 gap-2">
            <button
              type="button"
              class="rounded-xl bg-[#f0a500] px-4 py-2 text-sm font-bold text-[#0b1120] active:scale-[0.98]"
              (click)="install()"
            >
              Installer
            </button>
            <button
              type="button"
              class="rounded-xl border border-white/15 px-3 py-2 text-sm text-white/80"
              (click)="dismiss()"
            >
              Plus tard
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class PwaInstallBanner {
  private platformId = inject(PLATFORM_ID);
  visible = signal(false);
  private deferred: { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> } | null =
    null;

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (sessionStorage.getItem('pwa-install-dismissed') === '1') return;

    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      this.deferred = e as unknown as {
        prompt: () => Promise<void>;
        userChoice: Promise<{ outcome: string }>;
      };
      this.visible.set(true);
    });

    window.addEventListener('appinstalled', () => {
      this.visible.set(false);
      this.deferred = null;
    });
  }

  async install(): Promise<void> {
    if (!this.deferred) return;
    await this.deferred.prompt();
    await this.deferred.userChoice;
    this.visible.set(false);
    this.deferred = null;
  }

  dismiss(): void {
    sessionStorage.setItem('pwa-install-dismissed', '1');
    this.visible.set(false);
  }
}
