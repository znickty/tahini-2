import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const {
      payment_status,
      payment_transaction_id,
      payment_method,
      payment_gateway,
      payment_id,
      status
    } = body;

    console.log('Updating payment for order:', id, body);

    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Build update query dynamically
    let updateFields = [];
    let updateValues = [];

    if (payment_status) {
      updateFields.push('payment_status = ?');
      updateValues.push(payment_status);
    }
    if (payment_transaction_id) {
      updateFields.push('payment_transaction_id = ?');
      updateValues.push(payment_transaction_id);
    }
    if (payment_method) {
      updateFields.push('payment_method = ?');
      updateValues.push(payment_method);
    }
    if (payment_gateway) {
      updateFields.push('payment_gateway = ?');
      updateValues.push(payment_gateway);
    }
    if (payment_id) {
      updateFields.push('payment_id = ?');
      updateValues.push(payment_id);
    }
    if (status) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    // Add updated_at
    updateFields.push('updated_at = NOW()');

    // Add id to values
    updateValues.push(id);

    const queryString = `UPDATE orders SET ${updateFields.join(', ')} WHERE id = ?`;
    console.log('Update query:', queryString, updateValues);
    
    await query(queryString, updateValues);

    // Get updated order
    const updatedOrders = await query(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );

    if (!updatedOrders || updatedOrders.length === 0) {
      return NextResponse.json(
        { error: 'Order not found after update' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: updatedOrders[0]
    });
  } catch (error) {
    console.error('Error updating order payment:', error);
    return NextResponse.json(
      { error: 'Failed to update order payment: ' + error.message },
      { status: 500 }
    );
  }
}