import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WorldDataService } from '../../core/services/world-data-service';

@Component({
  selector: 'app-pays-europe',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './europe.html',
})
export class Europe implements OnInit {
  ws = inject(WorldDataService);
  currentPage = signal(1);
  pageSize = 20;

  allPaysEurope = computed(() => {
    return this.ws
      .pays()
      .filter((p) => p.region === 'Europe')
      .sort((a, b) => a.name.common.localeCompare(b.name.common));
  });

  pagedPaysEurope = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.allPaysEurope().slice(start, start + this.pageSize);
  });

  totalPages = computed(() => Math.ceil(this.allPaysEurope().length / this.pageSize));

  stats = computed(() => {
    const liste = this.allPaysEurope();
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
