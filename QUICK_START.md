# ⚡ Inicio Rápido - Despliegue en Vercel

## 🎯 Pasos Rápidos

### 1. Subir código a GitHub

```bash
# Navega a la carpeta del proyecto
cd javerianaConecta-Frontend/javerianaconecta

# Si no tienes git inicializado
git init
git remote add origin https://github.com/Juan-GuevaraBusta/javerianaConecta-frontend.git

# Agrega y sube todo
git add .
git commit -m "Initial commit: Frontend Next.js"
git branch -M main
git push -u origin main
```

### 2. Conectar con Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Haz clic en "Add New..." → "Project"
3. Importa el repositorio `javerianaConecta-frontend`
4. **Configuración importante:**
   - **Root Directory**: `javerianaconecta` (si el código está en esa carpeta)
   - O deja vacío si subiste solo el contenido de `javerianaconecta/` a la raíz
5. **Variables de entorno:**
   - `NEXT_PUBLIC_API_URL` = `https://tu-backend-url.com/api`
6. Haz clic en "Deploy"

### 3. ¡Listo! 🎉

Tu aplicación estará disponible en una URL como:
`https://javeriana-conecta-frontend.vercel.app`

## ⚠️ Notas Importantes

- **Root Directory**: Si el código está en `javerianaconecta/`, configura el Root Directory en Vercel como `javerianaconecta`
- **Variables de entorno**: Asegúrate de configurar `NEXT_PUBLIC_API_URL` con la URL real de tu backend
- **CORS**: Asegúrate de que tu backend permita requests desde el dominio de Vercel

## 📖 Documentación Completa

Para más detalles, consulta `DEPLOY.md`

