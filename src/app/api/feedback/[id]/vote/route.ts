import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import { FeatureRequest } from "@/models/FeatureRequest";
import mongoose from "mongoose";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const id = (await params).id;

    await dbConnect();

    const request = await FeatureRequest.findById(id);

    if (!request) {
      return NextResponse.json({ message: "Request not found" }, { status: 404 });
    }

    const voteIndex = request.votes.indexOf(userId as any);

    if (voteIndex === -1) {
      // Upvote
      request.votes.push(userId as any);
    } else {
      // Remove vote
      request.votes.splice(voteIndex, 1);
    }

    await request.save();

    return NextResponse.json(request);
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
