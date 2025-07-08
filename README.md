# Portfolio Monorepo

This repository now contains three separate applications:

- **frontend** – the React UI
- **backend-node** – a small Express middleware layer
- **backend-java** – a Spring Boot service that implements the API logic

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

The React app reads `REACT_APP_API_BASE_URL` to know where the Node API is running. Create a `.env` file inside `frontend/` and set this variable before starting the dev server or building the project so API calls are proxied correctly.

## Node Backend

`backend-node/` contains a minimal Express server exposing `/login`, `/certificates` and `/leetcode` routes. The `/login` endpoint accepts a **POST** request with a JSON body containing `email` and `password` fields. The route forwards these credentials to the Java backend and returns whatever response it provides. Create a `.env` file inside `backend-node/` and configure the Java backend's base URL via the `JAVA_BASE_URL` variable (defaults to `http://localhost:8080`).

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

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
