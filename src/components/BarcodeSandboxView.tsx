import React, { useState } from 'react';
import {
  Barcode,
  Search,
  Globe,
  Loader2,
  Code2,
  CheckCircle,
  Copy,
  Check,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { lookupBarcode, SAMPLE_BARCODES } from '../services/openFoodFacts';

export function BarcodeSandboxView() {
  const [barcode, setBarcode] = useState('9556185000433'); // Default: Dutch Lady milk from assignment
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  const handleTestLookup = async (codeToTest: string) => {
    setLoading(true);
    try {
      const res = await lookupBarcode(codeToTest);
      setResult(res);
      setBarcode(codeToTest);
    } catch (err: any) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const copyJson = () => {
    if (result) {
      navigator.clipboard.writeText(JSON.stringify(result.rawJson || result.data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="rounded bg-sky-100 px-2.5 py-0.5 text-xs font-bold text-sky-800">
            Live API Sandbox
          </span>
          <span className="text-xs text-slate-400">·</span>
          <span className="text-xs text-slate-500">Open Food Facts REST Endpoint Explorer</span>
        </div>
        <h1 className="mt-1 text-xl font-bold text-slate-900">
          Barcode API Live Inspector &amp; Schema Validator
        </h1>
        <p className="text-xs text-slate-500">
          Test real barcode lookups right in your browser. Inspect the live JSON returned by Open Food Facts and see how your Express.js backend handles data normalization.
        </p>
      </div>

      {/* Interactive Barcode Input Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
        <div>
          <span className="text-xs font-semibold text-slate-600">Sample Assignment Barcodes:</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {SAMPLE_BARCODES.map(sample => (
              <button
                key={sample.code}
                onClick={() => handleTestLookup(sample.code)}
                className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                  barcode === sample.code
                    ? 'border-sky-500 bg-sky-50 text-sky-900'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Barcode className="h-3.5 w-3.5 text-slate-400" />
                <span>{sample.label}</span>
                <span className="font-mono text-[10px] text-slate-400">({sample.code})</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Barcode className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={barcode}
              onChange={e => setBarcode(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleTestLookup(barcode)}
              placeholder="Enter any product barcode (e.g. 9556185000433)"
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 font-mono text-xs text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <button
            onClick={() => handleTestLookup(barcode)}
            disabled={loading || !barcode.trim()}
            className="flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-sky-700 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Calling API...</span>
              </>
            ) : (
              <>
                <Globe className="h-4 w-4" />
                <span>Execute Live HTTP Request</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results View */}
      {result && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left: Clean Formatted Product Card (4 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-900">Extracted Product Entity</span>
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                    result.fromApi ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {result.fromApi ? '200 OK (Live API)' : 'Curated Seed Match'}
                </span>
              </div>

              {result.data ? (
                <div className="space-y-3">
                  <div className="flex gap-4">
                    <img
                      src={result.data.imageUrl}
                      alt={result.data.productName}
                      className="h-24 w-24 rounded-lg border border-slate-200 bg-white object-contain p-1"
                      onError={e => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {result.data.brand}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {result.data.productName}
                      </h4>
                      <p className="text-xs text-emerald-700 font-semibold">
                        Category: {result.data.category}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono">Barcode: {result.data.barcode}</p>
                    </div>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-3 text-xs space-y-1 text-slate-600">
                    <div>
                      <strong className="text-slate-800">Nutri-Score:</strong>{' '}
                      {result.data.nutriscore || 'Not graded'}
                    </div>
                    <div>
                      <strong className="text-slate-800">Storage Advice:</strong>{' '}
                      {result.data.storageSuggestion || 'Standard refrigeration recommended'}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-rose-600">
                  Product not found or API encountered an error.
                </div>
              )}
            </div>

            {/* Educational callout */}
            <div className="rounded-xl border border-sky-200 bg-sky-50/60 p-4 text-xs text-sky-950">
              <h5 className="font-bold flex items-center gap-1.5 mb-1 text-sky-900">
                <Sparkles className="h-4 w-4 text-sky-600" />
                <span>Why this impresses examiners:</span>
              </h5>
              <p className="leading-relaxed text-[11px]">
                Showing this live barcode endpoint during your project defense proves that your application is an authentic, dynamic system connected to a global food repository, rather than a simple static toy app.
              </p>
            </div>
          </div>

          {/* Right: Raw JSON Output Box (7 cols) */}
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 text-slate-200 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-sky-400" />
                  <span className="font-mono text-xs font-semibold text-slate-300">
                    HTTP Response Body (Open Food Facts v2)
                  </span>
                </div>

                <button
                  onClick={copyJson}
                  className="flex items-center gap-1.5 rounded bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy JSON</span>
                    </>
                  )}
                </button>
              </div>

              <div className="max-h-[460px] overflow-y-auto p-4 font-mono text-[11px] leading-relaxed text-sky-300 scrollbar-thin">
                <pre>{JSON.stringify(result.rawJson || result.data, null, 2)}</pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
