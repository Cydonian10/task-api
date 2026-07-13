# Pruebas E2E (End-to-End)

Este proyecto incluye pruebas E2E completas para verificar la funcionalidad de la API de extremo a extremo.

## 🚀 Scripts disponibles

### Pruebas E2E

```bash
# Ejecutar todas las pruebas E2E una vez
pnpm run test:e2e

# Ejecutar pruebas E2E en modo watch
pnpm run test:e2e:watch
```

### Otros tipos de pruebas

```bash
# Solo pruebas unitarias (excluye E2E)
pnpm run test:unit

# Todas las pruebas (unitarias + E2E)
pnpm test

# Modo watch para todas las pruebas
pnpm run test:watch

# Interfaz web
pnpm run test:ui
```

## 📁 Estructura de pruebas

```
tests/
└── e2e/
    └── api.e2e.test.ts    # Pruebas E2E de la API
src/
├── suma/
│   └── suma.test.ts       # Pruebas unitarias
└── jose/
    └── jwt-adapter.test.ts # Pruebas unitarias
```

## 🧪 Que cubren las pruebas E2E

### Health Endpoints

- ✅ `GET /` - Respuesta "Hello World"
- ✅ `GET /health` - Estado de salud del servidor

### Authentication Endpoints

- ✅ `POST /auth/login` - Login y generación de JWT
- ✅ `POST /auth/verify` - Verificación de token JWT
- ✅ Manejo de errores (token inválido, campos faltantes)

### Flujos completos

- ✅ Flujo completo: Login → Verificación
- ✅ Validación de payload del token

## 🛠️ Tecnologías utilizadas

- **Vitest**: Framework de testing (reemplaza Jest)
- **Supertest**: Testing de APIs HTTP
- **Express**: Servidor web
- **Jose**: Manejo de JWT

## 📊 Ejemplo de salida

```
✓ API E2E Tests > Health Endpoints > should return hello world on GET /
✓ API E2E Tests > Health Endpoints > should return health status on GET /health
✓ API E2E Tests > Authentication Endpoints > should login and return a token
✓ API E2E Tests > Authentication Endpoints > should verify a valid token
✓ API E2E Tests > Complete Authentication Flow > should complete full login -> verify flow

Test Files  1 passed (1)
Tests       8 passed (8)
```

## 🎯 Beneficios de las pruebas E2E

1. **Confianza total**: Prueban la aplicación como lo haría un usuario real
2. **Detección temprana**: Encuentran problemas de integración
3. **Documentación viva**: Las pruebas documentan el comportamiento esperado
4. **Regresión**: Previenen que cambios rompan funcionalidad existente

## 🔧 Configuración

Las pruebas E2E están configuradas en:

- `vitest.config.ts` - Configuración principal
- `tests/e2e/api.e2e.test.ts` - Implementación de pruebas
- `src/server.ts` - Aplicación separada para testing

La aplicación se refactorizó para ser testeable:

- Función `createApp()` exportable
- Separación de lógica de servidor y aplicación
- Endpoints RESTful bien definidos
