import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { DonneesMondiale } from '../models/donneesmondiale';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WorldDataService {
  private http = inject(HttpClient);

  private readonly API = (environment as any).apiUrl || 'https://restcountries.com/v3.1';

  // ── ROUTE 1 : Liste/Dashboard (original intact) ───
  private readonly FIELDS =
    (environment as any).fields ||
    'name,cca2,cca3,population,area,region,languages,currencies,flags,capital';

  // ── ROUTE 2 : Carte (8 fields, séparée) ──────────
  private readonly FIELDS_MAP = 'name,cca2,population,region,flags,capital,latlng,capitalInfo';

  // ── Signals ───────────────────────────────────────
  pays = signal<DonneesMondiale[]>([]);
  paysMap = signal<DonneesMondiale[]>([]);
  loading = signal<boolean>(false);
  loadingMap = signal<boolean>(false);
  error = signal<string | null>(null);

  // ─── STATISTIQUES (COMPUTED) ────────────────────────────────
  totalPays = computed(() => this.pays().length);
  populationMondiale = computed(() => this.pays().reduce((acc, p) => acc + (p.population ?? 0), 0));

  totalLangues = computed(() => {
    const set = new Set<string>();
    this.pays().forEach(
      (p) => p.languages && Object.values(p.languages).forEach((l) => set.add(l as string)),
    );
    return set.size;
  });

  topPopulation = computed(() =>
    [...this.pays()].sort((a, b) => (b.population || 0) - (a.population || 0)).slice(0, 10),
  );

  paysByRegion = computed(() => {
    const statsMap = new Map<string, number>();
    this.pays().forEach(
      (p) => p.region && statsMap.set(p.region, (statsMap.get(p.region) ?? 0) + 1),
    );
    return Array.from(statsMap.entries())
      .map(([region, count]) => ({ region, count }))
      .sort((a, b) => b.count - a.count);
  });

  // ─── COMPUTED CARTE ─────────────────────────────────────────
  pointsCapitales = computed(() =>
    this.paysMap()
      .map((p) => {
        const coords = p.capitalInfo?.latlng ?? p.latlng;
        if (!coords || coords.length < 2) return null;
        return { pays: p, lat: coords[0], lng: coords[1] };
      })
      .filter((pt): pt is NonNullable<typeof pt> => pt !== null),
  );

  pointsPays = computed(() =>
    this.paysMap()
      .map((p) => {
        if (!p.latlng || p.latlng.length < 2) return null;
        return { pays: p, lat: p.latlng[0], lng: p.latlng[1] };
      })
      .filter((pt): pt is NonNullable<typeof pt> => pt !== null),
  );

  // ─── MÉTHODES HTTP ──────────────────────────────────────────

  // ROUTE 1 — original intact
  loadAll(): Observable<DonneesMondiale[]> {
    if (this.pays().length > 0) return of(this.pays());
    this.loading.set(true);

    return this.http.get<DonneesMondiale[]>(`${this.API}/all?fields=${this.FIELDS}`).pipe(
      tap((data) => {
        this.pays.set(data);
        this.loading.set(false);
      }),
      catchError(() => {
        this.error.set('Erreur de connexion API.');
        this.loading.set(false);
        return of([]);
      }),
    );
  }

  // ROUTE 2 — carte uniquement
  loadMapData(): Observable<DonneesMondiale[]> {
    if (this.paysMap().length > 0) return of(this.paysMap());
    this.loadingMap.set(true);

    return this.http.get<DonneesMondiale[]>(`${this.API}/all?fields=${this.FIELDS_MAP}`).pipe(
      tap((data) => {
        this.paysMap.set(data);
        this.loadingMap.set(false);
      }),
      catchError(() => {
        this.loadingMap.set(false);
        return of([]);
      }),
    );
  }

  // ROUTE 3 — détail d'un pays
  // ← On appelle TOUJOURS l'API pour avoir langues, monnaies, frontières...
  // On ne prend PAS le cache pays() car il n'a pas tous les champs
  getPaysByCode(code: string): Observable<DonneesMondiale | null> {
    return this.http.get<DonneesMondiale[]>(`${this.API}/alpha/${code}`).pipe(
      // L'API retourne un tableau même pour un seul pays
      tap(() => {}),
      catchError(() => {
        this.error.set('Impossible de trouver les détails de ce pays.');
        return of(null);
      }),
    ) as Observable<DonneesMondiale | null>;
  }

  // ─── HELPERS ────────────────────────────────────────────────
  searchByName(q: string) {
    return !q.trim()
      ? this.pays()
      : this.pays().filter((p) => p.name.common.toLowerCase().includes(q.toLowerCase()));
  }

  formatPopulation(n: number | undefined) {
    if (!n) return '0';
    if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
    return n >= 1e3 ? (n / 1e3).toFixed(0) + 'K' : n.toString();
  }

  /** Filtre les pays par continent (région) */
  getPaysParContinent(continent: string) {
    return computed(() => {
      return this.pays().filter((p) => p.region.toLowerCase() === continent.toLowerCase());
    });
  }

  /** Liste unique des continents disponibles */
  continents = computed(() => {
    const regions = this.pays().map((p) => p.region);
    return [...new Set(regions)].filter((r) => r).sort();
  });

  // --- AJOUTE CECI DANS TON SERVICE ---
  searchTerm = signal<string>(''); // Le terme tapé dans le header

  // Résultat filtré automatiquement dès que searchTerm ou pays change
  searchResults = computed(() => {
    const q = this.searchTerm().toLowerCase().trim();
    if (!q) return [];

    return this.pays()
      .filter(
        (p) =>
          p.name.common.toLowerCase().includes(q) ||
          p.cca2.toLowerCase() === q ||
          p.cca3.toLowerCase() === q,
      )
      .slice(0, 8); // On limite à 8 résultats pour l'affichage
  });
}
