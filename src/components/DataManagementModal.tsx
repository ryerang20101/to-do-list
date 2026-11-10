import React, { useRef, useState } from 'react';
import { storage } from '../utils/storage';
import { Download, Upload, Trash2, X, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface DataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
}

export const DataManagementModal: React.FC<DataManagementModalProps> = ({
  isOpen,
  onClose,
  onDataChanged
}) => {
  const [confirmReset, setConfirmReset] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; error?: boolean } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const showFeedback = (text: string, error = false) => {
    setFeedbackMsg({ text, error });
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  // Export JSON file
  const handleExport = () => {
    try {
      const json = storage.exportAllData();
      const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `my-little-garden-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      soundManager.playAdd();
      showFeedback('정원 기록 데이터가 안전하게 다운로드되었습니다.');
    } catch (e) {
      showFeedback('데이터 내보내기에 실패했습니다.', true);
    }
  };

  // Import JSON file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        const success = storage.importAllData(content);
        if (success) {
          soundManager.playCelebration();
          showFeedback('백업 파일로부터 정원 기록이 성공적으로 복원되었습니다!');
          onDataChanged();
          setTimeout(() => onClose(), 1000);
        } else {
          showFeedback('유효하지 않은 백업 파일 형식이거나 파일이 손상되었습니다.', true);
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Reset all data
  const handleReset = () => {
    storage.resetAll();
    setConfirmReset(false);
    showFeedback('모든 기록이 초기화되었습니다.');
    onDataChanged();
    setTimeout(() => onClose(), 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-[#FCFDF9] rounded-3xl p-6 md:p-7 shadow-2xl border border-[#DDE7D6]">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#7F937B] hover:text-[#233821] hover:bg-[#EEF5E9] rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-[#233821] font-['Gowun_Dodum']">
          ⚙️ 정원 데이터 관리
        </h3>
        <p className="text-xs text-[#5B6E57] mt-1">
          정원 일지와 할 일 기록을 파일로 안전하게 백업하거나 기기 간에 이전할 수 있습니다.
        </p>

        {/* Feedback message banner */}
        {feedbackMsg && (
          <div
            className={`mt-4 p-3 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
              feedbackMsg.error
                ? 'bg-[#FEE2E2] text-[#991B1B] border border-[#FCA5A5]'
                : 'bg-[#DCFCE7] text-[#166534] border border-[#86EFAC]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        <div className="mt-5 space-y-3">
          {/* Export button */}
          <button
            onClick={handleExport}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-white hover:bg-[#F8FAF5] border border-[#DEEAD4] transition-all cursor-pointer group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EAF5E4] text-[#4A7C59] flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-[#233821] block">
                  데이터 백업 내보내기 (JSON)
                </span>
                <span className="text-xs text-[#6F826B]">
                  현재까지의 모든 할 일 및 정원 수집 기록을 저장
                </span>
              </div>
            </div>
          </button>

          {/* Import button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-white hover:bg-[#F8FAF5] border border-[#DEEAD4] transition-all cursor-pointer group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EBF3FC] text-[#2563EB] flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-[#233821] block">
                  데이터 가져오기 및 복원
                </span>
                <span className="text-xs text-[#6F826B]">
                  저장해 둔 JSON 백업 파일에서 기록 복원
                </span>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </button>

          {/* Reset section */}
          <div className="pt-3 border-t border-[#EAEFE5]">
            {!confirmReset ? (
              <button
                onClick={() => setConfirmReset(true)}
                className="w-full flex items-center justify-center gap-2 p-3 text-xs font-semibold text-[#DC2626] hover:bg-[#FEE2E2]/60 rounded-xl transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>모든 기록 초기화하기</span>
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] text-center space-y-3">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#991B1B]">
                  <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
                  <span>정말 모든 정원 기록을 삭제하시겠습니까?</span>
                </div>
                <p className="text-[11px] text-[#7F1D1D] leading-relaxed">
                  삭제 후에는 되돌릴 수 없습니다. 필요하시다면 먼저 백업 파일을 내보내주세요.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmReset(false)}
                    className="flex-1 py-2 text-xs font-bold text-[#4B5563] bg-white border border-[#D1D5DB] rounded-xl hover:bg-gray-50"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 py-2 text-xs font-bold text-white bg-[#DC2626] rounded-xl hover:bg-[#B91C1C]"
                  >
                    확인 및 삭제
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-[#EAEFE5] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-[#4A7C59] hover:bg-[#3B6647] rounded-xl transition-all shadow-xs"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
