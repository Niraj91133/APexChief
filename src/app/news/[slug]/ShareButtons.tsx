'use client';

import React, { useState } from 'react';
import { Share2, Link as LinkIcon, Check } from 'lucide-react';

export default function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = (platform: 'twitter' | 'facebook' | 'linkedin') => {
    if (typeof window === 'undefined') return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(title);

    let shareUrl = '';
    if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    } else if (platform === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    } else if (platform === 'linkedin') {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className="py-4 border-t border-b border-gray-200 dark:border-white/15 my-6 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center space-x-2 text-xs font-mono uppercase text-gray-600 dark:text-gray-400 font-bold">
        <Share2 className="w-4 h-4 text-[#f7413e]" />
        <span>Share this story</span>
      </div>

      <div className="flex items-center space-x-2">
        {/* X / Twitter */}
        <button
          onClick={() => handleShare('twitter')}
          className="p-2 rounded bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-black dark:text-white transition-colors"
          title="Share on X"
          aria-label="Share on X"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </button>

        {/* Facebook */}
        <button
          onClick={() => handleShare('facebook')}
          className="p-2 rounded bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-black dark:text-white transition-colors"
          title="Share on Facebook"
          aria-label="Share on Facebook"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.82 0-1.667.125-2.023.518-.577.636-.513 1.543-.513 2.529v1.01h4.08l-.545 3.667h-3.535v7.98c7.172-.89 12.686-7.009 12.686-14.417C24 4.298 18.627-1.074 12-1.074S0 4.298 0 10.922c0 7.408 5.514 13.527 12.686 14.417z" />
          </svg>
        </button>

        {/* LinkedIn */}
        <button
          onClick={() => handleShare('linkedin')}
          className="p-2 rounded bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-black dark:text-white transition-colors"
          title="Share on LinkedIn"
          aria-label="Share on LinkedIn"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
          </svg>
        </button>

        {/* Copy Link Button: Crisp dark in Dark mode, clean gray in Light mode */}
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-gray-100 hover:bg-black hover:text-white dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:hover:text-white text-xs font-mono transition-all text-black dark:text-white border border-gray-300 dark:border-neutral-600 shadow-sm"
          title="Copy Story Link"
          aria-label="Copy Story Link"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-500 font-bold" />
              <span className="font-semibold text-green-600 dark:text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <LinkIcon className="w-3.5 h-3.5 text-gray-700 dark:text-gray-300" />
              <span className="font-medium text-black dark:text-white">Copy Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
