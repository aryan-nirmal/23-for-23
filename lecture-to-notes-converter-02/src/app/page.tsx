"use client";

import { useState, useRef, useEffect } from 'react';
import { UploadCloud, FileAudio, FileVideo, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'completed' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (selectedFile: File) => {
    // Validate file type
    const validTypes = ['audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/x-m4a', 'video/mp4'];
    if (!validTypes.includes(selectedFile.type)) {
      alert("Unsupported file type. Please upload MP3, MP4, WAV, or M4A.");
      return;
    }
    
    // Validate size (mock 50MB limit)
    if (selectedFile.size > 50 * 1024 * 1024) {
      alert("File is too large for the free tier (Max 50MB).");
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setStatus('uploading');
      setProgress(10); // Start progress

      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name);

      const uploadRes = await fetch('/api/v1/uploads', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");
      const uploadData = await uploadRes.json();
      setProgress(30);

      const processRes = await fetch(`/api/v1/lectures/${uploadData.lectureId}/process`, {
        method: 'POST',
      });

      if (!processRes.ok) throw new Error("Failed to start processing");
      const processData = await processRes.json();
      
      setJobId(processData.jobId);
      setStartedAt(Date.now());
      setStatus('processing');
      setProgress(40);

    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (status === 'processing' && jobId && startedAt) {
      intervalId = setInterval(async () => {
        try {
          const res = await fetch(`/api/v1/jobs/${jobId}?startedAt=${startedAt}`);
          const data = await res.json();

          if (data.status === 'processing') {
            setProgress(data.progress);
          } else if (data.status === 'completed') {
            setStatus('completed');
            setProgress(100);
            clearInterval(intervalId);
            setTimeout(() => {
              router.push(`/lectures/${jobId}`); // using jobId as lectureId for mock simplicity
            }, 1000);
          } else if (data.status === 'failed') {
            setStatus('error');
            clearInterval(intervalId);
          }
        } catch (e) {
          console.error("Polling error", e);
        }
      }, 2000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [status, jobId, startedAt, router]);

  return (
    <div className="max-w-4xl w-full mx-auto flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          Turn Lectures Into A's
        </h1>
        <p className="text-xl text-muted max-w-2xl mx-auto">
          Upload your lecture recording. Get structured notes, definitions, and flashcards in minutes. Study smarter, not harder.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-xl"
      >
        <div className="glass rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-primary-500/10 blur-[100px] pointer-events-none" />

          {status === 'idle' && (
            <div 
              className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all cursor-pointer ${isDragging ? 'border-primary-500 bg-primary-500/5' : 'border-card-border hover:border-primary-500/50 hover:bg-white/5'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="audio/mpeg,audio/mp4,audio/wav,audio/x-m4a,video/mp4" 
                onChange={handleFileChange}
              />
              
              <div className="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center mb-4 text-primary-400">
                <UploadCloud size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Lecture Recording</h3>
              <p className="text-sm text-muted text-center max-w-xs mb-6">
                Drag and drop your audio or video file here, or click to browse.
              </p>
              
              <div className="flex gap-4 text-xs text-muted/60">
                <span className="flex items-center gap-1"><FileAudio size={14} /> MP3, WAV, M4A</span>
                <span className="flex items-center gap-1"><FileVideo size={14} /> MP4</span>
              </div>
            </div>
          )}

          {(status === 'uploading' || status === 'processing' || status === 'completed' || file) && status === 'idle' && (
             <div className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-2xl">
               <div className="w-12 h-12 bg-primary-500/20 text-primary-400 rounded-full flex items-center justify-center mb-4">
                 <FileAudio size={24} />
               </div>
               <h4 className="font-medium text-lg mb-1 truncate max-w-[300px]">{file?.name}</h4>
               <p className="text-sm text-muted mb-6">{(file!.size / (1024 * 1024)).toFixed(2)} MB</p>
               
               <div className="flex gap-3 w-full">
                 <button 
                   onClick={() => setFile(null)} 
                   className="flex-1 py-3 px-4 rounded-xl border border-white/10 text-sm font-medium hover:bg-white/5 transition-colors"
                 >
                   Cancel
                 </button>
                 <button 
                   onClick={handleUpload}
                   className="flex-1 py-3 px-4 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20"
                 >
                   Convert Now <ArrowRight size={16} />
                 </button>
               </div>
             </div>
          )}

          {(status === 'uploading' || status === 'processing' || status === 'completed') && (
             <div className="flex flex-col items-center justify-center py-8">
               <div className="relative w-24 h-24 mb-6">
                  {status === 'completed' ? (
                    <motion.div 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }} 
                      className="w-full h-full bg-success/20 text-success rounded-full flex items-center justify-center"
                    >
                      <CheckCircle size={48} />
                    </motion.div>
                  ) : (
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="48" cy="48" r="45" className="stroke-card-border" strokeWidth="6" fill="none" />
                      <circle 
                        cx="48" cy="48" r="45" 
                        className="stroke-primary-500" 
                        strokeWidth="6" fill="none" 
                        strokeDasharray={2 * Math.PI * 45}
                        strokeDashoffset={2 * Math.PI * 45 * (1 - progress / 100)}
                        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                      />
                    </svg>
                  )}
                  {status !== 'completed' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold">{progress}%</span>
                    </div>
                  )}
               </div>

               <h3 className="text-xl font-bold mb-2">
                 {status === 'uploading' ? 'Uploading File...' : status === 'processing' ? 'Generating Notes & Flashcards...' : 'Done!'}
               </h3>
               <p className="text-sm text-muted text-center max-w-sm">
                 {status === 'uploading' ? 'Please keep this tab open while we upload your file.' : 
                  status === 'processing' ? 'Our AI is analyzing the lecture. This usually takes a few minutes.' : 
                  'Redirecting to your study material...'}
               </p>
             </div>
          )}
          
          {status === 'error' && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 bg-danger/20 text-danger rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={32} /> {/* Using CheckCircle just as icon placeholder but styled danger */}
              </div>
              <h3 className="text-xl font-bold mb-2 text-danger">Processing Failed</h3>
              <p className="text-sm text-muted text-center mb-6">Something went wrong during conversion. Please try again.</p>
              <button 
                onClick={() => setStatus('idle')}
                className="py-2 px-6 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
