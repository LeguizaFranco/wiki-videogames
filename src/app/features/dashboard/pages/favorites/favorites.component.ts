import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from '../../../../shared/interfaces/game.interface';
import { FavoriteGamesService } from '../../../../core/services/favorite-games.service';
import { GamesService } from '../../../../core/services/games.service';
import { GameFormComponent } from '../../../../shared/components/game-form/game-form.component';
import { Subject, takeUntil } from 'rxjs';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, GameFormComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit, OnDestroy {
  favorites: Game[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;
  editingGame: Game | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private favoriteGamesService: FavoriteGamesService,
    private gamesService: GamesService
  ) { }

  ngOnInit(): void {
    this.favoriteGamesService.favorites$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (favoritesData) => {
        this.favorites = favoritesData;
        this.isLoading = false;
      },
      error: (err) => {

        this.errorMessage = 'No se pudieron cargar tus juegos favoritos.';
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  startEdit(game: Game): void {

    if (game.id === undefined || game.id === null) {

      alert('Error: No se puede editar un juego sin un identificador válido.');
      return;
    }
    this.editingGame = { ...game }; // Crea una copia para evitar mutaciones directas.
  }

  cancelEdit(): void {
    this.editingGame = null;
  }

  onEditFormSubmit(updatedGame: Game): void {

    if (!this.editingGame || this.editingGame.id === undefined || this.editingGame.id === null) {

      alert('Error: No se pudo procesar la actualización del juego. ID no válido.');
      this.cancelEdit(); // Cierra el formulario si hay un problema
      return;
    }
    updatedGame.id = this.editingGame.id;


    const updateFavorite$ = this.favoriteGamesService.updateFavorite(updatedGame);
    const updateGame$ = this.gamesService.updateGame(updatedGame);


    forkJoin([updateFavorite$, updateGame$]).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: ([favResult, gameResult]) => {

        alert(`"${favResult.name}" ha sido actualizado en tus favoritos y en la lista principal.`);
        this.cancelEdit();
      },
      error: (err) => {

        this.errorMessage = `Error al actualizar el juego: ${err.message || 'Desconocido'}`;
        alert(this.errorMessage);

      }
    });
  }

  removeFavorite(gameId: number, gameName: string): void {

    if (gameId === undefined || gameId === null) {

      alert('Error: No se puede eliminar el juego porque no tiene un ID válido.');
      return;
    }

    if (confirm(`¿Estás seguro de que quieres eliminar "${gameName}" de tus favoritos?`)) {
      this.favoriteGamesService.removeFavorite(gameId).subscribe({
        next: () => {
          alert(`"${gameName}" ha sido eliminado de tus favoritos.`);
        },
        error: (err) => {

          alert(`Error al eliminar el juego favorito: ${err.message || 'Desconocido'}`);
        }
      });
    }
  }
}