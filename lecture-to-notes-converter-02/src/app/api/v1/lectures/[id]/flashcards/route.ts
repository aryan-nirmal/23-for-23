import { NextResponse } from 'next/server';

export async function GET(request: Request, context: any) {
  const params = await context.params;
  const { id } = params;

  return NextResponse.json({
    lectureId: id,
    flashcards: [
      { front: "What are the three main tenets of cell theory?", back: "1. All living things are made of cells.\n2. The cell is the basic unit of life.\n3. All cells come from pre-existing cells." },
      { front: "What is the primary difference between prokaryotic and eukaryotic cells?", back: "Eukaryotic cells have a membrane-bound nucleus and organelles, while prokaryotic cells do not." },
      { front: "What is the function of the mitochondria?", back: "It is the powerhouse of the cell and generates most of the cell's supply of ATP." },
      { front: "What are ribosomes responsible for?", back: "Protein synthesis." },
      { front: "Define 'Organelle'.", back: "A specialized subunit within a cell that has a specific function." }
    ]
  });
}
