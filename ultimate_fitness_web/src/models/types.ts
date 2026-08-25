export interface UserStats {
  dailyCalorieGoal: number;
  currentWeight: number;
  deadlineDate: string; // ISO string Date
  streakCount: number;
  socialEventMode: boolean; // Enables the calorie buffer
  bufferedCalories: number; // Stored extra calories for the event
}

export interface FoodEntry {
  id: string;
  name: string;
  timestamp: string; // ISO string Date
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  imageUrl?: string; // Optional if entered manually
}

export type TaskType = 'Exercise' | 'Fasting' | 'Meal';

export interface TaskItem {
  id: string;
  type: TaskType;
  description: string;
  isCompleted: boolean;
  date: string; // ISO string Date
}

export interface ProgressPhoto {
  id: string;
  uri: string;
  date: string; // ISO string Date
  weightAtTime?: number;
}
