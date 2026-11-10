import React, { useState } from 'react';
import { PlantType, PLANT_DEFINITIONS, GardenRecord } from '../types';
import { PlantIllustration } from './PlantIllustration';
import { BookOpen, Sparkles, Award, Eye, Check } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface PlantEncyclopediaViewProps {
  records: GardenRecord[];
  onSelectPlantForToday: (plant: PlantType) => void;
  activePlantType: PlantType;
}

export const PlantEncyclopediaView: React.FC<PlantEncyclopediaViewProps> = ({
  records,
  onSelectPlantForToday,
  activePlantType
}) => {
  const [selectedPlant, setSelectedPlant] = useState<PlantType>('sunflower');
  const [previewStagePercent, setPreviewStagePercent] = useState<number>(100);

  const plantKeys: PlantType[] = ['sunflower', 'tulip', 'cactus', 'clover', 'tomato'];

  // Count completions
  const completionCounts: Record<PlantType, number> = {
    sunflower: 0,
    tulip: 0,
    cactus: 0,
    clover: 0,
    tomato: 0
  };
  records.forEach(r => {
    if (completionCounts[r.plantType] !== undefined) {
      completionCounts[r.plantType]++;
    }
  });

  const currentMeta = PLANT_DEFINITIONS[selectedPlant];
  const count = completionCounts[selectedPlant] || 0;

  // Stages array for slider: 0%, 20%, 40%, 60%, 80%, 100%
  const stageSteps = [
    { percent: 0, label: '0% 씨앗', desc: currentMeta.growthStory.stage0 },
    { percent: 20, label: '20% 새싹', desc: currentMeta.growthStory.stage1 },
    { percent: 40, label: '40% 어린 잎', desc: currentMeta.growthStory.stage2 },
    { percent: 60, label: '60% 줄기와 망울', desc: currentMeta.growthStory.stage3 },
    { percent: 80, label: '80% 개화 직전', desc: currentMeta.growthStory.stage4 },
    { percent: 100, label: '100% 만개/결실', desc: currentMeta.growthStory.stage5 }
  ];

  const currentStep =
    stageSteps.find(s => s.percent === previewStagePercent) || stageSteps[5];

  const handleStepClick = (pct: number) => {
    setPreviewStagePercent(pct);
    soundManager.playWater();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white/80 backdrop-blur-xs rounded-3xl p-6 md:p-8 border border-[#E3ECE0] shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-[#4A7C59]">
          <BookOpen className="w-4 h-4 text-[#4A7C59]" />
          <span>작은 식물 사전</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#233821] mt-1 font-['Gowun_Dodum']">
          📖 식물 도감
        </h2>
        <p className="text-sm text-[#5B6E57] mt-1">
          정원에서 자라는 5가지 식물의 성장 이야기와 단계별 변화를 자유롭게 살펴보세요.
        </p>

        {/* 5 Plant Tab Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-6 pt-6 border-t border-[#EAEFE5]">
          {plantKeys.map(key => {
            const meta = PLANT_DEFINITIONS[key];
            const isSelected = selectedPlant === key;
            const collectedCount = completionCounts[key] || 0;

            return (
              <button
                key={key}
                onClick={() => {
                  setSelectedPlant(key);
                  setPreviewStagePercent(100);
                  soundManager.playAdd();
                }}
                className={`flex flex-col items-center p-3 rounded-2xl border transition-all text-center cursor-pointer ${
                  isSelected
                    ? 'border-[#4A7C59] bg-[#F2F8ED] shadow-sm ring-2 ring-[#4A7C59]/20'
                    : 'border-[#E2ECE0] bg-white hover:bg-[#F9FCF7]'
                }`}
              >
                <span className="text-2xl mb-1">{meta.emoji}</span>
                <span className="text-xs font-bold text-[#233821]">{meta.name}</span>
                <span className="text-[10px] text-[#6F826B] mt-0.5 font-medium">
                  {collectedCount > 0 ? `${collectedCount}회 수집됨` : '미수집'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Stage Explorer for Selected Plant */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white/90 backdrop-blur-xs rounded-3xl p-6 md:p-8 border border-[#E3ECE0] shadow-sm">
        {/* Left: Plant SVG Render with Stage preview */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center bg-gradient-to-b from-[#F7FAF4] to-[#EEF5E7] rounded-3xl p-6 border border-[#DEEAD4] relative overflow-hidden">
          <div className="w-full flex items-center justify-between text-xs text-[#52684E] mb-2 font-medium">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-[#4A7C59]" />
              단계별 모습 관찰
            </span>
            <span className="font-bold text-[#233821] tabular-nums">
              {currentStep.label}
            </span>
          </div>

          {/* Plant Graphic */}
          <div className="w-full max-w-[280px] h-[340px] flex items-center justify-center">
            <PlantIllustration
              plantType={selectedPlant}
              growthPercent={previewStagePercent}
              totalTasks={5}
              size="lg"
              interactive={true}
              showPotDetails={true}
            />
          </div>

          <p className="text-[11px] text-[#7A8E76] text-center mt-2 italic">
            * 화분을 톡 클릭하면 식물이 부드럽게 반응해요!
          </p>
        </div>

        {/* Right: Details & Stage Slider */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div>
            {/* Header info */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#4A7C59]">
                  {currentMeta.scientificName}
                </span>
                <h3 className="text-2xl font-extrabold text-[#233821] font-['Gowun_Dodum'] flex items-center gap-2 mt-0.5">
                  <span>{currentMeta.emoji}</span>
                  <span>{currentMeta.name}</span>
                </h3>
                <p className="text-sm font-semibold text-[#52704E] mt-1">
                  &ldquo;{currentMeta.tagline}&rdquo;
                </p>
              </div>

              {/* Completion badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EBF5E6] text-[#2F673B] text-xs font-bold shrink-0">
                <Award className="w-4 h-4 text-[#EAB308]" />
                <span>{count}회 완성</span>
              </div>
            </div>

            <p className="text-xs md:text-sm text-[#4E634A] mt-3 leading-relaxed">
              {currentMeta.description}
            </p>

            {/* Stage Selector Buttons / Slider */}
            <div className="mt-6 pt-5 border-t border-[#EAEFE5]">
              <label className="text-xs font-bold text-[#233821] flex items-center gap-1.5 mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-[#EAB308]" />
                <span>성장 단계 미리보기 ({previewStagePercent}%)</span>
              </label>

              {/* Step buttons */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {stageSteps.map(step => (
                  <button
                    key={step.percent}
                    onClick={() => handleStepClick(step.percent)}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      previewStagePercent === step.percent
                        ? 'bg-[#4A7C59] text-white shadow-xs'
                        : 'bg-[#F2F6ED] text-[#556D52] hover:bg-[#E3EDE0]'
                    }`}
                  >
                    {step.label}
                  </button>
                ))}
              </div>

              {/* Stage description box */}
              <div className="mt-4 p-4 rounded-2xl bg-[#F4F8EE] border border-[#DCE8D4]">
                <span className="text-[11px] font-bold text-[#4A7C59] block">
                  🌱 {currentStep.label}의 이야기
                </span>
                <p className="text-xs md:text-sm text-[#354D31] font-medium mt-1 leading-relaxed">
                  {currentStep.desc}
                </p>
              </div>
            </div>
          </div>

          {/* Plant selection for today action */}
          <div className="pt-4 border-t border-[#EAEFE5] flex items-center justify-between">
            <span className="text-xs text-[#6F826B]">
              오늘 이 식물을 정원에서 키우고 싶으신가요?
            </span>
            {activePlantType === selectedPlant ? (
              <span className="flex items-center gap-1 text-xs font-bold text-[#2D6A4F] bg-[#D8F3DC] px-3.5 py-2 rounded-xl">
                <Check className="w-3.5 h-3.5" />
                현재 선택된 식물
              </span>
            ) : (
              <button
                onClick={() => {
                  onSelectPlantForToday(selectedPlant);
                  soundManager.playAdd();
                }}
                className="px-4 py-2 bg-[#4A7C59] hover:bg-[#3B6647] text-white text-xs font-bold rounded-xl transition-all shadow-xs"
              >
                오늘의 식물로 선택하기
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
