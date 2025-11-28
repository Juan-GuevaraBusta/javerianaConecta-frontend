# ⚙️ Configuración de Vercel - IMPORTANTE

## 🔗 URL del Frontend
**https://javerianaconectafrontend.vercel.app**

## 📋 Variable de Entorno Requerida

### Paso 1: Agregar Variable en Vercel

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto: **javerianaConecta-frontend**
3. Ve a **Settings** → **Environment Variables**
4. Haz clic en **Add New**
5. Configura:
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** `http://34.217.206.3:3000/api`
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development
6. Haz clic en **Save**

### Paso 2: Redeploy

**IMPORTANTE:** Después de agregar la variable, debes hacer redeploy:

1. Ve a la pestaña **Deployments**
2. Haz clic en los **3 puntos** (⋯) del último deployment
3. Selecciona **Redeploy**
4. O simplemente haz un nuevo push a tu repositorio

## ✅ Verificación

Después del redeploy, verifica:

1. Abre tu aplicación: https://javerianaconectafrontend.vercel.app
2. Abre la consola del navegador (F12)
3. Intenta crear una cuenta
4. Si funciona, no deberías ver errores de "Network Error"

## 🔒 Security Group en AWS

**IMPORTANTE:** Asegúrate de que el Security Group de tu instancia EC2 permita tráfico en el puerto 3000:

1. Ve a [AWS Console](https://console.aws.amazon.com) → EC2
2. Selecciona tu instancia (IP: 34.217.206.3)
3. **Security** → **Security Groups** → Edita el Security Group
4. **Inbound rules** → **Edit inbound rules** → **Add rule**
5. Configura:
   - **Type:** Custom TCP
   - **Port:** 3000
   - **Source:** 0.0.0.0/0
   - **Description:** Backend API
6. **Save rules**

## 🐛 Si Sigue Fallando

### Verificar que el backend sea accesible:
```bash
curl http://34.217.206.3:3000/api/health
```

Si no funciona, el Security Group no está configurado correctamente.

### Verificar logs del backend:
```bash
cd javerianaConecta
./connect-ec2.sh
pm2 logs javeriana-conecta-api
```

