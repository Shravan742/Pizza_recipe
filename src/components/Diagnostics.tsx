/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldAlert, Check, Search, Sparkles, BookOpen, Clock, HelpCircle, Snowflake } from 'lucide-react';

interface DiagnosticSymptom {
  id: string;
  symptom: string;
  cause: string;
  fix: string;
  technicalDetails: string;
  checklist: string[];
}

const SYMPTOMS: DiagnosticSymptom[] = [
  {
    id: 'collapsed',
    symptom: 'Dough collapsed / flat / puffy but weak',
    cause: 'Overproofed, too warm, or too much yeast',
    fix: 'Reduce total fermentation time, lower bulk room temperature, or cut yeast percentage.',
    technicalDetails: 'Your yeast consumed all simple sugars too early, resulting in a spike of CO2 gas that the over-stretched, weakened gluten structure could no longer hold. The gluten network "relaxed" to the breaking point, leading to a flat and structureless dough puddle.',
    checklist: [
      'Reduce yeast percentage (e.g., from 0.2% down to 0.13% or lower)',
      'Ensure room temperature fermentation does not exceed 2 hours before placing in the fridge',
      'Verify your fridge is actively cooling to 4–7°C',
    ],
  },
  {
    id: 'not-rising',
    symptom: 'Dough doesn’t rise / dense / dead',
    cause: 'Underproofed, too cold, or expired yeast',
    fix: 'Increase proofing time, check water / room temperatures, or verify yeast activity with yeast proofing.',
    technicalDetails: 'Yeast is a temperature-dependent biological system. If the water was ice cold and room temperature was below 18°C, the biological metabolism slows to a near-halt. Alternatively, using hot water above 45°C can thermally kill the yeast cells.',
    checklist: [
      'Verify yeast is fresh (mix a small pinch in lukewarm water with sugar; check if it bubbles in 5 mins)',
      'Let the dough sit in a warmer spot (22-24°C) for a longer proof before baking',
      'Use the FDT Calculator to guarantee correct water activation temperature',
    ],
  },
  {
    id: 'tearing',
    symptom: 'Dough tears when stretching / windowpane breaks',
    cause: 'Weak gluten development, too much protease enzyme activity, or aggressive stretching',
    fix: 'Shorter warm fermentation, use stronger flour (higher W-value), or practice better hand kneading.',
    technicalDetails: 'Enzymes called proteases naturally break down gluten proteins so the dough becomes stretchable. However, if the dough ferment runs too long at warm temperatures, excessive protease activity completely digests the gluten strings, leaving a sticky, tear-prone batter.',
    checklist: [
      'Switch to high-protein flour (Tipo 00 W280–350, with ~12-14% protein content)',
      'Knead the dough fully for 15-20 minutes to develop the gluten matrix before fermentation',
      'Reduce bulk room temperature fermentation duration to prevent enzyme overload',
    ],
  },
  {
    id: 'too-tight',
    symptom: 'Dough is too tight / rubbery / snaps back',
    cause: 'Underfermented, too cold, or insufficient ball rest',
    fix: 'Let the dough balls rest longer at room temperature before shaping; ensure warmer proof.',
    technicalDetails: 'When dough is cold or recently balled, its internal gluten coils are tightly wound and tense. It needs thermal relaxation to become extensible (stretchy). If you try to shape a cold dough ball straight from the average fridge, it will constantly fight back and spring inward.',
    checklist: [
      'Leave balled dough at room temperature (20-22°C) for at least 3 to 4 hours before baking',
      'Do not handle or re-ball the dough once the final proof has started',
      'Extend the bulk fermentation time to give gluten networks time to align and relax',
    ],
  },
  {
    id: 'sour-odor',
    symptom: 'Dough smells strongly sour / off / alcohol scent',
    cause: 'Overfermentation or excessive enzyme overload',
    fix: 'Shorten active fermentation time, or move dough to a cooler environment sooner.',
    technicalDetails: 'When yeast is starved of oxygen during long bulk periods, it shifts entirely to anaerobic alcoholic fermentation, generating high concentrations of ethanol and organic acids. While minor sourness builds depth, excessive warm timeline causes acetic/lactic acid burn, degrading gluten.',
    checklist: [
      'Reduce bulk fermentation time at room temperature',
      'Ensure the fridge handles cooling load quickly; avoid stacking hot dough containers closely',
      'Slightly lower the hydration ratio, as high hydration accelerates fermentation yeast rates',
    ],
  },
  {
    id: 'pale-crust',
    symptom: 'Crust is pale / lacks leopard spots or golden color',
    cause: 'Underfermented dough, sugar depletion from overproofing, or insufficient oven heat',
    fix: 'Extend fermentation time to allow starch-to-sugar conversion, or preheat your pizza steel / oven.',
    technicalDetails: 'Crust color comes from Maillard browning (reaction between amino acids and simple reducing sugars under heat). If the dough is underfermented, enzymes haven\'t broken down enough starches into sugars. If overfermented, yeast ate all the sugars, leaving none for browning!',
    checklist: [
      'Preheat your oven with a high-quality baking steel or stone at maximum heat for at least 45 minutes',
      'Bake at high temperatures (ideally 300°C+ on steel, or 400°C+ in dedicated ovens)',
      'If utilizing short dough timelines, add 1-2% diastatic malt or a pinch of sugar to aid browning',
    ],
  },
];

export default function Diagnostics() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSymptomId, setSelectedSymptomId] = useState<string | null>(null);

  // Filter symptoms based on search text
  const filteredSymptoms = SYMPTOMS.filter(
    (item) =>
      item.symptom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cause.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fix.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedSymptom = SYMPTOMS.find((s) => s.id === selectedSymptomId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in" id="diagnostics-section">
      {/* List Panel */}
      <div className="lg:col-span-6 space-y-6">
        <div className="bg-white border-2 border-slate-900 rounded-none p-6 brutalist-shadow">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-2 uppercase tracking-tight">
            <ShieldAlert className="text-[#E60512] w-5 h-5 shrink-0" />
            Biological Error Point Diagnostician
          </h3>
          <p className="text-xs text-slate-500 font-mono mb-6">
            Dough is a living cellular bubble. Locate physical failure signs to isolate biological error and balance your matrix.
          </p>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input
              id="diagnostic-search-input"
              type="text"
              placeholder="Query symptoms (e.g. tear, flat, rubbery, sour, browning)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-900 rounded-none pl-11 pr-4 py-3 text-xs font-mono font-bold text-slate-900 placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-[#E60012] transition-colors"
            />
          </div>

          {/* Symptoms List layout */}
          <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
            {filteredSymptoms.map((item) => (
              <button
                key={item.id}
                id={`symptom-btn-${item.id}`}
                onClick={() => setSelectedSymptomId(item.id)}
                className={`w-full text-left p-4 rounded-none border-2 transition-all flex flex-col justify-between ${
                  selectedSymptomId === item.id
                    ? 'bg-red-50/50 border-[#E60012] brutalist-shadow-sm'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-900 hover:bg-white'
                }`}
              >
                <div className="flex justify-between items-start gap-4 w-full">
                  <h4 className={`text-xs font-black uppercase font-mono tracking-tight transition-colors ${
                    selectedSymptomId === item.id ? 'text-[#E60012]' : 'text-slate-900'
                  }`}>
                    {item.symptom}
                  </h4>
                  <span className={`text-[9px] px-2 py-0.5 font-mono font-black uppercase tracking-wider ${
                    selectedSymptomId === item.id
                      ? 'bg-[#E60012] text-white border border-slate-900'
                      : 'bg-slate-200 text-slate-650'
                  }`}>
                    ANALYZE
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-2 font-mono">
                  <b>INDICATOR:</b> {item.cause}
                </p>
              </button>
            ))}

            {filteredSymptoms.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-slate-300 bg-slate-50 rounded-none">
                <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-mono">No matching anomalies localized.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      <div className="lg:col-span-6">
        {selectedSymptom ? (
          <div className="bg-white border-4 border-slate-900 rounded-none p-6 brutalist-shadow-lg flex flex-col justify-between min-h-[460px]" id="diagnostic-details-card">
            <div>
              <div className="flex justify-between items-center border-b-2 border-slate-900 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-[#E60012] w-5 h-5 shrink-0" />
                  <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest font-mono">
                    Systemic Failure Report
                  </span>
                </div>
                <span className="text-[10px] text-white bg-slate-900 font-mono font-black px-2 py-0.5 border border-slate-900">
                  REF_ERROR: {selectedSymptom.id.toUpperCase()}
                </span>
              </div>

              <h3 className="text-base font-black uppercase text-slate-900 font-mono tracking-tight mb-3">
                {selectedSymptom.symptom}
              </h3>

              <div className="space-y-4">
                {/* Micro scientific breakdown */}
                <div className="space-y-1 bg-slate-50 border border-slate-200 p-3">
                  <h4 className="text-[10px] font-black text-[#E60012] uppercase tracking-wider flex items-center gap-1 font-mono">
                    <BookOpen className="w-3.5 h-3.5" /> PRIMARY BIOLOGICAL TRIGGER:
                  </h4>
                  <p className="text-xs text-slate-800 leading-relaxed font-bold uppercase font-mono">
                    {selectedSymptom.cause}
                  </p>
                </div>

                <div className="space-y-1 pt-2">
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-500" /> Molecular Mechanics & Kinetics:
                  </h4>
                  <p className="text-xs text-slate-650 leading-relaxed font-sans">
                    {selectedSymptom.technicalDetails}
                  </p>
                </div>

                {/* Fixed Steps Action Checklist */}
                <div className="space-y-2.5 pt-4 border-t border-slate-200">
                  <h4 className="text-[10px] font-black text-emerald-800 uppercase tracking-widest flex items-center gap-1 font-mono">
                    <Check className="w-4 h-4 shrink-0 text-emerald-700" /> RECTIFICATION CHECKLIST:
                  </h4>
                  <ul className="space-y-2 pl-1">
                    {selectedSymptom.checklist.map((step, idx) => (
                      <li key={idx} className="text-xs text-slate-800 flex items-start gap-2.5">
                        <span className="w-5 h-5 bg-slate-900 border border-slate-950 text-white font-mono text-[9px] flex items-center justify-center font-black shrink-0 mt-0.5">
                          0{idx + 1}
                        </span>
                        <span className="font-mono text-slate-700 text-xs font-bold">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t-2 border-slate-900 text-[10px] text-slate-600 bg-slate-100 p-3 leading-relaxed font-mono">
              💡 <b>Dough Control Advice:</b> Biological precision represents continuous thermal shifts. Use this diagnostic analysis log to balance processes as kitchen ambient parameters move with seasonal changes.
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 border-2 border-dashed border-slate-350 rounded-none p-12 flex flex-col items-center justify-center text-center min-h-[460px]">
            <HelpCircle className="w-12 h-12 text-slate-400 mb-3 animate-pulse" />
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider font-mono">Select Target Anomalous Symptom</h4>
            <p className="text-[11px] text-slate-500 max-w-xs mt-2 leading-relaxed">
              Query or select an active fermentation failure sign from the directory database on the left to review its organic root cause analysis and baking system corrections.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
