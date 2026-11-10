import React from 'react';
import { Calendar, AlertCircle, X } from 'lucide-react';

interface CalendarExportConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  taskTitle: string;
  targetDateStr: string;
  isSaving: boolean;
}

export const CalendarExportConfirmModal: React.FC<CalendarExportConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  taskTitle,
  targetDateStr,
  isSaving
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-[#FCFDF9] rounded-3xl p-6 shadow-2xl border border-[#DCE7D5]">
        <button
          onClick={onClose}
          disabled={isSaving}
          className="absolute top-4 right-4 p-2 text-[#7F937B] hover:text-[#233821] hover:bg-[#EEF5E9] rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-[#4A7C59]">
          <Calendar className="w-4 h-4 text-[#4A7C59]" />
          <span>Google Calendar 일정 등록 확인</span>
        </div>

        <h3 className="text-lg font-bold text-[#233821] mt-2 font-['Gowun_Dodum']">
          구글 캘린더에 일정을 추가하시겠습니까?
        </h3>

        <div className="my-4 p-4 rounded-2xl bg-[#F4F8EE] border border-[#DEEAD4] space-y-1.5">
          <span className="text-[11px] font-bold text-[#4A7C59] block">등록할 일정 정보</span>
          <p className="text-sm font-bold text-[#233821] break-words">
            📌 {taskTitle}
          </p>
          <p className="text-xs text-[#6F826B]">
            📅 날짜: {targetDateStr} (종일 일정)
          </p>
        </div>

        <p className="text-xs text-[#7A8E76] leading-relaxed">
          승인하시면 내 Google 계정의 기본 캘린더에 새 일정으로 저장됩니다.
        </p>

        <div className="mt-6 flex gap-2">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 py-2.5 text-xs font-semibold text-[#576B53] bg-white hover:bg-[#EEF5E9] border border-[#DCE7D5] rounded-xl transition-colors cursor-pointer"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            disabled={isSaving}
            className="flex-1 py-2.5 text-xs font-bold text-white bg-[#4A7C59] hover:bg-[#3B6647] disabled:bg-[#B7CCB4] rounded-xl shadow-xs transition-all cursor-pointer"
          >
            {isSaving ? '캘린더에 등록 중...' : '확인 및 캘린더 등록'}
          </button>
        </div>
      </div>
    </div>
  );
};
