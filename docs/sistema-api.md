# Task-Api — Documentación del Sistema

## 1. Propósito

Task-Api es un sistema de gestión de proyectos colaborativos. Permite a los usuarios crear proyectos, asignar colaboradores a cada proyecto y definir tareas que dichos colaboradores deben completar. El dueño del proyecto puede monitorear el progreso mediante un dashboard (planeado con WebSocket en futuras iteraciones).

## 2. Stack tecnológico

| Capa            | Tecnología          |
| --------------- | ------------------- |
| Runtime         | Node.js v26.3.0     |
| Lenguaje        | TypeScript          |
| Framework HTTP  | Express             |
| ORM             | TypeORM (PostgreSQL) |
| Validación      | Zod                 |
| Hashing         | bcrypt              |
| Tokens JWT      | jose (HS256)        |
| Logging         | Pino                |
| Testing         | Vitest              |
| Package manager | npm                 |

## 3. Modelo de datos

### 3.1 Diagrama de entidades

```
┌──────────┐       ┌──────────────┐       ┌────────┐
│   User   │───┬───│ Collaborator │───┬───│  Task  │
└──────────┘   │   └──────────────┘   │   └────────┘
     │         │                      │
     │ owner   │ user                 │ collaborator
     ▼         ▼                      ▼
┌──────────┐  ┌──────────────┐      (cada tarea pertenece
│ Project  │◄─│ Collaborator │       a un colaborador
└──────────┘  └──────────────┘       dentro de un proyecto)
```

### 3.2 Entidades

#### User

| Campo          | Tipo       | Restricciones           | Observaciones                                         |
| -------------- | ---------- | ----------------------- | ----------------------------------------------------- |
| `id`           | `Int`      | PK, autoincremental     |                                                       |
| `name`         | `String`   |                         |                                                       |
| `email`        | `String`   | `@unique`               | Usado como identificador para login                   |
| `passwordHash` | `String`   | `@map("password_hash")` | El password se encripta con bcrypt antes de persistir |
| `roles`        | `String[]` | `@default([])`          | Lista de roles: `"admin"`, `"user"`                   |
| `dateOfBirth`  | `DateTime` | `@map("date_of_birth")` | Se usa para calcular la edad en la respuesta pública  |

Relaciones:

- Un usuario puede ser dueño de varios **proyectos** (`projects Project[]`).
- Un usuario puede ser colaborador en varios proyectos (`collaborators Collaborator[]`).

#### Project

| Campo         | Tipo       | Restricciones           | Observaciones      |
| ------------- | ---------- | ----------------------- | ------------------ |
| `id`          | `Int`      | PK, autoincremental     |                    |
| `name`        | `String`   |                         |                    |
| `description` | `String`   |                         |                    |
| `startDate`   | `DateTime` | `@map("start_date")`    |                    |
| `endDate`     | `DateTime` | `@map("end_date")`      |                    |
| `ownerId`     | `Int`      | FK → `User.id`, Cascade | Dueño del proyecto |

Relaciones:

- Pertenece a un **User** (`owner`).
- Tiene muchos **Collaborator** (`collaborators Collaborator[]`).
- Si se elimina el usuario dueño, el proyecto se elimina en cascada.

#### Collaborator

| Campo       | Tipo  | Restricciones              | Observaciones                      |
| ----------- | ----- | -------------------------- | ---------------------------------- |
| `id`        | `Int` | PK, autoincremental        |                                    |
| `userId`    | `Int` | FK → `User.id`, Cascade    | Usuario que actúa como colaborador |
| `projectId` | `Int` | FK → `Project.id`, Cascade | Proyecto al que pertenece          |

Restricción: `@@unique([userId, projectId])` — un usuario no puede ser colaborador duplicado en el mismo proyecto.

Relaciones:

- Pertenece a un **User** (`user`).
- Pertenece a un **Project** (`project`).
- Tiene muchas **tareas** (`tasks Task[]`).

#### Task

| Campo            | Tipo        | Restricciones                   | Observaciones             |
| ---------------- | ----------- | ------------------------------- | ------------------------- |
| `id`             | `Int`       | PK, autoincremental             |                           |
| `title`          | `String`    |                                 |                           |
| `description`    | `String?`   | Opcional                        |                           |
| `status`         | `String`    |                                 | Ej: `"pending"`, `"done"` |
| `dueDate`        | `DateTime?` | `@map("due_date")`, opcional    | Fecha límite              |
| `collaboratorId` | `Int`       | FK → `Collaborator.id`, Cascade | A quién se asigna         |

Relaciones:

- Pertenece a un **Collaborator** (`collaborator`). Esto implica que toda tarea está vinculada a un colaborador específico dentro de un proyecto.

## 4. Endpoints REST

### 4.1 Users — `/api/user`

| Método   | Ruta   | Descripción               | Autenticación |
| -------- | ------ | ------------------------- | ------------- |
| `POST`   | `/`    | Crear usuario (registro)  | No            |
| `GET`    | `/`    | Listar todos los usuarios | No            |
| `PUT`    | `/:id` | Actualizar un usuario     | No            |
| `DELETE` | `/:id` | Eliminar un usuario       | No            |

**DTO de creación (`CreateUserDTO`)**:

```json
{
  "name": "string (3-50)",
  "email": "string (max 100)",
  "password": "string (6-100)",
  "roles": ["admin" | "user"],
  "dateOfBirth": "string (ISO 8601, se transforma a Date)"
}
```

**DTO de respuesta pública (`UserDto`)**:

```json
{
  "id": "number",
  "name": "string",
  "email": "string",
  "roles": "string[]",
  "age": "number (calculado a partir de dateOfBirth)",
  "dateBirth": "string (yyyy-MM-dd)"
}
```

**DTO interno con password (`UserWithPassword`)**:

```json
{
  "id": "number",
  "name": "string",
  "email": "string",
  "password": "string"
}
```

### 4.2 Auth — `/api/auth`

| Método | Ruta       | Descripción                       | Autenticación |
| ------ | ---------- | --------------------------------- | ------------- |
| `POST` | `/login`   | Iniciar sesión (email + password) | No            |
| `GET`  | `/profile` | Obtener perfil del usuario        | Bearer JWT    |

> **Nota:** Las rutas de auth estan habilitadas en `src/routes.ts` bajo el prefijo `/api/auth`.

**DTO de login (`LoginDto`)**:

```json
{s
  "email": "string (5-100)",
  "password": "string (6-100)"
}
```

### 4.3 Funcionalidades pendientes de implementación

- **Proyectos**: CRUD de proyectos con asignación de dueño y listado de colaboradores.
- **Colaboradores**: Endpoint para agregar/quitar colaboradores de un proyecto.
- **Tareas**: CRUD de tareas asignadas a colaboradores dentro de cada proyecto.
- **Dashboard**: Vista en tiempo real del progreso de tareas mediante WebSocket (planificado).

## 5. Flujo de autenticación

```
Cliente                  Servidor                Base de Datos
  │                         │                        │
  │  POST /api/auth/login   │                        │
  │  { email, password }    │                        │
  │────────────────────────►│                        │
  │                         │  SELECT * FROM "User"  │
  │                         │  WHERE email = $1      │
  │                         │  (TypeORM repository)  │
  │                         │───────────────────────►│
  │                         │◄───────────────────────│
  │                         │                        │
  │                         │  bcrypt.compare(       │
  │                         │    password, hash)     │
  │                         │                        │
  │                         │  JWT.sign({ email })   │
  │  { token }              │  (secret: JWT_SECRET)  │
  │◄────────────────────────│                        │
  │                         │                        │
  │  GET /api/auth/profile  │                        │
  │  Authorization: Bearer  │                        │
  │────────────────────────►│  jwt.verify(token)     │
  │                         │  Busca user en DB por  │
  │                         │  email del payload     │
  │  { user }               │  (TypeORM repository)  │
  │◄────────────────────────│                        │
```

## 6. Convenciones

### 6.1 Forma de respuesta HTTP

**Éxito:**

```json
{
  "message": "string",
  "data": { ... }
}
```

**Error:**

```json
{
  "message": "string"
}
```

> Los controladores usan un patrón `Result<T>` que encapsula valor/error y código de estado. Para errores de dominio se usa `CustomError`, que extiende `Error` con una propiedad `statusCode`.

### 6.2 Validación de requests

Toda validación de body, params y query se realiza con schemas de **Zod** mediante las funciones helper `validateBody`, `validateParam` y `validateQuery` en `src/utils/validation/requestValidation.ts`. Si la validación falla, se responde con `400 Bad Request` y los detalles del error de Zod.

### 6.3 Logging

Se utiliza **Pino** para logging estructurado. Cada request entrante se registra con método y URL. Los errores se loguean antes de ser enviados al cliente. Ver `docs/LOGGER_SETUP.md` para más detalles.

## 7. Estructura del proyecto

```
src/
├── app.ts                     # Punto de entrada, inicializa DataSource y arranca el servidor
├── server.ts                  # Clase ServerApp: configura Express, middlewares, rutas
├── routes.ts                  # Ensamblaje de rutas de primer nivel
├── config/
│   ├── envs.ts                # Variables de entorno tipadas
│   └── logger.ts              # Instancia de Pino
├── common/
│   ├── adapters/
│   │   ├── bcrypt/            # BcryptAdapter (hash + compare)
│   │   └── jose/              # JwtAdapter (sign + verify, usa JWT_SECRET)
│   └── entities/
│       ├── result.ts          # Patrón Result<T> (success/error)
│       ├── custom-error.ts    # CustomError con statusCode
│       └── payload.ts         # Payload del JWT
├── database/
│   ├── data-source.ts         # DataSource de TypeORM (conexión + entidades)
│   └── entities/              # Entidades TypeORM
│       ├── user.entity.ts     # UserEntity (tabla "User")
│       ├── project.entity.ts  # ProjectEntity (tabla "Project")
│       ├── collaborator.entity.ts # CollaboratorEntity (tabla "Collaborator")
│       └── task.entity.ts     # TaskEntity (tabla "Task")
├── features/
│   └── auth/
│       ├── auth/              # Login, profile
│       │   ├── auth.controller.ts
│       │   ├── auth.service.ts
│       │   ├── auth.router.ts
│       │   └── dtos/
│       └── user/              # CRUD de usuarios
│           ├── user.controller.ts
│           ├── user.service.ts
│           ├── user.routes.ts
│           ├── entity/        # Entidad de dominio User
│           └── dtos/          # DTOs de request/response
├── middlewares/
│   ├── auth.middlware.ts      # JWT verification + busca user real en DB
│   ├── error.middlware.ts     # Manejo de errores
│   └── request-logger.middleware.ts
├── types/
│   └── express/index.d.ts     # Extensión de tipos de Express
└── utils/
    └── validation/
        └── requestValidation.ts  # Wrappers de validación Zod
```
