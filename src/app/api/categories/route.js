import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const categories = await query(
      'SELECT * FROM categories WHERE is_active = 1 ORDER BY sort_order, id'
    );
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name_en, name_ar, description_en, description_ar, icon, image_url, sort_order } = body;

    if (!name_en || !name_ar) {
      return NextResponse.json(
        { error: 'Category names are required' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO categories (name_en, name_ar, description_en, description_ar, icon, image_url, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name_en, name_ar, description_en || null, description_ar || null, icon || null, image_url || null, sort_order || 0]
    );

    return NextResponse.json({
      success: true,
      id: result.insertId,
      message: 'Category created successfully',
    });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, name_en, name_ar, description_en, description_ar, icon, image_url, sort_order, is_active } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    await query(
      `UPDATE categories 
       SET name_en = ?, name_ar = ?, description_en = ?, description_ar = ?, 
           icon = ?, image_url = ?, sort_order = ?, is_active = ?
       WHERE id = ?`,
      [name_en, name_ar, description_en, description_ar, icon, image_url, sort_order || 0, is_active !== undefined ? is_active : true, id]
    );

    return NextResponse.json({
      success: true,
      message: 'Category updated successfully',
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    await query('DELETE FROM categories WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category: ' + error.message },
      { status: 500 }
    );
  }
}