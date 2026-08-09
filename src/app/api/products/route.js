import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const products = await query(`
      SELECT p.*, c.name_en as category_name_en, c.name_ar as category_name_ar
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_available = 1
      ORDER BY p.sort_order, p.id
    `);
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      category_id,
      name_en,
      name_ar,
      description_en,
      description_ar,
      price,
      discount_price,
      image_url,
      is_available,
      is_featured,
      preparation_time,
      calories,
    } = body;

    const result = await query(
      `INSERT INTO products (
        category_id, name_en, name_ar, description_en, description_ar,
        price, discount_price, image_url, is_available, is_featured,
        preparation_time, calories
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        category_id,
        name_en,
        name_ar,
        description_en,
        description_ar,
        price,
        discount_price || null,
        image_url || null,
        is_available !== undefined ? is_available : true,
        is_featured || false,
        preparation_time || 15,
        calories || null,
      ]
    );

    return NextResponse.json({
      id: result.insertId,
      message: 'Product created successfully',
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}