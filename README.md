# Javeriana Conecta - Frontend

Frontend de la aplicación Javeriana Conecta construido con Next.js 15, React 19 y Tailwind CSS.

## 🚀 Características

- **Next.js 15** con App Router
- **React 19** con Server Components
- **Tailwind CSS 4** para estilos
- **TypeScript** para type safety
- **Axios** para peticiones HTTP
- **React Hook Form** + **Zod** para validación de formularios
- **js-cookie** para manejo de tokens JWT
- **react-dropzone** para subida de archivos
- **date-fns** para manejo de fechas

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn

## 🛠️ Instalación

```bash
cd javerianaconecta
npm install
```

## ⚙️ Variables de Entorno

Crea un archivo `.env.local` en la carpeta `javerianaconecta/` con las siguientes variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3001
PORT=3001
```

Para producción en Vercel, configura estas variables en el dashboard de Vercel:
- `NEXT_PUBLIC_API_URL`: URL de tu backend API (ej: `https://tu-backend.vercel.app/api`)
- `NEXT_PUBLIC_FRONTEND_URL`: URL de tu frontend en Vercel (se configura automáticamente)

## 🏃 Desarrollo Local

```bash
cd javerianaconecta
npm run dev
```

La aplicación estará disponible en [http://localhost:3001](http://localhost:3001)

## 🏗️ Build para Producción

```bash
cd javerianaconecta
npm run build
npm run start
```

## 📁 Estructura del Proyecto

```
javerianaconecta/
├── src/
│   ├── app/              # App Router de Next.js
│   │   ├── (auth)/       # Rutas de autenticación
│   │   ├── dashboard/    # Dashboard principal
│   │   ├── templates/    # Gestión de plantillas
│   │   └── resumes/      # Gestión de CVs
│   ├── components/       # Componentes React
│   │   ├── ui/          # Componentes UI básicos
│   │   ├── forms/       # Formularios
│   │   └── layout/      # Componentes de layout
│   └── lib/             # Utilidades
│       ├── api/         # Servicios API
│       ├── auth/        # Autenticación
│       └── types/      # Tipos TypeScript
├── public/              # Archivos estáticos
└── package.json
```

## 🎨 Paleta de Colores

- **Light Blue**: `#8ECAE6`
- **Medium Blue**: `#219EBC`
- **Dark Blue**: `#023047`
- **Yellow-Orange**: `#FFB703`
- **Orange**: `#FB8500`

## 📦 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo en puerto 3001
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter

## 🌐 Despliegue en Vercel

Este proyecto está configurado para desplegarse automáticamente en Vercel.

### Pasos para desplegar:

1. **Sube el código a GitHub** (solo la carpeta `javerianaconecta/` debe estar en la raíz del repositorio)

2. **Conecta con Vercel**:
   - Ve a [vercel.com](https://vercel.com)
   - Importa tu repositorio de GitHub
   - Vercel detectará automáticamente que es un proyecto Next.js

3. **Configura las variables de entorno** en Vercel:
   - `NEXT_PUBLIC_API_URL`: URL de tu backend API
   - `NEXT_PUBLIC_FRONTEND_URL`: Se configura automáticamente, pero puedes especificarla

4. **Configura el Root Directory**:
   - Si el proyecto está en `javerianaconecta/`, configura el Root Directory en Vercel como `javerianaconecta`

5. **Deploy**: Vercel desplegará automáticamente en cada push a la rama principal

## 📝 Notas

- El frontend se comunica con el backend a través de la variable `NEXT_PUBLIC_API_URL`
- Los tokens JWT se almacenan en cookies seguras
- El diseño está inspirado en LinkedIn con una paleta de colores personalizada

## 🔗 Enlaces

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Vercel](https://vercel.com/docs)

