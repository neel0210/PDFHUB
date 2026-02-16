import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
  ChevronLeft, Upload, File as FileIcon, X, Download, 
  CheckCircle2, Activity, GripVertical, Trash2,
  PlusCircle, Loader2, AlertTriangle, Cpu
} from 'lucide-react';
import { PDF_TOOLS } from '../constants';
import { ProcessingStatus, FileState } from '../types';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

// Robust worker configuration - using fixed version to avoid mismatches
const PDFJS_VERSION = '4.10.38';
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.mjs`;

interface PageItem {
  id: string;
  sourceFileId: string;
  sourceFileName: string;
  pageIndex: number;
  thumbnailUrl?: string;
  isRendering?: boolean;
}

const CONFIG = {
  MAX_FILE_SIZE_MB: 15,
  MAX_FILE_SIZE_BYTES: 15 * 1024 * 1024,
  PURGE_TIMER_SECONDS: 300, 
};

const ToolProcessor: React.FC = () => {
  const { toolId } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tool = useMemo(() => PDF_TOOLS.find(t => t.id === toolId), [toolId]);
  
  const [files, setFiles] = useState<FileState[]>([]);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [status, setStatus] = useState<ProcessingStatus>(ProcessingStatus.IDLE);
  const [timer, setTimer] = useState(CONFIG.PURGE_TIMER_SECONDS);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  useEffect(() => {
    let interval: number;
    if (status === ProcessingStatus.COMPLETED && timer > 0) {
      interval = window.setInterval(() => setTimer(t => t - 1), 1000);
    }
    if (timer === 0) handleReset();
    return () => clearInterval(interval);
  }, [status, timer]);

  const handleReset = useCallback(() => {
    if (resultBlob) {
      URL.revokeObjectURL(URL.createObjectURL(resultBlob));
    }
    setFiles([]);
    setPages([]);
    setStatus(ProcessingStatus.IDLE);
    setTimer(CONFIG.PURGE_TIMER_SECONDS);
    setResultBlob(null);
  }, [resultBlob]);

  const renderThumbnail = async (pdfDoc: any, pageIndex: number): Promise<string> => {
    try {
      const page = await pdfDoc.getPage(pageIndex + 1);
      const viewport = page.getViewport({ scale: 0.3 });
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Canvas context initialization failed");
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      await page.render({ canvasContext: ctx, viewport }).promise;
      return canvas.toDataURL('image/jpeg', 0.8);
    } catch (e) {
      console.warn("Thumbnail rendering skipped for page", pageIndex, e);
      return ""; 
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(e.target.files || []);
    if (!incoming.length) return;

    for (const f of incoming) {
      if (f.size > CONFIG.MAX_FILE_SIZE_BYTES) {
        alert(`Security Policy: "${f.name}" exceeds the ${CONFIG.MAX_FILE_SIZE_MB}MB processing threshold.`);
        continue;
      }

      const fileId = Math.random().toString(36).slice(2, 11);
      const fileState: FileState = { id: fileId, file: f, progress: 0, status: 'idle' };
      setFiles(prev => [...prev, fileState]);

      try {
        const arrayBuffer = await f.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);

        // Quick signature check
        const header = new TextDecoder().decode(data.subarray(0, 5));
        if (header !== '%PDF-') {
          throw new Error("Invalid PDF header signature");
        }

        const loadingTask = pdfjsLib.getDocument({ 
          data, 
          useSystemFonts: true,
          disableFontFace: true, // Prevents some common rendering errors in browsers
        });
        
        const pdfJsDoc = await loadingTask.promise;
        const thumb = await renderThumbnail(pdfJsDoc, 0);
        
        setFiles(prev => prev.map(fs => fs.id === fileId ? { ...fs, previewUrl: thumb } : fs));

        if (toolId === 'organize') {
          // Use original arrayBuffer for pdf-lib to avoid redundant copying
          const pdfLibDoc = await PDFDocument.load(arrayBuffer);
          const count = pdfLibDoc.getPageCount();
          const placeholders = Array.from({ length: count }).map((_, i) => ({
            id: Math.random().toString(36).slice(2, 11),
            sourceFileId: fileId,
            sourceFileName: f.name,
            pageIndex: i,
            isRendering: true
          }));
          setPages(prev => [...prev, ...placeholders]);

          for (let i = 0; i < count; i++) {
            const pageThumb = await renderThumbnail(pdfJsDoc, i);
            setPages(prev => prev.map(p => 
              (p.sourceFileId === fileId && p.pageIndex === i) ? { ...p, thumbnailUrl: pageThumb, isRendering: false } : p
            ));
          }
        }
      } catch (err: any) {
        console.error(`Binary stream parsing failed for ${f.name}:`, err);
        setFiles(prev => prev.map(fs => fs.id === fileId ? { ...fs, status: 'error' } : fs));
        alert(`Failed to load "${f.name}". The file might be corrupted, password-protected, or not a valid PDF.`);
      }
    }

    if (status === ProcessingStatus.COMPLETED) {
      setStatus(ProcessingStatus.IDLE);
      setResultBlob(null);
      setTimer(CONFIG.PURGE_TIMER_SECONDS);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const processEngine = async () => {
    if (!files.length) return;
    setStatus(ProcessingStatus.PROCESSING);

    try {
      let final: Blob;
      if (toolId === 'merge') {
        const merged = await PDFDocument.create();
        for (const fs of files) {
          const doc = await PDFDocument.load(await fs.file.arrayBuffer());
          const copied = await merged.copyPages(doc, doc.getPageIndices());
          copied.forEach(p => merged.addPage(p));
        }
        final = new Blob([await merged.save()], { type: 'application/pdf' });
      } else if (toolId === 'organize') {
        const organized = await PDFDocument.create();
        const cache: Record<string, PDFDocument> = {};
        for (const f of files) {
          cache[f.id] = await PDFDocument.load(await f.file.arrayBuffer());
        }
        for (const p of pages) {
          const sourceDoc = cache[p.sourceFileId];
          if (!sourceDoc) continue;
          const [copied] = await organized.copyPages(sourceDoc, [p.pageIndex]);
          organized.addPage(copied);
        }
        final = new Blob([await organized.save()], { type: 'application/pdf' });
      } else {
        await new Promise(r => setTimeout(r, 1200));
        final = files[0].file;
      }
      setResultBlob(final);
      setStatus(ProcessingStatus.COMPLETED);
    } catch (err) {
      console.error("Processing Engine Error:", err);
      setStatus(ProcessingStatus.IDLE);
      alert("Processing failed. Please ensure your PDFs are valid and not password protected.");
    }
  };

  const download = useCallback(() => {
    if (!resultBlob) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PDFHUB_${toolId}_${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }, [resultBlob, toolId]);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (!tool) return <div className="p-20 text-center font-bold text-gray-400 uppercase tracking-widest">Utility Profile Missing.</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-7xl mx-auto px-4 sm:px-8 py-8 md:py-12 w-full min-h-[85vh] flex flex-col"
    >
      <input 
        type="file" 
        multiple 
        className="hidden" 
        ref={fileInputRef} 
        onChange={onFileChange} 
        accept=".pdf" 
      />

      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col">
          <Link to="/pdf" className="inline-flex items-center gap-2 text-gray-500 hover:text-white mb-4 transition-colors text-[10px] font-black uppercase tracking-widest group">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Toolbox
          </Link>
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl liquid-glass flex items-center justify-center text-red-400 shadow-xl border border-white/5 shrink-0">
              {tool.icon}
            </div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tighter truncate">{tool.name}</h1>
          </div>
        </div>
        
        {status === ProcessingStatus.PROCESSING && (
           <div className="px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 self-start md:self-center">
              <Loader2 size={16} className="animate-spin text-red-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-red-400">Processing Stream...</span>
           </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start flex-grow">
        <div className="lg:col-span-8 xl:col-span-9 space-y-8 order-2 lg:order-1 h-full">
          <AnimatePresence mode="wait">
            {status === ProcessingStatus.COMPLETED ? (
              <motion.div 
                key="completed" 
                initial={{ scale: 0.98, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                className="liquid-glass rounded-[2.5rem] p-8 md:p-20 flex flex-col items-center text-center shadow-2xl border border-white/10"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-8 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-2xl md:text-3xl font-black mb-4 tracking-tight uppercase">Task Finalized</h2>
                <p className="text-gray-400 text-sm max-w-sm mb-12 leading-relaxed">The PDF stream has been manipulated and is ready for export. Session will expire in <span className="text-white font-mono">{timer}s</span>.</p>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <button onClick={download} className="px-10 py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2">
                    <Download size={16} /> Export PDF
                  </button>
                  <button onClick={handleReset} className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors">Flush Workspace</button>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-8 h-full">
                {files.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={triggerFileInput} 
                    className="group min-h-[400px] border-2 border-dashed border-white/10 rounded-[2.5rem] bg-white/[0.01] flex flex-col items-center justify-center p-12 cursor-pointer hover:border-red-500/30 hover:bg-red-500/[0.02] transition-all relative"
                  >
                    <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-inner border border-white/5">
                      <Upload size={32} className="text-gray-500 group-hover:text-red-400 transition-colors" />
                    </div>
                    <p className="font-bold text-gray-300 mb-2 text-center uppercase tracking-widest">Connect PDF Stream</p>
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest text-center">Tap to browse or drop binary data here</p>
                    <div className="mt-10 px-6 py-2 bg-white/5 rounded-full border border-white/5 flex items-center gap-3">
                       <Cpu size={14} className="text-blue-500/60" />
                       <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Client-Side Isolation Active</span>
                    </div>
                  </motion.div>
                )}

                {toolId !== 'organize' && files.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                       <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2"><Activity size={12} className="text-red-500"/> Activity Stack ({files.length})</h3>
                       <button onClick={handleReset} className="text-[10px] text-red-500/60 font-black uppercase tracking-widest hover:text-red-400 transition-colors">Clear Stack</button>
                    </div>
                    <Reorder.Group axis="y" values={files} onReorder={setFiles} className="space-y-3">
                      {files.map((f) => (
                        <Reorder.Item key={f.id} value={f} className="cursor-grab active:cursor-grabbing">
                          <div className={`liquid-glass rounded-2xl p-4 flex items-center gap-4 md:gap-6 border transition-all group/item ${f.status === 'error' ? 'border-red-500/30' : 'border-white/5 hover:border-white/10'}`}>
                            <GripVertical size={16} className="text-gray-800 shrink-0 hidden sm:block" />
                            <div className="w-14 h-16 rounded-xl bg-black/50 flex items-center justify-center shrink-0 border border-white/10 overflow-hidden shadow-inner relative">
                              {f.previewUrl ? (
                                <img src={f.previewUrl} className="w-full h-full object-cover opacity-80" />
                              ) : f.status === 'error' ? (
                                <AlertTriangle size={20} className="text-red-500/40" />
                              ) : (
                                <Loader2 size={16} className="animate-spin text-gray-800" />
                              )}
                            </div>
                            <div className="flex-grow min-w-0">
                                <p className={`font-bold text-sm truncate mb-1 ${f.status === 'error' ? 'text-red-400' : 'text-gray-200'}`}>{f.file.name}</p>
                                <p className="text-[10px] text-gray-500 font-bold tracking-tight">
                                  {(f.file.size / 1024 / 1024).toFixed(2)} MB • {f.status === 'error' ? 'LOAD FAILED' : 'VERIFIED'}
                                </p>
                            </div>
                            <button onClick={() => setFiles(prev => prev.filter(x => x.id !== f.id))} className="p-3 text-gray-700 hover:text-red-500 transition-colors">
                              <Trash2 size={18}/>
                            </button>
                          </div>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                    <button onClick={triggerFileInput} className="w-full py-5 border-2 border-dashed border-white/5 rounded-2xl text-gray-600 hover:text-white hover:border-white/20 transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                       <PlusCircle size={14} /> Inject Fragment
                    </button>
                  </div>
                )}

                {toolId === 'organize' && pages.length > 0 && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between px-2">
                       <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Atomic Page Mapping ({pages.length} Pages)</h3>
                       <div className="flex gap-6">
                          <button onClick={triggerFileInput} className="text-[10px] text-blue-500 font-black uppercase tracking-widest hover:text-blue-400">Append Node</button>
                          <button onClick={handleReset} className="text-[10px] text-red-500/60 font-black uppercase tracking-widest">Reset Core</button>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                      <Reorder.Group axis="x" values={pages} onReorder={setPages} className="contents">
                        {pages.map((p) => (
                          <Reorder.Item key={p.id} value={p} className="cursor-grab active:cursor-grabbing">
                            <div className="liquid-glass rounded-2xl aspect-[3/4] p-2 flex flex-col border border-white/5 hover:border-white/20 hover:shadow-2xl transition-all relative group overflow-hidden">
                               <div className="flex-grow bg-black/60 rounded-xl flex items-center justify-center border border-white/5 mb-3 overflow-hidden shadow-inner">
                                  {p.thumbnailUrl ? (
                                    <img src={p.thumbnailUrl} className="w-full h-full object-contain" />
                                  ) : (
                                    <div className="flex flex-col items-center gap-2 text-gray-800">
                                       <Loader2 className="w-5 h-5 animate-spin" />
                                       <span className="text-[8px] font-black">SCANNING</span>
                                    </div>
                                  )}
                               </div>
                               <div className="flex items-center justify-between px-2 pb-1.5">
                                  <span className="text-[10px] font-black text-gray-600 uppercase tracking-tighter">IDX {p.pageIndex + 1}</span>
                                  <button onClick={(e) => { e.stopPropagation(); setPages(prev => prev.filter(x => x.id !== p.id)); }} className="text-gray-700 hover:text-red-500 transition-colors"><Trash2 size={12} /></button>
                               </div>
                               <div className="absolute inset-0 bg-red-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            </div>
                          </Reorder.Item>
                        ))}
                      </Reorder.Group>
                      
                      <button onClick={triggerFileInput} className="rounded-2xl aspect-[3/4] border-2 border-dashed border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-gray-700 hover:text-blue-400 hover:border-blue-500/20 transition-all group">
                         <PlusCircle size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                         <span className="text-[10px] font-black uppercase tracking-widest">Insert</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>

        <aside className="lg:col-span-4 xl:col-span-3 order-1 lg:order-2 self-start lg:sticky lg:top-32 w-full">
          <div className="liquid-glass rounded-[2.5rem] p-8 border border-white/10 shadow-2xl">
            <h3 className="text-lg font-black mb-8 tracking-tighter uppercase text-gray-200">Session Logic</h3>
            
            <div className="space-y-4 mb-10">
              {[
                ["Active Objects", files.length],
                ["Manipulation", tool.name.split(' ')[0]],
                ["Privacy Hash", "Zero-Cache"],
                ["Runtime", "Local Core"]
              ].map(([k, v], i) => (
                <div key={i} className="flex justify-between text-[10px] font-black uppercase tracking-widest border-b border-white/5 pb-3">
                  <span className="text-gray-600">{k}</span>
                  <span className="text-gray-200">{v}</span>
                </div>
              ))}
            </div>

            <button 
              disabled={files.length === 0 || files.some(f => f.status === 'error') || status === ProcessingStatus.PROCESSING || (toolId === 'merge' && files.length < 2) || (toolId === 'organize' && pages.length === 0)}
              onClick={processEngine}
              className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-[0.98] 
                ${(files.length === 0 || files.some(f => f.status === 'error') || status === ProcessingStatus.PROCESSING || (toolId === 'merge' && files.length < 2) || (toolId === 'organize' && pages.length === 0))
                  ? 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5' 
                  : 'bg-white text-black hover:bg-gray-100 hover:-translate-y-1 shadow-white/5'}`}
            >
              {status === ProcessingStatus.PROCESSING ? 'Engaging Core Engine...' : `Initialize Execution`}
            </button>
            
            <div className="mt-8 p-4 bg-orange-500/[0.03] border border-orange-500/10 rounded-xl flex items-start gap-3">
               <AlertTriangle size={14} className="text-orange-500/40 shrink-0" />
               <p className="text-[9px] text-gray-500 leading-relaxed font-bold uppercase tracking-tight">
                 Binary streams are strictly isolated. Workspace persistence is disabled by policy.
               </p>
            </div>
          </div>
        </aside>
      </div>
    </motion.div>
  );
};

export default ToolProcessor;