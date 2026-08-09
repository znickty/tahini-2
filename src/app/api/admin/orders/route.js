import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const orders = await query(
      `SELECT * FROM orders 
       ORDER BY order_date DESC`
    );
    
    // Get order items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await query(
          'SELECT * FROM order_items WHERE order_id = ?',
          [order.id]
        );
        return { ...order, items };
      })
    );
    
    return NextResponse.json(ordersWithItems);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}