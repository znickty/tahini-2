import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { status } = await request.json();

    await query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );

    return NextResponse.json({
      success: true,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const order = await query(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );

    if (order.length === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const items = await query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [id]
    );

    return NextResponse.json({ ...order[0], items });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}