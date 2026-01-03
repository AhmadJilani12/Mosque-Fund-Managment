import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Balance from '@/models/Balance';

export async function GET(req) {
  try {
    await connectDB();

    const balances = await Balance.find().sort({ date: -1 });

    return NextResponse.json(
      {
        success: true,
        balances,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get balances error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch balances' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const { type, amount, date, notes } = await req.json();

    // Validation
    if (amount === null || amount === undefined) {
      return NextResponse.json(
        { error: 'Amount is required' },
        { status: 400 }
      );
    }

    const balance = new Balance({
      type: type || 'adjustment',
      amount: parseFloat(amount),
      date: date ? new Date(date) : new Date(),
      notes: notes || '',
    });

    await balance.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Balance record added successfully',
        balance,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Add balance error:', error);
    return NextResponse.json(
      { error: 'Failed to add balance record' },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Balance ID is required' },
        { status: 400 }
      );
    }

    const balance = await Balance.findByIdAndDelete(id);

    if (!balance) {
      return NextResponse.json(
        { error: 'Balance record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Balance record deleted successfully',
    });
  } catch (error) {
    console.error('Delete balance error:', error);
    return NextResponse.json(
      { error: 'Failed to delete balance record' },
      { status: 500 }
    );
  }
}
