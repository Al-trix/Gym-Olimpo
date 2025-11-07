# Proyecto Olimpo -- Plataforma Web para Gestión de Gimnasio

**Stack:** Node.js + TypeScript + Express + Prisma (Backend) \| React +
Tailwind (Frontend)

------------------------------------------------------------------------

## Descripción del Proyecto

Olimpo es un aplicativo web diseñado para automatizar los procesos
administrativos del gimnasio **Gym Olimpo**, reemplazando tareas
manuales por flujos digitales eficientes.\
El sistema permite gestionar:

-   Suscripciones de usuarios\
-   Inventario del gimnasio\
-   Horarios del personal\
-   Rutinas de entrenamiento\
-   Cuentas y roles del personal (Administrador, Jefe de entrenadores,
    Entrenadores, Recepcionista y Usuarios)

El objetivo principal es optimizar la operación interna y mejorar la
experiencia de los usuarios y trabajadores del establecimiento.

------------------------------------------------------------------------

## Objetivos del Sistema

### Objetivo Principal

Desarrollar un sistema web completo que centralice y automatice la
gestión interna del gimnasio mediante módulos independientes conectados
a una base de datos moderna y segura.

### Objetivos Específicos

-   Facilitar la administración de suscripciones y clientes.\
-   Organizar los horarios de trabajo y rutinas.\
-   Controlar el inventario del establecimiento.\
-   Establecer un sistema seguro de autenticación basado en roles.\
-   Proveer una interfaz rápida, intuitiva y moderna.

------------------------------------------------------------------------

## Arquitectura del Proyecto

El proyecto utiliza una arquitectura cliente-servidor, donde:

### Backend (API REST)

-   Node.js + TypeScript\
-   Express.js\
-   Prisma ORM\
-   Base de datos: PostgreSQL

Funciones principales:\
- Gestión de usuarios y roles\
- CRUDs de suscripciones, inventario, horarios y rutinas\
- Validaciones y autenticación\
- Registro de acciones\
- Seguridad y control de acceso

### Frontend

-   React\
-   TailwindCSS\
-   Axios para consumo de API

Funciones principales:\
- Interfaces separadas por roles\
- Formularios dinámicos\
- Vistas administrativas\
- Visualización de horarios, inventario y rutinas

------------------------------------------------------------------------

## Funcionalidades del Sistema

### Módulo de Cuentas y Roles

-   Crear cuentas de administrador, recepcionista, entrenadores y jefe
    de entrenadores.\
-   Validaciones avanzadas.\
-   Control de permisos según el rol.

### Módulo de Suscripciones

-   Registro de membresías (diaria, quincenal, mensual).\
-   Generación automática de fechas.\
-   Asociación con cuenta de usuario.

### Módulo de Inventario

-   CRUD completo del inventario del gimnasio.\
-   Alertas de stock bajo.\
-   Evita duplicados.

### Módulo de Horarios

-   Asignación de horarios a entrenadores.\
-   Prevención de choques de horarios.\
-   Visualización por rol.

### Módulo de Rutinas

-   Creación de rutinas generales o personalizadas (de pago).\
-   Organización por nivel, objetivo y duración.\
-   Control de acceso según usuario.

------------------------------------------------------------------------

## Lineamientos Visuales

-   Gama de colores: Azul, negro y dorado.\
-   Estilo: Moderno, simple y accesible.\
-   Responsive: Adaptado a móviles, tablets y PC.

------------------------------------------------------------------------

## Estructura General del Repositorio

    /backend
      ├── src
      │   ├── controllers
      │   ├── routes
      │   ├── middlewares
      │   ├── prisma
      │   ├── utils
      │   └── server.ts
      ├── package.json
      └── prisma/schema.prisma

    /frontend
      ├── src
      │   ├── components
      │   ├── pages
      │   ├── hooks
      │   ├── services
      │   ├── context
      │   └── App.tsx
      ├── package.json
      └── tailwind.config.js

------------------------------------------------------------------------

## Instalación y Ejecución

### Backend

``` bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

### Frontend

``` bash
cd frontend
npm install
npm run dev
```

------------------------------------------------------------------------

## Pruebas

El sistema incluye validaciones, verificación de roles y pruebas
manuales basadas en listas de chequeo incluidas en la documentación
original del proyecto.

------------------------------------------------------------------------

## Licencia

Proyecto académico desarrollado en el SENA por **Álvaro Arboleda
Marulanda**.

------------------------------------------------------------------------

## Autor

**Álvaro Arboleda Marulanda**\
SENA -- Análisis y Desarrollo de Software\
Proyecto: **Olimpo Gym**
