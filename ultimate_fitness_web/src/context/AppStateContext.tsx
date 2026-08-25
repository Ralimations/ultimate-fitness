import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { UserStats, FoodEntry, TaskItem, ProgressPhoto } from '../models/types';
import { StorageService } from '../services/StorageService';

interface AppState {
  userStats: UserStats;
  foodEntries: FoodEntry[];
  tasks: TaskItem[];
  photos: ProgressPhoto[];
  isLoading: boolean;
  updateUserStats: (stats: Partial<UserStats>) => Promise<void>;
  addFoodEntry: (entry: FoodEntry) => Promise<void>;
  removeFoodEntry: (id: string) => Promise<void>;
  toggleSocialEvent: () => Promise<void>;
  addTask: (task: TaskItem) => Promise<void>;
  toggleTaskCompletion: (id: string) => Promise<void>;
  addPhoto: (photo: ProgressPhoto) => Promise<void>;
  getTodayTotalCalories: () => number;
}

const defaultStats: UserStats = {
  dailyCalorieGoal: 2000,
  currentWeight: 75,
  deadlineDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString(),
  streakCount: 0,
  socialEventMode: false,
  bufferedCalories: 0,
};

const AppStateContext = createContext<AppState | undefined>(undefined);

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [userStats, setUserStats] = useState<UserStats>(defaultStats);
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const storedStats = await StorageService.loadUserStats();
      const storedFood = await StorageService.loadFoodEntries();
      const storedTasks = await StorageService.loadTasks();
      const storedPhotos = await StorageService.loadPhotos();

      if (storedStats) setUserStats(storedStats);
      if (storedFood) setFoodEntries(storedFood);
      if (storedTasks) setTasks(storedTasks);
      if (storedPhotos) setPhotos(storedPhotos);
    } catch (error) {
      console.error('Failed to load local data', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserStats = async (updates: Partial<UserStats>) => {
    const newStats = { ...userStats, ...updates };
    setUserStats(newStats);
    await StorageService.saveUserStats(newStats);
  };

  const addFoodEntry = async (entry: FoodEntry) => {
    const updated = [...foodEntries, entry];
    setFoodEntries(updated);
    await StorageService.saveFoodEntries(updated);
  };

  const removeFoodEntry = async (id: string) => {
    const updated = foodEntries.filter(f => f.id !== id);
    setFoodEntries(updated);
    await StorageService.saveFoodEntries(updated);
  };

  const toggleSocialEvent = async () => {
    const newMode = !userStats.socialEventMode;
    const updates: Partial<UserStats> = {
      socialEventMode: newMode,
      bufferedCalories: newMode ? 1000 : 0, 
    };
    await updateUserStats(updates);
  };

  const addTask = async (task: TaskItem) => {
    const updated = [...tasks, task];
    setTasks(updated);
    await StorageService.saveTasks(updated);
  };

  const toggleTaskCompletion = async (id: string) => {
    const updated = tasks.map(t =>
      t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
    );
    setTasks(updated);
    await StorageService.saveTasks(updated);
  };

  const addPhoto = async (photo: ProgressPhoto) => {
    const updated = [...photos, photo];
    setPhotos(updated);
    await StorageService.savePhotos(updated);
  };

  const getTodayTotalCalories = () => {
    const today = new Date().toISOString().split('T')[0];
    return foodEntries
      .filter(f => f.timestamp.startsWith(today))
      .reduce((sum, f) => sum + f.calories, 0);
  };

  const value: AppState = {
    userStats,
    foodEntries,
    tasks,
    photos,
    isLoading,
    updateUserStats,
    addFoodEntry,
    removeFoodEntry,
    toggleSocialEvent,
    addTask,
    toggleTaskCompletion,
    addPhoto,
    getTodayTotalCalories,
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
