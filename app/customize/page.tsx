'use client'

import { useState } from 'react'
import { Zap, Check, ChevronRight } from 'lucide-react'

const kitTypes = ['Match Jersey', 'Full Kit (Jersey + Shorts)', 'Goalkeeper Kit', 'Tracksuit', 'Polo']
const sports = ['Football', 'Cricket', 'Kabaddi', 'Basketball', 'Running']
const colorOptions = ['#e8162a', '#1a56db', '#047857', '#d97706', '#7c3aed', '#0891b2', '#111827', '#ffffff']

export default function CustomizePage() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    kitType: 'Match Jersey',
    sport: 'Football',
    qty: '10',
    primaryColor: '#e8162a',
    secondaryColor: '#111827',
    teamName: '',
    hasNumbers: true,
    hasNames: true,
    hasBadge: false,
    hasSponsor: false,
    contactName: '',
    contactPhone: '',
    contactCity: '',
    notes: '',
  })

  const update = (key: string, val: string | boolean) => setForm(prev => ({ ...prev, [key]: val }))

  const handleSubmit = async () => {
    // Client-side validation
    if (!form.contactName.trim() || !form.contactPhone.trim()) {
      alert('Please fill in your name and phone number')
      return
    }
    
    setSubmitting(true)
    try {
      const response = await fetch('/api/submitCustomization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      
      if (!response.ok) {
        const error = await response.text()
        throw new Error(error || 'Failed to submit customization request')
      }
      
      setSubmitted(true)
    } catch (error: any) {
      alert(`Error: ${error?.message || 'Failed to submit request'}`)
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = "w-full bg-[#111] border border-white/8 px-4 py-3.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-red-500/50 transition-colors"
  const labelClass = "block text-[10px] tracking-widest uppercase text-white/35 font-semibold mb-2"

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center px-6 pt-20">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-500 flex items-center justify-center mx-auto mb-8 animate-glow-pulse">
            <Check size={36} className="text-white" strokeWidth={3} />
          </div>
          <h1 className="font-display font-900 text-5xl uppercase text-white mb-4">Order Sent!</h1>
          <p className="text-white/50 leading-relaxed mb-8">
            We've received your customization request. Our team will call you within <span className="text-red-400 font-semibold">2 hours</span> to confirm the design and pricing.
          </p>
          <div className="bg-[#111] border border-white/5 p-6 text-left mb-8 space-y-3">
            <div className="flex justify-between text-sm"><span className="text-white/40">Kit Type</span><span className="text-white">{form.kitType}</span></div>
            <div className="flex justify-between text-sm"><span className="text-white/40">Quantity</span><span className="text-white">{form.qty} pcs</span></div>
            <div className="flex justify-between text-sm"><span className="text-white/40">Team</span><span className="text-white">{form.teamName || 'Not specified'}</span></div>
          </div>
          <a href="/" className="inline-flex items-center gap-3 bg-red-500 text-white px-8 py-4 font-display font-700 text-sm tracking-widest uppercase hover:bg-red-600 transition-all">
            Back to Home <ChevronRight size={16} />
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#080808] pt-20">
      {/* Header */}
      <div className="border-b border-white/5 px-6 lg:px-8 py-12 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto">
          <p className="text-red-500 text-xs tracking-[0.3em] uppercase font-semibold mb-3">Design Studio</p>
          <h1 className="font-display font-900 text-5xl lg:text-7xl uppercase text-white leading-tight">
            Customize<br /><span className="text-red-500">Your Kit</span>
          </h1>
          <p className="text-white/40 mt-4 max-w-lg">Fill in your requirements and we'll get back with a quote within 2 hours. All orders fully sublimated — colors never fade.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-12">
          {[1, 2, 3].map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`flex items-center gap-2.5 px-4 py-2 text-xs tracking-widest uppercase font-semibold transition-all ${step >= s ? 'text-white' : 'text-white/25'}`}>
                <span className={`w-6 h-6 flex items-center justify-center text-[10px] font-bold transition-all ${step > s ? 'bg-green-600' : step === s ? 'bg-red-500' : 'bg-white/10'} text-white`}>
                  {step > s ? <Check size={11} /> : s}
                </span>
                {['Kit Details', 'Design', 'Contact'][i]}
              </div>
              {i < 2 && <div className={`w-8 h-px transition-all ${step > s ? 'bg-red-500' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        {/* Step 1 — Kit details */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Kit Type</label>
                <div className="space-y-2">
                  {kitTypes.map((k) => (
                    <button key={k} onClick={() => update('kitType', k)}
                      className={`w-full text-left px-4 py-3 text-sm border transition-all ${form.kitType === k ? 'border-red-500 bg-red-500/10 text-white' : 'border-white/8 text-white/50 hover:border-white/20'}`}>
                      {k}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Sport</label>
                  <div className="flex flex-wrap gap-2">
                    {sports.map((s) => (
                      <button key={s} onClick={() => update('sport', s)}
                        className={`px-4 py-2 text-xs tracking-widest uppercase font-semibold border transition-all ${form.sport === s ? 'border-red-500 bg-red-500 text-white' : 'border-white/10 text-white/40 hover:border-white/30'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Quantity (pieces)</label>
                  <input value={form.qty} onChange={e => {
                    const parsed = parseInt(e.target.value || '0', 10) || 10
                    update('qty', String(Math.max(10, parsed)))
                  }}
                    type="number" min="10" id="qty" placeholder="Min 10 pieces" className={inputClass} />
                  <p className="text-xs text-white/25 mt-1.5">Minimum order is 10 pieces</p>
                </div>
                <div>
                  <label className={labelClass}>Team / Club Name</label>
                  <input value={form.teamName} onChange={e => update('teamName', e.target.value)}
                    placeholder="e.g. FC Deccan Warriors" className={inputClass} />
                </div>
              </div>
            </div>
            <button onClick={() => setStep(2)}
              className="mt-4 inline-flex items-center gap-3 bg-red-500 text-white px-8 py-4 font-display font-700 text-sm tracking-widest uppercase hover:bg-red-600 transition-all">
              Next: Design <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Step 2 — Design */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className={labelClass}>Primary Color</label>
                <div className="flex flex-wrap gap-3">
                  {colorOptions.map((c) => (
                    <button key={c} onClick={() => update('primaryColor', c)} aria-label={`Select primary color ${c}`}
                      className={`w-10 h-10 border-2 transition-all ${form.primaryColor === c ? 'border-white scale-110' : 'border-transparent'}`}
                      style={{ background: c }} />
                  ))}
                  <input type="color" value={form.primaryColor} onChange={e => update('primaryColor', e.target.value)}
                    className="w-10 h-10 cursor-pointer bg-transparent border border-white/20 p-0.5" title="Custom color" />
                </div>
              </div>
              <div>
                <label className={labelClass}>Secondary Color</label>
                <div className="flex flex-wrap gap-3">
                  {colorOptions.map((c) => (
                    <button key={c} onClick={() => update('secondaryColor', c)} aria-label={`Select secondary color ${c}`}
                      className={`w-10 h-10 border-2 transition-all ${form.secondaryColor === c ? 'border-white scale-110' : 'border-transparent'}`}
                      style={{ background: c }} />
                  ))}
                  <input type="color" value={form.secondaryColor} onChange={e => update('secondaryColor', e.target.value)}
                    className="w-10 h-10 cursor-pointer bg-transparent border border-white/20 p-0.5" title="Custom color" />
                </div>
              </div>
            </div>

            {/* Preview swatch */}
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16" style={{ background: `linear-gradient(135deg, ${form.primaryColor} 50%, ${form.secondaryColor} 50%)` }} />
              <div>
                <p className="text-white text-sm font-semibold">Color Preview</p>
                <p className="text-white/30 text-xs">{form.primaryColor} + {form.secondaryColor}</p>
              </div>
            </div>

            {/* Customization options */}
            <div>
              <label className={labelClass}>Customization Options</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'hasNumbers', label: 'Player Numbers' },
                  { key: 'hasNames', label: 'Player Names' },
                  { key: 'hasBadge', label: 'Club Badge / Logo' },
                  { key: 'hasSponsor', label: 'Sponsor Logo' },
                ].map(({ key, label }) => (
                  <button key={key} onClick={() => update(key, !form[key as keyof typeof form])}
                    className={`flex items-center gap-3 px-4 py-3 border text-sm transition-all ${form[key as keyof typeof form] ? 'border-red-500 bg-red-500/10 text-white' : 'border-white/8 text-white/40 hover:border-white/20'}`}>
                    <span className={`w-4 h-4 border flex items-center justify-center flex-shrink-0 ${form[key as keyof typeof form] ? 'border-red-500 bg-red-500' : 'border-white/20'}`}>
                      {form[key as keyof typeof form] && <Check size={10} className="text-white" />}
                    </span>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="border border-white/10 text-white/40 px-6 py-4 text-xs tracking-widest uppercase hover:border-white/30 transition-all">← Back</button>
              <button onClick={() => setStep(3)} className="inline-flex items-center gap-3 bg-red-500 text-white px-8 py-4 font-display font-700 text-sm tracking-widest uppercase hover:bg-red-600 transition-all">
                Next: Contact <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Contact */}
        {step === 3 && (
          <div className="space-y-6 max-w-lg">
            <div>
              <label className={labelClass}>Your Name</label>
              <input value={form.contactName} onChange={e => update('contactName', e.target.value)} placeholder="Full name" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Phone Number</label>
              <input value={form.contactPhone} onChange={e => update('contactPhone', e.target.value)} placeholder="+91 XXXXX XXXXX" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>City</label>
              <input value={form.contactCity} onChange={e => update('contactCity', e.target.value)} placeholder="e.g. Pune" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Additional Notes</label>
              <textarea value={form.notes} onChange={e => update('notes', e.target.value)}
                placeholder="Any specific design requests, references, or special requirements..." rows={4}
                className={inputClass + ' resize-none'} />
            </div>

            {/* Summary */}
            <div className="bg-[#111] border border-white/5 p-5 space-y-2 text-sm">
              <p className="text-white/30 text-[10px] tracking-widest uppercase font-semibold mb-3">Order Summary</p>
              {[
                ['Kit Type', form.kitType],
                ['Sport', form.sport],
                ['Quantity', `${form.qty} pcs`],
                ['Team', form.teamName || 'Not specified'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-white/40">{k}</span>
                  <span className="text-white">{v}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(2)} className="border border-white/10 text-white/40 px-6 py-4 text-xs tracking-widest uppercase hover:border-white/30 transition-all">← Back</button>
              <button onClick={handleSubmit} disabled={submitting}
                className="flex-1 inline-flex items-center justify-center gap-3 bg-red-500 text-white px-8 py-4 font-display font-700 text-sm tracking-widest uppercase hover:bg-red-600 transition-all glow-red disabled:bg-gray-600 disabled:cursor-not-allowed">
                <Zap size={15} /> {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}