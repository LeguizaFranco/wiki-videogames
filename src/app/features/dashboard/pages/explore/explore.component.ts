import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from '../../../../shared/interfaces/game.interface';
import { GamesService } from '../../../../core/services/games.service';
import { FavoriteGamesService } from '../../../../core/services/favorite-games.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css'
})
export class ExploreComponent implements OnInit, OnDestroy {
  games: Game[] = [];
  favoriteGameIds: number[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  private isAdding: { [gameId: number]: boolean } = {};
  private destroy$ = new Subject<void>();

  constructor(
    private gamesService: GamesService,
    private favoriteGamesService: FavoriteGamesService
  ) { }

  ngOnInit() {
    this.gamesService.games$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (gamesData) => {

        this.games = gamesData;
        this.isLoading = false;
      },
      error: (err) => {

        this.errorMessage = 'No se pudieron cargar los juegos principales.';
        this.isLoading = false;
      }
    });

    this.favoriteGamesService.favorites$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (favoritesData) => {
        this.favoriteGameIds = favoritesData
          .filter(game => game.id !== undefined && game.id !== null) // Asegura que el ID existe
          .map(game => game.id as number); // Cast a number si TypeScript se queja
      },
      error: (err) => {
        console.error('Error al cargar favoritos:', err);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Añadir un juego a favoritos
  addGameToFavorites(game: Game): void {

    if (game.id === undefined || game.id === null) {

      return; // No procedas si no hay ID
    }

    const gameId = game.id; // Asignar a una variable local para claridad si lo deseas

    // Si ya es favorito o si ya se está añadiendo, no hacemos nada
    if (this.isFavorite(gameId) || this.isAdding[gameId]) {
      return;
    }

    this.isAdding[gameId] = true; // Marca que este juego está en proceso de añadido

    this.favoriteGamesService.addFavorite(game).subscribe({
      next: (addedGame) => {

        if (addedGame.id !== undefined && addedGame.id !== null) {
          delete this.isAdding[addedGame.id];
        }
      },
      error: (err) => {

        // Si el juego ya está en favoritos (validación del servicio), el botón se actualizará
        if (!err.message || !err.message.includes('ya está en favoritos')) {
          alert(`Error al añadir "${game.name}" a favoritos: ${err.message || 'Desconocido'}`);
        }
        delete this.isAdding[gameId];
      }
    });
  }

  // Verifica si un juego es favorito (desde la lista de favoritos persistente)

  isFavorite(gameId: number): boolean {
    return this.favoriteGameIds.includes(gameId);
  }

  // Verifica si el botón debe estar deshabilitado

  isButtonDisabled(gameId: number): boolean {
    return this.isFavorite(gameId) || this.isAdding[gameId];
  }
}