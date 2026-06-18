/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { PizzaRecipe, MixingMethodType } from '../types';
import DoughProcess3D from './DoughProcess3D';
import {
  Scale, RefreshCw, Layers, Play,
  BookOpen, Clock, Sparkles, Info, ChevronDown, ChevronUp, Layers2,
} from 'lucide-react';

interface DoughCalculatorProps {
  recipe: PizzaRecipe;
  onChange: (updatedRecipe: PizzaRecipe) => void;
  onSendToFdt?: (flourWeight: number, waterWeight: number) => void;
  onSendToJournal?: (calculatedRecipe: PizzaRecipe, weights: CalculatedWeights) => void;
  selectedMixer: MixingMethodType;
  onMixerChange: (method: MixingMethodType) => void;
}

export interface CalculatedWeights {
  flour: number;
  water: number;
  salt: number;
  yeast: number;
  oil: number;
  sugar: number;
  total: number;
}

export type PortionType = 'ball' | 'slab' | 'flatbread';

export interface PizzaPreset {
  id: string;
  name: string;
  shortName: string;
  badge: string;
  description: string;
  hydration: number;
  saltPercent: number;
  yeastPercent: number;
  oilPercent: number;
  sugarPercent: number;
  ballWeight: number;
  portionType: PortionType;
  portionLabel: string;       // singular: "ball", "tray", "pan", "flatbread"
  portionLabelPlural: string; // plural:   "balls", "trays", "pans", "flatbreads"
  yeastType: 'dry' | 'fresh';
  timings: {
    bulkRT: string;
    bulkCold: string;
    ballRT: string;
    ballCold: string;
    bakeTemp: string;        // professional / high-heat version
    bakeTime: string;
    bakeTempHome?: string;   // home oven ≤250°C alternative
    bakeTimeHome?: string;
    homeNote?: string;       // warning shown when home oven selected
  };
  steps: string[];
}

export const PIZZA_PRESETS: PizzaPreset[] = [
  {
    id: 'beginner',
    name: 'Beginner Direct 24h',
    shortName: 'Beginner',
    badge: 'DIRECT_24H',
    description: "The foundational direct-ferment recipe by Benjamin Schmitz (Dough Control). Room temp bulk + cold chain fridge. Most forgiving entry point for consistent, repeatable results.",
    hydration: 65,
    saltPercent: 2.5,
    yeastPercent: 0.13,
    oilPercent: 0,
    sugarPercent: 0,
    ballWeight: 280,
    portionType: 'ball', portionLabel: 'ball', portionLabelPlural: 'balls',
    yeastType: 'dry',
    timings: {
      bulkRT: '2 hours @ 22°C',
      bulkCold: '16–20 hours @ 7°C',
      ballRT: '3–4 hours @ 22°C',
      ballCold: '0 hours',
      bakeTemp: '450°C (wood-fired) / 300°C+ (Baking Steel)',
      bakeTime: '60–90s (wood) / 4–5 min (steel)',
      bakeTempHome: '250°C max — Baking Steel, bottom rack, 1h preheat',
      bakeTimeHome: '6–9 min',
      homeNote: 'Works well at home with a Baking Steel. No leopard char but excellent open crumb and crust.',
    },
    steps: [
      'Dissolve 1.3g dry yeast (or 4g fresh) in all of the calculated water at 12–15°C.',
      'Add 75% of the {FLOUR} ({W}). Mix by hand until a shaggy mass forms. Rest 15 min — gluten links build passively (autolyse).',
      'Add remaining flour slowly. Knead 15–20 min by hand: push away with heel of palm, fold back, rotate 90°, repeat.',
      'Scatter salt evenly. Knead 3–5 min more until fully smooth and silky.',
      'Shape into a ball, cover, rest 2 hours at room temp (~22°C). Yeast wakes up and begins CO₂ production.',
      'Transfer sealed to fridge (7°C). Cold ferment 16–20 hours. Aroma and acids develop slowly.',
      'Remove. Portion into balls. Rest 3–4 hours at room temp before baking.',
      'Bake at maximum available heat — see bake temperature above. Preheat steel or stone at least 45–60 min before baking.',
    ],
  },
  {
    id: 'neapolitan',
    name: 'Classic Neapolitan',
    shortName: 'Neapolitan',
    badge: 'NAPOLETANA',
    description: 'The ancient standard: direct fermentation at ambient room temperature. No fridge. Soft, airy, hyper-foldable wood-fired crust.',
    hydration: 62,
    saltPercent: 2.8,
    yeastPercent: 0.1,
    oilPercent: 0,
    sugarPercent: 0,
    ballWeight: 250,
    portionType: 'ball', portionLabel: 'ball', portionLabelPlural: 'balls',
    yeastType: 'dry',
    timings: {
      bulkRT: '18 hours @ 20°C',
      bulkCold: '0 hours (not recommended)',
      ballRT: '6 hours @ 20°C',
      ballCold: '0 hours (not recommended)',
      bakeTemp: '430°C – 485°C (wood-fired / Effeuno)',
      bakeTime: '60–90 seconds',
      bakeTempHome: '250°C max — Baking Steel, bottom rack, 1h preheat',
      bakeTimeHome: '7–10 min',
      homeNote: 'True Neapolitan needs 430°C+. At 250°C the cornicione won\'t leopard-char — expect a fuller, bready crust. Still tasty, just not STG-compliant.',
    },
    steps: [
      'Dissolve dry or fresh yeast completely in all of the calculated water.',
      'Blend in roughly 75% of your {FLOUR} ({W}). Mix by hand until a wet cohesive batter forms. Rest 15–20 min (autolyse).',
      'Scatter the fine sea salt onto the batter, then add remaining flour progressively.',
      'Knead thoroughly until a silky, strong gluten network is formed.',
      'Shape into a single ball, cover, ferment at ambient room temp (18–21°C) for exactly 18 hours.',
      'Divide into 250g pieces. Tuck and roll tightly from bottom to top.',
      'Place balls in covered proofing boxes. Proof at room temp for another 6 hours.',
      'Stretch from center outwards. Form a thin center and puffy rim (cornicione). Bake at maximum available heat — see bake temperature above.',
    ],
  },
  {
    id: 'canotto',
    name: 'Contemporary Neapolitan (Canotto)',
    shortName: 'Canotto',
    badge: 'CANOTTO',
    description: 'The modern "lifeboat" style with an extremely big, puffy, alveolated rim. Higher hydration and slow cold fermentation.',
    hydration: 70,
    saltPercent: 2.5,
    yeastPercent: 0.14,
    oilPercent: 0,
    sugarPercent: 0,
    ballWeight: 280,
    portionType: 'ball', portionLabel: 'ball', portionLabelPlural: 'balls',
    yeastType: 'dry',
    timings: {
      bulkRT: '2 hours @ 20°C',
      bulkCold: '24–40 hours @ 4–6°C',
      ballRT: '4–6 hours @ 20°C',
      ballCold: '0 hours',
      bakeTemp: '400°C – 430°C (wood-fired / Effeuno / deck oven)',
      bakeTime: '70–100 seconds',
      bakeTempHome: '250°C max — Baking Steel, top rack, 1h preheat',
      bakeTimeHome: '8–12 min',
      homeNote: 'Canotto\'s alveolated rim needs high heat to set quickly. At 250°C the rim rises fully but won\'t char — still a beautiful open crumb.',
    },
    steps: [
      'Stir yeast into cold water. Whisk in 70% of flour to form a thick shaggy paste. Sit 30 min (amylase activation).',
      'Add salt and remaining flour. Work the high-hydration mass with stretch-and-fold until it gains structural strength.',
      'Leave covered at 20°C for 2 hours to wake up the yeast.',
      'Store in sealed container in fridge (4–6°C) for 24–48 hours.',
      'Remove cold dough. Slice into 280g balls. Tension tightly to preserve internal gas pockets.',
      'Proof in closed containers at room temp for 4–6 hours. Balls will grow lightweight.',
      'Stretch using the "slap" method, avoiding the outer 2cm rim. Cook on high deck heat.',
    ],
  },
  {
    id: 'newyork',
    name: 'New York Style',
    shortName: 'New York',
    badge: 'NY SLICE',
    description: 'Classic crispy-chewy deck-oven pie. Added olive oil for a supple crumb, sugar/malt for Maillard browning.',
    hydration: 60,
    saltPercent: 2.2,
    yeastPercent: 0.35,
    oilPercent: 2,
    sugarPercent: 1,
    ballWeight: 380,
    portionType: 'ball', portionLabel: 'ball', portionLabelPlural: 'balls',
    yeastType: 'dry',
    timings: {
      bulkRT: '1 hour @ 22°C',
      bulkCold: '24–72 hours @ 4°C',
      ballRT: '3–4 hours @ 22°C',
      ballCold: '12–24 hours @ 4°C (optional)',
      bakeTemp: '260°C – 280°C (Baking Steel / deck oven)',
      bakeTime: '6–9 minutes',
      bakeTempHome: '240–250°C max — Baking Steel, bottom rack, 1h preheat',
      bakeTimeHome: '8–11 min',
      homeNote: 'NY Style works well at home. The sugar/oil aid Maillard browning even at lower temps.',
    },
    steps: [
      'Mix flour, dry yeast, and 1% sugar or barley malt in a dry bowl.',
      'Add room temp water and mix for 3 min.',
      'Drizzle in 2% olive oil along with the sea salt. Knead 7–9 min. Oil lubricates protein strands for the hallmark chewy NY crumb.',
      'Bulk rise at room temp for 1 hour.',
      'Slice into 380g pieces. Roll into smooth, dense balls.',
      'Store in lightly oiled tubs in fridge (4°C) for 24–72 hours (48h = peak flavor).',
      'Bring balls to room temp 3–4 hours before baking to relax gluten.',
      'Stretch on semolina, top with low-moisture mozzarella, bake on preheated steel at 275°C.',
    ],
  },
  {
    id: 'teglia',
    name: 'Pizza in Teglia (Roman Pan)',
    shortName: 'Teglia',
    badge: 'ROMAN PAN',
    description: 'Super-airy rectangular pan pizza. Fried, crispy golden bottom and light, spongy internal voids.',
    hydration: 80,
    saltPercent: 2.5,
    yeastPercent: 0.45,
    oilPercent: 2,
    sugarPercent: 0,
    ballWeight: 750,
    portionType: 'slab', portionLabel: 'tray', portionLabelPlural: 'trays',
    yeastType: 'dry',
    timings: {
      bulkRT: '1 hour @ 20°C',
      bulkCold: '24–48 hours @ 4°C',
      ballRT: '3–4 hours @ 21°C',
      ballCold: '0 hours',
      bakeTemp: '250°C (top+bottom heat + convection, blue steel pan)',
      bakeTime: '12–15 minutes',
      bakeTempHome: '250°C (top+bottom heat + convection, blue steel pan)',
      bakeTimeHome: '12–15 minutes',
    },
    steps: [
      'Blend flour and yeast. Pour 80% of cooled water slowly at low speed.',
      'Add salt. Drip remaining 20% water via bassinage — let flour absorb each addition.',
      'Drizzle 2% olive oil at the end to seal the high-hydration matrix.',
      'Perform 3 series of coil folds on the bench, resting 20 min between each.',
      'Store in large greased container in fridge (4°C) for 24–48 hours.',
      'Divide into 750g slabs. Place in well-oiled proofing bins at room temp for 3–4 hours.',
      'Press with warm fingertips in grid patterns to create deep air pockets. Lay in oiled blue-steel pan.',
      'First bake bottom shelf (7–8 min). Top with sauce and cheese. Move to top shelf to melt (5–7 min).',
    ],
  },
  {
    id: 'tonda',
    name: 'Roman Tonda (Thin & Crispy)',
    shortName: 'Tonda',
    badge: 'TONDA',
    description: 'Paper-thin, ultra-crisp street pizza with zero rim. Rolled flat with a pin for uniform cracker consistency.',
    hydration: 55,
    saltPercent: 2.0,
    yeastPercent: 0.18,
    oilPercent: 3,
    sugarPercent: 0,
    ballWeight: 180,
    portionType: 'flatbread', portionLabel: 'flatbread', portionLabelPlural: 'flatbreads',
    yeastType: 'dry',
    timings: {
      bulkRT: '2 hours @ 20°C',
      bulkCold: '20 hours @ 4°C',
      ballRT: '3 hours @ 22°C',
      ballCold: '0 hours',
      bakeTemp: '300°C – 330°C (Baking Steel / Effeuno)',
      bakeTime: '3–4 minutes',
      bakeTempHome: '250°C max — Baking Steel, top rack, 1h preheat',
      bakeTimeHome: '5–7 min',
      homeNote: 'Tonda is best at 300°C+. At 250°C the cracker-crispness is slightly softer — roll even thinner (< 1mm) to compensate.',
    },
    steps: [
      'Combine flour, yeast, cold water, and 3% olive oil. Mix on slow speed — 55% hydration makes a stiff, dense mass.',
      'Add fine sea salt. Knead intensely 10–12 min until structural strands are tight.',
      'Rest at warm room temp for 2 hours (mild enzymatic fermentation).',
      'Mature in fridge for 20 hours to relax gluten tension.',
      'Slice into 180g pieces. Roll into ultra-tight, smooth spheres.',
      'Rest balls in proofing tray 3 hours at room temp.',
      'Roll with a rolling pin from center outwards until translucent (< 1.5mm). Zero rim allowed.',
      'Bake on hot steel/stone at 300°C+ until completely dry, stiff, and crisp.',
    ],
  },
  {
    id: 'detroit',
    name: 'Detroit Style',
    shortName: 'Detroit',
    badge: 'DETROIT PAN',
    description: 'Thick rectangular pan pizza for home ovens. Spongy crumb with a crispy fried bottom and caramelized cheese walls (Frico).',
    hydration: 70,
    saltPercent: 2.5,
    yeastPercent: 0.45,
    oilPercent: 2,
    sugarPercent: 0,
    ballWeight: 450,
    portionType: 'slab', portionLabel: 'pan', portionLabelPlural: 'pans',
    yeastType: 'dry',
    timings: {
      bulkRT: '2 hours @ 21°C',
      bulkCold: '24–48 hours @ 4°C',
      ballRT: '3 hours in oiled pan @ 24°C',
      ballCold: '0 hours',
      bakeTemp: '250°C (top+bottom heat, bottom rack)',
      bakeTime: '12–15 minutes',
      bakeTempHome: '250°C (top+bottom heat, bottom rack)',
      bakeTimeHome: '12–15 minutes',
    },
    steps: [
      'Blend flour, yeast, and very cold water. Mix 4 min until hydrated.',
      'Add salt and 2% olive oil. Knead 7–9 min until gluten holds structured tension.',
      'Rest covered at room temp for exactly 2 hours.',
      'Transfer to fridge (4°C) for 24–48 hours to fully digest starch bonds.',
      'Coat a 10×14 heavy pan with 2 tbsp olive oil. Press dough outward until it touches all four corners.',
      'Proof uncovered in a warm kitchen for 3 hours until double in thickness and bubbly.',
      'Lay mild cheese (Butterkäse or Mozzarella-Cheddar blend) all the way to the edges. Add two parallel lines of thick tomato sauce.',
      'Bake on lowest rack 12–15 min until bottom is fried and cheese edges are caramelized.',
    ],
  },
  {
    id: 'flammkuchen',
    name: 'Classic Flammkuchen',
    shortName: 'Flammkuchen',
    badge: 'ALSATIAN',
    description: 'The iconic Alsatian/German flatbread. Paper-thin, extremely crispy, topped with Creme Fraiche, onions, and Speck.',
    hydration: 50,
    saltPercent: 2.0,
    yeastPercent: 0.05,
    oilPercent: 3,
    sugarPercent: 0,
    ballWeight: 155,
    portionType: 'flatbread', portionLabel: 'flatbread', portionLabelPlural: 'flatbreads',
    yeastType: 'dry',
    timings: {
      bulkRT: '1 hour @ 21°C',
      bulkCold: '0 hours',
      ballRT: '1 hour @ 22°C',
      ballCold: '0 hours',
      bakeTemp: '275°C – 300°C (top+bottom heat + Baking Steel)',
      bakeTime: '4–5 minutes',
      bakeTempHome: '250°C max — top+bottom heat + Baking Steel, top rack',
      bakeTimeHome: '6–9 min',
      homeNote: 'At 250°C edges won\'t bubble black — still crisp and delicious, just less dramatic char. Roll it paper-thin.',
    },
    steps: [
      'Whisk {FLOUR}, salt, water, 3% neutral sunflower oil, and a tiny pinch of yeast.',
      'Knead intensely 10 min until the dough is stiff, slick, and completely non-sticky.',
      'Cover on counter for 1 hour at room temp — resting relaxes gluten so you can roll paper-thin without spring-back.',
      'Slice into 150–160g portions. Roll into smooth, dry spheres. Rest covered 45 min more.',
      'Roll from center outwards with a rolling pin until ultra-thin (< 1.5mm) and translucent.',
      'Spread crème fraîche (or thick sour cream) seasoned with nutmeg and pepper. Top with diced smoked bacon and sliced red onion.',
      'Slide onto preheated baking steel on oven\'s top rack. Cook 4–5 min until edges bubble and char and crust is completely rigid.',
    ],
  },
  {
    id: 'focaccia',
    name: 'Genoese Focaccia',
    shortName: 'Focaccia',
    badge: 'FOCACCIA',
    description: 'Classic olive oil flatbread (Focaccia Genovese). Crispy outside, thick and cushiony inside with deep brine-filled finger dimples.',
    hydration: 75,
    saltPercent: 2.8,
    yeastPercent: 0.5,
    oilPercent: 3,
    sugarPercent: 0,
    ballWeight: 600,
    portionType: 'slab', portionLabel: 'tray', portionLabelPlural: 'trays',
    yeastType: 'dry',
    timings: {
      bulkRT: '2 hours @ 21°C',
      bulkCold: '18–24 hours @ 4°C',
      ballRT: '3 hours on baking sheet @ 22°C',
      ballCold: '0 hours',
      bakeTemp: '220°C – 230°C (top+bottom heat)',
      bakeTime: '15–20 minutes',
      bakeTempHome: '220°C – 230°C (top+bottom heat, middle rack)',
      bakeTimeHome: '15–20 minutes',
    },
    steps: [
      'Dissolve yeast in calculated water. Drizzle in 3% cold-pressed olive oil. Add 80% of flour and mix.',
      'Add salt and remaining flour progressively. Knead 8–10 min. For high hydration use stretch-and-fold, not extra flour.',
      'Cover and rest 45 min, then carry out two coil folds. Bulk ferment at room temp for 2 hours.',
      'Save in fridge at 4°C for 18–24 hours to gain deep yeasty aroma.',
      'Oil a rectangular baking sheet generously. Transfer cold dough. Rest 20 min, then press outwards until it fills the tray.',
      'Rise at room temp 2–3 hours. Mix brine: 3 tbsp warm water, 2 tbsp olive oil, 1 tsp salt. Drizzle over dough. Press fingers deep to create craters.',
      'Rest 45 min more in a warm kitchen to let craters inflate.',
      'Bake at 230°C on lower-middle shelf 15–20 min until golden and crispy. Brush with extra olive oil immediately.',
    ],
  },
];

export interface FlourType {
  id: string;
  name: string;
  germanLabel: string;
  wValue: string;
  wMin: number;
  wMax: number;
  proteinRange: string;
  proteinMin: number;
  proteinMax: number;
  recommendedHydration: { min: number; max: number };
  description: string;
  alterationTip: string;
}

export const FLOUR_TYPES: FlourType[] = [
  {
    id: 'typ00_import',
    name: 'Imported Italian Tipo 00',
    germanLabel: 'Tipo 00 (Imported)',
    wValue: 'W280–350',
    wMin: 280, wMax: 350,
    proteinRange: '12.5–13.5%',
    proteinMin: 12.5, proteinMax: 13.5,
    recommendedHydration: { min: 62, max: 70 },
    description: 'Elite high-strength imported Italian specialty flour (Caputo, 5 Stagioni). Strong, elastic gluten for high-temperature ovens.',
    alterationTip: 'Perfect for Neapolitan. Safely supports hydration up to 70%. Kneads beautifully and tolerates long fermentation.',
  },
  {
    id: 'typ00_supermarket',
    name: 'German Supermarket Tipo 00',
    germanLabel: 'Tipo 00 (Supermarket)',
    wValue: 'W180–220',
    wMin: 180, wMax: 220,
    proteinRange: '10.5–11.5%',
    proteinMin: 10.5, proteinMax: 11.5,
    recommendedHydration: { min: 58, max: 62 },
    description: 'Domestic German supermarket pizza flour (Aurora, Diamant, K-Classic, Gut & Günstig). Standard gluten framework.',
    alterationTip: 'Lower W-value than Italian imports. Limit hydration to 58–62% to avoid sticky, unworkable dough.',
  },
  {
    id: 'typ550',
    name: 'Wheat Flour Type 550',
    germanLabel: 'Wheat Flour Type 550',
    wValue: 'W230–280',
    wMin: 230, wMax: 280,
    proteinRange: '11.5–12.8%',
    proteinMin: 11.5, proteinMax: 12.8,
    recommendedHydration: { min: 60, max: 64 },
    description: 'Standard German bread flour (Aurora, Diamant). Excellent gluten strength. Found in every German supermarket.',
    alterationTip: 'Very reliable. Safe hydration: 60–64%. Going above 64% needs bassinage (dripping water slowly) or folding.',
  },
  {
    id: 'typ630',
    name: 'Spelt Flour Type 630',
    germanLabel: 'Spelt Flour Type 630',
    wValue: 'W150–200',
    wMin: 150, wMax: 200,
    proteinRange: '12.5–14.0%',
    proteinMin: 12.5, proteinMax: 14.0,
    recommendedHydration: { min: 58, max: 60 },
    description: 'Organic spelt wheat (dm-Bio, Alnatura). High protein but fragile extensible gluten that slacks quickly.',
    alterationTip: 'Spelt gluten tears under heavy kneading. Cut kneading time in half or use hand-only. Keep hydration ≤60%.',
  },
  {
    id: 'typ405',
    name: 'Wheat Flour Type 405',
    germanLabel: 'Wheat Flour Type 405',
    wValue: 'W100–160',
    wMin: 100, wMax: 160,
    proteinRange: '9.0–10.5%',
    proteinMin: 9.0, proteinMax: 10.5,
    recommendedHydration: { min: 55, max: 58 },
    description: 'German standard cake & pastry flour. Low protein content and weak gluten elasticity.',
    alterationTip: 'Poor absorption — hydration above 58% turns Type 405 into sticky mush. Restrict to 55–58%. Best mixed with a stronger bread flour for pizza use.',
  },
];

type PizzaSize = 'S' | 'M' | 'L';
const SIZE_FACTORS: Record<PizzaSize, number> = { S: 0.82, M: 1.0, L: 1.22 };

const MIXER_OPTIONS: { id: MixingMethodType; label: string; short: string; friction: string }[] = [
  { id: 'hand',   label: 'By Hand',     short: 'Hand',   friction: '+3°C' },
  { id: 'stand',  label: 'Stand Mixer', short: 'Stand',  friction: '+6.5°C' },
  { id: 'spiral', label: 'Spiral Mixer',short: 'Spiral', friction: '+10°C' },
];

// ─── Step header ─────────────────────────────────────────────────────────────
function StepHeader({ num, title, sub }: { num: string; title: string; sub?: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-[9px] font-black font-mono text-white bg-[#E60012] px-1.5 py-0.5 shrink-0">{num}</span>
      <div className="min-w-0">
        <span className="text-[11px] font-black uppercase tracking-widest text-slate-900">{title}</span>
        {sub && <span className="text-[9px] text-slate-400 font-mono ml-2">{sub}</span>}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function DoughCalculator({
  recipe,
  onChange,
  onSendToFdt,
  onSendToJournal,
  selectedMixer,
  onMixerChange,
}: DoughCalculatorProps) {
  const {
    numBalls, ballWeight, hydration, saltPercent,
    yeastPercent, yeastType, oilPercent = 0, sugarPercent = 0,
  } = recipe;

  const [activePresetId, setActivePresetId]   = useState<string>('beginner');
  const [displayPresetId, setDisplayPresetId] = useState<string>('beginner');
  const [selectedFlourId, setSelectedFlourId] = useState<string>('typ00_import');
  const [pizzaSize, setPizzaSize]             = useState<PizzaSize>('M');
  const [showAdvanced, setShowAdvanced]       = useState(false);
  const [showOil, setShowOil]                 = useState(false);
  const [showSugar, setShowSugar]             = useState(false);
  const [activeGermanTab, setActiveGermanTab] = useState<'flour' | 'oven'>('flour');
  const [blendEnabled, setBlendEnabled]       = useState(false);
  const [blendSecondId, setBlendSecondId]     = useState<string>('typ550');
  const [blendPrimaryPct, setBlendPrimaryPct] = useState<number>(70);
  const [ovenType, setOvenType]               = useState<'home' | 'pro'>('home');

  // Tracks the base ball weight of the last explicitly chosen preset (used for S/M/L scaling)
  const baseBallWeightRef = useRef<number>(280);

  const primaryFlour = useMemo(
    () => FLOUR_TYPES.find(f => f.id === selectedFlourId) || FLOUR_TYPES[0],
    [selectedFlourId]
  );
  const secondFlour = useMemo(
    () => FLOUR_TYPES.find(f => f.id === blendSecondId) || FLOUR_TYPES[2],
    [blendSecondId]
  );
  const secondPct = 100 - blendPrimaryPct;

  // Effective (possibly blended) flour — memoised so it's stable unless inputs change
  const selectedFlour: FlourType = useMemo(() => {
    if (!blendEnabled) return primaryFlour;
    return {
      ...primaryFlour,
      wValue: `W${Math.round((primaryFlour.wMin * blendPrimaryPct + secondFlour.wMin * secondPct) / 100)}–${Math.round((primaryFlour.wMax * blendPrimaryPct + secondFlour.wMax * secondPct) / 100)}`,
      wMin: Math.round((primaryFlour.wMin * blendPrimaryPct + secondFlour.wMin * secondPct) / 100),
      wMax: Math.round((primaryFlour.wMax * blendPrimaryPct + secondFlour.wMax * secondPct) / 100),
      proteinRange: `${((primaryFlour.proteinMin * blendPrimaryPct + secondFlour.proteinMin * secondPct) / 100).toFixed(1)}–${((primaryFlour.proteinMax * blendPrimaryPct + secondFlour.proteinMax * secondPct) / 100).toFixed(1)}%`,
      proteinMin: (primaryFlour.proteinMin * blendPrimaryPct + secondFlour.proteinMin * secondPct) / 100,
      proteinMax: (primaryFlour.proteinMax * blendPrimaryPct + secondFlour.proteinMax * secondPct) / 100,
      recommendedHydration: {
        min: Math.round((primaryFlour.recommendedHydration.min * blendPrimaryPct + secondFlour.recommendedHydration.min * secondPct) / 100),
        max: Math.round((primaryFlour.recommendedHydration.max * blendPrimaryPct + secondFlour.recommendedHydration.max * secondPct) / 100),
      },
      germanLabel: `${blendPrimaryPct}% ${primaryFlour.germanLabel} + ${secondPct}% ${secondFlour.germanLabel}`,
      alterationTip: `Blend: ${primaryFlour.alterationTip} / ${secondFlour.alterationTip}`,
    };
  }, [blendEnabled, primaryFlour, secondFlour, blendPrimaryPct, secondPct]);

  // ── Auto-calculate the best hydration for a given preset + flour combination ──
  const clampHydration = (raw: number, flour: FlourType) =>
    Math.min(flour.recommendedHydration.max, Math.max(flour.recommendedHydration.min, raw));

  // ── Load a preset (auto-adjusts hydration for currently selected flour) ──
  const handleSelectPreset = (presetId: string) => {
    setActivePresetId(presetId);
    if (presetId !== 'custom') setDisplayPresetId(presetId);
    if (presetId === 'custom') return;

    const preset = PIZZA_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    baseBallWeightRef.current = preset.ballWeight;
    setPizzaSize('M');

    const optimalHydration = clampHydration(preset.hydration, selectedFlour);
    setShowOil(preset.oilPercent > 0);
    setShowSugar(preset.sugarPercent > 0);

    onChange({
      numBalls,
      ballWeight: preset.ballWeight,
      hydration: optimalHydration,
      saltPercent: preset.saltPercent,
      yeastPercent: preset.yeastPercent,
      yeastType: preset.yeastType,
      oilPercent: preset.oilPercent,
      sugarPercent: preset.sugarPercent,
    });
  };

  // ── Select flour → auto-clamp hydration immediately, no warnings ──
  const handleSelectFlour = (flourId: string) => {
    setSelectedFlourId(flourId);
    const newPrimary = FLOUR_TYPES.find(f => f.id === flourId)!;

    // Resolve which second flour will be active after this change (may need fallback)
    let resolvedSecond = secondFlour;
    if (blendEnabled && blendSecondId === flourId) {
      const fallback = FLOUR_TYPES.find(f => f.id !== flourId);
      if (fallback) {
        resolvedSecond = fallback; // use the new value immediately for clamping
        setBlendSecondId(fallback.id);
      }
    }

    const effectiveMin = blendEnabled
      ? Math.round((newPrimary.recommendedHydration.min * blendPrimaryPct + resolvedSecond.recommendedHydration.min * (100 - blendPrimaryPct)) / 100)
      : newPrimary.recommendedHydration.min;
    const effectiveMax = blendEnabled
      ? Math.round((newPrimary.recommendedHydration.max * blendPrimaryPct + resolvedSecond.recommendedHydration.max * (100 - blendPrimaryPct)) / 100)
      : newPrimary.recommendedHydration.max;
    const clamped = Math.min(effectiveMax, Math.max(effectiveMin, hydration));
    if (clamped !== hydration) onChange({ ...recipe, hydration: clamped });
  };

  // ── Pizza size (S / M / L) scales ball weight relative to preset default ──
  const handleSelectSize = (size: PizzaSize) => {
    setPizzaSize(size);
    const base = baseBallWeightRef.current;
    const newWeight = Math.round((base * SIZE_FACTORS[size]) / 5) * 5;
    onChange({ ...recipe, ballWeight: newWeight });
  };

  // ── Sync activePresetId highlight when user fine-tunes in Advanced ──
  useEffect(() => {
    const { min, max } = selectedFlour.recommendedHydration;
    const clamp = (v: number) => Math.min(max, Math.max(min, v));
    const match = PIZZA_PRESETS.find(p => {
      // ballWeight must match one of the S/M/L scaled values for this preset
      const validWeights = (['S', 'M', 'L'] as PizzaSize[]).map(s =>
        Math.round((p.ballWeight * SIZE_FACTORS[s]) / 5) * 5
      );
      return (
        hydration    === clamp(p.hydration) &&
        saltPercent  === p.saltPercent &&
        yeastPercent === p.yeastPercent &&
        yeastType    === p.yeastType &&
        oilPercent   === p.oilPercent &&
        sugarPercent === p.sugarPercent &&
        validWeights.includes(ballWeight)
      );
    });
    setActivePresetId(match ? match.id : 'custom');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydration, saltPercent, yeastPercent, yeastType, oilPercent, sugarPercent, ballWeight, selectedFlourId, blendEnabled, blendSecondId, blendPrimaryPct]);

  const updateField = <K extends keyof PizzaRecipe>(field: K, value: PizzaRecipe[K]) =>
    onChange({ ...recipe, [field]: value });

  // ── Baker's percentage weight calculation ──
  const calculateWeights = (): CalculatedWeights => {
    const total = numBalls * ballWeight;
    const divisor = 1 + hydration / 100 + saltPercent / 100 + yeastPercent / 100
      + oilPercent / 100 + sugarPercent / 100;
    const flour  = Number((total / divisor).toFixed(1));
    const water  = Number((flour * hydration / 100).toFixed(1));
    const salt   = Number((flour * saltPercent / 100).toFixed(1));
    const yDry   = Number((flour * yeastPercent / 100).toFixed(2));
    const oil    = Number((flour * oilPercent / 100).toFixed(1));
    const sugar  = Number((flour * sugarPercent / 100).toFixed(1));
    return {
      flour, water, salt,
      yeast: yeastType === 'fresh' ? Number((yDry * 3.07).toFixed(1)) : yDry,
      oil, sugar, total,
    };
  };

  const weights = calculateWeights();
  const activePreset = PIZZA_PRESETS.find(p => p.id === displayPresetId);

  // Portion terminology — follows the *active* selection (not the display card)
  // so Step 03 labels stay correct when the user tweaks params into Custom mode
  const activePresetForPortion = PIZZA_PRESETS.find(p => p.id === activePresetId);
  const portion = {
    label:        activePresetForPortion?.portionLabel       ?? 'ball',
    plural:       activePresetForPortion?.portionLabelPlural ?? 'balls',
    type:         activePresetForPortion?.portionType        ?? 'ball',
    isSlab:       activePresetForPortion?.portionType === 'slab',
    isFlatbread:  activePresetForPortion?.portionType === 'flatbread',
  };

  // Replaces {FLOUR} and {W} tokens in step strings with the selected flour's name/W-value
  const renderStep = (step: string) =>
    step.includes('{')
      ? step.replace(/{FLOUR}/g, selectedFlour.germanLabel).replace(/{W}/g, selectedFlour.wValue)
      : step;

  // Status: is the current hydration safe for the currently selected flour?
  const hydrationRangeStatus = (() => {
    const { min, max } = selectedFlour.recommendedHydration;
    if (hydration < min) return { ok: false, msg: `⚡ ${hydration}% is below the ${min}% minimum — raise it or switch flour` };
    if (hydration > max) return { ok: false, msg: `⚡ ${hydration}% exceeds ${max}% safe max for this flour — may tear or stick` };
    return { ok: true, msg: `✓ ${hydration}% is within safe range (${min}–${max}%) for ${selectedFlour.germanLabel}` };
  })();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="dough-calculator-section">

      {/* ══════════════ LEFT: CONFIG PANEL ══════════════ */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        <div className="bg-white border-2 border-slate-900 brutalist-shadow">

          {/* ── 01: Pizza Style ── */}
          <div className="p-5 border-b border-slate-200">
            <StepHeader num="01" title="Pizza Style" sub="pick your fermentation protocol" />
            <div className="grid grid-cols-3 gap-1.5">
              {PIZZA_PRESETS.map((preset) => {
                const isActive = activePresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset.id)}
                    className={`p-2 text-left border-2 rounded-none transition-all flex flex-col gap-0.5 ${
                      isActive
                        ? 'bg-slate-900 border-slate-900 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-[9px] font-black uppercase tracking-tight block leading-tight">
                      {preset.shortName}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      <span className={`text-[7px] font-mono ${isActive ? 'text-white/60' : 'text-slate-400'}`}>
                        {preset.hydration}%
                      </span>
                      {preset.oilPercent > 0 && (
                        <span className={`text-[6px] font-mono px-0.5 border ${isActive ? 'border-white/20 text-white/40' : 'border-slate-300 text-slate-400'}`}>OIL</span>
                      )}
                    </div>
                  </button>
                );
              })}
              <button
                onClick={() => handleSelectPreset('custom')}
                className={`p-2 text-left border-2 rounded-none transition-all ${
                  activePresetId === 'custom'
                    ? 'bg-[#E60012] border-slate-900 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-700'
                }`}
              >
                <span className="text-[9px] font-black uppercase block">Custom</span>
                <span className={`text-[7px] font-mono ${activePresetId === 'custom' ? 'text-white/70' : 'text-slate-400'}`}>manual</span>
              </button>
            </div>
          </div>

          {/* ── 02: Flour ── */}
          <div className="p-5 border-b border-slate-200">
            <StepHeader num="02" title="Flour" sub="hydration auto-adjusts to flour's safe range" />
            <div className="grid grid-cols-1 gap-1.5">
              {FLOUR_TYPES.map((f) => {
                const isActive = selectedFlourId === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => handleSelectFlour(f.id)}
                    className={`px-3 py-2 text-left border-2 rounded-none transition-all flex items-center gap-3 ${
                      isActive
                        ? 'bg-slate-900 border-slate-900 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-black uppercase tracking-tight block truncate">
                        {f.germanLabel}
                      </span>
                      <span className={`text-[8px] font-mono ${isActive ? 'text-white/50' : 'text-slate-400'}`}>
                        {f.proteinRange} protein
                      </span>
                    </div>
                    <span className={`text-[11px] font-black font-mono shrink-0 ${isActive ? 'text-[#E60012]' : 'text-slate-700'}`}>
                      {f.wValue}
                    </span>
                    <span className={`text-[8px] font-mono shrink-0 ${isActive ? 'text-white/60' : 'text-slate-400'}`}>
                      {f.recommendedHydration.min}–{f.recommendedHydration.max}%
                    </span>
                  </button>
                );
              })}
            </div>
            {/* Hydration range status — always visible */}
            <div className={`mt-2 px-2.5 py-1.5 flex items-center gap-1.5 border text-[9px] font-mono font-bold ${
              hydrationRangeStatus.ok
                ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                : 'bg-amber-50 border-amber-400 text-amber-800'
            }`}>
              {hydrationRangeStatus.msg}
            </div>

            {/* ── Flour blend toggle ── */}
            <div className="mt-3 border-t border-slate-100 pt-3">
              <button
                onClick={() => {
                  const next = !blendEnabled;
                  setBlendEnabled(next);
                  if (next) {
                    // Re-clamp hydration to blended range when blend is switched on
                    const secondF = FLOUR_TYPES.find(f => f.id === blendSecondId) || FLOUR_TYPES[2];
                    const blendedMin = Math.round((primaryFlour.recommendedHydration.min * blendPrimaryPct + secondF.recommendedHydration.min * (100 - blendPrimaryPct)) / 100);
                    const blendedMax = Math.round((primaryFlour.recommendedHydration.max * blendPrimaryPct + secondF.recommendedHydration.max * (100 - blendPrimaryPct)) / 100);
                    const clamped = Math.min(blendedMax, Math.max(blendedMin, hydration));
                    if (clamped !== hydration) onChange({ ...recipe, hydration: clamped });
                  } else {
                    // Re-clamp to single flour range when blend disabled
                    const clamped = clampHydration(hydration, primaryFlour);
                    if (clamped !== hydration) onChange({ ...recipe, hydration: clamped });
                  }
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 border text-[9px] font-black uppercase tracking-widest transition-all ${
                  blendEnabled
                    ? 'bg-slate-900 border-slate-900 text-white'
                    : 'bg-slate-50 border-slate-300 text-slate-600 hover:border-slate-700'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Layers2 className="w-3 h-3" />
                  Blend Two Flours
                </span>
                <span className={`text-[8px] font-mono ${blendEnabled ? 'text-white/60' : 'text-slate-400'}`}>
                  {blendEnabled ? 'ON — click to disable' : 'optional'}
                </span>
              </button>

              {blendEnabled && (
                <div className="mt-2.5 space-y-2.5 bg-slate-50 border border-slate-200 p-3">
                  {/* Second flour picker */}
                  <div>
                    <span className="text-[9px] font-mono text-slate-500 uppercase block mb-1.5">Second flour</span>
                    <div className="flex flex-col gap-1">
                      {FLOUR_TYPES.filter(f => f.id !== selectedFlourId).map(f => (
                        <button
                          key={f.id}
                          onClick={() => {
                            setBlendSecondId(f.id);
                            const bMin = Math.round((primaryFlour.recommendedHydration.min * blendPrimaryPct + f.recommendedHydration.min * (100 - blendPrimaryPct)) / 100);
                            const bMax = Math.round((primaryFlour.recommendedHydration.max * blendPrimaryPct + f.recommendedHydration.max * (100 - blendPrimaryPct)) / 100);
                            const clamped = Math.min(bMax, Math.max(bMin, hydration));
                            if (clamped !== hydration) onChange({ ...recipe, hydration: clamped });
                          }}
                          className={`px-2.5 py-1.5 text-left border-2 rounded-none transition-all flex items-center justify-between gap-2 ${
                            blendSecondId === f.id
                              ? 'bg-slate-900 border-slate-900 text-white'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-600'
                          }`}
                        >
                          <span className="text-[9px] font-black uppercase truncate">{f.germanLabel}</span>
                          <span className={`text-[9px] font-mono shrink-0 ${blendSecondId === f.id ? 'text-[#E60012]' : 'text-slate-500'}`}>{f.wValue}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Ratio slider */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] font-mono text-slate-500 uppercase">Ratio</span>
                      <span className="text-[9px] font-black font-mono text-slate-900">
                        {blendPrimaryPct}% / {100 - blendPrimaryPct}%
                      </span>
                    </div>
                    <input
                      type="range" min={10} max={90} step={5} value={blendPrimaryPct}
                      onChange={e => {
                        const pct = parseInt(e.target.value);
                        setBlendPrimaryPct(pct);
                        const secondF = FLOUR_TYPES.find(f => f.id === blendSecondId) || FLOUR_TYPES[2];
                        const bMin = Math.round((primaryFlour.recommendedHydration.min * pct + secondF.recommendedHydration.min * (100 - pct)) / 100);
                        const bMax = Math.round((primaryFlour.recommendedHydration.max * pct + secondF.recommendedHydration.max * (100 - pct)) / 100);
                        const clamped = Math.min(bMax, Math.max(bMin, hydration));
                        if (clamped !== hydration) onChange({ ...recipe, hydration: clamped });
                      }}
                      className="w-full h-1.5 bg-slate-200 appearance-none cursor-pointer rounded-none"
                    />
                    <div className="flex justify-between text-[8px] font-mono text-slate-400 mt-0.5">
                      <span>{primaryFlour.germanLabel}</span>
                      <span>{secondFlour.germanLabel}</span>
                    </div>
                  </div>

                  {/* Blended properties summary */}
                  <div className="bg-white border border-slate-900 p-2 font-mono text-[9px] space-y-0.5">
                    <div className="flex justify-between"><span className="text-slate-500">Blended W-value</span><span className="font-black text-[#E60012]">{selectedFlour.wValue}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Blended protein</span><span className="font-black">{selectedFlour.proteinRange}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Safe hydration</span><span className="font-black">{selectedFlour.recommendedHydration.min}–{selectedFlour.recommendedHydration.max}%</span></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── 03: Batch size ── */}
          <div className="p-5 border-b border-slate-200">
            <StepHeader
              num="03"
              title="Batch Size"
              sub={portion.isSlab ? `how many ${portion.plural} + how heavy` : `how many + how big`}
            />
            <div className="flex items-center gap-4">
              {/* Quantity stepper */}
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-mono text-slate-400 uppercase"># {portion.plural}</span>
                <div className="flex items-center border-2 border-slate-900">
                  <button
                    onClick={() => updateField('numBalls', Math.max(1, numBalls - 1))}
                    className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 font-black text-lg leading-none transition-colors"
                  >−</button>
                  <span className="w-10 text-center font-black font-mono text-sm bg-white">{numBalls}</span>
                  <button
                    onClick={() => updateField('numBalls', Math.min(50, numBalls + 1))}
                    className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 font-black text-lg leading-none transition-colors"
                  >+</button>
                </div>
              </div>

              {/* S / M / L size buttons */}
              <div className="flex-1 flex flex-col gap-1">
                <span className="text-[9px] font-mono text-slate-400 uppercase">
                  {portion.isSlab ? 'Portion weight' : portion.isFlatbread ? 'Piece weight' : 'Ball weight'}
                </span>
                <div className="flex gap-1.5">
                  {(['S', 'M', 'L'] as PizzaSize[]).map((size) => {
                    const w = Math.round((baseBallWeightRef.current * SIZE_FACTORS[size]) / 5) * 5;
                    const isActive = pizzaSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => handleSelectSize(size)}
                        className={`flex-1 py-1.5 border-2 rounded-none transition-all flex flex-col items-center ${
                          isActive
                            ? 'bg-slate-900 border-slate-900 text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-[11px] font-black">{size}</span>
                        <span className={`text-[8px] font-mono ${isActive ? 'text-white/60' : 'text-slate-400'}`}>{w}g</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* pan/slab tip */}
            {portion.isSlab && (
              <p className="mt-2 text-[9px] font-mono text-slate-400">
                ★ Slab weight = total dough pressed into one {portion.label}. No ball-shaping step needed.
              </p>
            )}
            {portion.isFlatbread && (
              <p className="mt-2 text-[9px] font-mono text-slate-400">
                ★ Each {portion.label} is rolled flat with a pin — no rounding into a ball.
              </p>
            )}

            {/* Summary line */}
            <div className="mt-2.5 bg-slate-900 text-white px-3 py-1.5 flex items-center justify-between font-mono">
              <span className="text-[9px] uppercase tracking-wide">Total batch</span>
              <span className="text-sm font-black">{numBalls} {portion.plural} × {ballWeight}g = {weights.total}g</span>
            </div>
          </div>

          {/* ── 04: Mixer ── */}
          <div className="p-5 border-b border-slate-200">
            <StepHeader num="04" title="Mixing Method" sub="sets friction factor for water temp calc" />
            <div className="flex gap-1.5">
              {MIXER_OPTIONS.map((m) => {
                const isActive = selectedMixer === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => onMixerChange(m.id)}
                    className={`flex-1 py-2.5 border-2 rounded-none transition-all flex flex-col items-center gap-0.5 ${
                      isActive
                        ? 'bg-slate-900 border-slate-900 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase">{m.short}</span>
                    <span className={`text-[8px] font-mono ${isActive ? 'text-white/60' : 'text-slate-400'}`}>{m.friction}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-[9px] font-mono text-slate-400 mt-1.5">
              FDT calculator below uses this mixer's friction factor automatically.
            </p>
          </div>

          {/* ── 05: Oven Type ── */}
          <div className="p-5 border-b border-slate-200">
            <StepHeader num="05" title="Oven Type" sub="adapts bake temp + time for your setup" />
            <div className="flex gap-1.5">
              {([
                { id: 'home' as const, label: 'Home Oven', sub: '≤ 250°C max' },
                { id: 'pro'  as const, label: 'High Heat',     sub: 'Steel 280°C+ / Wood-fired / Effeuno' },
              ]).map((opt) => {
                const isActive = ovenType === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setOvenType(opt.id)}
                    className={`flex-1 py-2.5 px-2 border-2 rounded-none transition-all flex flex-col items-center gap-0.5 ${
                      isActive
                        ? 'bg-slate-900 border-slate-900 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase">{opt.label}</span>
                    <span className={`text-[8px] font-mono text-center leading-tight ${isActive ? 'text-white/60' : 'text-slate-400'}`}>{opt.sub}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Advanced fine-tune (collapsed by default) ── */}
          <div className="border-b border-slate-200">
            <button
              onClick={() => setShowAdvanced(v => !v)}
              className="w-full px-5 py-3 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <span>Advanced — Fine-tune percentages</span>
              {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showAdvanced && (
              <div className="px-5 pb-5 space-y-4 border-t border-slate-100">
                <p className="text-[9px] font-mono text-slate-400 pt-3 uppercase">Changes here set style to Custom</p>

                {/* Hydration */}
                <SliderField
                  label="Hydration"
                  value={hydration}
                  unit="%"
                  min={50} max={90}
                  step={1}
                  onChange={v => updateField('hydration', v)}
                  highlight={`Safe: ${selectedFlour.recommendedHydration.min}–${selectedFlour.recommendedHydration.max}%`}
                />

                {/* Salt */}
                <SliderField
                  label="Salt"
                  value={saltPercent}
                  unit="%"
                  min={1} max={4}
                  step={0.1}
                  onChange={v => updateField('saltPercent', v)}
                />

                {/* Oil toggle */}
                <ToggleSlider
                  label="Olive Oil"
                  shown={showOil}
                  value={oilPercent}
                  min={0} max={5} step={0.5} defaultVal={2}
                  onToggle={(next) => { setShowOil(next); if (!next) updateField('oilPercent', 0); else if (oilPercent === 0) updateField('oilPercent', 2); }}
                  onChange={v => updateField('oilPercent', v)}
                />

                {/* Sugar toggle */}
                <ToggleSlider
                  label="Sugar / Diastatic Malt"
                  shown={showSugar}
                  value={sugarPercent}
                  min={0} max={3} step={0.5} defaultVal={1}
                  onToggle={(next) => { setShowSugar(next); if (!next) updateField('sugarPercent', 0); else if (sugarPercent === 0) updateField('sugarPercent', 1); }}
                  onChange={v => updateField('sugarPercent', v)}
                />

                {/* Yeast type */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Yeast Type</span>
                    <div className="flex border-2 border-slate-900 overflow-hidden">
                      {(['dry', 'fresh'] as const).map(t => (
                        <button key={t} onClick={() => updateField('yeastType', t)}
                          className={`px-3 py-0.5 text-[9px] font-black uppercase transition-all ${yeastType === t ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                          {t === 'dry' ? 'Dry' : 'Fresh'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <SliderField
                    label="Yeast %"
                    value={yeastPercent}
                    unit="%"
                    min={0.01} max={1.5} step={0.01}
                    onChange={v => updateField('yeastPercent', v)}
                    highlight={yeastType === 'fresh' ? '(×3.07 applied)' : undefined}
                  />
                </div>
              </div>
            )}
          </div>

          {/* ── FDT CTA ── */}
          {onSendToFdt && (
            <div className="p-4">
              <button
                onClick={() => onSendToFdt(weights.flour, weights.water)}
                className="w-full py-3 bg-slate-900 hover:bg-[#E60012] text-white text-[10px] font-black uppercase tracking-widest border-2 border-slate-900 transition-all flex items-center justify-center gap-2 brutalist-shadow-sm active:translate-x-px active:translate-y-px"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                Calculate Water Temperature ↓
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════ RIGHT: RECIPE & RESULTS ══════════════ */}
      <div className="lg:col-span-7 flex flex-col gap-5">

        {/* Recipe card */}
        <div className="bg-white border-4 border-slate-900 p-6 brutalist-shadow-lg flex flex-col gap-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 pb-4 border-b-2 border-slate-900">
            <div>
              <span className="text-[10px] text-white bg-[#E60012] font-black uppercase tracking-widest px-2 py-1">
                Active Formula
              </span>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mt-2 font-mono">
                {activePresetId === 'custom'
                  ? (activePreset ? `Custom · ${activePreset.shortName}` : 'Custom Formula')
                  : (activePreset?.name ?? 'Custom Formula')}
              </h3>
              {activePresetId === 'custom' && activePreset && (
                <span className="text-[9px] font-mono text-slate-400">Deviating from {activePreset.name} — parameters manually adjusted</span>
              )}
            </div>
            <div className="sm:text-right shrink-0">
              <span className="text-[9px] text-slate-400 block font-mono uppercase">Total Dough</span>
              <span className="text-2xl font-black font-mono text-[#E60012]">{weights.total}g</span>
              <span className="text-[9px] text-slate-400 block font-mono">{numBalls} {portion.plural} × {ballWeight}g</span>
            </div>
          </div>

          {/* Protocol description */}
          {activePreset && (
            <div className="bg-slate-50 border-2 border-slate-900 p-3">
              <h4 className="text-[9px] font-black text-slate-900 uppercase tracking-wider mb-1 flex items-center gap-1.5 font-mono">
                <Play className="text-[#E60012] w-3 h-3 fill-current" />
                {activePreset.badge}
              </h4>
              <p className="text-[11px] text-slate-700 leading-relaxed font-sans">{activePreset.description}</p>
            </div>
          )}

          {/* Ingredient weights */}
          <div>
            <h4 className="text-[9px] font-black uppercase tracking-widest font-mono text-slate-900 mb-2.5 flex items-center gap-1.5">
              <Scale className="w-3 h-3 text-[#E60012]" />
              Ingredient Weights
              <span className="text-[8px] font-mono font-normal text-slate-400 normal-case">
                — total for {numBalls} {portion.plural}
              </span>
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              {blendEnabled ? (
                <div className="col-span-2 border-2 border-slate-900 bg-slate-50 p-3 brutalist-shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] font-mono font-bold uppercase text-slate-500">Flour Blend</span>
                    <span className="text-lg font-black font-mono text-slate-900 select-all">{weights.flour}g total</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-mono text-slate-700">{blendPrimaryPct}% {primaryFlour.germanLabel}</span>
                      <span className="text-[10px] font-black font-mono text-slate-900 select-all">{Math.round(weights.flour * blendPrimaryPct / 100)}g</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-mono text-slate-700">{100 - blendPrimaryPct}% {secondFlour.germanLabel}</span>
                      <span className="text-[10px] font-black font-mono text-slate-900 select-all">{Math.round(weights.flour * (100 - blendPrimaryPct) / 100)}g</span>
                    </div>
                    <div className="border-t border-slate-200 pt-1 flex justify-between">
                      <span className="text-[8px] font-mono text-slate-400">Blended {selectedFlour.wValue} · {selectedFlour.proteinRange} protein</span>
                    </div>
                  </div>
                </div>
              ) : (
                <WeightCard label="Flour" sublabel={`${selectedFlour.germanLabel} · ${selectedFlour.wValue}`} value={`${weights.flour}g`} />
              )}
              <WeightCard label="Water" sublabel={`${hydration}% hydration`} value={`${weights.water}g`} note={`${weights.water}ml`} />
              <WeightCard label="Salt" sublabel={`${saltPercent}%`} value={`${weights.salt}g`} />
              <WeightCard label={`Yeast ${yeastType === 'fresh' ? '(Fresh ×3.07)' : '(Dry)'}`} sublabel={`${yeastPercent}% ref`} value={`${weights.yeast}g`} />
              {weights.oil > 0 && <WeightCard label="Olive Oil" sublabel={`${oilPercent}%`} value={`${weights.oil}g`} accent />}
              {weights.sugar > 0 && <WeightCard label="Sugar / Malt" sublabel={`${sugarPercent}%`} value={`${weights.sugar}g`} accent />}
            </div>
          </div>

          {/* Timings */}
          {activePreset && (
            <div className="border-t-2 border-slate-900 pt-4 space-y-2">
              <h4 className="text-[9px] font-black uppercase tracking-widest font-mono flex items-center gap-1.5">
                <Clock className="text-[#E60012] w-3 h-3" />
                Fermentation Timeline
              </h4>
              {/* Home oven note for presets designed for high heat */}
              {ovenType === 'home' && activePreset.timings.homeNote && (
                <div className="bg-amber-50 border-2 border-amber-400 px-3 py-2 text-[9px] font-mono text-amber-800">
                  <span className="font-black">⚠ Home Oven Adaptation — </span>{activePreset.timings.homeNote}
                </div>
              )}
              {ovenType === 'pro' && !activePreset.timings.homeNote && (
                <div className="bg-emerald-50 border border-emerald-400 px-3 py-1.5 text-[9px] font-mono text-emerald-800">
                  ✓ This style is designed for home oven temps — high heat gives the same or better result.
                </div>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 border-2 border-slate-900 p-3 font-mono">
                {([
                  ['Bulk (RT)', activePreset.timings.bulkRT],
                  ['Bulk (Cold)', activePreset.timings.bulkCold],
                  [`${portion.isSlab ? 'Pan' : portion.isFlatbread ? 'Piece' : 'Ball'} (RT)`, activePreset.timings.ballRT],
                  [`${portion.isSlab ? 'Pan' : portion.isFlatbread ? 'Piece' : 'Ball'} (Cold)`, activePreset.timings.ballCold],
                  ['Bake Temp', ovenType === 'home' && activePreset.timings.bakeTempHome
                    ? activePreset.timings.bakeTempHome
                    : activePreset.timings.bakeTemp],
                  ['Bake Time', ovenType === 'home' && activePreset.timings.bakeTimeHome
                    ? activePreset.timings.bakeTimeHome
                    : activePreset.timings.bakeTime],
                ] as [string, string][]).map(([label, value]) => (
                  <div key={label}>
                    <span className="text-slate-400 block text-[8px] uppercase">{label}</span>
                    <span className={`text-[10px] font-bold ${label === 'Bake Temp' ? 'text-[#E60012]' : 'text-slate-900'}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step-by-step */}
          {activePreset && (
            <div className="border-t-2 border-slate-900 pt-4 space-y-2.5">
              <h4 className="text-[9px] font-black uppercase tracking-widest font-mono flex items-center gap-1.5">
                <BookOpen className="w-3 h-3" />
                Step-by-Step Instructions
              </h4>
              <ul className="space-y-2 list-none pl-0">
                {activePreset.steps.map((step, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start">
                    <span className="w-5 h-5 bg-slate-900 text-white font-mono text-[9px] flex items-center justify-center font-black shrink-0 mt-0.5">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[11px] text-slate-800 font-semibold leading-relaxed font-sans">{renderStep(step)}</span>
                  </li>
                ))}
              </ul>
              <DoughProcess3D recipe={recipe} weights={weights} presetName={activePreset.name} />
            </div>
          )}

          {/* Journal CTA */}
          {onSendToJournal && (
            <div className="border-t-2 border-slate-900 pt-4">
              <button
                onClick={() => onSendToJournal(recipe, weights)}
                className="w-full py-3.5 bg-[#E60012] hover:bg-slate-950 text-white font-black text-xs tracking-widest uppercase border-2 border-slate-900 transition-all flex items-center justify-center gap-2 brutalist-shadow active:translate-x-px active:translate-y-px"
              >
                <Layers className="w-4 h-4" />
                Initialize LAB Test Protocol Log
              </button>
            </div>
          )}
        </div>

        {/* ── Mixer guide ── */}
        <div className="bg-white border-4 border-slate-900 p-6 brutalist-shadow-lg">
          <div className="border-b-2 border-slate-900 pb-3 mb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <span className="text-[9px] text-[#E60012] font-black uppercase tracking-widest font-mono block">Mixing Reference</span>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-[#E60012]" />
                Mixer & Kneading Guide
              </h3>
            </div>
            <div className="flex bg-slate-100 p-0.5 border-2 border-slate-900">
              {(['stand', 'spiral', 'hand'] as const).map((tab) => (
                <button key={tab} onClick={() => onMixerChange(tab)}
                  className={`px-3 py-1 text-[10px] font-black uppercase transition-all ${selectedMixer === tab ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                  {tab === 'stand' ? 'Stand' : tab === 'spiral' ? 'Spiral' : 'Hand'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-7 text-[11px] text-slate-700 font-sans leading-relaxed space-y-3">
              {selectedMixer === 'stand' && (<>
                <div className="bg-slate-100 border-l-4 border-[#E60012] p-3 font-mono text-[10px]">
                  <b>Stand Mixer (Planetary)</b> — Bowl static; hook spins on its axis + travels the bowl circumference. FDT friction: <span className="text-[#E60012] font-black">+6.5°C</span>
                </div>
                <p><b>A:</b> Water + yeast in bowl. Add 70% flour. Speed 1 for 3–4 min. Rest 10–15 min (autolyse).</p>
                <p><b>B:</b> Add salt. Add remaining flour slowly over 3 min at Speed 1.</p>
                <p><b>C:</b> Speed 2 (never higher). Run 5–6 min until dough detaches from bowl walls.</p>
                <div className="p-2.5 border-2 border-dashed border-[#E60012] bg-[#E60012]/5 text-[10px]">
                  <b className="text-[#E60012]">⚠ SilverCrest / Budget Double-Hook Mixers:</b> Two interlocking hooks shred gluten 40% faster — reduce kneading to max 5–6 min. Never above Speed 1. Use ice-cold water — plastic body insulates motor heat into dough.
                </div>
              </>)}
              {selectedMixer === 'spiral' && (<>
                <div className="bg-slate-100 border-l-4 border-[#E60012] p-3 font-mono text-[10px]">
                  <b>Spiral Mixer (Professional)</b> — Hook AND bowl both rotate in opposite directions. Continuous forced protein alignment. FDT friction: <span className="text-[#E60012] font-black">+10°C</span>
                </div>
                <p><b>A:</b> Flour + yeast dry in rotating bowl. 90 RPM. Drizzle 85% cold water over 2 min. Mix 3 min.</p>
                <p><b>B:</b> Add salt. Speed 2 (180–240 RPM) for high hydration. Drip remaining 15% via bassinage.</p>
                <p><b>C:</b> Knead until dough is extremely glossy and stretches around the central column. Total: 8–10 min.</p>
              </>)}
              {selectedMixer === 'hand' && (<>
                <div className="bg-slate-100 border-l-4 border-[#E60012] p-3 font-mono text-[10px]">
                  <b>By Hand</b> — Thumbs, palms, and wrists. Least friction heat. Maximum tactile feedback. FDT friction: <span className="text-[#E60012] font-black">+3°C</span>
                </div>
                <p><b>A (Autolyse):</b> Dissolve yeast in water. Mix 80% of flour into a thick slurry. Rest covered 30 min — gluten builds passively.</p>
                <p><b>B (Slap & Fold):</b> Push away with heel of palm, fold back, spin 90°, repeat. For wet doughs lift vertically, slap on bench, fold to trap air.</p>
                <p><b>C:</b> Sprinkle salt, add a tiny splash of water, knead 5 more min until silk-like. Finish with windowpane check.</p>
              </>)}
            </div>
            <div className="lg:col-span-5 bg-slate-50 border-2 border-slate-900 p-3 font-mono text-[10px] space-y-3">
              <h4 className="text-[9px] font-black text-[#E60012] uppercase border-b border-slate-300 pb-1">Friction Heat Comparison</h4>
              {[
                { label: 'Hand', factor: '+2–4°C', w: '30%', color: 'bg-amber-400' },
                { label: 'Stand', factor: '+5–8°C', w: '60%', color: 'bg-blue-400' },
                { label: 'Spiral', factor: '+8–12°C', w: '100%', color: 'bg-emerald-500' },
              ].map(({ label, factor, w, color }) => (
                <div key={label}>
                  <div className="flex justify-between mb-1"><span className="font-bold">{label}</span><span className="font-bold text-slate-600">{factor}</span></div>
                  <div className="h-1.5 bg-slate-200"><div className={`h-full ${color}`} style={{ width: w }} /></div>
                </div>
              ))}
              <p className="text-[9px] text-slate-500 pt-2 border-t border-slate-300 font-sans leading-relaxed">
                ★ Subtract your mixer's friction from your calculated water temperature in the FDT section below.
              </p>
            </div>
          </div>
        </div>

        {/* ── German Flour & Oven Guide ── */}
        <div className="bg-white border-4 border-slate-900 p-6 brutalist-shadow-lg">
          <div className="border-b-2 border-slate-900 pb-3 mb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <span className="text-[9px] text-[#E60012] font-black uppercase tracking-widest font-mono block">Flour &amp; Oven Reference</span>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#E60012]" />
                Flour &amp; Oven Calibration Guide
              </h3>
            </div>
            <div className="flex bg-slate-100 p-0.5 border-2 border-slate-900">
              {(['flour', 'oven'] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveGermanTab(tab)}
                  className={`px-4 py-1 text-[10px] font-black uppercase transition-all ${activeGermanTab === tab ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                  {tab === 'flour' ? 'Flour Guide' : 'Oven Tactics'}
                </button>
              ))}
            </div>
          </div>

          {activeGermanTab === 'flour' && (
            <div className="space-y-2.5">
              {FLOUR_TYPES.map((f) => (
                <div key={f.id} className="p-3 border-2 border-slate-200 bg-slate-50 flex flex-col gap-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-[10px] font-black uppercase font-mono">{f.germanLabel}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black font-mono text-[#E60012]">{f.wValue}</span>
                      <span className="text-[9px] font-mono text-slate-400">{f.proteinRange}</span>
                      <span className="text-[9px] font-mono text-emerald-700 font-bold">{f.recommendedHydration.min}–{f.recommendedHydration.max}%</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-600 italic font-sans">{f.alterationTip}</p>
                </div>
              ))}
            </div>
          )}

          {activeGermanTab === 'oven' && (
            <div className="space-y-2.5 text-[11px] text-slate-700 font-sans leading-relaxed">
              <div className="bg-slate-100 border-l-4 border-[#E60012] p-3 font-mono text-[10px]">
                <b>Standard home ovens (Bosch, Siemens, Miele, etc.)</b> max at 250–275°C. Neapolitan needs 450°C. Use these three tactics to close the gap:
              </div>
              {[
                { title: 'Tactic 1: Baking Steel', body: 'Get a 6–8mm thick baking steel. Place on the highest rack. Pre-heat at 275°C (top+bottom heat) for 45–60 min to fully saturate with heat. Do NOT use thin ceramic stones — they transfer heat too slowly.' },
                { title: 'Tactic 2: Grill/Broiler Finish', body: 'Right before loading your pizza, switch to Grill/Broiler at maximum setting. The pre-heated steel bakes the bottom in 2 min; the active grill chars and blisters the top. Total bake time: 3–4 min.' },
                { title: 'Tactic 3: Browning Additives', body: 'Home ovens bake slower (3–6 min vs 90s), so dough dries out before browning. Add 1–1.5% diastatic barley malt or sugar to accelerate the Maillard reaction at 250°C. Add 2–3% olive oil to lock in internal moisture.' },
              ].map(({ title, body }) => (
                <div key={title} className="p-3 border-2 border-slate-900 bg-slate-50">
                  <h4 className="text-[10px] font-black uppercase font-mono mb-1">{title}</h4>
                  <p>{body}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// ─── Small reusable sub-components ───────────────────────────────────────────

function WeightCard({ label, sublabel, value, note, accent }: {
  label: string; sublabel: string; value: string; note?: string; accent?: boolean;
}) {
  return (
    <div className={`border-2 p-3 flex justify-between items-center brutalist-shadow-sm ${
      accent ? 'bg-amber-50 border-amber-600' : 'bg-slate-50 border-slate-900'
    }`}>
      <div>
        <span className={`text-[9px] block font-mono font-bold uppercase ${accent ? 'text-amber-700' : 'text-slate-500'}`}>{label}</span>
        <span className={`text-[8px] font-mono ${accent ? 'text-amber-600' : 'text-slate-400'}`}>{sublabel}</span>
      </div>
      <div className="text-right">
        <span className={`text-lg font-black font-mono select-all ${accent ? 'text-amber-900' : 'text-slate-900'}`}>{value}</span>
        {note && <span className="text-[9px] text-slate-400 block font-mono">{note}</span>}
      </div>
    </div>
  );
}

function SliderField({ label, value, unit, min, max, step, onChange, highlight }: {
  label: string; value: number; unit: string; min: number; max: number; step: number;
  onChange: (v: number) => void; highlight?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
          {label} {highlight && <span className="text-[8px] font-mono text-slate-400 font-normal normal-case">{highlight}</span>}
        </label>
        <span className="text-[10px] font-black font-mono bg-slate-900 text-white px-2 py-0.5">{value}{unit}</span>
      </div>
      <div className="flex gap-2 items-center">
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(step < 1 ? parseFloat(e.target.value) : parseInt(e.target.value))}
          className="w-full h-1.5 bg-slate-200 appearance-none cursor-pointer rounded-none" />
        <input type="number" min={min} max={max} step={step} value={value}
          onChange={e => {
            const v = step < 1 ? parseFloat(e.target.value) : parseInt(e.target.value);
            if (!isNaN(v)) onChange(Math.min(max, Math.max(min, v)));
          }}
          className="w-14 bg-slate-50 border-2 border-slate-900 px-1.5 py-0.5 text-center font-mono text-[10px] font-bold focus:outline-none" />
      </div>
    </div>
  );
}

function ToggleSlider({ label, shown, value, min, max, step, defaultVal, onToggle, onChange }: {
  label: string; shown: boolean; value: number;
  min: number; max: number; step: number; defaultVal: number;
  onToggle: (next: boolean) => void; onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">{label}</span>
        <button
          onClick={() => onToggle(!shown)}
          className={`text-[9px] font-black font-mono px-2 py-0.5 border transition-all uppercase ${
            shown ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-500 border-slate-300 hover:border-slate-700'
          }`}
        >
          {shown ? `− ${value}%` : '+ Add'}
        </button>
      </div>
      {shown && (
        <div className="flex gap-2 items-center">
          <input type="range" min={min} max={max} step={step} value={value}
            onChange={e => onChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-200 appearance-none cursor-pointer rounded-none" />
          <input type="number" min={min} max={max} step={step} value={value}
            onChange={e => { const v = parseFloat(e.target.value); if (!isNaN(v)) onChange(Math.max(min, Math.min(max, v))); }}
            className="w-14 bg-slate-50 border-2 border-slate-900 px-1.5 py-0.5 text-center font-mono text-[10px] font-bold focus:outline-none" />
        </div>
      )}
    </div>
  );
}
