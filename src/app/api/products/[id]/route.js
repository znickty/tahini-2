import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    await query('DELETE FROM products WHERE id = ?', [id]);
    
    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
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
      sort_order,
    } = body;

    await query(
      `UPDATE products SET
        category_id = ?,
        name_en = ?,
        name_ar = ?,
        description_en = ?,
        description_ar = ?,
        price = ?,
        discount_price = ?,
        image_url = ?,
        is_available = ?,
        is_featured = ?,
        preparation_time = ?,
        calories = ?,
        sort_order = ?
      WHERE id = ?`,
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
        sort_order || 0,
        id,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const product = await query(
      `SELECT p.*, c.name_en as category_name_en, c.name_ar as category_name_ar
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [id]
    );

    if (product.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}