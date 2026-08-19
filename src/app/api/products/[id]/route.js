import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const [product] = await query(
      `SELECT p.*, 
        c.name_en as category_name_en, 
        c.name_ar as category_name_ar,
        pn.calories,
        pn.cholesterol,
        pn.carbohydrates,
        pn.fiber,
        pn.sodium,
        pn.protein,
        pn.fat
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_nutrition pn ON p.id = pn.product_id
      WHERE p.id = ?`,
      [id]
    );

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Get sizes
    const sizes = await query(
      'SELECT * FROM product_sizes WHERE product_id = ? ORDER BY sort_order',
      [id]
    );

    // Get alerts
    const alerts = await query(
      'SELECT * FROM product_alerts WHERE product_id = ?',
      [id]
    );

    return NextResponse.json({
      ...product,
      sizes,
      alerts
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
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
      preparation_time_minutes,
      kcal,
      sort_order,
      calories,
      cholesterol,
      carbohydrates,
      fiber,
      sodium,
      protein,
      fat,
      sizes,
      alerts,
    } = body;

    // Update product
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
        preparation_time_minutes = ?,
        kcal = ?,
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
        preparation_time_minutes || 0,
        kcal || null,
        sort_order || 0,
        id,
      ]
    );

    // Update or insert nutritional info
    await query(
      `INSERT INTO product_nutrition (product_id, calories, cholesterol, carbohydrates, fiber, sodium, protein, fat)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       calories = VALUES(calories),
       cholesterol = VALUES(cholesterol),
       carbohydrates = VALUES(carbohydrates),
       fiber = VALUES(fiber),
       sodium = VALUES(sodium),
       protein = VALUES(protein),
       fat = VALUES(fat)`,
      [
        id,
        calories || null,
        cholesterol || null,
        carbohydrates || null,
        fiber || null,
        sodium || null,
        protein || null,
        fat || null,
      ]
    );

    // Update sizes - delete existing and insert new
    await query('DELETE FROM product_sizes WHERE product_id = ?', [id]);
    if (sizes && sizes.length > 0) {
      for (const size of sizes) {
        await query(
          `INSERT INTO product_sizes (product_id, name_en, name_ar, price, sort_order)
           VALUES (?, ?, ?, ?, ?)`,
          [id, size.name_en, size.name_ar, size.price, size.sort_order || 0]
        );
      }
    }

    // Update alerts - delete existing and insert new
    await query('DELETE FROM product_alerts WHERE product_id = ?', [id]);
    if (alerts && alerts.length > 0) {
      for (const alert of alerts) {
        await query(
          `INSERT INTO product_alerts (product_id, alert_type, name_en, name_ar)
           VALUES (?, ?, ?, ?)`,
          [id, alert.alert_type, alert.name_en, alert.name_ar]
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    // Delete related data first (cascade should handle this, but just in case)
    await query('DELETE FROM product_sizes WHERE product_id = ?', [id]);
    await query('DELETE FROM product_alerts WHERE product_id = ?', [id]);
    await query('DELETE FROM product_nutrition WHERE product_id = ?', [id]);
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