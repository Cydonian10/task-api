# Logger Configuration - Pino

Este proyecto utiliza [Pino](https://getpino.io/) como sistema de logging estructurado para mejorar el monitoreo y debugging de la aplicación.

## 🚀 Características

- **Logging estructurado**: Los logs se almacenan en formato JSON para facilitar el análisis
- **Múltiples niveles**: `trace`, `debug`, `info`, `warn`, `error`, `fatal`
- **Logging automático de requests**: Todas las peticiones HTTP se registran automáticamente
- **Formato bonito en desarrollo**: Los logs se muestran formateados y con colores en desarrollo
- **Filtrado de información sensible**: Automáticamente filtra contraseñas y tokens en producción

## 📝 Configuración

### Variables de entorno

```bash
# Nivel de logging (trace, debug, info, warn, error, fatal)
LOG_LEVEL=info

# Entorno de ejecución
NODE_ENV=development
```

### Archivos principales

- `src/utils/logger.ts` - Configuración principal del logger
- `src/middlewares/request-logger.middleware.ts` - Middleware para logging de requests
- `src/middlewares/error.middlware.ts` - Middleware de errores actualizado con Pino

## 🔧 Uso del Logger

### Importar el logger

```typescript
import logger from "../utils/logger";
```

### Ejemplos básicos

```typescript
// Información general
logger.info("Usuario autenticado correctamente");

// Advertencias
logger.warn("Token próximo a expirar");

// Errores
logger.error("Error al conectar con la base de datos");
```

### Logging estructurado

```typescript
// Con contexto adicional
logger.info(
  {
    userId: "123",
    operation: "getUserProfile",
    duration: "150ms",
  },
  "Profile retrieved successfully"
);

// Error con contexto
logger.error(
  {
    userId: "123",
    operation: "updateUser",
    error: error.message,
    stack: error.stack,
  },
  "Failed to update user"
);
```

### En rutas/controladores

```typescript
router.get("/user/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  // Log de inicio de operación
  logger.info({ userId: id }, "Fetching user by ID");

  const result = getUserById(id);

  if (result.isSuccess()) {
    logger.info(
      {
        userId: id,
        userData: result.getValue(),
      },
      "User retrieved successfully"
    );
  } else {
    logger.warn(
      {
        userId: id,
        error: result.getError()?.message,
      },
      "Failed to retrieve user"
    );
  }

  return handleResult(res, result, "User retrieved successfully");
});
```

## 🔍 Tipos de Logs Automáticos

### Request Logging

Cada petición HTTP genera automáticamente logs con:

```json
{
  "level": "INFO",
  "time": "2025-10-12T16:47:57.352Z",
  "method": "GET",
  "url": "/user/123",
  "userAgent": "curl/7.68.0",
  "ip": "::1",
  "msg": "GET /user/123 - Request received"
}
```

### Response Logging

Al completarse la respuesta:

```json
{
  "level": "INFO",
  "time": "2025-10-12T16:47:57.452Z",
  "method": "GET",
  "url": "/user/123",
  "statusCode": 200,
  "duration": "100ms",
  "responseSize": 156,
  "msg": "GET /user/123 - 200 100ms"
}
```

### Error Logging

Los errores se capturan automáticamente:

```json
{
  "level": "ERROR",
  "time": "2025-10-12T16:48:00.123Z",
  "error": "User not found",
  "stack": "Error: User not found\\n    at getUserById...",
  "method": "GET",
  "url": "/user/999",
  "userAgent": "curl/7.68.0",
  "ip": "::1",
  "msg": "Error capturado en GET /user/999"
}
```

## 🧪 Rutas de Prueba

Para probar el sistema de logging, puedes usar estas rutas:

### Logs básicos

```bash
curl http://localhost:3000/demo/logs
```

### Error simulado

```bash
curl http://localhost:3000/demo/error
```

### CustomError simulado

```bash
curl http://localhost:3000/demo/custom-error
```

### Operaciones CRUD con logging

```bash
# GET user
curl http://localhost:3000/user/1

# POST user
curl -X POST http://localhost:3000/user \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com"}'

# DELETE user
curl -X DELETE http://localhost:3000/user/1
```

## 📊 Niveles de Log

| Nivel   | Uso                      | Ejemplo                                     |
| ------- | ------------------------ | ------------------------------------------- |
| `trace` | Debugging muy detallado  | Seguimiento de función por función          |
| `debug` | Información de debugging | Variables internas, estados                 |
| `info`  | Información general      | Operaciones exitosas, eventos importantes   |
| `warn`  | Advertencias             | Situaciones inusuales pero no críticas      |
| `error` | Errores                  | Fallos en operaciones, excepciones          |
| `fatal` | Errores críticos         | Fallos que requieren reinicio de aplicación |

## 🛡️ Seguridad

En producción, el logger automáticamente filtra campos sensibles como:

- `password`
- `token`
- `authorization`

```typescript
// Esto se filtrará automáticamente en producción
logger.info(
  {
    user: "john@example.com",
    password: "secret123", // ❌ Se filtrará
    token: "jwt-token", // ❌ Se filtrará
  },
  "User login attempt"
);
```

## 📈 Beneficios

1. **Monitoreo mejorado**: Logs estructurados facilitan el análisis
2. **Debugging más eficiente**: Contexto rico en cada log
3. **Trazabilidad**: Seguimiento completo de requests
4. **Performance**: Pino es uno de los loggers más rápidos para Node.js
5. **Integración**: Fácil integración con herramientas como ELK Stack, Grafana, etc.

## 🔧 Configuración Avanzada

Para entornos de producción, considera:

```typescript
// src/utils/logger.ts
const logger = pino({
  level: "info",
  // Sin pretty-print en producción
  transport: undefined,
  // Configuración para archivos
  formatters: {
    bindings: () => ({}), // Omitir hostname/pid
  },
});
```

O usar archivos de log:

```bash
node dist/src/app.js > logs/app.log 2>&1
```
