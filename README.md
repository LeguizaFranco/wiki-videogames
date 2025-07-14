
# 🎮 WikiVideoGames

WikiVideoGames es una aplicación desarrollada en Angular que permite a los usuarios explorar videojuegos registrados, gestionar una lista de favoritos, y agregar o editar información de juegos. Está diseñada como un proyecto académico utilizando tecnologías modernas como **Angular**, **Tailwind CSS**, y un servidor mock con **json-server**.

---

## 🚀 Funcionalidades

- 🔍 **Explorar juegos registrados**  
- ⭐ **Ver juegos favoritos**  
- ➕ **Agregar un nuevo juego**  
- 🗑️ **Eliminar un juego de favoritos**  
- ✏️ **Editar información de juegos favoritos**

---

## 🛠️ Tecnologías

- **Angular**  
- **Tailwind CSS**  
- **json-server** (mock API en `localhost:3000`)

---

## 🗂️ Estructura del Proyecto

```
src/
└── app/
    ├── core/
    │   └── services/
    │       ├── favorite-games.service.ts
    │       └── games.service.ts
    ├── features/
    │   └── dashboard/
    │       └── pages/
    │           ├── add-game/
    │           │   ├── add-game.component.ts/html/css
    │           ├── explore/
    │           │   ├── explore.component.ts/html/css
    │           └── favorites/
    │               ├── favorites.component.ts/html/css
    ├── shared/
    │   ├── components/
    │   │   ├── container/
            |   ├── container.component.ts/html/css
    │   │   ├── game-form/
            |   ├── game-form.component.ts/html/css
    │   │   └── header/
            |   ├── header.component.ts/html/css
    │   └── interfaces/
    │       └── game.interface.ts
    ├── app.component.ts/html/css
    ├── app.config.ts
    └── app.routes.ts
├── data/
       └── db.json ← mock API con json-server
├──environments/
    └── environment.prod.ts
    └── environment.ts
```

📌 **Nota:**  
- La carpeta `data/` contiene un archivo `db.json` utilizado como base de datos mock para simular llamadas HTTP usando `json-server`.  
- La carpeta `environments/` gestiona las configuraciones según el entorno (dev/prod).

---

## 📦 Instalación y ejecución

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/wiki-video-games.git
cd wiki-video-games

# Instalar dependencias
npm install

# Ejecutar json-server en paralelo (puerto 3000)
npx json-server --watch src/app/data/db.json --port 3000

# Iniciar la app Angular
ng serve
```

---

## 🌐 Proyecto Editable en StackBlitz

Además, se requerirá asociar el proyecto a StackBlitz para facilitar la edición en línea. Puedes acceder al proyecto editable mediante el siguiente enlace:

```
https://stackblitz.com/~/github.com/LeguizaFranco/wiki-videogames
```

---

## 👤 Autor

**Franco Leguiza**  
- DNI: 44.928.045  
- Email: [francoleguiza002@gmail.com](mailto:francoleguiza002@gmail.com)  
- Sede: Tandil

