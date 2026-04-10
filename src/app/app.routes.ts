
import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth-guard';

export const routes: Routes = [
  // ── ROUTES PUBLIQUES (Indépendantes, pas de Menu/Header) ──────
  {
    path: 'login',
    title: 'Connexion - WorldLab',
    loadComponent: () => import('./features/auth/login').then((m) => m.Login),
  },
  {
    path: 'error',
    title: 'Page non trouvée',
    loadComponent: () => import('./features/error/error').then((m) => m.Error),
  },

  // ── ROUTES PROTÉGÉES (Avec Menu, Header et Sidebar) ───────────
  {
    path: '',
    // On utilise ici le composant que tu as créé pour le layout principal

    // Assure-toi d'avoir déplacé ton code de App vers MainLayout
    loadComponent: () => import('./layout/main').then((m) => m.Main),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        title: 'Dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'pays',
        title: 'Liste des Pays',
        loadComponent: () => import('./features/pays/liste-pays').then((m) => m.ListePays),
      },
      {
        path: 'pays',
        title: 'Liste des Pays',
        loadComponent: () => import('./features/pays/liste-pays').then((m) => m.ListePays),
      },
      {
        path: 'comparaison',
        title: 'Comparaison des statistiques',
        loadComponent: () => import('./features/comparaison/comparaison').then((m) => m.Comparaison),
      },
      {
        path: 'details-pays/:code',
        title: 'Détails du Pays',
        loadComponent: () => import('./features/pays/details-pays').then((m) => m.DetailsPays),
      },
      {
        path: 'comparaison',
        title: 'Comparaison des statistiques',
        loadComponent: () =>
          import('./features/comparaison/comparaison').then((m) => m.Comparaison),
      },

      // ── Continents ──
      {
        path: 'africa',
        title: "Pays d'Afrique",
        loadComponent: () => import('./features/continent/africa').then((m) => m.Africa),
      },
      {
        path: 'asia',
        title: "Pays d'Asie",
        loadComponent: () => import('./features/continent/asia').then((m) => m.Asia),
      },
      {
        path: 'americas',
        title: 'Pays des Amériques',
        loadComponent: () => import('./features/continent/americas').then((m) => m.Americas),
      },
      {
        path: 'europe',
        title: "Pays d'Europe",
        loadComponent: () => import('./features/continent/europe').then((m) => m.Europe),
      },
      {
        path: 'oceania',
        title: "Pays d'Océanie",
        loadComponent: () => import('./features/continent/oceania').then((m) => m.Oceania),
      },
      {
        path: 'antarctic',
        title: "Pays de l'Antarctique",
        loadComponent: () => import('./features/continent/antarctic').then((m) => m.Antarctic),
      },
      {
        path: 'liste-users',
        title: "Liste des utilisateurs",
        loadComponent: () => import('./features/users/liste-users').then((m) => m.ListeUsers),
      },
    ],
  },

  // ── Fallback ──
  { path: '**',
    title: 'Page non trouvée',
    redirectTo: 'error' },
];
