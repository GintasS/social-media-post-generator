"use client";

import { useState } from "react";

interface SocialMediaPost {
  platform: "twitter" | "instagram" | "linkedin";
  content: string;
}

export interface HistoricalPostBatch {
  id: string;
  productName: string;
  posts: SocialMediaPost[];
  generatedAt: Date;
}

interface HistoricalPostsProps {
  history: HistoricalPostBatch[];
  onClear: () => void;
}

export default function HistoricalPosts({ history, onClear }: HistoricalPostsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };
  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-600 mb-2">No history yet</h3>
        <p className="text-gray-500 text-sm">
          Generated posts will appear here for future reference.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Post History</h2>
        <button
          onClick={onClear}
          className="text-sm text-red-600 hover:text-red-700 transition-colors"
        >
          Clear History
        </button>
      </div>

      <div className="space-y-4">
        {history.map((batch) => (
          <div key={batch.id} className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-gray-900">{batch.productName}</h3>
                <p className="text-xs text-gray-500">
                  {batch.generatedAt.toLocaleString()}
                </p>
              </div>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {batch.posts.length} posts
              </span>
            </div>
            
            <div className="space-y-2">
              {batch.posts.map((post, idx) => {
                const postId = `${batch.id}-${idx}`;
                return (
                  <div key={idx} className="flex gap-2 text-sm items-start group">
                    <span className="font-medium text-blue-600 capitalize min-w-[80px]">
                      {post.platform}:
                    </span>
                    <p className="text-gray-700 flex-1">{post.content}</p>
                    <button
                      onClick={() => handleCopy(post.content, postId)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
                      title="Copy to clipboard"
                    >
                      {copiedId === postId ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

