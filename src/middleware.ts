import { defineMiddleware } from 'astro:middleware';
import { validateSession } from './lib/auth';
import { getSetting } from './lib/settings';

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  const path = url.pathname;

  // Consultar configuración de la tienda
  const isStoreEnabled = (await getSetting('enable_store', 'true')) === 'true';

  // 1. Proteger rutas de tienda (si está deshabilitada)
  if (!isStoreEnabled) {
    // Si intenta acceder a productos o checkout en la zona pública
    if (path.startsWith('/productos') || path.startsWith('/checkout')) {
      return context.redirect('/');
    }
    // Si intenta acceder a la gestión de productos o pedidos en el admin
    if (path.startsWith('/admin/productos') || path.startsWith('/admin/ordenes')) {
      return context.redirect('/admin');
    }
  }

  // 2. Proteger rutas de administración general
  if (path.startsWith('/admin') && path !== '/admin/login' && path !== '/admin/logout') {
    const sessionId = context.cookies.get('session_id')?.value;
    const auth = sessionId ? await validateSession(sessionId) : null;

    if (!auth) {
      return context.redirect('/admin/login');
    }

    context.locals.user = auth.user;
  }

  return next();
});
