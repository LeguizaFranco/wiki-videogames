import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameFormComponent } from '../../../../shared/components/game-form/game-form.component';
import { Game } from '../../../../shared/interfaces/game.interface';
import { GamesService } from '../../../../core/services/games.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-game',
  standalone: true,
  imports: [CommonModule, GameFormComponent],
  templateUrl: './add-game.component.html',
  styleUrl: './add-game.component.css'
})
export class AddGameComponent {
  constructor(private gamesService: GamesService, private router: Router) { }

  onNewGameSubmit(newGame: Game): void {

    const gameToSend = { ...newGame };
    if (gameToSend.id === null || gameToSend.id === undefined) {
      delete gameToSend.id;
    }

    this.gamesService.addGame(gameToSend).subscribe({
      next: (gameAdded) => {
        alert(`Juego "${gameAdded.name}" añadido exitosamente.`);
        this.router.navigate(['/games']);
      },
      error: (err) => {

        alert(`Error al añadir juego: ${err.message || 'Desconocido'}`);
      }
    });
  }

  onCancelAdd(): void {
    this.router.navigate(['/']);
  }
}