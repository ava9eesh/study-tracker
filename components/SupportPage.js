'use client';

import { useState } from 'react';

export default function SupportPage() {
  const [amount, setAmount] = useState('50');
  const [isCustom, setIsCustom] = useState(false);
  const [paymentType, setPaymentType] = useState('one-time'); // 'one-time' or 'monthly'

  const upiId = 'sendavaneeshzandubam@fam';

  const presetAmounts = ['20', '50', '100', '200', '500'];

  const handleDonate = () => {
    // Generate UPI payment link
    const upiLink = `upi://pay?pa=${upiId}&pn=Study%20Tracker&am=${amount}&cu=INR&tn=Support%20Study%20Tracker`;
    
    // Try to open UPI app
    window.location.href = upiLink;
    
    // Fallback: Show UPI ID for manual payment
    setTimeout(() => {
      alert(`UPI ID: ${upiId}\nAmount: ₹${amount}\n\nIf the app didn't open, use this UPI ID to pay manually.`);
    }, 1000);
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    alert('UPI ID copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 py-12 px-6 text-center relative overflow-hidden">
        {/* Decorative wings (like Lichess) */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 opacity-20">
          <svg width="80" height="80" viewBox="0 0 100 100" fill="white">
            <path d="M20,50 Q30,20 40,30 Q45,35 40,40 Q35,45 30,40 Q25,35 20,50 M25,50 Q32,28 38,35 Q40,38 38,42 Q35,45 30,42 Q27,38 25,50" />
          </svg>
        </div>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20 transform scale-x-[-1]">
          <svg width="80" height="80" viewBox="0 0 100 100" fill="white">
            <path d="M20,50 Q30,20 40,30 Q45,35 40,40 Q35,45 30,40 Q25,35 20,50 M25,50 Q32,28 38,35 Q40,38 38,42 Q35,45 30,42 Q27,38 25,50" />
          </svg>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">
          Free education for everyone, forever!
        </h1>
        <p className="text-lg md:text-xl text-slate-800">
          No ads, no subscriptions; but open-source and passion.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-8">
        {/* Left Column - Message */}
        <div className="space-y-6 text-slate-300">
          <div className="space-y-4">
            <p className="text-lg leading-relaxed">
              I'm a student who believes everyone should have access to a free, 
              high-quality study tracking platform.
            </p>
            
            <p className="text-lg leading-relaxed">
              I rely on support from people like you to make it possible. 
              If you enjoy using Study Tracker, please consider supporting me 
              by donating and helping keep this project alive! 🚀
            </p>

            <p className="text-base leading-relaxed text-slate-400 italic">
              Click donate to send payment via UPI based on your device.
            </p>
          </div>

          <div className="pt-8 border-t border-slate-700">
            <p className="text-sm text-slate-400 italic text-center">
              I'm a small team (just me lol), so your support makes a huge difference! ❤️
            </p>
          </div>
        </div>

        {/* Right Column - Donation Form */}
        <div className="space-y-6">
          {/* Donation Options */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
            <button 
              onClick={copyUpiId}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 mb-4 shadow-lg shadow-emerald-500/20"
            >
              💚 Donate as Avaneesh
            </button>

            <button 
              className="w-full bg-slate-700/50 hover:bg-slate-700 text-slate-300 font-medium py-3 px-6 rounded-xl transition-all duration-200 border border-slate-600"
            >
              🎁 Send a coffee ☕
            </button>
          </div>

          {/* Payment Type Toggle */}
          <div className="flex gap-2 bg-slate-800/50 p-2 rounded-xl">
            <button
              onClick={() => setPaymentType('one-time')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                paymentType === 'one-time'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              One-time
            </button>
            <button
              onClick={() => setPaymentType('monthly')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                paymentType === 'monthly'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ✓ Monthly
            </button>
          </div>

          {/* Amount Selection */}
          <div className="grid grid-cols-3 gap-3">
            {presetAmounts.map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setAmount(preset);
                  setIsCustom(false);
                }}
                className={`py-4 px-4 rounded-xl font-semibold transition-all ${
                  amount === preset && !isCustom
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600'
                }`}
              >
                ₹{preset}
              </button>
            ))}
            
            <button
              onClick={() => setIsCustom(true)}
              className={`col-span-3 py-4 px-4 rounded-xl font-semibold transition-all ${
                isCustom
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600'
              }`}
            >
              Other
            </button>
          </div>

          {/* Custom Amount Input */}
          {isCustom && (
            <div className="animate-fadeIn">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full bg-slate-700/50 border border-slate-600 text-white text-lg py-4 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Processing Fee Notice */}
          <div className="flex items-start gap-3 text-sm text-slate-400">
            <input type="checkbox" className="mt-1" defaultChecked />
            <p>
              I'll add ₹{Math.ceil(Number(amount) * 0.02)} to help cover UPI processing costs
            </p>
          </div>

          {/* Donate Button */}
          <button
            onClick={handleDonate}
            disabled={!amount || Number(amount) <= 0}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold text-lg py-5 px-6 rounded-xl transition-all duration-200 shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 disabled:shadow-none"
          >
            DONATE ₹{amount || '0'}
          </button>

          {/* UPI ID Display */}
          <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
            <p className="text-xs text-slate-500 mb-1">UPI ID:</p>
            <div className="flex items-center justify-between gap-3">
              <code className="text-emerald-400 font-mono text-sm">
                {upiId}
              </code>
              <button
                onClick={copyUpiId}
                className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1.5 rounded-lg transition-colors"
              >
                Copy
              </button>
            </div>
          </div>

          {/* Alternative Payment Methods */}
          <details className="text-sm text-slate-400">
            <summary className="cursor-pointer hover:text-white transition-colors">
              Other payment methods
            </summary>
            <div className="mt-3 space-y-2 pl-4 text-slate-500">
              <p>• Paytm: {upiId}</p>
              <p>• Google Pay: {upiId}</p>
              <p>• PhonePe: {upiId}</p>
              <p>• Any UPI app: {upiId}</p>
            </div>
          </details>
        </div>
      </div>

      {/* Footer Message */}
      <div className="text-center pb-12 px-6">
        <p className="text-slate-400 text-sm">
          Thank you for supporting open education! 🙏
        </p>
      </div>
    </div>
  );
}
