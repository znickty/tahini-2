import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    console.log('Fetching order with ID:', id);
    
    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Get the order
    const orders = await query(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );

    if (!orders || orders.length === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const order = orders[0];

    // Get order items
    const items = await query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [id]
    );

    return NextResponse.json({
      ...order,
      items: items || []
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, payment_status } = body;

    if (!id) {
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
    values.push(id);

    await query(
      `UPDATE orders SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const updatedOrders = await query(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );

    if (!updatedOrders || updatedOrders.length === 0) {
      return NextResponse.json(
        { error: 'Order not found after update' },
        { status: 404 }
      );
    }

    const updatedOrder = updatedOrders[0];

    // Get order items
    const items = await query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [id]
    );

    return NextResponse.json({
      success: true,
      order: {
        ...updatedOrder,
        items: items || []
      }
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Delete order items first (foreign key constraint)
    await query(
      'DELETE FROM order_items WHERE order_id = ?',
      [id]
    );

    // Delete the order
    await query(
      'DELETE FROM orders WHERE id = ?',
      [id]
    );

    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { error: 'Failed to delete order: ' + error.message },
      { status: 500 }
    );
  }
}