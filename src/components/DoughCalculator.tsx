/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PizzaRecipe } from '../types';
import DoughProcess3D from './DoughProcess3D';
import {
  Scale, RefreshCw, Layers, CheckCircle2, AlertTriangle, Play,
  BookOpen, Clock, Sparkles, Info, ChevronDown, ChevronUp, Flame,
} from 'lucide-react';

interface DoughCalculatorProps {
  recipe: PizzaRecipe;
  onChange: (updatedRecipe: PizzaRecipe) => void;
  onSendToFdt?: (flourWeight: number, waterWeight: number) => void;
  onSendToJournal?: (calculatedRecipe: PizzaRecipe, weights: CalculatedWeights) => void;
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

export interface PizzaPreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  hydration: number;
  saltPercent: number;
  yeastPercent: number;
  oilPercent: number;
  sugarPercent: number;
  ballWeight: number;
  yeastType: 'dry' | 'fresh';
  timings: {
    bulkRT: string;
    bulkCold: string;
    ballRT: string;
    ballCold: string;
    bakeTemp: string;
    bakeTime: string;
  };
  steps: string[];
}

export const PIZZA_PRESETS: PizzaPreset[] = [
  {
    id: 'beginner',
    name: 'Beginner Direct 24h',
    badge: 'DIRECT_24H_65PCT',
    description: "The foundational direct-ferment recipe by Benjamin Schmitz (Dough Control). Room temp bulk + cold chain fridge. Most forgiving entry point for consistent, repeatable results.",
    hydration: 65,
    saltPercent: 2.5,
    yeastPercent: 0.13,
    oilPercent: 0,
    sugarPercent: 0,
    ballWeight: 280,
    yeastType: 'dry',
    timings: {
      bulkRT: '2 hours @ 22°C',
      bulkCold: '16–20 hours @ 7°C',
      ballRT: '3–4 hours @ 22°C',
      ballCold: '0 hours',
      bakeTemp: '450°C (wood oven) / 300°C (steel plate)',
      bakeTime: '60–90s (wood) / 4–5 min (steel)',
    },
    steps: [
      'Dissolve 1.3g dry yeast (or 4g fresh) in all of the calculated water at 12–15°C.',
      'Add 75% of the Tipo 00 flour (W280–300). Mix by hand until a shaggy mass forms. Rest 15 min — gluten links build passively (autolyse).',
      'Add remaining flour slowly. Knead 15–20 min by hand: push away with heel of palm, fold back, rotate 90°, repeat.',
      'Scatter the salt evenly on the dough. Knead a further 3–5 min until fully smooth and silky.',
      'Shape into a ball, cover, and rest 2 hours at room temp (~22°C). Yeast wakes up and begins CO₂ production.',
      'Transfer sealed to the fridge (7°C). Cold ferment 16–20 hours. Aroma compounds and acids develop slowly at stable pace.',
      'Remove from fridge. Portion into individual balls (~280g). Allow to rest 3–4 hours at room temp before baking.',
      'Bake at max heat: 450°C in wood oven (60–90s) or 300°C on a preheated baking steel (4–5 min).',
    ],
  },
  {
    id: 'neapolitan',
    name: 'Classic Neapolitan',
    badge: 'NAPOLETANA_DIRECT_24H',
    description: 'The ancient standard: direct fermentation at ambient room temperature (no fridge). Soft, airy, and hyper-foldable wood-fired crust.',
    hydration: 62,
    saltPercent: 2.8,
    yeastPercent: 0.1,
    oilPercent: 0,
    sugarPercent: 0,
    ballWeight: 250,
    yeastType: 'dry',
    timings: {
      bulkRT: '18 hours @ 20°C',
      bulkCold: '0 hours (Not recommended)',
      ballRT: '6 hours @ 20°C',
      ballCold: '0 hours (Not recommended)',
      bakeTemp: '430°C – 485°C (Pizza Deck / Wood-Fired)',
      bakeTime: '60 – 90 seconds',
    },
    steps: [
      'In a clean container, dissolve dry or fresh yeast completely inside the calculated water volume.',
      'Blend in roughly 75% of your Tipo 00 flour stock, mixing with hands until a wet cohesive batter forms. Allow to stand 15–20 min (Autolyse) to kick-start flour hydration.',
      'Evenly scatter the fine sea salt onto the batter, then add the remaining flour stock progressively.',
      'Knead the mixture thoroughly until a silky, strong, and structural gluten network is formed.',
      'Shape into a cohesive single ball, cover, and ferment at ambient room temperature (18°C–21°C) for exactly 18 hours.',
      'After 18 hours of bulk fermentation, divide into equal 250g pieces. Tuck and roll tightly from bottom to top.',
      'Place balls in covered proofing boxes and proof at room temperature for another 6 hours before baking.',
      'Gently stretch by pressing from center outwards. Form a thin center and puffy rim (cornicione). Bake hot at 450°C for 60–90 seconds.',
    ],
  },
  {
    id: 'canotto',
    name: 'Contemporary Neapolitan (Canotto)',
    badge: 'CANOTTO_COLD_48H',
    description: 'The modern "lifeboat" style featuring an extremely big, puffy, alveolated rim. Uses higher hydration and slow cold fermentation.',
    hydration: 70,
    saltPercent: 2.5,
    yeastPercent: 0.14,
    oilPercent: 0,
    sugarPercent: 0,
    ballWeight: 280,
    yeastType: 'dry',
    timings: {
      bulkRT: '2 hours @ 20°C',
      bulkCold: '24–40 hours @ 4°C–6°C',
      ballRT: '4–6 hours @ 20°C',
      ballCold: '0 hours',
      bakeTemp: '400°C – 430°C (Pizza Deck / High Heat)',
      bakeTime: '70–100 seconds',
    },
    steps: [
      'Stir yeast into cold water. Whisk in 70% of the flour to form a thick shaggy paste. Allow to sit 30 min to develop natural amylase enzymes.',
      'Incorporate salt and remaining flour carefully. Work the high-hydration mass using stretch-and-fold sequences.',
      'Leave covered at room temperature (20°C) for 2 hours to wake up the yeast multiplication phase.',
      'Store in sealed container in refrigerator (4°C–6°C) for 24 to 48 hours. Matures flavor and ensures leoparding.',
      'Remove cold dough, slice into 280g balls, tension them tightly to preserve internal gas pockets.',
      'Proof in closed containers for 4–6 hours at room temp. Balls will relax and grow lightweight.',
      'Stretch using the "slap" method, steering clear of the outer 2cm rim. Cook on high deck heat.',
    ],
  },
  {
    id: 'newyork',
    name: 'New York Style (NY Slice)',
    badge: 'NY_CRUST_MALT_72H',
    description: 'A classic crispy and chewy deck-oven pie. Features added olive oil for a supple crumb and sugar/diastatic malt for color browning.',
    hydration: 60,
    saltPercent: 2.2,
    yeastPercent: 0.35,
    oilPercent: 2,
    sugarPercent: 1,
    ballWeight: 380,
    yeastType: 'dry',
    timings: {
      bulkRT: '1 hour @ 22°C',
      bulkCold: '24–72 hours @ 4°C',
      ballRT: '3–4 hours @ 22°C (after fridge)',
      ballCold: '12–24 hours @ 4°C (Optional)',
      bakeTemp: '260°C – 280°C (Home Oven / Deck steel)',
      bakeTime: '6–9 minutes',
    },
    steps: [
      'Whisk high-protein flour, active dry yeast, and 1% sugar or barley malt sweetener in a dry bowl.',
      'Begin mixing while adding the room temp water. Continue for 3 minutes.',
      'Drizzle in 2% olive oil along with the sea salt. Knead for 7–9 minutes. Oil lubricates protein strands for the hallmark chewy NY pie.',
      'Bulk rise: Rest as a single cohesive mass at comfortable room temperature for 1 hour.',
      'Slice into heavy 380g pieces. Roll into smooth, dense balls.',
      'Store in lightly oiled individual tubs in cold storage (4°C) for 24–72 hours (48h yields peak flavor).',
      'Bring dough balls to room temperature 3–4 hours prior to baking to relax gluten bonds.',
      'Stretch on standard semolina, top with low-moisture skim mozzarella, and bake on preheated stone or steel at 275°C.',
    ],
  },
  {
    id: 'teglia',
    name: 'Pizza in Teglia (Roman Pan)',
    badge: 'ROMAN_PAN_HIGH_80H',
    description: 'Super-airy, rectangular pan pizza. Baked in an oiled tray to yield a fried, crispy golden bottom and light, spongy internal voids.',
    hydration: 80,
    saltPercent: 2.5,
    yeastPercent: 0.45,
    oilPercent: 2,
    sugarPercent: 0,
    ballWeight: 750,
    yeastType: 'dry',
    timings: {
      bulkRT: '1 hour @ 20°C',
      bulkCold: '24–48 hours @ 4°C',
      ballRT: '3–4 hours @ 21°C',
      ballCold: '0 hours',
      bakeTemp: '250°C (Home Convection Oven)',
      bakeTime: '12–15 minutes',
    },
    steps: [
      'Blend high-gluten flour and yeast. Pour 80% of cooled water slowly while working on slow speed.',
      'Add salt. Slowly drip the remaining 20% water (Bassinet method) in small splashes, kneading to let flour absorb each addition.',
      'Drizzle 2% olive oil into the mix at the very end to seal the high hydration matrix.',
      'Perform 3 series of coil folds on the bench, resting 20 minutes between each fold series.',
      'Store in large greased container in fridge (4°C) for 24–48 hours.',
      'Remove and divide into heavy 750g slabs. Place in well-oiled proofing bins at room temp for 3–4 hours.',
      'Press with warm flat fingertips in grid shapes creating deep air pockets. Lay in blue-steel pan greased with oil.',
      'First bake bottom shelf (7–8 min), top with sauce and cheese, then move to top shelf to melt (5–7 min).',
    ],
  },
  {
    id: 'tonda',
    name: 'Roman Tonda (Thin & Crispy)',
    badge: 'TONDA_CRACKER_24H',
    description: 'Paper-thin, ultra-crisp street pizza with zero rim. Rolled flat with a pin for uniform cracker consistency and no puff.',
    hydration: 55,
    saltPercent: 2.0,
    yeastPercent: 0.18,
    oilPercent: 3,
    sugarPercent: 0,
    ballWeight: 180,
    yeastType: 'dry',
    timings: {
      bulkRT: '2 hours @ 20°C',
      bulkCold: '20 hours @ 4°C',
      ballRT: '3 hours @ 22°C',
      ballCold: '0 hours',
      bakeTemp: '300°C – 330°C (Pizza Oven / Baking Steel)',
      bakeTime: '3–4 minutes',
    },
    steps: [
      'Combine flour, yeast, and cold water. Mix on slow speed: low hydration (55%) will make a stiff, dense dough mass.',
      'Add fine sea salt and 3% olive oil. Knead intensely for 10–12 minutes until structural strands are tight.',
      'Rest dough at warm room temp for 2 hours, allowing mild enzymatic fermentation.',
      'Mature in refrigerator for 20 hours to relax molecular gluten tension.',
      'Slice dough into lightweight 180g pieces. Roll into ultra-tight, smooth spheres.',
      'Rest balls in proofing tray for 3 hours at room temperature.',
      'Using a rolling pin (mattarello), roll from center outwards until thin like paper (translucent). Zero rim allowed.',
      'Bake on hot steel/stone at 300°C+ until completely dry, stiff, and crisp.',
    ],
  },
  {
    id: 'detroit',
    name: 'Detroit Style Pizza',
    badge: 'DETROIT_PAN_48H',
    description: 'Thick, rectangular pan pizza for home ovens. Spongy internal crumb with a crispy fried bottom and caramelized cheese boundary walls (Frico).',
    hydration: 70,
    saltPercent: 2.5,
    yeastPercent: 0.45,
    oilPercent: 2,
    sugarPercent: 0,
    ballWeight: 450,
    yeastType: 'dry',
    timings: {
      bulkRT: '2 hours @ 21°C',
      bulkCold: '24–48 hours @ 4°C',
      ballRT: '3 hours in oiled pan @ 24°C',
      ballCold: '0 hours',
      bakeTemp: '245°C – 260°C (Standard Home Oven)',
      bakeTime: '12–15 minutes',
    },
    steps: [
      'Blend flour, yeast, and very cold water. Mix for 4 minutes until hydrated.',
      'Add fine sea salt and 2% olive oil. Knead for 7–9 minutes until the wet gluten network holds structured tension.',
      'Rest covered at stable room temperature for exactly 2 hours.',
      'Transfer to refrigerator (4°C) for 24–48 hours to fully digest starch bonds.',
      'Coat a 10×14 heavy pan with 2 tablespoons of olive oil. Press dough outward until it touches all four corners.',
      'Let the dough proof uncovered in a warm kitchen for 3 hours until double in thickness and bubbly.',
      'Lay Butterkäse or Mozzarella-Cheddar blend all the way to the edges. Pour two parallel lines of thick tomato sauce on top.',
      'Bake on the lowest rack for 12–15 minutes until the bottom is fried and cheese edges are caramelized (Frico).',
    ],
  },
  {
    id: 'flammkuchen',
    name: 'Classic Flammkuchen',
    badge: 'ELSASS_CRISP_DIRECT',
    description: 'The iconic Alsatian/German flatbread. Extremely crispy, paper-thin, yeast-free or yeast-relaxed dough, topped with Creme Fraiche, onions, and Speck.',
    hydration: 50,
    saltPercent: 2.0,
    yeastPercent: 0.05,
    oilPercent: 3,
    sugarPercent: 0,
    ballWeight: 155,
    yeastType: 'dry',
    timings: {
      bulkRT: '1 hour @ 21°C',
      bulkCold: '0 hours',
      ballRT: '1 hour @ 22°C',
      ballCold: '0 hours',
      bakeTemp: '275°C – 300°C (Home oven maxed + steel)',
      bakeTime: '4–5 minutes',
    },
    steps: [
      'Whisk German Weizenmehl (Type 550 or 405), salt, water, 3% neutral sunflower oil (or lard), and a tiny pinch of yeast.',
      'Knead intensely for 10 minutes until you have a stiff, slick, and completely non-sticky dough.',
      'Keep covered on the counter for 1 hour at room temp — this relaxes gluten tension so you can roll it paper-thin without spring-back.',
      'Slice into equal 150–160g portions. Roll into smooth, dry spheres. Rest covered for 45 minutes more.',
      'Using a rolling pin (mattarello), roll from center outwards until ultra-thin (under 1.5mm) and translucent.',
      'Slather with salted Schmand (or thick Creme Fraiche) spiced with nutmeg and pepper. Top with Spekwürfel and finely sliced red onion rings.',
      'Slide directly onto preheated baking steel on oven\'s top-rack at 275°C–300°C. Cook 4–5 minutes until edges bubble black and crust is rigid.',
    ],
  },
  {
    id: 'focaccia',
    name: 'Genoese Focaccia',
    badge: 'FOCACCIA_GENOVESE_24H',
    description: 'Classic olive oil sea-salt flatbread (Focaccia Genovese). Crispy outside, thick and cushiony inside with deep brine-filled finger dimples (salamoia).',
    hydration: 75,
    saltPercent: 2.8,
    yeastPercent: 0.5,
    oilPercent: 3,
    sugarPercent: 0,
    ballWeight: 600,
    yeastType: 'dry',
    timings: {
      bulkRT: '2 hours @ 21°C',
      bulkCold: '18–24 hours @ 4°C',
      ballRT: '3 hours in baking sheet @ 22°C',
      ballCold: '0 hours',
      bakeTemp: '220°C – 230°C (Standard Home Oven)',
      bakeTime: '15–20 minutes',
    },
    steps: [
      'Dissolve yeast in calculated water. Drizzle in 3% cold-pressed olive oil. Add 80% of Weizenmehl (Typ 550 or Tipo 00) and mix.',
      'Add salt and remaining flour progressively. Knead 8–10 min. High hydration (75%) will feel sticky — use stretch-and-fold rather than adding dry flour.',
      'Leave covered for 45 minutes, then carry out two coil folds inside the bowl. Bulk ferment at room temp for 2 hours.',
      'Save covered dough block in fridge at 4°C for 18–24 hours to gain rich yeasty depth.',
      'Liberally oil a rectangular baking sheet. Transfer cold dough. Rest 20 min, then pull and press outwards until it fills the tray.',
      'Rise at room temp 2–3 hours. Whisk a brine (Salamoia) of 3 tbsp warm water, 2 tbsp olive oil, 1 tsp sea salt. Drizzle over dough. Press fingers straight down deep to create craters.',
      'Rest a further 45 minutes in warm kitchen to let craters inflate.',
      'Bake at 230°C on the lower-middle shelf for 15–20 minutes until intense golden and crispy. Brush with extra olive oil immediately out of the oven.',
    ],
  },
];

export interface FlourType {
  id: string;
  name: string;
  germanLabel: string;
  wValue: string;
  proteinRange: string;
  recommendedHydration: { min: number; max: number };
  description: string;
  alterationTip: string;
}

export const FLOUR_TYPES: FlourType[] = [
  {
    id: 'typ00_import',
    name: 'Imported Italian Tipo 00 (Caputo / 5 Stagioni)',
    germanLabel: 'Tipo 00 (Import)',
    wValue: 'W280–350',
    proteinRange: '12.5% – 13.5%',
    recommendedHydration: { min: 62, max: 70 },
    description: 'Elite high-strength imported Italian specialty flour. Holds very strong, elastic gluten structures meant for high-temperature pizza ovens.',
    alterationTip: 'Perfect alignment with classic Neapolitan recipes. Safely supports high hydration up to 70%. Kneads beautifully and tolerates long fermentation without tearing.',
  },
  {
    id: 'typ00_supermarket',
    name: 'German Supermarket Tipo 00 / Pizzamehl (Edeka, Lidl, Rewe)',
    germanLabel: 'Tipo 00 (Supermarkt)',
    wValue: 'W180–220',
    proteinRange: '10.5% – 11.5%',
    recommendedHydration: { min: 58, max: 62 },
    description: 'Domestic German supermarket pizza flour (Aurora, Diamant, K-Classic, Gut & Günstig). Perfect for accessibility but features standard gluten framework.',
    alterationTip: 'Warning: German supermarket Tipo 00 has lower W-value than professional Italian imports. Limit hydration strictly to 58%–62% to avoid sticky, unworkable dough.',
  },
  {
    id: 'typ550',
    name: 'Weizenmehl Type 550',
    germanLabel: 'Weizenmehl Typ 550',
    wValue: 'W230–280',
    proteinRange: '11.5% – 12.8%',
    recommendedHydration: { min: 60, max: 64 },
    description: 'Standard German bread flour with excellent gluten strength. More water absorptive capacity than pastry flour.',
    alterationTip: 'Very reliable choice. Safe hydration range is 60%–64%. Going above 64% is possible but needs bassinage (dripping water slowly) or folding technique.',
  },
  {
    id: 'typ630',
    name: 'Dinkelmehl Type 630 (Spelt)',
    germanLabel: 'Dinkelmehl Typ 630',
    wValue: 'W150–200',
    proteinRange: '12.5% – 14.0%',
    recommendedHydration: { min: 58, max: 60 },
    description: 'Organic spelt wheat. High natural protein but very extensible, fragile gluten sheets that relax and slack quickly.',
    alterationTip: 'Warning: Spelt gluten tears easily under heavy machine kneading. Cut your kneading time in half, or knead strictly by hand. Keep hydration below 60%.',
  },
  {
    id: 'typ405',
    name: 'Weizenmehl Type 405',
    germanLabel: 'Weizenmehl Typ 405',
    wValue: 'W100–160',
    proteinRange: '9.0% – 10.5%',
    recommendedHydration: { min: 55, max: 58 },
    description: 'German standard cake & pastry flour. Fine starch structure with low protein content and weak gluten elasticity.',
    alterationTip: 'Warning: Poor absorption. Hydration above 58% turns Typ 405 into sticky mush. Restrict to 55–58% or buy Aurora Pizzamehl Typ 405 which has added Weizenkleber (wheat gluten).',
  },
];

// ─── Hydration range visual bar ────────────────────────────────────────────
function HydrationRangeBar({ min, max, current }: { min: number; max: number; current: number }) {
  const SLIDER_MIN = 50;
  const SLIDER_MAX = 90;
  const range = SLIDER_MAX - SLIDER_MIN;

  const pct = (v: number) => Math.min(100, Math.max(0, ((v - SLIDER_MIN) / range) * 100));

  const minPct = pct(min);
  const maxPct = pct(max);
  const curPct = pct(current);

  const status = current > max ? 'over' : current < min ? 'under' : 'ok';
  const markerColor = status === 'ok' ? '#16a34a' : status === 'over' ? '#E60012' : '#d97706';

  return (
    <div className="space-y-1.5 mt-2">
      <div className="relative h-2.5 bg-slate-200 border border-slate-300">
        {/* safe zone */}
        <div
          className="absolute h-full bg-emerald-400/60"
          style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }}
        />
        {/* safe zone borders */}
        <div className="absolute h-full w-px bg-emerald-700" style={{ left: `${minPct}%` }} />
        <div className="absolute h-full w-px bg-emerald-700" style={{ left: `${maxPct}%` }} />
        {/* current marker */}
        <div
          className="absolute w-1 h-4 -top-0.5 -translate-x-0.5"
          style={{ left: `${curPct}%`, backgroundColor: markerColor }}
        />
      </div>
      <div className="flex justify-between text-[9px] font-mono">
        <span className="text-slate-400">{SLIDER_MIN}%</span>
        <span className="text-emerald-700 font-bold">{min}% – {max}% safe zone</span>
        <span className="text-slate-400">{SLIDER_MAX}%</span>
      </div>
      {status !== 'ok' && (
        <p className={`text-[10px] font-bold font-mono flex items-center gap-1 ${status === 'over' ? 'text-[#E60012]' : 'text-amber-700'}`}>
          <AlertTriangle className="w-3 h-3 shrink-0" />
          {status === 'over'
            ? `${current}% exceeds this flour's max (${max}%) — sticky dough risk`
            : `${current}% is below this flour's min (${min}%) — weak gluten activation`}
        </p>
      )}
      {status === 'ok' && (
        <p className="text-[10px] font-bold font-mono flex items-center gap-1 text-emerald-700">
          <CheckCircle2 className="w-3 h-3 shrink-0" />
          {current}% hydration is within the safe zone for this flour
        </p>
      )}
    </div>
  );
}

// ─── Step section header ────────────────────────────────────────────────────
function StepHeader({ num, title, sub }: { num: string; title: string; sub: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-[9px] font-black font-mono text-white bg-slate-900 px-1.5 py-0.5 shrink-0">{num}</span>
      <div>
        <span className="text-[11px] font-black uppercase tracking-widest text-slate-900 block">{title}</span>
        <span className="text-[9px] text-slate-400 font-mono">{sub}</span>
      </div>
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────
export default function DoughCalculator({
  recipe,
  onChange,
  onSendToFdt,
  onSendToJournal,
}: DoughCalculatorProps) {
  const {
    numBalls, ballWeight, hydration, saltPercent,
    yeastPercent, yeastType, oilPercent = 0, sugarPercent = 0,
  } = recipe;

  const [activePresetId, setActivePresetId] = useState<string>('beginner');
  const [displayPresetId, setDisplayPresetId] = useState<string>('beginner');
  const [selectedFlourId, setSelectedFlourId] = useState<string>('typ00_import');
  const [showOil, setShowOil] = useState<boolean>(false);
  const [showSugar, setShowSugar] = useState<boolean>(false);
  const [activeMixerTab, setActiveMixerTab] = useState<'stand' | 'spiral' | 'hand'>('stand');
  const [activeGermanTab, setActiveGermanTab] = useState<'flour' | 'oven'>('flour');

  const selectedFlour = FLOUR_TYPES.find(f => f.id === selectedFlourId) || FLOUR_TYPES[0];

  // When oil/sugar fields are loaded from a preset, auto-show their sliders
  useEffect(() => {
    if (oilPercent > 0) setShowOil(true);
    if (sugarPercent > 0) setShowSugar(true);
  }, []);

  const calculateWeights = (): CalculatedWeights => {
    const totalDoughWeight = numBalls * ballWeight;
    const oil = oilPercent / 100;
    const sugar = sugarPercent / 100;
    const divisor = 1 + hydration / 100 + saltPercent / 100 + yeastPercent / 100 + oil + sugar;
    const flour = Number((totalDoughWeight / divisor).toFixed(1));
    const waterW = Number((flour * (hydration / 100)).toFixed(1));
    const saltW = Number((flour * (saltPercent / 100)).toFixed(1));
    const yeastDry = Number((flour * (yeastPercent / 100)).toFixed(2));
    const oilW = Number((flour * oil).toFixed(1));
    const sugarW = Number((flour * sugar).toFixed(1));
    return {
      flour,
      water: waterW,
      salt: saltW,
      yeast: yeastType === 'fresh' ? Number((yeastDry * 3.07).toFixed(1)) : yeastDry,
      oil: oilW,
      sugar: sugarW,
      total: totalDoughWeight,
    };
  };

  const weights = calculateWeights();

  const handleSelectPreset = (presetId: string) => {
    setActivePresetId(presetId);
    if (presetId !== 'custom') setDisplayPresetId(presetId);
    if (presetId === 'custom') return;
    const found = PIZZA_PRESETS.find(p => p.id === presetId);
    if (found) {
      setShowOil(found.oilPercent > 0);
      setShowSugar(found.sugarPercent > 0);
      onChange({
        numBalls,
        ballWeight: found.ballWeight,
        hydration: found.hydration,
        saltPercent: found.saltPercent,
        yeastPercent: found.yeastPercent,
        yeastType: found.yeastType,
        oilPercent: found.oilPercent,
        sugarPercent: found.sugarPercent,
      });
    }
  };

  // Sync button highlight to 'custom' when params deviate — but displayPresetId never changes here
  useEffect(() => {
    const match = PIZZA_PRESETS.find(p =>
      ballWeight === p.ballWeight &&
      hydration === p.hydration &&
      saltPercent === p.saltPercent &&
      yeastPercent === p.yeastPercent &&
      yeastType === p.yeastType &&
      oilPercent === p.oilPercent &&
      sugarPercent === p.sugarPercent
    );
    setActivePresetId(match ? match.id : 'custom');
  }, [ballWeight, hydration, saltPercent, yeastPercent, yeastType, oilPercent, sugarPercent]);

  const updateField = <K extends keyof PizzaRecipe>(field: K, value: PizzaRecipe[K]) =>
    onChange({ ...recipe, [field]: value });

  const activePreset = PIZZA_PRESETS.find(p => p.id === displayPresetId);
  const hydrationStatus = hydration > selectedFlour.recommendedHydration.max ? 'over'
    : hydration < selectedFlour.recommendedHydration.min ? 'under' : 'ok';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="dough-calculator-section">

      {/* ══════════════════ LEFT: 3-STEP CONFIG PANEL ══════════════════ */}
      <div className="lg:col-span-5 flex flex-col gap-4">

        {/* ── STEP 01: PIZZA STYLE ── */}
        <div className="bg-white border-2 border-slate-900 p-5 brutalist-shadow">
          <StepHeader num="01" title="Pizza Style" sub="Select your fermentation protocol" />
          <div className="grid grid-cols-2 gap-2">
            {PIZZA_PRESETS.map((preset) => {
              const isActive = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.id)}
                  className={`p-2.5 text-left border-2 rounded-none transition-all flex flex-col gap-0.5 ${
                    isActive
                      ? 'bg-slate-900 border-slate-900 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-[10px] font-black uppercase tracking-tight block leading-tight">
                    {preset.name}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-[8px] font-mono font-bold ${isActive ? 'text-white/60' : 'text-slate-400'}`}>
                      {preset.hydration}% H₂O
                    </span>
                    {preset.oilPercent > 0 && (
                      <span className={`text-[7px] font-mono px-1 py-0 border ${isActive ? 'border-white/30 text-white/50' : 'border-slate-300 text-slate-400'}`}>
                        +OIL
                      </span>
                    )}
                    {preset.sugarPercent > 0 && (
                      <span className={`text-[7px] font-mono px-1 py-0 border ${isActive ? 'border-white/30 text-white/50' : 'border-slate-300 text-slate-400'}`}>
                        +MALT
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
            {/* Custom button */}
            <button
              onClick={() => handleSelectPreset('custom')}
              className={`p-2.5 text-left border-2 rounded-none transition-all flex flex-col gap-0.5 ${
                activePresetId === 'custom'
                  ? 'bg-[#E60012] border-slate-900 text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-700'
              }`}
            >
              <span className="text-[10px] font-black uppercase tracking-tight block">Custom Manual</span>
              <span className={`text-[8px] font-mono ${activePresetId === 'custom' ? 'text-white/70' : 'text-slate-400'}`}>
                {activePresetId === 'custom' ? `${hydration}% H₂O` : 'Adjust below'}
              </span>
            </button>
          </div>
          {/* Active protocol note */}
          {activePresetId !== 'custom' && (
            <div className="mt-3 px-2.5 py-1.5 bg-slate-50 border border-slate-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wide">
                Protocol loaded — adjust parameters below to customise
              </span>
            </div>
          )}
        </div>

        {/* ── STEP 02: FLOUR ── */}
        <div className="bg-white border-2 border-slate-900 p-5 brutalist-shadow">
          <StepHeader num="02" title="Flour · Mehl" sub="Advisory — defines safe hydration zone" />
          <div className="grid grid-cols-2 gap-2">
            {FLOUR_TYPES.map((f) => {
              const isActive = selectedFlourId === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setSelectedFlourId(f.id)}
                  className={`p-2.5 text-left border-2 rounded-none transition-all flex flex-col gap-0.5 ${
                    isActive
                      ? 'bg-slate-900 border-slate-900 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-[10px] font-black uppercase tracking-tight block leading-tight truncate">
                    {f.germanLabel}
                  </span>
                  <span className={`text-[11px] font-black font-mono ${isActive ? 'text-[#E60012]' : 'text-slate-800'}`}>
                    {f.wValue}
                  </span>
                  <span className={`text-[8px] font-mono ${isActive ? 'text-white/50' : 'text-slate-400'}`}>
                    {f.proteinRange}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Compatibility panel */}
          <div className="mt-3 p-3 border-2 border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wide text-slate-700">{selectedFlour.germanLabel}</span>
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 border ${
                hydrationStatus === 'ok'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-400'
                  : hydrationStatus === 'over'
                  ? 'bg-red-50 text-[#E60012] border-[#E60012]'
                  : 'bg-amber-50 text-amber-800 border-amber-400'
              }`}>
                {hydrationStatus === 'ok' ? '✓ COMPATIBLE' : hydrationStatus === 'over' ? '⚠ OVER MAX' : '⚠ UNDER MIN'}
              </span>
            </div>
            <HydrationRangeBar
              min={selectedFlour.recommendedHydration.min}
              max={selectedFlour.recommendedHydration.max}
              current={hydration}
            />
            <p className="text-[10px] text-slate-600 italic font-sans leading-relaxed border-t border-dashed border-slate-300 pt-2">
              💡 {selectedFlour.alterationTip}
            </p>
            {hydrationStatus !== 'ok' && (
              <button
                onClick={() => updateField('hydration',
                  hydrationStatus === 'over'
                    ? selectedFlour.recommendedHydration.max
                    : selectedFlour.recommendedHydration.min
                )}
                className="w-full py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-wider border border-slate-900 hover:bg-[#E60012] transition-all font-mono"
              >
                ⚡ Adjust to {hydrationStatus === 'over' ? `max ${selectedFlour.recommendedHydration.max}%` : `min ${selectedFlour.recommendedHydration.min}%`}
              </button>
            )}
          </div>
        </div>

        {/* ── STEP 03: PARAMETERS ── */}
        <div className="bg-white border-2 border-slate-900 p-5 brutalist-shadow">
          <StepHeader num="03" title="Parameters" sub="Fine-tune batch size and percentages" />
          <div className="space-y-5">

            {/* Balls */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="text-slate-700 font-bold uppercase tracking-wider text-[11px]">Dough Balls</label>
                <span className="text-slate-100 font-mono font-black bg-slate-900 px-2 py-0.5 text-[11px]">{numBalls} BALLS</span>
              </div>
              <div className="flex gap-3 items-center">
                <input type="range" min="1" max="50" value={numBalls}
                  onChange={(e) => updateField('numBalls', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 appearance-none cursor-pointer rounded-none" />
                <input type="number" min="1" max="50" value={numBalls}
                  onChange={(e) => updateField('numBalls', Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-14 bg-slate-50 border-2 border-slate-900 px-1.5 py-1 text-center font-mono text-xs font-bold focus:outline-none" />
              </div>
            </div>

            {/* Ball weight */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="text-slate-700 font-bold uppercase tracking-wider text-[11px]">Ball Weight</label>
                <span className="text-slate-100 font-mono font-black bg-slate-900 px-2 py-0.5 text-[11px]">{ballWeight}G</span>
              </div>
              <div className="flex gap-3 items-center">
                <input type="range" min="100" max="1000" step="5" value={ballWeight}
                  onChange={(e) => updateField('ballWeight', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 appearance-none cursor-pointer rounded-none" />
                <input type="number" min="10" max="3000" value={ballWeight}
                  onChange={(e) => updateField('ballWeight', Math.max(10, parseInt(e.target.value) || 250))}
                  className="w-14 bg-slate-50 border-2 border-slate-900 px-1.5 py-1 text-center font-mono text-xs font-bold focus:outline-none" />
              </div>
            </div>

            {/* Hydration */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="text-slate-700 font-bold uppercase tracking-wider text-[11px]">Hydration</label>
                <span className={`font-mono font-black px-2 py-0.5 border-2 text-[11px] ${
                  hydrationStatus === 'ok' ? 'bg-emerald-100 text-emerald-900 border-emerald-700'
                    : hydrationStatus === 'over' ? 'bg-red-50 text-[#E60012] border-[#E60012]'
                    : 'bg-amber-50 text-amber-900 border-amber-700'
                }`}>{hydration}%</span>
              </div>
              <div className="flex gap-3 items-center">
                <input type="range" min="50" max="90" value={hydration}
                  onChange={(e) => updateField('hydration', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 appearance-none cursor-pointer rounded-none" />
                <input type="number" min="40" max="100" value={hydration}
                  onChange={(e) => updateField('hydration', Math.max(40, Math.min(100, parseInt(e.target.value) || 65)))}
                  className="w-14 bg-slate-50 border-2 border-slate-900 px-1.5 py-1 text-center font-mono text-xs font-bold focus:outline-none" />
              </div>
            </div>

            {/* Salt */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="text-slate-700 font-bold uppercase tracking-wider text-[11px]">Salt</label>
                <span className="text-slate-100 font-mono font-black bg-slate-900 px-2 py-0.5 text-[11px]">{saltPercent}%</span>
              </div>
              <div className="flex gap-3 items-center">
                <input type="range" min="1.0" max="4.0" step="0.1" value={saltPercent}
                  onChange={(e) => updateField('saltPercent', parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 appearance-none cursor-pointer rounded-none" />
                <input type="number" min="0" max="10" step="0.1" value={saltPercent}
                  onChange={(e) => updateField('saltPercent', Math.max(0, parseFloat(e.target.value) || 2.5))}
                  className="w-14 bg-slate-50 border-2 border-slate-900 px-1.5 py-1 text-center font-mono text-xs font-bold focus:outline-none" />
              </div>
            </div>

            {/* Optional: Oil */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] text-slate-700 font-bold uppercase tracking-wider">Olive Oil</label>
                <button
                  onClick={() => {
                    const next = !showOil;
                    setShowOil(next);
                    if (!next) updateField('oilPercent', 0);
                    else if (oilPercent === 0) updateField('oilPercent', 2);
                  }}
                  className={`text-[9px] font-black uppercase font-mono px-2 py-1 border transition-all ${
                    showOil ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-500 border-slate-300 hover:border-slate-700'
                  }`}
                >
                  {showOil ? `− Remove (${oilPercent}%)` : '+ Add Oil'}
                </button>
              </div>
              {showOil && (
                <div className="flex gap-3 items-center">
                  <input type="range" min="0" max="5" step="0.5" value={oilPercent}
                    onChange={(e) => updateField('oilPercent', parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 appearance-none cursor-pointer rounded-none" />
                  <input type="number" min="0" max="10" step="0.5" value={oilPercent}
                    onChange={(e) => updateField('oilPercent', Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-14 bg-slate-50 border-2 border-slate-900 px-1.5 py-1 text-center font-mono text-xs font-bold focus:outline-none" />
                </div>
              )}
            </div>

            {/* Optional: Sugar / Malt */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] text-slate-700 font-bold uppercase tracking-wider">Sugar / Diastatic Malt</label>
                <button
                  onClick={() => {
                    const next = !showSugar;
                    setShowSugar(next);
                    if (!next) updateField('sugarPercent', 0);
                    else if (sugarPercent === 0) updateField('sugarPercent', 1);
                  }}
                  className={`text-[9px] font-black uppercase font-mono px-2 py-1 border transition-all ${
                    showSugar ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-500 border-slate-300 hover:border-slate-700'
                  }`}
                >
                  {showSugar ? `− Remove (${sugarPercent}%)` : '+ Add Sugar'}
                </button>
              </div>
              {showSugar && (
                <div className="flex gap-3 items-center">
                  <input type="range" min="0" max="3" step="0.5" value={sugarPercent}
                    onChange={(e) => updateField('sugarPercent', parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 appearance-none cursor-pointer rounded-none" />
                  <input type="number" min="0" max="10" step="0.5" value={sugarPercent}
                    onChange={(e) => updateField('sugarPercent', Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-14 bg-slate-50 border-2 border-slate-900 px-1.5 py-1 text-center font-mono text-xs font-bold focus:outline-none" />
                </div>
              )}
            </div>

            {/* Yeast type + % */}
            <div className="space-y-3 pt-3 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <label className="text-[11px] text-slate-700 font-bold uppercase tracking-wider">Yeast Type</label>
                <div className="flex bg-slate-100 p-0.5 border-2 border-slate-900">
                  {(['dry', 'fresh'] as const).map((type) => (
                    <button key={type} onClick={() => updateField('yeastType', type)}
                      className={`px-3 py-0.5 text-[10px] font-black uppercase transition-all ${
                        yeastType === type ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}>
                      {type === 'dry' ? 'Dry Active' : 'Fresh Block'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
                    Yeast % {yeastType === 'fresh' && <span className="text-[9px] text-slate-400 font-mono">(dry ref × 3.07)</span>}
                  </label>
                  <span className="text-slate-100 font-mono font-black bg-slate-900 px-2 py-0.5 text-[11px]">{yeastPercent}%</span>
                </div>
                <div className="flex gap-3 items-center">
                  <input type="range" min="0.01" max="1.5" step="0.01" value={yeastPercent}
                    onChange={(e) => updateField('yeastPercent', parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 appearance-none cursor-pointer rounded-none" />
                  <input type="number" min="0.001" max="10" step="0.01" value={yeastPercent}
                    onChange={(e) => updateField('yeastPercent', Math.max(0.001, parseFloat(e.target.value) || 0.13))}
                    className="w-14 bg-slate-50 border-2 border-slate-900 px-1.5 py-1 text-center font-mono text-xs font-bold focus:outline-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Water temp CTA */}
          {onSendToFdt && (
            <div className="mt-5 pt-4 border-t border-slate-200">
              <button
                onClick={() => onSendToFdt(weights.flour, weights.water)}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-[#E60012] text-white text-[11px] font-black uppercase tracking-widest border-2 border-slate-900 transition-all flex items-center justify-center gap-2 brutalist-shadow-sm active:translate-x-px active:translate-y-px"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                Calculate Water Temperature (FDT) →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════ RIGHT: RECIPE & RESULTS ══════════════════ */}
      <div className="lg:col-span-7 flex flex-col gap-5">

        {/* Recipe card */}
        <div className="bg-white border-4 border-slate-900 rounded-none p-6 brutalist-shadow-lg relative overflow-hidden flex flex-col gap-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 pb-4 border-b-2 border-slate-900">
            <div>
              <span className="text-[10px] text-white bg-[#E60012] font-black uppercase tracking-widest px-2 py-1">
                Active Formula Recipe
              </span>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mt-2 font-mono">
                {activePreset ? activePreset.name : 'Custom Manual Formulation'}
              </h3>
              {activePresetId === 'custom' && activePreset && (
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wide">
                  Based on {activePreset.name} — parameters modified
                </span>
              )}
            </div>
            <div className="sm:text-right shrink-0">
              <span className="text-[10px] text-slate-500 block font-mono uppercase font-black">Total Dough</span>
              <span className="text-2xl font-black font-mono text-[#E60012]">{weights.total}g</span>
            </div>
          </div>

          {/* Style description */}
          {activePreset && (
            <div className="bg-slate-50 border-2 border-slate-900 p-3">
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-wider mb-1 flex items-center gap-1.5 font-mono">
                <Play className="text-[#E60012] w-3 h-3 fill-current" />
                {activePreset.name} — Protocol Description
              </h4>
              <p className="text-[11px] text-slate-700 leading-normal font-sans">{activePreset.description}</p>
            </div>
          )}

          {/* Ingredient weights grid */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest font-mono text-slate-900 mb-3 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-[#E60012]" />
              Ingredient Weights (Baker's %)
            </h4>
            <div className="grid grid-cols-2 gap-3">

              {/* Flour */}
              <div className="bg-slate-50 border-2 border-slate-900 p-3 flex justify-between items-center brutalist-shadow-sm">
                <div>
                  <span className="text-[10px] text-slate-500 block font-mono font-bold uppercase">Flour</span>
                  <span className="text-[9px] font-mono text-slate-400">{selectedFlour.germanLabel}</span>
                  <span className="text-[9px] font-mono text-[#E60012] block">{selectedFlour.wValue}</span>
                </div>
                <span className="text-xl font-black font-mono text-slate-900 select-all">{weights.flour}g</span>
              </div>

              {/* Water */}
              <div className="bg-slate-50 border-2 border-slate-900 p-3 flex justify-between items-center brutalist-shadow-sm">
                <div>
                  <span className="text-[10px] text-slate-500 block font-mono font-bold uppercase">Water</span>
                  <span className="text-[9px] font-mono text-slate-700">{hydration}% hydration</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black font-mono text-slate-900 select-all">{weights.water}g</span>
                  <span className="text-[10px] text-slate-400 block font-mono">{weights.water} ml</span>
                </div>
              </div>

              {/* Salt */}
              <div className="bg-slate-50 border-2 border-slate-900 p-3 flex justify-between items-center brutalist-shadow-sm">
                <div>
                  <span className="text-[10px] text-slate-500 block font-mono font-bold uppercase">Salt</span>
                  <span className="text-[9px] font-mono text-slate-700">{saltPercent}%</span>
                </div>
                <span className="text-xl font-black font-mono text-slate-900 select-all">{weights.salt}g</span>
              </div>

              {/* Yeast */}
              <div className="bg-slate-50 border-2 border-slate-900 p-3 flex justify-between items-center brutalist-shadow-sm">
                <div>
                  <span className="text-[10px] text-slate-500 block font-mono font-bold uppercase">
                    Yeast {yeastType === 'fresh' ? '(Fresh ×3.07)' : '(Dry Active)'}
                  </span>
                  <span className="text-[9px] font-mono text-slate-700">{yeastPercent}% ref</span>
                </div>
                <span className="text-xl font-black font-mono text-slate-900 select-all">{weights.yeast}g</span>
              </div>

              {/* Oil (only if > 0) */}
              {weights.oil > 0 && (
                <div className="bg-amber-50 border-2 border-amber-700 p-3 flex justify-between items-center brutalist-shadow-sm">
                  <div>
                    <span className="text-[10px] text-amber-700 block font-mono font-bold uppercase">Olive Oil</span>
                    <span className="text-[9px] font-mono text-amber-600">{oilPercent}%</span>
                  </div>
                  <span className="text-xl font-black font-mono text-amber-900 select-all">{weights.oil}g</span>
                </div>
              )}

              {/* Sugar (only if > 0) */}
              {weights.sugar > 0 && (
                <div className="bg-amber-50 border-2 border-amber-700 p-3 flex justify-between items-center brutalist-shadow-sm">
                  <div>
                    <span className="text-[10px] text-amber-700 block font-mono font-bold uppercase">Sugar / Malt</span>
                    <span className="text-[9px] font-mono text-amber-600">{sugarPercent}%</span>
                  </div>
                  <span className="text-xl font-black font-mono text-amber-900 select-all">{weights.sugar}g</span>
                </div>
              )}

            </div>
          </div>

          {/* Timings */}
          {activePreset && (
            <div className="border-t-2 border-slate-900 pt-4 space-y-2">
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest font-mono flex items-center gap-1.5">
                <Clock className="text-[#E60012] w-3.5 h-3.5 shrink-0" />
                Fermentation Timeline
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 border-2 border-slate-900 p-3 font-mono text-[10px]">
                {[
                  ['Bulk Temp', activePreset.timings.bulkRT],
                  ['Bulk Cold', activePreset.timings.bulkCold],
                  ['Ball Temp', activePreset.timings.ballRT],
                  ['Ball Cold', activePreset.timings.ballCold],
                  ['Bake Temp', activePreset.timings.bakeTemp],
                  ['Bake Time', activePreset.timings.bakeTime],
                ].map(([label, value]) => (
                  <div key={label}>
                    <span className="text-slate-400 block text-[8px] uppercase">{label}</span>
                    <span className={`font-bold ${label === 'Bake Temp' ? 'text-[#E60012]' : 'text-slate-900'}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step-by-step instructions */}
          {activePreset && (
            <div className="border-t-2 border-slate-900 pt-4 space-y-3">
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest font-mono flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                Step-by-Step Instructions
              </h4>
              <ul className="space-y-2 list-none pl-0">
                {activePreset.steps.map((step, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start">
                    <span className="w-5 h-5 bg-slate-900 text-white font-mono text-[9px] flex items-center justify-center font-black shrink-0 mt-0.5">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[11px] text-slate-800 font-semibold leading-relaxed font-sans">{step}</span>
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
                className="w-full py-3.5 px-6 bg-[#E60012] hover:bg-slate-950 text-white font-black text-xs tracking-widest uppercase border-2 border-slate-900 transition-all flex items-center justify-center gap-2 brutalist-shadow active:translate-x-px active:translate-y-px"
              >
                <Layers className="w-4 h-4" />
                Initialize LAB Test Protocol Log
              </button>
            </div>
          )}
        </div>

        {/* ── Mixer Guide ── */}
        <div className="bg-white border-4 border-slate-900 p-6 brutalist-shadow-lg">
          <div className="border-b-2 border-slate-900 pb-3 mb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <span className="text-[10px] text-[#E60012] font-black uppercase tracking-widest font-mono block">Mixing Machinery Manual</span>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-[#E60012]" />
                Operator's Guide to Mixers & Manual Kneading
              </h3>
            </div>
            <div className="flex bg-slate-100 p-0.5 border-2 border-slate-900">
              {(['stand', 'spiral', 'hand'] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveMixerTab(tab)}
                  className={`px-3 py-1 text-[10px] font-black uppercase transition-all ${
                    activeMixerTab === tab ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}>
                  {tab === 'stand' ? 'Stand' : tab === 'spiral' ? 'Spiral' : 'Hand'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-3 text-xs text-slate-700 font-sans leading-relaxed">
              {activeMixerTab === 'stand' && (
                <>
                  <div className="bg-slate-100 border-l-4 border-[#E60012] p-3 font-mono text-[10px]">
                    <span className="text-slate-400 block uppercase">Stand Mixer (Planetary Device)</span>
                    <p className="text-slate-800 font-bold mt-0.5">Bowl is static. Hook travels in dual circular motion (spinning on its axis + circumference of bowl).</p>
                  </div>
                  <p><b>Step A</b>: Add water + yeast to bowl. Add 70% of flour. Speed 1 for 3–4 min. Rest 10–15 min (autolyse).</p>
                  <p><b>Step B</b>: Add sea salt. Add remaining flour slowly over 3 min at Speed 1.</p>
                  <p><b>Step C</b>: Speed up to Speed 2 (never higher). Run 5–6 min until dough detaches from bowl walls. FDT rise: +6.5°C.</p>
                  <div className="p-3 border-2 border-dashed border-[#E60012] bg-[#E60012]/5 text-[10px] space-y-1.5">
                    <span className="text-[#E60012] font-black uppercase block">⚠ SilverCrest / Budget Double-Hook Mixers</span>
                    <p>Two interlocking hooks shred gluten 40% faster — <b>reduce kneading from 12 min to max 5–6 min</b>. Never above Speed 1. Use ice-cold water — plastic bowl insulates motor heat into dough.</p>
                  </div>
                </>
              )}
              {activeMixerTab === 'spiral' && (
                <>
                  <div className="bg-slate-100 border-l-4 border-[#E60012] p-3 font-mono text-[10px]">
                    <span className="text-slate-400 block uppercase">Spiral Mixer (Professional)</span>
                    <p className="text-slate-800 font-bold mt-0.5">Hook AND bowl both rotate simultaneously in opposite directions. Continuous forced alignment without tearing. FDT rise: +10°C.</p>
                  </div>
                  <p><b>Step A</b>: Flour + yeast dry in rotating bowl. Slow speed (90 RPM). Drizzle 85% cold water over 2 min. Mix 3 min into shaggy lump.</p>
                  <p><b>Step B</b>: Add salt. Switch to Speed 2 (180–240 RPM) for high hydration. Drip remaining 15% water via bassinage.</p>
                  <p><b>Step C</b>: Knead until extremely glossy and stretching around central column. Total: 8–10 min. Always use cooled water.</p>
                </>
              )}
              {activeMixerTab === 'hand' && (
                <>
                  <div className="bg-slate-100 border-l-4 border-[#E60012] p-3 font-mono text-[10px]">
                    <span className="text-slate-400 block uppercase">Manual Kneading — Ancient Method</span>
                    <p className="text-slate-800 font-bold mt-0.5">No machine. Uses thumbs, palms, and wrists. Least friction heat (+3°C) and maximum tactile feedback on hydration density.</p>
                  </div>
                  <p><b>Step A (Autolyse Slurry)</b>: Dissolve yeast in water. Mix 80% of flour with liquid into thick wet slurry. Rest covered 30 min — gluten links build passively.</p>
                  <p><b>Step B (Slap & Fold)</b>: Place remaining flour on bench. Push away with heel of palm, fold back, spin 90°, repeat. For wet doughs (Canotto/Teglia): lift dough block vertically, slap on bench, fold over to lock air.</p>
                  <p><b>Step C</b>: Sprinkle salt, add tiny splash of water to dissolve, knead 5 more min until silk-like. Finish with windowpane check.</p>
                </>
              )}
            </div>

            <div className="lg:col-span-5 bg-slate-50 border-2 border-slate-900 p-3 font-mono text-[10px] flex flex-col gap-3">
              <h4 className="text-[10px] font-black text-[#E60012] uppercase border-b border-slate-300 pb-1">Friction Heat (FDT Factor)</h4>
              {[
                { label: 'Hand Kneading', factor: '+2–4°C', color: 'text-amber-700', barW: '30%' },
                { label: 'Stand Mixer', factor: '+5–8°C', color: 'text-blue-700', barW: '60%' },
                { label: 'Spiral Mixer', factor: '+8–12°C', color: 'text-emerald-700', barW: '100%' },
              ].map(({ label, factor, color, barW }) => (
                <div key={label}>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="font-bold">{label}</span>
                    <span className={`font-bold ${color}`}>{factor}</span>
                  </div>
                  <div className="h-1.5 bg-slate-200">
                    <div className={`h-full ${color.replace('text-', 'bg-').replace('-700', '-500')}`} style={{ width: barW }} />
                  </div>
                </div>
              ))}
              <p className="text-[9px] text-slate-500 mt-2 font-sans leading-relaxed border-t border-slate-300 pt-2">
                ★ Subtract your mixer's friction factor from your water temperature target in the FDT calculator above.
              </p>
            </div>
          </div>
        </div>

        {/* ── German Flour & Oven Guide ── */}
        <div className="bg-white border-4 border-slate-900 p-6 brutalist-shadow-lg">
          <div className="border-b-2 border-slate-900 pb-3 mb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <span className="text-[10px] text-[#E60012] font-black uppercase tracking-widest font-mono block">Lokale Anpassung</span>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#E60012]" />
                German Flour (Mehl) & Oven (Backofen) Calibration
              </h3>
            </div>
            <div className="flex bg-slate-100 p-0.5 border-2 border-slate-900">
              {(['flour', 'oven'] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveGermanTab(tab)}
                  className={`px-4 py-1 text-[10px] font-black uppercase transition-all ${
                    activeGermanTab === tab ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}>
                  {tab === 'flour' ? 'Flour Guide' : 'Oven Tactics'}
                </button>
              ))}
            </div>
          </div>

          {activeGermanTab === 'flour' && (
            <div className="space-y-3">
              {[
                { label: '1. Italian Tipo 00 (Import)', tag: 'Highly Recommended', tagColor: 'bg-emerald-100 text-emerald-900 border-emerald-900', content: 'Now widely stocked in EDEKA, REWE, Kaufland, and Metro. Look for Caputo Cuoco (Red, W300) or Caputo Pizzeria (Blue, W260). 12–13.5% protein. W280–350. Ideal for Neapolitan, Canotto, and hydrations up to 70%.' },
                { label: '2. Weizenmehl Typ 550', tag: 'Excellent Alternative', tagColor: 'bg-blue-100 text-blue-900 border-blue-900', content: 'Ubiquitous in every German market (ALDI, Lidl, Netto, REWE). Aurora or Diamant Typ 550 are excellent. 11.5–12.8% protein. W230–280. Safely supports 60–64% hydration. Best all-purpose substitute for Tipo 00.' },
                { label: '3. Weizenmehl Typ 405', tag: 'Use with Caution', tagColor: 'bg-yellow-100 text-yellow-900 border-yellow-900', content: 'Standard German pastry flour found in every home. W100–160. Low protein (9–10%). Limit hydration strictly to 56–58% to avoid sticky soup. Aurora Pizzamehl Typ 405 has added Weizenkleber to boost protein to 12%.' },
                { label: '4. Dinkelmehl Typ 630 (Spelt)', tag: 'Specialist Use', tagColor: 'bg-purple-100 text-purple-900 border-purple-900', content: 'Massive in Germany (dm-Bio, Alnatura). W150–200. Very high protein but fragile extensible gluten. Keep hydration below 60% and knead very gently — over-mixing destroys dinkel gluten instantly. Great 50/50 mix with Typ 550.' },
              ].map(({ label, tag, tagColor, content }) => (
                <div key={label} className="p-3 border-2 border-slate-900 bg-slate-50 flex flex-col gap-1.5">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <span className="text-[11px] font-black text-slate-900 uppercase font-mono">{label}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 border font-mono ${tagColor}`}>{tag}</span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-relaxed font-sans">{content}</p>
                </div>
              ))}
            </div>
          )}

          {activeGermanTab === 'oven' && (
            <div className="space-y-3 text-[11px] text-slate-700 font-sans leading-relaxed">
              <div className="bg-slate-100 border-l-4 border-[#E60012] p-3 font-mono text-[10px]">
                <span className="text-slate-400 block uppercase">Domestic Oven Limitation (Haushaltsbackofen)</span>
                <p className="text-slate-800 font-bold mt-0.5">German home ovens (Bosch, Siemens, Miele) max out at 250–275°C. Neapolitan pizza needs 450°C. Use these three tactics:</p>
              </div>
              {[
                { title: 'Tactic 1: Baking Steel (Backstahl)', body: 'Get a 6–8mm heavy Baking Steel. Place on the highest rack. Pre-heat on maximum Ober-/Unterhitze (275°C) for 45–60 min to fully saturate with heat. Do NOT use thin ceramic stones — they can\'t transfer heat fast enough.' },
                { title: 'Tactic 2: Grill/Broiler Bypass', body: 'Right before loading your pizza, switch to Grill (Grillstufe 3 / Maximum). The pre-heated steel bakes the bottom in 2 min, while the active grill chars and blisters the top in 3–4 min total.' },
                { title: 'Tactic 3: Browning Additives', body: 'Domestic ovens bake slower (3–6 min vs. 90s), so the dough dries before browning. Add 1–1.5% diastatic barley malt (Backmalz) or sugar to speed up Maillard reaction at 250°C. Add 2–3% olive oil to lock internal moisture.' },
              ].map(({ title, body }) => (
                <div key={title} className="p-3 border-2 border-slate-900 bg-slate-50">
                  <h4 className="text-[11px] font-black text-slate-900 uppercase font-mono mb-1">{title}</h4>
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
