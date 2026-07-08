"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FileText, Layers, Download, CheckCircle, FileDown } from 'lucide-react';
import jsPDF from 'jspdf';

interface NoteSection {
  heading: string;
  bullets: string[];
}

interface Definition {
  term: string;
  definition: string;
}

interface NotesData {
  title: string;
  subject: string;
  summary: string;
  sections: NoteSection[];
  definitions: Definition[];
}

interface Flashcard {
  front: string;
  back: string;
}

export default function LectureReview() {
  const params = useParams();
  const id = params.id as string;

  const [notes, setNotes] = useState<NotesData | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[] | null>(null);
  const [activeTab, setActiveTab] = useState<'notes' | 'flashcards'>('notes');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [notesRes, cardsRes] = await Promise.all([
          fetch(`/api/v1/lectures/${id}/notes`),
          fetch(`/api/v1/lectures/${id}/flashcards`)
        ]);
        
        const notesData = await notesRes.json();
        const cardsData = await cardsRes.json();

        setNotes(notesData);
        setFlashcards(cardsData.flashcards);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const exportPDF = () => {
    if (!notes) return;
    const doc = new jsPDF();
    let y = 20;
    
    doc.setFontSize(22);
    doc.text(notes.title, 20, y);
    y += 10;
    
    doc.setFontSize(14);
    doc.setTextColor(100);
    doc.text(notes.subject, 20, y);
    y += 15;
    
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text("Summary", 20, y);
    y += 8;
    
    doc.setFontSize(12);
    doc.setTextColor(50);
    const splitSummary = doc.splitTextToSize(notes.summary, 170);
    doc.text(splitSummary, 20, y);
    y += (splitSummary.length * 6) + 10;
    
    notes.sections.forEach(sec => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text(sec.heading, 20, y);
      y += 8;
      
      doc.setFontSize(12);
      doc.setTextColor(50);
      sec.bullets.forEach(b => {
        const splitB = doc.splitTextToSize(`• ${b}`, 160);
        if (y + (splitB.length * 6) > 280) { doc.addPage(); y = 20; }
        doc.text(splitB, 25, y);
        y += (splitB.length * 6) + 2;
      });
      y += 5;
    });

    if (y > 250) { doc.addPage(); y = 20; }
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text("Definitions", 20, y);
    y += 8;
    
    doc.setFontSize(12);
    notes.definitions.forEach(def => {
      const splitDef = doc.splitTextToSize(`${def.term}: ${def.definition}`, 170);
      if (y + (splitDef.length * 6) > 280) { doc.addPage(); y = 20; }
      doc.setFont("helvetica", "bold");
      doc.text(`${def.term}:`, 20, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(50);
      doc.text(def.definition, 20 + doc.getTextWidth(`${def.term}: `), y);
      y += (splitDef.length * 6) + 2;
    });

    doc.save(`${notes.title.replace(/ /g, '_')}_Notes.pdf`);
  };

  const exportAnkiCSV = () => {
    if (!flashcards) return;
    // Anki expects simple CSV: front, back
    const escapeCsv = (str: string) => `"${str.replace(/"/g, '""').replace(/\n/g, '<br>')}"`;
    const csvContent = flashcards.map(card => `${escapeCsv(card.front)},${escapeCsv(card.back)}`).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Anki_Flashcards_${id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-muted">Loading your notes...</p>
      </div>
    );
  }

  if (!notes) return <p className="text-center">Error loading notes.</p>;

  return (
    <div className="max-w-5xl w-full mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <span className="text-primary-400 font-medium text-sm mb-1 block">{notes.subject}</span>
          <h1 className="text-3xl md:text-4xl font-bold">{notes.title}</h1>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={exportPDF}
            className="flex items-center gap-2 py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-card-border transition-colors text-sm font-medium"
          >
            <FileDown size={16} /> PDF Notes
          </button>
          <button 
            onClick={exportAnkiCSV}
            className="flex items-center gap-2 py-2 px-4 rounded-xl bg-primary-600 hover:bg-primary-500 text-white transition-colors text-sm font-medium shadow-lg shadow-primary-500/20"
          >
            <Download size={16} /> Anki CSV
          </button>
        </div>
      </div>

      <div className="flex border-b border-card-border mb-8">
        <button 
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'notes' ? 'border-primary-500 text-white' : 'border-transparent text-muted hover:text-white'}`}
          onClick={() => setActiveTab('notes')}
        >
          <div className="flex items-center gap-2"><FileText size={16} /> Structured Notes</div>
        </button>
        <button 
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'flashcards' ? 'border-primary-500 text-white' : 'border-transparent text-muted hover:text-white'}`}
          onClick={() => setActiveTab('flashcards')}
        >
          <div className="flex items-center gap-2"><Layers size={16} /> Flashcards</div>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8 space-y-8">
          {activeTab === 'notes' ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
              <section className="glass p-6 md:p-8 rounded-3xl">
                <h3 className="text-xl font-semibold mb-4 text-primary-400">Executive Summary</h3>
                <p className="text-muted leading-relaxed text-lg">{notes.summary}</p>
              </section>

              {notes.sections.map((sec, i) => (
                <section key={i} className="space-y-4">
                  <h3 className="text-2xl font-bold border-b border-card-border pb-2">{sec.heading}</h3>
                  <ul className="space-y-3">
                    {sec.bullets.map((b, j) => (
                      <li key={j} className="flex items-start gap-3 text-muted">
                        <CheckCircle size={18} className="text-primary-500 mt-1 flex-shrink-0" />
                        <span className="leading-relaxed">{b}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 gap-4">
              {flashcards?.map((card, i) => (
                <div key={i} className="glass p-6 rounded-2xl group [perspective:1000px]">
                  <div className="mb-2 text-xs text-primary-400 font-bold uppercase tracking-wider">Front</div>
                  <p className="text-lg font-medium mb-6">{card.front}</p>
                  
                  <div className="mb-2 text-xs text-success font-bold uppercase tracking-wider border-t border-card-border pt-4">Back (Answer)</div>
                  <p className="text-muted">{card.back}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        <div className="md:col-span-4">
          <div className="sticky top-24 glass p-6 rounded-3xl">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400">D</span>
              Key Definitions
            </h3>
            <div className="space-y-4">
              {notes.definitions.map((def, i) => (
                <div key={i} className="border-l-2 border-primary-500/50 pl-4 py-1">
                  <h4 className="font-semibold text-white">{def.term}</h4>
                  <p className="text-sm text-muted mt-1 leading-relaxed">{def.definition}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
