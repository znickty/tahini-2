import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 1. Fetch distinct products to prevent duplicate rows caused by JOINs
    const products = await query(`
      SELECT DISTINCT
        p.*, 
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
      LEFT JOIN (
        -- Group by product_id to ensure only 1 nutrition row per product is joined
        SELECT product_id, 
               MAX(calories) as calories, 
               MAX(cholesterol) as cholesterol, 
               MAX(carbohydrates) as carbohydrates, 
               MAX(fiber) as fiber, 
               MAX(sodium) as sodium, 
               MAX(protein) as protein, 
               MAX(fat) as fat
        FROM product_nutrition 
        GROUP BY product_id
      ) pn ON p.id = pn.product_id
      WHERE p.is_available = 1
      ORDER BY p.sort_order, p.id
    `);

    // 2. Efficiently fetch sizes and alerts in parallel using Promise.all
    const populatedProducts = await Promise.all(
      products.map(async (product) => {
        const [sizes, alerts] = await Promise.all([
          query(
            'SELECT * FROM product_sizes WHERE product_id = ? ORDER BY sort_order',
            [product.id]
          ),
          query(
            'SELECT * FROM product_alerts WHERE product_id = ?',
            [product.id]
          )
        ]);

        return {
          ...product,
          sizes: sizes || [],
          alerts: alerts || []
        };
      })
    );

    return NextResponse.json(populatedProducts);
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
      preparation_time_minutes,
      kcal,
      calories,
      cholesterol,
      carbohydrates,
      fiber,
      sodium,
      protein,
      fat,
      alerts,
      sizes,
      sort_order,
    } = body;

    // Insert product
    const result = await query(
      `INSERT INTO products (
        category_id, name_en, name_ar, description_en, description_ar,
        price, discount_price, image_url, is_available, is_featured,
        preparation_time_minutes, kcal, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      ]
    );

    const productId = result.insertId;

    // Insert nutritional info
    if (calories || cholesterol || carbohydrates || fiber || sodium || protein || fat) {
      await query(
        `INSERT INTO product_nutrition (
          product_id, calories, cholesterol, carbohydrates, fiber, sodium, protein, fat
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          productId,
          calories || null,
          cholesterol || null,
          carbohydrates || null,
          fiber || null,
          sodium || null,
          protein || null,
          fat || null,
        ]
      );
    }

    // Insert sizes
    if (sizes && sizes.length > 0) {
      for (const size of sizes) {
        await query(
          `INSERT INTO product_sizes (product_id, name_en, name_ar, price, sort_order)
           VALUES (?, ?, ?, ?, ?)`,
          [productId, size.name_en, size.name_ar, size.price, size.sort_order || 0]
        );
      }
    }

    // Insert alerts
    if (alerts && alerts.length > 0) {
      for (const alert of alerts) {
        await query(
          `INSERT INTO product_alerts (product_id, alert_type, name_en, name_ar)
           VALUES (?, ?, ?, ?)`,
          [productId, alert.alert_type, alert.name_en, alert.name_ar]
        );
      }
    }

    return NextResponse.json({
      success: true,
      id: productId,
      message: 'Product created successfully',
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product: ' + error.message },
      { status: 500 }
    );
  }
}