import { useState, useRef, useEffect } from 'react'
import { ChevronDown, ArrowRight, Sparkles, LogOut } from 'lucide-react'
import { useAuthStore } from '@store/auth'

// ── Nav data ───────────────────────────────────────────────────────────────────
// All links are plain <a href> so they cross back into the CRA main website.

const WHO_WE_ARE = [
  { name: 'About Us',        path: '/about-us'        },
  { name: 'Values & Culture',path: '/values'          },
  { name: 'Leadership',      path: '/leadership'      },
  { name: 'Partners',        path: '/partners'        },
  { name: 'Testimonials',    path: '/testimonials'    },
  { name: 'eQORE AI',        path: '/eqore'           },
  { name: 'Careers',         path: '/careers'         },
  { name: 'Location',        path: '/location'        },
  { name: 'Community',       path: '/communities'     },
  { name: 'Brand Identity',  path: '/brand-identity'  },
]

const INDUSTRIES = [
  { name: 'Banking & Finance',      path: '/industries/banking'             },
  { name: 'Insurance',              path: '/industries/insurance'           },
  { name: 'EdTech',                 path: '/industries/edtech'              },
  { name: 'Healthcare',             path: '/industries/healthcare'          },
  { name: 'Life Science',           path: '/industries/life-science'        },
  { name: 'Media Technology',       path: '/industries/media-technology'    },
  { name: 'Retail',                 path: '/industries/retail'              },
  { name: 'Travel & Hospitality',   path: '/industries/travel-hospitality'  },
  { name: 'Energy & Utilities',     path: '/industries/energy-utilities'    },
  { name: 'Manufacturing',          path: '/industries/manufacturing'       },
  { name: 'Information Services',   path: '/industries/information-services'},
  { name: 'Consumer Goods',         path: '/industries/consumer-goods'      },
]

const INSIGHTS = [
  { name: 'Blogs',        path: '/blogs'       },
  { name: 'Case Studies', path: '/case-studies'},
  { name: 'Brochures',    path: '/brochures'   },
  { name: 'Podcasts',     path: '/podcast'     },
  { name: 'Events',       path: '/events'      },
  { name: 'White Papers', path: '/white-paper' },
]

const NAV_ITEMS = [
  { id: 'services',    label: 'What We Do',  href: '/services',  items: null       },
  { id: 'who-we-are',  label: 'Who We Are',  href: null,          items: WHO_WE_ARE  },
  { id: 'industries',  label: 'Industries',  href: null,          items: INDUSTRIES  },
  { id: 'insights',    label: 'Insights',    href: null,          items: INSIGHTS    },
]

// ── Component ──────────────────────────────────────────────────────────────────

export function SiteNav() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const { user, logout } = useAuthStore()
  const navRef = useRef<HTMLDivElement>(null)

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setActiveDropdown(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-[10000] pointer-events-none"
    >
      {/* ── Utility bar ── */}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 pointer-events-auto mt-3">
        <div className="hidden lg:flex justify-end items-center h-8 px-4 gap-5 text-[13px] font-medium text-slate-500">
          {[
            { label: 'Careers',     href: '/careers'     },
            { label: 'News',        href: '/news'        },
            { label: 'Communities', href: '/communities' },
            { label: 'Investors',   href: '/investors'   },
          ].map(link => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}

          {user && (
            <>
              <span className="w-px h-3.5 bg-slate-300" />
              <span className="text-slate-300 font-semibold">{user.name}</span>
              <button
                onClick={logout}
                className="flex items-center gap-1 text-slate-500 hover:text-red-500 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Main pill nav ── */}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 pointer-events-auto mt-1">
        <div className="backdrop-blur-[14px] rounded-full border border-black/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.07)] bg-os-s1/60 flex items-center justify-between h-16 lg:h-[4.5rem] px-5 lg:px-7">

          {/* Logo */}
          <a href="/" className="flex items-center shrink-0 group">
            <img
              src="https://customer-assets.emergentagent.com/job_cog-site-clone/artifacts/focgf8oz_Logo%2BText.png"
              alt="Kangqore"
              className="h-16 lg:h-[5.5rem] -ml-1 brightness-0 group-hover:opacity-75 transition-opacity"
            />
          </a>

          {/* Nav links pill */}
          <nav className="hidden lg:flex items-center gap-1 rounded-full px-4 py-1 bg-os-s1/80 border border-white/30 shadow-sm backdrop-blur-md">
            {NAV_ITEMS.map(item => (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => item.items && setActiveDropdown(item.id)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.href ? (
                  <a
                    href={item.href}
                    className="flex items-center gap-1 px-4 py-2 text-[14px] font-bold text-gray-800 hover:text-blue-600 transition-colors rounded-full hover:bg-slate-900"
                  >
                    {item.label}
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </a>
                ) : (
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                    className="flex items-center gap-1 px-4 py-2 text-[14px] font-bold text-gray-800 hover:text-blue-600 transition-colors rounded-full hover:bg-slate-900"
                  >
                    {item.label}
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${activeDropdown === item.id ? 'rotate-180 text-blue-500' : ''}`} />
                  </button>
                )}

                {/* Dropdown panel */}
                {item.items && activeDropdown === item.id && (
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-os-s1/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-5 min-w-[280px] pointer-events-auto"
                    style={{ animation: 'siteNavFadeIn 0.2s cubic-bezier(0.16,1,0.3,1)' }}
                    onMouseEnter={() => setActiveDropdown(item.id)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <style>{`
                      @keyframes siteNavFadeIn {
                        from { opacity: 0; transform: translateX(-50%) translateY(6px) scale(0.97); }
                        to   { opacity: 1; transform: translateX(-50%) translateY(0)   scale(1);    }
                      }
                    `}</style>
                    <div className={`grid gap-1 ${item.items.length > 6 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                      {item.items.map(link => (
                        <a
                          key={link.path}
                          href={link.path}
                          className="group flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all"
                        >
                          {link.name}
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-blue-400" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2.5">
            {/* Ask eQORE AI */}
            <a
              href="/eqore-ai"
              className="group relative hidden lg:inline-flex items-center justify-center rounded-full px-5 py-2 overflow-hidden border border-white/20 shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_30px_rgba(37,100,234,0.3)] transition-all duration-300 hover:scale-[1.04]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#1e3a8a] via-[#2564ea] to-[#06b6d4] animate-[gradientShift_4s_ease_infinite_alternate] bg-[length:200%_200%]" />
              <style>{`
                @keyframes gradientShift {
                  0%   { background-position: 0%   50%; }
                  100% { background-position: 100% 50%; }
                }
              `}</style>
              <span className="relative z-10 flex items-center gap-1.5 text-[13px] font-black text-white tracking-wide">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                Ask eQORE AI
              </span>
            </a>

            {/* Contact Us */}
            <a
              href="/contact"
              className="hidden lg:flex items-center gap-1.5 px-5 py-2 bg-gray-900 text-white rounded-full font-black text-[13px] hover:bg-gray-700 hover:scale-[1.04] transition-all shadow-md"
            >
              Contact Us
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
