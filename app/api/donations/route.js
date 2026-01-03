import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Donation from '@/models/Donation';
import Donor from '@/models/Donor';


export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    let query = {};
    if (month && year) {
      query = { month: Number(month), year: Number(year) };
    }

    const donations = await Donation.find(query)
      .populate('donorId', 'name phone address defaultAmount')
      .sort({ date: -1 });

    return NextResponse.json(
      { success: true, donations },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get donations error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch donations' },
      { status: 500 }
    );
  }
}
export async function POST(req) {
  try {
    await connectDB();

    const { donorId, amount, date, paymentMethod, notes, isMonthly, month, year } = await req.json();

    // Validation
   

    const donation = new Donation({
      donorId:donorId,
      amount,
      date: date ? new Date(date) : new Date(),
      paymentMethod: paymentMethod || 'cash',
      notes: notes || '',
      isMonthly: isMonthly || false,
      month: month,
      year: year,
    });

    await donation.save();
    
    // Populate donor info before returning
   await donation.populate('donorId', 'name phone address');

    return NextResponse.json(
      {
        success: true,
        message: 'Donation added successfully',
        donation,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Add donation error:', error);
    return NextResponse.json(
      { error: 'Failed to add donation' },
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
        { error: 'Donation ID required' },
        { status: 400 }
      );
    }

    const result = await Donation.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json(
        { error: 'Donation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Donation deleted',
    });
  } catch (error) {
    console.error('Delete donation error:', error);
    return NextResponse.json(
      { error: 'Failed to delete donation' },
      { status: 500 }
    );
  }
}



