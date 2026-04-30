import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { Feedback } from '@/models/Feedback';

// Admin: get all feedback
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    await dbConnect();
    const feedbacks = await Feedback.find({})
      .populate('createdBy', 'username email')
      .sort({ createdAt: -1 });
    return NextResponse.json(feedbacks);
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// Customer: submit product feedback
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { product, message, rating } = await req.json();

    if (!product || !message) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();

    const feedback = await Feedback.create({
      product,
      message,
      rating: rating || 5,
      createdBy: (session.user as any).id,
    });

    return NextResponse.json(feedback, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
