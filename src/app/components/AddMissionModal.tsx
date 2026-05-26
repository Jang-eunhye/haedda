'use client';

import { useState } from 'react';
import { Mission } from '../types';

const CONTENT_MAX = 50;

interface Props {
  onClose: () => void;
  onAdd: (mission: Omit<Mission, 'id' | 'completed'>) => void;
}

export default function AddMissionModal({ onClose, onAdd }: Props) {
  const [content, setContent] = useState('');
  const [deadline, setDeadline] = useState('');
  const [stickerCount, setStickerCount] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !deadline) return;
    onAdd({ content: content.trim(), deadline, stickerCount });
  };

  const adjustSticker = (delta: number) => {
    setStickerCount(prev => Math.max(1, Math.min(10, prev + delta)));
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-end justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-t-3xl p-6 pb-10"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
        <h3 className="text-lg font-bold text-gray-800 mb-5">새 미션</h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">미션 내용</label>
            <div className="relative">
              <textarea
                value={content}
                onChange={e => setContent(e.target.value.slice(0, CONTENT_MAX))}
                placeholder="미션 내용을 입력해주세요"
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
              <span
                className={`absolute bottom-2.5 right-3 text-xs ${
                  content.length >= CONTENT_MAX ? 'text-red-400' : 'text-gray-300'
                }`}
              >
                {content.length}/{CONTENT_MAX}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">기한</label>
            <input
              type="datetime-local"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">스티커 개수</label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => adjustSticker(-1)}
                disabled={stickerCount <= 1}
                className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 font-bold text-lg hover:bg-gray-200 transition-colors disabled:opacity-30"
              >
                −
              </button>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl">⭐</span>
                <span className="text-xl font-bold text-amber-500 w-6 text-center">{stickerCount}</span>
              </div>
              <button
                type="button"
                onClick={() => adjustSticker(1)}
                disabled={stickerCount >= 10}
                className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 font-bold text-lg hover:bg-gray-200 transition-colors disabled:opacity-30"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-sm text-gray-500 font-medium hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!content.trim() || !deadline}
              className="flex-1 py-3 rounded-xl bg-amber-500 text-white text-sm font-semibold disabled:opacity-40 hover:bg-amber-600 transition-colors"
            >
              추가하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
