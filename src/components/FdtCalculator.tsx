/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { FdtCalculation, MixingMethodType } from '../types';
import { Thermometer, HelpCircle, ChevronRight, AlertTriangle, Snowflake, Info } from 'lucide-react';

interface FdtCalculatorProps {
  initialFlourWeight?: number;
  initialWaterWeight?: number;
  onWaterTempCalculated?: (waterTemp: number) => void;
  initialMixingMethod?: MixingMethodType;
}

export default function FdtCalculator({
  initialFlourWeight = 1000,
  initialWaterWeight = 650,
  onWaterTempCalculated,
  initialMixingMethod = 'hand',
}: FdtCalculatorProps) {
  const [fdtParams, setFdtParams] = useState<FdtCalculation>({
    desiredFdt: 22,
    flourTemp: 21,
    roomTemp: 22,
    mixingMethod: initialMixingMethod,
    customFriction: 3,
  });

  // Sync mixer from parent when user changes it on the main config panel
  useEffect(() => {
    setFdtParams(prev => ({ ...prev, mixingMethod: initialMixingMethod }));
  }, [initialMixingMethod]);

  const { desiredFdt, flourTemp, roomTemp, mixingMethod, customFriction } = fdtParams;

  // Determine actual friction factor based on selection
  const getFrictionFactor = (method: MixingMethodType): number => {
    switch (method) {
      case 'hand':
        return 3; // range: +2 to +4
      case 'stand':
        return 6.5; // range: +5 to +8
      case 'spiral':
        return 10; // range: +8 to +12
      case 'custom':
        return customFriction;
      default:
        return 3;
    }
  };

  const friction = getFrictionFactor(mixingMethod);

  // Target Water Temp = (3 * Desired FDT) - (Flour Temp + Room Temp + Mixing Factor)
  const waterTemp = Number(((3 * desiredFdt) - (flourTemp + roomTemp + friction)).toFixed(1));

  useEffect(() => {
    if (onWaterTempCalculated) {
      onWaterTempCalculated(waterTemp);
    }
  }, [waterTemp, onWaterTempCalculated]);

  const updateParam = <K extends keyof FdtCalculation>(key: K, val: FdtCalculation[K]) => {
    setFdtParams((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  // Ice replacement calculation if target water temperature is near or below freezing
  // A standard rule of thumb for dough hydration with ice:
  // Ice mass (g) = Total water mass (g) * (TempOfWaterNeeded - TargetTemp) / (80 + TempOfWaterNeeded)
  // Let us simplify the physics formula where TempOfWaterNeeded is 0 or low.
  // Replacing a calculated negative temperature with ice, since water cannot be liquid below 0.
  const calculateIceWeight = (): number => {
    if (waterTemp >= 4) return 0;
    // Using latent heat of fusion formula:
    // If target water is e.g. -5°C, and tap water is 15°C, we replace a portion of water with crushed ice.
    const tapWaterTemp = 15; // standard assumption for tap water
    const icePercent = (tapWaterTemp - Math.max(0, waterTemp)) / (tapWaterTemp + 80);
    return Math.round(initialWaterWeight * Math.min(1, Math.max(0, icePercent)));
  };

  const iceWeight = calculateIceWeight();  return (
    <div className="bg-white border-2 border-slate-900 rounded-none p-6 brutalist-shadow animate-fade-in" id="fdt-calculator-section">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b-2 border-slate-900 pb-4">
        <div>
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
            <Thermometer className="text-[#E60012] w-5 h-5 shrink-0" />
            Thermodynamic Water Balance
          </h3>
          <p className="text-xs text-slate-500 font-mono">
            "Before you touch the flour, you must calculate the heat."
          </p>
        </div>
      </div>

      {/* FRIENDLY ELI5 CARD: REMOVES CONFUSION */}
      <div className="mb-6 p-4 bg-amber-50 border-2 border-amber-900 text-slate-900/90 space-y-2.5">
        <h4 className="text-xs font-black uppercase text-[#E60012] tracking-wider font-mono flex items-center gap-2">
          <span>💡 EXPLAIN LIKE I'M 5: WHAT STUFF IS THIS AND WHY IS IT CONFUSING?</span>
        </h4>
        <div className="text-xs space-y-2 font-sans leading-relaxed text-slate-800">
          <p>
            Don't let the word <b>"Thermodynamics"</b> scare you! It's just a precise bakery calculation for one single question: <b>"What temperature should my water be when I pour it?"</b>
          </p>
          <p>
            When you knead dough, friction from your hands or mixer heats the dough up. If the dough gets <b>warmer than 26°C</b> during mixing, the yeast goes crazy, digests sugars too fast, and turns your pizza dough into a sticky, sour soup that tears when stretched.
          </p>
          <p>
            <b>Why is this at the bottom?</b> In professional bakeries, you do this calculation at the <i>very last second</i> right before you start mixing, because you need to measure your actual kitchen room temperature and flour temperature first.
          </p>
          <div className="bg-white/80 p-2.5 border border-amber-200 text-[11px] leading-relaxed">
            <b>🔌 Shravan's SilverCrest Note:</b> Since you mix with a <b>dual-hook SilverCrest mixer</b>, the double hooks generate heat much faster than hand-kneading. Knowing your target water temperature ensures you can start with ice or cold water to protect both your dough and the mixer's nylon gears!
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 px-0">
        {/* Sliders and radio buttons */}
        <div className="md:col-span-7 space-y-6">
          {/* Desired Final Dough Temp */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label id="lbl-desired-fdt" className="text-slate-700 font-bold uppercase tracking-wider">Desired Final Dough Temp (FDT)</label>
              <span className="text-slate-100 font-mono font-black bg-slate-900 px-2 py-1 border border-slate-900 text-xs">
                {desiredFdt}°C TARGET
              </span>
            </div>
            <input
              id="desired-fdt-input"
              type="range"
              min="18"
              max="28"
              step="0.5"
              value={desiredFdt}
              onChange={(e) => updateParam('desiredFdt', parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-none appearance-none cursor-pointer"
            />
            <p className="text-[11px] text-slate-500 font-mono">
              Professional bakers recommend <b>22°C</b> for optimal yeast consistent activity and matrix strength.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Flour Temp */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label id="lbl-flour-temp" className="text-slate-700 font-bold uppercase tracking-wider">Flour Temperature</label>
                <span className="text-slate-100 font-mono font-black bg-slate-900 px-2.5 py-0.5 border border-slate-900 text-xs">
                  {flourTemp}°C
                </span>
              </div>
              <input
                id="flour-temp-input"
                type="range"
                min="10"
                max="35"
                value={flourTemp}
                onChange={(e) => updateParam('flourTemp', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-none appearance-none cursor-pointer"
              />
            </div>

            {/* Room Temp */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label id="lbl-room-temp" className="text-slate-700 font-bold uppercase tracking-wider">Room/Ambient Temp</label>
                <span className="text-slate-100 font-mono font-black bg-slate-900 px-2.5 py-0.5 border border-slate-900 text-xs">
                  {roomTemp}°C
                </span>
              </div>
              <input
                id="room-temp-input"
                type="range"
                min="10"
                max="38"
                value={roomTemp}
                onChange={(e) => updateParam('roomTemp', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-none appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Mixing Method / Friction selector */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <label className="text-xs text-slate-700 font-bold uppercase tracking-wider block">Kneading Method & Friction</label>
            <div className="grid grid-cols-3 gap-3">
              {/* By Hand */}
              <button
                id="method-by-hand"
                onClick={() => updateParam('mixingMethod', 'hand')}
                className={`p-3 rounded-none border-2 text-center transition-all ${
                  mixingMethod === 'hand'
                    ? 'bg-[#E60012] border-slate-900 text-white brutalist-shadow'
                    : 'bg-slate-50 border-slate-300 text-slate-700 hover:border-slate-900'
                }`}
              >
                <span className="block text-xs font-black uppercase">Hand</span>
                <span className="text-[10px] font-mono block mt-1 opacity-90">+3°C</span>
              </button>

              {/* Stand Mixer */}
              <button
                id="method-stand-mixer"
                onClick={() => updateParam('mixingMethod', 'stand')}
                className={`p-3 rounded-none border-2 text-center transition-all ${
                  mixingMethod === 'stand'
                    ? 'bg-[#E60012] border-slate-900 text-white brutalist-shadow'
                    : 'bg-slate-50 border-slate-300 text-slate-700 hover:border-slate-900'
                }`}
              >
                <span className="block text-xs font-black uppercase">Stand</span>
                <span className="text-[10px] font-mono block mt-1 opacity-90">+6.5°C</span>
              </button>

              {/* Spiral Mixer */}
              <button
                id="method-spiral-mixer"
                onClick={() => updateParam('mixingMethod', 'spiral')}
                className={`p-3 rounded-none border-2 text-center transition-all ${
                  mixingMethod === 'spiral'
                    ? 'bg-[#E60012] border-slate-900 text-white brutalist-shadow'
                    : 'bg-slate-50 border-slate-300 text-slate-700 hover:border-slate-900'
                }`}
              >
                <span className="block text-xs font-black uppercase">Spiral</span>
                <span className="text-[10px] font-mono block mt-1 opacity-90">+10°C</span>
              </button>
            </div>

            {/* Custom friction slider */}
            {mixingMethod === 'custom' && (
              <div className="p-4 bg-slate-50 rounded-none border-2 border-slate-900 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="text-slate-700 font-bold">Custom Friction Factor</label>
                  <span className="text-slate-100 font-mono font-black bg-slate-900 px-2 py-0.5 text-xs">+{customFriction}°C</span>
                </div>
                <input
                  id="custom-friction-input"
                  type="range"
                  min="0"
                  max="15"
                  step="0.5"
                  value={customFriction}
                  onChange={(e) => updateParam('customFriction', parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-none appearance-none cursor-pointer"
                />
              </div>
            )}
            <div className="flex justify-end">
              <button
                id="btn-toggle-custom-friction"
                onClick={() =>
                  updateParam('mixingMethod', mixingMethod === 'custom' ? 'hand' : 'custom')
                }
                className="text-[10px] uppercase font-black tracking-widest text-[#E60012] hover:text-slate-950 transition-colors underline decoration-dotted"
              >
                {mixingMethod === 'custom' ? 'Reset to presets' : 'Use exact custom friction factor'}
              </button>
            </div>
          </div>
        </div>

        {/* Big Calculated Output */}
        <div className="md:col-span-5 flex flex-col justify-between bg-white border-4 border-slate-900 rounded-none p-6 brutalist-shadow-lg relative">
          <div>
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest font-mono">
              Required Temperature of Liquid
            </span>

            <div className="mt-4 flex items-baseline gap-1" id="calculated-water-temp-display">
              <span className={`text-4xl md:text-5xl font-black font-mono tracking-tighter ${
                waterTemp < 4 ? 'text-blue-600' : waterTemp > 24 ? 'text-[#E60012] animate-pulse' : 'text-emerald-700'
              }`}>
                {waterTemp}°C
              </span>
              <span className="text-xs text-slate-500 font-mono uppercase font-black block mt-1">WATER_TEMP_CT</span>
            </div>

            <div className="mt-4 space-y-3">
              <p className="text-xs text-slate-700 leading-relaxed font-sans border-t border-slate-100 pt-3">
                Calculated dynamically via standard thermodynamic balance: <br />
                <code className="text-slate-800 bg-slate-100 border border-slate-300 px-1.5 py-1 rounded-none font-mono text-[10px] block mt-1.5">
                  (3 × {desiredFdt}°C FDT) - [Flour {flourTemp}°C + Room {roomTemp}°C + Friction {friction}°C]
                </code>
              </p>
            </div>
          </div>

          <div className="mt-6 border-t-2 border-slate-900 pt-4 space-y-3">
            {waterTemp < 4 ? (
              <div className="bg-blue-50 border-2 border-blue-900 rounded-none p-3 text-xs text-blue-900 space-y-1.5 brutalist-shadow">
                <div className="flex items-center gap-1.5 font-black uppercase font-mono">
                  <Snowflake className="w-4 h-4 shrink-0 text-blue-800" />
                  <span>CUBED ICE REQUIRED!</span>
                </div>
                <p className="leading-normal text-[11px]">
                  Target temp is too low to achieve with liquid water alone.
                  Replace <b>{iceWeight}g</b> of your total {initialWaterWeight}g water with <b>finely crushed ice</b>.
                </p>
              </div>
            ) : waterTemp > 25 ? (
              <div className="bg-red-50 border-2 border-red-950 rounded-none p-3 text-xs text-red-950 space-y-1.5 brutalist-shadow">
                <div className="flex items-center gap-1.5 font-black uppercase font-mono">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-[#E60012]" />
                  <span>DANGER: HIGH TEMPERATURE</span>
                </div>
                <p className="leading-normal text-[11px]">
                  Calculated water is warm. High temps speed fermentation uncontrollably.
                  Consider pre-chilling flour or using fridge fermentation right after mixing.
                </p>
              </div>
            ) : (
              <div className="bg-emerald-50 border-2 border-emerald-900 rounded-none p-3 text-xs text-emerald-900 flex gap-2 items-start brutalist-shadow">
                <Info className="w-4 h-4 shrink-0 text-emerald-800 mt-0.5 animate-pulse" />
                <span className="text-[11px] leading-normal font-medium">
                  Ideal trainable temperature range. Tap or bottled water adjusted to exactly <b>{waterTemp}°C</b> is stable.
                </span>
              </div>
            )}

            <div className="bg-slate-100 border border-slate-300 rounded-none p-2.5 text-[10px] leading-relaxed text-slate-600 font-mono">
              ★ <b>Matrix Interpretation:</b> <br />
              - Kitchen is warm → water must be colder <br />
              - Mix machine operates → friction increases → water must be colder <br />
              - Everything is frozen → water must be warmer
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
