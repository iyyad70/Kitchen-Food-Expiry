import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Copy,
  Check,
  ChevronRight,
  Terminal,
  Database,
  Server,
  Layers,
  HelpCircle,
  Play,
  FileCode,
  AlertCircle
} from 'lucide-react';
import { GUIDE_STEPS, GuideStep } from '../data/guideContent';

export function SetupGuideView() {
  const [activeStepId, setActiveStepId] = useState<string>(GUIDE_STEPS[0].id);
  const [copiedCodeKey, setCopiedCodeKey] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const currentStep = GUIDE_STEPS.find(s => s.id === activeStepId) || GUIDE_STEPS[0];
  const currentIndex = GUIDE_STEPS.findIndex(s => s.id === activeStepId);

  const handleCopy = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeKey(key);
    setTimeout(() => setCopiedCodeKey(null), 2000);
  };

  const toggleStepCompleted = (id: string) => {
    setCompletedSteps(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* Guide Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                Capstone Defense Masterclass
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500">VS Code + Laragon MySQL + Power BI</span>
            </div>
            <h1 className="mt-1 text-xl font-bold text-slate-900">
              Step-by-Step Capstone Project Implementation Guide
            </h1>
            <p className="text-xs text-slate-500">
              Tailored for beginners. Follow these 7 modules to set up your database, connect Express API, hook up React/React Native, and impress your lecturers.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2 border border-slate-200 text-xs">
            <span className="text-slate-500">Progress:</span>
            <span className="font-bold text-emerald-700">
              {Object.values(completedSteps).filter(Boolean).length} / {GUIDE_STEPS.length} Completed
            </span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Navigation Steps Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
            <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Guide Modules
            </span>
            <div className="mt-2 space-y-1">
              {GUIDE_STEPS.map((step, idx) => {
                const isActive = step.id === activeStepId;
                const isDone = completedSteps[step.id];

                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveStepId(step.id)}
                    className={`flex w-full items-start gap-3 rounded-lg p-2.5 text-left transition-colors ${
                      isActive
                        ? 'bg-emerald-50/80 border border-emerald-300 text-slate-900 shadow-2xs'
                        : 'hover:bg-slate-50 text-slate-600 border border-transparent'
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-mono text-xs font-bold ${
                        isDone
                          ? 'bg-emerald-600 text-white'
                          : isActive
                          ? 'bg-emerald-700 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {isDone ? '✓' : step.number}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-slate-900 truncate">{step.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 line-clamp-1">{step.summary}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Helper Box */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-xs text-amber-900">
            <div className="flex items-center gap-2 font-bold mb-1">
              <HelpCircle className="h-4 w-4 text-amber-700" />
              <span>New to VS Code &amp; Laragon?</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Do not be intimidated! You only need to run Laragon once, click &quot;Start All&quot;, paste the SQL code into HeidiSQL, and then do all your coding in VS Code.
            </p>
          </div>
        </div>

        {/* Right: Step Detailed Content (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-6">
            {/* Step Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-700">
                    MODULE {currentStep.number}
                  </span>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                    {currentStep.badge}
                  </span>
                </div>
                <h2 className="mt-1 text-lg font-bold text-slate-900">{currentStep.title}</h2>
              </div>

              <button
                onClick={() => toggleStepCompleted(currentStep.id)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  completedSteps[currentStep.id]
                    ? 'bg-emerald-600 text-white'
                    : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{completedSteps[currentStep.id] ? 'Completed ✓' : 'Mark as Done'}</span>
              </button>
            </div>

            {/* Markdown-like Text Content */}
            <div className="space-y-4 text-xs leading-relaxed text-slate-700">
              {currentStep.content.split('\n\n').map((paragraph, i) => {
                if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={i} className="text-sm font-bold text-slate-900 pt-2 border-t border-slate-100">
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                }
                return (
                  <p key={i} className="whitespace-pre-line">
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* Code Snippet Box (if step has code) */}
            {currentStep.codeSnippet && (
              <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 text-slate-200">
                <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <FileCode className="h-4 w-4 text-emerald-400" />
                    <span className="font-mono text-xs font-semibold text-slate-300">
                      {currentStep.codeSnippet.filename}
                    </span>
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono uppercase text-slate-400">
                      {currentStep.codeSnippet.language}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopy(currentStep.codeSnippet!.code, currentStep.id)}
                    className="flex items-center gap-1.5 rounded bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                  >
                    {copiedCodeKey === currentStep.id ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="max-h-96 overflow-y-auto p-4 font-mono text-[11px] leading-relaxed text-emerald-300 scrollbar-thin">
                  <pre>{currentStep.codeSnippet.code}</pre>
                </div>
              </div>
            )}

            {/* Pro Tips Section */}
            {currentStep.tips && currentStep.tips.length > 0 && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
                <h4 className="text-xs font-bold text-emerald-950 mb-2 flex items-center gap-1.5">
                  <span>💡 Pro-Tips for Final Year Defense</span>
                </h4>
                <ul className="space-y-1.5">
                  {currentStep.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-emerald-900">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bottom Step Navigation Buttons */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <button
                disabled={currentIndex === 0}
                onClick={() => setActiveStepId(GUIDE_STEPS[currentIndex - 1].id)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
              >
                ← Previous Module
              </button>

              <button
                disabled={currentIndex === GUIDE_STEPS.length - 1}
                onClick={() => setActiveStepId(GUIDE_STEPS[currentIndex + 1].id)}
                className="flex items-center gap-1 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-40"
              >
                <span>Next Module</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
