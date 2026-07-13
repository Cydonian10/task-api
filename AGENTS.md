# AGENTS.md

Compact context for working in this repo.

## Toolchain & runtime

- Node version is pinned in `.nvmrc` (v26.3.0).
- Package manager is **npm**; `package-lock.json` is present and `pnpm-lock.yaml` is gitignored. Several scripts/docs still mention `pnpm` but they are stale.
- TypeScript with `moduleResolution: Bundler`, path alias `@/src/*` → `./src/*`.
- `tsx` is used for dev; `tsc` for builds.

## Verified commands

```bash
npm install
npm run dev          # nodemon → tsx ./src/app.ts
npm run typecheck    # tsc --noEmit (currently fails, see below)
npm run build        # typecheck && tsc  (outputs to dist/src/)
npm start            # node dist/src/app.js
npm test             # vitest run (all discovered tests)
npm run test:unit    # does NOT exclude e2e; see Test gotchas
npm run test:e2e     # broken path; see Test gotchas
npm run check:untested
```

## Database & environment

- PostgreSQL is required. Start it with `docker compose up -d postgres-db` (reads env vars from `.env`).
- Two DB clients exist:
  - **Prisma** (`src/database/prisma.ts`) uses `DATABASE_URL` for the `User`/`Project`/`Collaborator`/`Task` models.
  - **Raw `pg` pool** (`src/database/pg-init.ts`) uses `POSTGRES_HOST`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB_NAME`, and `POSTGRES_URL`.
- `.env.example` is incomplete. Required at runtime includes: `PORT`, `NODE_ENV`, `LOG_LEVEL`, `DATABASE_URL`, `POSTGRES_URL`, `POSTGRES_HOST`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB_NAME`, `JWT_SECRET`.
- Prisma client is generated into `src/generated/prisma` (gitignored). Regenerate after schema changes: `npx prisma generate` / `npx prisma migrate dev`.
- `sql/tables.sql` and `sql/drop-tables.sql` are stale legacy scripts; the real schema is `prisma/schema.prisma` plus `prisma/migrations/`.

## Entry points & routing

- App bootstrap: `src/app.ts` (hardcodes port 3000, also loads `dotenv`).
- Server wiring: `src/server.ts` exports `ServerApp`; routes are attached via `server.setRoutes(AppRoutes.routes())`.
- Route assembly: `src/routes.ts`. Note: `/api/auth` routes are currently commented out, so auth endpoints return 404.
- User CRUD is wired at `/api/user` and uses Prisma.

## Test gotchas

- E2E tests live in `e2e/`, not `tests/e2e`. `tests/README.md` is outdated.
- `npm run test:unit` passes `--exclude='tests/e2e/**'`; because the directory does not exist, e2e tests still run. To truly run only unit tests, filter explicitly, e.g. `vitest run src/`.
- `npm run test:e2e` points to `tests/e2e` and exits with "No test files found". Run e2e with `npx vitest run e2e/`.
- E2E tests boot the app via `e2e/test-server.ts` and hit `/api/auth/*`; they currently fail because auth routes are not mounted.

## Current known issues

- `npm run typecheck` fails. Problems include:
  - `src/config/constans.ts` is empty but imported as a module.
  - `src/features/auth/auth/service.ts` imports `UserWithPassword` from the wrong path (it is in `user/dtos/user-with-password.dto.ts`).
  - `Result.error()` expects a string, but `CustomError` objects are passed in the auth service.
  - `e2e/api.e2e.test.ts` imports `e2e/test-server` as a bare specifier; it should be relative (`./test-server`).
- `JwtAdapter` hardcodes its signing secret; `JWT_SECRET` is required by `envs.ts` but unused for JWT signing.
- `AuthMiddleware` currently mocks the authenticated user instead of fetching from the DB.

## Docs & conventions

- `docs/HTTP_RESPONSE_CONVENTION.md` describes the intended response shape (`{ message, data }` on success, `{ message }` on error), though controllers currently mix conventions.
- `docs/LOGGER_SETUP.md` describes the Pino logger and request logging.

## Feature module generator

When asked "generame template para modulo de <name>" (e.g. "proyectos"), generate a full CRUD feature at `src/features/<name>/` following the pattern in `src/features/user/`. Create these files with method signatures only (no implementations):

### 1. DB Entity — `src/database/entities/<name>.entity.ts`

```ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("<Name>")
export class <Name>Entity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255 })
  name!: string;
}
```

### 2. (Omitido) Domain Entity — ya existe en `src/database/entities/` con TypeORM.

### 3. Create DTO — `src/features/<name>/dtos/create-<name>.dto.ts`

```ts
import { z } from "zod";

export const Create<Name>Schema = z.object({
  name: z.string().min(1).max(255),
});

export type Create<Name>DTO = z.infer<typeof Create<Name>Schema>;
```

### 4. Update DTO — `src/features/<name>/dtos/update-<name>.dto.ts`

```ts
import { z } from "zod";
import { Create<Name>Schema } from "./create-<name>.dto";

export const Update<Name>Schema = Create<Name>Schema.partial();

export type Update<Name>DTO = z.infer<typeof Update<Name>Schema>;
```

### 5. Response DTO — `src/features/<name>/dtos/<name>.dto.ts`

```ts
import { <Name>Entity } from "@/src/database/entities/<name>.entity";

export class <Name>Dto {
  constructor(
    public id: number,
    public name: string,
  ) {}

  public static fromEntity(object: <Name>Entity): <Name>Dto {
    return new <Name>Dto(Number(object.id), String(object.name));
  }
}
```

### 6. Service — `src/features/<name>/<name>.service.ts`

```ts
import { AppDataSource } from "@/src/database/data-source";
import { <Name>Entity } from "@/src/database/entities/<name>.entity";
import { Result } from "@/src/common/entities/result";
import { Create<Name>DTO } from "./dtos/create-<name>.dto";
import { Update<Name>DTO } from "./dtos/update-<name>.dto";
import { <Name>Dto } from "./dtos/<name>.dto";

export class <Name>Service {
  private readonly repo = AppDataSource.getRepository(<Name>Entity);

  async create(dto: Create<Name>DTO): Promise<Result<<Name>Dto>> {
    throw new Error("Method not implemented.");
  }

  async getAll(): Promise<Result<<Name>Dto[]>> {
    throw new Error("Method not implemented.");
  }

  async getById(id: number): Promise<Result<<Name>Dto>> {
    throw new Error("Method not implemented.");
  }

  async update(id: number, dto: Update<Name>DTO): Promise<Result<<Name>Dto>> {
    throw new Error("Method not implemented.");
  }

  async delete(id: number): Promise<Result<void>> {
    throw new Error("Method not implemented.");
  }
}
```

### 7. Controller — `src/features/<name>/<name>.controller.ts`

```ts
import { Request, Response } from "express";
import { validateBody } from "@/src/utils/validation/requestValidation";
import { Create<Name>Schema } from "./dtos/create-<name>.dto";
import { <Name>Service } from "./<name>.service";

export class <Name>Controller {
  constructor(private readonly <name>Service: <Name>Service) {}

  create = async (req: Request, res: Response): Promise<void> => {
    throw new Error("Method not implemented.");
  };

  getAll = async (_req: Request, res: Response): Promise<void> => {
    throw new Error("Method not implemented.");
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    throw new Error("Method not implemented.");
  };

  update = async (req: Request, res: Response): Promise<void> => {
    throw new Error("Method not implemented.");
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    throw new Error("Method not implemented.");
  };
}
```

### 8. Routes — `src/features/<name>/<name>.routes.ts`

```ts
import { Router } from "express";
import { <Name>Controller } from "./<name>.controller";
import { <Name>Service } from "./<name>.service";

export class <Name>Router {
  public static get routes(): Router {
    const router = Router();
    const service = new <Name>Service();
    const controller = new <Name>Controller(service);

    router.post("/", controller.create);
    router.get("/", controller.getAll);
    router.get("/:id", controller.getById);
    router.put("/:id", controller.update);
    router.delete("/:id", controller.delete);
    return router;
  }
}
```

### 9. Register in `src/routes.ts`

Add import and route line:

```ts
import { <Name>Router } from "./features/<name>/<name>.routes";
// ...
router.use("/api/<name>", <Name>Router.routes);
```

### Naming conventions

| Placeholder | Rule | Example (`proyectos`) |
|---|---|---|
| `<Name>` | PascalCase singular | `Project` |
| `<name>` | camelCase singular | `project` |
| `<names>` | camelCase plural | `projects` |
| `<name>.entity.ts` | kebab-case singular | `project.entity.ts` |
