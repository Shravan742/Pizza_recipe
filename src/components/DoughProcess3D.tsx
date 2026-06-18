import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame,
  Volume2,
  Atom,
  Clock,
  Sparkles,
  Layers,
  Thermometer,
  ShieldAlert,
  ArrowRight,
  RotateCw,
  HelpCircle,
  Play
} from 'lucide-react';
import { PizzaRecipe } from '../types';
import { CalculatedWeights } from './DoughCalculator';

interface DoughProcess3DProps {
  recipe: PizzaRecipe;
  weights: CalculatedWeights;
  presetName: string;
}

export default function DoughProcess3D({ recipe, weights, presetName }: DoughProcess3DProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showSilverCrestAlert, setShowSilverCrestAlert] = useState<boolean>(true);

  // Steps definition for mixing
  const steps = [
    {
      num: 1,
      title: "Yeast Activation",
      subtitle: "Water & Yeast Dissolution",
      desc: "Dissolve your yeast fully in the water reserve. The liquid is the vehicle that wakes up dry yeast or blends fresh block block cells into suspension.",
      color: "border-[#3b82f6]",
    },
    {
      num: 2,
      title: "Autolyse Stage",
      subtitle: "75% Flour Batter Hydration",
      desc: "Add 75% of your flour to form a thick, oxygen-rich pool batter. Let it rest for 20 minutes (passive hydration) to kickstart amylase sugar-release without mechanical strain.",
      color: "border-amber-500",
    },
    {
      num: 3,
      title: "Micro-Nutrients",
      subtitle: "Salt & Remaining Flour",
      desc: "Distribute your calculated salt onto the batter, then add the remaining 25% of flour. Salt tightens gluten proteins and balances the cell fermentation rate.",
      color: "border-sky-500",
    },
    {
      num: 4,
      title: "Mechanical Knead",
      subtitle: "SilverCrest Double Hook Rotation",
      desc: "Knead at Speed 1-2. Our twin offset hooks simulate professional high-torque machines, rapidly cross-linking protein matrices while keeping temperatures low.",
      color: "border-[#E60012]",
    },
    {
      num: 5,
      title: "Rounding & Proof",
      subtitle: "Dough Ball Partition & Rest",
      desc: "Divide dough into smooth, sealed pieces. Shape and seal gas escape paths. The dough rests on standard wooden boards or food-grade trays during ferment.",
      color: "border-emerald-500",
    }
  ];

  const yeastAmount = weights.yeast;
  const yeastTypeLabel = recipe.yeastType === 'dry' ? 'Active Dry Yeast' : 'Fresh Yeast Block';

  return (
    <div className="bg-slate-50 border-4 border-slate-900 rounded-none p-5 md:p-6 brutalist-shadow mt-6" id="dough-mixing-process-3d">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b-2 border-slate-900 pb-3 mb-5">
        <div>
          <span className="text-[10px] text-[#E60012] font-black uppercase tracking-widest font-mono block">
            OPERATOR KINETICS // PROCESS ENGINE
          </span>
          <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-1.5">
            <Atom className="text-[#E60012] w-4 h-4 animate-spin-slow" />
            Interactive 3D mixing process walkthrough
          </h4>
        </div>
        <div className="text-[10px] font-mono font-bold bg-slate-900 text-white px-2 py-1 border border-slate-950">
          STATIC DEPLOYMENT COMPATIBLE
        </div>
      </div>

      {/* SilverCrest Double-Hook Mechanical Education Box */}
      {showSilverCrestAlert && (
        <div className="mb-5 bg-amber-50 border-2 border-amber-900 p-4 text-slate-900 relative">
          <button 
            onClick={() => setShowSilverCrestAlert(false)}
            className="absolute top-2 right-2 text-amber-900 opacity-65 hover:opacity-100 font-mono text-[10px] uppercase font-bold"
          >
            [close]
          </button>
          <div className="flex gap-3 items-start">
            <ShieldAlert className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <h5 className="font-extrabold uppercase font-mono tracking-tight text-amber-950">
                ⚠️ SilverCrest Mixer: Can I run with only ONE hook?
              </h5>
              <p className="leading-relaxed text-slate-800">
                <b>Short answer: No, it is highly discouraged.</b> The SilverCrest double-hook mixer relies on the opposing, counter-rotating overlap of <b>both hooks</b> to stretch and fold the dough center-wise.
              </p>
              <ul className="list-disc pl-4 space-y-1 text-slate-800 font-mono text-[11px] mt-1.5">
                <li><b>Asymmetric Gear Strain:</b> Using just one hook places single-sided lateral torque on the drive gears, rapidly striping the internal nylon components.</li>
                <li><b>Unkneaded Rotation:</b> Without the second hook holding and shearing, the dough will simply spin in circles as a useless clump or crawl up the shaft.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* STEP SELECTOR NAVIGATION */}
      <div className="grid grid-cols-5 gap-1.5 mb-6">
        {steps.map((st) => (
          <button
            key={st.num}
            onClick={() => setCurrentStep(st.num)}
            className={`py-2 text-center transition-all flex flex-col items-center justify-center border-2 ${
              currentStep === st.num 
                ? 'bg-slate-900 text-white border-slate-900 brutalist-shadow-xs' 
                : 'bg-white text-slate-500 border-slate-300 hover:border-slate-900 hover:text-slate-900'
            }`}
          >
            <span className="text-[10px] font-mono font-black">0{st.num}</span>
            <span className="hidden md:inline text-[9px] font-bold uppercase tracking-wider mt-0.5">{st.title.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* INTERACTIVE ISOMETRIC BOWL STAGE */}
        <div className="lg:col-span-6 bg-slate-900 border-2 border-slate-900 p-4 min-h-[300px] flex flex-col justify-center items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:20px_20px] opacity-35" />
          
          <div className="absolute top-2 left-2 text-[10px] font-mono text-slate-400">
            ISOMETRIC STAGE // STAGE_0{currentStep}
          </div>

          {/* Perspective Container */}
          <div 
            style={{ 
              perspective: '600px', 
              width: '260px', 
              height: '220px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              transformStyle: 'preserve-3d'
            }}
          >
            {/* The Isometric Bowl */}
            <div 
              style={{
                transform: 'rotateX(60deg) rotateZ(-15deg)',
                transformStyle: 'preserve-3d',
                position: 'relative',
                width: '160px',
                height: '160px',
              }}
            >
              {/* Bowl Outer Wireframe Rim */}
              <div 
                className="absolute border-[3px] border-slate-500 rounded-full"
                style={{
                  width: '180px',
                  height: '180px',
                  top: '-10px',
                  left: '-10px',
                  transform: 'translateZ(90px)',
                  boxShadow: '0 0 10px rgba(255,255,255,0.1)'
                }}
              />

              {/* Bowl Bottom/Floor */}
              <div 
                className="absolute bg-slate-800 border border-slate-700 rounded-full"
                style={{
                  width: '160px',
                  height: '160px',
                  transform: 'translateZ(0px)',
                  boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)'
                }}
              />

              {/* Bowl Wall Cylinder Rings */}
              {[15, 30, 45, 60, 75].map((z) => (
                <div 
                  key={z}
                  className="absolute border border-slate-700/20 rounded-full pointer-events-none"
                  style={{
                    width: '160px',
                    height: '160px',
                    transform: `translateZ(${z}px)`,
                  }}
                />
              ))}

              {/* DYNAMIC CONTENTS BASED ON STEPS */}
              
              {/* STEP 1: Liquified Water Layer & Yeast */}
              {currentStep === 1 && (
                <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d' }}>
                  {/* Blue Water Layer */}
                  <motion.div 
                    initial={{ scale: 0.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.5 }}
                    style={{
                      position: 'absolute',
                      width: '150px',
                      height: '150px',
                      left: '5px',
                      top: '5px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(59,130,246,0.6) 0%, rgba(29,78,216,0.8) 100%)',
                      transform: 'translateZ(25px)',
                    }}
                  />
                  {/* Floating Yeast Crystals */}
                  {[
                    { x: 30, y: 40, z: 27 },
                    { x: 100, y: 70, z: 28 },
                    { x: 50, y: 110, z: 26 },
                    { x: 110, y: 30, z: 27 },
                    { x: 75, y: 75, z: 29 },
                  ].map((pos, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: -50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className="absolute w-3 h-3 bg-amber-200 border border-amber-800 rounded-full"
                      style={{
                        left: `${pos.x}px`,
                        top: `${pos.y}px`,
                        transform: `translateZ(${pos.z}px)`,
                      }}
                    />
                  ))}
                  {/* Water Bubbles on surface */}
                  <div 
                    className="absolute w-2 h-2 bg-white/40 rounded-full animate-ping"
                    style={{ left: '70px', top: '50px', transform: 'translateZ(27px)' }}
                  />
                  <div 
                    className="absolute w-1.5 h-1.5 bg-white/30 rounded-full animate-ping"
                    style={{ left: '90px', top: '100px', transform: 'translateZ(27px)' }}
                  />
                </div>
              )}

              {/* STEP 2: Thick Hydration autolyse batter */}
              {currentStep === 2 && (
                <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d' }}>
                  {/* Fluffy slurry flour paste block */}
                  <motion.div 
                    initial={{ scaleY: 0.1, scaleZ: 0.1, opacity: 0 }}
                    animate={{ scaleY: 1, scaleZ: 1, opacity: 1 }}
                    style={{
                      position: 'absolute',
                      width: '144px',
                      height: '144px',
                      left: '8px',
                      top: '8px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, #fcfaf2 0%, #ebe2cb 70%, #caa773 100%)',
                      border: '2px solid #b8a27d',
                      transform: 'translateZ(40px)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
                    }}
                  />
                  {/* Flour dust particles sliding down */}
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, 4, 0], scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                      className="absolute w-2 h-2 bg-slate-100 rounded-none border border-slate-400"
                      style={{
                        left: `${i * 30 + 10}px`,
                        top: `${i * 20 + 30}px`,
                        transform: 'translateZ(55px)',
                      }}
                    />
                  ))}
                </div>
              )}

              {/* STEP 3: Remaining Flour & Salt Crystals */}
              {currentStep === 3 && (
                <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d' }}>
                  {/* Base batter layer */}
                  <div 
                    style={{
                      position: 'absolute',
                      width: '144px',
                      height: '144px',
                      left: '8px',
                      top: '8px',
                      borderRadius: '50%',
                      background: '#ebe2cb',
                      border: '1.5px solid #a28e6c',
                      transform: 'translateZ(35px)',
                    }}
                  />
                  {/* New white pile of 25% flour */}
                  <motion.div 
                    initial={{ scale: 0.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.95 }}
                    style={{
                      position: 'absolute',
                      width: '90px',
                      height: '90px',
                      left: '35px',
                      top: '35px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, #ffffff 0%, #f4f4f4 60%, #dedede 100%)',
                      border: '1px dashed #b5b5b5',
                      transform: 'translateZ(50px)',
                    }}
                  />
                  {/* White shiny Salt cubes */}
                  {[
                    { x: 50, y: 55, z: 54 },
                    { x: 105, y: 80, z: 38 },
                    { x: 75, y: 95, z: 42 }
                  ].map((salt, id) => (
                    <motion.div
                      key={id}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity }}
                      className="absolute w-2.5 h-2.5 bg-sky-200 border border-sky-400 rotate-45"
                      style={{
                        left: `${salt.x}px`,
                        top: `${salt.y}px`,
                        transform: `translateZ(${salt.z}px)`,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* STEP 4: Double Hook Rotating Kneader */}
              {currentStep === 4 && (
                <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d' }}>
                  {/* Sweaty, shiny kneaded dough body */}
                  <div 
                    className="absolute rounded-full border-2 border-[#b8a27d]"
                    style={{
                      width: '136px',
                      height: '136px',
                      left: '12px',
                      top: '12px',
                      background: 'radial-gradient(circle at 30% 30%, #faf8f5 0%, #e0d4be 50%, #bcab89 100%)',
                      transform: 'translateZ(40px)',
                    }}
                  />
                  
                  {/* Offset Dual hook rods spinning counter-opposed */}
                  <motion.div 
                    animate={{ rotateZ: [0, 360] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="absolute"
                    style={{
                      width: '120px',
                      height: '120px',
                      left: '20px',
                      top: '20px',
                      transformStyle: 'preserve-3d',
                      transform: 'translateZ(60px)'
                    }}
                  >
                    {/* Metal Hook 1 */}
                    <div 
                      className="absolute border-[3px] border-slate-300 rounded-b-full shadow bg-slate-400/20"
                      style={{
                        width: '32px',
                        height: '50px',
                        left: '10px',
                        top: '35px',
                        transform: 'rotateY(20deg) rotateX(10deg)',
                        borderLeftColor: '#f43f5e'
                      }}
                    />
                    {/* Metal Hook 2 */}
                    <div 
                      className="absolute border-[3px] border-slate-300 rounded-b-full shadow bg-slate-400/20"
                      style={{
                        width: '32px',
                        height: '50px',
                        right: '10px',
                        top: '35px',
                        transform: 'rotateY(-20deg) rotateX(-10deg)',
                        borderRightColor: '#2563eb'
                      }}
                    />
                  </motion.div>
                </div>
              )}

              {/* STEP 5: Beautiful Sealed Dough Ball */}
              {currentStep === 5 && (
                <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d' }}>
                  {/* Beautiful wooden table board base */}
                  <div 
                    style={{
                      position: 'absolute',
                      width: '180px',
                      height: '180px',
                      left: '-10px',
                      top: '-10px',
                      background: 'radial-gradient(circle, #e4a853 0%, #8b4513 100%)',
                      border: '3px solid #5c2d11',
                      transform: 'translateZ(10px)',
                      boxShadow: '0 5px 15px rgba(0,0,0,0.6)'
                    }}
                  />
                  {/* Beautiful smooth spherical round shape of fully formed dough */}
                  <motion.div 
                    initial={{ y: -30, scale: 0.1 }}
                    animate={{ y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 50 }}
                    style={{
                      position: 'absolute',
                      width: '100px',
                      height: '100px',
                      left: '30px',
                      top: '30px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle at 35% 25%, #fbf9f4 0%, #eddcc0 50%, #cbb181 100%)',
                      border: '2px solid #af996e',
                      transform: 'translateZ(35px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.5)',
                    }}
                  />
                  {/* Shrapnel particles indicating beautiful seal */}
                  <div className="absolute w-2 h-2 rounded-full bg-emerald-400 animate-ping"
                       style={{ left: '50px', top: '75px', transform: 'translateZ(40px)' }} />
                </div>
              )}

            </div>
          </div>

          <div className="absolute bottom-2 text-center text-[10px] font-mono text-slate-400 tracking-wider">
            STEP_PROGRESS: {((currentStep / 5) * 100).toFixed(0)}% COMPLETE
          </div>
        </div>

        {/* DETAILS DATA AND SPECIFICATION */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div className="space-y-4">
            
            {/* Step Header info */}
            <div className="bg-slate-900 text-white p-3 border-2 border-slate-950 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Mixing Track #{currentStep}</span>
                <span className="text-sm font-black uppercase font-mono tracking-wide">{steps[currentStep - 1].subtitle}</span>
              </div>
              <span className="text-xl font-black font-mono text-emerald-400 bg-slate-950 px-3 py-1 border border-slate-800">
                0{currentStep}
              </span>
            </div>

            {/* Core Instruction text block */}
            <p className="text-xs text-slate-700 leading-relaxed bg-white p-4 border-2 border-slate-900 brutalist-shadow-xs">
              {steps[currentStep - 1].desc}
            </p>

            {/* Crucial dynamic calculated weights for Shravan to add */}
            <div className="bg-white border-2 border-slate-900 p-4 font-mono space-y-2.5">
              <h5 className="text-[10px] uppercase font-black text-slate-500 tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-[#E60012]" />
                Exact additions for this stage:
              </h5>

              {currentStep === 1 && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2.5 border border-slate-300">
                    <span className="text-slate-400 block text-[9px] uppercase">Water Weight</span>
                    <span className="text-slate-900 font-extrabold text-sm">{weights.water}g</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 border border-slate-300">
                    <span className="text-slate-400 block text-[9px] uppercase">{yeastTypeLabel}</span>
                    <span className="text-slate-900 font-extrabold text-sm">{yeastAmount}g</span>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2.5 border border-slate-300 col-span-2">
                    <span className="text-slate-400 block text-[9px] uppercase">Flour Stock (75% for Autolyse slurry)</span>
                    <span className="text-slate-900 font-extrabold text-sm">{(weights.flour * 0.75).toFixed(0)}g <span className="text-xs font-normal text-slate-500">of {weights.flour}g total</span></span>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2.5 border border-slate-300">
                    <span className="text-slate-400 block text-[9px] uppercase">Remaining Flour (25%)</span>
                    <span className="text-slate-900 font-extrabold text-sm">{(weights.flour * 0.25).toFixed(0)}g</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 border border-slate-300">
                    <span className="text-slate-400 block text-[9px] uppercase">Fine Sea Salt</span>
                    <span className="text-slate-900 font-extrabold text-sm">{weights.salt}g</span>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-1.5 text-xs text-slate-700 font-sans leading-normal">
                  <div className="flex justify-between font-mono bg-slate-100 p-1.5 text-[11px] font-bold">
                    <span>Target Final Dough Temp (FDT):</span>
                    <span className="text-[#E60012]">23°C – 25°C Max</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono italic">
                    💡 Dual-hooks create progressive mechanical friction. Starting with colder water protects protein structures from overheating!
                  </p>
                </div>
              )}

              {currentStep === 5 && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2.5 border border-slate-300">
                    <span className="text-slate-400 block text-[9px] uppercase">Target Dough Pieces</span>
                    <span className="text-slate-900 font-extrabold text-sm">{recipe.numBalls} Balls</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 border border-slate-300">
                    <span className="text-slate-400 block text-[9px] uppercase">Single Piece Target</span>
                    <span className="text-slate-900 font-extrabold text-sm">{recipe.ballWeight}g</span>
                  </div>
                </div>
              )}
            </div>

          </div>

          <div className="flex gap-2 mt-4">
            <button
              disabled={currentStep === 1}
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="flex-1 py-2.5 bg-white hover:bg-slate-100 disabled:opacity-50 text-slate-900 font-black text-xs uppercase border-2 border-slate-900 font-mono tracking-wide"
            >
              ◀ Previous
            </button>
            <button
              disabled={currentStep === 5}
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="flex-1 py-2.5 bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 font-black text-xs uppercase border-2 border-slate-900 font-mono tracking-wide"
            >
              Next Step ▶
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
