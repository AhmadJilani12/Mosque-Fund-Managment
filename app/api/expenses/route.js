import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Expense from '@/models/Expense';

export async function GET(req) {
  try {
    await connectDB();

    const expenses = await Expense.find().sort({ date: -1 });

    return NextResponse.json(
      {
        success: true,
        expenses,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get expenses error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch expenses' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const { amount, category, description, date } = await req.json();

    // Validation
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    if (!description || description.trim() === '') {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    const expense = new Expense({
      amount,
      category: category || 'bills',
      description,
      date: date ? new Date(date) : new Date(),
    });

    await expense.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Expense added successfully',
        expense,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Add expense error:', error);
    return NextResponse.json(
      { error: 'Failed to add expense' },
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
        { error: 'Expense ID is required' },
        { status: 400 }
      );
    }

    const expense = await Expense.findByIdAndDelete(id);

    if (!expense) {
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Expense deleted successfully',
    });
  } catch (error) {
    console.error('Delete expense error:', error);
    return NextResponse.json(
      { error: 'Failed to delete expense' },
      { status: 500 }
    );
  }
}
