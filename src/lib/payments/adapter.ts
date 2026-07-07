export interface PaymentRequest {
  orderId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  items: { name: string; price: number; quantity: number }[];
}

export interface PaymentResponse {
  success: boolean;
  paymentUrl?: string; // Para redirecciones (PayU, ePayco, Mercado Pago, PayPal)
  transactionId?: string;
  error?: string;
}

// Interfaz genérica para cualquier pasarela de pagos
export interface PaymentProvider {
  name: string;
  processPayment(request: PaymentRequest): Promise<PaymentResponse>;
  validateWebhook(headers: Record<string, string>, body: any): Promise<{ orderId: string; success: boolean }>;
}

// --- PROVEEDOR SIMULADO (MOCK) ---
// Sirve para probar el flujo de checkout en local sin credenciales reales.
export class MockPaymentProvider implements PaymentProvider {
  name = 'mock';

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    // Simulamos que la pasarela genera una URL de pago en nuestro servidor
    const mockPaymentUrl = `/checkout/simular?orderId=${request.orderId}&total=${request.amount}`;
    
    return {
      success: true,
      paymentUrl: mockPaymentUrl,
      transactionId: `mock_tx_${Date.now()}`,
    };
  }

  async validateWebhook(headers: Record<string, string>, body: any) {
    return {
      orderId: body.orderId || '',
      success: body.status === 'success',
    };
  }
}

// --- PROVEEDOR MERCADO PAGO (ESBOZO DE INTEGRACIÓN) ---
// Demostración de cómo se integraría Mercado Pago Colombia
export class MercadoPagoProvider implements PaymentProvider {
  name = 'mercadopago';

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Aquí se llamaría a la API oficial de Mercado Pago SDK o REST API
      // fetch('https://api.mercadopago.com/checkout/preferences', { headers, body })
      
      return {
        success: true,
        paymentUrl: `https://www.mercadopago.com.co/checkout/v1/redirect?pref_id=placeholder`,
        transactionId: `mp_pref_${crypto.randomUUID().slice(0, 8)}`,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message,
      };
    }
  }

  async validateWebhook(headers: Record<string, string>, body: any) {
    // Lógica para validar firma de Mercado Pago
    return {
      orderId: body.data?.id || '',
      success: body.type === 'payment' && body.action === 'payment.created',
    };
  }
}

// --- CONFIGURADOR DE PAGOS ---
// Obtiene el adaptador según la variable de entorno configurada
export function getPaymentProvider(providerName?: string): PaymentProvider {
  const name = providerName || process.env.PAYMENT_PROVIDER || 'mock';

  switch (name.toLowerCase()) {
    case 'mercadopago':
      return new MercadoPagoProvider();
    case 'mock':
    default:
      return new MockPaymentProvider();
  }
}
