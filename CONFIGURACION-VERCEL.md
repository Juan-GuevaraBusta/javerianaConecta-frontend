# 🔗 Configuración de Vercel para Conectar con el Backend

## 📋 Información del Backend

- **URL del Backend:** `http://34.217.206.3:3000/api`
- **IP del Servidor:** `34.217.206.3`
- **Puerto:** `3000`

## ⚙️ Configuración en Vercel

### Paso 1: Agregar Variable de Entorno

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto `javerianaConecta-frontend`
3. Ve a **Settings** → **Environment Variables**
4. Agrega la siguiente variable:

   **Key:** `NEXT_PUBLIC_API_URL`
   
   **Value:** `http://34.217.206.3:3000/api`
   
   **Environments:** ✅ Production, ✅ Preview, ✅ Development

5. Haz clic en **Save**

### Paso 2: Redesplegar la Aplicación

Después de agregar la variable de entorno, necesitas redesplegar:

1. Ve a la pestaña **Deployments**
2. Haz clic en los **3 puntos** (⋯) del último deployment
3. Selecciona **Redeploy**
4. O simplemente haz un nuevo push a tu repositorio

## 🔒 Configuración del Backend (CORS)

El backend ya está configurado para aceptar requests desde cualquier origen (`FRONTEND_URL=*`).

**Para producción, es recomendable actualizar esto a la URL exacta de tu frontend:**

1. Conéctate al servidor:
   ```bash
   cd javerianaConecta
   ./connect-ec2.sh
   ```

2. Edita el archivo `.env`:
   ```bash
   cd ~/apps/javerianaConecta
   nano .env
   ```

3. Cambia `FRONTEND_URL=*` a:
   ```env
   FRONTEND_URL=https://tu-proyecto.vercel.app
   ```
   (Reemplaza `tu-proyecto.vercel.app` con tu URL real de Vercel)

4. Reinicia el backend:
   ```bash
   pm2 restart javeriana-conecta-api
   ```

## 🔥 Configurar Security Group en AWS

**IMPORTANTE:** Asegúrate de que el Security Group de tu instancia EC2 permita tráfico en el puerto 3000:

1. Ve a [AWS Console](https://console.aws.amazon.com) → EC2
2. Selecciona tu instancia (IP: 34.217.206.3)
3. Ve a **Security** → **Security Groups**
4. Haz clic en el Security Group
5. Ve a **Inbound rules** → **Edit inbound rules**
6. Agrega una regla:
   - **Type:** Custom TCP
   - **Port:** 3000
   - **Source:** 0.0.0.0/0 (o tu IP específica para mayor seguridad)
   - **Description:** Backend API
7. Haz clic en **Save rules**

## ✅ Verificación

### Verificar que el Backend responde:

```bash
curl http://34.217.206.3:3000/api/health
```

Deberías recibir una respuesta JSON con el estado del backend.

### Verificar desde el Frontend:

1. Abre tu aplicación en Vercel
2. Abre la consola del navegador (F12)
3. Intenta hacer login o cualquier acción que llame al backend
4. Verifica que no haya errores de CORS

## 🐛 Troubleshooting

### Error: "Network Error" o "Failed to fetch"

- Verifica que el Security Group permita tráfico en el puerto 3000
- Verifica que el backend esté corriendo: `pm2 status`
- Verifica los logs del backend: `pm2 logs javeriana-conecta-api`

### Error: "CORS policy"

- Verifica que `FRONTEND_URL` en el backend esté configurado correctamente
- Reinicia el backend después de cambiar `.env`: `pm2 restart javeriana-conecta-api`

### Error: "Connection refused"

- Verifica que el backend esté corriendo: `pm2 status`
- Verifica que el puerto 3000 esté abierto en el Security Group
- Verifica los logs: `pm2 logs javeriana-conecta-api`

## 📝 URLs Importantes

- **Backend API:** `http://34.217.206.3:3000/api`
- **Health Check:** `http://34.217.206.3:3000/api/health`
- **Swagger Docs:** `http://34.217.206.3:3000/api/docs`
- **Frontend (Vercel):** `https://tu-proyecto.vercel.app`

## 🎯 Resumen de Configuración

### Frontend (Vercel):
- ✅ Variable de entorno: `NEXT_PUBLIC_API_URL=http://34.217.206.3:3000/api`

### Backend (EC2):
- ✅ `FRONTEND_URL=*` (o URL específica de Vercel)
- ✅ Puerto 3000 abierto en Security Group
- ✅ Backend corriendo con PM2

¡Listo! Tu frontend y backend deberían estar conectados. 🚀

