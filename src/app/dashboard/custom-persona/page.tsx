'use client';
import { useEffect, useState, useCallback } from 'react';

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

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];
const EMOJIS = ['🏢', '📊', '🧠', '🎯', '🔬', '💡', '🛡️', '⚡'];

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
    const [color, setColor] = useState('#6366f1');
    const [emoji, setEmoji] = useState('🏢');
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
        <div className="min-h-screen bg-space-black text-slate-100 p-6 md:p-10">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <a href="/dashboard" className="text-sm text-slate-500 hover:text-neon-cyan transition mb-4 inline-block">← Back to Dashboard</a>
                    <h1 className="text-3xl font-black tracking-tight font-display">
                        Custom Expert <span className="text-neon-cyan">Persona</span>
                    </h1>
                    <p className="text-slate-400 mt-2">
                        Train an AI expert with your company&apos;s internal data. It joins the council as the 7th member and argues using your real numbers.
                    </p>
                </div>

                {/* Create Form */}
                <div className="glass-card rounded-2xl p-6 mb-8 border border-neon-cyan/10">
                    <h2 className="text-lg font-bold mb-4 font-display">Create New Expert</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="text-[11px] text-slate-500 uppercase tracking-widest font-bold block mb-1">Name</label>
                            <input
                                type="text" value={name} onChange={e => setName(e.target.value)}
                                placeholder="e.g. Acme Corp Strategist"
                                className="w-full bg-deep-blue border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:border-neon-cyan/50 focus:outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="text-[11px] text-slate-500 uppercase tracking-widest font-bold block mb-1">Role</label>
                            <input
                                type="text" value={role} onChange={e => setRole(e.target.value)}
                                placeholder="e.g. Internal Strategic Advisor"
                                className="w-full bg-deep-blue border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:border-neon-cyan/50 focus:outline-none transition"
                            />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="text-[11px] text-slate-500 uppercase tracking-widest font-bold block mb-1">Description (Optional)</label>
                        <textarea
                            value={description} onChange={e => setDescription(e.target.value)}
                            placeholder="Tell the AI how this expert thinks, what they prioritize, what framework they use..."
                            rows={2}
                            className="w-full bg-deep-blue border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:border-neon-cyan/50 focus:outline-none transition resize-none"
                        />
                    </div>

                    {/* NEW: Training Data Input */}
                    <div className="mb-6">
                        <label className="text-[11px] text-slate-500 uppercase tracking-widest font-bold block mb-2">Training Data (.txt, .md, .pdf)</label>
                        <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-3 w-full bg-white/5 border border-dashed border-white/10 rounded-xl px-4 py-3 cursor-pointer hover:border-neon-cyan/30 transition">
                                <input type="file" multiple accept=".txt,.md,.pdf" className="hidden"
                                    onChange={e => e.target.files && setPendingFiles([...pendingFiles, ...Array.from(e.target.files)])} />
                                <span className="text-xl">📁</span>
                                <span className="text-xs text-slate-400">Click to attach training documents</span>
                            </label>

                            {pendingFiles.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {pendingFiles.map((f, idx) => (
                                        <div key={idx} className="flex items-center gap-2 bg-neon-cyan/10 border border-neon-cyan/20 rounded-lg px-3 py-1.5">
                                            <span className="text-[10px] text-neon-cyan font-mono truncate max-w-[150px]">{f.name}</span>
                                            <button onClick={() => setPendingFiles(pendingFiles.filter((_, i) => i !== idx))}
                                                className="text-neon-cyan/60 hover:text-neon-cyan text-xs">✕</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-6 mb-6">
                        <div>
                            <label className="text-[11px] text-slate-500 uppercase tracking-widest font-bold block mb-2">Color</label>
                            <div className="flex gap-2">
                                {COLORS.map(c => (
                                    <button key={c} onClick={() => setColor(c)}
                                        className={`size-7 rounded-full border-2 transition ${color === c ? 'border-white scale-110' : 'border-transparent'}`}
                                        style={{ backgroundColor: c }} />
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-[11px] text-slate-500 uppercase tracking-widest font-bold block mb-2">Icon</label>
                            <div className="flex gap-1.5">
                                {EMOJIS.map(e => (
                                    <button key={e} onClick={() => setEmoji(e)}
                                        className={`text-xl px-1.5 py-0.5 rounded transition ${emoji === e ? 'bg-white/10 ring-1 ring-white/30' : 'hover:bg-white/5'}`}>
                                        {e}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button onClick={handleCreate} disabled={creating || !name.trim()}
                        className="px-6 py-2.5 bg-neon-cyan text-black font-bold text-sm rounded-xl hover:scale-105 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed">
                        {creating || uploading ? (uploading ? 'Processing Data...' : 'Creating...') : 'Create Expert'}
                    </button>
                </div>

                {/* Persona List */}
                {loading ? (
                    <div className="text-center text-slate-500 py-20">Loading personas...</div>
                ) : personas.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
                        <span className="text-4xl mb-4 block">🏢</span>
                        <p className="text-slate-400">No custom experts yet.</p>
                        <p className="text-slate-500 text-sm">Create one above and upload your company documents.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {personas.map(p => {
                            const docs = p.custom_persona_documents || [];
                            const isOpen = selectedPersona === p.id;
                            const readyDocs = docs.filter(d => d.status === 'ready').length;
                            const totalChunks = docs.reduce((sum, d) => sum + (d.chunk_count || 0), 0);

                            return (
                                <div key={p.id} className="glass-card rounded-2xl border border-white/5 overflow-hidden">
                                    {/* Persona Header */}
                                    <div className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition"
                                        onClick={() => setSelectedPersona(isOpen ? null : p.id)}>
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-xl flex items-center justify-center text-2xl border"
                                                style={{ borderColor: p.color + '40', backgroundColor: p.color + '10' }}>
                                                {p.emoji}
                                            </div>
                                            <div>
                                                <h3 className="font-bold font-display" style={{ color: p.color }}>{p.name}</h3>
                                                <p className="text-xs text-slate-500">{p.role}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-sm font-mono" style={{ color: p.color }}>{readyDocs} docs</p>
                                                <p className="text-[11px] text-slate-500">{totalChunks} chunks</p>
                                            </div>
                                            <div className={`size-3 rounded-full ${p.is_active ? 'bg-emerald-400' : 'bg-slate-600'}`}
                                                title={p.is_active ? 'Active' : 'Inactive'} />
                                            <span className="text-slate-500 text-sm">{isOpen ? '▲' : '▼'}</span>
                                        </div>
                                    </div>

                                    {/* Expanded Content */}
                                    {isOpen && (
                                        <div className="border-t border-white/5 p-5 space-y-4">
                                            {p.description && (
                                                <p className="text-sm text-slate-400 italic">&quot;{p.description}&quot;</p>
                                            )}

                                            {/* Upload Area */}
                                            <div className="flex gap-2">
                                                <label className="flex-1 cursor-pointer">
                                                    <input type="file" multiple accept=".txt,.md,.csv,.pdf"
                                                        className="hidden"
                                                        onChange={e => e.target.files && handleUpload(p.id, e.target.files)} />
                                                    <div className="border border-dashed border-white/10 rounded-xl p-4 text-center hover:border-neon-cyan/30 transition">
                                                        <span className="text-2xl block mb-1">📄</span>
                                                        <p className="text-xs text-slate-400">
                                                            {uploading ? 'Processing...' : 'Drop files here or click to upload'}
                                                        </p>
                                                        <p className="text-[10px] text-slate-600 mt-1">.txt, .md, .csv, .pdf</p>
                                                    </div>
                                                </label>
                                                <button onClick={() => handleTextUpload(p.id)}
                                                    className="px-4 border border-white/10 rounded-xl text-xs text-slate-400 hover:border-neon-cyan/30 hover:text-neon-cyan transition">
                                                    📝 Paste Text
                                                </button>
                                            </div>

                                            {/* Document List */}
                                            {docs.length > 0 && (
                                                <div className="space-y-1.5">
                                                    <h4 className="text-[11px] text-slate-500 uppercase tracking-widest font-bold">Documents</h4>
                                                    {docs.map(d => (
                                                        <div key={d.id} className="flex items-center justify-between bg-black/20 rounded-lg px-3 py-2 text-xs">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-slate-500">{d.file_type === 'pdf' ? '📕' : '📄'}</span>
                                                                <span className="text-slate-300 truncate max-w-[200px]">{d.filename}</span>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-slate-500 font-mono">{d.chunk_count} chunks</span>
                                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${d.status === 'ready'
                                                                    ? 'bg-emerald-400/10 text-emerald-400'
                                                                    : d.status === 'error'
                                                                        ? 'bg-red-400/10 text-red-400'
                                                                        : 'bg-amber-400/10 text-amber-400'
                                                                    }`}>
                                                                    {d.status}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Actions */}
                                            <div className="flex justify-end">
                                                <button onClick={() => handleDelete(p.id)}
                                                    className="text-xs text-red-400/60 hover:text-red-400 transition">
                                                    Delete persona & all data
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
