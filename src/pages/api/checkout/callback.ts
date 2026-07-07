import type { APIRoute } from 'astro';
import { db, orders, products } from '../../../db/client';
import { eq } from 'drizzle-orm';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return new Response(JSON.stringify({ error: 'Faltan parámetros requeridos.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 1. Obtener la orden de la base de datos
    const orderResult = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    const order = orderResult[0];

    if (!order) {
      return new Response(JSON.stringify({ error: 'La orden no existe.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (status === 'success') {
      // --- TRANSACCIÓN EXITOSA ---
      
      // Si la orden ya está pagada, no repetimos la lógica de stock
      if (order.status !== 'paid') {
        // 2. Actualizar el stock de los productos comprados
        const items = JSON.parse(order.items || '[]');
        
        for (const item of items) {
          const productResult = await db.select().from(products).where(eq(products.id, item.productId)).limit(1);
          const product = productResult[0];
          
          if (product) {
            const newStock = Math.max(0, product.stock - item.quantity);
            await db
              .update(products)
              .set({ stock: newStock })
              .where(eq(products.id, item.productId));
          }
        }

        // 3. Marcar la orden como pagada
        await db
          .update(orders)
          .set({
            status: 'paid',
            updatedAt: Date.now(),
          })
          .where(eq(orders.id, orderId));
      }

      return new Response(JSON.stringify({ success: true, status: 'paid' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
      
    } else {
      // --- TRANSACCIÓN CANCELADA / RECHAZADA ---
      await db
        .update(orders)
        .set({
          status: 'cancelled',
          updatedAt: Date.now(),
        })
        .where(eq(orders.id, orderId));

      return new Response(JSON.stringify({ success: true, status: 'cancelled' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Error interno en el callback de pagos.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
