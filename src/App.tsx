/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PizzaRecipe, LabJournalEntry } from './types';
import DoughCalculator, { CalculatedWeights } from './components/DoughCalculator';
import FdtCalculator from './components/FdtCalculator';
import Diagnostics from './components/Diagnostics';
import LabJournal from './components/LabJournal';
import {
  Scale,
  Thermometer,
  FileText,
  ShieldAlert,
  Flame,
  Info,
  Layers,
  ChevronRight,
  TrendingUp,
  Award,
  Atom
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'scaler' | 'journal' | 'diagnostics'>('scaler');

  // Shared state for the recipe (synchronized from the dough scaler)
  const [recipe, setRecipe] = useState<PizzaRecipe>({
    numBalls: 6,
    ballWeight: 280,
    hydration: 65,
    saltPercent: 2.5,
    yeastPercent: 0.13,
    yeastType: 'dry',
    oilPercent: 0,
    sugarPercent: 0,
  });

  const [waterTemp, setWaterTemp] = useState<number>(15);

  // Transfer recipe data to the digital lab journal draft
  const handleSendToJournal = (calculatedRecipe: PizzaRecipe, weights: CalculatedWeights) => {
    setActiveTab('journal');
    // The LabJournal component accesses these states and populates active draft
    // Find log creation button or invoke initialization in LabJournal.
    // To trigger the form immediately, we can use a temporary action or handle it via component re-renders.
    setTimeout(() => {
      const logBtn = document.getElementById('btn-initiate-log');
      if (logBtn) {
        logBtn.click();
        
        // Populate newly loaded form inputs with exact weights
        const titleInput = document.getElementById('form-input-title') as HTMLInputElement;
        if (titleInput) titleInput.value = `Lab Trial (${calculatedRecipe.numBalls} Balls à ${calculatedRecipe.ballWeight}g)`;
        
        const goalInput = document.getElementById('form-input-goal') as HTMLInputElement;
        if (goalInput) goalInput.value = `Testing ${calculatedRecipe.hydration}% hydration with ${calculatedRecipe.yeastPercent}% ${calculatedRecipe.yeastType} yeast`;
      }
    }, 100);
  };

  const handleSendToFdt = (flour: number, water: number) => {
    const fdtSection = document.getElementById('fdt-calculator-section');
    if (fdtSection) {
      fdtSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-[#E60012]/10 selection:text-[#E60012]" id="main-application-view">
      {/* Industrial/Mitsubishi Style Header */}
      <header className="bg-[#E60012] text-white flex flex-col md:flex-row items-center justify-between px-6 py-4 md:py-0 md:h-16 border-b-4 border-slate-900 flex-shrink-0 sticky top-0 z-40 gap-4">
        <div className="flex items-center space-x-4">
          {/* Authentic Diamond Logo badge in white block */}
          <div className="bg-white p-1.5 flex items-center justify-center shadow-md border border-slate-900">
            <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Mitsubishi triple diamond icon */}
              <polygon points="50,15 65,40 50,65 35,40" fill="#E60012" />
              <polygon points="25,58 40,83 25,100 10,75" fill="#E60012" />
              <polygon points="75,58 90,75 75,100 60,83" fill="#E60012" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-black tracking-tighter uppercase font-mono flex items-center gap-1">
              DOUGH CONTROL <span className="text-white/60">//</span> SHRAVAN KUMAR
            </h1>
            <p className="text-[10px] text-white/85 font-mono tracking-wide">
              PERSONAL DOUGH APP // FOR SHRAVAN KUMAR
            </p>
          </div>
        </div>

        {/* Practical Tab Selectors styled like a robust operator console */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
          <nav className="flex bg-slate-950 p-1 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] w-full md:w-auto overflow-x-auto scrollbar-none [scrollbar-width:none]">
            <button
              id="tab-scaler-btn"
              onClick={() => setActiveTab('scaler')}
              className={`flex-1 md:flex-initial px-3.5 py-1.5 md:py-2 text-xs font-black tracking-wide uppercase transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                activeTab === 'scaler'
                  ? 'bg-[#E60012] text-white border border-transparent'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              Formula Scaler
            </button>
            <button
              id="tab-journal-btn"
              onClick={() => setActiveTab('journal')}
              className={`flex-1 md:flex-initial px-3.5 py-1.5 md:py-2 text-xs font-black tracking-wide uppercase transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                activeTab === 'journal'
                  ? 'bg-[#E60012] text-white border border-transparent'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              LAB Notebook
            </button>
            <button
              id="tab-diagnostics-btn"
              onClick={() => setActiveTab('diagnostics')}
              className={`flex-1 md:flex-initial px-3.5 py-1.5 md:py-2 text-xs font-black tracking-wide uppercase transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                activeTab === 'diagnostics'
                  ? 'bg-[#E60012] text-white border border-transparent'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Diagnostics
            </button>
          </nav>
          <div className="hidden lg:flex space-x-4 text-[10px] font-bold uppercase tracking-widest text-[#E60012] bg-white border-2 border-slate-900 px-3 py-1.5 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] items-center font-mono">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
            <span>CALC ENGINE ACTIVE</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-6 py-10">
        {/* Dynamic content rendering */}
        <div className="space-y-12">
          {activeTab === 'scaler' && (
            <div className="space-y-12 animate-fade-in">
              {/* Part 1: Baker's Calculations */}
              <div>
                <div className="mb-6 flex items-center justify-between border-b-4 border-slate-900 pb-3">
                  <div>
                    <span className="text-xs text-[#E60012] font-black uppercase tracking-widest font-mono block">
                      STANDARD MATRIX // MOD-01
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">
                      Baker's Percentage Scaler
                    </h2>
                  </div>
                  <span className="text-xs font-mono font-bold bg-slate-900 text-slate-100 px-3 py-1 text-center">
                    FORMULA_ENGINE_LTS
                  </span>
                </div>
                <DoughCalculator
                  recipe={recipe}
                  onChange={setRecipe}
                  onSendToFdt={handleSendToFdt}
                  onSendToJournal={handleSendToJournal}
                />
              </div>

              {/* Part 2: Temperature Variables */}
              <div>
                <div className="mb-6 flex items-center justify-between border-b-4 border-slate-900 pb-3" id="thermodynamics-calculator-anchor">
                  <div>
                    <span className="text-xs text-[#E60012] font-black uppercase tracking-widest font-mono block">
                      THERMODYNAMICS // MOD-02
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">
                      Dough Thermodynamics Calculation
                    </h2>
                  </div>
                  <span className="text-xs font-mono font-bold bg-slate-900 text-slate-100 px-3 py-1 text-center">
                    FDT_THERMO_ACTIVED
                  </span>
                </div>
                <FdtCalculator
                  initialFlourWeight={recipe.numBalls * recipe.ballWeight / (1 + (recipe.hydration / 100) + (recipe.saltPercent / 100) + (recipe.yeastPercent / 100))}
                  initialWaterWeight={((recipe.numBalls * recipe.ballWeight / (1 + (recipe.hydration / 100) + (recipe.saltPercent / 100) + (recipe.yeastPercent / 100))) * (recipe.hydration / 100))}
                  onWaterTempCalculated={setWaterTemp}
                />
              </div>
            </div>
          )}

          {activeTab === 'journal' && (
            <div className="animate-fade-in">
              <div className="mb-6 flex items-center justify-between border-b-4 border-slate-900 pb-3">
                <div>
                  <span className="text-xs text-[#E60012] font-black uppercase tracking-widest font-mono block">
                    REGISTRY DATABASE // MOD-03
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">
                    LAB Test Protocol Logbook
                  </h2>
                </div>
                <span className="text-xs font-mono font-bold bg-slate-900 text-slate-100 px-3 py-1 text-center">
                  DIAGS_SECURE_LTS
                </span>
              </div>
              <LabJournal currentRecipe={recipe} calculatedWaterTemp={waterTemp} />
            </div>
          )}

          {activeTab === 'diagnostics' && (
            <div className="animate-fade-in">
              <div className="mb-6 flex items-center justify-between border-b-4 border-slate-900 pb-3">
                <div>
                  <span className="text-xs text-[#E60012] font-black uppercase tracking-widest font-mono block">
                    QUALITY CONTROL // MOD-04
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">
                    Dough Failure Analysis
                  </h2>
                </div>
                <span className="text-xs font-mono font-bold bg-[#E60012] text-white px-3 py-1 text-center">
                  TECHNICAL_SUPPORT_DIAL
                </span>
              </div>
              <Diagnostics />
            </div>
          )}
        </div>
      </main>

      {/* Mitsubishi Pizza Systems System Status Bar */}
      <footer className="bg-slate-200 border-t-4 border-slate-900 flex-shrink-0 mt-16 select-none">
        <div className="max-w-6xl mx-auto px-6 py-3 flex flex-col md:flex-row items-center justify-between text-[11px] font-bold text-slate-600 uppercase tracking-wider font-mono gap-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 justify-center md:justify-start">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-[#E60012] inline-block" />
              STATUS: SYNCED WITH GITHUB PRODUCTION MAIN
            </span>
            <span>ENGINE: BAKER_CALC_V3-MITSUBISHI</span>
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center">
            <span className="text-slate-800">DEVELOPED BY: <b>SHRAVAN KUMAR</b></span>
            <span>-</span>
            <span className="text-[#E60012]">PERSONAL SERVICE EDITION // EXCELLENCE GUARANTEED</span>
          </div>
        </div>
        
        {/* Contact links and copyright bar */}
        <div className="bg-slate-900 text-slate-400 py-6 text-[10px] uppercase font-mono tracking-widest text-center border-t border-slate-800">
          <div className="max-w-xl mx-auto px-6 space-y-4">
            <p className="text-slate-500 font-sans italic text-xs normal-case">
              "Let your hands become the equation. Your oven, the reactor. Your pizza, the proof." // Customized for Shravan Kumar
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
