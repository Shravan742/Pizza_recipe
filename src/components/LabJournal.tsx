/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LabJournalEntry, PizzaRecipe, MixingMethodType } from '../types';
import {
  FileText,
  Calendar,
  Layers,
  Flame,
  Award,
  ChevronRight,
  Plus,
  Trash2,
  Copy,
  TrendingUp,
  Sliders,
  CheckCircle,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';

interface LabJournalProps {
  currentRecipe: PizzaRecipe;
  calculatedWaterTemp: number;
}

export default function LabJournal({ currentRecipe, calculatedWaterTemp }: LabJournalProps) {
  const [entries, setEntries] = useState<LabJournalEntry[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formGoal, setFormGoal] = useState('Aiming for a light, digestible 65% Neapolitan crust');
  const [formMethod, setFormMethod] = useState<'beginner' | 'custom'>('beginner');
  const [formFlours, setFormFlours] = useState('Tipo 00 (Caputo Saccorosso)');
  
  // Recipe parameters
  const [numBalls, setNumBalls] = useState(currentRecipe.numBalls);
  const [ballWeight, setBallWeight] = useState(currentRecipe.ballWeight);
  const [hydration, setHydration] = useState(currentRecipe.hydration);
  const [saltPercent, setSaltPercent] = useState(currentRecipe.saltPercent);
  const [yeastPercent, setYeastPercent] = useState(currentRecipe.yeastPercent);
  const [yeastType, setYeastType] = useState<'dry' | 'fresh'>(currentRecipe.yeastType);

  // Mixing states
  const [flourTemp, setFlourTemp] = useState<number>(20);
  const [roomTemp, setRoomTemp] = useState<number>(21);
  const [waterTemp, setWaterTemp] = useState<number>(calculatedWaterTemp);
  const [prefermentTemp, setPrefermentTemp] = useState<number>(0);
  const [actualFdt, setActualFdt] = useState<number>(22);
  const [iceAdded, setIceAdded] = useState<boolean>(calculatedWaterTemp < 4);
  const [mixingTime, setMixingTime] = useState<number>(18);

  // Fermentation states
  const [bulkRT, setBulkRT] = useState<number>(2);
  const [bulkFridge, setBulkFridge] = useState<number>(18);
  const [ballRT, setBallRT] = useState<number>(4);
  const [ballFridge, setBallFridge] = useState<number>(0);

  // Proof & Bake
  const [ovenType, setOvenType] = useState<'wood_fired' | 'steel_plate' | 'stone' | 'home_convection' | 'other'>('steel_plate');
  const [bakingTemp, setBakingTemp] = useState<number>(300);
  const [bakingTime, setBakingTime] = useState<number>(4);

  // Subjective scores (1-10)
  const [scoreCornicione, setScoreCornicione] = useState<number>(8);
  const [scoreCrumb, setScoreCrumb] = useState<number>(7);
  const [scoreFlavor, setScoreFlavor] = useState<number>(8);
  const [scoreHandling, setScoreHandling] = useState<number>(9);
  const [scoreOvenSpring, setScoreOvenSpring] = useState<number>(8);

  // Special Notes
  const [notes, setNotes] = useState('');

  // Load entries from LocalStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('dough_control_lab_protocols');
      if (stored) {
        setEntries(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse logs from local storage', e);
    }
  }, []);

  // Save to LocalStorage whenever journals change
  const saveToStorage = (updatedList: LabJournalEntry[]) => {
    localStorage.setItem('dough_control_lab_protocols', JSON.stringify(updatedList));
    setEntries(updatedList);
  };

  // Pre-populate form based on current recipe states
  const initNewForm = () => {
    const today = new Date().toISOString().split('T')[0];
    setFormTitle(`Lab Trial #${entries.length + 1}`);
    setFormGoal('Replicate core 24h temperature targets with precise final hydration');
    setFormMethod('beginner');
    setFormFlours('Tipo 00 W280/300 flour blend');
    setNumBalls(currentRecipe.numBalls);
    setBallWeight(currentRecipe.ballWeight);
    setHydration(currentRecipe.hydration);
    setSaltPercent(currentRecipe.saltPercent);
    setYeastPercent(currentRecipe.yeastPercent);
    setYeastType(currentRecipe.yeastType);
    setFlourTemp(21);
    setRoomTemp(22);
    setWaterTemp(calculatedWaterTemp);
    setPrefermentTemp(0);
    setActualFdt(22);
    setIceAdded(calculatedWaterTemp < 4);
    setMixingTime(15);
    setBulkRT(2);
    setBulkFridge(18);
    setBallRT(3.5);
    setBallFridge(0);
    setOvenType('steel_plate');
    setBakingTemp(300);
    setBakingTime(4.5);
    setScoreCornicione(7);
    setScoreCrumb(7);
    setScoreFlavor(7);
    setScoreHandling(8);
    setScoreOvenSpring(7);
    setNotes('');
    setIsCreating(true);
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();

    const newProtocolEntry: LabJournalEntry = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      title: formTitle || `Bake Protocol #${entries.length + 1}`,
      goal: formGoal,
      recipe: {
        numBalls,
        ballWeight,
        hydration,
        saltPercent,
        yeastPercent,
        yeastType,
        oilPercent: currentRecipe.oilPercent ?? 0,
        sugarPercent: currentRecipe.sugarPercent ?? 0,
      },
      calculatedWaterTemp,
      actualWaterTemp: waterTemp,
      actualFdt: actualFdt,
      iceAdded,
      mixingTimeMinutes: mixingTime,
      bulkRT,
      bulkFridge,
      ballRT,
      ballFridge,
      ovenType,
      bakingTemp,
      bakingTimeMinutes: bakingTime,
      scores: {
        cornicioneRise: scoreCornicione,
        crumbOpenness: scoreCrumb,
        flavorProfile: scoreFlavor,
        doughHandling: scoreHandling,
        ovenSpring: scoreOvenSpring,
      },
      specialNotes: notes,
    };

    const updated = [newProtocolEntry, ...entries];
    saveToStorage(updated);
    setSelectedEntryId(newProtocolEntry.id);
    setIsCreating(false);
  };

  const handleDeleteEntry = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you absolutely sure you want to delete this LAB test entry?')) {
      const filtered = entries.filter((item) => item.id !== id);
      saveToStorage(filtered);
      if (selectedEntryId === id) {
        setSelectedEntryId(filtered.length > 0 ? filtered[0].id : null);
      }
    }
  };

  const selectedEntry = entries.find((e) => e.id === selectedEntryId);

  // Statistics across all logs
  const getAverageScore = () => {
    if (entries.length === 0) return 0;
    const total = entries.reduce((acc, current) => {
      const sum =
        current.scores.cornicioneRise +
        current.scores.crumbOpenness +
        current.scores.flavorProfile +
        current.scores.doughHandling +
        current.scores.ovenSpring;
      return acc + (sum / 5);
    }, 0);
    return Number((total / entries.length).toFixed(1));
  };

  const averageOverallScore = getAverageScore();

  return (
    <div className="space-y-6" id="lab-journal-section">
      {/* High-Level Overview Bento Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="bg-white border-2 border-slate-900 rounded-none p-4 flex items-center justify-between brutalist-shadow">
          <div>
            <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider font-mono block">
              TOTAL RECORDED TRIALS
            </span>
            <span className="text-2xl font-black font-mono text-slate-900 mt-1 block">
              {entries.length} LOGS
            </span>
          </div>
          <div className="w-10 h-10 bg-slate-100 border border-slate-900 flex items-center justify-center">
            <FileText className="text-[#E60012] w-5 h-5 shrink-0" />
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white border-2 border-slate-900 rounded-none p-4 flex items-center justify-between brutalist-shadow">
          <div>
            <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider font-mono block">
              AVERAGE SENSORY SCORE
            </span>
            <span className={`text-2xl font-black font-mono mt-1 block ${
              averageOverallScore >= 8 ? 'text-emerald-700' : 'text-slate-900'
            }`}>
              {averageOverallScore ? `${averageOverallScore} // 10` : '—'}
            </span>
          </div>
          <div className="w-10 h-10 bg-slate-100 border border-slate-900 flex items-center justify-center">
            <Award className="text-[#E60012] w-5 h-5 shrink-0" />
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white border-2 border-slate-900 rounded-none p-4 flex items-center justify-between brutalist-shadow">
          <div>
            <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider font-mono block">
              STANDARD CONTROL RANGE
            </span>
            <span className="text-2xl font-black font-mono text-slate-900 mt-1 block">
              22°C FDT
            </span>
          </div>
          <div className="w-10 h-10 bg-slate-100 border border-slate-900 flex items-center justify-center">
            <TrendingUp className="text-[#E60012] w-5 h-5 shrink-0" />
          </div>
        </div>

        {/* Action Button to Open Dialog */}
        <button
          id="btn-initiate-log"
          onClick={initNewForm}
          className="md:col-span-1 py-4 px-5 bg-[#E60012] hover:bg-slate-950 text-white font-black text-xs uppercase tracking-widest rounded-none w-full h-full transition-all flex items-center justify-center gap-2 border-2 border-slate-900 brutalist-shadow active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          <Plus className="w-4 h-4" />
          Register New Experiment
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Journal List */}
        <div className="lg:col-span-4 bg-white border-2 border-slate-900 rounded-none p-5 brutalist-shadow">
          <div className="flex justify-between items-center mb-4 border-b-2 border-slate-900 pb-3">
            <h4 className="text-xs font-black uppercase text-slate-900 tracking-wide">Experiment Registry</h4>
            <span className="text-[10px] font-mono font-black bg-slate-100 border border-slate-350 px-2 py-0.5">{entries.length} SAMPLES</span>
          </div>

          <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
            {entries.map((entry) => (
              <button
                key={entry.id}
                id={`entry-item-${entry.id}`}
                onClick={() => {
                  setSelectedEntryId(entry.id);
                  setIsCreating(false);
                }}
                className={`w-full text-left p-4 rounded-none border-2 transition-all flex justify-between items-center ${
                  selectedEntryId === entry.id && !isCreating
                    ? 'bg-red-50/50 border-[#E60012] brutalist-shadow'
                    : 'bg-slate-50 border-slate-350 hover:bg-white hover:border-slate-900'
                }`}
              >
                <div className="min-w-0 pr-3">
                  <span className="text-[9px] font-mono font-black text-[#E60012] uppercase tracking-wider block">
                    SAMPLE_ID: {entry.id} // {entry.date}
                  </span>
                  <h5 className="text-xs font-black text-slate-900 uppercase truncate mt-0.5 font-mono">
                    {entry.title}
                  </h5>
                  <p className="text-[10px] text-slate-500 mt-1 truncate">
                    Goal: {entry.goal}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] font-mono font-black text-white bg-slate-900 border border-slate-905 px-1.5 py-0.5">
                    {Math.round(
                      (entry.scores.cornicioneRise +
                        entry.scores.crumbOpenness +
                        entry.scores.flavorProfile +
                        entry.scores.doughHandling +
                        entry.scores.ovenSpring) / 5
                    )}
                    /10
                  </span>
                  <button
                    id={`entry-delete-btn-${entry.id}`}
                    onClick={(e) => handleDeleteEntry(entry.id, e)}
                    className="p-1 hover:bg-red-50 text-slate-400 hover:text-[#E60012] border border-transparent hover:border-slate-300 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </button>
            ))}

            {entries.length === 0 && !isCreating && (
              <div className="text-center py-12 border-2 border-dashed border-slate-300 bg-slate-50 rounded-none p-6">
                <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-black text-slate-800 uppercase tracking-tight mb-1">Datalog is empty</p>
                <p className="text-[10px] text-slate-500 max-w-xs mx-auto py-2">
                  Bakers who measure outcomes master biology. Tap "Register New Experiment" to record custom observations.
                </p>
                <button
                  id="btn-empty-initiate"
                  onClick={initNewForm}
                  className="mt-4 px-4 py-2 bg-slate-900 hover:bg-[#E60012] text-white text-[10px] tracking-widest font-black uppercase rounded-none border-2 border-slate-900 transition-all brutalist-shadow"
                >
                  Create First Entry
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Form or Detailed Visual Display */}
        <div className="lg:col-span-8">
          {isCreating ? (
            /* Creation Form Layout */
            <form
              id="lab-trial-entry-form"
              onSubmit={handleSaveEntry}
              className="bg-white border-2 border-slate-900 rounded-none p-6 brutalist-shadow-lg space-y-6"
            >
              <div className="flex justify-between items-center border-b-2 border-slate-900 pb-3">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#E60012]" />
                  SAMPLE LOG TEMPLATE
                </h4>
                <button
                  id="btn-cancel-create"
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="text-xs font-mono font-black text-slate-500 hover:text-slate-900 uppercase"
                >
                  [Cancel]
                </button>
              </div>

              {/* Form Section: Core Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-slate-700 tracking-wider">Log Name / Title</label>
                  <input
                    id="form-input-title"
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-900 rounded-none p-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E60012]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-slate-700 tracking-wider">Objective / Target Goal</label>
                  <input
                    id="form-input-goal"
                    type="text"
                    value={formGoal}
                    onChange={(e) => setFormGoal(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-900 rounded-none p-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E60012]"
                  />
                </div>
              </div>

              {/* Section 1: Mixing Thermodynamics */}
              <div className="bg-slate-100 border-2 border-slate-900 rounded-none p-4 space-y-4">
                <h5 className="text-[10px] font-black text-[#E60012] uppercase tracking-widest flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5" /> 1. KNEADING & THERMODYNAMICS METRICS
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-650 font-mono">Flour Temp (°C)</label>
                    <input
                      id="form-input-flour-temp"
                      type="number"
                      step="0.1"
                      value={flourTemp}
                      onChange={(e) => setFlourTemp(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-50 border-2 border-slate-905 rounded-none px-2.5 py-1.5 font-mono text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E60012]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-650 font-mono">Water Temp (°C)</label>
                    <input
                      id="form-input-water-temp"
                      type="number"
                      step="0.1"
                      value={waterTemp}
                      onChange={(e) => setWaterTemp(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-50 border-2 border-slate-905 rounded-none px-2.5 py-1.5 font-mono text-xs font-semibold text-slate-905 focus:outline-none focus:ring-2 focus:ring-[#E60012]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-650 font-mono">Actual FDT (°C)</label>
                    <input
                      id="form-input-actual-fdt"
                      type="number"
                      step="0.1"
                      value={actualFdt}
                      onChange={(e) => setActualFdt(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-50 border-2 border-slate-905 rounded-none px-2.5 py-1.5 font-mono text-xs font-semibold text-slate-905 focus:outline-none focus:ring-2 focus:ring-[#E60012]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-650 font-mono">Ice Added?</label>
                    <select
                      id="form-input-ice-added"
                      value={iceAdded ? 'yes' : 'no'}
                      onChange={(e) => setIceAdded(e.target.value === 'yes')}
                      className="w-full bg-slate-50 border-2 border-slate-905 rounded-none px-2.5 py-1.5 text-xs text-slate-900 font-black focus:outline-none focus:ring-2 focus:ring-[#E60012]"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes (Crushed)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Fermentation Timeline */}
              <div className="bg-slate-100 border-2 border-slate-900 rounded-none p-4 space-y-4">
                <h5 className="text-[10px] font-black text-[#E60012] uppercase tracking-widest flex items-center gap-1 font-mono">
                  <Layers className="w-3.5 h-3.5" /> 2. FERMENTATION TIMELINE MATRIX (H)
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-650 font-mono">Bulk Ambient (h)</label>
                    <input
                      id="form-input-bulk-rt"
                      type="number"
                      step="0.5"
                      value={bulkRT}
                      onChange={(e) => setBulkRT(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-50 border-2 border-slate-905 rounded-none px-2.5 py-1.5 font-mono text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E60012]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-650 font-mono">Bulk Cold Chain (h)</label>
                    <input
                      id="form-input-bulk-fridge"
                      type="number"
                      step="0.5"
                      value={bulkFridge}
                      onChange={(e) => setBulkFridge(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-50 border-2 border-slate-905 rounded-none px-2.5 py-1.5 font-mono text-xs font-semibold text-slate-909 focus:outline-none focus:ring-2 focus:ring-[#E60012]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-650 font-mono">Ball Ambient（h)</label>
                    <input
                      id="form-input-ball-rt"
                      type="number"
                      step="0.5"
                      value={ballRT}
                      onChange={(e) => setBallRT(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-50 border-2 border-slate-905 rounded-none px-2.5 py-1.5 font-mono text-xs font-semibold text-slate-905 focus:outline-none focus:ring-2 focus:ring-[#E60012]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-650 font-mono">Ball Cold Chain (h)</label>
                    <input
                      id="form-input-ball-fridge"
                      type="number"
                      step="0.5"
                      value={ballFridge}
                      onChange={(e) => setBallFridge(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-50 border-2 border-slate-905 rounded-none px-2.5 py-1.5 font-mono text-xs font-semibold text-slate-905 focus:outline-none focus:ring-2 focus:ring-[#E60012]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Final Proof & Baking */}
              <div className="bg-slate-100 border-2 border-slate-900 rounded-none p-4 space-y-4">
                <h5 className="text-[10px] font-black text-[#E60012] uppercase tracking-widest flex items-center gap-1 font-mono">
                  <Flame className="w-3.5 h-3.5" /> 3. IN-CHAMBER BAKE PARAMETERS
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-650 font-mono">Oven Configuration Type</label>
                    <select
                      id="form-input-oven-type"
                      value={ovenType}
                      onChange={(e) => setOvenType(e.target.value as any)}
                      className="w-full bg-slate-50 border-2 border-slate-905 rounded-none p-2 text-xs font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E60012]"
                    >
                      <option value="steel_plate">Baking Steel (Oven Convection)</option>
                      <option value="wood_fired">Wood Fired / Portable Pizza Oven</option>
                      <option value="stone">Pizza Stone / Baking Stone</option>
                      <option value="home_convection">Normal convection oven tray</option>
                      <option value="other">Other baking method</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-650 font-mono">Baking Temp (°C)</label>
                    <input
                      id="form-input-baking-temp"
                      type="number"
                      value={bakingTemp}
                      onChange={(e) => setBakingTemp(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-50 border-2 border-slate-905 rounded-none px-2.5 py-1.5 font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E60012]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-650 font-mono">Baking Duration (Minutes)</label>
                    <input
                      id="form-input-baking-time"
                      type="number"
                      step="0.1"
                      value={bakingTime}
                      onChange={(e) => setBakingTime(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-50 border-2 border-slate-905 rounded-none px-2.5 py-1.5 font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E60012]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Sensory Scores */}
              <div className="bg-slate-100 border-2 border-slate-900 rounded-none p-4 space-y-4">
                <h5 className="text-[10px] font-black text-[#E60012] uppercase tracking-widest flex items-center gap-1 font-mono">
                  <Award className="w-3.5 h-3.5" /> 4. SUBJECTIVE RESULTS QUALITY EVALUATION (1–10)
                </h5>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Cornicione Rise */}
                    <div className="space-y-1 bg-white border border-slate-300 p-3 rounded-none">
                      <div className="flex justify-between text-[11px] font-mono font-bold">
                        <span className="text-slate-700 uppercase">Cornicione Rise (Aero Crust)</span>
                        <span className="text-[#E60012] font-black font-mono">{scoreCornicione} / 10</span>
                      </div>
                      <input
                        id="form-input-score-cornicione"
                        type="range"
                        min="1"
                        max="10"
                        value={scoreCornicione}
                        onChange={(e) => setScoreCornicione(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-200 cursor-pointer"
                      />
                    </div>

                    {/* Crumb openness */}
                    <div className="space-y-1 bg-white border border-slate-300 p-3 rounded-none">
                      <div className="flex justify-between text-[11px] font-mono font-bold">
                        <span className="text-slate-700 uppercase">Crumb Openness (Pockets)</span>
                        <span className="text-[#E60012] font-black font-mono">{scoreCrumb} / 10</span>
                      </div>
                      <input
                        id="form-input-score-crumb"
                        type="range"
                        min="1"
                        max="10"
                        value={scoreCrumb}
                        onChange={(e) => setScoreCrumb(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-200 cursor-pointer"
                      />
                    </div>

                    {/* Flavor Profile */}
                    <div className="space-y-1 bg-white border border-slate-300 p-3 rounded-none">
                      <div className="flex justify-between text-[11px] font-mono font-bold">
                        <span className="text-slate-700 uppercase">Flavor Profile (Acid balance)</span>
                        <span className="text-[#E60012] font-black font-mono">{scoreFlavor} / 10</span>
                      </div>
                      <input
                        id="form-input-score-flavor"
                        type="range"
                        min="1"
                        max="10"
                        value={scoreFlavor}
                        onChange={(e) => setScoreFlavor(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-200 cursor-pointer"
                      />
                    </div>

                    {/* Dough Handling */}
                    <div className="space-y-1 bg-white border border-slate-300 p-3 rounded-none">
                      <div className="flex justify-between text-[11px] font-mono font-bold">
                        <span className="text-slate-700 uppercase">Stretch Handling (Elasticity)</span>
                        <span className="text-[#E60012] font-black font-mono">{scoreHandling} / 10</span>
                      </div>
                      <input
                        id="form-input-score-handling"
                        type="range"
                        min="1"
                        max="10"
                        value={scoreHandling}
                        onChange={(e) => setScoreHandling(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-200 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Oven spring */}
                  <div className="bg-white border border-slate-300 p-3 rounded-none space-y-1">
                    <div className="flex justify-between text-[11px] font-mono font-bold">
                      <span className="text-slate-700 uppercase">Oven Spring (Initial expansion)</span>
                      <span className="text-[#E60012] font-black font-mono">{scoreOvenSpring} / 10</span>
                    </div>
                    <input
                      id="form-input-score-spring"
                      type="range"
                      min="1"
                      max="10"
                      value={scoreOvenSpring}
                      onChange={(e) => setScoreOvenSpring(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Special notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Special Notes & Observations</label>
                <textarea
                  id="form-input-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., cell bubble formation, sour level, behavior after fridge, browning response..."
                  className="w-full bg-slate-50 border-2 border-slate-900 rounded-none p-3 text-xs text-slate-900 placeholder-slate-400 font-mono focus:outline-none focus:ring-2 focus:ring-[#E60012]"
                />
              </div>

              <button
                id="btn-save-lab-log"
                type="submit"
                className="w-full py-4 bg-[#E60012] hover:bg-slate-950 text-white font-black text-xs uppercase tracking-widest rounded-none border-2 border-slate-900 transition-all brutalist-shadow active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                Assemble & Commit Sample To Databank
              </button>
            </form>
          ) : selectedEntry ? (
            /* Visual Detailed Entry View */
            <div className="bg-white border-2 border-slate-900 rounded-none p-6 brutalist-shadow-lg space-y-6" id="journal-details-panel">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 border-b-2 border-slate-900 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-white bg-[#E60012] font-black border border-slate-900 px-2 py-0.5 rounded-none font-mono">
                      SAMPLE_DATASET_LTS
                    </span>
                    <span className="text-xs text-slate-500 font-mono flex items-center gap-1.5 uppercase font-bold">
                      <Calendar className="w-3.5 h-3.5" />
                      Recorded: {selectedEntry.date}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mt-2 select-all">
                    {selectedEntry.title}
                  </h3>
                </div>

                <div className="sm:text-right">
                  <span className="text-[10px] text-slate-500 font-mono uppercase font-black block">Overall Assessment Grade</span>
                  <span className="text-3xl font-black font-mono text-[#E60012]">
                    {Math.round(
                      (selectedEntry.scores.cornicioneRise +
                        selectedEntry.scores.crumbOpenness +
                        selectedEntry.scores.flavorProfile +
                        selectedEntry.scores.doughHandling +
                        selectedEntry.scores.ovenSpring) / 5
                    )}
                    / 10
                  </span>
                </div>
              </div>

              <div className="space-y-1 bg-slate-100 p-4 border border-slate-350">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">HYPOTHESIS / EXPERIMENTAL GOAL:</span>
                <p className="text-xs text-slate-800 font-bold italic">"{selectedEntry.goal}"</p>
              </div>

              {/* Grid Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Visual Section A: Mixing and Times */}
                <div className="space-y-4">
                  <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-widest border-l-4 border-[#E60012] pl-2 font-mono">
                    Mixing Thermodynamics
                  </h5>
                  <div className="bg-slate-50 border-2 border-slate-900 rounded-none p-4 space-y-2.5 brutalist-shadow">
                    <div className="flex justify-between items-center text-xs text-slate-500 font-mono">
                      <span>Room Ambient Temperature:</span>
                      <span className="text-slate-900 font-bold">{selectedEntry.fdt?.roomTemp ?? '22'}°C</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-500 font-mono">
                      <span>Base Flour Temperature:</span>
                      <span className="text-slate-900 font-bold">{selectedEntry.fdt?.flourTemp ?? '21'}°C</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-500 font-mono">
                      <span>Water Target Temperature:</span>
                      <span className={`font-black ${selectedEntry.actualWaterTemp && selectedEntry.actualWaterTemp < 4 ? 'text-blue-600' : 'text-slate-900'}`}>
                        {selectedEntry.actualWaterTemp ?? '15'}°C
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-900 font-mono pt-2 border-t border-slate-300">
                      <span className="font-bold">Final Dough Temp (FDT):</span>
                      <span className="text-[#E60012] font-black">{selectedEntry.actualFdt ?? '22'}°C</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-500 font-mono">
                      <span>Replaced Water with Ice:</span>
                      <span className="text-slate-900 font-black">{selectedEntry.iceAdded ? 'YES' : 'NO'}</span>
                    </div>
                  </div>

                  <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-widest border-l-4 border-[#E60012] pl-2 font-mono pt-2">
                    Maturation Phase Log
                  </h5>
                  <div className="bg-slate-50 border-2 border-slate-900 rounded-none p-4 grid grid-cols-2 gap-3 text-center brutalist-shadow">
                    <div className="bg-white p-2.5 border border-slate-300">
                      <span className="text-[9px] text-slate-500 block font-mono uppercase">Bulk Room (RT)</span>
                      <span className="text-lg font-mono font-black text-slate-900">{selectedEntry.bulkRT} HOURS</span>
                    </div>
                    <div className="bg-white p-2.5 border border-slate-300">
                      <span className="text-[9px] text-slate-500 block font-mono uppercase">Bulk Cold (Fridge)</span>
                      <span className="text-lg font-mono font-black text-slate-900">{selectedEntry.bulkFridge} HOURS</span>
                    </div>
                    <div className="bg-white p-2.5 border border-slate-300">
                      <span className="text-[9px] text-slate-500 block font-mono uppercase">Ball Room (RT)</span>
                      <span className="text-lg font-mono font-black text-slate-900">{selectedEntry.ballRT} HOURS</span>
                    </div>
                    <div className="bg-white p-2.5 border border-slate-300">
                      <span className="text-[9px] text-slate-500 block font-mono uppercase">Ball Cold (Fridge)</span>
                      <span className="text-lg font-mono font-black text-slate-900">{selectedEntry.ballFridge} HOURS</span>
                    </div>
                  </div>
                </div>

                {/* Visual Section B: Sensory Scores */}
                <div className="space-y-4">
                  <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-widest border-l-4 border-[#E60012] pl-2 font-mono">
                    Crumb sensory outcomes
                  </h5>
                  <div className="bg-slate-50 border-2 border-slate-900 rounded-none p-4 space-y-4 brutalist-shadow">
                    {/* Cornicione */}
                    <div>
                      <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-700 mb-1">
                        <span>CORNICIONE CRUST RISE</span>
                        <span className="text-[#E60012] font-black">{selectedEntry.scores.cornicioneRise} / 10</span>
                      </div>
                      <div className="w-full h-3 bg-slate-200 border border-slate-400">
                        <div
                          className="h-full bg-[#E60012]"
                          style={{ width: `${selectedEntry.scores.cornicioneRise * 10}%` }}
                        />
                      </div>
                    </div>

                    {/* Crumb */}
                    <div>
                      <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-700 mb-1">
                        <span>CRUMB AIR OPENNESS</span>
                        <span className="text-[#E60012] font-black">{selectedEntry.scores.crumbOpenness} / 10</span>
                      </div>
                      <div className="w-full h-3 bg-slate-200 border border-slate-400">
                        <div
                          className="h-full bg-[#E60012]"
                          style={{ width: `${selectedEntry.scores.crumbOpenness * 10}%` }}
                        />
                      </div>
                    </div>

                    {/* Flavor */}
                    <div>
                      <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-700 mb-1">
                        <span>FLAVOR MATURITY profiles</span>
                        <span className="text-[#E60012] font-black">{selectedEntry.scores.flavorProfile} / 10</span>
                      </div>
                      <div className="w-full h-3 bg-slate-200 border border-slate-400">
                        <div
                          className="h-full bg-[#E60012]"
                          style={{ width: `${selectedEntry.scores.flavorProfile * 10}%` }}
                        />
                      </div>
                    </div>

                    {/* Handling */}
                    <div>
                      <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-700 mb-1">
                        <span>DOUGH STRETCH HANDLING</span>
                        <span className="text-[#E60012] font-black">{selectedEntry.scores.doughHandling} / 10</span>
                      </div>
                      <div className="w-full h-3 bg-slate-200 border border-slate-400">
                        <div
                          className="h-full bg-[#E60012]"
                          style={{ width: `${selectedEntry.scores.doughHandling * 10}%` }}
                        />
                      </div>
                    </div>

                    {/* Oven Spring */}
                    <div>
                      <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-700 mb-1">
                        <span>THERMAL OVEN SPRING</span>
                        <span className="text-[#E60012] font-black">{selectedEntry.scores.ovenSpring} / 10</span>
                      </div>
                      <div className="w-full h-3 bg-slate-200 border border-slate-400">
                        <div
                          className="h-full bg-[#E60012]"
                          style={{ width: `${selectedEntry.scores.ovenSpring * 10}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Baking Parameters bottom line */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t-2 border-slate-900 pt-4">
                <div className="bg-slate-100 p-3 border-2 border-slate-900 text-center brutalist-shadow">
                  <span className="text-[10px] text-slate-500 font-mono font-black block">OVEN CHAMBER CONFIG</span>
                  <span className="text-xs font-black text-slate-900 mt-1 block uppercase">
                    {selectedEntry.ovenType === 'steel_plate' && 'Baking Steel'}
                    {selectedEntry.ovenType === 'wood_fired' && 'Wood-Fired / Portable'}
                    {selectedEntry.ovenType === 'stone' && 'Pizza Stone'}
                    {selectedEntry.ovenType === 'home_convection' && 'Home Baking Tray'}
                    {selectedEntry.ovenType === 'other' && 'Other Chamber'}
                  </span>
                </div>
                <div className="bg-slate-100 p-3 border-2 border-slate-900 text-center brutalist-shadow">
                  <span className="text-[10px] text-slate-500 font-mono font-black block">THERMAL INTENSITY</span>
                  <span className="text-xs font-black text-[#E60012] mt-1 block font-mono">
                    {selectedEntry.bakingTemp}°C SYSTEM
                  </span>
                </div>
                <div className="bg-slate-100 p-3 border-2 border-slate-900 text-center brutalist-shadow">
                  <span className="text-[10px] text-slate-500 font-mono font-black block">BAKE ENGINE DURATION</span>
                  <span className="text-xs font-black text-slate-900 mt-1 block font-mono">
                    {selectedEntry.bakingTimeMinutes} MINUTES
                  </span>
                </div>
              </div>

              {/* Special notes output */}
              {selectedEntry.specialNotes && (
                <div className="p-4 bg-slate-50 border-2 border-slate-900 rounded-none space-y-1.5 brutalist-shadow">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block font-mono">
                    LOG OBSERVATIONS & COMMENTS:
                  </span>
                  <p className="text-xs text-slate-800 font-bold leading-relaxed italic select-all font-mono">
                    "{selectedEntry.specialNotes}"
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-none p-12 flex flex-col items-center justify-center text-center h-[520px]">
              <Info className="w-12 h-12 text-slate-400 mb-3" />
              <h4 className="text-xs font-black text-slate-850 uppercase tracking-wider font-mono">No Experiment Record Selection</h4>
              <p className="text-[11px] text-slate-500 max-w-xs mt-2 leading-relaxed">
                Choose an existing lab trial from your registry sidebar history, or click <b>"Register New Experiment"</b> to commit fresh observations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
