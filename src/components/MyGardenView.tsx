import React, { useState } from 'react';
import { GardenRecord, PLANT_DEFINITIONS, PlantType } from '../types';
import { PlantIllustration } from './PlantIllustration';
import { formatDateKorean, formatShortDateKorean } from '../utils/storage';
import {
  Flower2,
  Calendar,
  Sparkles,
  Award,
  CheckCircle,
  X,
  ChevronRight
} from 'lucide-react';

interface MyGardenViewProps {
  records: GardenRecord[];
  onGoToToday: () => void;
}

export const MyGardenView: React.FC<MyGardenViewProps> = ({ records, onGoToToday }) => {
  const [selectedRecord, setSelectedRecord] = useState<GardenRecord | null>(null);

  // Stats calculation
  const totalCompleted = records.length;
  const plantCounts: Record<PlantType, number> = {
    sunflower: 0,
    tulip: 0,
    cactus: 0,
    clover: 0,
    tomato: 0
  };

  records.forEach(r => {
    if (plantCounts[r.plantType] !== undefined) {
      plantCounts[r.plantType]++;
    }
  });

  const plantOrder: PlantType[] = ['sunflower', 'tulip', 'cactus', 'clover', 'tomato'];

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats Overview */}
      <div className="bg-white/80 backdrop-blur-xs rounded-3xl p-6 md:p-8 border border-[#E3ECE0] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#4A7C59]">
              <Sparkles className="w-4 h-4 text-[#EAB308]" />
              <span>나만의 식물 온실</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#233821] mt-1 font-['Gowun_Dodum']">
              🌼 나의 정원 컬렉션
            </h2>
            <p className="text-sm text-[#5B6E57] mt-1">
              하루하루 성실하게 가꿔온 소중한 결실들이 모여 아름다운 정원을 이루고 있어요.
            </p>
          </div>

          {/* Total summary badge */}
          <div className="flex items-center gap-3 bg-[#F2F8ED] px-5 py-3 rounded-2xl border border-[#DFEAD7] shrink-0">
            <div className="w-10 h-10 rounded-xl bg-[#4A7C59] text-white flex items-center justify-center font-bold text-lg">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-[#6F826B] font-medium block">총 수집한 화분</span>
              <span className="text-xl font-extrabold text-[#233821] tabular-nums">
                {totalCompleted}개
              </span>
            </div>
          </div>
        </div>

        {/* 5 Plant species counters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-6 pt-6 border-t border-[#EAEFE5]">
          {plantOrder.map(type => {
            const meta = PLANT_DEFINITIONS[type];
            const count = plantCounts[type] || 0;

            return (
              <div
                key={type}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#F9FBF6] border border-[#E5EDE0]"
              >
                <span className="text-2xl">{meta.emoji}</span>
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-[#485C44] block truncate">
                    {meta.name}
                  </span>
                  <span className="text-xs font-bold text-[#233821] tabular-nums">
                    {count}회 완성
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Garden Pots Wooden Shelf / Lawn Display */}
      <div className="bg-gradient-to-b from-[#FAFDF7] to-[#EEF5E7] rounded-3xl p-6 md:p-8 border border-[#DEEAD4] shadow-sm relative overflow-hidden">
        {/* Soft background elements */}
        <div className="absolute top-4 right-8 text-6xl opacity-15 select-none pointer-events-none">
          🏡
        </div>

        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-[#233821] flex items-center gap-2 font-['Gowun_Dodum']">
            <span>🪴 정원 선반</span>
            <span className="text-xs font-medium text-[#6F826B]">
              (화분을 누르면 그날의 할 일 기록을 볼 수 있어요)
            </span>
          </h3>
        </div>

        {records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-5xl mb-3">🪴</span>
            <h4 className="text-base font-bold text-[#233821]">
              아직 정원에 심어진 화분이 없어요
            </h4>
            <p className="text-xs text-[#6F826B] max-w-sm mt-1 mb-5">
              오늘의 할 일을 모두 완료한 후 &lsquo;나의 정원에 심기&rsquo;를 누르면 이곳에 화분이 영구 보관됩니다!
            </p>
            <button
              onClick={onGoToToday}
              className="px-5 py-2.5 bg-[#4A7C59] hover:bg-[#3B6647] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <span>오늘의 정원으로 돌아가기</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {records.map(record => {
              const meta = PLANT_DEFINITIONS[record.plantType];

              return (
                <div
                  key={record.date}
                  onClick={() => setSelectedRecord(record)}
                  className="group flex flex-col items-center p-3 rounded-2xl bg-white/70 hover:bg-white border border-[#E3ECE0] hover:border-[#86C298] hover:shadow-md transition-all duration-200 cursor-pointer text-center relative"
                >
                  {/* Plant Graphic */}
                  <div className="w-28 h-36 flex items-center justify-center overflow-hidden">
                    <PlantIllustration
                      plantType={record.plantType}
                      growthPercent={100}
                      totalTasks={record.totalCount || 5}
                      size="shelf"
                      interactive={false}
                      showPotDetails={true}
                    />
                  </div>

                  {/* Plant Label & Date */}
                  <div className="mt-2 w-full pt-2 border-t border-[#EAEFE5]">
                    <div className="flex items-center justify-center gap-1 text-xs font-bold text-[#233821]">
                      <span>{meta.emoji}</span>
                      <span>{meta.name}</span>
                    </div>
                    <span className="text-[11px] font-medium text-[#72856F] block mt-0.5">
                      {formatShortDateKorean(record.date)}
                    </span>
                    <span className="text-[10px] text-[#4A7C59] bg-[#EAF5E4] px-1.5 py-0.5 rounded-full inline-block mt-1 font-semibold">
                      {record.completedCount}/{record.totalCount} 완료
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-md bg-[#FCFDF9] rounded-3xl p-6 shadow-2xl border border-[#DDE7D6]">
            {/* Close button */}
            <button
              onClick={() => setSelectedRecord(null)}
              className="absolute top-4 right-4 p-2 text-[#7F937B] hover:text-[#233821] hover:bg-[#EEF5E9] rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header with Plant Meta */}
            <div className="flex items-center gap-3">
              <span className="text-3xl">
                {PLANT_DEFINITIONS[selectedRecord.plantType]?.emoji}
              </span>
              <div>
                <h3 className="text-lg font-bold text-[#233821] font-['Gowun_Dodum']">
                  {PLANT_DEFINITIONS[selectedRecord.plantType]?.name}
                </h3>
                <span className="text-xs text-[#6F826B] flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-[#4A7C59]" />
                  {formatDateKorean(selectedRecord.date)}
                </span>
              </div>
            </div>

            {/* Plant Big Illustration Preview */}
            <div className="my-3 flex justify-center bg-[#F3F8EE] rounded-2xl p-2 border border-[#E3EDE0]">
              <div className="w-36 h-44 flex items-center justify-center">
                <PlantIllustration
                  plantType={selectedRecord.plantType}
                  growthPercent={100}
                  totalTasks={selectedRecord.totalCount}
                  size="md"
                  interactive={true}
                  showPotDetails={true}
                />
              </div>
            </div>

            {/* Completed Task Summary */}
            <div className="mt-4">
              <h4 className="text-xs font-bold text-[#4A7C59] mb-2 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>그날 완료한 할 일 목록 ({selectedRecord.completedCount}개)</span>
              </h4>

              {selectedRecord.tasksSummary && selectedRecord.tasksSummary.length > 0 ? (
                <ul className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {selectedRecord.tasksSummary.map((task, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-[#2D3F2B] bg-[#F7FAF4] px-3 py-2 rounded-xl border border-[#E5ECE0] flex items-center gap-2"
                    >
                      <span className="text-[#4A7C59] font-bold">✓</span>
                      <span className="truncate">{task}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-[#81947D] italic bg-[#F7FAF4] p-3 rounded-xl border border-[#E5ECE0]">
                  저장된 세부 할 일 내용이 없습니다.
                </p>
              )}
            </div>

            <div className="mt-6 pt-3 border-t border-[#EAEFE5] flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-5 py-2 text-xs font-bold text-white bg-[#4A7C59] hover:bg-[#3B6647] rounded-xl transition-all shadow-xs"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
