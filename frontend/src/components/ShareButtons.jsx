import React from 'react';
import { Share2, Link as LinkIcon, Twitter, Facebook, Linkedin, Mail } from 'lucide-react';
import axios from 'axios';

const SHARE_PLATFORMS = [
  { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-[#0077B5] hover:bg-[#0077B5]/10' },
  { key: 'twitter', label: 'Twitter', icon: Twitter, color: 'text-[#1DA1F2] hover:bg-[#1DA1F2]/10' },
  { key: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-[#4267B2] hover:bg-[#4267B2]/10' },
  { key: 'email', label: 'Email', icon: Mail, color: 'text-[#EA4335] hover:bg-[#EA4335]/10' },
  { key: 'copy', label: 'Copy Link', icon: LinkIcon, color: 'text-gray-600 hover:bg-gray-100' }
];

const ShareButtons = ({ contentId, title, url }) => {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050';

  const trackShare = async (platform) => {
    if (!contentId) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BACKEND_URL}/api/admin/content/track/share`, {
        contentId,
        platform
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
    } catch (error) {
      console.error('Error tracking share:', error);
    }
  };

  const handleShare = (platform) => {
    trackShare(platform.key);
    
    // Share Logic
    const encodedUrl = encodeURIComponent(url || window.location.href);
    const encodedTitle = encodeURIComponent(title || '');

    switch (platform.key) {
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:?subject=${encodedTitle}&body=${encodedUrl}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url || window.location.href);
        alert('Link copied to clipboard!');
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-gray-500 mr-2 flex items-center gap-1">
        <Share2 className="w-4 h-4" /> Share:
      </span>
      {SHARE_PLATFORMS.map((platform) => {
        const Icon = platform.icon;
        return (
          <button
            key={platform.key}
            onClick={() => handleShare(platform)}
            className={`p-2 rounded-full transition-colors ${platform.color}`}
            title={`Share on ${platform.label}`}
          >
            <Icon className="w-5 h-5" />
          </button>
        );
      })}
    </div>
  );
};

export default ShareButtons;
