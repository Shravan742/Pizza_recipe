/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PizzaRecipe {
  numBalls: number;
  ballWeight: number; // in grams, e.g., 280
  hydration: number;  // in %, e.g., 65
  saltPercent: number; // in %, e.g., 2.5
  yeastPercent: number; // in %, e.g., 0.13
  yeastType: 'dry' | 'fresh';
  oilPercent: number;   // in %, e.g., 2 (olive oil — baker's %)
  sugarPercent: number; // in %, e.g., 1 (sugar or diastatic malt — baker's %)
}

export type MixingMethodType = 'hand' | 'stand' | 'spiral' | 'custom';

export interface FdtCalculation {
  desiredFdt: number; // in °C, e.g., 22
  flourTemp: number;  // in °C, e.g., 21
  roomTemp: number;   // in °C, e.g., 20
  mixingMethod: MixingMethodType;
  customFriction: number; // in °C, e.g., 3
}

export interface LabJournalEntry {
  id: string;
  date: string;
  title: string;
  goal: string;
  recipe: PizzaRecipe;
  fdt?: FdtCalculation;
  calculatedWaterTemp: number;
  actualWaterTemp?: number;
  actualFdt?: number;
  iceAdded: boolean;
  mixingTimeMinutes?: number;
  bulkRT: number; // in hours
  bulkFridge: number; // in hours
  ballRT: number; // in hours
  ballFridge: number; // in hours
  ovenType: 'wood_fired' | 'steel_plate' | 'stone' | 'home_convection' | 'other';
  bakingTemp: number; // in °C
  bakingTimeMinutes: number;
  scores: {
    cornicioneRise: number; // 1-10
    crumbOpenness: number;  // 1-10
    flavorProfile: number;   // 1-10
    doughHandling: number;   // 1-10
    ovenSpring: number;      // 1-10
  };
  specialNotes: string;
}
