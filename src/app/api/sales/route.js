import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    // Get daily sales summary
    const dailySales = await query(
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
      `SELECT * FROM custom_sales WHERE sale_date = ?`,
      [date]
    );

    return NextResponse.json({
      date,
      ...dailySales[0],
      custom_sales: customSales,
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