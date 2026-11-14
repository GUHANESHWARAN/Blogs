import React, { useState } from 'react';
import { Twitter, Linkedin, Facebook, Link2, Check } from 'lucide-react';

export default function ShareButtons({ title, url }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareLinkedin = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  return (
    <div className="sticky-share">
      <button onClick={shareTwitter} className="share-btn" title="Share on Twitter" aria-label="Share on Twitter">
        <Twitter size={17} />
      </button>
      <button onClick={shareLinkedin} className="share-btn" title="Share on LinkedIn" aria-label="Share on LinkedIn">
        <Linkedin size={17} />
      </button>
      <button onClick={shareFacebook} className="share-btn" title="Share on Facebook" aria-label="Share on Facebook">
        <Facebook size={17} />
      </button>
      <button onClick={handleCopy} className="share-btn" title="Copy Link" aria-label="Copy Link">
        {copied ? <Check size={17} color="#16a34a" /> : <Link2 size={17} />}
      </button>
    </div>
  );
}
