import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth-service'; // Vérifie le chemin
import { User } from '../../core/models/users';

@Component({
  selector: 'app-liste-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './liste-users.html',
})
export class ListeUsers implements OnInit {
  private authService = inject(AuthService);

  // On utilise un signal pour stocker la liste des utilisateurs
  users = signal<User[]>([]);
  loading = signal<boolean>(true);

  ngOnInit(): void {
    // On charge les utilisateurs au démarrage
    this.authService.getUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
