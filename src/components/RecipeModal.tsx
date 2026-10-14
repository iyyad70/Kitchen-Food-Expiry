import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, ChefHat, CheckCircle2, X, Utensils, ArrowRight } from 'lucide-react';
import { PantryItem, RecipeSuggestion } from '../types';
import { getRecipeSuggestions } from '../services/aiRecipes';

interface RecipeModalProps {
  item: PantryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onMarkConsumed: (itemId: string) => void;
}

export function RecipeModal({ item, isOpen, onClose, onMarkConsumed }: RecipeModalProps) {
  const [recipes, setRecipes] = useState<RecipeSuggestion[]>([]);
  const [activeRecipeIndex, setActiveRecipeIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (item && isOpen) {
      setLoading(true);
      getRecipeSuggestions(item.productName, item.category).then(results => {
        setRecipes(results);
        setActiveRecipeIndex(0);
        setLoading(false);
      });
    }
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  const currentRecipe = recipes[activeRecipeIndex] || recipes[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-amber-50/50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <ChefHat className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Zero-Waste Recipe Suggestions</h3>
                <span className="rounded bg-amber-200/70 px-1.5 py-0.5 text-[10px] font-bold text-amber-900">
                  AI Smart Match
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Rescue <span className="font-semibold text-slate-800">{item.productName}</span> before it expires!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Recipe Selector Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-6 pt-3 gap-2 overflow-x-auto">
          {recipes.map((r, idx) => (
            <button
              key={r.title}
              onClick={() => setActiveRecipeIndex(idx)}
              className={`flex items-center gap-2 border-b-2 px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                activeRecipeIndex === idx
                  ? 'border-amber-600 text-amber-900 bg-white rounded-t-lg'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Utensils className="h-3.5 w-3.5" />
              <span>{r.title}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="flex h-48 flex-col items-center justify-center text-slate-400">
              <Sparkles className="h-8 w-8 animate-spin text-amber-500 mb-2" />
              <p className="text-sm">Generating optimal culinary combinations...</p>
            </div>
          ) : currentRecipe ? (
            <>
              {/* Recipe card header */}
              <div className="rounded-xl border border-amber-200/80 bg-amber-50/30 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-lg font-bold text-slate-900">{currentRecipe.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-amber-600" />
                      {currentRecipe.prepTime}
                    </span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                      {currentRecipe.difficulty}
                    </span>
                  </div>
                </div>
                <p className="mt-1 text-xs text-slate-600">{currentRecipe.description}</p>
              </div>

              {/* Ingredients list */}
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                  Ingredients Needed
                </h5>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50/60 p-2 text-xs font-medium text-emerald-900">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[9px] font-bold text-white">
                      ✓
                    </span>
                    <span>
                      <strong>{item.productName}</strong> (Expiring in your pantry!)
                    </span>
                  </div>
                  {currentRecipe.otherIngredients.map((ing, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-700"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                      <span>{ing}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions steps */}
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Step-by-Step Instructions
                </h5>
                <ol className="space-y-3">
                  {currentRecipe.steps.map((step, idx) => (
                    <li key={idx} className="flex gap-3 text-xs text-slate-700 leading-relaxed">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 font-mono text-[11px] font-bold text-amber-800">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>

          <button
            type="button"
            onClick={() => {
              onMarkConsumed(item.id);
              onClose();
            }}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>I Made This! (Mark as Consumed)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
