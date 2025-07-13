import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Game } from '../../shared/interfaces/game.interface';
import { environment } from '../../../environments/environment.prod';


@Injectable({
  providedIn: 'root'
})

export class FavoriteGamesService {
  private mockApiUrl = environment.mockApiUrl;

  private _favorites = new BehaviorSubject<Game[]>([]);
  public favorites$: Observable<Game[]> = this._favorites.asObservable();

  constructor(private http: HttpClient) {
    this.loadFavorites();
  }

  private loadFavorites(): void {
    this.http.get<Game[]>(`${this.mockApiUrl}/favorites`).subscribe({
      next: (favorites) => {
        this._favorites.next(favorites);
      },
      error: (err) => {
        console.error('Error al cargar favoritos desde Mock API:', err);
      }
    });
  }

  addFavorite(game: Game): Observable<Game> {
    const currentFavorites = this._favorites.getValue();
    if (currentFavorites.some(fav => fav.id === game.id)) {
      return new Observable<Game>(observer => {
        observer.error(new Error('El juego ya está en favoritos.'));
        observer.complete();
      });
    }

    return this.http.post<Game>(`${this.mockApiUrl}/favorites`, game).pipe(
      tap((addedGame) => {
        const updatedFavorites = [...currentFavorites, addedGame];
        this._favorites.next(updatedFavorites);
        console.log('Juego añadido a favoritos (persistente):', addedGame.id);
      })
    );
  }

  removeFavorite(gameId: number): Observable<any> {
    return this.http.delete<any>(`${this.mockApiUrl}/favorites/${gameId}`).pipe(
      tap(() => {
        const updatedFavorites = this._favorites.getValue().filter(game => game.id !== gameId);
        this._favorites.next(updatedFavorites);
        console.log('Juego eliminado de favoritos (persistente):', gameId);
      })
    );
  }

  updateFavorite(game: Game): Observable<Game> {
    return this.http.put<Game>(`${this.mockApiUrl}/favorites/${game.id}`, game).pipe(
      tap((updatedGame) => {
        const updatedFavorites = this._favorites.getValue().map(g =>
          g.id === updatedGame.id ? updatedGame : g
        );
        this._favorites.next(updatedFavorites);
        console.log('Juego actualizado en favoritos (persistente):', updatedGame.id);
      })
    );
  }

  isFavorite(gameId: number): boolean {
    return this._favorites.getValue().some(game => game.id === gameId);
  }
}