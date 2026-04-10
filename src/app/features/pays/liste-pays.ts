import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WorldDataService } from '../../core/services/world-data-service';

@Component({
  selector: 'app-liste-pays',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './liste-pays.html',
})
export class ListePays implements OnInit {
  ws = inject(WorldDataService);

  // --- État ---
  searchTerm = signal('');
  currentPage = signal(1);
  pageSize = 10;

  // Filtrage intelligent
  filteredPays = computed(() => {
    const q = this.searchTerm().toLowerCase().trim();
    if (!q) return this.ws.pays();
    return this.ws
      .pays()
      .filter(
        (p) =>
          p.name.common.toLowerCase().includes(q) ||
          p.name.official.toLowerCase().includes(q) ||
          p.cca3.toLowerCase().includes(q),
      );
  });

  // Découpage pour la pagination
  pagedPays = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredPays().slice(start, start + this.pageSize);
  });

  totalPages = computed(() => Math.ceil(this.filteredPays().length / this.pageSize));

  ngOnInit(): void {
    this.ws.loadAll().subscribe();
  }

  // --- Actions ---
  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }
}
