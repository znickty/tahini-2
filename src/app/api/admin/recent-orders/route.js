import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const orders = await query(
      `SELECT * FROM orders 
       ORDER BY order_date DESC 
       LIMIT 10`
    );
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent orders' },
      { status: 500 }
    );
  }
}