import type { APIRoute } from 'astro';
import { db, orders, products } from '../../db/client';
import { getPaymentProvider } from '../../lib/payments/adapter';
import { inArray } from 'drizzle-orm';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { customerName, customerEmail, cartItems } = body;

    if (!customerName || !customerEmail || !cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return new Response(JSON.stringify({ error: 'Datos de cliente o carrito inválidos.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 1. Obtener IDs de los productos comprados
    const productIds = cartItems.map((item: any) => item.id);

    // 2. Buscar productos en la base de datos para verificar precios reales (evitar fraudes)
    const dbProducts = await db
      .select()
      .from(products)
      .where(inArray(products.id, productIds));

    if (dbProducts.length === 0) {
      return new Response(JSON.stringify({ error: 'Los productos del carrito no existen.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 3. Calcular el total real basado en precios de base de datos
    let calculatedTotal = 0;
    const validatedItems = [];

    for (const item of cartItems) {
      const dbProduct = dbProducts.find((p) => p.id === item.id);
      
      if (!dbProduct) {
        return new Response(JSON.stringify({ error: `El producto ${item.name} no está disponible.` }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Validar inventario básico
      if (dbProduct.stock < item.quantity) {
        return new Response(JSON.stringify({ error: `Stock insuficiente para ${dbProduct.name}.` }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const itemTotal = dbProduct.price * item.quantity;
      calculatedTotal += itemTotal;

      validatedItems.push({
        productId: dbProduct.id,
        name: dbProduct.name,
        price: dbProduct.price,
        quantity: item.quantity,
      });
    }

    // 4. Crear la orden de compra en estado pendiente
    const orderId = crypto.randomUUID();
    const now = Date.now();

    await db.insert(orders).values({
      id: orderId,
      customerName,
      customerEmail,
      status: 'pending',
      total: calculatedTotal,
      items: JSON.stringify(validatedItems),
      createdAt: now,
      updatedAt: now,
    });

    // 5. Procesar el pago a través de la pasarela activa
    const paymentProvider = getPaymentProvider();
    
    const paymentResult = await paymentProvider.processPayment({
      orderId,
      amount: calculatedTotal,
      customerName,
      customerEmail,
      items: validatedItems,
    });

    if (paymentResult.success && paymentResult.paymentUrl) {
      // Actualizar la orden con el ID de la transacción y proveedor de pagos
      await db
        .update(orders)
        .set({
          paymentProvider: paymentProvider.name,
          paymentId: paymentResult.transactionId || null,
        })
        .where(eq(orders.id, orderId));

      return new Response(JSON.stringify({ 
        success: true, 
        paymentUrl: paymentResult.paymentUrl 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ error: paymentResult.error || 'Fallo en la pasarela de pagos.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Error del servidor al procesar el checkout.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

import { eq } from 'drizzle-orm';
