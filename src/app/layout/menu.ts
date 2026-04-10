import { Component, signal, inject, computed } from '@angular/core'; // Ajout de computed
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../core/services/theme-service';
import { WorldDataService } from '../core/services/world-data-service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLinkActive],
  templateUrl: './menu.html',
})
export class Menu {
  theme = inject(ThemeService);
  ws = inject(WorldDataService);

  // --- VARIABLES POUR LES TOTAUX ---
  totalPays = computed(() => this.ws.pays().length);

  totalAfrique = computed(() => this.ws.pays().filter((p) => p.region === 'Africa').length);

  totalAsie = computed(() => this.ws.pays().filter((p) => p.region === 'Asia').length);

  totalAmeriques = computed(() => this.ws.pays().filter((p) => p.region === 'Americas').length);

  totalEurope = computed(() => this.ws.pays().filter((p) => p.region === 'Europe').length);

  totalOceanie = computed(() => this.ws.pays().filter((p) => p.region === 'Oceania').length);

  totalAntarctique = computed(() => this.ws.pays().filter((p) => p.region === 'Antarctic').length);
  // ---------------------------------

  profilExpanded = signal(false);
  adminExpanded = signal(false);

  toggleProfil() {
    this.profilExpanded.update((v) => !v);
  }

  toggleAdmin() {
    this.adminExpanded.update((v) => !v);
  }

  closeOnMobile() {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      this.theme.sidebarOpen.set(false);
    }
  }
}
