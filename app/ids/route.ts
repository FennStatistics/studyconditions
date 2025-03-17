import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// Handle GET request: Retrieve a random note and remove it
export async function GET() {
  const supabase = await createClient();

  // Fetch all notes
  const { data: notes, error } = await supabase.from("notes").select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!notes || notes.length === 0) {
    return NextResponse.json({ message: "No more entries found" }, { status: 404 });
  }

  // Select a random note
  const randomNote = notes[Math.floor(Math.random() * notes.length)];

  // Remove the selected note from the table
  const { error: deleteError } = await supabase.from("notes").delete().eq("id", randomNote.id);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  // Return the selected note
  return NextResponse.json(randomNote);
}

// Handle POST request: Add a new study condition to Supabase
export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { id, con_number, studyparams } = await req.json(); // Accept values from request

    if (!con_number || typeof con_number !== "number") {
      return NextResponse.json({ error: "Invalid con_number" }, { status: 400 });
    }

    if (!studyparams || typeof studyparams !== "object") {
      return NextResponse.json({ error: "Invalid studyparams, must be a JSON object" }, { status: 400 });
    }

    // Prepare the data object
    const insertData = id ? { id, con_number, studyparams } : { con_number, studyparams };

    // Insert data into "studyConditions" table
    const { data, error } = await supabase.from("notes").insert([insertData]).select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Study condition added successfully", condition: data[0] });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request format" }, { status: 400 });
  }
}
