import React from 'react';
import { PlantType, PLANT_DEFINITIONS } from '../types';
import { PlantIllustration } from './PlantIllustration';
import { Check, X, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface PlantSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlant: PlantType;
  onSelectPlant: (plant: PlantType) => void;
}

export const PlantSelectorModal: React.FC<PlantSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedPlant,
  onSelectPlant
}) => {
  if (!isOpen) return null;

  const plants: PlantType[] = ['sunflower', 'tulip', 'cactus', 'clover', 'tomato'];

  const handleSelect = (plant: PlantType) => {
    onSelectPlant(plant);
    soundManager.playAdd();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#FCFDF9] rounded-3xl p-6 md:p-8 shadow-2xl border border-[#E2EBD8] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#EAEFE5]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#4A7C59]">
              <Sparkles className="w-4 h-4 text-[#EAB308]" />
              <span>오늘의 식물 선택</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-[#233821] mt-1 font-['Gowun_Dodum']">
              오늘 정원에서 어떤 친구를 키워볼까요?
            </h2>
            <p className="text-sm text-[#5B6E57] mt-1">
              할 일을 하나씩 완료할 때마다 선택한 식물이 새싹에서 아름다운 꽃이나 열매로 성장해요.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#7A8C76] hover:text-[#233821] hover:bg-[#EEF4E8] rounded-full transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Plant Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {plants.map(plantKey => {
            const plant = PLANT_DEFINITIONS[plantKey];
            const isCurrent = selectedPlant === plantKey;

            return (
              <div
                key={plantKey}
                onClick={() => handleSelect(plantKey)}
                className={`group relative p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer text-left flex gap-4 items-center ${
                  isCurrent
                    ? 'border-[#4A7C59] bg-[#F2F8ED] shadow-md ring-2 ring-[#4A7C59]/20'
                    : 'border-[#E3ECE0] bg-white hover:border-[#86C298] hover:bg-[#F9FCF7] hover:shadow-xs'
                }`}
              >
                {/* Plant Mini Preview (Show bloom state) */}
                <div className="w-20 h-24 shrink-0 flex items-center justify-center bg-[#F4F8F0] rounded-xl overflow-hidden border border-[#E3ECE0]">
                  <PlantIllustration
                    plantType={plantKey}
                    growthPercent={100}
                    totalTasks={5}
                    size="shelf"
                    interactive={false}
                    showPotDetails={false}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-[#233821] flex items-center gap-1.5 font-['Gowun_Dodum']">
                      <span>{plant.emoji}</span>
                      <span>{plant.name}</span>
                    </h3>
                    {isCurrent && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-[#2D6A4F] bg-[#D8F3DC] px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" />
                        선택됨
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#6A7F66] mt-1 line-clamp-1 italic font-medium">
                    {plant.tagline}
                  </p>
                  <p className="text-xs text-[#7B8B77] mt-1.5 line-clamp-2 leading-relaxed">
                    {plant.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer tip */}
        <div className="mt-6 pt-4 border-t border-[#EAEFE5] flex items-center justify-between text-xs text-[#72836E]">
          <span>💡 식물을 변경해도 오늘 작성한 할 일 목록과 체크 상태는 안전하게 유지됩니다.</span>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-[#4A7C59] hover:bg-[#3B6647] rounded-xl transition-all shadow-xs"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
