'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

type Persona = {
    id: string;
    name: string;
    role: string;
    description: string;
    color: string;
    emoji: string;
    document_count: number;
    is_active: boolean;
    created_at: string;
    custom_persona_documents?: Doc[];
};

type Doc = {
    id: string;
    filename: string;
    file_type: string;
    chunk_count: number;
    status: string;
    created_at: string;
};

const COLORS = ['#1a1a1a', '#4a4a4a', '#8a8a8a', '#000000', '#2d3436', '#636e72'];
const EMOJIS = ['🏛️', '📊', '🧠', '🎯', '🔬', '💡', '🛡️', '⚡'];

export default function CustomPersonaPage() {
    const [personas, setPersonas] = useState<Persona[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedPersona, setSelectedPersona] = useState<string | null>(null);

    // Form state
    const [name, setName] = useState('');
    const [role, setRole] = useState('Internal Strategic Advisor');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState('#1a1a1a');
    const [emoji, setEmoji] = useState('🏛️');
    const [pendingFiles, setPendingFiles] = useState<File[]>([]);


    const fetchPersonas = useCallback(async () => {
        const res = await fetch('/api/custom-persona');
        const data = await res.json();
        setPersonas(data.personas || []);
        setLoading(false);
    }, []);

    useEffect(() => { fetchPersonas(); }, [fetchPersonas]);

    const handleCreate = async () => {
        if (!name.trim()) return;
        setCreating(true);
        try {
            const res = await fetch('/api/custom-persona', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, role, description, color, emoji }),
            });
            const data = await res.json();
            if (res.ok) {
                const newPersonaId = data.persona.id;

                // Upload pending files if any
                if (pendingFiles.length > 0) {
                    setUploading(true);
                    for (const file of pendingFiles) {
                        const formData = new FormData();
                        formData.append('persona_id', newPersonaId);
                        formData.append('file', file);
                        formData.append('filename', file.name);
                        await fetch('/api/custom-persona/upload', { method: 'POST', body: formData });
                    }
                    setUploading(false);
                }

                setName(''); setDescription('');
                setPendingFiles([]);
                await fetchPersonas();
            } else {
                console.error('[Create Persona Error]', data);
                if (data.code === 'UPGRADE_REQUIRED') {
                    alert(`Access Denied: ${data.error}`);
                    window.location.href = '/pricing';
                } else {
                    alert(`Failed to create expert: ${data.error || 'Unknown error'}`);
                }
            }
        } catch (err) {
            console.error('[Create Persona Exception]', err);
            alert('A network error occurred while creating the expert.');
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this persona? All documents and training data will be permanently removed.')) return;
        await fetch(`/api/custom-persona?id=${id}`, { method: 'DELETE' });
        await fetchPersonas();
    };

    const handleUpload = async (personaId: string, files: FileList) => {
        setUploading(true);
        try {
            for (const file of Array.from(files)) {
                const formData = new FormData();
                formData.append('persona_id', personaId);
                formData.append('file', file);
                formData.append('filename', file.name);
                const res = await fetch('/api/custom-persona/upload', { method: 'POST', body: formData });
                const data = await res.json();
                if (!res.ok) {
                    console.error(`[Upload Error] ${file.name}:`, data);
                    alert(`Failed to upload ${file.name}: ${data.error || 'Unknown error'}`);
                }
            }
        } catch (err) {
            console.error('[Upload Exception]', err);
            alert('A network error occurred during upload.');
        } finally {
            await fetchPersonas();
            setUploading(false);
        }
    };

    const handleTextUpload = async (personaId: string) => {
        const text = prompt('Paste your text content (business plan, strategy doc, financials, etc.):');
        if (!text || text.length < 100) { alert('Content must be at least 100 characters.'); return; }
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('persona_id', personaId);
            formData.append('text_content', text);
            formData.append('filename', `text-${Date.now()}.txt`);
            const res = await fetch('/api/custom-persona/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (!res.ok) {
                console.error('[Text Upload Error]', data);
                alert(`Failed to save text content: ${data.error || 'Unknown error'}`);
            }
        } catch (err) {
            console.error('[Text Upload Exception]', err);
            alert('A network error occurred while saving text.');
        } finally {
            await fetchPersonas();
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-premium-bg text-premium-text font-body selection:bg-premium-accent/20 antialiased py-16 px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-20">
                    <Link href="/dashboard" className="text-[10px] font-black uppercase tracking-[0.3em] text-premium-muted hover:text-premium-accent transition mb-8 inline-block flex items-center gap-2">
                        <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                        Back to Dashboard
                    </Link>
                    <h1 className="text-4xl font-black tracking-tight font-display uppercase mb-4">
                        Perspective <span className="text-premium-muted italic">Training</span>
                    </h1>
                    <p className="text-premium-muted text-sm max-w-2xl leading-relaxed">
                        Synthesize corporate knowledge into a proprietary Council member. By ingesting your internal documentation, this perspective argues using your specific business logic and financials.
                    </p>
                </div>

                {/* Create Form */}
                <div className="premium-card p-10 mb-12">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-premium-muted mb-10">Initialize Training</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-premium-muted block mb-3">Perspective Name</label>
                            <input
                                type="text" value={name} onChange={e => setName(e.target.value)}
                                placeholder="e.g. Acme Strategic Advisor"
                                className="w-full bg-black/[0.03] border-b border-black/[0.05] focus:border-premium-accent px-0 py-3 text-sm focus:outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-premium-muted block mb-3">Organizational Role</label>
                            <input
                                type="text" value={role} onChange={e => setRole(e.target.value)}
                                placeholder="e.g. Chief Strategy Officer"
                                className="w-full bg-black/[0.03] border-b border-black/[0.05] focus:border-premium-accent px-0 py-3 text-sm focus:outline-none transition"
                            />
                        </div>
                    </div>
                    <div className="mb-10">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-premium-muted block mb-3">Behavioral Brief (Optional)</label>
                        <textarea
                            value={description} onChange={e => setDescription(e.target.value)}
                            placeholder="Define the cognitive framework, priorities, and adversarial triggers for this perspective..."
                            rows={3}
                            className="w-full bg-black/[0.03] border-b border-black/[0.05] focus:border-premium-accent px-0 py-3 text-sm focus:outline-none transition resize-none"
                        />
                    </div>

                    {/* Training Data Input */}
                    <div className="mb-10">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-premium-muted block mb-4">Training Assets (.pdf, .txt, .md)</label>
                        <div className="space-y-4">
                            <label className="flex items-center justify-center gap-4 w-full bg-black/[0.02] border border-dashed border-black/10 rounded-2xl py-8 cursor-pointer hover:border-premium-accent/20 transition group">
                                <input type="file" multiple accept=".txt,.md,.pdf" className="hidden"
                                    onChange={e => e.target.files && setPendingFiles([...pendingFiles, ...Array.from(e.target.files)])} />
                                <span className="material-symbols-outlined text-premium-muted group-hover:scale-110 transition-transform">upload_file</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-premium-muted">Attach Strategic Documents</span>
                            </label>

                            {pendingFiles.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {pendingFiles.map((f, idx) => (
                                        <div key={idx} className="flex items-center gap-3 bg-black/[0.03] border border-black/[0.05] rounded-full px-4 py-2">
                                            <span className="text-[9px] font-black uppercase tracking-widest truncate max-w-[200px]">{f.name}</span>
                                            <button onClick={() => setPendingFiles(pendingFiles.filter((_, i) => i !== idx))}
                                                className="text-red-400 hover:text-red-600">
                                                <span className="material-symbols-outlined text-[14px]">close</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-12 mb-12">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-premium-muted block mb-4">Color Profile</label>
                            <div className="flex gap-3">
                                {COLORS.map(c => (
                                    <button key={c} onClick={() => setColor(c)}
                                        className={`size-6 rounded-full transition-all ${color === c ? 'ring-2 ring-premium-accent ring-offset-4 scale-110' : 'opacity-40 hover:opacity-100'}`}
                                        style={{ backgroundColor: c }} />
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-premium-muted block mb-4">Perspective Icon</label>
                            <div className="flex gap-2">
                                {EMOJIS.map(e => (
                                    <button key={e} onClick={() => setEmoji(e)}
                                        className={`size-10 rounded-xl flex items-center justify-center text-xl transition-all ${emoji === e ? 'bg-black text-white shadow-lg' : 'bg-black/[0.03] hover:bg-black/[0.05]'}`}>
                                        {e}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <button onClick={handleCreate} disabled={creating || !name.trim()}
                        className="premium-button px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] disabled:opacity-50">
                        {creating || uploading ? (uploading ? 'Processing Assets...' : 'Synchronizing...') : 'Finalize Training'}
                    </button>
                </div>

                {/* Persona List */}
                {loading ? (
                    <div className="text-center text-premium-muted py-20 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Syncing Perspectives...</div>
                ) : personas.length === 0 ? (
                    <div className="premium-card p-20 text-center border-dashed">
                        <span className="material-symbols-outlined text-4xl text-premium-muted/30 mb-6">psychology_alt</span>
                        <h3 className="text-xl font-black font-display mb-2 text-premium-muted">No Trained Perspectives</h3>
                        <p className="text-sm text-premium-muted/60">Initialize training to create a proprietary voice for the Council.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                         <div className="flex items-center gap-4 mb-10">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-premium-muted">Active Perspectives</h2>
                            <div className="flex-1 h-px bg-black/[0.03]"></div>
                        </div>
                        
                        {personas.map(p => {
                            const docs = p.custom_persona_documents || [];
                            const isOpen = selectedPersona === p.id;
                            const readyDocs = docs.filter(d => d.status === 'ready').length;
                            const totalChunks = docs.reduce((sum, d) => sum + (d.chunk_count || 0), 0);

                            return (
                                <div key={p.id} className="premium-card overflow-hidden">
                                    {/* Persona Header */}
                                    <div className="p-8 flex items-center justify-between cursor-pointer hover:bg-black/[0.01] transition"
                                        onClick={() => setSelectedPersona(isOpen ? null : p.id)}>
                                        <div className="flex items-center gap-6">
                                            <div className="size-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-black/5"
                                                style={{ backgroundColor: p.color + '10' }}>
                                                {p.emoji}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black font-display tracking-tight uppercase" style={{ color: p.color }}>{p.name}</h3>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-premium-muted">{p.role}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-10">
                                            <div className="text-right hidden sm:block">
                                                <p className="text-[10px] font-black uppercase tracking-widest mb-1">{readyDocs} Documents</p>
                                                <p className="text-[10px] font-bold text-premium-muted">{totalChunks} Strategic Chunks</p>
                                            </div>
                                            <span className="material-symbols-outlined text-premium-muted transition-transform duration-500" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}>expand_more</span>
                                        </div>
                                    </div>

                                    {/* Expanded Content */}
                                    {isOpen && (
                                        <div className="border-t border-black/[0.03] p-8 space-y-10 bg-black/[0.01]">
                                            {p.description && (
                                                <div>
                                                    <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-premium-muted mb-4">Brief</h4>
                                                    <p className="text-sm text-premium-muted leading-relaxed italic">&quot;{p.description}&quot;</p>
                                                </div>
                                            )}

                                            {/* Upload Area */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <label className="cursor-pointer">
                                                    <input type="file" multiple accept=".txt,.md,.csv,.pdf"
                                                        className="hidden"
                                                        onChange={e => e.target.files && handleUpload(p.id, e.target.files)} />
                                                    <div className="border border-dashed border-black/10 rounded-2xl p-8 text-center hover:border-premium-accent transition group">
                                                        <span className="material-symbols-outlined text-premium-muted mb-2 group-hover:scale-110 transition-transform">add_circle</span>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-premium-muted">
                                                            {uploading ? 'Processing...' : 'Upload Asset'}
                                                        </p>
                                                    </div>
                                                </label>
                                                <button onClick={() => handleTextUpload(p.id)}
                                                    className="border border-black/[0.05] rounded-2xl p-8 flex flex-col items-center justify-center hover:bg-black/[0.02] transition group">
                                                    <span className="material-symbols-outlined text-premium-muted mb-2 group-hover:scale-110 transition-transform">edit_note</span>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-premium-muted">Paste Intelligence</p>
                                                </button>
                                            </div>

                                            {/* Document List */}
                                            {docs.length > 0 && (
                                                <div className="space-y-3">
                                                    <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-premium-muted mb-4">Intelligence Assets</h4>
                                                    {docs.map(d => (
                                                        <div key={d.id} className="flex items-center justify-between bg-white border border-black/[0.03] rounded-xl p-4 transition-all hover:shadow-md hover:shadow-black/5">
                                                            <div className="flex items-center gap-4">
                                                                <span className="material-symbols-outlined text-premium-muted">{d.file_type === 'pdf' ? 'picture_as_pdf' : 'description'}</span>
                                                                <span className="text-[11px] font-bold tracking-tight truncate max-w-[250px]">{d.filename}</span>
                                                            </div>
                                                            <div className="flex items-center gap-6">
                                                                <span className="text-[9px] font-black uppercase tracking-widest text-premium-muted">{d.chunk_count} Chunks</span>
                                                                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${d.status === 'ready'
                                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                                                    : 'bg-amber-50 text-amber-700 border border-amber-100'
                                                                    }`}>
                                                                    {d.status}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Actions */}
                                            <div className="flex justify-end pt-4">
                                                <button onClick={() => handleDelete(p.id)}
                                                    className="text-[10px] font-black uppercase tracking-widest text-red-300 hover:text-red-500 transition flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-[14px]">delete</span>
                                                    Delete Perspective
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
