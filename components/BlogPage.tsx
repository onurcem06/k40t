
import React, { useState } from 'react';
import { ArrowLeft, Calendar, User, Tag, ArrowRight, BookOpen } from 'lucide-react';
import { SiteContent, BlogPost } from '../types.ts';

interface BlogPageProps {
  content: SiteContent;
  onBack: () => void;
}

const BlogPage: React.FC<BlogPageProps> = ({ content, onBack }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const posts = content.blogPosts || [];
  
  // Crash önlemek için fallback desteği
  const { topTitle, mainTitle1, mainTitle2, description } = content.blogPage || {
    topTitle: 'HABERLER VE İÇERİKLER',
    mainTitle1: 'TILKI',
    mainTitle2: 'GÜNCESİ',
    description: 'Sektörel öngörülerimiz, başarı hikayelerimiz ve dijital dünyaya dair son gelişmeler.'
  };

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-transparent pt-32 pb-20 px-6 animate-in fade-in zoom-in-95 duration-700">
        <div className="container mx-auto max-w-4xl">
          <button 
            onClick={() => setSelectedPost(null)} 
            className="flex items-center gap-3 text-slate-500 hover:text-orange-500 transition-all font-black text-xs uppercase tracking-[0.3em] mb-12 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            BLOG LİSTESİNE DÖN
          </button>

          <article className="glass-panel p-10 md:p-20 rounded-[3.5rem] border border-white/5 relative overflow-hidden bg-slate-900/20">
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <span className="bg-orange-600 text-white text-[9px] font-black px-4 py-1.5 rounded-full tracking-widest uppercase">
                  {selectedPost.category}
                </span>
                <div className="h-px flex-1 bg-white/10"></div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{selectedPost.date}</p>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-8">
                {selectedPost.title}
              </h1>
              <div className="flex items-center gap-4 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <User size={14} className="text-orange-500" />
                <span>{selectedPost.author}</span>
              </div>
            </div>

            <div className="aspect-video w-full rounded-[2.5rem] overflow-hidden mb-12 border border-white/10">
              <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-full object-cover" />
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-slate-300 text-lg md:text-xl font-medium leading-relaxed whitespace-pre-wrap">
                {selectedPost.content}
              </p>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent pt-32 pb-20 px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="container mx-auto max-w-6xl">
        <button 
          onClick={onBack} 
          className="flex items-center gap-3 text-slate-500 hover:text-orange-500 transition-all font-black text-xs uppercase tracking-[0.3em] mb-12 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          ANA SAYFAYA DÖN
        </button>

        <header className="mb-20">
          <p className="text-orange-500 font-black text-[10px] uppercase tracking-[0.5em] mb-4">{topTitle}</p>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9]">
            {mainTitle1} <br/> {mainTitle2}
          </h1>
          <p className="text-slate-500 mt-8 max-w-xl text-lg font-medium">{description}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post) => (
            <article 
              key={post.id} 
              onClick={() => setSelectedPost(post)}
              className="glass-panel group cursor-pointer border border-white/5 hover:border-orange-500/30 transition-all duration-500 rounded-[3rem] overflow-hidden flex flex-col h-full hover:-translate-y-2 bg-slate-900/10"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" 
                />
                <div className="absolute top-6 left-6">
                  <span className="bg-black/60 backdrop-blur-xl text-white text-[8px] font-black px-4 py-2 rounded-xl tracking-widest uppercase border border-white/10">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar size={12} className="text-orange-500" />
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{post.date}</span>
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-4 group-hover:text-orange-500 transition-colors leading-tight">
                  {post.title}
                </h3>
                <p className="text-slate-500 text-sm font-bold leading-relaxed mb-8 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User size={12} className="text-slate-600" />
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{post.author}</span>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-orange-500 group-hover:border-orange-500 transition-all">
                    <ArrowRight size={16} className="text-white" />
                  </div>
                </div>
              </div>
            </article>
          ))}
          {posts.length === 0 && (
            <div className="col-span-full border-2 border-dashed border-white/5 rounded-[3rem] p-32 text-center opacity-30">
              <p className="text-xs font-black uppercase tracking-[0.5em]">Henüz yayınlanmış bir yazı yok.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
