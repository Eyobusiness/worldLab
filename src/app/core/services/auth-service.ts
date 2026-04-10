import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, map, catchError, throwError } from 'rxjs';
import { User, AuthUser } from '../models/users';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly API = 'https://jsonplaceholder.typicode.com/users';
  private readonly KEY = 'wl-auth-user';

  // ── Signals ────────────────────────────────────────
  currentUser = signal<AuthUser | null>(this.loadFromStorage());
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  // ── Getter (pas de parenthèses dans les templates) ─
  get isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  // ── Connexion ───────────────────────────────────────
  // JSONPlaceholder n'a pas de vrai login, on simule :
  // username + password → on cherche l'user par username
  login(username: string, password: string): Observable<AuthUser> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.get<User[]>(this.API).pipe(
      map((users) => {
        // Simuler la vérification : on cherche l'username
        // Le "mot de passe" accepté = username inversé (ex: Bret → terB)
        const found = users.find((u) => u.username.toLowerCase() === username.toLowerCase());

        if (!found) {
          throw new Error('Utilisateur introuvable.');
        }

        // Vérification basique du mot de passe simulé
        // En prod tu remplaceras par un vrai appel API POST /auth/login
        if (password !== found.username.split('').reverse().join('')) {
          throw new Error('Mot de passe incorrect.');
        }

        // Construire l'objet AuthUser
        const authUser: AuthUser = {
          id: found.id,
          name: found.name,
          username: found.username,
          email: found.email,
          initials: this.buildInitials(found.name),
        };

        return authUser;
      }),

      tap((authUser) => {
        this.currentUser.set(authUser);
        this.loading.set(false);
        // Persister en localStorage
        localStorage.setItem(this.KEY, JSON.stringify(authUser));
      }),

      catchError((err: Error) => {
        this.loading.set(false);
        this.error.set(err.message || 'Erreur de connexion.');
        return throwError(() => err);
      }),
    );
  }

  // ── Déconnexion ─────────────────────────────────────
  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem(this.KEY);
    this.router.navigate(['/login']);
  }

  // ── Charger tous les users (pour la page Admin) ─────
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.API);
  }

  // ── Charger un user par ID ──────────────────────────
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.API}/${id}`);
  }

  // ── Privé : récupérer depuis localStorage ───────────
  private loadFromStorage(): AuthUser | null {
    try {
      const saved = localStorage.getItem(this.KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  // ── Privé : construire les initiales ────────────────
  private buildInitials(name: string): string {
    return name
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join('');
  }
}
