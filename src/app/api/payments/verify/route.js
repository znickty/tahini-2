import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

const MOYASAR_API_URL = 'https://api.moyasar.com/v1';
const MOYASAR_SECRET_KEY = process.env.MOYASAR_SECRET_KEY;

export async function POST(request) {
  try {
    const body = await request.json();
    const { payment_id } = body;

    console.log('Verifying payment:', payment_id);

    if (!payment_id) {
      return NextResponse.json(
        { success: false, error: 'Payment ID is required' },
        { status: 400 }
      );
    }

    // Fetch payment from Moyasar
    const response = await fetch(`${MOYASAR_API_URL}/payments/${payment_id}`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${MOYASAR_SECRET_KEY}:`).toString('base64')}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Moyasar API error:', errorData);
      return NextResponse.json(
        { success: false, error: errorData.message || 'Failed to fetch payment from Moyasar' },
        { status: response.status }
      );
    }

    const payment = await response.json();
    console.log('Payment from Moyasar:', payment);

    // Find order by payment ID or by metadata
    let order = null;
    let orderId = null;

    // First try to find by payment_id in orders table
    const ordersByPaymentId = await query(
      'SELECT * FROM orders WHERE payment_id = ?',
      [payment_id]
    );

    if (ordersByPaymentId && ordersByPaymentId.length > 0) {
      order = ordersByPaymentId[0];
      orderId = order.id;
    } else {
      // Try to find by order_id from metadata
      const metadataOrderId = payment.metadata?.orderId || payment.metadata?.order_id;
      if (metadataOrderId) {
        const ordersByMetadata = await query(
          'SELECT * FROM orders WHERE id = ?',
          [metadataOrderId]
        );
        if (ordersByMetadata && ordersByMetadata.length > 0) {
          order = ordersByMetadata[0];
          orderId = order.id;
        }
      }
    }

    if (!order) {
      console.error('Order not found for payment:', payment_id);
      return NextResponse.json(
        { success: false, error: 'Order not found for this payment' },
        { status: 404 }
      );
    }

    // Check payment status
    if (payment.status === 'paid') {
      // Update order status to paid and confirmed
      await query(
        `UPDATE orders 
         SET payment_status = 'paid', 
             status = 'confirmed',
             payment_transaction_id = ?,
             payment_gateway = 'moyasar',
             payment_id = ?,
             payment_details = ?,
             updated_at = NOW()
         WHERE id = ?`,
        [
          payment.id,
          payment.id,
          JSON.stringify(payment),
          orderId
        ]
      );
      
      console.log('Order updated to paid:', orderId);
    } else if (payment.status === 'failed' || payment.status === 'void') {
      // Update order status to failed
      await query(
        `UPDATE orders 
         SET payment_status = 'failed', 
             status = 'cancelled',
             payment_details = ?,
             updated_at = NOW()
         WHERE id = ?`,
        [
          JSON.stringify(payment),
          orderId
        ]
      );
      
      console.log('Order updated to failed:', orderId);
    } else {
      // Payment is still pending or in other state
      await query(
        `UPDATE orders 
         SET payment_details = ?,
             updated_at = NOW()
         WHERE id = ?`,
        [
          JSON.stringify(payment),
          orderId
        ]
      );
      
      console.log('Order payment details updated:', orderId);
    }

    // Get updated order
    const updatedOrders = await query(
      'SELECT * FROM orders WHERE id = ?',
      [orderId]
    );

    const updatedOrder = updatedOrders && updatedOrders.length > 0 ? updatedOrders[0] : null;

    return NextResponse.json({
      success: payment.status === 'paid',
      order: updatedOrder,
      payment: payment,
      status: payment.status,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Payment verification failed: ' + error.message },
      { status: 500 }
    );
  }
}