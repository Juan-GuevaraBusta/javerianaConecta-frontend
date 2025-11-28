# ✅ Verificación Final - Conexión Frontend-Backend

## 🔍 Checklist de Verificación

### ✅ Backend (EC2)
- [x] Backend corriendo en `34.217.206.3:3000`
- [x] FRONTEND_URL configurado: `https://javerianaconectafrontend.vercel.app`
- [x] CORS configurado correctamente
- [x] Security Group permite puerto 3000
- [x] Health check responde: `http://34.217.206.3:3000/api/health`

### ✅ Frontend (Vercel)
- [x] Variable `NEXT_PUBLIC_API_URL` configurada: `http://34.217.206.3:3000/api`
- [ ] **IMPORTANTE:** ¿Hiciste redeploy después de agregar la variable?

## 🚨 Si Sigue Fallando

### 1. Verificar que hiciste redeploy en Vercel

**CRÍTICO:** Después de agregar la variable de entorno, DEBES hacer redeploy:

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Tu proyecto → **Deployments**
3. Haz clic en los **3 puntos** (⋯) del último deployment
4. Selecciona **Redeploy**
5. Espera a que termine el deploy

### 2. Verificar en la consola del navegador

1. Abre https://javerianaconectafrontend.vercel.app
2. Abre la consola (F12)
3. Ve a la pestaña **Network**
4. Intenta crear una cuenta
5. Busca la petición a `/api/auth/register`
6. Revisa:
   - **Status:** ¿200, 400, 500, o Network Error?
   - **Request URL:** ¿Es `http://34.217.206.3:3000/api/auth/register`?
   - **CORS:** ¿Hay errores de CORS?

### 3. Verificar logs del backend

```bash
cd javerianaConecta
./connect-ec2.sh
pm2 logs javeriana-conecta-api
```

Deberías ver las peticiones llegando cuando intentas crear una cuenta.

### 4. Problema de Mixed Content (HTTPS → HTTP)

Si tu frontend está en HTTPS (Vercel) y el backend en HTTP, algunos navegadores pueden bloquear las peticiones.

**Solución temporal:** Prueba en modo incógnito o en otro navegador.

**Solución permanente:** Configurar HTTPS en el backend (usando un Load Balancer o certificado SSL).

## 🔧 Comandos de Verificación

### Verificar que el backend responde:
```bash
curl http://34.217.206.3:3000/api/health
```

### Verificar CORS:
```bash
curl -v -X OPTIONS http://34.217.206.3:3000/api/auth/register \
  -H "Origin: https://javerianaconectafrontend.vercel.app" \
  -H "Access-Control-Request-Method: POST"
```

Deberías ver: `Access-Control-Allow-Origin: https://javerianaconectafrontend.vercel.app`

## 📝 Estado Actual

- ✅ Backend: Corriendo y accesible
- ✅ CORS: Configurado para `https://javerianaconectafrontend.vercel.app`
- ✅ Security Group: Puerto 3000 abierto
- ⚠️ **Falta:** Redeploy en Vercel después de agregar la variable

## 🎯 Próximo Paso

**Haz redeploy en Vercel** y prueba nuevamente. Si sigue fallando, revisa la consola del navegador para ver el error específico.

