import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Champs du formulaire
  username = signal('');
  password = signal('');

  // Afficher/masquer le mot de passe
  showPassword = signal(false);

  // Raccourcis vers les signals du service
  loading = this.authService.loading;
  error = this.authService.error;

  // Astuce : liste des comptes de test JSONPlaceholder
  demoAccounts = [
    { username: 'Bret', password: 'terB' },
    { username: 'Antonette', password: 'ettenotnA' },
    { username: 'Samantha', password: 'ahtnamaS' },
  ];

  onSubmit(): void {
    const u = this.username().trim();
    const p = this.password().trim();

    if (!u || !p) {
      this.authService.error.set('Remplissez tous les champs.');
      return;
    }

    this.authService.login(u, p).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => {
        /* error déjà géré dans le service */
      },
    });
  }

  fillDemo(account: { username: string; password: string }): void {
    this.username.set(account.username);
    this.password.set(account.password);
    this.authService.error.set(null);
  }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }
}
