'use client';

import React from 'react';
import { Zap, HeartPulse } from 'lucide-react';
import { EventTab } from './types';

interface EventTabsProps {
  activeTab: EventTab;
  onTabChange: (tab: EventTab) => void;
}

export function EventTabs({ activeTab, onTabChange }: EventTabsProps) {
  return (
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="inline-flex bg-gray-100 rounded-xl p-1.5 my-3">
            <button
              onClick={() => onTabChange('fun-run')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm md:text-base transition-all duration-300 ${
                activeTab === 'fun-run'
                  ? 'bg-gradient-to-r from-[#043e75] to-[#4e8fc0] text-white shadow-lg'
                  : 'text-gray-600 hover:text-[#043e75] hover:bg-white/50'
              }`}
            >
              <Zap className="h-5 w-5" />
              <span>Fun Run 3K</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                activeTab === 'fun-run' ? 'bg-white/20' : 'bg-[#043e75]/10 text-[#043e75]'
              }`}>
                Rp 100rb
              </span>
            </button>
            <button
              onClick={() => onTabChange('senam')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm md:text-base transition-all duration-300 ${
                activeTab === 'senam'
                  ? 'bg-gradient-to-r from-[#4CAF50] to-[#2E7D32] text-white shadow-lg'
                  : 'text-gray-600 hover:text-[#4CAF50] hover:bg-white/50'
              }`}
            >
              <HeartPulse className="h-5 w-5" />
              <span>Senam Sehat</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-black ${
                activeTab === 'senam' ? 'bg-white/20' : 'bg-green-100 text-green-700'
              }`}>
                GRATIS
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
