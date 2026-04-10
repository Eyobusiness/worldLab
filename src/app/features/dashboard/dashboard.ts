import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WorldDataService } from '../../core/services/world-data-service';
import { WorldMap } from './world-map';

// Couleurs par région (identiques au menu sidebar)
const REGION_CONFIG: Record<string, { color: string; bg: string; emoji: string }> = {
  Africa: { color: '#ef4444', bg: 'bg-red-500/20', emoji: '🌍' },
  Asia: { color: '#f0a500', bg: 'bg-[#f0a500]/20', emoji: '🌏' },
  Americas: { color: '#22c55e', bg: 'bg-emerald-500/20', emoji: '🌎' },
  Europe: { color: '#38bdf8', bg: 'bg-sky-500/20', emoji: '🌐' },
  Oceania: { color: '#a78bfa', bg: 'bg-violet-500/20', emoji: '🏝️' },
  Antarctic: { color: '#94a3b8', bg: 'bg-slate-500/20', emoji: '❄️' },
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CommonModule, RouterModule, WorldMap],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  ws = inject(WorldDataService);

  // Nombre de pays affichés dans le TOP
  topLimit = signal(5);

  ngOnInit(): void {
    this.ws.loadAll().subscribe();
  }

  // ─── Helpers template ──────────────────────────────────────────

  getRegionConfig(region: string) {
    return REGION_CONFIG[region] ?? { color: '#94a3b8', bg: 'bg-slate-500/20', emoji: '🌍' };
  }

  /** Barre de progression relative au max de la région */
  getBarWidth(count: number): string {
    const counts = this.ws.paysByRegion().map((r) => r.count);
    if (counts.length === 0) return '0%';
    const max = Math.max(...counts);
    return `${Math.round((count / max) * 100)}%`;
  }

  /** Taux de croissance fictif +0.9% (API ne le fournit pas) */
  get croissancePopulation(): string {
    return '+0.9% / an';
  }

  /** Sécurisé : Retourne une valeur par défaut car 'timezones' est exclu des 10 champs */
  // get plageUTC(): string {
  //   // Puisque l'API est limitée à 10 champs, on évite de faire planter le calcul
  //   try {
  //     const tz = this.ws.fuseauxHoraires();
  //     if (!tz || !tz.length) return 'UTC-12 → UTC+14'; // Valeur standard mondiale
  //     return `${tz[0]} → ${tz[tz.length - 1]}`;
  //   } catch {
  //     return 'UTC-12 → UTC+14';
  //   }
  // }

  /** Pays affichés dans le top */
  get topPays() {
    return this.ws.topPopulation().slice(0, this.topLimit());
  }

  /** Largeur de la barre population (relative au 1er) */
  getPopBarWidth(pop: number): string {
    const top = this.ws.topPopulation();
    const max = top.length > 0 ? (top[0]?.population ?? 1) : 1;
    return `${Math.round((pop / max) * 100)}%`;
  }

  /** Couleur de la barre selon le rang */
  getPopBarColor(index: number): string {
    const colors = [
      '#f0a500',
      '#f0a500',
      '#38bdf8',
      '#22c55e',
      '#a78bfa',
      '#ef4444',
      '#f97316',
      '#06b6d4',
      '#84cc16',
      '#ec4899',
    ];
    return colors[index] ?? '#94a3b8';
  }
}
