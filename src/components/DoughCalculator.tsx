/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PizzaRecipe } from '../types';
import DoughProcess3D from './DoughProcess3D';
import { 
  Scale, 
  RefreshCw, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  BookOpen, 
  Clock, 
  HelpCircle, 
  Sparkles, 
  ArrowRight,
  Flame,
  Info,
  ChevronRight
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
    id: 'neapolitan',
    name: 'Classic Neapolitan',
    badge: 'NAPOLETANA_DIRECT_24H',
    description: 'The ancient standard: direct fermentation at ambient room temperature (no fridge). Soft, airy, and hyper-foldable wood-fired crust.',
    hydration: 62,
    saltPercent: 2.8,
    yeastPercent: 0.1,
    ballWeight: 250,
    yeastType: 'dry',
    timings: {
      bulkRT: '18 hours @ 20°C',
      bulkCold: '0 hours (Not recommended)',
      ballRT: '6 hours @ 20°C',
      ballCold: '0 hours (Not recommended)',
      bakeTemp: '430°C - 485°C (Pizza Deck / Wood-Fired)',
      bakeTime: '60 - 90 seconds'
    },
    steps: [
      'In a clean container, dissolve dry or fresh yeast completely inside the calculated water volume.',
      'Blend in roughly 75% of your Tipo 00 flour stock, mixing with hands or machine until a simple, wet cohesive batter is established. Allow to stand for 15-20 minutes (Autolyse) to kick-start flour hydration.',
      'Evenly scatter the fine sea salt onto the batter, then add the remaining flour stock progressively.',
      'Knead the mixture thoroughly (see Mixing Guide below based on your equipment) until a silky, strong, and structural gluten network is formed.',
      'Rest dough block: Shape into a cohesive single ball, cover, and let ferment at ambient room temperature (18°C-21°C) for exactly 18 hours.',
      'Dough Ball division: After 18 hours of bulk fermentation, divide the mass into equal 250g pieces. Tuck and roll tightly from bottom to top to seal off gas escape routes and form round dough balls.',
      'Second proof: Place balls in covered proofing boxes and proof at room temperature for another 6 hours before baking.',
      'Stretching and Bake: Gently stretch by pressing from center outwards. Form a thin center and puffy rim (cornicione). Bake hot at 450°C for 60 to 90 seconds.'
    ]
  },
  {
    id: 'canotto',
    name: 'Contemporary Neapolitan (Canotto)',
    badge: 'CANOTTO_COLD_48H',
    description: 'The modern "lifeboat" style featuring an extremely big, puffy, alveolated rim. Uses higher hydration and slow cold fermentation.',
    hydration: 70,
    saltPercent: 2.5,
    yeastPercent: 0.14,
    ballWeight: 280,
    yeastType: 'dry',
    timings: {
      bulkRT: '2 hours @ 20°C',
      bulkCold: '24 - 40 hours @ 4°C-6°C',
      ballRT: '4 - 6 hours @ 20°C',
      ballCold: '0 hours (Not applicable)',
      bakeTemp: '400°C - 430°C (Pizza Deck / High Heat)',
      bakeTime: '70 - 100 seconds'
    },
    steps: [
      'Stir yeast into cold water. Whisk in 70% of the flour to form a thick shaggy paste. Allow to sit for 30 minutes to develop natural amylase enzymes.',
      'Incorporate salt and the remaining flour carefully. Work the high-hydration mass using stretch-and-fold sequences until it gains structural strength.',
      'Warm Bench Activation: Leave covered at room temperature (20°C) for 2 hours to wake up the yeast multiplication phase.',
      'Slow Cold Maturation: Store in a sealed container in your refrigerator (4°C - 6°C) for 24 to 48 hours. This matures flavor, degrades dense starch chains, and ensures glorious rim blistering (leoparding).',
      'Division: Remove cold dough, slice into large 280g balls, and tension them tightly to preserve internal gas pockets.',
      'Final Room Rest: Proof in closed containers for 4-6 hours at room temp. Balls will relax and grow lightweight like helium pillows.',
      'Hand Crafting: Stretch using the "slap" method, steering clear of the outer 2cm rim. Cook on high deck heat.'
    ]
  },
  {
    id: 'newyork',
    name: 'New York Style (NY Slice)',
    badge: 'NY_CRUST_MALT_72H',
    description: 'A classic crispy and chewy deck-oven pie. Features added olive oil for a supple crumb and sugar/diastatic malt for color browning.',
    hydration: 60,
    saltPercent: 2.2,
    yeastPercent: 0.35,
    ballWeight: 380,
    yeastType: 'dry',
    timings: {
      bulkRT: '1 hour @ 22°C',
      bulkCold: '24 - 72 hours @ 4°C',
      ballRT: '3 - 4 hours @ 22°C (after fridge)',
      ballCold: '12 - 24 hours @ 4°C (Optional)',
      bakeTemp: '260°C - 280°C (Home Oven/Deck steel)',
      bakeTime: '6 - 9 minutes'
    },
    steps: [
      'Whisk high-protein flour, active dry yeast, and 1% sugar or barley malt sweetener in dry bowl.',
      'Begin mixing while adding the room temp water. Continue for 3 minutes.',
      'Drizzle in 2% high-quality olive oil along with the sea salt. Knead for 7-9 minutes. Liquid lipids (oil) lubricate protein strands to make the hallmark chewy NY pie.',
      'Bulk rise: Rest as a single cohesive mass at comfortable room temperature for 1 hour.',
      'Portioning: Slice into heavy 380g pieces (ideal for a wide, thin 14-inch pie). Roll into smooth, dense balls.',
      'Maturation: Store in lightly oiled individual tubs in cold storage (4°C) for 24 to 72 hours (48h yields absolute peak flavor).',
      'Preparation: Bring the dough balls to room temperature 3-4 hours prior to baking to relax gluten bonds.',
      'Baking: Stretch on standard semolina, use knuckle-tossing techniques for uniform thinness, top with low-moisture skim mozzarella, and bake on preheated stone or steel at 275°C.'
    ]
  },
  {
    id: 'teglia',
    name: 'Pizza in Teglia (Roman Pan)',
    badge: 'ROMAN_PAN_HIGH_80H',
    description: 'Super-airy, rectangular pan pizza. Baked in an oiled tray to yield a fried, crispy golden bottom and light, spongy internal voids.',
    hydration: 80,
    saltPercent: 2.5,
    yeastPercent: 0.45,
    ballWeight: 750,
    yeastType: 'dry',
    timings: {
      bulkRT: '1 hour @ 20°C',
      bulkCold: '24 - 48 hours @ 4°C',
      ballRT: '3 - 4 hours @ 21°C',
      ballCold: '0 hours',
      bakeTemp: '250°C (Home Convection Oven)',
      bakeTime: '12 - 15 minutes'
    },
    steps: [
      'In a cold mixing bowl, blend high-gluten flour and yeast. Pour 80% of cooled water slowly while working on slow speed.',
      'Add salt. Now, slowly drip the remaining 20% water (Bassinet method) in small splashes, kneading thoroughly to let the flour absorb water step-by-step.',
      'Drizzle 2% olive oil into the mix at the very end to seal the high hydration matrix.',
      'Empty onto work station. Perform 3 series of coil folds, resting 20 minutes between each fold series. This aligns gluten sheets to handle 80% wetness!',
      'Store in large greased container in cold fridge (4°C) for 24 to 48 hours.',
      'Remove and divide into heavy 750g slabs. Place in well-oiled proofing bins at room temp for 3-4 hours.',
      'Stretch: Dust bench with semola. Transfer dough piece. Press with warm flat fingertips in grid shapes, creating deep air pockets. Lay in blue-steel pan greased with oil.',
      'First bake bottom shelf (7-8 mins), top with sauce and cheese, then move top shelf to melt (5-7 mins).'
    ]
  },
  {
    id: 'tonda',
    name: 'Roman Tonda (Thin & Crispy)',
    badge: 'TONDA_CRACKER_24H',
    description: 'Paper-thin, ultra-crisp street pizza with zero rim. Rolled flat with a pin for uniform cracker consistency and no puff.',
    hydration: 55,
    saltPercent: 2.0,
    yeastPercent: 0.18,
    ballWeight: 180,
    yeastType: 'dry',
    timings: {
      bulkRT: '2 hours @ 20°C',
      bulkCold: '20 hours @ 4°C',
      ballRT: '3 hours @ 22°C',
      ballCold: '0 hours',
      bakeTemp: '300°C - 330°C (Pizza Oven / Baking Steel)',
      bakeTime: '3 - 4 minutes'
    },
    steps: [
      'Combine flour, yeast, and cold water. Mix on slow speed: low hydration (55%) will make a stiff, dense dough mass.',
      'Add fine sea salt and 3% olive oil. Knead intensely for 10-12 minutes until structural strands are tight and completely dry.',
      'Bulk rest: Rest dough at warm room temp for 2 hours, allowing mild enzymatic fermentation.',
      'Cold Chain: Let mature in your refrigerator for 20 hours to relax molecular gluten tension.',
      'Divide: Slice dough into lightweight 180g pieces. Roll into ultra-tight, smooth spheres.',
      'Proof stage: Rest balls in proofing tray for 3 hours at room temperature.',
      'Rolling: Using a rolling pin (mattarello), roll from center outwards on a lightly floured bench until thin like paper (translucent). Zero rim allowed.',
      'Cooking: Bake on hot steel/stone at 300°C+ until completely dry, stiff, and crisp.'
    ]
  },
  {
    id: 'detroit',
    name: 'Detroit Style Pizza',
    badge: 'DETROIT_PAN_48H',
    description: 'Thick, rectangular pan pizza engineered perfectly for home ovens. Spongy internal crumb with a crispy fried bottom and caramelized cheese boundary walls.',
    hydration: 70,
    saltPercent: 2.5,
    yeastPercent: 0.45,
    ballWeight: 450,
    yeastType: 'dry',
    timings: {
      bulkRT: '2 hours @ 21°C',
      bulkCold: '24 - 48 hours @ 4°C',
      ballRT: '3 hours in oiled pan @ 24°C',
      ballCold: '0 hours',
      bakeTemp: '245°C - 260°C (Standard Home Oven)',
      bakeTime: '12 - 15 minutes'
    },
    steps: [
      'Blend flour, yeast, and very cold water in the mixing bowl. Mix for 4 minutes until hydrated.',
      'Add fine sea salt and 2% olive oil. Knead for 7-9 minutes on Speed 2 until the wet gluten network holds structured tension.',
      'Bulk fermentation activation: Rest covered at stable room temperature for exactly 2 hours.',
      'Cold chain storage: Transfer to your refrigerator (4°C) for 24 to 48 hours to fully digest starch bonds.',
      'Pan Stretching: Coat a 10x14 or 8x10 heavy cake/pizza pan with 2 tablespoons of olive oil. Turn the cold dough block onto the center, pushing with fingers to flatten. Rest 30 minutes if dough resists, then press again until it touches all four corners.',
      'Final proof in pan: Let the dough proof uncovered in a warm kitchen area for 3 hours until double in thickness, highly reactive, and bubbly.',
      'The Cheese Wall: Lay young German Butterkäse or a dry Mozzarella-Cheddar blend *all the way to the edges* against the steel pan walls. Pour two parallel lines of thick tomato sauce on top.',
      'Home Bake: Pre-heat oven to its absolute max (250°C-275°C) with a baking steel/stone inside. Bake on the lowest rack for 12-15 minutes until the bottom is deep fried and the cheese edges are black and beautifully caramelized (Frico).'
    ]
  },
  {
    id: 'flammkuchen',
    name: 'Classic Flammkuchen',
    badge: 'ELSASS_CRISP_DIRECT',
    description: 'The iconic Alsatian/German flatbread. Extremely crispy, paper-thin, yeast-free or yeast-relaxed dough, backed with Creme Fraiche, onions, and Speck.',
    hydration: 50,
    saltPercent: 2.0,
    yeastPercent: 0.05,
    ballWeight: 155,
    yeastType: 'dry',
    timings: {
      bulkRT: '1 hour @ 21°C',
      bulkCold: '0 hours',
      ballRT: '1 hour @ 22°C',
      ballCold: '0 hours',
      bakeTemp: '275°C - 300°C (Home oven maxed + steel)',
      bakeTime: '4 - 5 minutes'
    },
    steps: [
      'Whisk German Weizenmehl (preferably Type 550 or Type 405), salt, water, neutral sunflower oil (or lard), and a tiny pinch of yeast.',
      'Knead intensely for 10 minutes until you established a stiff, slick, and completely non-sticky dough mass.',
      'Gluten relaxation rest: Keep covered on the counter for 1 hour at room temp. This is crucial—resting relaxes gluten tension so you can roll it paper-thin without spring-back.',
      'Division: Slice the mass into equal 150-160g portions and roll tightly into smooth, dry spheres. Rest covered on counter for an additional 45 minutes.',
      'Paper Rolling: Rolling pin is mandatory! Generously dust bench with flour. Roll the ball from center outwards until it is ultra-thin (under 1.5mm) and translucent.',
      'Traditional Topping: Slather with a dense layer of salted Schmand (or thick Creme Fraiche) spiced with nutmeg and pepper. Top with Spekwürfel (diced raw bacon) and finely sliced red cooking onion rings.',
      'Steel Blast: Slide flatbread directly onto a preheated baking steel (Backstahl) on your German oven’s top-rack set to 275°C-300°C. Cook for 4-5 minutes until edges bubble black and the crust is completely rigid.'
    ]
  },
  {
    id: 'focaccia',
    name: 'Genoese Focaccia',
    badge: 'FOCACCIA_GENOVESE_24H',
    description: 'Classic olive oil sea-salt flatbread (Focaccia Genovese). Crispy outside, thick and cushiony inside with deep brine-filled finger dimples (salamoia).',
    hydration: 75,
    saltPercent: 2.8,
    yeastPercent: 0.5,
    ballWeight: 600,
    yeastType: 'dry',
    timings: {
      bulkRT: '2 hours @ 21°C',
      bulkCold: '18 - 24 hours @ 4°C',
      ballRT: '3 hours in baking sheet @ 22°C',
      ballCold: '0 hours',
      bakeTemp: '220°C - 230°C (Standard Home Oven)',
      bakeTime: '15 - 20 minutes'
    },
    steps: [
      'Mix-Setup: In a medium bowl, dissolve yeast and sugar/malt inside calculated water. Drizzle in 3% cold-pressed olive oil (extra vergine). Add 80% of Weizenmehl (preferably Typ 550 or Tipo 00) and mix.',
      'Salt addition & Knead: Add salt and remaining flour progressively. Knead for 8-10 minutes. High hydration (75%) will feel sticky; use helper stretch-and-fold repetitions rather than aggressive dry flour addition to preserve hydration.',
      'Gluten Network: Leave the dough sitting covered for 45 minutes, then carry out two coil folds inside the bowl. Bulk ferment at room temp (21°C) for 2 hours.',
      'Chill chain: Save covered dough block in the fridge at 4°C for 18 to 24 hours to gain rich yeasty depth.',
      'Bakery Tray Stretch: Liberally oil a rectangular German baking sheet (Backblech) with olive oil. Transfer cold dough onto the sheet. Rest 20 minutes, then pull and press dough outwards. Rest another 20 minutes if it snaps back, then stretch again until it fills the tray.',
      'Dimples & Brining (Salamoia): Let the stretched dough rise at room temperature for 2-3 hours until thick and highly aerated. Whisk a brine (Salamoia) of 3 tbsp warm water, 2 tbsp olive oil, and 1 tsp sea salt. Drizzle all over the dough. Press fingers straight down deep into the dough to the bottom of the tray to create classic craters filled with brine.',
      'Second Rise: Rest for an additional 45 minutes in warm kitchen to let craters inflate.',
      'Bake: Heat your German oven to 230°C (Ober-/Unterhitze). Bake on the lower-middle shelf for 15-20 minutes until intense golden and crispy. Brush with extra olive oil immediately out of the oven!'
    ]
  }
];

export interface FlourType {
  id: string;
  name: string;
  germanLabel: string;
  proteinRange: string;
  recommendedHydration: { min: number; max: number };
  description: string;
  alterationTip: string;
}

export const FLOUR_TYPES: FlourType[] = [
  {
    id: 'typ00_import',
    name: 'Imported Italian Tipo 00 (Caputo / 5 Stagioni)',
    germanLabel: 'Tipo 00 (Caputo/Import)',
    proteinRange: '12.5% - 13.5%',
    recommendedHydration: { min: 62, max: 70 },
    description: 'Elite high-strength imported Italian specialty flour. Holds very strong, elastic gluten structures meant for high-temperature pizza ovens.',
    alterationTip: 'Perfect alignment with classic Neapolitan recipes! Safely supports high hydration up to 70%. Kneads beautifully.'
  },
  {
    id: 'typ00_supermarket',
    name: 'German Supermarket Tipo 00 / Pizzamehl (Edeka, Kaufland, Lidl, Aldi, Rewe)',
    germanLabel: 'Tipo 00 (Supermarkt Pizzamehl)',
    proteinRange: '10.5% - 11.5%',
    recommendedHydration: { min: 58, max: 62 },
    description: 'Domestic German supermarket pizza flour brands (e.g., Aurora, Diamant, K-Classic, Gut & Günstig, Primana). Perfect for high accessibility, but features standard gluten framework.',
    alterationTip: 'Warning: German supermarket Tipo 00 flours have lower protein than professional Italian imports. Limit hydration strictly to 58%–62% depending on the brand to avoid sticky, unworkable dough!'
  },
  {
    id: 'typ550',
    name: 'Weizenmehl Type 550',
    germanLabel: 'Weizenmehl Typ 550',
    proteinRange: '11.5% - 12.8%',
    recommendedHydration: { min: 60, max: 64 },
    description: 'Standard German bread flour with excellent gluten strength. More water absorptive capacity than pastry flour.',
    alterationTip: 'Very reliable choice. Safe hydration range is 60%–64%. Going above 64% is possible but needs bassinage (adding water slowly) or folding.'
  },
  {
    id: 'typ630',
    name: 'Dinkelmehl Type 630',
    germanLabel: 'Dinkelmehl Typ 630',
    proteinRange: '12.5% - 14.0%',
    recommendedHydration: { min: 58, max: 60 },
    description: 'Organic spelt wheat. High natural protein but very extensible, fragile gluten sheets that relax and slack quickly.',
    alterationTip: 'Warning: Spelt gluten tears easily under heavy machine kneading. Cut your kneading time in half, or knead strictly by hand. Keep hydration below 60%.'
  },
  {
    id: 'typ405',
    name: 'Weizenmehl Type 405',
    germanLabel: 'Weizenmehl Typ 405',
    proteinRange: '9.0% - 10.5%',
    recommendedHydration: { min: 55, max: 58 },
    description: 'German standard cake & pastry flour. Fine starch structure with low protein content and weak gluten elasticity.',
    alterationTip: 'Warning: Poor absorption! Hydration above 58% turns Typ 405 into sticky mush. If baking with Typ 405, restrict hydration to 55-58% or add organic wheat gluten.'
  }
];

export default function DoughCalculator({
  recipe,
  onChange,
  onSendToFdt,
  onSendToJournal,
}: DoughCalculatorProps) {
  const { numBalls, ballWeight, hydration, saltPercent, yeastPercent, yeastType } = recipe;

  const [activePresetId, setActivePresetId] = useState<string>('neapolitan');
  const [activeMixerTab, setActiveMixerTab] = useState<'stand' | 'spiral' | 'hand'>('stand');
  const [activeGermanTab, setActiveGermanTab] = useState<'flour' | 'oven'>('flour');
  const [selectedFlourId, setSelectedFlourId] = useState<string>('typ550');

  const selectedFlour = FLOUR_TYPES.find(f => f.id === selectedFlourId) || FLOUR_TYPES[1];

  const calculateWeights = (): CalculatedWeights => {
    const totalDoughWeight = numBalls * ballWeight;
    const divisor = 1 + (hydration / 100) + (saltPercent / 100) + (yeastPercent / 100);
    const flour = Number((totalDoughWeight / divisor).toFixed(1));
    const water = Number((flour * (hydration / 100)).toFixed(1));
    const salt = Number((flour * (saltPercent / 100)).toFixed(1));
    const yeast = Number((flour * (yeastPercent / 100)).toFixed(2));

    return {
      flour,
      water,
      salt,
      yeast: yeastType === 'fresh' ? Number((yeast * 3.07).toFixed(1)) : yeast,
      total: totalDoughWeight,
    };
  };

  const weights = calculateWeights();

  const handleSelectPreset = (presetId: string) => {
    setActivePresetId(presetId);
    if (presetId === 'custom') return;
    const found = PIZZA_PRESETS.find(p => p.id === presetId);
    if (found) {
      onChange({
        numBalls,
        ballWeight: found.ballWeight,
        hydration: found.hydration,
        saltPercent: found.saltPercent,
        yeastPercent: found.yeastPercent,
        yeastType: found.yeastType,
      });
    }
  };

  // Sync back to custom if parameters deviate from the presets
  useEffect(() => {
    const matchingPreset = PIZZA_PRESETS.find(p => 
      ballWeight === p.ballWeight &&
      hydration === p.hydration &&
      saltPercent === p.saltPercent &&
      yeastPercent === p.yeastPercent &&
      yeastType === p.yeastType
    );
    if (matchingPreset) {
      setActivePresetId(matchingPreset.id);
    } else {
      setActivePresetId('custom');
    }
  }, [ballWeight, hydration, saltPercent, yeastPercent, yeastType]);

  const updateField = <K extends keyof PizzaRecipe>(field: K, value: PizzaRecipe[K]) => {
    onChange({
      ...recipe,
      [field]: value,
    });
  };

  const activePreset = PIZZA_PRESETS.find(p => p.id === activePresetId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="dough-calculator-section">
      {/* Inputs & Presets Selector Panel */}
      <div className="lg:col-span-5 bg-white border-2 border-slate-900 rounded-none p-6 brutalist-shadow flex flex-col justify-between">
        <div>
          {/* Preset Cards Selector */}
          <div className="mb-6 pb-4 border-b border-slate-200">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-3">
              <Sparkles className="text-[#E60012] w-4 h-4 shrink-0" />
              Select Pizza Style Preset
            </h3>
            
            <div className="grid grid-cols-2 gap-2">
              {PIZZA_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.id)}
                  className={`p-3 text-left border-2 rounded-none transition-all flex flex-col justify-between ${
                    activePresetId === preset.id
                      ? 'bg-slate-900 border-slate-900 text-white brutalist-shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-705 hover:border-slate-800'
                  }`}
                >
                  <span className="text-xs font-black uppercase tracking-tight block truncate">
                    {preset.name}
                  </span>
                  <span className={`text-[8px] font-mono mt-1 ${
                    activePresetId === preset.id ? 'text-white/60' : 'text-slate-400'
                  }`}>
                    {preset.hydration}% Hydration
                  </span>
                </button>
              ))}
              <button
                onClick={() => handleSelectPreset('custom')}
                className={`p-3 text-left border-2 rounded-none transition-all ${
                  activePresetId === 'custom'
                    ? 'bg-[#E60012] border-slate-900 text-white brutalist-shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-800'
                }`}
              >
                <span className="text-xs font-black uppercase tracking-tight block">
                  Custom Manual
                </span>
                <span className={`text-[8px] font-mono block mt-1 ${
                  activePresetId === 'custom' ? 'text-white/70' : 'text-slate-400'
                }`}>
                  Configure Below
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-6 uppercase text-xs font-black tracking-tight text-slate-850">
            <Scale className="text-[#E60012] w-4 h-4 shrink-0" />
            Parameter Sliders (Modifies Preset to Custom)
          </div>

          <div className="space-y-6">
            {/* Number of Balls */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="text-slate-700 font-bold uppercase tracking-wider">Number of Dough Balls</label>
                <span className="text-slate-100 font-mono font-black bg-slate-900 px-2 py-1 border border-slate-900 text-xs">
                  {numBalls} BALLS
                </span>
              </div>
              <div className="flex gap-4 items-center">
                <input
                  id="num-balls-slider"
                  type="range"
                  min="1"
                  max="50"
                  value={numBalls}
                  onChange={(e) => updateField('numBalls', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-none appearance-none cursor-pointer"
                />
                <input
                  id="num-balls-num"
                  type="number"
                  min="1"
                  max="50"
                  value={numBalls}
                  onChange={(e) => updateField('numBalls', Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 bg-slate-50 border-2 border-slate-900 rounded-none px-2 py-1 text-center font-mono text-xs font-bold text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            {/* Ball Weight */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="text-slate-700 font-bold uppercase tracking-wider">Dough Ball Weight</label>
                <span className="text-slate-100 font-mono font-black bg-slate-900 px-2 py-1 border border-slate-900 text-xs">
                  {ballWeight}G
                </span>
              </div>
              <div className="flex gap-4 items-center">
                <input
                  id="ball-weight-slider"
                  type="range"
                  min="100"
                  max="1000"
                  step="5"
                  value={ballWeight}
                  onChange={(e) => updateField('ballWeight', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-none appearance-none cursor-pointer"
                />
                <input
                  id="ball-weight-num"
                  type="number"
                  min="10"
                  max="3000"
                  value={ballWeight}
                  onChange={(e) => updateField('ballWeight', Math.max(10, parseInt(e.target.value) || 250))}
                  className="w-16 bg-slate-50 border-2 border-slate-900 rounded-none px-2 py-1 text-center font-mono text-xs font-bold text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            {/* German Market Flour Calibration */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <div className="flex justify-between items-center text-xs">
                <label className="text-slate-700 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-[#E60012] block border border-slate-950" />
                  Select Flour type (Mehl-Katalog)
                </label>
                <span className="text-[9px] font-mono font-bold bg-[#E60012] text-white px-1 py-0.5 uppercase tracking-wide">
                  Gluten-Spezifikation
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {FLOUR_TYPES.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      setSelectedFlourId(f.id);
                    }}
                    className={`p-2.5 text-left border-2 rounded-none transition-all flex flex-col justify-between ${
                      selectedFlourId === f.id
                        ? 'bg-slate-900 border-slate-900 text-white brutalist-shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-800'
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-tight block truncate">
                      {f.germanLabel}
                    </span>
                    <span className={`text-[8px] font-mono mt-0.5 block ${
                      selectedFlourId === f.id ? 'text-white/70' : 'text-slate-400'
                    }`}>
                      {f.proteinRange} Protein
                    </span>
                  </button>
                ))}
              </div>
              
              {/* Active Flour info box */}
              <div className="p-3 border-2 border-slate-900 bg-slate-50 flex flex-col gap-1">
                <span className="text-[10px] text-slate-400 font-mono block uppercase">Flour Profile</span>
                <p className="text-[11px] text-slate-800 font-bold leading-normal font-sans">
                  {selectedFlour.description}
                </p>
                <div className="mt-1 border-t border-dashed border-slate-300 pt-1 text-[10px] text-slate-705 leading-relaxed font-sans italic flex flex-col gap-1 bg-slate-100/50 p-1.5 border border-slate-200">
                  <span><b>💡 Recipe adjustment guideline:</b></span>
                  <span>{selectedFlour.alterationTip}</span>
                </div>
              </div>
            </div>

            {/* Hydration */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="text-slate-700 font-bold uppercase tracking-wider">Hydration (Water %)</label>
                <span className={`font-mono font-black px-2.5 py-1 border-2 text-xs ${
                  hydration >= selectedFlour.recommendedHydration.min && hydration <= selectedFlour.recommendedHydration.max
                    ? 'bg-green-100 text-green-900 border-green-900'
                    : hydration > selectedFlour.recommendedHydration.max
                    ? 'bg-red-50 text-[#E60012] border-[#E60012]'
                    : 'bg-yellow-50 text-yellow-905 border-yellow-900'
                }`}>
                  {hydration}%
                </span>
              </div>
              <div className="flex gap-4 items-center">
                <input
                  id="hydration-slider"
                  type="range"
                  min="50"
                  max="90"
                  value={hydration}
                  onChange={(e) => updateField('hydration', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-none appearance-none cursor-pointer"
                />
                <input
                  id="hydration-num"
                  type="number"
                  min="40"
                  max="100"
                  value={hydration}
                  onChange={(e) => updateField('hydration', Math.max(10, parseInt(e.target.value) || 62))}
                  className="w-16 bg-slate-50 border-2 border-slate-900 rounded-none px-2 py-1 text-center font-mono text-xs font-bold text-slate-900 focus:outline-none"
                />
              </div>

              {/* Dynamic Warning Alert banner directly adjusting on the recipe based on flour type choice */}
              {hydration > selectedFlour.recommendedHydration.max && (
                <div className="text-[11px] text-[#E60012] font-semibold bg-red-50 p-2.5 border-2 border-[#E60012] space-y-2">
                  <div className="flex items-start gap-1.5 leading-normal">
                    <AlertTriangle className="w-4 h-4 inline shrink-0 mt-0.5 text-[#E60012]" />
                    <span>
                      <b>HYDRATION WARNING</b>: {selectedFlour.germanLabel} is rated for maximum <b>{selectedFlour.recommendedHydration.max}%</b> hydration. Your level of <b>{hydration}%</b> will turn it into sticky soup!
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateField('hydration', selectedFlour.recommendedHydration.max)}
                    className="w-full py-1.5 bg-[#E60012] text-white text-[10px] font-bold uppercase tracking-wider hover:bg-slate-950 transition-all text-center border-2 border-slate-900 block font-mono brutalist-shadow-xs"
                  >
                    ⚡ Auto-Adjust Hydration to Safe Max ({selectedFlour.recommendedHydration.max}%)
                  </button>
                </div>
              )}

              {hydration < selectedFlour.recommendedHydration.min && (
                <div className="text-[11px] text-amber-900 font-semibold bg-amber-50 p-2.5 border-2 border-amber-600 space-y-2">
                  <div className="flex items-start gap-1.5 leading-normal">
                    <AlertTriangle className="w-4 h-4 inline shrink-0 mt-0.5 text-amber-600" />
                    <span>
                      <b>UNDER-HYDRATION NOTE</b>: {selectedFlour.germanLabel} requires at least <b>{selectedFlour.recommendedHydration.min}%</b> hydration for proper gluten activation.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateField('hydration', selectedFlour.recommendedHydration.min)}
                    className="w-full py-1.5 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-slate-950 transition-all text-center border-2 border-slate-900 block font-mono brutalist-shadow-xs"
                  >
                    ⚡ Auto-Adjust Hydration to safe Min ({selectedFlour.recommendedHydration.min}%)
                  </button>
                </div>
              )}

              {hydration >= selectedFlour.recommendedHydration.min && hydration <= selectedFlour.recommendedHydration.max && (
                <p className="text-[11px] text-emerald-800 font-medium flex items-center gap-1.5 bg-emerald-50 p-2 border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 inline shrink-0 text-emerald-600" />
                  Water level calibrated successfully for {selectedFlour.germanLabel}.
                </p>
              )}
            </div>

            {/* Salt */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="text-slate-700 font-bold uppercase tracking-wider">Salt Percentage</label>
                <span className="text-slate-100 font-mono font-black bg-slate-900 px-2 py-1 border border-slate-900 text-xs">
                  {saltPercent}%
                </span>
              </div>
              <div className="flex gap-4 items-center">
                <input
                  id="salt-slider"
                  type="range"
                  min="1.0"
                  max="4.0"
                  step="0.1"
                  value={saltPercent}
                  onChange={(e) => updateField('saltPercent', parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-none appearance-none cursor-pointer"
                />
                <input
                  id="salt-num"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={saltPercent}
                  onChange={(e) => updateField('saltPercent', Math.max(0, parseFloat(e.target.value) || 2.5))}
                  className="w-16 bg-slate-50 border-2 border-slate-900 rounded-none px-2 py-1 text-center font-mono text-xs font-bold text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            {/* Yeast Percentage and Type */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <label className="text-xs text-slate-700 font-bold uppercase tracking-wider">Yeast Formula</label>
                <div className="flex bg-slate-100 p-0.5 border-2 border-slate-900 rounded-none">
                  <button
                    onClick={() => updateField('yeastType', 'dry')}
                    className={`px-3 py-1 text-xs font-black uppercase transition-all ${
                      yeastType === 'dry'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Dry Active
                  </button>
                  <button
                    onClick={() => updateField('yeastType', 'fresh')}
                    className={`px-3 py-1 text-xs font-black uppercase transition-all ${
                      yeastType === 'fresh'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Fresh Block
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="text-slate-700 font-semibold uppercase tracking-wider">Yeast % (Dry Reference)</label>
                  <span className="text-slate-100 font-mono font-black bg-slate-900 px-2 py-1 border border-slate-900 text-xs">
                    {yeastPercent}%
                  </span>
                </div>
                <div className="flex gap-4 items-center">
                  <input
                    id="yeast-slider"
                    type="range"
                    min="0.01"
                    max="1.5"
                    step="0.01"
                    value={yeastPercent}
                    onChange={(e) => updateField('yeastPercent', parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-none appearance-none cursor-pointer"
                  />
                  <input
                    id="yeast-num"
                    type="number"
                    min="0.001"
                    max="10"
                    step="0.01"
                    value={yeastPercent}
                    onChange={(e) => updateField('yeastPercent', Math.max(0.001, parseFloat(e.target.value) || 0.1))}
                    className="w-16 bg-slate-50 border-2 border-slate-900 rounded-none px-2 py-1 text-center font-mono text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action button in parameters panel */}
        {onSendToFdt && (
          <div className="mt-8 pt-4 border-t border-slate-200">
            <button
              id="btn-calculate-water-temp"
              onClick={() => onSendToFdt(weights.flour, weights.water)}
              className="w-full py-3 px-4 bg-slate-900 hover:bg-[#E60012] text-white text-xs font-black uppercase tracking-widest rounded-none border-2 border-slate-900 transition-all flex items-center justify-center gap-2 brutalist-shadow active:translate-x-[2px] active:translate-y-[2px]"
            >
              <RefreshCw className="w-4 h-4 text-white animate-spin" style={{ animationDuration: '6s' }} />
              Calculate Water Temperature
            </button>
          </div>
        )}
      </div>

      {/* Weights Display & Live Recipe Guidelines Panel */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        {/* Main calculation card */}
        <div className="bg-white border-4 border-slate-900 rounded-none p-6 md:p-8 brutalist-shadow-lg relative overflow-hidden flex-1 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6 pb-4 border-b-2 border-slate-900">
              <div>
                <span className="text-[10px] text-white bg-[#E60012] font-black uppercase tracking-widest border border-slate-900 px-2 py-1">
                  Active Formula Recipe
                </span>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mt-3 font-mono">
                  {activePreset ? activePreset.name : 'Custom Manual Formulation'}
                </h3>
              </div>
              <div className="sm:text-right">
                <span className="text-[10px] text-slate-505 block font-mono uppercase font-black">Total Target Net Weight</span>
                <span className="text-2xl font-black font-mono text-[#E60012]">{weights.total}g</span>
              </div>
            </div>

            {/* Active Style Specs Callout */}
            {activePreset && (
              <div className="bg-slate-50 border-2 border-slate-950 rounded-none p-4 mb-6">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-1 flex items-center gap-1.5 font-mono">
                  <Play className="text-[#E60012] w-3 h-3 fill-current" />
                  "{activePreset.name}" Strategy Profile
                </h4>
                <p className="text-xs text-slate-700 leading-normal font-sans">
                  {activePreset.description}
                </p>
              </div>
            )}

            {/* Ingredient breakdown grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Flour */}
              <div className="bg-slate-50 border-2 border-slate-900 rounded-none p-4 flex justify-between items-center brutalist-shadow-sm">
                <div>
                  <span className="text-[11px] text-slate-500 block font-mono font-bold uppercase">Flour ({selectedFlour.germanLabel})</span>
                  <span className="text-xs font-mono font-bold text-[#E60012]">100.0% Standard Base</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black font-mono text-slate-900 select-all">{weights.flour}g</span>
                </div>
              </div>

              {/* Water */}
              <div className="bg-slate-50 border-2 border-slate-900 rounded-none p-4 flex justify-between items-center brutalist-shadow-sm">
                <div>
                  <span className="text-[11px] text-slate-500 block font-mono font-bold uppercase">Water (Liquid Hydration)</span>
                  <span className="text-xs font-mono font-bold text-slate-700">{hydration}% Hydration Target</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black font-mono text-slate-900 select-all">{weights.water}g</span>
                  <span className="text-[11px] text-slate-400 block font-mono">{weights.water} ml</span>
                </div>
              </div>

              {/* Salt */}
              <div className="bg-slate-50 border-2 border-slate-900 rounded-none p-4 flex justify-between items-center brutalist-shadow-sm">
                <div>
                  <span className="text-[11px] text-slate-500 block font-mono font-bold uppercase">Fine Sea Salt</span>
                  <span className="text-xs font-mono font-bold text-slate-700">{saltPercent}% Ratio</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black font-mono text-slate-900 select-all">{weights.salt}g</span>
                </div>
              </div>

              {/* Yeast */}
              <div className="bg-slate-50 border-2 border-slate-900 rounded-none p-4 flex justify-between items-center brutalist-shadow-sm">
                <div>
                  <span className="text-[11px] text-slate-500 block font-mono font-bold uppercase">
                    Yeast {yeastType === 'dry' ? '(Active Dry)' : '(Fresh Block)'}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-750">
                    {yeastPercent}% Reference {yeastType === 'fresh' && '(x3.07 calculation applied)'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black font-mono text-slate-900 select-all">{weights.yeast}g</span>
                </div>
              </div>
            </div>

            {/* TIMINGS CONTAINER - PROPER TIMINGS DETAILED */}
            {activePreset && (
              <div className="mt-6 border-t-2 border-slate-900 pt-5 space-y-3">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest font-mono flex items-center gap-1.5">
                  <Clock className="text-[#E60012] w-4 h-4 shrink-0" />
                  TIMELINE & METRIC MATURATION TIMINGS
                </h4>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 border-2 border-slate-900 p-3 font-mono text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase">Bulk Temp Stage</span>
                    <span className="text-slate-900 font-bold">{activePreset.timings.bulkRT}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase">Bulk Cold Chain</span>
                    <span className="text-slate-900 font-bold">{activePreset.timings.bulkCold}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase">Ball Temp Proof</span>
                    <span className="text-slate-900 font-bold">{activePreset.timings.ballRT}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase">Ball Cold Chain</span>
                    <span className="text-slate-900 font-bold">{activePreset.timings.ballCold}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase">Bake Temp Specs</span>
                    <span className="text-[#E60012] font-black">{activePreset.timings.bakeTemp}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase">Bake Duration</span>
                    <span className="text-slate-900 font-bold">{activePreset.timings.bakeTime}</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP BY STEP MASTER INSTRUCTIONS */}
            {activePreset && (
              <div className="mt-6 space-y-3">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest font-mono flex items-center gap-1.5">
                  <BookOpen className="text-slate-900 w-4 h-4 shrink-0" />
                  STEP-BY-STEP RECIPE INSTRUCTIONAL SEQUENCE
                </h4>
                <ul className="text-xs text-slate-700 space-y-2.5 list-none pl-0 leading-relaxed font-sans">
                  {activePreset.steps.map((step, idx) => (
                    <li key={idx} className="flex gap-2.5 items-start">
                      <span className="w-5 h-5 bg-slate-900 border border-slate-950 text-white font-mono text-[9px] flex items-center justify-center font-black shrink-0 mt-0.5">
                        0{idx + 1}
                      </span>
                      <span className="text-slate-800 text-xs font-semibold">{step}</span>
                    </li>
                  ))}
                </ul>

                {/* Interactive 3D mixing guides right here on the main page! */}
                <DoughProcess3D 
                  recipe={recipe} 
                  weights={weights} 
                  presetName={activePreset.name} 
                />
              </div>
            )}
          </div>

          {/* Create Journal Entry action button */}
          {onSendToJournal && (
            <div className="mt-8 pt-6 border-t-2 border-slate-900">
              <button
                id="btn-create-lab-proto"
                onClick={() => onSendToJournal(recipe, weights)}
                className="w-full py-4 px-6 bg-[#E60012] hover:bg-slate-950 text-white font-black text-sm tracking-widest uppercase rounded-none border-2 border-slate-900 transition-all flex items-center justify-center gap-2 brutalist-shadow active:translate-x-[2px] active:translate-y-[2px]"
              >
                <Layers className="w-4 h-4" />
                Initialize LAB Test Protocol Log
              </button>
              <p className="text-[10px] text-slate-400 text-center mt-3 font-mono">
                SECURE RECORD REGULATION: AUTOMATICALLY COPIED TO WORKSTATION CACHE
              </p>
            </div>
          )}
        </div>
      </div>

      {/* OPERATOR'S SPECIAL TECHNICAL MANUAL: STAND VS SPIRAL VS HAND MIXERS */}
      <div className="lg:col-span-12 mt-4">
        <div className="bg-white border-4 border-slate-900 rounded-none p-6 md:p-8 brutalist-shadow-lg">
          <div className="border-b-2 border-slate-900 pb-4 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-xs text-[#E60012] font-black uppercase tracking-widest font-mono block">
                Mixing Machinery Manual // REG-TS09
              </span>
              <h3 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <Info className="w-4 h-4 text-[#E60012]" />
                Operator's Guide to Mixing Machines & Manual Kinetics
              </h3>
            </div>
            
            {/* Interactive Mixer Switcher Tabs */}
            <div className="flex bg-slate-100 p-1 border-2 border-slate-900 w-full md:w-auto">
              <button
                onClick={() => setActiveMixerTab('stand')}
                className={`flex-1 md:flex-initial px-4 py-1.5 text-xs font-black uppercase transition-all ${
                  activeMixerTab === 'stand' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                Stand Mixer
              </button>
              <button
                onClick={() => setActiveMixerTab('spiral')}
                className={`flex-1 md:flex-initial px-4 py-1.5 text-xs font-black uppercase transition-all ${
                  activeMixerTab === 'spiral' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                Spiral Mixer
              </button>
              <button
                onClick={() => setActiveMixerTab('hand')}
                className={`flex-1 md:flex-initial px-4 py-1.5 text-xs font-black uppercase transition-all ${
                  activeMixerTab === 'hand' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                Hand Kneading
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Mixer Details */}
            <div className="lg:col-span-7 space-y-4">
              {activeMixerTab === 'stand' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-slate-100 border-l-4 border-[#E60012] p-4 font-mono">
                    <span className="text-xs text-slate-400 block">DEFINITION: STAND MIXER (PLANETARY DEVICE)</span>
                    <p className="text-xs text-slate-800 leading-normal font-bold">
                      "Stand" refers to a standard culinary household planetary mixer (e.g., KitchenAid or Kenwood). The bowl remains static, fixed to the base, while the mixing arm carries the dough hook in a dual circular motion (spinning around its hook axis while also traveling along the circumference of the stationary bowl).
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-xs font-black text-slate-900 uppercase font-mono">HOW TO MIX AND DEVELOP STRUCTURE WITH STAND DEVICES:</h4>
                    <ul className="text-xs text-slate-700 space-y-2.5 pl-0 font-sans leading-relaxed">
                      <li className="flex gap-2 items-start">
                        <span className="text-[#E60012] font-mono select-none shrink-0 font-bold">●</span>
                        <span><b>Step A (Initial Hydration)</b>: Place total water and crumbled yeast in static bowl. Add 70% of total flour. Attach spiral/C-hook (or dual hoops if using a SilverCrest dual-arm setup), lock head, and turn to Speed 1 for 3-4 minutes to wet and hydrate the gluten precursors. Let stand for 10-15 minutes to autolyse.</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <span className="text-[#E60012] font-mono select-none shrink-0 font-bold">●</span>
                        <span><b>Step B (Salt addition)</b>: Add sea salt to the wet mush. Turn machine back on at Speed 1, and add the remaining flour stock very slowly over 3 minutes.</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <span className="text-[#E60012] font-mono select-none shrink-0 font-bold">●</span>
                        <span><b>Step C (Gluten structure stretch)</b>: Speed up to Speed 2 (Never go higher). Keep hook running for 5-6 minutes until dough detaches cleanly from the bowl walls. Target friction heat allowance is +6.5°C.</span>
                      </li>
                    </ul>
                  </div>

                  {/* SPECIAL BUDGET / DUAL HOOP CALIBRATION (e.g. SILVERCREST) */}
                  <div className="p-3.5 border-2 border-dashed border-[#E60012] bg-[#E60012]/5 space-y-2">
                    <span className="text-[10px] text-[#E60012] font-black uppercase tracking-wider font-mono block">
                      ⚠ CRITICAL GEAR & MOTOR SAFETY: SILVERCREST / BUDGET PLASTIC DOUBLE-HOOK MIXERS
                    </span>
                    <p className="text-xs text-slate-800 leading-relaxed font-sans">
                      If you are mixing with a <b>SilverCrest plastic-base stand mixer</b> or models using <b>two interlocking dough hooks/hoops</b>, standard planetary guidelines will strip the gears or overheat the motor. Apply these essential physical calibrations:
                    </p>
                    <ul className="text-xs text-slate-700 space-y-1.5 pl-4 list-disc font-sans leading-relaxed">
                      <li>
                        <b>Adjust Mixing Time (Brief & Fast)</b>: Because <i>two interlocking hooks</i> rotate simultaneously, they shred and align protein sheets 40% faster than a single hook. <b>Reduce active kneading from 12 minutes to exactly 5-6 minutes maximum</b> to avoid over-stretching or tearing tender gluten.
                      </li>
                      <li>
                        <b>Never Knead Above Speed 1.5</b>: Standard SilverCrest gearboxes are made of nylon, which softens under friction. High density doughs like Flammkuchen, Roman pizza, or low hydration formulas must be mixed on <b>Speed 1</b>. Never go higher, or the gears will melt/strip.
                      </li>
                      <li>
                        <b>Cooling & Ice Water Mandatory</b>: A plastic body and bowl acts as an insulator, holding motor heat directly inside the dough. Always make sure to use <b>ice-cold water (Eiswasser)</b> from the fridge, or the dough will heat up past 26°C and over-ferment in the mixer!
                      </li>
                      <li>
                        <b>Use Autolyse for Safe Power</b>: Letting your flour and water rest together for 20 minutes before adding salt reduces the torque force needed by 50%. This protects your SilverCrest motor and ensures perfect hydration with minimal mechanical load.
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {activeMixerTab === 'spiral' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-slate-100 border-l-4 border-[#E60012] p-4 font-mono">
                    <span className="text-xs text-slate-400 block">DEFINITION: SPIRAL MIXER (PROFESSIONAL HARMONY)</span>
                    <p className="text-xs text-slate-800 leading-normal font-bold">
                      "Spiral" refers to a heavy-duty professional sourdough/pizza mixing machine (e.g., Sunmix, Famag Grilletta). Unlike stand mixers, the spiral hook rotates inside a bowl *which also rotates simultaneously* in the opposite direction. This constant double-spin action continuously forces the dough mass beneath a vertical hook pin, aligning protein sheets without tearing.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-black text-slate-900 uppercase font-mono">HOW TO MIX AND DEVELOP STRUCTURE WITH SPIRAL DEVICES:</h4>
                    <ul className="text-xs text-slate-700 space-y-2.5 pl-0 font-sans leading-relaxed">
                      <li className="flex gap-2 items-start">
                        <span className="text-[#E60012] font-mono select-none shrink-0 font-bold">●</span>
                        <span><b>Step A (Dry Flour Matrix)</b>: Empty all flour and yeast dry directly into the rotating machine bowl. Start the spiral rotation on Low speed (90 RPM). Slowly drizzle in 85% of cold water over 2 minutes. Let hook organize the wet grains into a shaggy, hydrated lump (3 minutes).</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <span className="text-[#E60012] font-mono select-none shrink-0 font-bold">●</span>
                        <span><b>Step B (Bassinage & Salt)</b>: Sprinkle the salt. If baking high hydration (Canotto/Teglia), switch to Speed 2 (180-240 RPM) and begin dripping the remaining 15% water (Bassinet method) in tiny streams. The fast-spinning spiral forces fast absorbency without warming the engine.</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <span className="text-[#E60012] font-mono select-none shrink-0 font-bold">●</span>
                        <span><b>Step C (Pumpkin Stretch Completion)</b>: Knead until the dough becomes extremely glossy, stretching around the central steel divider column. Total mixing takes around 8-10 minutes. Friction coefficient is +10°C, requiring cooled water.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {activeMixerTab === 'hand' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-slate-100 border-l-4 border-[#E60012] p-4 font-mono">
                    <span className="text-xs text-slate-400 block">MANUAL KINETICS (ANCIENT MASSAGING)</span>
                    <p className="text-xs text-slate-800 leading-normal font-bold">
                      No machines. Kinetic power utilizing the thumbs, palms, and wrists to align proteins. This creates the least friction heat (+3°C) and generates maximum tactile feedback on hydration density.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-black text-slate-900 uppercase font-mono">HOW TO KNEAD PIZZA DOUGH MANUALLY BY HAND:</h4>
                    <ul className="text-xs text-slate-700 space-y-2.5 pl-0 font-sans leading-relaxed">
                      <li className="flex gap-2 items-start">
                        <span className="text-[#E60012] font-mono select-none shrink-0 font-bold">●</span>
                        <span><b>Step A (The Autolyse Slurry)</b>: Gently dissolve yeast in water. Put 80% of flour in deep bowl, pour liquid, stir with finger clusters into a thick wet slurry. Rest cover for 30 minutes. Gluten links assemble automatically!</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <span className="text-[#E60012] font-mono select-none shrink-0 font-bold">●</span>
                        <span><b>Step B (The Slap & Fold)</b>: Place the remaining flour on a dry, clean stone countertop. Place the slurry block on top. Push away with the heel of your thumb, fold back, spin 90 degrees, and push again. For wet styles (Canotto/Teglia), employ the "slap and fold" technique, lifting dough block vertically, slapping on bench, and folding over to lock air pockets inside.</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <span className="text-[#E60012] font-mono select-none shrink-0 font-bold">●</span>
                        <span><b>Step C (Salt incorporation & Rest)</b>: Sprinkle salt on top, adding a tiny splash of water to dissolve, and knead and fold for 5 more minutes until completely silk-like. Finish with windowpane structure checks.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Mixer Comparison Stats Sidebar */}
            <div className="lg:col-span-5 bg-slate-50 border-2 border-slate-900 p-4 shrink-0 font-mono text-xs flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-black text-[#E60012] uppercase border-b border-slate-300 pb-2 mb-3">
                  MIXER COMPARISON GRAPH & METRICS
                </h4>
                
                <div className="space-y-3.5">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="font-bold">GLUTEN ALIGNMENT RATE</span>
                      <span className="font-bold text-slate-500">OPTIMAL RANGE</span>
                    </div>
                    <div className="grid grid-cols-12 gap-1 items-center">
                      <span className="col-span-3 text-[10px] text-slate-500">HAND</span>
                      <div className="col-span-9 bg-slate-200 h-2 ">
                        <div className="bg-amber-600 h-full" style={{ width: '45%' }} />
                      </div>
                    </div>
                    <div className="grid grid-cols-12 gap-1 items-center mt-1">
                      <span className="col-span-3 text-[10px] text-slate-500">STAND</span>
                      <div className="col-span-9 bg-slate-200 h-2 ">
                        <div className="bg-blue-600 h-full" style={{ width: '70%' }} />
                      </div>
                    </div>
                    <div className="grid grid-cols-12 gap-1 items-center mt-1">
                      <span className="col-span-3 text-[10px] text-slate-500">SPIRAL</span>
                      <div className="col-span-9 bg-slate-200 h-2 ">
                        <div className="bg-emerald-600 h-full" style={{ width: '100%' }} />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="font-bold">FRICTION HEAT RISE FACTOR</span>
                      <span className="font-bold text-[#E60012]">FDT DEVIATION</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] py-1 text-slate-700">
                      <span>• Hand (Low Friction)</span>
                      <span className="font-bold text-amber-700">+3°C Rise</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] py-1 text-slate-700">
                      <span>• Stand (Medium Friction)</span>
                      <span className="font-bold text-blue-700">+6.5°C Rise</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] py-1 text-slate-700">
                      <span>• Spiral (High Friction)</span>
                      <span className="font-bold text-emerald-700">+10°C Rise</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-300 text-[10px] text-slate-500 leading-normal">
                ★ <b>Dough Master Advice:</b> <br />
                "High speed kills. Don't rush hydration kinetic bonds. Let the autolyse relax molecules before stretching them, and always subtract the machine's friction factor from your liquid water temp."
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GERMAN MARKET & HOME OVEN CALIBRATION SUITE */}
      <div className="lg:col-span-12 mt-6">
        <div className="bg-white border-4 border-slate-900 rounded-none p-6 md:p-8 brutalist-shadow-lg">
          <div className="border-b-2 border-slate-900 pb-4 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-xs text-[#E60012] font-black uppercase tracking-widest font-mono block">
                Lokale Anpassung // DE-REC-99
              </span>
              <h3 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#E60012]" />
                German Flour (Mehl) & Oven (Backofen) Calibration Suite
              </h3>
            </div>
            
            {/* Local Calibration Tabs */}
            <div className="flex bg-slate-100 p-1 border-2 border-slate-900 w-full md:w-auto">
              <button
                onClick={() => setActiveGermanTab('flour')}
                className={`flex-1 md:flex-initial px-4 py-1.5 text-xs font-black uppercase transition-all ${
                  activeGermanTab === 'flour' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                Flour Guide (Mehl-Katalog)
              </button>
              <button
                onClick={() => setActiveGermanTab('oven')}
                className={`flex-1 md:flex-initial px-4 py-1.5 text-xs font-black uppercase transition-all ${
                  activeGermanTab === 'oven' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                Oven Tactics (Backofen-Setup)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-4">
              {activeGermanTab === 'flour' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-slate-100 border-l-4 border-slate-900 p-4 font-mono">
                    <span className="text-xs text-slate-400 block">GERMAN FLOUR TYPE CODES vs ITALIAN STANDARDS</span>
                    <p className="text-xs text-slate-800 leading-normal font-bold">
                      In Germany, flour is classified by chemical mineral ash content (Type / Typenbezeichnung), which indicates how much of the bran remains. It does NOT directly map to grain hardness (gluten strength), but specific supermarket labels are perfectly geared for bread and pizza:
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 border-2 border-slate-900 bg-slate-50 flex flex-col gap-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-slate-900 uppercase font-mono">1. Italian "Tipo 00" (Pizza-Mehl) - Sold in Germany</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-1.5 py-0.5 border border-emerald-950 font-mono">Highly Recommended</span>
                      </div>
                      <p className="text-xs text-slate-705 leading-relaxed font-sans">
                        <b>Supermarket availability:</b> Now widely stocked in EDEKA, REWE, Kaufland, and Metro. Look for Italian imports like <i>Caputo Cuoco</i> (Red bag, W300) or <i>Caputo Pizzeria</i> (Blue bag, W260). High-quality store alternatives include <b>REWE Beste Wahl "Pizza-Mehl Tipo 00"</b>, <b>EDEKA Italia "Tipo 00"</b>, and <b>Friesinger Mühle "Pizzamehl"</b>.
                        <br />
                        <b>Properties:</b> 12% - 13.5% protein. Ideal for Neapolitan, Canotto, and high hydrations up to 70%. Highly expandable gluten structure.
                      </p>
                    </div>

                    <div className="p-3 border-2 border-slate-950 bg-slate-50 flex flex-col gap-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-slate-900 uppercase font-mono">2. Weizenmehl Type 550</span>
                        <span className="text-[10px] bg-blue-100 text-blue-900 font-bold px-1.5 py-0.5 border border-blue-900 font-mono">Excellent local Alternative</span>
                      </div>
                      <p className="text-xs text-slate-705 leading-relaxed font-sans">
                        <b>Supermarket availability:</b> Ubiquitous in every single discount market (ALDI, Lidl, Netto), organic stores (dm, Alnatura), and supermarkets (Rewe, Edeka, Kaufland). Premium choices: <i>Aurora Weizenmehl Type 550</i> or <i>Diamant Weizenmehl Type 550</i>, as well as supermarket house brands.
                        <br />
                        <b>Properties:</b> 11.5% - 12.8% protein. Superior water absorption compared to Type 405. Highly recommended as a standard bread/pizza flour replacement. Safely supports 60% to 64% hydration.
                      </p>
                    </div>

                    <div className="p-3 border-2 border-slate-900 bg-slate-50 flex flex-col gap-1.5 opacity-80">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-900 uppercase font-mono">3. Weizenmehl Type 405 (Household Standard)</span>
                        <span className="text-[10px] bg-yellow-105 text-yellow-950 font-bold px-1.5 py-0.5 border border-yellow-900 font-mono">Requires Caution</span>
                      </div>
                      <p className="text-xs text-slate-705 leading-relaxed font-sans">
                        <b>Supermarket availability:</b> Standard pastry flour found in every German home.
                        <br />
                        <b>Properties:</b> Low mineral content and very low protein (usually 9% - 10%). Standard 405 flour has weak gluten-holding capacity. If using for pizza, limit hydration strictly to <b>56-58%</b> to avoid a sticky soup, or buy specific premium brands like <i>Aurora Pizzamehl Type 405</i> which have added dry wheat gluten (Weizenkleber) to elevate protein to 12%.
                      </p>
                    </div>

                    <div className="p-3 border-2 border-slate-900 bg-slate-50 flex flex-col gap-1.5 opacity-80">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-905 uppercase font-mono">4. Dinkelmehl Type 630 (Spelt Flour)</span>
                        <span className="text-[10px] bg-purple-100 text-purple-900 font-bold px-1.5 py-0.5 border border-purple-900 font-mono">Specialist Use</span>
                      </div>
                      <p className="text-xs text-slate-705 leading-relaxed font-sans">
                        <b>Supermarket availability:</b> Massive in Germany (dm-Bio, organic, and standard shops).
                        <br />
                        <b>Properties:</b> Very high protein content but high extensible gluten structure. This makes the dough very soft and easy to stretch, but it tears easily and fails to hold rising gas effectively. Keep hydration below 60% and knead very gently because over-mixing destroys dinkel gluten instantly.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeGermanTab === 'oven' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-slate-100 border-l-4 border-[#E60012] p-4 font-mono">
                    <span className="text-xs text-slate-400 block">DOMESTIC OVEN CALIBRATION (HAUSHALTSBACKOFEN)</span>
                    <p className="text-xs text-slate-800 leading-normal font-bold">
                      German home ovens (from Bosch, Siemens, Miele, Neff, etc.) typically max out at 250°C to 275°C, or occasionally 300°C. Standard wood-fired Neapolitan pizza requires 450°C. To bake a gorgeous restaurant-quality crust at home, employ these three elite baking strategies:
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 border-2 border-slate-900 bg-slate-50">
                      <h4 className="text-xs font-black text-slate-900 uppercase font-mono mb-1">TACTIC 1: THE BAKING STEEL (BACKSTAHL) SAVES THE CRUST</h4>
                      <p className="text-xs text-slate-700 leading-relaxed font-sans">
                        Do not use thin ceramic baking stones—they cannot transfer heat fast enough in domestic ovens. Get a <b>6mm to 8mm heavy Baking Steel (Backstahl)</b>. Place it on the highest possible rack shelf level. Pre-heat on maximum <b>Ober-/Unterhitze (Top/Bottom Heat) at 275°C</b> for a full 45-60 minutes to saturate the steel with massive kinetic heat.
                      </p>
                    </div>

                    <div className="p-3 border-2 border-slate-900 bg-slate-50">
                      <h4 className="text-xs font-black text-slate-900 uppercase font-mono mb-1">TACTIC 2: THE MAXIMUM GRILL/BROILER BYPASS</h4>
                      <p className="text-xs text-slate-700 leading-relaxed font-sans">
                        Right before loading your pizza onto the steel, switch the oven mode to <b>Grill / Broiler (Grillstufe 3 / Maximum)</b>. This immediately activates the high-power upper infrared red spiral elements. The pre-heated steel bakes the bottom of your pizza in 2 minutes, while the active grill charred and blistering the top toppings, achieving high deck spring in 3-4 minutes!
                      </p>
                    </div>

                    <div className="p-3 border-2 border-slate-900 bg-slate-50">
                      <h4 className="text-xs font-black text-slate-900 uppercase font-mono mb-1">TACTIC 3: THE ESSENTIAL INGREDIENT INJECTIONS</h4>
                      <p className="text-xs text-slate-705 leading-relaxed font-sans">
                        Because home ovens bake slower (3-6 minutes vs. 90 seconds), the dough dries out and becomes like a cracker before browning occurs. To resolve this:
                        <br />
                        <span className="font-mono font-bold text-[#E60012] block mt-1">• Add 1% - 1.5% Diastatic Barley Malt (Backmalz) or Sugar:</span>
                        This feeds the yeast and speeds up the Maillard browning reaction at 250°C, yielding dark spots and visual browning before the crumb dries out.
                        <span className="font-mono font-bold text-[#E60012] block mt-1">• Add 2% - 3% Extra Virgin Olive Oil:</span>
                        Lipids coat the starch granules, locking moisture in the crumb to keep the inside puffy and dense with flavor while external crust is crisp.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Local Market Flour Conversion Matrix card */}
            <div className="lg:col-span-5 bg-slate-50 border-2 border-slate-900 p-4 shrink-0 font-mono text-xs flex flex-col justify-between font-mono">
              <div>
                <h4 className="text-xs font-black text-[#E60012] uppercase border-b border-slate-300 pb-2 mb-3 flex items-center gap-1.5 font-bold">
                  GERMAN-MARKET COMPARISONS
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">FLOUR WATER CAPACITY (HYDRATION RESISTANCE)</span>
                    <div className="space-y-1.5 mt-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-700">
                        <span>• Typ 405 (Pastry)</span>
                        <span className="font-bold text-red-700">Max 58% Water</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-700">
                        <span>• Typ 550 (All-Purpose)</span>
                        <span className="font-bold text-blue-700">60% - 64% Water</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-700">
                        <span>• Imported Tipo 00 (W280)</span>
                        <span className="font-bold text-emerald-700">65% - 70% Water</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-700">
                        <span>• Typ 812 (Bread/Semi-whole)</span>
                        <span className="font-bold text-indigo-700">66% - 72% Water</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200">
                    <span className="text-[10px] text-slate-400 block uppercase">GERMAN YEAST CALIBRATION (FRISCHHEFE VS TROCKENHEFE)</span>
                    <p className="text-[11px] text-slate-700 mt-1.5 leading-relaxed font-sans text-xs">
                      German fresh yeast blocks (<b>Frischhefe</b>, usually 42g blocks sold in chillers next to butter) are extremely potent. 
                      <br />
                      <span className="font-bold text-[#E60012]">Rule:</span> Multiply dry active yeast percentage/weight by <b>3.07</b> to get the equivalent Frischhefe weight. 1g of dry active yeast corresponds to ~3.1g of Frischhefe.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-300 text-[10px] text-slate-500 leading-normal font-sans">
                💡 <b>Local Market Hack:</b> <br />
                "If you can’t find Italian Tipo 00, grab a bag of organic <b>Dinkelmehl Type 630</b> and mix it 50/50 with <b>Weizenmehl Type 550</b>. This creates an unbelievably aromatic, crispy structure highly tolerant of typical German domestic oven settings!"
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
