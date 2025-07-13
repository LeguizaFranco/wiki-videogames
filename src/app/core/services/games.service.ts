import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Game } from '../../shared/interfaces/game.interface';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class GamesService {

  private mockApiUrl = environment.mockApiUrl;

  private _games = new BehaviorSubject<Game[]>([]);
  public games$: Observable<Game[]> = this._games.asObservable();

  constructor(private http: HttpClient) {
    this.loadGames();
  }

  private loadGames(): void {
    this.http.get<Game[]>(`${this.mockApiUrl}/games`).subscribe({
      next: (games) => {
        this._games.next(games);
      },
      error: (err) => {
        console.error('Error al cargar juegos desde Mock API:', err);
      }
    });
  }

  getGames(): Observable<Game[]> {
    return this.games$;
  }

  addGame(game: Game): Observable<Game> {
    return this.http.post<Game>(`${this.mockApiUrl}/games`, game).pipe(
      tap((addedGame) => {
        const updatedGames = [...this._games.getValue(), addedGame];
        this._games.next(updatedGames);
      })
    );
  }

  // Método para actualizar un juego existente en la colección principal /games
  updateGame(game: Game): Observable<Game> {
    return this.http.put<Game>(`${this.mockApiUrl}/games/${game.id}`, game).pipe(
      tap((updatedGame) => {
        const currentGames = this._games.getValue();
        const updatedGamesList = currentGames.map(g =>
          g.id === updatedGame.id ? updatedGame : g
        );
        this._games.next(updatedGamesList);

      })
    );
  }

  deleteGame(id: number): Observable<any> {
    return this.http.delete<any>(`${this.mockApiUrl}/games/${id}`).pipe(
      tap(() => {
        const updatedGames = this._games.getValue().filter(g => g.id !== id);
        this._games.next(updatedGames);
      })
    );
  }
}