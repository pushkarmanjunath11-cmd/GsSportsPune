'use client'

import { useState } from 'react'
import { Check, Upload } from 'lucide-react'

const cats = ['jerseys', 'shoes', 'customization', 'balls']
const allSizes = { jerseys: ['XS','S','M','L','XL','XXL'], shoes: ['6','6.5','7','7.5','8','8.5','9','9.5','10','10.5','11'], balls: ['Size 3','Size 4','Size 5'], customization: ['One Size'] }

const inp = { width: '100%', background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.07)', padding: '13px 16px', fontSize: 14, color: '#f5f5f5', outline: 'none', boxSizing: 'border-box' as const }
const lbl = { display: 'block', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase' as const, color: 'rgba(245,245,245,0.3)', marginBottom: 8, fontWeight: 700 }

export default function AddProductPage() {
  const [saved, setSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    price: '',
    originalPrice: '',
    description: '',
    longDescription: '',
    moq: '10',
    customizable: true,
    featured: false,
    isNew: false,
    category: 'jerseys',
    sizes: [] as string[],
  })
  const [imagesPreview, setImagesPreview] = useState<File[]>([])
  const [imageError, setImageError] = useState('')

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const el = e.target
    if (el instanceof HTMLInputElement && el.type === 'checkbox') {
      setForm(p => ({ ...p, [el.name]: el.checked }))
    } else if (el instanceof HTMLSelectElement) {
      setForm(p => ({ ...p, [el.name]: el.value }))
    } else {
      setForm(p => ({ ...p, [el.name]: el.value }))
    }
  }

  const toggleSize = (s: string) => setForm(p => ({
    ...p,
    sizes: p.sizes.includes(s) ? p.sizes.filter(x => x !== s) : [...p.sizes, s]
  }))

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return
    const newFiles: File[] = []
    let hasError = false

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setImageError('Only image files are allowed')
        hasError = true
        break
      }
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setImageError('File size must be less than 10MB')
        hasError = true
        break
      }
      newFiles.push(file)
    }

    if (!hasError) {
      setImagesPreview([...imagesPreview, ...newFiles])
      setImageError('')
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    handleFileSelect(e.dataTransfer.files)
  }

  const save = async () => {
    const price = parseFloat(form.price)
    const originalPrice = parseFloat(form.originalPrice)

    // Validate prices
    if (isNaN(price) || price < 0) {
      alert('Price must be a valid number >= 0')
      return
    }
    if (form.originalPrice && (isNaN(originalPrice) || originalPrice < 0)) {
      alert('Original price must be a valid number >= 0')
      return
    }
    if (form.originalPrice && originalPrice < price) {
      alert('Original price should be greater than or equal to sale price')
      return
    }

    setIsSaving(true)
    try {
      // Prepare form data with images
      const formData = new FormData()
      formData.append('data', JSON.stringify({
        ...form,
        price,
        originalPrice: originalPrice ?? null,
      }))

      // Add image files
      imagesPreview.forEach((file) => {
        formData.append('images', file)
      })

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (error: any) {
      alert(`Error saving product: ${error?.message || 'Unknown error'}`)
      console.error('Save error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 32, fontWeight: 900, textTransform: 'uppercase', color: '#f5f5f5' }}>Add Product</h1>
          <p style={{ color: 'rgba(245,245,245,0.3)', fontSize: 13, marginTop: 4 }}>Add a new item to the GS Sports store.</p>
        </div>
        <button onClick={save}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: saved ? 'rgba(34,197,94,0.15)' : '#e8162a', color: saved ? '#4ade80' : '#fff', border: saved ? '1px solid rgba(34,197,94,0.3)' : 'none', fontSize: 12, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Barlow Condensed, sans-serif', boxShadow: saved ? 'none' : '0 0 24px rgba(232,22,42,0.35)' }}>
          {saved ? <><Check size={14} /> Saved!</> : 'Save Product'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Info */}
          <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.05)', padding: 24, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#e8162a' }} />
            <h2 className="font-display" style={{ fontSize: 16, fontWeight: 800, textTransform: 'uppercase', color: '#f5f5f5', letterSpacing: '0.1em', marginBottom: 20 }}>Product Info</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div><label style={lbl}>Product Name</label><input name="name" value={form.name} onChange={handle} placeholder="e.g. Pro Match Jersey" style={inp} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label style={lbl}>Price (₹)</label><input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handle} placeholder="699" style={inp} /></div>
                <div><label style={lbl}>Original Price (₹)</label><input name="originalPrice" type="number" min="0" step="0.01" value={form.originalPrice} onChange={handle} placeholder="999" style={inp} /></div>
              </div>
              <div><label style={lbl}>Short Description</label><input name="description" value={form.description} onChange={handle} placeholder="One-liner for product cards" style={inp} /></div>
              <div><label style={lbl}>Full Description</label><textarea name="longDescription" value={form.longDescription} onChange={handle} rows={4} placeholder="Detailed description..." style={{ ...inp, resize: 'none' }} /></div>
              <div><label style={lbl}>Min Order Qty</label><input name="moq" type="number" value={form.moq} onChange={handle} style={inp} /></div>
            </div>
          </div>

          {/* Sizes */}
          <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.05)', padding: 24, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#f97316' }} />
            <h2 className="font-display" style={{ fontSize: 16, fontWeight: 800, textTransform: 'uppercase', color: '#f5f5f5', letterSpacing: '0.1em', marginBottom: 16 }}>Sizes</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {(allSizes[form.category as keyof typeof allSizes] || allSizes.jerseys).map((s) => (
                <button key={s} onClick={() => toggleSize(s)}
                  style={{ padding: '8px 14px', fontSize: 12, fontWeight: 700, background: form.sizes.includes(s) ? '#e8162a' : 'rgba(255,255,255,0.05)', color: form.sizes.includes(s) ? '#fff' : 'rgba(245,245,245,0.4)', border: form.sizes.includes(s) ? '1px solid #e8162a' : '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', transition: 'all 0.2s' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Image upload */}
          <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.05)', padding: 24, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#facc15' }} />
            <h2 className="font-display" style={{ fontSize: 16, fontWeight: 800, textTransform: 'uppercase', color: '#f5f5f5', letterSpacing: '0.1em', marginBottom: 16 }}>Images</h2>
            <input type="file" multiple accept="image/*" onChange={e => handleFileSelect(e.target.files)} style={{ display: 'none' }} id="image-input" />
            <div style={{ border: '2px dashed rgba(255,255,255,0.08)', padding: 48, textAlign: 'center', cursor: 'pointer' }} onClick={() => document.getElementById('image-input')?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={handleDrop}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(232,22,42,0.4)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}>
              <Upload size={28} color="rgba(245,245,245,0.2)" style={{ margin: '0 auto 12px' }} />
              <p style={{ fontSize: 13, color: 'rgba(245,245,245,0.3)' }}>Drag & drop or click to upload</p>
              <p style={{ fontSize: 11, color: 'rgba(245,245,245,0.15)', marginTop: 4 }}>PNG, JPG up to 10MB</p>
            </div>
            {imageError && <p style={{ color: '#f87171', fontSize: 12, marginTop: 8 }}>{imageError}</p>}
            {imagesPreview.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <p style={{ fontSize: 12, color: 'rgba(245,245,245,0.5)', marginBottom: 8 }}>{imagesPreview.length} image(s) selected</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {imagesPreview.map((file, idx) => (
                    <div key={idx} style={{ width: 60, height: 60, background: '#1a1a1a', border: '1px solid rgba(232,22,42,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(245,245,245,0.4)', fontSize: 11 }}>
                      ✓
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.05)', padding: 24, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#22c55e' }} />
            <h2 className="font-display" style={{ fontSize: 16, fontWeight: 800, textTransform: 'uppercase', color: '#f5f5f5', letterSpacing: '0.1em', marginBottom: 16 }}>Category</h2>
            <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value, sizes: [] }))}
              style={{ ...inp, cursor: 'pointer' }}>
              {cats.map(c => <option key={c} value={c} style={{ background: '#111' }}>{c}</option>)}
            </select>
          </div>

          <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.05)', padding: 24, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#e8162a' }} />
            <h2 className="font-display" style={{ fontSize: 16, fontWeight: 800, textTransform: 'uppercase', color: '#f5f5f5', letterSpacing: '0.1em', marginBottom: 16 }}>Flags</h2>
            {[
              { key: 'customizable', label: 'Customizable', sub: 'Allow name/number' },
              { key: 'featured', label: 'Featured', sub: 'Show on homepage' },
              { key: 'isNew', label: 'New Arrival', sub: 'Show "New" badge' },
            ].map(({ key, label, sub }) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: 16 }}>
                <div>
                  <p style={{ fontSize: 13, color: 'rgba(245,245,245,0.7)', fontWeight: 600 }}>{label}</p>
                  <p style={{ fontSize: 11, color: 'rgba(245,245,245,0.25)', marginTop: 2 }}>{sub}</p>
                </div>
                <div style={{ width: 40, height: 22, borderRadius: 11, background: form[key as keyof typeof form] ? '#e8162a' : 'rgba(255,255,255,0.1)', position: 'relative', transition: 'background 0.2s', flexShrink: 0, boxShadow: form[key as keyof typeof form] ? '0 0 12px rgba(232,22,42,0.4)' : 'none' }}>
                  <input type="checkbox" name={key} checked={!!form[key as keyof typeof form]} onChange={handle} style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', cursor: 'pointer', margin: 0 }} />
                  <span style={{ position: 'absolute', top: 3, left: form[key as keyof typeof form] ? 21 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
                </div>
              </label>
            ))}
          </div>

          <button onClick={save}
            style={{ width: '100%', padding: '14px', background: saved ? 'rgba(34,197,94,0.15)' : '#e8162a', color: saved ? '#4ade80' : '#fff', border: saved ? '1px solid rgba(34,197,94,0.3)' : 'none', fontSize: 13, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Barlow Condensed, sans-serif', boxShadow: saved ? 'none' : '0 0 24px rgba(232,22,42,0.3)' }}>
            {saved ? '✓ Saved!' : 'Save Product'}
          </button>
        </div>
      </div>
    </div>
  )
}