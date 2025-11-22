# 🚀 Guía de Despliegue en Vercel

Esta guía te ayudará a subir el frontend de Javeriana Conecta a Vercel usando GitHub.

## 📋 Pasos Previos

1. **Asegúrate de tener una cuenta en:**
   - [GitHub](https://github.com)
   - [Vercel](https://vercel.com)

2. **Verifica que el repositorio de GitHub esté creado:**
   - Repositorio: `https://github.com/Juan-GuevaraBusta/javerianaConecta-frontend`

## 🔧 Paso 1: Preparar el Código para GitHub

El proyecto está en `javerianaConecta-Frontend/javerianaconecta/`. Tienes dos opciones:

### Opción A: Subir solo la carpeta `javerianaconecta/` (Recomendado)

Si quieres que el código esté en la raíz del repositorio:

```bash
# Desde la raíz del proyecto
cd javerianaConecta-Frontend

# Inicializa git si no está inicializado
cd javerianaconecta
git init

# Agrega el remote de GitHub
git remote add origin https://github.com/Juan-GuevaraBusta/javerianaConecta-frontend.git

# Agrega todos los archivos
git add .

# Commit inicial
git commit -m "Initial commit: Frontend Next.js"

# Sube a GitHub
git branch -M main
git push -u origin main
```

### Opción B: Subir toda la estructura (con carpeta `javerianaconecta/`)

Si prefieres mantener la estructura de carpetas:

```bash
# Desde la raíz del proyecto
cd javerianaConecta-Frontend

# Inicializa git si no está inicializado
git init

# Agrega el remote de GitHub
git remote add origin https://github.com/Juan-GuevaraBusta/javerianaConecta-frontend.git

# Agrega todos los archivos
git add .

# Commit inicial
git commit -m "Initial commit: Frontend Next.js"

# Sube a GitHub
git branch -M main
git push -u origin main
```

## 🌐 Paso 2: Conectar con Vercel

1. **Ve a Vercel:**
   - Abre [vercel.com](https://vercel.com)
   - Inicia sesión con tu cuenta (puedes usar GitHub)

2. **Importa el proyecto:**
   - Haz clic en "Add New..." → "Project"
   - Selecciona "Import Git Repository"
   - Conecta tu cuenta de GitHub si no lo has hecho
   - Selecciona el repositorio `javerianaConecta-frontend`

3. **Configura el proyecto:**
   
   **Si usaste la Opción A (código en la raíz):**
   - **Framework Preset**: Next.js (se detecta automáticamente)
   - **Root Directory**: Deja vacío (o `.`)
   - **Build Command**: `npm run build` (o deja el predeterminado)
   - **Output Directory**: `.next` (o deja el predeterminado)
   - **Install Command**: `npm install` (o deja el predeterminado)

   **Si usaste la Opción B (carpeta `javerianaconecta/`):**
   - **Framework Preset**: Next.js
   - **Root Directory**: `javerianaconecta` ⚠️ **IMPORTANTE**
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

4. **Configura las Variables de Entorno:**
   
   Haz clic en "Environment Variables" y agrega:
   
   ```
   NEXT_PUBLIC_API_URL = https://tu-backend-url.com/api
   ```
   
   ⚠️ **Importante**: Reemplaza `https://tu-backend-url.com/api` con la URL real de tu backend.
   
   Si tu backend también está en Vercel, será algo como:
   ```
   NEXT_PUBLIC_API_URL = https://javeriana-conecta-backend.vercel.app/api
   ```

5. **Deploy:**
   - Haz clic en "Deploy"
   - Vercel comenzará a construir y desplegar tu aplicación
   - Espera a que termine (toma 2-5 minutos)

## ✅ Paso 3: Verificar el Despliegue

1. Una vez completado el deploy, Vercel te dará una URL como:
   ```
   https://javeriana-conecta-frontend.vercel.app
   ```

2. **Prueba la aplicación:**
   - Abre la URL en tu navegador
   - Verifica que la página de login cargue correctamente
   - Revisa la consola del navegador por errores

3. **Si hay errores:**
   - Ve a la pestaña "Logs" en Vercel para ver los errores de build
   - Verifica que las variables de entorno estén correctas
   - Asegúrate de que `NEXT_PUBLIC_API_URL` apunte a tu backend

## 🔄 Paso 4: Configurar Deploy Automático

Vercel ya está configurado para hacer deploy automático en cada push a la rama `main`:

```bash
# Cada vez que hagas cambios
git add .
git commit -m "Descripción de los cambios"
git push origin main
```

Vercel detectará el push y desplegará automáticamente.

## 🔧 Configuración Adicional

### Dominio Personalizado (Opcional)

1. Ve a "Settings" → "Domains"
2. Agrega tu dominio personalizado
3. Sigue las instrucciones para configurar DNS

### Variables de Entorno por Entorno

Puedes configurar variables diferentes para:
- **Production**: Producción
- **Preview**: Pull requests y branches
- **Development**: Desarrollo local

## 🐛 Solución de Problemas

### Error: "Build Failed"
- Verifica que `package.json` tenga el script `build`
- Revisa los logs en Vercel para ver el error específico
- Asegúrate de que todas las dependencias estén en `package.json`

### Error: "Module not found"
- Verifica que `node_modules` esté en `.gitignore`
- Asegúrate de que todas las dependencias estén listadas en `package.json`

### Error: "API URL not found"
- Verifica que `NEXT_PUBLIC_API_URL` esté configurada en Vercel
- Asegúrate de que el backend esté desplegado y accesible
- Revisa que la URL no termine con `/` (debe ser `/api`)

### Error: CORS en el backend
- Asegúrate de que el backend permita requests desde tu dominio de Vercel
- Agrega la URL de Vercel a la lista de CORS permitidos en el backend

## 📚 Recursos

- [Documentación de Vercel](https://vercel.com/docs)
- [Next.js en Vercel](https://nextjs.org/docs/deployment)
- [Variables de Entorno en Vercel](https://vercel.com/docs/environment-variables)

