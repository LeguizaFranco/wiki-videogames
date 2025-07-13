import { Routes } from '@angular/router';
import { ExploreComponent } from '../app/features/dashboard/pages/explore/explore.component'; // <--- Verifica la ruta según tu estructura
import { FavoritesComponent } from '../app/features/dashboard/pages/favorites/favorites.component';
import { AddGameComponent } from '../app/features/dashboard/pages//add-game/add-game.component';

export const routes: Routes = [
    { path: 'explore', component: ExploreComponent },
    { path: 'favorites', component: FavoritesComponent },
    { path: 'add-game', component: AddGameComponent },
    { path: '', redirectTo: '/explore', pathMatch: 'full' },
    { path: '**', redirectTo: '/explore' }
];