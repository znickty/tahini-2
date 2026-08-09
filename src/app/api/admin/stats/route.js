import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Get total products
    const [totalProducts] = await query(
      'SELECT COUNT(*) as count FROM products'
    );
    
    // Get today's orders
    const [todayOrders] = await query(
      `SELECT COUNT(*) as count, SUM(total_amount) as revenue 
       FROM orders 
       WHERE DATE(order_date) = ? AND status != 'cancelled'`,
      [today]
    );
    
    // Get total orders and revenue
    const [totalStats] = await query(
      `SELECT COUNT(*) as count, SUM(total_amount) as revenue 
       FROM orders 
       WHERE status != 'cancelled'`
    );
    
    return NextResponse.json({
      totalProducts: totalProducts.count || 0,
      todayOrders: todayOrders.count || 0,
      todayRevenue: todayOrders.revenue || 0,
      totalOrders: totalStats.count || 0,
      totalRevenue: totalStats.revenue || 0,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}