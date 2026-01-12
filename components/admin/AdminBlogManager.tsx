
import React, { useState, useRef, memo, useCallback } from 'react';
import { compressImage } from '../../utils/imageCompression.ts';
import {
  PenTool, Trash2, Plus, Image as ImageIcon, X, UploadCloud,
  Type, Heading1, Tag, ChevronRight, FileText, Quote
} from 'lucide-react';
import { BlogPost, SiteContent, BlogBlock } from '../../types.ts';

const InputField = memo(({ label, value, onChange, placeholder = "", type = "text" }: any) => (
  <div className="space-y-2">
    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
    {type === "textarea" ? (
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-slate-300 text-sm h-32 resize-none focus:border-orange-500/50 outline-none transition-all"
      />
    ) : (
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white font-black text-xs focus:border-orange-500/50 outline-none transition-all"
      />
    )}
  </div>
));

const Dropzone = memo(({ currentImage, label, onUpload, aspect = "aspect-video", hint = "" }: any) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 800, 0.7);
        onUpload(compressed);
      } catch (err) {
        console.error(err);
        alert("Görsel işlenemedi.");
      }
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end px-1">
        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</label>
        {hint && <span className="text-[8px] font-bold text-orange-500/70 uppercase">{hint}</span>}
      </div>
      <div
        onClick={() => fileRef.current?.click()}
        className={`${aspect} rounded-2xl border-2 border-dashed border-white/10 bg-black/40 hover:border-orange-500/50 transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden group relative`}
      >
        <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleFile} />
        {currentImage ? (
          <img src={currentImage} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform" alt="Preview" />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <UploadCloud size={32} className="text-slate-700 group-hover:text-orange-500 transition-colors" />
            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Görsel Yükle</span>
          </div>
        )}
      </div>
    </div>
  );
});

const AdminBlogManager: React.FC<{ posts: BlogPost[]; content: SiteContent; onUpdateContent: (c: SiteContent) => void; }> = ({ posts, onUpdateContent, content }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showSeo, setShowSeo] = useState(false);
  const current = posts.find(p => p.id === editingId);

  const updatePosts = (newPosts: BlogPost[]) => onUpdateContent({ ...content, blogPosts: newPosts });

  const handleUpdate = useCallback((updates: Partial<BlogPost>) => {
    if (!editingId) return;
    updatePosts(posts.map(p => p.id === editingId ? { ...p, ...updates } : p));
  }, [editingId, posts, content]);

  const handleCreateNew = () => {
    const newId = `blog_${Date.now()}`;
    const newPost: BlogPost = {
      id: newId, title: 'YENİ MAKALE BAŞLIĞI', excerpt: 'Kısa özet...',
      blocks: [{ id: `b_${Date.now()}`, type: 'p', content: 'İçeriği yazmaya başlayın...' }],
      author: 'Kafamda Kırk Tilki', date: new Date().toLocaleDateString('tr-TR'), image: '', category: 'DİJİTAL', readTime: '5 dk', tags: [],
      seoTitle: '', seoDescription: ''
    };
    updatePosts([...posts, newPost]);
    setEditingId(newId);
  };

  const addBlock = (type: 'p' | 'h1' | 'h2' | 'img' | 'quote') => {
    if (!current) return;
    const newBlock: BlogBlock = { id: `b_${Date.now()}`, type, content: type === 'img' ? '' : 'Yeni blok içeriği...' };
    handleUpdate({ blocks: [...(current.blocks || []), newBlock] });
  };

  if (!editingId) {
    return (
      <div className="space-y-10 animate-in fade-in duration-500">
        <header className="flex justify-between items-center border-b border-white/5 pb-8">
          <div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Blog Stüdyosu</h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">DİJİTAL HİKAYE ANLATIMI</p>
          </div>
          <button onClick={handleCreateNew} className="bg-orange-600 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 shadow-xl flex items-center gap-3 transition-all">
            <Plus size={16} /> YENİ YAZI OLUŞTUR
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <div key={post.id} className="glass-panel p-6 rounded-[2.5rem] border border-white/5 group transition-all hover:border-orange-500/30 bg-black/20 flex flex-col">
              <div className="aspect-video bg-slate-900 rounded-[1.8rem] overflow-hidden mb-6 relative border border-white/5">
                {post.image ? <img src={post.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" /> : <div className="h-full w-full flex items-center justify-center"><ImageIcon size={32} className="text-slate-800" /></div>}
                <div className="absolute top-4 left-4 bg-orange-600 text-white text-[8px] font-black px-3 py-1.5 rounded-lg tracking-widest uppercase">{post.category}</div>
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight mb-3 line-clamp-2">{post.title}</h3>
              <p className="text-slate-500 text-[10px] font-bold leading-relaxed mb-8 line-clamp-3">{post.excerpt}</p>
              <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">{post.date}</span>
                <button onClick={() => setEditingId(post.id)} className="flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-orange-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">
                  DÜZENLE <ChevronRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in pb-40">
      <header className="flex justify-between items-center border-b border-white/5 pb-8">
        <button onClick={() => setEditingId(null)} className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 hover:text-white transition-colors">
          ← LİSTEYE DÖN
        </button>
        <div className="flex gap-4">
          <button onClick={() => setShowSeo(!showSeo)} className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${showSeo ? 'bg-orange-600 text-white' : 'bg-white/5 text-slate-500 hover:text-white'}`}>SEO AYARLARI</button>
          <button onClick={() => { if (confirm('Emin misiniz?')) { updatePosts(posts.filter(p => p.id !== editingId)); setEditingId(null); } }} className="bg-rose-500/10 text-rose-500 px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">SİL</button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-12 space-y-10">
          <div className="bg-[#0D1225] p-12 rounded-[3.5rem] border border-white/10 space-y-10 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <InputField label="MAKALE BAŞLIĞI" value={current?.title} onChange={(v: string) => handleUpdate({ title: v.toUpperCase() })} />
                <InputField label="YAZAR ADI" value={current?.author} onChange={(v: string) => handleUpdate({ author: v })} />
                <InputField label="KATEGORİ" value={current?.category} onChange={(v: string) => handleUpdate({ category: v.toUpperCase() })} />
                <InputField label="KISA ÖZET (EXCERPT)" type="textarea" value={current?.excerpt} onChange={(v: string) => handleUpdate({ excerpt: v })} />
              </div>
              <div className="space-y-6">
                <Dropzone label="KAPAK GÖRSELİ" currentImage={current?.image} onUpload={(v: string) => handleUpdate({ image: v })} />
                <div className="flex flex-wrap gap-2 items-center bg-black/20 p-4 rounded-2xl border border-white/5 min-h-[60px]">
                  {current?.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="bg-orange-600/20 text-orange-500 text-[8px] font-black px-3 py-1.5 rounded-lg flex items-center gap-2">
                      {tag} <button onClick={() => handleUpdate({ tags: current.tags.filter((_, i) => i !== tIdx) })}><X size={10} /></button>
                    </span>
                  ))}
                  <input
                    placeholder="ETİKET EKLE + ENTER"
                    className="bg-transparent border-none outline-none text-[9px] font-black uppercase text-white px-2 flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        handleUpdate({ tags: [...(current?.tags || []), e.currentTarget.value.trim().toUpperCase()] });
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {showSeo && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-white/5 animate-in slide-in-from-top-4">
                <InputField label="SEO BAŞLIĞI" value={current?.seoTitle} onChange={(v: string) => handleUpdate({ seoTitle: v })} />
                <InputField label="SEO AÇIKLAMASI" type="textarea" value={current?.seoDescription} onChange={(v: string) => handleUpdate({ seoDescription: v })} />
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between px-4 bg-black/40 p-4 rounded-2xl border border-white/5 sticky top-6 z-20 backdrop-blur-md">
              <h5 className="text-[11px] font-black uppercase text-slate-500 tracking-widest">YAZI İÇERİĞİ VE BLOKLAR</h5>
              <div className="flex gap-2">
                <button onClick={() => addBlock('h1')} title="Ana Başlık" className="p-3 bg-white/5 hover:bg-orange-600 text-white rounded-xl transition-all border border-white/5"><Heading1 size={16} /></button>
                <button onClick={() => addBlock('h2')} title="Alt Başlık" className="p-3 bg-white/5 hover:bg-orange-600 text-white rounded-xl transition-all border border-white/5"><Type size={16} /></button>
                <button onClick={() => addBlock('p')} title="Paragraf" className="p-3 bg-white/5 hover:bg-orange-600 text-white rounded-xl transition-all border border-white/5"><FileText size={16} /></button>
                <button onClick={() => addBlock('img')} title="Görsel" className="p-3 bg-white/5 hover:bg-orange-600 text-white rounded-xl transition-all border border-white/5"><ImageIcon size={16} /></button>
                <button onClick={() => addBlock('quote')} title="Alıntı" className="p-3 bg-white/5 hover:bg-orange-600 text-white rounded-xl transition-all border border-white/5"><Quote size={16} /></button>
              </div>
            </div>

            <div className="space-y-6">
              {current?.blocks?.map((block) => (
                <div key={block.id} className="group relative bg-[#0D1225]/60 border border-white/5 rounded-[2.5rem] p-8 hover:border-orange-500/30 transition-all shadow-xl">
                  <button onClick={() => handleUpdate({ blocks: current.blocks.filter(b => b.id !== block.id) })} className="absolute -right-12 top-1/2 -translate-y-1/2 p-3 bg-rose-500/10 text-rose-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"><Trash2 size={16} /></button>

                  <div className="absolute -left-12 top-4 text-[8px] font-black text-slate-700 uppercase tracking-widest rotate-90">
                    {block.type}
                  </div>

                  {block.type === 'img' ? (
                    <div className="space-y-4">
                      <div className="aspect-video relative rounded-3xl overflow-hidden bg-black/40 border border-white/5">
                        {block.content ? (
                          <>
                            <img src={block.content} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                              <label className="bg-white text-black px-6 py-2 rounded-xl text-[10px] font-black cursor-pointer">GÖRSELİ DEĞİŞTİR</label>
                            </div>
                          </>
                        ) : <div className="h-full w-full flex flex-col items-center justify-center text-slate-700 font-black text-[9px]"><UploadCloud size={32} className="mb-2" /> BLOK GÖRSELİ YÜKLE</div>}
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const compressed = await compressImage(file, 800, 0.7);
                              handleUpdate({ blocks: current.blocks.map(b => b.id === block.id ? { ...b, content: compressed } : b) });
                            } catch (err) {
                              console.error(err);
                              alert("Görsel işlenemedi.");
                            }
                          }
                        }} />
                      </div>
                    </div>
                  ) : (
                    <textarea
                      value={block.content}
                      onChange={(e) => handleUpdate({ blocks: current.blocks.map(b => b.id === block.id ? { ...b, content: e.target.value } : b) })}
                      className={`w-full bg-transparent border-none outline-none text-white resize-none ${block.type === 'h1' ? 'text-2xl font-black uppercase' : block.type === 'h2' ? 'text-xl font-bold text-orange-500' : block.type === 'quote' ? 'italic text-lg text-slate-400 border-l-4 border-orange-600 pl-6' : 'text-lg text-slate-300'}`}
                      rows={block.type === 'p' ? 6 : block.type === 'quote' ? 4 : 1}
                      placeholder={block.type === 'h1' ? 'ANA BAŞLIK...' : block.type === 'h2' ? 'ALT BAŞLIK...' : 'İçerik yazın...'}
                    />
                  )}
                </div>
              ))}
              {(!current?.blocks || current.blocks.length === 0) && (
                <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] opacity-30">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em]">Yazı yazmaya başlamak için yukarıdan bir blok ekleyin.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogManager;
