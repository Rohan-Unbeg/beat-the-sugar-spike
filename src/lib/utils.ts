import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateAnonName(): string {
  const adjs = ["Sugar", "Glucose", "Insulin", "Sweet", "Keto", "Carb", "Fructose", "Berry", "Apple", "Mango"];
  const nouns = ["Crusher", "Slayer", "Warrior", "Ninja", "Guardian", "Hunter", "Master", "Wizard", "Fighter", "Legend"];
  
  const adj = adjs[Math.floor(Math.random() * adjs.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 999);
  
  return `${adj}${noun}${num}`;
}
