import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorldDataService } from '../../core/services/world-data-service';
import { DonneesMondiale } from '../../core/models/donneesmondiale';

export type MapMode = 'capitals' | 'countries';

@Component({
  selector: 'app-world-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './world-map.html',
})
export class WorldMap implements OnInit {

  ws = inject(WorldDataService);

  mode     = signal<MapMode>('capitals');
  hovered  = signal<DonneesMondiale | null>(null);
  tooltipX = signal(0);
  tooltipY = signal(0);

  readonly W = 1000;
  readonly H = 500;

  ngOnInit(): void {
    // ← loadMapData() et non loadAll()
    if (this.ws.paysMap().length === 0) {
      this.ws.loadMapData().subscribe();
    }
  }

  // Sélectionner le bon computed selon le mode
  points = computed(() =>
    this.mode() === 'capitals'
      ? this.ws.pointsCapitales()
      : this.ws.pointsPays()
  );

  lngToX(lng: number): number {
    return ((lng + 180) / 360) * this.W;
  }

  latToY(lat: number): number {
    return ((90 - lat) / 180) * this.H;
  }

  onHover(event: MouseEvent, pays: DonneesMondiale): void {
    this.hovered.set(pays);
    const rect = (event.currentTarget as Element)
      .closest('.map-container')?.getBoundingClientRect();
    if (rect) {
      this.tooltipX.set(event.clientX - rect.left + 12);
      this.tooltipY.set(event.clientY - rect.top - 40);
    }
  }

  onLeave(): void {
    this.hovered.set(null);
  }

  regionColor(region: string): string {
    const colors: Record<string, string> = {
      'Africa':    '#f0a500',
      'Americas':  '#4ade80',
      'Asia':      '#60a5fa',
      'Europe':    '#f472b6',
      'Oceania':   '#a78bfa',
      'Antarctic': '#94a3b8',
    };
    return colors[region] ?? '#ffffff';
  }
}