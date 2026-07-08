import { NextResponse } from 'next/server';

export async function GET(request: Request, context: any) {
  const params = await context.params;
  const { id } = params;

  return NextResponse.json({
    lectureId: id,
    title: "Introduction to Cellular Biology",
    subject: "Biology 101",
    summary: "This lecture covers the fundamental structure and function of cells, including the differences between prokaryotic and eukaryotic cells, the role of the cell membrane, and the functions of major organelles such as the nucleus and mitochondria.",
    sections: [
      {
        heading: "Cell Theory Fundamentals",
        bullets: [
          "All living organisms are composed of one or more cells.",
          "The cell is the basic unit of structure and organization in organisms.",
          "Cells arise from pre-existing cells."
        ]
      },
      {
        heading: "Prokaryotic vs Eukaryotic Cells",
        bullets: [
          "Prokaryotes lack a membrane-bound nucleus and organelles (e.g., bacteria).",
          "Eukaryotes have a true nucleus and complex organelles (e.g., plants, animals).",
          "Prokaryotes are generally smaller and simpler in structure."
        ]
      },
      {
        heading: "Key Organelles",
        bullets: [
          "Nucleus: The control center containing DNA.",
          "Mitochondria: The powerhouse of the cell, generating ATP.",
          "Ribosomes: Responsible for protein synthesis."
        ]
      }
    ],
    definitions: [
      { term: "Organelle", definition: "A specialized subunit within a cell that has a specific function." },
      { term: "ATP", definition: "Adenosine triphosphate, the primary energy carrier in cells." }
    ]
  });
}
