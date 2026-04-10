
import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorldDataService } from '../../core/services/world-data-service';
import { DonneesMondiale } from '../../core/models/donneesmondiale';

export type Critere = {
  key: string;
  label: string;
  format: (p: DonneesMondiale) => string;
  value: (p: DonneesMondiale) => number;
  unite: string;
};

@Component({
  selector: 'app-comparaison',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comparaison.html',
})
export class Comparaison implements OnInit {
  ws = inject(WorldDataService);

  // ── Tous les pays (pour la liste déroulante) ──────
  tousPays = computed(() =>
    [...this.ws.pays()].sort((a, b) => a.name.common.localeCompare(b.name.common)),
  );

  // ── Pays sélectionnés (codes cca3) ───────────────
  codesSelectionnes = signal<string[]>([]);

  // ── Pays à comparer (objets complets) ────────────
  paysCompares = computed(() =>
    this.codesSelectionnes()
      .map((code) => this.tousPays().find((p) => p.cca3 === code))
      .filter((p): p is DonneesMondiale => !!p),
  );

  // ── Critères de comparaison disponibles ──────────
  criteres: Critere[] = [
    {
      key: 'population',
      label: 'Population',
      unite: 'hab.',
      value: (p) => p.population ?? 0,
      format: (p) => this.ws.formatPopulation(p.population ?? 0),
    },
    {
      key: 'area',
      label: 'Superficie',
      unite: 'km²',
      value: (p) => p.area ?? 0,
      format: (p) => (p.area ? p.area.toLocaleString() + ' km²' : 'N/A'),
    },
    {
      key: 'langues',
      label: 'Nombre de langues',
      unite: 'langues',
      value: (p) => (p.languages ? Object.keys(p.languages).length : 0),
      format: (p) => (p.languages ? Object.keys(p.languages).length + ' langue(s)' : 'N/A'),
    },
    {
      key: 'densite',
      label: 'Densité de population',
      unite: 'hab/km²',
      value: (p) => (p.area ? Math.round((p.population ?? 0) / p.area) : 0),
      format: (p) =>
        p.area ? Math.round((p.population ?? 0) / p.area).toLocaleString() + ' hab/km²' : 'N/A',
    },
  ];

  // Critères cochés (plusieurs possibles)
  criteresSelectionnes = signal<string[]>(['population', 'area']);

  // ── Erreur de validation ──────────────────────────
  erreur = signal<string | null>(null);

  // ── Résultats visibles après clic sur "Comparer" ──
  afficherResultats = signal(false);

  // ── Recherche dans la liste de pays ──────────────
  recherche = signal('');

  paysFiltres = computed(() => {
    const q = this.recherche().toLowerCase();
    return !q
      ? this.tousPays()
      : this.tousPays().filter(
          (p) => p.name.common.toLowerCase().includes(q) || p.cca3.toLowerCase().includes(q),
        );
  });

  ngOnInit(): void {
    if (this.ws.pays().length === 0) {
      this.ws.loadAll().subscribe();
    }
  }

  // ── Toggle sélection d'un pays ───────────────────
  togglePays(code: string): void {
    this.afficherResultats.set(false);
    this.erreur.set(null);
    const actuel = this.codesSelectionnes();

    if (actuel.includes(code)) {
      // Désélectionner
      this.codesSelectionnes.set(actuel.filter((c) => c !== code));
    } else {
      if (actuel.length >= 10) {
        this.erreur.set('Maximum 10 pays comparables.');
        return;
      }
      this.codesSelectionnes.set([...actuel, code]);
    }
  }

  estSelectionne(code: string): boolean {
    return this.codesSelectionnes().includes(code);
  }

  // ── Toggle critère ────────────────────────────────
  toggleCritere(key: string): void {
    const actuel = this.criteresSelectionnes();
    if (actuel.includes(key)) {
      if (actuel.length === 1) return; // au moins 1 critère
      this.criteresSelectionnes.set(actuel.filter((k) => k !== key));
    } else {
      this.criteresSelectionnes.set([...actuel, key]);
    }
  }

  critereCoche(key: string): boolean {
    return this.criteresSelectionnes().includes(key);
  }

  // ── Critères actifs ──────────────────────────────
  criteresActifs = computed(() =>
    this.criteres.filter((c) => this.criteresSelectionnes().includes(c.key)),
  );

  // ── Lancer la comparaison ─────────────────────────
  comparer(): void {
    if (this.codesSelectionnes().length < 2) {
      this.erreur.set('Sélectionnez au moins 2 pays.');
      return;
    }
    this.erreur.set(null);
    this.afficherResultats.set(true);
  }

  // ── Réinitialiser ────────────────────────────────
  reinitialiser(): void {
    this.codesSelectionnes.set([]);
    this.afficherResultats.set(false);
    this.erreur.set(null);
    this.recherche.set('');
  }

  // ── Max d'un critère (pour la barre de progression) ─
  maxValue(critere: Critere): number {
    const vals = this.paysCompares().map((p) => critere.value(p));
    return Math.max(...vals) || 1;
  }

  // ── Pourcentage pour la barre ─────────────────────
  pourcentage(pays: DonneesMondiale, critere: Critere): number {
    return Math.round((critere.value(pays) / this.maxValue(critere)) * 100);
  }

  // ── Meilleur pays pour un critère ────────────────
  estLeader(pays: DonneesMondiale, critere: Critere): boolean {
    return critere.value(pays) === this.maxValue(critere);
  }

  // ── Couleurs pour chaque pays ─────────────────────
  readonly couleurs = [
    '#f0a500',
    '#4ade80',
    '#60a5fa',
    '#f472b6',
    '#a78bfa',
    '#fb923c',
    '#34d399',
    '#f87171',
    '#38bdf8',
    '#e879f9',
  ];

  couleurPays(index: number): string {
    return this.couleurs[index % this.couleurs.length];
  }
}