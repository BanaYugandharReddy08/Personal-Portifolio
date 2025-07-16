# Portfolio Monorepo

This repository now contains three separate applications:

- **frontend** – the React UI
- **backend-node** – a small Express middleware layer
- **backend-java** – a Spring Boot service that implements the API logic

## Local development ports

The applications communicate with each other using the following default ports:

- React frontend: **http://localhost:3000**
- Node middleware: **http://localhost:3001**
- Java API service: **http://localhost:8080**
- PostgreSQL database: **localhost:5433**

Make sure these ports are free on your machine or adjust the values in the
corresponding `.env` files before starting the services. Example environment
files are provided as `frontend/.env.example` and `backend-node/.env.example`.

## Frontend

The React code was moved under `frontend/`. All original `npm` scripts continue to work from that folder.

```sh
cd frontend
npm install
npm start
```

Tests are executed the same way:

```sh
cd frontend
npm test
```

Run ESLint to check for coding style issues:

```sh
cd frontend
npm run lint
```

The React app reads `REACT_APP_API_BASE_URL` to know where the Node API is running.
Copy `frontend/.env.example` to `frontend/.env` and adjust the URL if you run the
Node server on a different port. This variable must be set before starting the
dev server or building the project so API calls are proxied correctly.

## Node Backend

`backend-node/` contains a minimal Express server exposing `/login`, `/certificates` and `/leetcode` routes. The `/login` endpoint accepts a **POST** request with a JSON body containing `email` and `password` fields. The route forwards these credentials to the Java backend and returns whatever response it provides.
Copy `backend-node/.env.example` to `backend-node/.env` to configure the Java
backend URL (`JAVA_BASE_URL`) and the port for this Node server (`PORT`). The
defaults are `http://localhost:8080` and `3001` respectively.

```sh
cd backend-node
npm install
npm start
```

## Java Backend

`backend-java/` holds a simple Spring Boot project exposing its API under `/api`. It now implements `/api/login` which validates email and password for the Node layer. Use the Gradle wrapper to run it:

```sh
cd backend-java
./gradlew bootRun
```

Uploaded files (documents, project reports and user photos) are stored in
`backend-java/uploads/`. The `UserController` exposes two endpoints for profile
images:

- `POST /api/users/{id}/photo` – upload a new profile picture
- `GET /api/users/{id}/photo` – download the stored profile picture

Ensure this directory exists (it is created automatically on startup) and is
writeable by the application.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
