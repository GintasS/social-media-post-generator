"use client";

import PostGallery from "./PostGallery";

interface SocialMediaPost {
  platform: "twitter" | "instagram" | "linkedin";
  content: string;
}

interface GeneratedPostsProps {
  posts: SocialMediaPost[];
}

export default function GeneratedPosts({ posts }: GeneratedPostsProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-600 mb-2">No posts generated yet</h3>
        <p className="text-gray-500 text-sm">
          Go to the Post Generator tab to create social media posts.
        </p>
      </div>
    );
  }

  return <PostGallery posts={posts} />;
}

