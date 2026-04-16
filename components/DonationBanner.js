'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DonationBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative">
      {/* Floating Donation Banner */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-400/10 to-yellow-400/10 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-6 mb-6 relative overflow-hidden">
        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="hidden sm:block">
            <div className="bg-emerald-500/20 p-3 rounded-xl">
              <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
          </div>

          {/* Text */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">
              Want to support me? ☕
            </h3>
            <p className="text-sm text-slate-300">
              Help keep Study Tracker free and ad-free forever! Your support means the world 🌟
            </p>
          </div>

          {/* CTA Button */}
          <Link 
            href="/support"
            className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105"
          >
            Donate 💚
          </Link>
        </div>
      </div>
    </div>
  );
}

// Alternative: Small floating button version
export function FloatingDonateButton() {
  return (
    <Link
      href="/support"
      className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold px-6 py-4 rounded-full shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/60 transition-all duration-200 hover:scale-110 flex items-center gap-2 group"
    >
      <svg className="w-5 h-5 group-hover:animate-pulse" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
      </svg>
      <span className="hidden sm:inline">Support</span>
    </Link>
  );
}

// Minimal version for navbar
export function NavDonateButton() {
  return (
    <Link
      href="/support"
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 transition-all duration-200 group"
    >
      <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
      </svg>
      <span className="font-medium">Donate</span>
    </Link>
  );
}
