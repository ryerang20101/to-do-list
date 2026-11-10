import React, { useState } from 'react';
import { TodoItem } from '../types';
import {
  Plus,
  Trash2,
  Edit3,
  Check,
  ChevronUp,
  ChevronDown,
  Sparkles,
  ListFilter,
  CheckCheck,
  Calendar,
  CalendarPlus
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface TodoListProps {
  todos: TodoItem[];
  onAddTodo: (text: string) => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onEditTodo: (id: string, newText: string) => void;
  onMoveTodo: (id: string, direction: 'up' | 'down') => void;
  onToggleAll: () => void;
  onClearCompleted: () => void;
  onOpenCalendarSync: () => void;
  onExportToCalendar: (todo: TodoItem) => void;
  hasGoogleAuth: boolean;
}

const PRESET_IDEAS = [
  '물 1컵 마시기 💧',
  '스트레칭 10분 하기 🧘',
  '책 15페이지 읽기 📖',
  '방 정리하고 환기하기 🌿',
  '고마운 사람에게 안부 전하기 💌',
  '햇볕 쬐며 산책하기 ☀️'
];

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onEditTodo,
  onMoveTodo,
  onToggleAll,
  onClearCompleted,
  onOpenCalendarSync,
  onExportToCalendar,
  hasGoogleAuth
}) => {
  const [inputText, setInputText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const handleAdd = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;
    onAddTodo(trimmed);
    setInputText('');
  };

  const startEdit = (todo: TodoItem) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = (id: string) => {
    const trimmed = editText.trim();
    if (trimmed) {
      onEditTodo(id, trimmed);
    }
    setEditingId(null);
  };

  const handleKeyDownEdit = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      saveEdit(id);
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-white/80 backdrop-blur-xs rounded-3xl p-5 md:p-6 border border-[#E3ECE0] shadow-sm">
      {/* Top Header of Todo section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EAEFE5]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg md:text-xl font-bold text-[#233821] font-['Gowun_Dodum']">
              오늘의 할 일
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EBF4E6] text-[#345E3B]">
              {completedCount} / {totalCount} 완료
            </span>
          </div>
          <p className="text-xs text-[#6F826B] mt-0.5">
            할 일을 완료할 때마다 작은 정원에 햇살과 물이 채워져요.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-[#F2F6ED] p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-white text-[#233821] shadow-xs'
                : 'text-[#6F826B] hover:text-[#233821]'
            }`}
          >
            전체 ({totalCount})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
              filter === 'active'
                ? 'bg-white text-[#233821] shadow-xs'
                : 'text-[#6F826B] hover:text-[#233821]'
            }`}
          >
            진행 중 ({totalCount - completedCount})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
              filter === 'completed'
                ? 'bg-white text-[#233821] shadow-xs'
                : 'text-[#6F826B] hover:text-[#233821]'
            }`}
          >
            완료 ({completedCount})
          </button>
        </div>
      </div>

      {/* Google Calendar Sync Bar */}
      <div className="mt-3 flex items-center justify-between p-2.5 rounded-2xl bg-gradient-to-r from-[#F0F7EB] to-[#F7FAF4] border border-[#DCE8D4]">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#4A7C59]" />
          <span className="text-xs font-bold text-[#233821]">Google Calendar</span>
        </div>
        <button
          type="button"
          onClick={onOpenCalendarSync}
          className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-[#EEF5E9] text-[#2F673B] text-xs font-bold rounded-xl border border-[#CDE5C5] transition-all cursor-pointer shadow-2xs hover:scale-102"
        >
          <Calendar className="w-3.5 h-3.5 text-[#4A7C59]" />
          <span>오늘 일정 가져오기</span>
        </button>
      </div>

      {/* Input Field */}
      <form onSubmit={handleAdd} className="mt-3 flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="오늘 꼭 하고 싶은 일을 적어보세요..."
            className="w-full pl-4 pr-10 py-3 bg-[#FAFDF7] border border-[#D5E3CE] focus:border-[#4A7C59] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#4A7C59]/15 rounded-2xl text-sm text-[#233821] placeholder:text-[#90A28D] transition-all"
          />
          {inputText && (
            <button
              type="button"
              onClick={() => setInputText('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#90A28D] hover:text-[#4A7C59]"
            >
              지우기
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="flex items-center gap-1.5 px-4 py-3 bg-[#4A7C59] hover:bg-[#3B6647] disabled:bg-[#B7CCB4] text-white text-sm font-semibold rounded-2xl transition-all shadow-xs shrink-0 cursor-pointer disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">추가</span>
        </button>
      </form>

      {/* Preset Suggestions when empty or few */}
      {todos.length < 3 && (
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs text-[#6F826B] scrollbar-none">
          <span className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-[#4A7C59]">
            <Sparkles className="w-3 h-3 text-[#EAB308]" />
            추천:
          </span>
          {PRESET_IDEAS.slice(0, 4).map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onAddTodo(preset)}
              className="shrink-0 px-2.5 py-1 bg-[#F2F7EC] hover:bg-[#E3EED9] text-[#345E3B] rounded-lg transition-colors border border-[#DEEAD4]"
            >
              + {preset}
            </button>
          ))}
        </div>
      )}

      {/* Todo Items Scrollable List */}
      <div className="flex-1 overflow-y-auto mt-4 pr-1 space-y-2 min-h-[220px]">
        {filteredTodos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center text-[#7F937B] p-6 border-2 border-dashed border-[#E3ECE0] rounded-2xl">
            <span className="text-3xl mb-2">🌱</span>
            <p className="text-sm font-semibold text-[#345E3B]">
              {filter === 'completed'
                ? '아직 완료된 할 일이 없어요. 작은 것 하나부터 시작해볼까요?'
                : filter === 'active'
                ? '남은 할 일이 없어요! 모두 완료하셨나요?'
                : '오늘 할 일을 적고 식물에게 첫 영양을 선물해보세요!'}
            </p>
            <p className="text-xs text-[#8A9C86] mt-1">
              상단의 입력창에 할 일을 적거나 추천 키워드를 톡 눌러보세요.
            </p>
          </div>
        ) : (
          filteredTodos.map((todo, index) => {
            const isEditing = editingId === todo.id;

            return (
              <div
                key={todo.id}
                className={`group relative flex items-center gap-3 p-3.5 rounded-2xl border transition-all duration-200 ${
                  todo.completed
                    ? 'bg-[#F6FAF3] border-[#DEEAD4] opacity-85'
                    : 'bg-white border-[#E4ECE1] hover:border-[#B8D5BC] hover:shadow-xs'
                }`}
              >
                {/* Custom Animated Checkbox */}
                <button
                  type="button"
                  onClick={() => onToggleTodo(todo.id)}
                  className={`w-6 h-6 rounded-xl flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                    todo.completed
                      ? 'bg-[#4A7C59] text-white shadow-xs scale-105'
                      : 'border-2 border-[#A8BEA3] hover:border-[#4A7C59] bg-[#FAFDF8]'
                  }`}
                  aria-label={todo.completed ? '완료 취소' : '할 일 완료'}
                >
                  {todo.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                {/* Content Area */}
                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      onBlur={() => saveEdit(todo.id)}
                      onKeyDown={e => handleKeyDownEdit(e, todo.id)}
                      autoFocus
                      className="w-full px-2 py-1 bg-white border border-[#4A7C59] rounded-lg text-sm text-[#233821] focus:outline-hidden"
                    />
                  ) : (
                    <span
                      onClick={() => onToggleTodo(todo.id)}
                      className={`text-sm cursor-pointer select-none transition-all block break-words ${
                        todo.completed
                          ? 'line-through text-[#82967E] decoration-[#A4BAA0]'
                          : 'text-[#233821] font-medium'
                      }`}
                    >
                      {todo.text}
                    </span>
                  )}
                </div>

                {/* Actions: Reorder, Edit, Delete */}
                <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                  {/* Order Up/Down */}
                  <div className="flex flex-col">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => onMoveTodo(todo.id, 'up')}
                      className="p-0.5 text-[#8A9C86] hover:text-[#233821] disabled:opacity-20 transition-colors"
                      title="위로 이동"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === filteredTodos.length - 1}
                      onClick={() => onMoveTodo(todo.id, 'down')}
                      className="p-0.5 text-[#8A9C86] hover:text-[#233821] disabled:opacity-20 transition-colors"
                      title="아래로 이동"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Export to Calendar button */}
                  <button
                    type="button"
                    onClick={() => onExportToCalendar(todo)}
                    className="p-1.5 text-[#8A9C86] hover:text-[#2563EB] hover:bg-[#EFF6FF] rounded-lg transition-colors"
                    title="구글 캘린더에 일정 등록"
                  >
                    <CalendarPlus className="w-3.5 h-3.5" />
                  </button>

                  {/* Edit button */}
                  <button
                    type="button"
                    onClick={() => startEdit(todo)}
                    className="p-1.5 text-[#8A9C86] hover:text-[#3B6647] hover:bg-[#EEF5E9] rounded-lg transition-colors"
                    title="수정"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => onDeleteTodo(todo.id)}
                    className="p-1.5 text-[#8A9C86] hover:text-[#DC2626] hover:bg-[#FEE2E2] rounded-lg transition-colors"
                    title="삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Batch Actions */}
      {todos.length > 0 && (
        <div className="mt-4 pt-3 border-t border-[#EAEFE5] flex items-center justify-between text-xs text-[#6F826B]">
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleAll}
              className="flex items-center gap-1 hover:text-[#233821] font-semibold transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5 text-[#4A7C59]" />
              <span>{completedCount === totalCount ? '모두 미완료로 변경' : '모두 완료하기'}</span>
            </button>
            {completedCount > 0 && (
              <button
                onClick={onClearCompleted}
                className="hover:text-[#DC2626] transition-colors"
              >
                완료 항목 정리
              </button>
            )}
          </div>
          <span className="font-semibold tabular-nums text-[#345E3B]">
            {progressPercent}% 달성
          </span>
        </div>
      )}
    </div>
  );
};
