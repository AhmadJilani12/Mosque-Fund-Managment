import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Donor from '@/models/Donor';

export async function GET(req) {
  try {
    await connectDB();

    const donors = await Donor.find().sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        donors,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get donors error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch donors' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const { name, phone, address, defaultAmount, notes } = await req.json();

    // Validation
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Donor name is required' },
        { status: 400 }
      );
    }

    const donor = new Donor({
      name: name.trim(),
      phone: phone || '',
      address: address || '',
      defaultAmount: defaultAmount || 0,
      notes: notes || '',
    });

    await donor.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Donor added successfully',
        donor,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Add donor error:', error);
    return NextResponse.json(
      { error: 'Failed to add donor' },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await connectDB();

    const { id, name, phone, address, defaultAmount, notes } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Donor ID is required' },
        { status: 400 }
      );
    }

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Donor name is required' },
        { status: 400 }
      );
    }

    const donor = await Donor.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        phone: phone || '',
        address: address || '',
        defaultAmount: defaultAmount || 0,
        notes: notes || '',
      },
      { new: true }
    );

    if (!donor) {
      return NextResponse.json(
        { error: 'Donor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Donor updated successfully',
        donor,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update donor error:', error);
    return NextResponse.json(
      { error: 'Failed to update donor' },
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
        { error: 'Donor ID is required' },
        { status: 400 }
      );
    }

    const donor = await Donor.findByIdAndDelete(id);

    if (!donor) {
      return NextResponse.json(
        { error: 'Donor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Donor deleted successfully',
    });
  } catch (error) {
    console.error('Delete donor error:', error);
    return NextResponse.json(
      { error: 'Failed to delete donor' },
      { status: 500 }
    );
  }
}
