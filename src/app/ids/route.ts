import { NextResponse } from "next/server";

let idArray: string[] = ["id1", "id2", "id3"]; // Initial list of IDs

// Handle GET request: Remove a random ID from the array
export async function GET() {
  if (idArray.length === 0) {
    return NextResponse.json({ message: "No IDs left in the array" }, { status: 404 });
  }

  const randomIndex = Math.floor(Math.random() * idArray.length);
  const removedId = idArray.splice(randomIndex, 1)[0]; // Remove random element

  if (idArray.length === 0) {
    // do X
  }

  return NextResponse.json({ currenID: removedId });
  //   return NextResponse.json({ currenID: removedId, remainingIds: idArray });

}

// Handle POST request: Add an ID to the array
export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    idArray.push(id);
    return NextResponse.json({ message: "ID added successfully", idArray });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request format" }, { status: 400 });
  }
}
