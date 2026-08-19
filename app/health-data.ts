export type SectionValues = Record<string, string>;

export type HealthFormState = {
  basic: SectionValues;
  activity: SectionValues & { types: string[] };
  nutrition: SectionValues;
  health: SectionValues & { conditions: string[]; digestion: string[] };
  sleep: SectionValues;
  goal: SectionValues & { barriers: string[] };
  files: SectionValues;
};

export const initialHealthForm: HealthFormState = {
  basic: {
    name: "",
    age: "",
    sex: "",
    height: "",
    weight: "",
    waist: "",
    bodyFat: "",
    weightTrend: "",
    weightChange: "",
    targetWeight: "",
  },
  activity: {
    workPattern: "",
    sittingHours: "",
    weeklyFrequency: "",
    types: [],
    duration: "",
    intensity: "",
    steps: "",
  },
  nutrition: {
    mealRegularity: "",
    breakfast: "",
    lunch: "",
    dinner: "",
    snack: "",
    water: "",
    eatingOut: "",
    sugaryDrinks: "",
    sweets: "",
    lateNight: "",
    cooking: "",
    preferences: "",
  },
  health: {
    conditions: [],
    medicationStatus: "",
    medications: "",
    supplementStatus: "",
    supplements: "",
    allergies: "",
    digestion: [],
    smoking: "",
    alcohol: "",
    lifeStage: "",
    menstrualRegularity: "",
    reportDate: "",
  },
  sleep: {
    bedTime: "",
    wakeTime: "",
    quality: "",
    stress: "5",
    fatigue: "5",
    latency: "",
    wakeups: "",
    shiftWork: "",
    notes: "",
  },
  goal: {
    primary: "",
    timeline: "",
    pastAttempts: "",
    barriers: [],
    support: "",
  },
  files: { labReport: "" },
};
