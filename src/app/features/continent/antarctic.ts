import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WorldDataService } from '../../core/services/world-data-service';

@Component({
  selector: 'app-pays-antarctic',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './antarctic.html',
})
export class Antarctic implements OnInit {
  ws = inject(WorldDataService);
  currentPage = signal(1);
  pageSize = 20; // Pas vraiment besoin de pagination ici (très peu de pays/territoires), mais on garde la structure.

  allPaysAntarctic = computed(() => {
    return this.ws
      .pays()
      .filter((p) => p.region === 'Antarctic')
      .sort((a, b) => a.name.common.localeCompare(b.name.common));
  });

  pagedPaysAntarctic = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.allPaysAntarctic().slice(start, start + this.pageSize);
  });

  totalPages = computed(() => Math.ceil(this.allPaysAntarctic().length / this.pageSize));

  stats = computed(() => {
    const liste = this.allPaysAntarctic();
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
    }
  }
}
