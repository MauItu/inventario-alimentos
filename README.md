# Inventario de alimentos

Aplicación web para llevar el inventario de alimentos de la casa: registras cada producto con su categoría, cantidad y fecha de caducidad, y la app genera con IA un PDF con 7 recetas de almuerzo para la semana a partir de lo que tienes.

**Producción:** https://inventario-alimentos.vercel.app

> ⚠️ Por ahora se ingresa solo con el correo, sin contraseña ni verificación. No guardes datos sensibles.

## Funcionalidades

- Crear cuenta e ingresar con un correo.
- Agregar productos: nombre, categoría (lácteos, frutas, vegetales, carnes), perecedero o no, cantidad con decimales (unidades, kilos o libras), fecha de ingreso y, si es perecedero, fecha de caducidad.
- Ver y borrar los productos del inventario.
- Generar recetas con Gemini usando los productos del inventario y descargarlas en PDF.

## Stack

- [Next.js 15](https://nextjs.org) (App Router) con React 19 y TypeScript
- [Prisma 6](https://www.prisma.io) sobre PostgreSQL ([Neon](https://neon.tech) en producción)
- Tailwind CSS 3 y componentes de [shadcn/ui](https://ui.shadcn.com)
- Gemini a través de su endpoint compatible con OpenAI (SDK `openai`), validando la respuesta con zod
- jsPDF para el PDF de recetas
- Desplegada en [Vercel](https://vercel.com)

## Desarrollo local

Requisitos: Node.js 24, npm y una base de datos PostgreSQL (la forma más simple es Docker).

```bash
git clone https://github.com/MauItu/inventario-alimentos.git
cd inventario-alimentos
npm install            # también genera el cliente de Prisma
cp .env.example .env
```

Levanta un PostgreSQL local:

```bash
docker run -d --name inventario-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=inventario -p 5432:5432 postgres:16-alpine
```

En `.env`, apunta las dos variables de la base de datos al contenedor y, si quieres probar las recetas, agrega tu API key de Gemini:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/inventario"
DATABASE_URL_UNPOOLED="postgresql://postgres:postgres@localhost:5432/inventario"
GEMINI_API_KEY="..."
```

Crea las tablas y arranca la app en http://localhost:3000:

```bash
npx prisma migrate deploy
npm run dev
```

> Next.js y la CLI de Prisma cargan `.env` automáticamente: no pongas ahí las credenciales de producción.

### Variables de entorno

| Variable | Obligatoria | Descripción |
|---|---|---|
| `DATABASE_URL` | Sí | Conexión a PostgreSQL que usa la app. En Neon, la URL con pooling (host con `-pooler`). |
| `DATABASE_URL_UNPOOLED` | Sí | Conexión directa, la usan las migraciones de Prisma. En local puede ser igual a `DATABASE_URL`. |
| `GEMINI_API_KEY` | Para las recetas | API key gratuita de [Google AI Studio](https://aistudio.google.com/apikey). |
| `GEMINI_MODEL` | No | Modelo de Gemini. Por defecto `gemini-2.5-flash`. |

### Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Sirve el build de producción |
| `npm run lint` | ESLint en todo el proyecto |
| `npm run typecheck` | Genera los tipos de rutas de Next y ejecuta `tsc --noEmit` |

## Base de datos

El schema está en `prisma/schema.prisma` y los cambios se versionan como migraciones en `prisma/migrations/`. Para cambiar el schema:

1. Edita `prisma/schema.prisma`.
2. Genera la migración contra tu base de datos local: `npx prisma migrate dev --name descripcion-del-cambio`.
3. Revisa el SQL generado antes de hacer commit. Si renombra o cambia el tipo de una columna, Prisma puede borrarla y crearla de nuevo; en ese caso, ajusta el SQL a mano para no perder datos.

Las migraciones se aplican solas en producción (ver [Deploy](#deploy)). Nunca ejecutes `prisma migrate dev` contra la base de datos de producción.

## API

Todas las rutas están en `app/api/*/route.ts`, validan la entrada con zod y responden JSON.

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/users` | Crea un usuario (`{ email }`). Devuelve 409 si ya existe. |
| `GET` | `/api/users/[email]` | Busca un usuario por correo. |
| `GET` | `/api/products?email=...` | Lista los productos de un usuario. |
| `POST` | `/api/products` | Agrega un producto. |
| `DELETE` | `/api/products?id=...` | Borra un producto. |
| `POST` | `/api/recipes` | Genera las recetas para `{ email }`. Devuelve las recetas y el PDF. |

## Estructura

```
app/              Páginas (App Router), contexto de sesión y rutas de la API
components/       Componentes de la app; components/ui son los de shadcn/ui
hooks/            Hooks de React (productos del dashboard, toasts)
lib/              Utilidades compartidas y cliente de la API para el navegador
lib/services/     Lógica de servidor: acceso a datos y generación de recetas
prisma/           Schema y migraciones
scripts/          Script de build de Vercel
.github/          CI y Dependabot
```

El código de `lib/db.ts` y `lib/services/` importa `server-only`: si un componente de cliente lo importa, el build falla.

## Deploy

La app se despliega en Vercel con cada push. **Un push a `main` va directo a producción.**

- `vercel.json` cambia el comando de build por `scripts/vercel-build.sh`, que ejecuta `npm run build` y, solo en producción, `prisma migrate deploy` después de que el build termina bien.
- El script necesita `VERCEL_ENV`, así que en Vercel debe estar activa la opción *Automatically expose System Environment Variables* (Settings → Environment Variables).
- Las variables de la base de datos las crea la integración de Neon y son las mismas en todos los entornos: **los deploys de Preview usan la base de datos de producción**. Por eso los Preview no migran; no abras un Preview con cambios de schema.
- `GEMINI_API_KEY` se configura a mano en Vercel (Settings → Environment Variables).

## CI y dependencias

- **GitHub Actions** (`.github/workflows/ci.yml`), en cada push a `main` y en cada pull request:
  - lint (sin warnings), typecheck y build, y comprueba que Prisma no llegue al bundle del navegador;
  - aplica las migraciones en un PostgreSQL vacío y verifica que el resultado coincida con `schema.prisma`.
- **Dependabot** (`.github/dependabot.yml`) revisa cada lunes las dependencias de npm y las GitHub Actions. Agrupa las versiones menores y los parches en un solo pull request y espera 7 días desde cada release antes de proponerla. Las versiones mayores se actualizan a mano.
