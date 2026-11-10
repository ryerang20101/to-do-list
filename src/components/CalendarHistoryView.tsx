import React, { useState } from 'react';
import { DailyData, GardenRecord, PLANT_DEFINITIONS, PlantType } from '../types';
import { PlantIllustration } from './PlantIllustration';
import { storage, formatDateKorean, formatShortDateKorean } from '../utils/storage';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

interface CalendarHistoryViewProps {
  todayStr: string;
  records: GardenRecord[];
}

export const CalendarHistoryView: React.FC<CalendarHistoryViewProps> = ({
  todayStr,
  records
}) => {
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth()); // 0-indexed
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear(y => y - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(y => y + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  // Calendar matrix calculation
  const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sun
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Load data for the selected date
  const selectedDayData: DailyData = storage.getDailyData(selectedDate);
  const selectedGardenRecord = records.find(r => r.date === selectedDate);

  const plantType: PlantType =
    selectedGardenRecord?.plantType || selectedDayData.plantType || 'sunflower';
  const todos = selectedDayData.todos || [];
  const totalCount = todos.length;
  const completedCount = todos.filter(t => t.completed).length;
  const growthPercent =
    selectedGardenRecord?.growthPercent ??
    (totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0);

  // Map of date -> GardenRecord for easy calendar badge rendering
  const recordMap = new Map<string, GardenRecord>();
  records.forEach(r => recordMap.set(r.date, r));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white/80 backdrop-blur-xs rounded-3xl p-6 md:p-8 border border-[#E3ECE0] shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-[#4A7C59]">
          <CalendarIcon className="w-4 h-4 text-[#4A7C59]" />
          <span>날짜별 정원 일지</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#233821] mt-1 font-['Gowun_Dodum']">
          📅 날짜별 기록
        </h2>
        <p className="text-sm text-[#5B6E57] mt-1">
          달력에서 날짜를 선택하여 지난날의 식물 성장과 완료한 일들을 회상해보세요.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar Left Column */}
        <div className="lg:col-span-7 bg-white/90 backdrop-blur-xs rounded-3xl p-6 border border-[#E3ECE0] shadow-sm">
          {/* Calendar Header with arrows */}
          <div className="flex items-center justify-between pb-4 border-b border-[#EAEFE5]">
            <h3 className="font-bold text-lg text-[#233821] font-['Gowun_Dodum']">
              {currentYear}년 {currentMonth + 1}월
            </h3>
            <div className="flex items-center gap-1">
              <button
                onClick={prevMonth}
                className="p-1.5 text-[#6E826A] hover:text-[#233821] hover:bg-[#EEF5E9] rounded-lg transition-colors"
                title="이전 달"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  const now = new Date();
                  setCurrentYear(now.getFullYear());
                  setCurrentMonth(now.getMonth());
                  setSelectedDate(todayStr);
                }}
                className="px-2.5 py-1 text-xs font-semibold text-[#4A7C59] hover:bg-[#EEF5E9] rounded-lg transition-colors"
              >
                오늘
              </button>
              <button
                onClick={nextMonth}
                className="p-1.5 text-[#6E826A] hover:text-[#233821] hover:bg-[#EEF5E9] rounded-lg transition-colors"
                title="다음 달"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1 mt-4 text-center text-xs font-bold text-[#72856F]">
            <span className="text-[#DC2626]">일</span>
            <span>월</span>
            <span>화</span>
            <span>수</span>
            <span>목</span>
            <span>금</span>
            <span className="text-[#2563EB]">토</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5 mt-2">
            {/* Empty slots for first day offset */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="h-14 sm:h-16" />
            ))}

            {/* Days in Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isSelected = selectedDate === dateString;
              const isToday = todayStr === dateString;
              const dayRecord = recordMap.get(dateString);

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(dateString)}
                  className={`h-14 sm:h-16 rounded-2xl p-1 flex flex-col items-center justify-between border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-[#4A7C59] bg-[#EBF5E6] ring-2 ring-[#4A7C59]/25 shadow-xs font-bold'
                      : isToday
                      ? 'border-[#92C7A1] bg-[#F4F9F1]'
                      : 'border-[#EEF4E9] bg-white hover:bg-[#FAFDF7]'
                  }`}
                >
                  <span
                    className={`text-xs ${
                      isSelected
                        ? 'text-[#233821]'
                        : isToday
                        ? 'text-[#4A7C59] font-bold'
                        : 'text-[#4F644B]'
                    }`}
                  >
                    {day}
                  </span>

                  {/* Stamp badge if recorded in garden */}
                  {dayRecord ? (
                    <span
                      className="text-sm leading-none"
                      title={`${PLANT_DEFINITIONS[dayRecord.plantType]?.name} 100% 달성`}
                    >
                      {PLANT_DEFINITIONS[dayRecord.plantType]?.emoji}
                    </span>
                  ) : isToday ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4A7C59]" />
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 pt-3 border-t border-[#EAEFE5] flex items-center justify-between text-[11px] text-[#71856E]">
            <span className="flex items-center gap-1.5">
              <span>🌻 🌷 🌵 🍀 🍅</span>
              <span>식물 아이콘: 100% 달성 완료일</span>
            </span>
            <span>선택일: {formatShortDateKorean(selectedDate)}</span>
          </div>
        </div>

        {/* Selected Date Detail Right Column */}
        <div className="lg:col-span-5 bg-white/90 backdrop-blur-xs rounded-3xl p-6 border border-[#E3ECE0] shadow-sm flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-[#EAEFE5]">
              <div>
                <span className="text-[11px] font-bold text-[#4A7C59] uppercase tracking-wide">
                  선택한 날짜
                </span>
                <h4 className="text-base md:text-lg font-bold text-[#233821] font-['Gowun_Dodum'] mt-0.5">
                  {formatDateKorean(selectedDate)}
                </h4>
              </div>

              {selectedDate === todayStr && (
                <span className="px-2.5 py-1 bg-[#4A7C59] text-white text-[11px] font-bold rounded-full">
                  오늘
                </span>
              )}
            </div>

            {/* Plant Preview for this Day */}
            <div className="my-3 flex flex-col items-center justify-center bg-[#F7FAF4] rounded-2xl p-4 border border-[#E4EDE0]">
              <div className="w-32 h-40 flex items-center justify-center">
                <PlantIllustration
                  plantType={plantType}
                  growthPercent={growthPercent}
                  totalTasks={totalCount || 5}
                  size="md"
                  interactive={true}
                  showPotDetails={true}
                />
              </div>
              <div className="text-center mt-2">
                <span className="text-xs font-bold text-[#233821] flex items-center justify-center gap-1">
                  <span>{PLANT_DEFINITIONS[plantType]?.emoji}</span>
                  <span>{PLANT_DEFINITIONS[plantType]?.name}</span>
                </span>
                <span className="text-[11px] font-semibold text-[#4A7C59] tabular-nums block mt-0.5">
                  성장도: {growthPercent}% ({completedCount}/{totalCount} 완료)
                </span>
              </div>
            </div>

            {/* Todo List for this Day */}
            <div className="mt-4">
              <h5 className="text-xs font-bold text-[#3B5437] mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#4A7C59]" />
                <span>할 일 기록 ({todos.length}개)</span>
              </h5>

              {todos.length === 0 ? (
                <div className="p-4 rounded-xl bg-[#FAFDF7] border border-[#EAEFE5] text-center text-xs text-[#80957C]">
                  {selectedDate === todayStr
                    ? '오늘의 정원 탭에서 할 일을 등록해보세요!'
                    : '이 날짜에는 등록된 할 일 기록이 없습니다.'}
                </div>
              ) : (
                <ul className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {todos.map(todo => (
                    <li
                      key={todo.id}
                      className={`text-xs px-3 py-2 rounded-xl border flex items-center gap-2 ${
                        todo.completed
                          ? 'bg-[#F4F9F1] border-[#DCEAD5] text-[#4F644B] line-through'
                          : 'bg-white border-[#E8EFE4] text-[#233821]'
                      }`}
                    >
                      <span className={todo.completed ? 'text-[#4A7C59] font-bold' : 'text-[#A0B59C]'}>
                        {todo.completed ? '✓' : '○'}
                      </span>
                      <span className="truncate flex-1">{todo.text}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <p className="text-[11px] text-[#7A8E76] text-center mt-4 pt-3 border-t border-[#EAEFE5] italic">
            * 과거 기록 열람은 오늘의 식물 성장 상태에 영향을 주지 않습니다.
          </p>
        </div>
      </div>
    </div>
  );
};
