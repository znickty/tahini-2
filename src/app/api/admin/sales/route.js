import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    // Get daily sales summary
    const [dailySales] = await query(
      `SELECT 
        COUNT(*) as total_orders,
        SUM(total_amount) as total_revenue,
        SUM(CASE WHEN payment_method = 'cash' THEN total_amount ELSE 0 END) as cash_payments,
        SUM(CASE WHEN payment_method = 'card' THEN total_amount ELSE 0 END) as card_payments,
        SUM(CASE WHEN payment_method = 'online' THEN total_amount ELSE 0 END) as online_payments
      FROM orders
      WHERE DATE(order_date) = ? AND status != 'cancelled'`,
      [date]
    );

    // Get custom sales
    const customSales = await query(
      `SELECT * FROM custom_sales 
       WHERE sale_date = ?
       ORDER BY created_at DESC`,
      [date]
    );

    // Get daily sales trends (last 7 days)
    const trends = await query(
      `SELECT 
        DATE(order_date) as date,
        COUNT(*) as orders,
        SUM(total_amount) as revenue
      FROM orders
      WHERE DATE(order_date) >= DATE_SUB(?, INTERVAL 7 DAY)
        AND status != 'cancelled'
      GROUP BY DATE(order_date)
      ORDER BY DATE(order_date)`,
      [date]
    );

    return NextResponse.json({
      date,
      ...dailySales,
      custom_sales: customSales,
      trends,
    });
  } catch (error) {
    console.error('Error fetching sales:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sales data' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { sale_date, description_en, description_ar, amount, payment_method } = body;

    const result = await query(
      `INSERT INTO custom_sales (sale_date, description_en, description_ar, amount, payment_method)
       VALUES (?, ?, ?, ?, ?)`,
      [sale_date, description_en, description_ar, amount, payment_method || 'cash']
    );

    return NextResponse.json({
      success: true,
      id: result.insertId,
      message: 'Custom sale recorded successfully',
    });
  } catch (error) {
    console.error('Error recording custom sale:', error);
    return NextResponse.json(
      { error: 'Failed to record custom sale' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    await query('DELETE FROM custom_sales WHERE id = ?', [id]);
    
    return NextResponse.json({
      success: true,
      message: 'Custom sale deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting custom sale:', error);
    return NextResponse.json(
      { error: 'Failed to delete custom sale' },
      { status: 500 }
    );
  }
}