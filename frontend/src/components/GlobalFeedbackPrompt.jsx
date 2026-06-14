import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowRight } from 'lucide-react';

const nthWeekday = (year, month, weekday, n) => {
  // Find the nth occurrence of a weekday (0=Sun) in a given month (0-indexed)
  const first = new Date(year, month, 1).getDay();
  const offset = (weekday - first + 7) % 7;
  return offset + 1 + (n - 1) * 7;
};

const getSmartContext = () => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    const now = new Date();
    const local = new Date(now.toLocaleString('en-US', { timeZone: tz }));
    const hour  = local.getHours();
    const month = local.getMonth() + 1; // 1–12
    const day   = local.getDate();
    const wday  = local.getDay();       // 0=Sun … 6=Sat
    const year  = local.getFullYear();

    // Region flags — for regional holiday logic only, never shown to visitor
    const isIndia     = /Kolkata|Calcutta/.test(tz);
    const isUS        = tz.startsWith('America/');
    const isUK        = tz.includes('London');
    const isIreland   = tz.includes('Dublin');
    const isAustralia = tz.startsWith('Australia/');
    const isCanada    = /Toronto|Vancouver|Montreal|Winnipeg|Halifax|Regina/.test(tz);
    const isJapan     = tz.includes('Tokyo');
    const isGermany   = tz.includes('Berlin');
    const isFrance    = tz.includes('Paris');
    const isChina     = /Shanghai|Beijing|Chongqing|Harbin|Urumqi/.test(tz);
    const isSG        = tz.includes('Singapore');

    // Time greeting
    let timeGreeting;
    if      (hour >= 5  && hour < 12) timeGreeting = 'Good morning';
    else if (hour >= 12 && hour < 17) timeGreeting = 'Good afternoon';
    else if (hour >= 17 && hour < 21) timeGreeting = 'Good evening';
    else                               timeGreeting = 'Hello there';

    // ── Floating holidays (computed) ────────────────────────────────────────
    const floatingMatches = [];

    // US MLK Day — 3rd Monday of January
    if (isUS && month === 1 && day === nthWeekday(year, 0, 1, 3))
      floatingMatches.push({ note: "Happy Martin Luther King Jr. Day!", sub: "A day to celebrate courage and progress." });

    // US Presidents' Day — 3rd Monday of February
    if (isUS && month === 2 && day === nthWeekday(year, 1, 1, 3))
      floatingMatches.push({ note: "Happy Presidents' Day!", sub: "Hope you're enjoying the long weekend." });

    // US Memorial Day — last Monday of May
    if (isUS && month === 5) {
      const lastMonday = [nthWeekday(year, 4, 1, 5), nthWeekday(year, 4, 1, 4)].find(d => d <= 31);
      if (day === lastMonday)
        floatingMatches.push({ note: "Happy Memorial Day!", sub: "Grateful for those who served." });
    }

    // US Labor Day — 1st Monday of September
    if (isUS && month === 9 && day === nthWeekday(year, 8, 1, 1))
      floatingMatches.push({ note: "Happy Labor Day!", sub: "Here's to the people who keep the world moving." });

    // US Thanksgiving — 4th Thursday of November
    if (isUS && month === 11 && day === nthWeekday(year, 10, 4, 4))
      floatingMatches.push({ note: "Happy Thanksgiving! 🦃", sub: "Grateful for visitors like you." });

    // Canada Thanksgiving — 2nd Monday of October
    if (isCanada && month === 10 && day === nthWeekday(year, 9, 1, 2))
      floatingMatches.push({ note: "Happy Thanksgiving! 🍁", sub: "Grateful you stopped by today." });

    // Mother's Day — 2nd Sunday of May (US/CA/AU/IN)
    if ((isUS || isCanada || isAustralia || isIndia) && month === 5 && day === nthWeekday(year, 4, 0, 2))
      floatingMatches.push({ note: "Happy Mother's Day! 💐", sub: "A warm hello on a day worth celebrating." });

    // Father's Day — 3rd Sunday of June (US/CA/UK)
    if ((isUS || isCanada || isUK) && month === 6 && day === nthWeekday(year, 5, 0, 3))
      floatingMatches.push({ note: "Happy Father's Day! 👔", sub: "Hope today is a good one." });

    // UK / Australia / Canada — Boxing Day (Dec 26)
    if ((isUK || isAustralia || isCanada) && month === 12 && day === 26)
      floatingMatches.push({ note: "Happy Boxing Day!", sub: "Hope you're enjoying the holiday." });

    // India — Holi (hardcoded for upcoming years)
    const holiDates = { 2024: '3-25', 2025: '3-14', 2026: '3-13', 2027: '3-2' };
    if (isIndia && holiDates[year] === `${month}-${day}`)
      floatingMatches.push({ note: "Happy Holi! 🎨", sub: "May your day be as colourful as it gets." });

    // India — Diwali (hardcoded)
    const diwaliDates = { 2024: '11-1', 2025: '10-20', 2026: '11-8', 2027: '10-29' };
    if (isIndia && diwaliDates[year] === `${month}-${day}`)
      floatingMatches.push({ note: "Happy Diwali! 🪔", sub: "May this festival of lights bring you joy and prosperity." });

    // India — Dussehra
    const dussehraDateMap = { 2024: '10-12', 2025: '10-2', 2026: '10-21', 2027: '10-11' };
    if (isIndia && dussehraDateMap[year] === `${month}-${day}`)
      floatingMatches.push({ note: "Happy Dussehra! 🏹", sub: "Celebrating the victory of good — from all of us at Kangqore." });

    // Lunar New Year (approx — varies by year)
    const lunarNY = { 2024: '2-10', 2025: '1-29', 2026: '2-17', 2027: '2-6' };
    if ((isChina || isSG) && lunarNY[year] === `${month}-${day}`)
      floatingMatches.push({ note: "Happy Lunar New Year! 🧧", sub: "Wishing you prosperity, health, and good fortune." });

    // ── Fixed-date holidays ──────────────────────────────────────────────────
    const key = `${month}-${day}`;

    const fixedHolidays = {
      '1-1':  { note: "Happy New Year! 🎉", sub: "Wishing you a year full of growth and breakthroughs." },
      '1-26': isIndia     ? { note: "Happy Republic Day! 🇮🇳", sub: "Proud to be building from the land of a billion possibilities." }
            : isAustralia ? { note: "Happy Australia Day! 🇦🇺", sub: "Thanks for dropping by today." }
            : null,
      '2-14': { note: "Happy Valentine's Day! 💙", sub: "Sending warm wishes from the Kangqore team." },
      '3-8':  { note: "Happy International Women's Day! 💜", sub: "Celebrating the people who move the world forward." },
      '3-17': (isUK || isIreland || isUS) ? { note: "Happy St. Patrick's Day! ☘️", sub: "A little luck to brighten your day." } : null,
      '4-1':  { note: "April Fools' Day! 😄", sub: "No tricks from us — just a genuine hello." },
      '4-7':  { note: "World Health Day! 🌿", sub: "Here's to building a healthier, smarter world." },
      '4-14': isIndia ? { note: "Happy Ambedkar Jayanti! 🙏", sub: "Honouring a vision of equality and progress." } : null,
      '4-22': { note: "Happy Earth Day! 🌍", sub: "Building a smarter, more efficient future — for everyone." },
      '5-1':  (!isUS && !isCanada) ? { note: "Happy Labour Day! ✊", sub: "Here's to the people who keep the world moving." } : null,
      '6-1':  { note: "Happy International Children's Day! 🧒", sub: "Building technology for a better tomorrow." },
      '6-5':  { note: "World Environment Day! 🌱", sub: "Committed to building technology that lasts." },
      '6-21': isIndia ? { note: "Happy International Yoga Day! 🧘", sub: "Wishing you balance and clarity today." } : null,
      '7-1':  isCanada ? { note: "Happy Canada Day! 🍁", sub: "Celebrating with you from across the globe." } : null,
      '7-4':  isUS ? { note: "Happy Independence Day! 🇺🇸", sub: "Hope you're celebrating well today." } : null,
      '7-14': isFrance ? { note: "Joyeux 14 Juillet! 🇫🇷", sub: "Bonne fête nationale from the Kangqore team." } : null,
      '8-9':  isSG ? { note: "Happy National Day, Singapore! 🇸🇬", sub: "Celebrating with you from across the globe." } : null,
      '8-15': isIndia ? { note: "Happy Independence Day! 🇮🇳", sub: "Proud to be building from India." } : null,
      '9-5':  isIndia ? { note: "Happy Teachers' Day! 📚", sub: "Honouring everyone who shares knowledge generously." } : null,
      '10-2': isIndia ? { note: "Happy Gandhi Jayanti! 🕊️", sub: "Remembering a vision of truth and courage." } : null,
      '10-3': isGermany ? { note: "Happy German Unity Day! 🇩🇪", sub: "Tag der Deutschen Einheit — a great day to say hello." } : null,
      '10-10':{ note: "World Mental Health Day! 🧠", sub: "Take a breath — we appreciate you stopping by." },
      '11-3': isJapan ? { note: "Happy Culture Day! 🇯🇵", sub: "文化の日おめでとうございます。" } : null,
      '11-5': isUK ? { note: "Remember, remember! 🎆", sub: "Happy Guy Fawkes Night from the Kangqore team." } : null,
      '11-11':{ note: "Remembrance Day 🎖️", sub: "Grateful for those who served." },
      '12-24':{ note: "Happy Christmas Eve! 🎄", sub: "Hope the season brings you warmth and joy." },
      '12-25':{ note: "Merry Christmas! 🎄", sub: "Thank you for stopping by on a special day." },
      '12-31':{ note: "Happy New Year's Eve! 🥂", sub: "What a year — here's to the next one." },
    };

    const fixedMatch = fixedHolidays[key] || null;
    const celebration = floatingMatches[0] || fixedMatch;

    // ── All 7 days fallback ─────────────────────────────────────────────────
    const dayContextMap = {
      0: "Hope you're having a restful Sunday.",
      1: "Hope your week is off to a great start.",
      2: "Happy Tuesday — glad you stopped by.",
      3: "Midweek already — thanks for visiting.",
      4: "Almost Friday! Appreciate you being here.",
      5: "Happy Friday — hope it's a good one.",
      6: "Hope your Saturday is going brilliantly.",
    };

    const lateNight = (hour >= 22 || hour < 5)
      ? "Burning the midnight oil? We appreciate the dedication."
      : null;

    const dayContext = lateNight || (!celebration ? dayContextMap[wday] : null);

    return { timeGreeting, celebration, dayContext };
  } catch {
    return { timeGreeting: 'Hello', celebration: null, dayContext: null };
  }
};

const GlobalFeedbackPrompt = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const ctx = useMemo(() => getSmartContext(), []);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 90000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => setVisible(true), 180000);
  };

  if (!visible) return null;

  const greeting = `${ctx.timeGreeting}!`;

  const bodyNote = ctx.celebration
    ? `${ctx.celebration.note} ${ctx.celebration.sub}`
    : ctx.dayContext || null;

  const feedbackLine = ctx.celebration
    ? "While you're here — how are we doing? We read every message."
    : "How are we doing? Share your thoughts on our website, services, or recommendations — we read every message.";

  return (
    <div className="fixed bottom-6 right-6 z-[99998] w-72 animate-fade-in-up">
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          border: '1px solid #3a3a3e',
          boxShadow: [
            'inset 0 1px 0 rgba(255,255,255,0.10)',
            'inset 0 -1px 0 rgba(0,0,0,0.70)',
            'inset 1px 0 0 rgba(255,255,255,0.04)',
            '0 1px 0 rgba(255,255,255,0.06)',
            '0 4px 8px rgba(0,0,0,0.55)',
            '0 12px 24px rgba(0,0,0,0.50)',
            '0 32px 56px rgba(0,0,0,0.40)',
          ].join(', '),
        }}
      >
        {/* Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src="/images/capabilities/agentic-governed-autonomy.png"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 z-[1]" />
          <div className="absolute inset-x-0 top-0 h-1/2 z-[2]" style={{ background: 'linear-gradient(180deg,rgba(0,0,0,0.75) 0%,rgba(0,0,0,0.45) 45%,rgba(0,0,0,0) 100%)' }} />
        </div>

        {/* Sheen */}
        <div
          className="absolute inset-0 pointer-events-none z-[3]"
          style={{ background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(255,255,255,0.06) 0%, transparent 100%)' }}
        />

        {/* Top bar */}
        <div
          className="relative z-10 flex items-center justify-between px-4 pt-4 pb-3"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9 drop-shadow-md flex-shrink-0">
              <path d="M 2 12 A 10 10 0 1 1 7.3 20.7 L 2 22 L 3.3 16.7 A 10 10 0 0 1 2 12 Z" fill="#4fa9d8" />
              <path d="M 13 17 A 7 7 0 1 1 24.9 21.9 L 28 25 L 22.3 23.6 A 7 7 0 0 1 13 17 Z" fill="#ffffff" />
              <circle cx="16.5" cy="17" r="1.4" fill="#04588e" />
              <circle cx="20" cy="17" r="1.4" fill="#04588e" />
              <circle cx="23.5" cy="17" r="1.4" fill="#04588e" />
            </svg>
            <span className="text-sm font-bold text-white leading-tight">{greeting}</span>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-md text-gray-300 hover:text-white transition flex-shrink-0"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="relative z-10 px-4 py-4 flex flex-col gap-3">
          {bodyNote && (
            <p className="text-xs text-cyan-300/80 leading-relaxed font-semibold drop-shadow-md">
              {bodyNote}
            </p>
          )}
          <p className="text-xs text-gray-200 leading-relaxed font-medium drop-shadow-md">
            {feedbackLine}
          </p>
          <button
            onClick={() => { setVisible(false); navigate('/contact#send-message'); }}
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-cyan hover:text-white transition-colors duration-200 group drop-shadow-md"
          >
            <span>Share your feedback</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalFeedbackPrompt;
