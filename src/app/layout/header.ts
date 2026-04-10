import { withEventReplay } from '@angular/platform-browser';
import { Component, signal, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../core/services/theme-service';
import { AuthService } from '../core/services/auth-service'; // ← ajouter
import { Router } from '@angular/router';
import { WorldDataService } from '../core/services/world-data-service'; // ← ajouter

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
})
export class Header {
  private router = inject(Router);
  theme = inject(ThemeService);
  authService = inject(AuthService); // ← ajouter
  worldService = inject(WorldDataService); // ← ajouter

  searchOpen = signal(false);
  profileOpen = signal(false);
  searchQuery = signal('');

  // ── Getters utilisateur ─────────────────────────
  get initials(): string {
    return this.authService.currentUser()?.initials ?? 'WL';
  }

  get displayName(): string {
    return this.authService.currentUser()?.name ?? 'Invité';
  }

  get displayEmail(): string {
    return this.authService.currentUser()?.email ?? '';
  }
  // ────────────────────────────────────────────────

  toggleSearch() {
    this.searchOpen.update((v) => !v);
    if (!this.searchOpen()) this.searchQuery.set('');
  }

  toggleProfile() {
    this.profileOpen.update((v) => !v);
  }

  closeProfile() {
    this.profileOpen.set(false);
  }

  logout() {
    // ← ajouter
    this.closeProfile();
    this.authService.logout();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('#profile-menu') && !target.closest('#profile-btn')) {
      this.profileOpen.set(false);
    }
    if (!target.closest('#search-bar') && !target.closest('#search-btn')) {
      this.searchOpen.set(false);
    }
  }

  onSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.worldService.searchTerm.set(value);
  }

  goToDetails(code: string) {
    this.worldService.searchTerm.set(''); // On vide la recherche
    this.searchOpen.set(false); // On ferme la barre mobile
    this.router.navigate(['/details-pays', code]);
  }

}
