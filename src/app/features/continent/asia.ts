import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WorldDataService } from '../../core/services/world-data-service';

@Component({
  selector: 'app-pays-asia',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './asia.html',
})
export class Asia implements OnInit {
  ws = inject(WorldDataService);

  // Pagination
  currentPage = signal(1);
  pageSize = 20;

  // 1. Filtrer uniquement pour l'Asie
  allPaysAsie = computed(() => {
    return this.ws.pays()
      .filter((p) => p.region === 'Asia')
      .sort((a, b) => a.name.common.localeCompare(b.name.common));
  });

  // 2. Découpage pour la pagination
  pagedPaysAsie = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.allPaysAsie().slice(start, start + this.pageSize);
  });

  // 3. Calcul du nombre de pages
  totalPages = computed(() => Math.ceil(this.allPaysAsie().length / this.pageSize));

  // Statistiques
  stats = computed(() => {
    const liste = this.allPaysAsie();
    return {
      count: liste.length,
      population: liste.reduce((acc, p) => acc + (p.population || 0), 0),
    };
  });

  ngOnInit(): void {
    this.ws.loadAll().subscribe();
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
