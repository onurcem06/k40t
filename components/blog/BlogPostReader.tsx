
import React, { useEffect } from 'react';
import { ArrowLeft, User, Calendar, Clock, Tag, Quote, Share2, Hash } from 'lucide-react';
import { BlogPost } from '../../types.ts';

interface BlogPostReaderProps {
  post: BlogPost;
  onBack: () => void;
}

const BlogPostReader: React.FC<BlogPostReaderProps> = ({ post, onBack }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [post]);

  // Advanced Markdown Parser for SEO Friendly Headings
  const renderMarkdown = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('## ')) {
        return <h2 key={i} className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mt-16 mb-8 leading-none border-l-4 border-orange-600 pl-6">{trimmed.replace('## ', '')}</h2>;
      }
      if (trimmed.startsWith('### ')) {
        return <h3 key={i} className="text-xl md:text-3xl font-black text-orange-500 uppercase tracking-tight mt-12 mb-6">{trimmed.replace('### ', '')}</h3>;
      }
      if (trimmed.startsWith('* ')) {
        return (
          <div key={i} className="flex items-start gap-4 mb-3 ml-4">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-2.5 shrink-0" />
            <p className="text-slate-300 text-lg font-medium">{trimmed.replace('* ', '')}</p>
          </div>
        );
      }
      if (trimmed === '') return <div key={i} className="h-6" />;
      
      return <p key={i} className="text-slate-300 text-lg md:text-xl font-medium leading-relaxed mb-8 opacity-90">{line}</p>;
    });
  };

  return (
    <div className="min-h-screen bg-transparent pt-40 pb-20 px-6 animate-in fade-in zoom-in-95 duration-700">
      <div className="container mx-auto max-w-4xl relative z-20">
        <button 
          type="button"
          onClick={onBack} 
          className="flex items-center gap-3 text-slate-500 hover:text-orange-500 transition-all font-black text-xs uppercase tracking-[0.3em] mb-12 group cursor-pointer relative z-30"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          BLOG LİSTESİNE DÖN
        </button>

        <article className="glass-panel p-10 md:p-20 rounded-[3.5rem] border border-white/5 relative overflow-hidden bg-[#050810]/60 backdrop-blur-3xl shadow-2xl">
          <header className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <span className="bg-orange-600 text-white text-[9px] font-black px-5 py-2 rounded-full tracking-widest uppercase shadow-lg shadow-orange-900/20">
                {post.category}
              </span>
              <div className="h-px flex-1 bg-white/10"></div>
              <div className="flex items-center gap-4 text-slate-500">
                <Clock size={14} className="text-orange-500" />
                <span className="text-[10px] font-black uppercase tracking-widest">{post.readTime || '5 dk'}</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-12 animate-fade-up">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-8 border-b border-white/5 pb-10 mb-12">
              <div className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-widest group cursor-default">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-orange-500 group-hover:bg-orange-600 group-hover:text-white transition-all">
                  <User size={14} />
                </div>
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-orange-500">
                  <Calendar size={14} />
                </div>
                <span>{post.date}</span>
              </div>
              <div className="flex-1" />
              <button className="p-3 rounded-2xl bg-white/5 border border-white/5 text-slate-500 hover:text-orange-500 hover:border-orange-500/20 transition-all">
                <Share2 size={18} />
              </button>
            </div>
          </header>

          <div className="max-w-3xl mx-auto blog-content">
            {post.blocks && post.blocks.length > 0 ? (
              <div className="space-y-12">
                {post.blocks.map((block) => (
                  <div key={block.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {block.type === 'h1' && <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-8 leading-none border-l-4 border-orange-600 pl-6">{block.content}</h2>}
                    {block.type === 'h2' && <h3 className="text-xl md:text-3xl font-black text-orange-500 uppercase tracking-tight mb-6">{block.content}</h3>}
                    {block.type === 'p' && <p className="text-slate-300 text-lg md:text-xl font-medium leading-relaxed mb-8 whitespace-pre-wrap opacity-90">{block.content}</p>}
                    {block.type === 'img' && (
                      <div className="my-16 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative group">
                         <img src={block.content} className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-105" alt="İçerik Görseli" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    )}
                    {block.type === 'quote' && (
                      <div className="relative py-12 px-14 border-l-4 border-orange-600 bg-white/5 rounded-r-[2rem] my-12">
                         <Quote className="absolute top-8 left-8 text-orange-500/10" size={64} />
                         <p className="text-white text-2xl md:text-3xl font-medium italic leading-relaxed relative z-10">"{block.content}"</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="blog-content-legacy">
                {post.content ? renderMarkdown(post.content) : post.excerpt}
              </div>
            )}
          </div>

          {/* SEO TAG CLOUD */}
          <div className="mt-24 pt-12 border-t border-white/10">
             <div className="flex items-center gap-3 mb-8">
               <Hash className="text-orange-500" size={18} />
               <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">İLGİLİ ETİKETLER</h4>
             </div>
             <div className="flex flex-wrap gap-3">
                {(post.tags && post.tags.length > 0 ? post.tags : ['Digital', 'Marketing', 'Agency']).map((tag, idx) => (
                   <div key={idx} className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-black/40 border border-white/5 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-orange-500 hover:border-orange-500/40 hover:bg-orange-600/5 transition-all cursor-pointer group">
                      <Tag size={12} className="text-slate-700 group-hover:text-orange-500" /> {tag}
                   </div>
                ))}
             </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPostReader;
