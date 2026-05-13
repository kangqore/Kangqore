import React from 'react';
import { Link } from 'react-router-dom';

const DEFAULTS = {
  BOOK_CONSULTATION: { label: 'Book a Consultation', href: '/contact?intent=consultation' },
  CONTACT_SALES: { label: 'Talk to Sales', href: '/contact?intent=sales' },
  REQUEST_PROPOSAL: { label: 'Request a Proposal', href: '/contact?intent=proposal' },
  DOWNLOAD_ASSET: { label: 'Download', href: '#' },
  SUBSCRIBE: { label: 'Subscribe', href: '/newsletter' },
  APPLY: { label: 'Apply', href: '/careers' },
};

const CtaButton = ({ kind = 'BOOK_CONSULTATION', label, href, className = '' }) => {
  const config = DEFAULTS[kind] || DEFAULTS.BOOK_CONSULTATION;
  const finalLabel = label || config.label;
  const finalHref = href || config.href;

  const onClick = () => {
    fetch('/api/kangqore-vis/sxo/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: window.location.pathname,
        ctaKind: kind,
      }),
      keepalive: true,
    }).catch(() => {});
  };

  return (
    <Link
      to={finalHref}
      onClick={onClick}
      className={
        className ||
        'inline-flex items-center px-6 py-3 rounded-md bg-brand-blue text-white font-medium hover:bg-brand-blue/90 transition-colors'
      }
      data-kangqore-vis-cta={kind}
    >
      {finalLabel}
    </Link>
  );
};

export default CtaButton;
