import React, { useState, useRef, useEffect } from 'react';
import { Camera, Barcode, X, Check, Loader2, Sparkles, RefreshCw, AlertCircle, Plus } from 'lucide-react';
import { lookupBarcode, SAMPLE_BARCODES } from '../services/openFoodFacts';
import { PantryItem } from '../types';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: Omit<PantryItem, 'id' | 'status'>) => void;
  currentUser: string;
  householdId: string;
}

export function BarcodeScannerModal({
  isOpen,
  onClose,
  onAddItem,
  currentUser,
  householdId
}: BarcodeScannerModalProps) {
  const [barcodeInput, setBarcodeInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fetchedData, setFetchedData] = useState<any | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Form states for the product to add
  const [productName, setProductName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState<PantryItem['category']>('Dairy');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('pack');
  const [location, setLocation] = useState<'Fridge' | 'Freezer' | 'Pantry Shelf'>('Fridge');
  const [expiryDate, setExpiryDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  });
  const [price, setPrice] = useState(6.50);
  const [imageUrl, setImageUrl] = useState('');
  const [notes, setNotes] = useState('');

  // Handle quick date offsets
  const setQuickExpiry = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setExpiryDate(d.toISOString().split('T')[0]);
  };

  const handleFetchBarcode = async (codeToFetch: string) => {
    const cleanCode = codeToFetch.trim();
    if (!cleanCode) return;
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await lookupBarcode(cleanCode);
      const prod = res.data;
      setFetchedData({ ...prod, fromApi: res.fromApi });
      setProductName(prod.productName);
      setBrand(prod.brand);
      setCategory(prod.category);
      setImageUrl(prod.imageUrl);
      setPrice(prod.estimatedPrice || 5.0);
      setBarcodeInput(cleanCode);

      // Auto-set optimal storage location based on category
      if (prod.category === 'Dairy' || prod.category === 'Meat & Poultry' || prod.category === 'Produce') {
        setLocation('Fridge');
      } else if (prod.category === 'Frozen') {
        setLocation('Freezer');
      } else {
        setLocation('Pantry Shelf');
      }

      // Default reasonable expiry based on category
      if (prod.category === 'Bakery') {
        setQuickExpiry(4);
      } else if (prod.category === 'Dairy') {
        setQuickExpiry(7);
      } else if (prod.category === 'Produce') {
        setQuickExpiry(5);
      } else if (prod.category === 'Meat & Poultry') {
        setQuickExpiry(3);
      } else {
        setQuickExpiry(30);
      }
    } catch (err: any) {
      setErrorMsg('Could not fetch product information: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Start webcam
  const startCamera = async () => {
    try {
      setErrorMsg(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access not granted or unavailable:', err);
      setErrorMsg('Camera permission not available or no webcam detected. You can select a sample barcode or type manually.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setFetchedData(null);
      setBarcodeInput('');
      setErrorMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) {
      setErrorMsg('Product name is required.');
      return;
    }

    onAddItem({
      barcode: barcodeInput || 'MANUAL-' + Date.now().toString().slice(-6),
      productName,
      brand: brand || 'Generic',
      category,
      quantity,
      unit,
      location,
      purchaseDate: new Date().toISOString().split('T')[0],
      expiryDate,
      addedBy: currentUser,
      householdId,
      estimatedPrice: Number(price) || 0,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80',
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Barcode className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Scan &amp; Add Product to Pantry</h2>
              <p className="text-xs text-slate-500">Live lookup via Open Food Facts API</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick preset barcodes from Malaysia & Worldwide */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Quick Sample Barcodes (Click to Test)
              </span>
              <span className="text-xs text-slate-400">Assignment Examples</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_BARCODES.map(sample => (
                <button
                  key={sample.code}
                  type="button"
                  onClick={() => handleFetchBarcode(sample.code)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                    barcodeInput === sample.code
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-slate-50'
                  }`}
                >
                  <Barcode className="h-3.5 w-3.5 text-slate-400" />
                  <span>{sample.label}</span>
                  <span className="font-mono text-[10px] text-slate-400">({sample.code.slice(-5)})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Barcode input & Camera Toggle */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Enter 13-digit EAN/UPC (e.g. 9556185000433)"
                  value={barcodeInput}
                  onChange={e => setBarcodeInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleFetchBarcode(barcodeInput)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 font-mono text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={isLoading || !barcodeInput.trim()}
                  onClick={() => handleFetchBarcode(barcodeInput)}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Fetching...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      <span>Lookup</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={isCameraActive ? stopCamera : startCamera}
                  className={`flex items-center gap-1.5 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                    isCameraActive
                      ? 'border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                  title="Toggle Camera Scanner"
                >
                  <Camera className="h-4 w-4" />
                  <span className="hidden sm:inline">{isCameraActive ? 'Close Cam' : 'Use Camera'}</span>
                </button>
              </div>
            </div>

            {/* Video Viewport if Camera Active */}
            {isCameraActive && (
              <div className="relative mt-3 overflow-hidden rounded-lg bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-48 w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="relative h-28 w-48 border-2 border-emerald-400 rounded-md">
                    <div className="absolute inset-x-0 top-1/2 h-0.5 bg-rose-500 animate-pulse shadow-sm"></div>
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-semibold text-white bg-black/60 px-2 py-0.5 rounded">
                      Align Barcode in Box
                    </span>
                  </div>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="mt-3 flex items-center gap-2 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-100">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Fetched Product Preview Card */}
          {fetchedData && (
            <div className="flex items-start gap-4 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
              <img
                src={fetchedData.imageUrl}
                alt={fetchedData.productName}
                className="h-20 w-20 shrink-0 rounded-lg border border-emerald-100 bg-white object-contain p-1 shadow-xs"
                onError={e => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80';
                }}
              />
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    {fetchedData.fromApi ? '✓ Verified Open Food Facts' : 'Curated Catalog'}
                  </span>
                  {fetchedData.nutriscore && (
                    <span className="text-[10px] text-slate-500">
                      Nutri-Score: <strong className="text-slate-800">{fetchedData.nutriscore}</strong>
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">{fetchedData.productName}</h4>
                <p className="text-xs text-slate-600">
                  Brand: <span className="font-medium text-slate-800">{fetchedData.brand}</span> · Category:{' '}
                  <span className="font-medium text-slate-800">{fetchedData.category}</span>
                </p>
                {fetchedData.storageSuggestion && (
                  <p className="text-[11px] text-slate-500 italic">
                    💡 Storage tip: {fetchedData.storageSuggestion}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Form to Confirm and Save */}
          <form id="pantry-add-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Product Name</label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={e => setProductName(e.target.value)}
                  placeholder="e.g. Dutch Lady Fresh Milk 1L"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Brand</label>
                <input
                  type="text"
                  value={brand}
                  onChange={e => setBrand(e.target.value)}
                  placeholder="e.g. Dutch Lady"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Food Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Dairy">Dairy</option>
                  <option value="Bakery">Bakery</option>
                  <option value="Produce">Produce (Fruit/Veg)</option>
                  <option value="Meat & Poultry">Meat & Poultry</option>
                  <option value="Pantry & Grains">Pantry & Grains</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Frozen">Frozen</option>
                  <option value="Condiments">Condiments</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Storage Location</label>
                <select
                  value={location}
                  onChange={e => setLocation(e.target.value as any)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Fridge">Fridge (4°C)</option>
                  <option value="Freezer">Freezer (-18°C)</option>
                  <option value="Pantry Shelf">Pantry Shelf (Ambient)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Est. Price (RM / $)</label>
                <input
                  type="number"
                  step="0.10"
                  value={price}
                  onChange={e => setPrice(parseFloat(e.target.value) || 0)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Expiry Date Section with Presets */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-800">
                  Expiry Date <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setQuickExpiry(3)}
                    className="rounded bg-white px-2 py-1 text-[11px] font-medium text-slate-700 border border-slate-200 hover:border-emerald-400"
                  >
                    +3 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickExpiry(7)}
                    className="rounded bg-white px-2 py-1 text-[11px] font-medium text-slate-700 border border-slate-200 hover:border-emerald-400"
                  >
                    +1 Week
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickExpiry(14)}
                    className="rounded bg-white px-2 py-1 text-[11px] font-medium text-slate-700 border border-slate-200 hover:border-emerald-400"
                  >
                    +2 Weeks
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickExpiry(30)}
                    className="rounded bg-white px-2 py-1 text-[11px] font-medium text-slate-700 border border-slate-200 hover:border-emerald-400"
                  >
                    +1 Month
                  </button>
                </div>
              </div>
              <input
                type="date"
                required
                value={expiryDate}
                onChange={e => setExpiryDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Quantity</label>
                <div className="mt-1 flex items-center">
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={e => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-20 rounded-l-lg border border-r-0 border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <select
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                    className="flex-1 rounded-r-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="carton">carton</option>
                    <option value="pack">pack</option>
                    <option value="loaf">loaf</option>
                    <option value="tub">tub</option>
                    <option value="pieces">pieces</option>
                    <option value="can">can</option>
                    <option value="bottle">bottle</option>
                    <option value="kg">kg</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Added By</label>
                <input
                  type="text"
                  disabled
                  value={currentUser}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Notes (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Bought from Lotus. Keep seal tightly closed."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </form>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="pantry-add-form"
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-xs hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            <span>Save to Pantry</span>
          </button>
        </div>
      </div>
    </div>
  );
}
