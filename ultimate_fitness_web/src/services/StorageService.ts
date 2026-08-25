import { Preferences } from '@capacitor/preferences';
import type { UserStats, FoodEntry, TaskItem, ProgressPhoto } from '../models/types';

const KEYS = {
  USER_STATS: '@user_stats',
  FOOD_ENTRIES: '@food_entries',
  TASKS: '@tasks',
  PHOTOS: '@photos',
};

export const StorageService = {
  async saveUserStats(stats: UserStats): Promise<void> {
    await Preferences.set({ key: KEYS.USER_STATS, value: JSON.stringify(stats) });
  },
  async loadUserStats(): Promise<UserStats | null> {
    const { value } = await Preferences.get({ key: KEYS.USER_STATS });
    return value ? JSON.parse(value) : null;
  },

  async saveFoodEntries(entries: FoodEntry[]): Promise<void> {
    await Preferences.set({ key: KEYS.FOOD_ENTRIES, value: JSON.stringify(entries) });
  },
  async loadFoodEntries(): Promise<FoodEntry[]> {
    const { value } = await Preferences.get({ key: KEYS.FOOD_ENTRIES });
    return value ? JSON.parse(value) : [];
  },

  async saveTasks(tasks: TaskItem[]): Promise<void> {
    await Preferences.set({ key: KEYS.TASKS, value: JSON.stringify(tasks) });
  },
  async loadTasks(): Promise<TaskItem[]> {
    const { value } = await Preferences.get({ key: KEYS.TASKS });
    return value ? JSON.parse(value) : [];
  },

  async savePhotos(photos: ProgressPhoto[]): Promise<void> {
    await Preferences.set({ key: KEYS.PHOTOS, value: JSON.stringify(photos) });
  },
  async loadPhotos(): Promise<ProgressPhoto[]> {
    const { value } = await Preferences.get({ key: KEYS.PHOTOS });
    return value ? JSON.parse(value) : [];
  },
};
