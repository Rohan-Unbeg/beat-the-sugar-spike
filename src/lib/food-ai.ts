export interface AIParsedFood {
  name: string;
  sugar: number;
  category: string;
  icon: string;
}

export interface HealthInsight {
  title: string;
  message: string;
  action: string;
  why: string;
  priority: "low" | "medium" | "high";
}

export async function parseFoodWithAI(query: string): Promise<AIParsedFood | null> {
  if (!query.trim()) return null;

  try {
    const response = await fetch("/api/food/parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) throw new Error("API Route Failure");
    return await response.json();
  } catch (error) {
    console.warn("AI Parsing via API Route Failed:", error);
    return null;
  }
}

export async function generatePersonalizedInsight(ctx: {
  age: number;
  bmi: number;
  steps: number;
  sleepHours: number;
  timeOfDay: number;
  totalSugarToday: number;
  isMale: boolean;
}): Promise<HealthInsight | null> {
  try {
    const response = await fetch("/api/health/insight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ctx),
    });

    if (!response.ok) throw new Error("API Route Failure");
    return await response.json();
  } catch (error) {
    console.error("Insight Generation via API Route Failed:", error);
    return null;
  }
}
