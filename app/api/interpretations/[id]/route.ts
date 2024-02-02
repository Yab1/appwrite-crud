import client from "@/lib/appwrite_client";
import { Databases } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);

//FETCH_A_SPECIFIC_INTERPRETATION
async function fetchInterpretation(id: string) {
  try {
    const interpretation = await database.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Interpretations",
      id
    );
    return interpretation;
  } catch (error) {
    throw new Error("Failed to fetch interpretation");
  }
}

//DELETE_A_SPECIFIC_INTERPRETATION
async function deleteInterpretation(id: string) {
  try {
    const response = await database.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Interpretations",
      id
    );
    return response;
  } catch (error) {
    throw new Error("Failed to delete interpretaion");
  }
}

//UPDATE_A_SPECIFIC_INTERPRETATION
async function updateInterpretation(
  id: string,
  data: { term: string; interpretations: string }
) {
  try {
    const response = await database.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "Interpretations",
      id,
      data
    );
    return response;
  } catch (error) {
    throw new Error("Failed to update interpretation");
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const interpretation = await fetchInterpretation(id);
    return NextResponse.json(interpretation);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch interpretation" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await deleteInterpretation(id);
    return NextResponse.json({ message: "Interpretation deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete interpretation" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const interpretation = await req.json();
    await updateInterpretation(id, interpretation);
    return NextResponse.json({ message: "Interpretation updated" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update interpretation" },
      { status: 500 }
    );
  }
}
