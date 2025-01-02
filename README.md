# backend-node-sql-starter
Production-grade Node.js boilerplate. Ready for your next project.

Tech Stack:
- Node.js
- TypeScript
- Express.js
- Zod
- Prisma
- Winston
- PostgreSQL
- Jest
- Supertest
- Docker Compose

## Setup:

### Requirements:

- Node.js (v20)
- Docker

### Environment variables:

**Environment variables for development:**

```sh
cp .env.example .env
```

Update the `.env` file with the correct values. For database credentials, use the values from the `docker-compose.yml` file.

**Environment variables for testing:**

```sh
cp .env.test.example .env.test
```

Update the `.env.test` file with the correct values. For database credentials, use the values from the `docker-compose.yml` file.

### Installation:

Install dependencies:

```sh
npm install
```

### Database:

Create PostgreSQL databases using Docker Compose:

```sh
docker compose up -d
```

Run migrations for main database:

```sh
npm run db-migrate
```

Run migrations for test database:

```sh
npm run db-test-migrate
```

### Running the app:

**For development:**

```sh
npm run dev
```

**For production:**

Build the app:

```sh
npm run build
```

Start the server:

```sh
npm start
```

### Testing the app:

Run only unit tests:

```sh
npm run test:unit
```

Run only integration tests:

```sh
npm run test:integration
```

Run all tests (unit and integration):

```sh
npm test
```
