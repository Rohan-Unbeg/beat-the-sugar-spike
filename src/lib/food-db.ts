export interface FoodItem {
  id: string;
  name: string;
  sugar: number;
  icon: string;
  category: string;
}

export const FOOD_DATABASE: FoodItem[] = [
  { id: "coca_cola", name: "Coca Cola (330ml)", sugar: 35, icon: "🥤", category: "drink, soda" },
  { id: "pepsi", name: "Pepsi (330ml)", sugar: 34, icon: "🥤", category: "drink, soda" },
  { id: "sprite", name: "Sprite (330ml)", sugar: 33, icon: "🥤", category: "drink, soda" },
  { id: "orange_juice", name: "Orange Juice (250ml)", sugar: 22, icon: "🍊", category: "drink" },
  { id: "apple_juice", name: "Apple Juice (250ml)", sugar: 24, icon: "🍎", category: "drink" },
  { id: "mars_bar", name: "Mars Bar", sugar: 31, icon: "🍫", category: "sweet" },
  { id: "snickers", name: "Snickers Bar", sugar: 20, icon: "🍫", category: "sweet" },
  { id: "kitkat", name: "KitKat (4 fingers)", sugar: 21, icon: "🍫", category: "sweet" },
  { id: "glaze_donut", name: "Glazed Donut", sugar: 12, icon: "🍩", category: "sweet" },
  { id: "chocolate_muffin", name: "Chocolate Muffin", sugar: 33, icon: "🧁", category: "sweet" },
  { id: "oreo", name: "Oreo (3 cookies)", sugar: 14, icon: "🍪", category: "sweet" },
  { id: "ketchup", name: "Ketchup (1 tbsp)", sugar: 4, icon: "🍅", category: "sauce" },
  { id: "nutella", name: "Nutella (1 tbsp)", sugar: 11, icon: "🥜", category: "sweet" },
  { id: "yogurt_fruit", name: "Fruit Yogurt (150g)", sugar: 19, icon: "🍦", category: "dairy" },
  { id: "ice_cream_vanilla", name: "Vanilla Ice Cream (1 scoop)", sugar: 14, icon: "🍨", category: "sweet" },
  { id: "banana", name: "Banana (medium)", sugar: 12, icon: "🍌", category: "fruit" },
  { id: "apple", name: "Apple (medium)", sugar: 19, icon: "🍎", category: "fruit" },
  { id: "grapes", name: "Grapes (1 cup)", sugar: 23, icon: "🍇", category: "fruit" },
  { id: "red_bull", name: "Red Bull (250ml)", sugar: 27, icon: "⚡", category: "drink" },
  { id: "starbucks_frappuccino", name: "Starbucks Frappuccino (Tall)", sugar: 36, icon: "☕", category: "drink" },
];
