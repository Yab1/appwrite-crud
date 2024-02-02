import client from "@/lib/appwrite_client";
import { Databases, ID, Query } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);

// CREATE_INTERPRETATIONS
async function createInterpretaion(data: {
  term: string;
  interpretation: string;
}) {
  try {
    const response = await database.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Interpretations",
      ID.unique(),
      data
    );
    return response;
  } catch (error) {
    console.error("Error crreatng interpretation", error);
    throw new Error("Error crreatng interpretation");
  }
}

//FETCH_INTERPRETATIONS
async function fetchInterpretaion() {
  try {
    const response = await database.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Interpretations",
      [Query.orderDesc("$createdAt")]
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetch interpretation", error);
    throw new Error("Error fetch interpretation");
  }
}

export async function POST(req: Request) {
  try {
    const { term, interpretation } = await req.json();
    const data = { term, interpretation };

    const response = createInterpretaion(data);
    return NextResponse.json({ message: "Interpretaion created" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create interpretation" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const interpretation = await fetchInterpretaion();
    return NextResponse.json(interpretation);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch interpretation" },
      { status: 500 }
    );
  }
}
