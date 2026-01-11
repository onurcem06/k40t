
import React, { useState, useEffect } from 'react';
import BlogList from '../components/blog/BlogList.tsx';
import BlogPostReader from '../components/blog/BlogPostReader.tsx';
import MarketingLayout from '../components/layout/MarketingLayout.tsx';
import { BlogPost, ViewState, SiteContent } from '../types.ts';

interface BlogViewProps {
  posts: BlogPost[];
  content: SiteContent;
  onNavigate: (view: ViewState) => void;
  initialPostId?: string;
}

const BlogView: React.FC<BlogViewProps> = ({ posts, content, onNavigate, initialPostId }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    if (initialPostId) {
      const post = posts.find(p => p.id === initialPostId);
      if (post) setSelectedPost(post);
    }
  }, [initialPostId, posts]);

  return (
    <MarketingLayout content={content} onNavigate={onNavigate} onLoginClick={() => onNavigate('LOGIN')}>
      {selectedPost ? (
        <BlogPostReader 
          post={selectedPost} 
          onBack={() => {
            setSelectedPost(null);
            onNavigate('BLOG');
          }} 
        />
      ) : (
        <BlogList 
          posts={posts} 
          content={content} 
          onBack={() => onNavigate('MARKETING')} 
          onReadPost={(post) => {
            setSelectedPost(post);
            onNavigate(post.id);
          }} 
        />
      )}
    </MarketingLayout>
  );
};

export default BlogView;
