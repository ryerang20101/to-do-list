import React, { useEffect } from 'react';
import { PlantType, PLANT_DEFINITIONS } from '../types';
import { PlantIllustration } from './PlantIllustration';
import { Sparkles, Flower2, CheckCircle2, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/audio';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  plantType: PlantType;
  alreadySaved: boolean;
  onSaveToGarden: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  onClose,
  plantType,
  alreadySaved,
  onSaveToGarden
}) => {
  useEffect(() => {
    if (isOpen) {
      soundManager.playCelebration();

      // Launch cheerful celebratory flower/star confetti
      const end = Date.now() + 1.2 * 1000;
      const colors = ['#FDE047', '#EC4899', '#4ADE80', '#60A5FA', '#F97316'];

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const plantMeta = PLANT_DEFINITIONS[plantType];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#FCFDF9] rounded-3xl p-6 md:p-8 shadow-2xl border border-[#D5E6CC] text-center overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#768A72] hover:text-[#233821] hover:bg-[#EEF5E9] rounded-full transition-colors"
          aria-label="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Floating background celebratory circles */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#FEF08A]/40 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-[#BBEFCE]/50 rounded-full blur-2xl pointer-events-none" />

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5E1] text-[#2F673B] text-xs font-bold tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5 text-[#EAB308]" />
          <span>목표 100% 달성 완료</span>
        </div>

        {/* Main Celebration Title */}
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#1B3A1E] mt-3 font-['Gowun_Dodum'] leading-snug">
          🎉 오늘의 정원이 완성되었어요!
        </h2>
        <p className="text-sm font-semibold text-[#4A7C59] mt-1">
          오늘의 모든 할 일을 멋지게 완료했어요!
        </p>

        {/* Potted Plant Full Bloom Showcase */}
        <div className="my-2 flex justify-center">
          <div className="relative w-48 h-56 flex items-center justify-center">
            <PlantIllustration
              plantType={plantType}
              growthPercent={100}
              totalTasks={5}
              size="md"
              interactive={true}
              showPotDetails={true}
            />
          </div>
        </div>

        {/* Emotional quote */}
        <div className="p-4 rounded-2xl bg-[#F3F8EE] border border-[#DEEAD4] text-xs md:text-sm text-[#385637] font-medium leading-relaxed">
          <p>
            &ldquo;당신의 작은 실천이 모여 아름다운 {plantMeta.name}을(를) 피워냈어요.&rdquo;
          </p>
          <p className="text-[11px] text-[#698265] mt-1">
            오늘 하루도 정말 수고 많으셨어요. 정성스런 결실을 나의 정원에 담아보세요.
          </p>
        </div>

        {/* Action Button: 나의 정원에 심기 */}
        <div className="mt-6 flex flex-col gap-2">
          {alreadySaved ? (
            <div className="flex items-center justify-center gap-2 py-3 px-4 bg-[#E7F5E2] text-[#2B6337] rounded-2xl text-sm font-bold border border-[#CDE5C5]">
              <CheckCircle2 className="w-4 h-4 text-[#2B6337]" />
              <span>이미 오늘 완성한 {plantMeta.name}이(가) 정원에 심어져 있어요!</span>
            </div>
          ) : (
            <button
              onClick={onSaveToGarden}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-[#4A7C59] hover:bg-[#3B6647] text-white rounded-2xl text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Flower2 className="w-4 h-4" />
              <span>🌷 나의 정원에 심기</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs font-semibold text-[#667E62] hover:text-[#233821] hover:bg-[#EEF5E9] rounded-xl transition-colors"
          >
            정원 둘러보기
          </button>
        </div>
      </div>
    </div>
  );
};
