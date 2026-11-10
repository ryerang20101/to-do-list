import React, { useState, useEffect } from 'react';
import { CalendarEventItem, fetchTodayCalendarEvents } from '../utils/googleCalendar';
import { Calendar, Check, X, Loader2, Sparkles, AlertCircle, ArrowDownToLine } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface CalendarSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  accessToken: string | null;
  targetDateStr: string;
  onImportTasks: (tasks: string[]) => void;
  onRequireAuth: () => void;
}

export const CalendarSyncModal: React.FC<CalendarSyncModalProps> = ({
  isOpen,
  onClose,
  accessToken,
  targetDateStr,
  onImportTasks,
  onRequireAuth
}) => {
  const [events, setEvents] = useState<CalendarEventItem[]>([]);
  const [selectedEventIds, setSelectedEventIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    if (!accessToken) {
      setErrorMsg('구글 계정 로그인이 필요합니다.');
      return;
    }

    const loadEvents = async () => {
      setIsLoading(true);
      setErrorMsg(null);
      try {
        const fetched = await fetchTodayCalendarEvents(accessToken, targetDateStr);
        setEvents(fetched);
        // Default: select all fetched events
        setSelectedEventIds(new Set(fetched.map(e => e.id)));
      } catch (err: any) {
        console.error('Failed to fetch calendar events', err);
        setErrorMsg('구글 캘린더 일정을 불러오는 중 오류가 발생했습니다. 권한을 확인해주세요.');
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, [isOpen, accessToken, targetDateStr]);

  if (!isOpen) return null;

  const toggleSelect = (id: string) => {
    setSelectedEventIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedEventIds.size === events.length) {
      setSelectedEventIds(new Set());
    } else {
      setSelectedEventIds(new Set(events.map(e => e.id)));
    }
  };

  const handleImport = () => {
    const tasksToImport = events
      .filter(e => selectedEventIds.has(e.id))
      .map(e => {
        if (!e.isAllDay && e.start) {
          try {
            const timeStr = new Date(e.start).toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            });
            return `[${timeStr}] ${e.summary}`;
          } catch {
            return e.summary;
          }
        }
        return e.summary;
      });

    if (tasksToImport.length > 0) {
      onImportTasks(tasksToImport);
      soundManager.playAdd();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#FCFDF9] rounded-3xl p-6 md:p-7 shadow-2xl border border-[#DCE7D5]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#7F937B] hover:text-[#233821] hover:bg-[#EEF5E9] rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 text-xs font-bold text-[#4A7C59]">
          <Calendar className="w-4 h-4 text-[#4A7C59]" />
          <span>Google Calendar 동기화</span>
        </div>
        <h3 className="text-xl font-bold text-[#233821] mt-1 font-['Gowun_Dodum']">
          📅 오늘 구글 캘린더 일정 가져오기
        </h3>
        <p className="text-xs text-[#5B6E57] mt-1">
          구글 캘린더에 등록된 오늘 일정을 선택하여 &lsquo;오늘의 작은 정원&rsquo; 할 일 목록으로 불러옵니다.
        </p>

        {/* Not logged in State */}
        {!accessToken ? (
          <div className="my-6 p-6 rounded-2xl bg-[#F6F9F2] border border-[#DEEAD4] text-center space-y-3">
            <span className="text-3xl block">🔒</span>
            <p className="text-sm font-bold text-[#233821]">
              구글 계정 연결이 필요합니다
            </p>
            <p className="text-xs text-[#6F826B] max-w-sm mx-auto">
              구글 캘린더 일정을 안전하게 조회하려면 먼저 Google 계정으로 로그인해 주세요.
            </p>
            <button
              onClick={() => {
                onClose();
                onRequireAuth();
              }}
              className="mt-2 px-5 py-2.5 bg-[#4A7C59] hover:bg-[#3B6647] text-white text-xs font-bold rounded-xl shadow-xs transition-all"
            >
              Google 계정으로 로그인하기
            </button>
          </div>
        ) : isLoading ? (
          <div className="my-10 flex flex-col items-center justify-center gap-2 text-[#4A7C59]">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-xs font-semibold">구글 캘린더에서 오늘의 일정을 불러오는 중...</span>
          </div>
        ) : errorMsg ? (
          <div className="my-6 p-4 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] text-center space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#991B1B]">
              <AlertCircle className="w-4 h-4 text-[#DC2626]" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={onRequireAuth}
              className="text-xs font-bold text-[#DC2626] underline hover:text-[#991B1B]"
            >
              다시 로그인하여 권한 부여하기
            </button>
          </div>
        ) : events.length === 0 ? (
          <div className="my-8 p-6 rounded-2xl bg-[#F7FAF4] border border-[#E3ECE0] text-center">
            <span className="text-3xl block mb-2">🌿</span>
            <p className="text-sm font-bold text-[#233821]">
              오늘 구글 캘린더에 예정된 일정이 없습니다
            </p>
            <p className="text-xs text-[#72856E] mt-1">
              구글 캘린더에 새 일정을 등록하거나, 아래 입력창에서 직접 할 일을 추가해보세요.
            </p>
          </div>
        ) : (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-[#6F826B] pb-2 border-b border-[#EAEFE5]">
              <span className="font-semibold">
                총 {events.length}개의 일정 중 {selectedEventIds.size}개 선택됨
              </span>
              <button
                onClick={toggleSelectAll}
                className="text-xs font-semibold text-[#4A7C59] hover:underline"
              >
                {selectedEventIds.size === events.length ? '선택 해제' : '모두 선택'}
              </button>
            </div>

            {/* Scrollable Event List */}
            <div className="max-h-60 overflow-y-auto mt-2 space-y-2 pr-1">
              {events.map(event => {
                const isSelected = selectedEventIds.has(event.id);
                const timeLabel = !event.isAllDay && event.start
                  ? new Date(event.start).toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    })
                  : '종일';

                return (
                  <div
                    key={event.id}
                    onClick={() => toggleSelect(event.id)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#F2F8ED] border-[#86C298]'
                        : 'bg-white border-[#E3ECE0] hover:bg-[#F9FCF7]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-[#4A7C59] text-white'
                          : 'border border-[#A8BEA3] bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#233821] truncate">
                        {event.summary}
                      </p>
                      <span className="text-[11px] text-[#6F826B]">
                        시간: {timeLabel}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-[#EAEFE5] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#667E62] hover:bg-[#EEF5E9] rounded-xl transition-colors"
          >
            취소
          </button>
          {accessToken && events.length > 0 && (
            <button
              onClick={handleImport}
              disabled={selectedEventIds.size === 0}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-[#4A7C59] hover:bg-[#3B6647] disabled:bg-[#B7CCB4] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              <ArrowDownToLine className="w-4 h-4" />
              <span>선택한 {selectedEventIds.size}개 할 일로 추가하기</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
