'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, FileText, Upload, RefreshCw, Printer, Check, Copy, Zap } from 'lucide-react';
import { INDUSTRIES, generateSopMock, regenerateSectionMock, SopSection } from '@/lib/store';

export default function GenerateSOP() {
  const [step, setStep] = useState<1 | 2>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [processText, setProcessText] = useState('');
  const [industry, setIndustry] = useState(INDUSTRIES[0]);
  const [title, setTitle] = useState('');
  
  const [sections, setSections] = useState<SopSection[]>([]);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [activeRegenerateSection, setActiveRegenerateSection] = useState<string | null>(null);
  const [regenerateInstruction, setRegenerateInstruction] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (processText.length < 20) return alert('Please provide more detail in your process description.');
    
    setIsGenerating(true);
    const generatedSections = await generateSopMock(processText, industry);
    setSections(generatedSections);
    setIsGenerating(false);
    setStep(2);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoUrl(url);
    }
  };

  const handleRegenerate = async (sectionId: string, title: string) => {
    setActiveRegenerateSection(sectionId);
    const newContent = await regenerateSectionMock(title, regenerateInstruction || 'Make it more professional and detailed.');
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, content: newContent } : s));
    setActiveRegenerateSection(null);
    setRegenerateInstruction('');
  };

  const handleTextChange = (sectionId: string, newText: string) => {
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, content: newText } : s));
  };

  const copyToClipboard = () => {
    const md = `# ${title || 'Standard Operating Procedure'}\n\n` + sections.map(s => `## ${s.title}\n${s.content}`).join('\n\n');
    navigator.clipboard.writeText(md);
    alert('Copied to clipboard as Markdown!');
  };

  const handlePrint = () => {
    window.print();
  };

  if (step === 1) {
    return (
      <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem', maxWidth: '800px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '2rem' }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Create a New SOP</h1>
        <p style={{ fontSize: '1.1rem', marginBottom: '3rem' }}>Describe your process and let AI structure it perfectly.</p>

        <form onSubmit={handleGenerate} className="card animate-fade-in">
          <div className="input-group">
            <label className="input-label">SOP Title</label>
            <input 
              required
              type="text" 
              className="input-field" 
              placeholder="e.g., New Employee Onboarding" 
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Industry Context</label>
            <select 
              className="input-field" 
              value={industry}
              onChange={e => setIndustry(e.target.value)}
            >
              {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Process Description (Brain dump here)</label>
            <textarea 
              required
              className="input-field" 
              style={{ minHeight: '200px', resize: 'vertical' }}
              placeholder="Describe what needs to happen, step by step. Don't worry about formatting..."
              value={processText}
              onChange={e => setProcessText(e.target.value)}
            />
            <span style={{ fontSize: '0.8rem', color: processText.length < 20 ? 'var(--error)' : 'var(--text-muted)' }}>
              {processText.length}/20 characters minimum
            </span>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
            disabled={isGenerating || processText.length < 20}
          >
            {isGenerating ? (
              <><Loader2 className="animate-spin" size={20} /> Analyzing and Generating...</>
            ) : (
              <><Zap size={20} /> Generate SOP Document</>
            )}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar Controls */}
      <div style={{ width: '300px', borderRight: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--foreground)', textDecoration: 'none', fontWeight: 600 }}>
            <FileText size={18} color="var(--accent-light)" /> SOPGen AI
          </Link>
        </div>
        
        <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Document Settings</h3>
          
          <div className="input-group">
            <label className="input-label">Company Logo</label>
            <label className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}>
              <Upload size={16} /> {logoUrl ? 'Change Logo' : 'Upload Logo'}
              <input type="file" accept="image/png, image/jpeg" hidden onChange={handleLogoUpload} />
            </label>
            {logoUrl && <img src={logoUrl} alt="Logo" style={{ maxHeight: '60px', marginTop: '1rem', borderRadius: '4px', objectFit: 'contain' }} />}
          </div>

          <div style={{ height: '1px', background: 'var(--border)', margin: '2rem 0' }} />

          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Export & Share</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button onClick={handlePrint} className="btn btn-primary" style={{ justifyContent: 'center' }}>
              <Printer size={16} /> Export to PDF
            </button>
            <button onClick={copyToClipboard} className="btn btn-secondary" style={{ justifyContent: 'center' }}>
              <Copy size={16} /> Copy Markdown
            </button>
          </div>
        </div>
      </div>

      {/* Editor Main Area */}
      <div style={{ flex: 1, background: 'var(--background)', overflowY: 'auto', padding: '2rem 0' }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          
          {/* THE DOCUMENT ITSELF */}
          <div className="print-area sop-preview">
            {logoUrl && (
              <img src={logoUrl} alt="Company Logo" style={{ maxHeight: '80px', marginBottom: '2rem' }} />
            )}
            
            <h1 style={{ marginBottom: '2rem' }}>{title || 'Standard Operating Procedure'}</h1>
            
            {sections.map(section => (
              <div key={section.id} className="editor-section" style={{ marginBottom: '1.5rem', borderColor: '#eee' }}>
                <div className="editor-section-header" style={{ background: '#f9f9f9', borderBottomColor: '#eee' }}>
                  <h3 style={{ margin: 0, color: '#333', fontSize: '1.1rem' }}>{section.title}</h3>
                  <div style={{ display: 'flex', gap: '0.5rem' }} className="hide-on-print">
                    <button 
                      onClick={() => setSections(prev => prev.map(s => s.id === section.id ? { ...s, isEditing: !s.isEditing } : s))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', fontSize: '0.85rem' }}
                    >
                      {section.isEditing ? 'Done' : 'Edit'}
                    </button>
                  </div>
                </div>
                
                <div className="editor-section-content" style={{ background: 'white' }}>
                  {section.isEditing ? (
                    <div>
                      <textarea 
                        className="editor-textarea" 
                        style={{ color: '#333', border: '1px solid #ddd', padding: '0.5rem' }}
                        value={section.content}
                        onChange={e => handleTextChange(section.id, e.target.value)}
                      />
                      <div style={{ marginTop: '1rem', padding: '1rem', background: '#f5f7ff', borderRadius: '0.5rem', border: '1px dashed #cbd5e1' }}>
                        <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem', color: '#475569', fontWeight: 500 }}>AI Regeneration</p>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <input 
                            type="text" 
                            placeholder="Instruction (e.g., make it more concise)" 
                            style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                            value={regenerateInstruction}
                            onChange={e => setRegenerateInstruction(e.target.value)}
                          />
                          <button 
                            onClick={() => handleRegenerate(section.id, section.title)}
                            disabled={activeRegenerateSection === section.id}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.5rem 1rem', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            {activeRegenerateSection === section.id ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                            Regenerate
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ whiteSpace: 'pre-wrap', color: '#444' }}>{section.content}</div>
                  )}
                </div>
              </div>
            ))}

          </div>
          
        </div>
      </div>
    </div>
  );
}
