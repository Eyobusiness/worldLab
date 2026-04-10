import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorldDataService } from '../../core/services/world-data-service';
import { DonneesMondiale } from '../../core/models/donneesmondiale';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { switchMap } from 'rxjs'; // On garde bien ça

@Component({
  selector: 'app-details-pays',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './details-pays.html',
})
export class DetailsPays implements OnInit {
  private route = inject(ActivatedRoute);
  private worldService = inject(WorldDataService);

  pays = signal<DonneesMondiale | null>(null);
  loading = signal<boolean>(false); // Optionnel: pour afficher un loader pendant le changement

  ngOnInit() {
    // ── LA CORRECTION EST ICI ──
    // Au lieu de snapshot, on souscrit à paramMap
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const code = params.get('code');
          this.loading.set(true);

          if (code) {
            return this.worldService.getPaysByCode(code);
          }
          return [null]; // Si pas de code, on retourne null
        }),
      )
      .subscribe((data) => {
        // Traitement des données
        const result = Array.isArray(data) ? data[0] : data;
        this.pays.set(result);
        this.loading.set(false);
      });
  }
}
