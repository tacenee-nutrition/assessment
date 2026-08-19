export type SectionValues = Record<string, string>;

export type Supplement = {
  id: number;
  name: string;
  brand: string;
  dose: string;
  frequency: string;
  timing: string;
  labelFile: string;
};

export type FormState = {
  basic: SectionValues;
  training: SectionValues;
  nutrition: SectionValues;
  labs: SectionValues;
  sleep: SectionValues;
  goals: string[];
  otherGoal: string;
  supplements: Supplement[];
  files: SectionValues;
};

export const initialForm: FormState = {
  basic: { name: "", height: "", weight: "", bodyFat: "" },
  training: {
    years: "",
    background: "",
    weeklyFrequency: "",
    sessionDuration: "",
    zone2Duration: "",
    rpe: "5",
    plan: "",
    snatch: "",
    cleanJerk: "",
    squat: "",
    deadlift: "",
  },
  nutrition: {
    dietStyle: "",
    carbs: "",
    protein: "",
    fat: "",
    breakfast: "",
    lunch: "",
    dinner: "",
    snack: "",
    specialDiet: "",
    water: "",
    salt: "",
    dairy: "",
    nuts: "",
    greens: "",
    potatoes: "",
    mushrooms: "",
    coconutWater: "",
    fruit: "",
    caffeine: "",
    alcohol: "",
  },
  labs: {
    reportDate: "",
    testosterone: "",
    cortisol: "",
    ferritin: "",
    vitaminD: "",
    hsCrp: "",
    lipids: "",
  },
  sleep: {
    regularity: "",
    bedTime: "",
    sleepLatency: "",
    wakeTime: "",
    nightWakeups: "",
    fatigue: "5",
    rhr: "",
    rhrPeriod: "",
    hrv: "",
    hrvPeriod: "",
    notes: "",
  },
  goals: [],
  otherGoal: "",
  supplements: [
    {
      id: 1,
      name: "",
      brand: "",
      dose: "",
      frequency: "",
      timing: "",
      labelFile: "",
    },
  ],
  files: { trainingPlan: "", labReport: "", hrvImage: "" },
};
