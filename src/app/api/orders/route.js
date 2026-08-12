import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Order creation request:', body);
    
    const {
      customer_name,
      customer_phone,
      customer_email,
      delivery_address,
      delivery_area,
      order_type,
      items,
      total_amount,
      discount_amount,
      delivery_fee,
      payment_method,
      special_instructions,
    } = body;

    // Validate required fields
    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No items in order' },
        { status: 400 }
      );
    }

    if (!customer_name) {
      return NextResponse.json(
        { success: false, error: 'Customer name is required' },
        { status: 400 }
      );
    }

    if (!customer_phone) {
      return NextResponse.json(
        { success: false, error: 'Customer phone is required' },
        { status: 400 }
      );
    }

    if (!customer_email) {
      return NextResponse.json(
        { success: false, error: 'Customer email is required' },
        { status: 400 }
      );
    }

    if (order_type === 'delivery' && !delivery_address) {
      return NextResponse.json(
        { success: false, error: 'Delivery address is required for delivery orders' },
        { status: 400 }
      );
    }

    // Generate order number
    const orderNumber = `TH-${Date.now().toString().slice(-8)}`;

    // Insert order
    const result = await query(
      `INSERT INTO orders (
        order_number, 
        customer_name, 
        customer_phone, 
        customer_email,
        delivery_address, 
        delivery_area, 
        order_type, 
        total_amount,
        discount_amount, 
        delivery_fee, 
        payment_method, 
        payment_status,
        special_instructions, 
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderNumber,
        customer_name,
        customer_phone,
        customer_email,
        delivery_address || null,
        delivery_area || null,
        order_type || 'delivery',
        total_amount || 0,
        discount_amount || 0,
        delivery_fee || 0,
        payment_method || 'online',
        payment_method === 'online' ? 'pending' : 'pending',
        special_instructions || null,
        'pending',
      ]
    );

    const orderId = result.insertId;
    console.log('Order created with ID:', orderId);

    // Insert order items
    for (const item of items) {
      await query(
        `INSERT INTO order_items (
          order_id, 
          product_id, 
          product_name_en, 
          product_name_ar,
          quantity, 
          unit_price, 
          total_price
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.product_id || null,
          item.product_name_en || '',
          item.product_name_ar || '',
          item.quantity || 1,
          item.unit_price || 0,
          item.total_price || 0,
        ]
      );
    }

    // Get the created order with items
    const [order] = await query(
      'SELECT * FROM orders WHERE id = ?',
      [orderId]
    );

    const orderItems = await query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [orderId]
    );

    console.log('Order fetched:', order);

    return NextResponse.json({
      success: true,
      order: {
        ...order,
        items: orderItems
      }
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const orders = await query(
      `SELECT o.*, 
        COUNT(oi.id) as item_count,
        SUM(oi.quantity) as total_items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       GROUP BY o.id
       ORDER BY o.order_date DESC`
    );
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { order_id, status, payment_status } = body;

    if (!order_id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const updates = [];
    const values = [];

    if (status) {
      updates.push('status = ?');
      values.push(status);
    }

    if (payment_status) {
      updates.push('payment_status = ?');
      values.push(payment_status);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    updates.push('updated_at = NOW()');
    values.push(order_id);

    await query(
      `UPDATE orders SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const [updatedOrder] = await query(
      'SELECT * FROM orders WHERE id = ?',
      [order_id]
    );

    return NextResponse.json({
      success: true,
      order: updatedOrder
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}