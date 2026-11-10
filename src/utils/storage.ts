import { DailyData, GardenRecord, PlantType, TodoItem } from '../types';

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateKorean(dateStr: string): string {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const dayName = days[date.getDay()];
    return `${y}년 ${m}월 ${d}일 ${dayName}`;
  } catch {
    return dateStr;
  }
}

export function formatShortDateKorean(dateStr: string): string {
  try {
    const [, m, d] = dateStr.split('-').map(Number);
    return `${m}월 ${d}일`;
  } catch {
    return dateStr;
  }
}

const DEFAULT_TODOS: TodoItem[] = [
  {
    id: 'seed-todo-1',
    text: '아침 시원한 물 한 잔 마시기 💧',
    completed: true,
    createdAt: Date.now() - 3600000,
    order: 0
  },
  {
    id: 'seed-todo-2',
    text: '창문 열고 맑은 바람 쐬기 🌿',
    completed: false,
    createdAt: Date.now() - 3000000,
    order: 1
  },
  {
    id: 'seed-todo-3',
    text: '책 20분 읽기 📖',
    completed: false,
    createdAt: Date.now() - 2400000,
    order: 2
  },
  {
    id: 'seed-todo-4',
    text: '오늘의 작은 정원 둘러보기 🌱',
    completed: false,
    createdAt: Date.now() - 1800000,
    order: 3
  }
];

export const storage = {
  getDailyData(dateStr: string): DailyData {
    if (typeof window === 'undefined') {
      return { todos: DEFAULT_TODOS, plantType: 'sunflower', savedToGarden: false };
    }
    const raw = localStorage.getItem(`garden_day_${dateStr}`);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error('Failed to parse daily data', e);
      }
    }

    // Default for today if first visit
    const isToday = dateStr === getTodayDateString();
    return {
      todos: isToday ? DEFAULT_TODOS : [],
      plantType: 'sunflower',
      savedToGarden: false
    };
  },

  saveDailyData(dateStr: string, data: DailyData) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`garden_day_${dateStr}`, JSON.stringify(data));
  },

  getGardenRecords(): GardenRecord[] {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem('garden_collection_records');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error('Failed to parse garden records', e);
      }
    }
    // Provide a sample completed flower from yesterday so the garden isn't completely bare on first view
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
    const initialRecords: GardenRecord[] = [
      {
        date: yStr,
        plantType: 'tulip',
        totalCount: 3,
        completedCount: 3,
        growthPercent: 100,
        completedAt: new Date(yesterday.setHours(18, 30)).toISOString(),
        tasksSummary: ['산책 30분 하기', '식물에 물주기', '일기 쓰기']
      }
    ];
    localStorage.setItem('garden_collection_records', JSON.stringify(initialRecords));
    return initialRecords;
  },

  saveGardenRecords(records: GardenRecord[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('garden_collection_records', JSON.stringify(records));
  },

  addGardenRecord(record: GardenRecord): boolean {
    const existing = this.getGardenRecords();
    const index = existing.findIndex(r => r.date === record.date);
    if (index >= 0) {
      // Already exists for this date: update
      existing[index] = record;
      this.saveGardenRecords(existing);
      return false; // updated
    } else {
      existing.unshift(record);
      this.saveGardenRecords(existing);
      return true; // newly added
    }
  },

  hasSavedToday(dateStr: string): boolean {
    const records = this.getGardenRecords();
    return records.some(r => r.date === dateStr);
  },

  exportAllData(): string {
    const exportObj: Record<string, unknown> = {
      version: 1,
      exportedAt: new Date().toISOString(),
      dailyDays: {},
      gardenRecords: this.getGardenRecords()
    };

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('garden_day_')) {
        try {
          const val = localStorage.getItem(key);
          if (val) {
            (exportObj.dailyDays as Record<string, unknown>)[key] = JSON.parse(val);
          }
        } catch {}
      }
    }

    return JSON.stringify(exportObj, null, 2);
  },

  importAllData(jsonStr: string): boolean {
    try {
      const data = JSON.parse(jsonStr);
      if (!data || typeof data !== 'object') return false;

      if (Array.isArray(data.gardenRecords)) {
        this.saveGardenRecords(data.gardenRecords);
      }
      if (data.dailyDays && typeof data.dailyDays === 'object') {
        Object.entries(data.dailyDays).forEach(([k, v]) => {
          if (k.startsWith('garden_day_')) {
            localStorage.setItem(k, JSON.stringify(v));
          }
        });
      }
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  },

  resetAll() {
    if (typeof window === 'undefined') return;
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.startsWith('garden_') || k.startsWith('daily_'))) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  }
};
