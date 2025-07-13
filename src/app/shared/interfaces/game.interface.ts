export interface Game {
    id?: number;
    slug?: string;
    name: string;
    released: string; // Fecha de lanzamiento
    background_image: string; // URL de la imagen
    rating: number; // Rating promedio
    ratings_count?: number;
    // ... puedes añadir más propiedades que te interesen de la respuesta de la API
    // Por ejemplo: platforms, genres, etc.
    // Para ver todas las propiedades, puedes hacer un console.log de la respuesta completa
}