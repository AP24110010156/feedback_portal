import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { FeatureRequest } from "@/models/FeatureRequest";
import { User } from "@/models/User";

export async function GET() {
  try {
    await dbConnect();
    // Population handles getting user info
    let requests = await FeatureRequest.find({})
      .populate('createdBy', 'username email');

    requests = requests.sort((a, b) => b.votes.length - a.votes.length || b.createdAt.getTime() - a.createdAt.getTime());

    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { title, description, category } = await req.json();

    if (!title || !description) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    const newRequest = await FeatureRequest.create({
      title,
      description,
      category,
      createdBy: (session.user as any).id,
    });

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
