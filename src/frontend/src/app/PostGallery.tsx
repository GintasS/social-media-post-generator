"use client";

import { useState } from "react";

interface SocialMediaPost {
  platform: "twitter" | "instagram" | "linkedin";
  content: string;
}

interface PostGalleryProps {
  posts: SocialMediaPost[];
}

const ClipboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const PLATFORM_LABELS: Record<string, string> = {
  twitter: "X (Twitter)",
  instagram: "Instagram",
  linkedin: "LinkedIn",
};

export default function PostGallery({ posts }: PostGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? posts.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === posts.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const copyToClipboard = async (content: string, index: number) => {
    await navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (posts.length === 0) return null;

  const currentPost = posts[currentIndex];

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Generated Posts</h2>
      
      <div className="relative">
        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors border border-gray-200"
          aria-label="Previous post"
        >
          <ChevronLeftIcon />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors border border-gray-200"
          aria-label="Next post"
        >
          <ChevronRightIcon />
        </button>

        {/* Post Card */}
        <div className="mx-8">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 min-h-[200px]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500">
                {PLATFORM_LABELS[currentPost.platform] || currentPost.platform}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  {currentPost.content.length} chars
                </span>
                <button
                  onClick={() => copyToClipboard(currentPost.content, currentIndex)}
                  className="p-2 rounded-md hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
                  title="Copy to clipboard"
                >
                  {copiedIndex === currentIndex ? (
                    <span className="text-green-500"><CheckIcon /></span>
                  ) : (
                    <ClipboardIcon />
                  )}
                </button>
              </div>
            </div>

            {/* Content */}
            <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">
              {currentPost.content}
            </p>
          </div>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {posts.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                index === currentIndex
                  ? "bg-gray-800"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to post ${index + 1}`}
            />
          ))}
        </div>

        {/* Counter */}
        <p className="text-center text-sm text-gray-500 mt-2">
          {currentIndex + 1} of {posts.length}
        </p>
      </div>
    </div>
  );
}
