import { Component, inject, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './error.html',
})
export class Error {
  // Permet de passer un code d'erreur personnalisé (ex: 404, 500)
  code = input<string>('404');
  message = input<string>('Oups ! La page que vous cherchez semble avoir disparu du globe.');
}
