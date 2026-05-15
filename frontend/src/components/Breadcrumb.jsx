// ─── Breadcrumb (Phase D) ──────────────────────────────────────────────────────
// Renders the visible breadcrumb trail used by DepartmentPage and ServicePage.
//
// Trail formats:
//   Service page:    Home › Departments › COGNITION › Agentic AI
//   Department page: Home › Departments › COGNITION
//
// Even though service URLs are FLAT (/services/<slug>), the breadcrumb
// resolves the canonical parent department via servicesData.departmentSlug.
// This is the flat-URL trade-off cashed in: shorter URLs, deeper breadcrumbs.
//
// See plan Section 21.6 for the strategy.
// ────────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

/**
 * @param {Array<{ name: string, href?: string }>} items
 *   Last item is the current page (rendered as plain text, no href).
 */
const Breadcrumb = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex items-center flex-wrap gap-1"
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <React.Fragment key={`${item.name}-${i}`}>
            {isLast || !item.href ? (
              <span className="text-gray-700 dark:text-gray-200" aria-current={isLast ? 'page' : undefined}>
                {item.name}
              </span>
            ) : (
              <Link to={item.href} className="hover:text-brand-blue hover:underline">
                {item.name}
              </Link>
            )}
            {!isLast && (
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 mx-0.5" aria-hidden="true" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
