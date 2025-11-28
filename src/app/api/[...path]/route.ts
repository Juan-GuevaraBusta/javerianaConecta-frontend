import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://34.217.206.3:3000/api';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return proxyRequest(request, params.path, 'GET');
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return proxyRequest(request, params.path, 'POST');
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return proxyRequest(request, params.path, 'PUT');
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return proxyRequest(request, params.path, 'PATCH');
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return proxyRequest(request, params.path, 'DELETE');
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

async function proxyRequest(
  request: NextRequest,
  pathSegments: string[],
  method: string
) {
  try {
    const path = pathSegments.join('/');
    // BACKEND_URL ya incluye '/api', así que solo necesitamos el path sin 'api'
    let cleanPath = path;
    if (cleanPath.startsWith('api/')) {
      cleanPath = cleanPath.substring(4);
    }
    
    // Construir URL completa del backend
    const backendBase = BACKEND_URL.endsWith('/api') 
      ? BACKEND_URL.substring(0, BACKEND_URL.length - 4) 
      : BACKEND_URL.replace(/\/api$/, '');
    const url = `${backendBase}/api/${cleanPath}${request.nextUrl.search}`;
    
    console.log(`[Proxy] ${method} ${request.nextUrl.pathname} -> ${url}`);
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Copiar todos los headers relevantes
    const authHeader = request.headers.get('Authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    const contentType = request.headers.get('Content-Type');
    if (contentType && contentType !== 'application/json') {
      headers['Content-Type'] = contentType;
    }
    
    const body = method !== 'GET' && method !== 'DELETE' 
      ? await request.text() 
      : undefined;
    
    // Hacer la petición al backend HTTP desde el servidor
    const response = await fetch(url, {
      method,
      headers,
      body,
    });
    
    const data = await response.text();
    
    // Headers de respuesta SIN restricciones de seguridad
    const responseHeaders: HeadersInit = {
      'Content-Type': response.headers.get('Content-Type') || 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400',
    };
    
    return new NextResponse(data, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('[Proxy Error]', error);
    return NextResponse.json(
      { 
        error: 'Error al conectar con el backend',
        details: error instanceof Error ? error.message : 'Unknown error',
        path: pathSegments.join('/'),
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  }
}

