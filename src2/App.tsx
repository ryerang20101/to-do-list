/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  PlantType,
  TodoItem,
  GardenRecord,
  ViewTab,
  PLANT_DEFINITIONS,
  ENCOURAGING_MESSAGES,
  STAGE_MESSAGES
} from './types';
import {
  storage,
  getTodayDateString,
  formatDateKorean
} from './utils/storage';
import { soundManager } from './utils/audio';
import { PlantIllustration, getGrowthStage } from './components/PlantIllustration';
import { TodoList } from './components/TodoList';
import { PlantSelectorModal } from './components/PlantSelectorModal';
import { CelebrationModal } from './components/CelebrationModal';
import { MyGardenView } from './components/MyGardenView';
import { PlantEncyclopediaView } from './components/PlantEncyclopediaView';
import { CalendarHistoryView } from './components/CalendarHistoryView';
import { DataManagementModal } from './components/DataManagementModal';
import { CalendarSyncModal } from './components/CalendarSyncModal';
import { CalendarExportConfirmModal } from './components/CalendarExportConfirmModal';
import { initAuth, googleSignIn, logoutGoogle } from './utils/googleAuth';
import { addEventToGoogleCalendar } from './utils/googleCalendar';
import { User } from 'firebase/auth';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Settings,
  RefreshCw,
  Flower2,
  CheckCircle2,
  Calendar,
  BookOpen,
  LogOut,
  User as UserIcon,
  Loader2
} from 'lucide-react';

export default function App() {
  const todayStr = useMemo(() => getTodayDateString(), []);

  // Application State
  const [activeTab, setActiveTab] = useState<ViewTab>('today');
  const [selectedPlant, setSelectedPlant] = useState<PlantType>('sunflower');
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [gardenRecords, setGardenRecords] = useState<GardenRecord[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Google Auth State
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Motivational quote of the day
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState<number>(0);

  // Modals state
  const [isPlantSelectorOpen, setIsPlantSelectorOpen] = useState(false);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [isCalendarSyncOpen, setIsCalendarSyncOpen] = useState(false);
  const [calendarExportTarget, setCalendarExportTarget] = useState<TodoItem | null>(null);
  const [isExportingToCalendar, setIsExportingToCalendar] = useState(false);

  // Track if celebration has been shown once during this session
  const [celebrationShownToday, setCelebrationShownToday] = useState(false);

  // Show quick toast notification
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  }, []);

  // Initialize from LocalStorage
  const loadInitialData = useCallback(() => {
    const daily = storage.getDailyData(todayStr);
    setTodos(daily.todos || []);
    setSelectedPlant(daily.plantType || 'sunflower');

    const records = storage.getGardenRecords();
    setGardenRecords(records);

    setSoundEnabled(soundManager.isEnabled());

    // Random quote
    const rand = Math.floor(Math.random() * ENCOURAGING_MESSAGES.length);
    setCurrentQuoteIndex(rand);
  }, [todayStr]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Initialize Google Auth state listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setGoogleToken(token);
      },
      () => {
        setGoogleUser(null);
        setGoogleToken(null);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Google Login & Logout handlers
  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setGoogleUser(res.user);
        setGoogleToken(res.accessToken);
        showToast(`${res.user.displayName || 'Google'} 계정이 연결되었습니다! 📅`);
      }
    } catch (err: any) {
      console.error(err);
      showToast('구글 로그인에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogout = async () => {
    await logoutGoogle();
    setGoogleUser(null);
    setGoogleToken(null);
    showToast('구글 계정 연결이 해제되었습니다.');
  };

  // Derived calculations: growth %
  const completedCount = useMemo(() => todos.filter(t => t.completed).length, [todos]);
  const totalCount = todos.length;
  const growthPercent = useMemo(() => {
    if (totalCount === 0) return 0;
    return Math.round((completedCount / totalCount) * 100);
  }, [completedCount, totalCount]);

  const currentStageIndex = getGrowthStage(growthPercent, totalCount);
  const plantMeta = PLANT_DEFINITIONS[selectedPlant];

  const isSavedToGardenToday = useMemo(() => {
    return gardenRecords.some(r => r.date === todayStr);
  }, [gardenRecords, todayStr]);

  // Save daily state to localStorage whenever todos or plantType change
  useEffect(() => {
    storage.saveDailyData(todayStr, {
      todos,
      plantType: selectedPlant,
      savedToGarden: isSavedToGardenToday
    });
  }, [todos, selectedPlant, isSavedToGardenToday, todayStr]);

  // Check for 100% completion trigger
  useEffect(() => {
    if (totalCount > 0 && completedCount === totalCount && !celebrationShownToday) {
      setIsCelebrationOpen(true);
      setCelebrationShownToday(true);
    }
  }, [completedCount, totalCount, celebrationShownToday]);

  // Todo Handlers
  const handleAddTodo = (text: string) => {
    const newTodo: TodoItem = {
      id: `todo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      text,
      completed: false,
      createdAt: Date.now(),
      order: todos.length
    };
    setTodos(prev => [...prev, newTodo]);
    soundManager.playAdd();
    showToast('새로운 할 일이 추가되었습니다! 🌱');
  };

  const handleToggleTodo = (id: string) => {
    setTodos(prev => {
      const updated = prev.map(t => {
        if (t.id === id) {
          const nextState = !t.completed;
          if (nextState) {
            soundManager.playCheck();
          } else {
            soundManager.playUncheck();
          }
          return { ...t, completed: nextState };
        }
        return t;
      });
      return updated;
    });
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
    soundManager.playUncheck();
    showToast('할 일이 삭제되었습니다.');
  };

  const handleEditTodo = (id: string, newText: string) => {
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, text: newText } : t)));
    showToast('할 일이 수정되었습니다.');
  };

  const handleMoveTodo = (id: string, direction: 'up' | 'down') => {
    setTodos(prev => {
      const idx = prev.findIndex(t => t.id === id);
      if (idx < 0) return prev;
      if (direction === 'up' && idx === 0) return prev;
      if (direction === 'down' && idx === prev.length - 1) return prev;

      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      const copy = [...prev];
      const [moved] = copy.splice(idx, 1);
      copy.splice(targetIdx, 0, moved);
      return copy;
    });
  };

  const handleToggleAll = () => {
    const allCompleted = completedCount === totalCount;
    setTodos(prev => prev.map(t => ({ ...t, completed: !allCompleted })));
    if (!allCompleted) {
      soundManager.playCelebration();
    } else {
      soundManager.playUncheck();
    }
  };

  const handleClearCompleted = () => {
    setTodos(prev => prev.filter(t => !t.completed));
    showToast('완료된 항목들을 정리했습니다.');
  };

  // Google Calendar integration handlers
  const handleImportCalendarTasks = (taskTitles: string[]) => {
    const newItems: TodoItem[] = taskTitles.map((t, idx) => ({
      id: `cal-todo-${Date.now()}-${idx}`,
      text: t,
      completed: false,
      createdAt: Date.now() + idx,
      order: todos.length + idx
    }));
    setTodos(prev => [...prev, ...newItems]);
    showToast(`${taskTitles.length}개의 캘린더 일정을 할 일 목록으로 가져왔습니다! 🌱`);
  };

  const handleOpenExportConfirm = (todo: TodoItem) => {
    if (!googleToken) {
      handleGoogleLogin();
      return;
    }
    setCalendarExportTarget(todo);
  };

  const handleConfirmExportToCalendar = async () => {
    if (!calendarExportTarget || !googleToken) return;
    setIsExportingToCalendar(true);
    try {
      await addEventToGoogleCalendar(googleToken, calendarExportTarget.text, todayStr);
      showToast('Google 캘린더에 일정이 성공적으로 등록되었습니다! 📅');
      setCalendarExportTarget(null);
    } catch (err: any) {
      console.error(err);
      showToast('캘린더 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsExportingToCalendar(false);
    }
  };

  // Sound toggle
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.setEnabled(next);
    if (next) {
      soundManager.playWater();
      showToast('효과음이 켜졌습니다 🔔');
    } else {
      showToast('효과음이 꺼졌습니다');
    }
  };

  // Plant selector handler
  const handleSelectPlant = (plant: PlantType) => {
    setSelectedPlant(plant);
    showToast(`오늘의 식물로 '${PLANT_DEFINITIONS[plant].name}'이(가) 선택되었습니다!`);
  };

  // Save to Garden handler
  const handleSaveToGarden = () => {
    const record: GardenRecord = {
      date: todayStr,
      plantType: selectedPlant,
      totalCount,
      completedCount,
      growthPercent: 100,
      completedAt: new Date().toISOString(),
      tasksSummary: todos.filter(t => t.completed).map(t => t.text)
    };

    const isNew = storage.addGardenRecord(record);
    setGardenRecords(storage.getGardenRecords());
    soundManager.playCelebration();
    showToast(isNew ? '오늘 완성한 식물이 나의 정원에 심어졌어요! 🌷' : '정원 기록이 갱신되었습니다!');
    setIsCelebrationOpen(false);
  };

  // Random quote refresh
  const refreshQuote = () => {
    setCurrentQuoteIndex(prev => (prev + 1) % ENCOURAGING_MESSAGES.length);
    soundManager.playWater();
  };

  return (
    <div className="min-h-screen bg-[#F5F8F1] text-[#293B26] flex flex-col antialiased selection:bg-[#C2E8CC] selection:text-[#184528]">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#233821] text-white px-4 py-2.5 rounded-full text-xs font-semibold shadow-xl flex items-center gap-2 animate-fade-in">
          <Sparkles className="w-4 h-4 text-[#EAB308]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-[#FCFDFB]/90 backdrop-blur-md border-b border-[#E3ECE0] px-4 md:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Brand */}
          <div
            onClick={() => setActiveTab('today')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 rounded-2xl bg-[#E8F5E1] border border-[#CDE5C5] flex items-center justify-center text-xl shadow-xs group-hover:scale-105 transition-transform">
              🌱
            </div>
            <div>
              <h1 className="text-base md:text-lg font-extrabold text-[#1F361D] font-['Gowun_Dodum'] leading-tight">
                오늘의 작은 정원
              </h1>
              <span className="text-[10px] text-[#647C60] hidden sm:block">
                My Little Garden · 식물을 키우는 To-do
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 md:gap-2 overflow-x-auto scrollbar-none py-0.5">
            <button
              onClick={() => setActiveTab('today')}
              className={`px-3 md:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'today'
                  ? 'bg-[#4A7C59] text-white shadow-xs'
                  : 'text-[#566D52] hover:text-[#233821] hover:bg-[#EEF5E9]'
              }`}
            >
              <span>🌱 오늘의 정원</span>
            </button>
            <button
              onClick={() => setActiveTab('garden')}
              className={`px-3 md:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'garden'
                  ? 'bg-[#4A7C59] text-white shadow-xs'
                  : 'text-[#566D52] hover:text-[#233821] hover:bg-[#EEF5E9]'
              }`}
            >
              <Flower2 className="w-3.5 h-3.5" />
              <span>나의 정원 ({gardenRecords.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('encyclopedia')}
              className={`px-3 md:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'encyclopedia'
                  ? 'bg-[#4A7C59] text-white shadow-xs'
                  : 'text-[#566D52] hover:text-[#233821] hover:bg-[#EEF5E9]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>식물 도감</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 md:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-[#4A7C59] text-white shadow-xs'
                  : 'text-[#566D52] hover:text-[#233821] hover:bg-[#EEF5E9]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>날짜별 기록</span>
            </button>
          </nav>

          {/* Controls: Google Account, Sound & Settings */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Google Auth Button / User Chip */}
            {googleUser ? (
              <div className="flex items-center gap-1.5 bg-[#EEF5E9] border border-[#CFE5C7] py-1 px-2.5 rounded-xl text-xs">
                {googleUser.photoURL ? (
                  <img
                    src={googleUser.photoURL}
                    alt={googleUser.displayName || 'Google User'}
                    className="w-5 h-5 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-[#4A7C59] text-white flex items-center justify-center text-[10px] font-bold">
                    {googleUser.displayName?.[0] || 'G'}
                  </div>
                )}
                <span className="font-semibold text-[#233821] max-w-[80px] sm:max-w-[120px] truncate">
                  {googleUser.displayName || googleUser.email?.split('@')[0]}
                </span>
                <button
                  onClick={handleGoogleLogout}
                  className="p-1 text-[#7F937B] hover:text-[#DC2626] rounded-md transition-colors"
                  title="Google 계정 연결 해제"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleLogin}
                disabled={isLoggingIn}
                className="flex items-center gap-1.5 py-1.5 px-3 bg-white hover:bg-[#F8FAF5] text-[#233821] border border-[#DEEAD4] rounded-xl text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#4A7C59]" />
                ) : (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                )}
                <span className="hidden sm:inline">Google 연결</span>
              </button>
            )}

            <button
              onClick={toggleSound}
              className={`p-2 rounded-xl transition-colors cursor-pointer border ${
                soundEnabled
                  ? 'bg-[#EBF5E6] text-[#2F673B] border-[#CDE5C5]'
                  : 'bg-white text-[#8A9C86] border-[#E3ECE0] hover:text-[#233821]'
              }`}
              title={soundEnabled ? '효과음 끄기' : '효과음 켜기 (Web Audio)'}
              aria-label="효과음 토글"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsDataModalOpen(true)}
              className="p-2 rounded-xl bg-white text-[#6F826B] hover:text-[#233821] border border-[#E3ECE0] hover:bg-[#F2F7ED] transition-colors cursor-pointer"
              title="데이터 백업 및 관리"
              aria-label="데이터 관리"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* SUB-HEADER: Date & Today's Encouragement Message */}
      <section className="bg-gradient-to-r from-[#F0F7EB] via-[#F8FAF4] to-[#EEF5E7] border-b border-[#E2ECE0] py-3 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          {/* Today Date */}
          <div className="flex items-center gap-2 text-xs font-semibold text-[#445E40]">
            <Calendar className="w-4 h-4 text-[#4A7C59]" />
            <span className="font-bold text-[#1F361D]">{formatDateKorean(todayStr)}</span>
            <span className="text-[#889B84]">·</span>
            <span className="text-[#5B7357]">
              {completedCount === totalCount && totalCount > 0
                ? '오늘의 목표 완료 🌟'
                : `완료율 ${growthPercent}%`}
            </span>
          </div>

          {/* Random Motivational Quote */}
          <div className="flex items-center gap-2 bg-white/70 px-3 py-1.5 rounded-full border border-[#DEEAD4] text-xs text-[#3E563B] max-w-xl">
            <span className="text-sm">🍃</span>
            <span className="truncate italic font-medium">
              &ldquo;{ENCOURAGING_MESSAGES[currentQuoteIndex]}&rdquo;
            </span>
            <button
              onClick={refreshQuote}
              className="p-1 text-[#83977F] hover:text-[#233821] rounded-full transition-colors cursor-pointer"
              title="다른 응원 메시지 보기"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* MAIN VIEW CONTENT CONTAINER */}
      <main className="max-w-6xl mx-auto w-full p-4 md:p-8 flex-1">
        {/* TAB 1: TODAY'S GARDEN (Main 2-Column Workspace) */}
        {activeTab === 'today' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: To-do List Area */}
            <div className="lg:col-span-7">
              <TodoList
                todos={todos}
                onAddTodo={handleAddTodo}
                onToggleTodo={handleToggleTodo}
                onDeleteTodo={handleDeleteTodo}
                onEditTodo={handleEditTodo}
                onMoveTodo={handleMoveTodo}
                onToggleAll={handleToggleAll}
                onClearCompleted={handleClearCompleted}
                onOpenCalendarSync={() => setIsCalendarSyncOpen(true)}
                onExportToCalendar={handleOpenExportConfirm}
                hasGoogleAuth={!!googleToken}
              />
            </div>

            {/* RIGHT COLUMN: Plant Growth Space (Hero Plant Card) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="bg-white/90 backdrop-blur-xs rounded-3xl p-6 md:p-7 border border-[#E3ECE0] shadow-sm flex flex-col items-center text-center relative overflow-hidden">
                {/* Decorative Sunbeam / Cloud in background */}
                <div className="absolute top-3 left-4 text-xs text-[#8A9C86] flex items-center gap-1 font-semibold">
                  <span>☁️</span>
                  <span className="text-[11px]">맑은 정원의 오후</span>
                </div>

                {/* Change Plant Button */}
                <button
                  onClick={() => setIsPlantSelectorOpen(true)}
                  className="absolute top-3 right-4 px-2.5 py-1 text-xs font-semibold text-[#4A7C59] bg-[#EBF5E6] hover:bg-[#DEEED7] rounded-xl transition-colors cursor-pointer border border-[#CFE5C7] flex items-center gap-1"
                >
                  <span>식물 변경</span>
                </button>

                {/* Active Plant Identity */}
                <div className="mt-4 mb-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3F8EE] border border-[#DEEAD4] text-xs font-bold text-[#3B6647]">
                    <span>{plantMeta.emoji}</span>
                    <span>{plantMeta.name} 키우는 중</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-[#1F361D] mt-1.5 font-['Gowun_Dodum']">
                    {growthPercent}% 성장 완료
                  </h3>
                </div>

                {/* Growth Stage Matching Message */}
                <p className="text-xs text-[#526B4E] font-medium min-h-[20px]">
                  {STAGE_MESSAGES[currentStageIndex]}
                </p>

                {/* Smooth Progress Bar */}
                <div className="w-full max-w-xs mt-3 bg-[#EAF2E5] rounded-full h-3 overflow-hidden p-0.5 border border-[#D5E3CE]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#86C298] via-[#4A7C59] to-[#2D6A4F] transition-all duration-500 ease-out"
                    style={{ width: `${growthPercent}%` }}
                  />
                </div>

                {/* Big Botanical Illustration Canvas */}
                <div className="relative w-full my-2 flex items-center justify-center">
                  <PlantIllustration
                    plantType={selectedPlant}
                    growthPercent={growthPercent}
                    totalTasks={totalCount}
                    size="lg"
                    interactive={true}
                    showPotDetails={true}
                  />
                </div>

                {/* Helpful Hint / Action */}
                <div className="w-full pt-3 border-t border-[#EAEFE5] flex items-center justify-between text-xs text-[#6F826B]">
                  <span className="flex items-center gap-1">
                    <span>💧</span>
                    <span>화분을 누르면 식물이 반응해요!</span>
                  </span>

                  {/* 100% Bloom Celebration Button */}
                  {growthPercent === 100 && totalCount > 0 && (
                    <button
                      onClick={() => setIsCelebrationOpen(true)}
                      className="px-3 py-1 bg-[#4A7C59] hover:bg-[#3B6647] text-white rounded-lg font-bold text-xs shadow-xs transition-transform hover:scale-105 cursor-pointer flex items-center gap-1"
                    >
                      <span>축하 카드 보기</span>
                      <Sparkles className="w-3 h-3 text-[#EAB308]" />
                    </button>
                  )}
                </div>
              </div>

              {/* Garden Status Ribbon (if saved today) */}
              {isSavedToGardenToday && (
                <div className="p-4 rounded-2xl bg-[#EAF5E4] border border-[#CFE5C7] flex items-center justify-between text-xs text-[#2B6337]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2B6337]" />
                    <span className="font-semibold">오늘의 식물이 &lsquo;나의 정원&rsquo;에 안전하게 심어졌습니다!</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('garden')}
                    className="font-bold underline hover:text-[#184528]"
                  >
                    보러가기
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MY GARDEN COLLECTION */}
        {activeTab === 'garden' && (
          <MyGardenView
            records={gardenRecords}
            onGoToToday={() => setActiveTab('today')}
          />
        )}

        {/* TAB 3: PLANT ENCYCLOPEDIA */}
        {activeTab === 'encyclopedia' && (
          <PlantEncyclopediaView
            records={gardenRecords}
            onSelectPlantForToday={handleSelectPlant}
            activePlantType={selectedPlant}
          />
        )}

        {/* TAB 4: CALENDAR & HISTORY */}
        {activeTab === 'history' && (
          <CalendarHistoryView
            todayStr={todayStr}
            records={gardenRecords}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-auto py-6 px-4 border-t border-[#E2ECE0] text-center text-xs text-[#7A8E76]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} 오늘의 작은 정원 (My Little Garden) · 매일의 작은 실천이 아름다운 꽃을 피웁니다.</p>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <button onClick={() => setActiveTab('today')} className="hover:text-[#233821]">오늘의 정원</button>
            <span>·</span>
            <button onClick={() => setActiveTab('garden')} className="hover:text-[#233821]">나의 정원</button>
            <span>·</span>
            <button onClick={() => setActiveTab('encyclopedia')} className="hover:text-[#233821]">식물 도감</button>
            <span>·</span>
            <button onClick={() => setIsDataModalOpen(true)} className="hover:text-[#233821]">데이터 관리</button>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <PlantSelectorModal
        isOpen={isPlantSelectorOpen}
        onClose={() => setIsPlantSelectorOpen(false)}
        selectedPlant={selectedPlant}
        onSelectPlant={handleSelectPlant}
      />

      <CelebrationModal
        isOpen={isCelebrationOpen}
        onClose={() => setIsCelebrationOpen(false)}
        plantType={selectedPlant}
        alreadySaved={isSavedToGardenToday}
        onSaveToGarden={handleSaveToGarden}
      />

      <DataManagementModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
        onDataChanged={loadInitialData}
      />

      <CalendarSyncModal
        isOpen={isCalendarSyncOpen}
        onClose={() => setIsCalendarSyncOpen(false)}
        accessToken={googleToken}
        targetDateStr={todayStr}
        onImportTasks={handleImportCalendarTasks}
        onRequireAuth={handleGoogleLogin}
      />

      <CalendarExportConfirmModal
        isOpen={!!calendarExportTarget}
        onClose={() => setCalendarExportTarget(null)}
        onConfirm={handleConfirmExportToCalendar}
        taskTitle={calendarExportTarget?.text || ''}
        targetDateStr={todayStr}
        isSaving={isExportingToCalendar}
      />
    </div>
  );
}
