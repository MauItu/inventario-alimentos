# Inventario de Alimentos - Aplicación con Patrón MVC

Esta aplicación es un sistema de gestión de inventario de alimentos que implementa el patrón de diseño Modelo-Vista-Controlador (MVC).

## Estructura del Proyecto (MVC)

### Modelo (M)
- **models/prisma/schema.prisma**: Definición del esquema de la base de datos con Prisma
- **models/types.ts**: Tipos TypeScript centralizados
- **controllers/db.ts**: Conexión a la base de datos

### Vista (V)
- **views/**: Componentes de UI y páginas
  - **components/**: Componentes reutilizables
  - **page.tsx**: Página principal del dashboard
  - **layout.tsx**: Estructura de la aplicación

### Controlador (C)
- **controllers/**: Lógica de negocio
  - **productController.ts**: Operaciones CRUD para productos
  - **userController.ts**: Operaciones para usuarios
  - **pages/api/**: Endpoints de API

### Contextos
- **contexts/**: Proveedores de contexto para estado global
  - **AuthContext.tsx**: Gestión de autenticación
  - **ProductContext.tsx**: Gestión de productos

## Patrón MVC Implementado

- **Separación de responsabilidades**: Cada parte del sistema tiene una función específica
- **Modelo**: Encargado de los datos y la lógica de negocio
- **Vista**: Presentación y UI
- **Controlador**: Coordinación entre el modelo y las vistas

## Flujo de Datos

1. El usuario interactúa con la interfaz (Vista)
2. La acción se captura y se procesa a través de los Contextos
3. Los Controladores gestionan la lógica de negocio
4. Se actualiza el Modelo (base de datos)
5. Los cambios se reflejan en la Vista

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.