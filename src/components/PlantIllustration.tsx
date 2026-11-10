import React, { useState } from 'react';
import { PlantType } from '../types';
import { soundManager } from '../utils/audio';

interface PlantIllustrationProps {
  plantType: PlantType;
  growthPercent: number; // 0 to 100
  totalTasks: number;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'shelf';
  showPotDetails?: boolean;
}

export function getGrowthStage(percent: number, totalTasks: number): 0 | 1 | 2 | 3 | 4 | 5 {
  if (totalTasks === 0 || percent <= 0) return 0;
  if (percent >= 100) return 5;
  if (percent <= 20) return 1;
  if (percent <= 40) return 2;
  if (percent <= 60) return 3;
  return 4; // 61% ~ 99%
}

export const PlantIllustration: React.FC<PlantIllustrationProps> = ({
  plantType,
  growthPercent,
  totalTasks,
  interactive = true,
  size = 'lg',
  showPotDetails = true
}) => {
  const [isWiggling, setIsWiggling] = useState(false);
  const [floatingHeart, setFloatingHeart] = useState<{ id: number; x: number; y: number } | null>(null);

  const stage = getGrowthStage(growthPercent, totalTasks);

  const handlePlantClick = (e: React.MouseEvent) => {
    if (!interactive) return;
    setIsWiggling(true);
    soundManager.playWater();

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setFloatingHeart({ id: Date.now(), x, y });

    setTimeout(() => {
      setIsWiggling(false);
    }, 700);

    setTimeout(() => {
      setFloatingHeart(null);
    }, 1200);
  };

  // Dimensions based on size
  const sizeClasses = {
    sm: 'w-24 h-28',
    md: 'w-44 h-52',
    lg: 'w-full max-w-[340px] h-[360px] md:h-[420px]',
    shelf: 'w-28 h-32'
  }[size];

  // Continuous micro-scaling between stages for organic feel
  const microScale = 0.9 + (growthPercent / 100) * 0.18;

  return (
    <div
      onClick={handlePlantClick}
      className={`relative flex items-center justify-center select-none ${sizeClasses} ${
        interactive ? 'cursor-pointer group' : ''
      }`}
      title={interactive ? '식물을 톡 누르면 사랑을 표현해요!' : undefined}
    >
      {/* Floating heart or sparkle on click */}
      {floatingHeart && (
        <div
          className="absolute pointer-events-none z-30 text-lg md:text-2xl animate-float-up opacity-90"
          style={{ left: floatingHeart.x - 12, top: floatingHeart.y - 20 }}
        >
          {stage === 5 ? '✨' : '💚'}
        </div>
      )}

      {/* SVG Canvas */}
      <svg
        viewBox="0 0 320 380"
        className={`w-full h-full transition-transform duration-500 ease-out drop-shadow-sm ${
          isWiggling ? 'animate-plant-wiggle' : 'hover:scale-[1.02]'
        }`}
        style={{
          transformOrigin: '160px 300px'
        }}
      >
        <defs>
          {/* Pot Gradients */}
          <linearGradient id="potGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D97746" />
            <stop offset="35%" stopColor="#EA8A57" />
            <stop offset="70%" stopColor="#F59E6C" />
            <stop offset="100%" stopColor="#C46233" />
          </linearGradient>
          <linearGradient id="potRimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C46233" />
            <stop offset="50%" stopColor="#F59E6C" />
            <stop offset="100%" stopColor="#A7491D" />
          </linearGradient>
          <linearGradient id="soilGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5C3D2E" />
            <stop offset="100%" stopColor="#38241A" />
          </linearGradient>

          {/* Plant Stems & Leaves Gradients */}
          <linearGradient id="stemGreen" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38A169" />
            <stop offset="50%" stopColor="#48BB78" />
            <stop offset="100%" stopColor="#2F855A" />
          </linearGradient>
          <linearGradient id="leafGreenLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#68D391" />
            <stop offset="100%" stopColor="#2F855A" />
          </linearGradient>
          <linearGradient id="sproutGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9AE6B4" />
            <stop offset="100%" stopColor="#38A169" />
          </linearGradient>

          {/* Sunflower Gradients */}
          <linearGradient id="sunflowerCenter" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#78350F" />
            <stop offset="50%" stopColor="#451A03" />
            <stop offset="100%" stopColor="#291002" />
          </linearGradient>
          <linearGradient id="sunflowerPetal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="60%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#CA8A04" />
          </linearGradient>

          {/* Tulip Gradients */}
          <linearGradient id="tulipPetal" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F472B6" />
            <stop offset="60%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#BE185D" />
          </linearGradient>
          <linearGradient id="tulipBud" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#86EFAC" />
            <stop offset="60%" stopColor="#4ADE80" />
            <stop offset="100%" stopColor="#F472B6" />
          </linearGradient>

          {/* Cactus Gradients */}
          <linearGradient id="cactusBody" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <linearGradient id="cactusFlower" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F43F5E" />
            <stop offset="100%" stopColor="#FB7185" />
          </linearGradient>

          {/* Tomato Gradients */}
          <linearGradient id="tomatoRed" x1="30%" y1="20%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="60%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>
          <linearGradient id="tomatoGreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A3E635" />
            <stop offset="100%" stopColor="#4D7C0F" />
          </linearGradient>

          {/* Aura & Glow */}
          <radialGradient id="auraGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#FEF08A" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#FEF08A" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background Aura for Stage 5 (100% Bloom) */}
        {stage === 5 && (
          <g className="animate-pulse-gentle">
            <circle cx="160" cy="140" r="120" fill="url(#auraGlow)" />
            {/* Sparkles around completed plant */}
            <path
              d="M100 80 Q105 70 110 80 Q120 85 110 90 Q105 100 100 90 Q90 85 100 80 Z"
              fill="#FDE047"
              className="animate-spin-slow origin-[105px_85px]"
            />
            <path
              d="M220 90 Q223 83 226 90 Q233 93 226 96 Q223 103 220 96 Q213 93 220 90 Z"
              fill="#FDE047"
              className="animate-spin-slow origin-[223px_93px]"
            />
            <circle cx="90" cy="140" r="3" fill="#FDE047" opacity="0.8" />
            <circle cx="230" cy="150" r="3.5" fill="#FDE047" opacity="0.8" />
          </g>
        )}

        {/* Shadow under the pot */}
        <ellipse cx="160" cy="346" rx="72" ry="14" fill="#000000" fillOpacity="0.1" />

        {/* PLANT RENDERING GROUP (Grows upwards from soil level Y=265) */}
        <g
          style={{
            transform: `scale(${microScale})`,
            transformOrigin: '160px 270px',
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {plantType === 'sunflower' && renderSunflower(stage, growthPercent)}
          {plantType === 'tulip' && renderTulip(stage, growthPercent)}
          {plantType === 'cactus' && renderCactus(stage, growthPercent)}
          {plantType === 'clover' && renderClover(stage, growthPercent)}
          {plantType === 'tomato' && renderTomato(stage, growthPercent)}
        </g>

        {/* POT & SOIL LAYER */}
        <g id="pot-group">
          {/* Soil Mound inside pot */}
          <ellipse cx="160" cy="270" rx="66" ry="16" fill="url(#soilGrad)" />
          {/* Soil surface texture dots */}
          <circle cx="135" cy="272" r="2.5" fill="#261710" opacity="0.5" />
          <circle cx="155" cy="268" r="2" fill="#261710" opacity="0.6" />
          <circle cx="178" cy="271" r="3" fill="#261710" opacity="0.5" />
          <circle cx="195" cy="270" r="2" fill="#261710" opacity="0.4" />

          {/* Pot Body Trapezoid */}
          <path
            d="M 98 274 L 122 342 Q 160 348 198 342 L 222 274 Z"
            fill="url(#potGrad)"
            stroke="#A7491D"
            strokeWidth="1.5"
          />

          {/* Pot Rim */}
          <ellipse
            cx="160"
            cy="270"
            rx="68"
            ry="11"
            fill="url(#potRimGrad)"
            stroke="#8F3C16"
            strokeWidth="1.5"
          />
          <ellipse cx="160" cy="270" rx="65" ry="9" fill="none" stroke="#FFAE80" strokeWidth="1" opacity="0.6" />

          {/* Pot Front Highlights & Badge */}
          {showPotDetails && (
            <g>
              {/* Vertical soft highlight on pot curve */}
              <path
                d="M 148 280 L 144 336 Q 152 338 156 337 L 160 280 Z"
                fill="#FFFFFF"
                fillOpacity="0.18"
              />

              {/* Cute heart or plant badge on the pot */}
              <circle cx="160" cy="308" r="14" fill="#FFFFFF" fillOpacity="0.85" />
              <path
                d="M 160 314 C 158 311 152 305 152 302 C 152 299 155 297 158 299 C 160 300 160 302 160 302 C 160 302 160 300 162 299 C 165 297 168 299 168 302 C 168 305 162 311 160 314 Z"
                fill="#D97746"
              />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};

/* =========================================================================
   1. SUNFLOWER (해바라기)
   Stages:
   0: Seed in soil with tiny hint
   1: Twin cotyledon sprout
   2: Young stem with first true leaves
   3: Taller stem, 4 leaves + green flower bud forming
   4: Tall stem, big leaves, yellow petals unfurling around central disk
   5: Giant radiant blooming sunflower with seed spirals, glowing petals!
========================================================================= */
function renderSunflower(stage: number, percent: number) {
  switch (stage) {
    case 0:
      return (
        <g id="sunflower-seed">
          {/* Seed resting in top of soil */}
          <ellipse cx="160" cy="265" rx="7" ry="4" fill="#1C1917" stroke="#44403C" strokeWidth="1" />
          <path d="M 155 264 Q 160 263 165 264" stroke="#78716C" strokeWidth="0.8" fill="none" />
          <circle cx="160" cy="259" r="1.5" fill="#84CC16" />
        </g>
      );
    case 1:
      return (
        <g id="sunflower-sprout">
          {/* Stem */}
          <path d="M 160 268 Q 160 250 160 240" stroke="url(#stemGreen)" strokeWidth="4.5" strokeLinecap="round" />
          {/* Left cotyledon */}
          <path
            d="M 160 242 C 145 240 138 230 142 226 C 148 222 158 234 160 242 Z"
            fill="url(#sproutGradient)"
            stroke="#2F855A"
            strokeWidth="1"
          />
          {/* Right cotyledon */}
          <path
            d="M 160 242 C 175 240 182 230 178 226 C 172 222 162 234 160 242 Z"
            fill="url(#sproutGradient)"
            stroke="#2F855A"
            strokeWidth="1"
          />
        </g>
      );
    case 2:
      return (
        <g id="sunflower-young">
          {/* Stem */}
          <path d="M 160 268 Q 159 230 160 205" stroke="url(#stemGreen)" strokeWidth="6" strokeLinecap="round" />
          {/* Lower leaf left */}
          <path
            d="M 160 238 C 130 236 122 216 128 210 C 138 205 152 222 160 234 Z"
            fill="url(#leafGreenLight)"
            stroke="#276749"
            strokeWidth="1"
          />
          {/* Lower leaf right */}
          <path
            d="M 160 230 C 190 228 198 208 192 202 C 182 198 168 216 160 226 Z"
            fill="url(#leafGreenLight)"
            stroke="#276749"
            strokeWidth="1"
          />
          {/* Top budding sprout */}
          <path
            d="M 160 205 C 150 195 152 188 160 186 C 168 188 170 195 160 205 Z"
            fill="#48BB78"
            stroke="#276749"
            strokeWidth="1"
          />
        </g>
      );
    case 3:
      return (
        <g id="sunflower-growing">
          {/* Taller sturdy stem */}
          <path d="M 160 268 Q 158 200 160 160" stroke="url(#stemGreen)" strokeWidth="7" strokeLinecap="round" />
          {/* Bottom leaves */}
          <path
            d="M 159 235 C 120 235 110 205 118 198 C 132 192 148 215 159 230 Z"
            fill="url(#leafGreenLight)"
            stroke="#22543D"
            strokeWidth="1.2"
          />
          <path
            d="M 160 222 C 200 222 210 192 202 185 C 188 179 172 202 160 216 Z"
            fill="url(#leafGreenLight)"
            stroke="#22543D"
            strokeWidth="1.2"
          />
          {/* Middle leaves */}
          <path
            d="M 159 190 C 132 185 125 165 135 160 C 145 156 155 174 159 185 Z"
            fill="url(#leafGreenLight)"
            stroke="#22543D"
            strokeWidth="1.2"
          />
          <path
            d="M 160 180 C 188 175 195 155 185 150 C 175 146 165 164 160 175 Z"
            fill="url(#leafGreenLight)"
            stroke="#22543D"
            strokeWidth="1.2"
          />
          {/* Closed flower bud */}
          <circle cx="160" cy="155" r="16" fill="#38A169" stroke="#22543D" strokeWidth="1.5" />
          <circle cx="160" cy="155" r="10" fill="#EAB308" opacity="0.6" />
          <path d="M 154 148 Q 160 142 166 148" stroke="#CA8A04" strokeWidth="2" fill="none" />
        </g>
      );
    case 4:
      return (
        <g id="sunflower-almost">
          {/* Stem */}
          <path d="M 160 268 Q 158 180 160 135" stroke="url(#stemGreen)" strokeWidth="8" strokeLinecap="round" />
          {/* Broad leaves */}
          <path
            d="M 158 220 C 105 220 95 180 108 170 C 126 162 145 195 158 212 Z"
            fill="url(#leafGreenLight)"
            stroke="#22543D"
            strokeWidth="1.5"
          />
          <path
            d="M 161 200 C 215 200 225 160 212 150 C 194 142 175 175 161 192 Z"
            fill="url(#leafGreenLight)"
            stroke="#22543D"
            strokeWidth="1.5"
          />
          {/* Bud opening with early petals */}
          <g transform="translate(160, 130)">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <path
                key={i}
                d="M 0 0 C -6 -18 6 -18 0 0"
                fill="url(#sunflowerPetal)"
                stroke="#CA8A04"
                strokeWidth="1"
                transform={`rotate(${angle})`}
              />
            ))}
            <circle cx="0" cy="0" r="18" fill="url(#sunflowerCenter)" stroke="#78350F" strokeWidth="1.5" />
          </g>
        </g>
      );
    case 5:
    default:
      return (
        <g id="sunflower-blooming">
          {/* Tall strong stem */}
          <path d="M 160 268 Q 158 170 160 120" stroke="url(#stemGreen)" strokeWidth="9" strokeLinecap="round" />
          {/* Huge heart-shaped sunflower leaves */}
          <path
            d="M 158 225 C 90 225 80 170 98 158 C 124 148 145 195 158 215 Z"
            fill="url(#leafGreenLight)"
            stroke="#1C4532"
            strokeWidth="1.5"
          />
          <path
            d="M 162 205 C 230 205 240 150 222 138 C 196 128 175 175 162 195 Z"
            fill="url(#leafGreenLight)"
            stroke="#1C4532"
            strokeWidth="1.5"
          />
          {/* Glorious blooming flower head */}
          <g transform="translate(160, 115)">
            {/* Outer layer of golden petals (16 petals) */}
            {Array.from({ length: 16 }).map((_, i) => (
              <path
                key={`outer-${i}`}
                d="M 0 -22 C -11 -48 0 -58 0 -58 C 0 -58 11 -48 0 -22"
                fill="url(#sunflowerPetal)"
                stroke="#B45309"
                strokeWidth="1"
                transform={`rotate(${i * 22.5})`}
              />
            ))}
            {/* Inner layer of bright petals (16 petals offset) */}
            {Array.from({ length: 16 }).map((_, i) => (
              <path
                key={`inner-${i}`}
                d="M 0 -18 C -9 -38 0 -46 0 -46 C 0 -46 9 -38 0 -18"
                fill="#FDE047"
                stroke="#D97706"
                strokeWidth="0.8"
                transform={`rotate(${i * 22.5 + 11.25})`}
              />
            ))}
            {/* Chocolate textured seed disc */}
            <circle cx="0" cy="0" r="26" fill="url(#sunflowerCenter)" stroke="#78350F" strokeWidth="2" />
            {/* Cute mini seed spiral rings */}
            <circle cx="0" cy="0" r="18" fill="none" stroke="#A16207" strokeWidth="1" strokeDasharray="3,3" />
            <circle cx="0" cy="0" r="10" fill="none" stroke="#CA8A04" strokeWidth="1" strokeDasharray="2,3" />
            {/* Gentle happy face in the center for emotional warmth */}
            <circle cx="-6" cy="-4" r="2.5" fill="#FEF08A" />
            <circle cx="6" cy="-4" r="2.5" fill="#FEF08A" />
            <path d="M -5 4 Q 0 8 5 4" stroke="#FEF08A" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          </g>
        </g>
      );
  }
}

/* =========================================================================
   2. TULIP (튤립)
   Stages:
   0: Bulb in soil
   1: Tender green shoot
   2: Two curved upright leaves
   3: Tall graceful stem with closed green bud
   4: Swollen pink-tipped bud ready to open
   5: Magnificent blooming pink/coral tulip with delicate inner glow!
========================================================================= */
function renderTulip(stage: number, percent: number) {
  switch (stage) {
    case 0:
      return (
        <g id="tulip-bulb">
          {/* Bulb peeking */}
          <path
            d="M 160 258 C 150 262 148 274 160 274 C 172 274 170 262 160 258 Z"
            fill="#B45309"
            stroke="#78350F"
            strokeWidth="1"
          />
          <path d="M 160 258 Q 160 252 160 248" stroke="#84CC16" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      );
    case 1:
      return (
        <g id="tulip-sprout">
          <path d="M 160 268 Q 160 248 160 234" stroke="url(#stemGreen)" strokeWidth="4.5" strokeLinecap="round" />
          <path
            d="M 160 246 C 152 242 150 232 160 224 C 170 232 168 242 160 246 Z"
            fill="url(#sproutGradient)"
            stroke="#2F855A"
            strokeWidth="1"
          />
        </g>
      );
    case 2:
      return (
        <g id="tulip-leaves">
          <path d="M 160 268 Q 160 220 160 195" stroke="url(#stemGreen)" strokeWidth="5.5" strokeLinecap="round" />
          {/* Left elegant tulip leaf */}
          <path
            d="M 158 260 C 130 250 126 195 146 175 C 148 195 152 235 158 260 Z"
            fill="url(#leafGreenLight)"
            stroke="#276749"
            strokeWidth="1.2"
          />
          {/* Right curving tulip leaf */}
          <path
            d="M 162 260 C 190 250 194 195 174 175 C 172 195 168 235 162 260 Z"
            fill="url(#leafGreenLight)"
            stroke="#276749"
            strokeWidth="1.2"
          />
        </g>
      );
    case 3:
      return (
        <g id="tulip-budding">
          <path d="M 160 268 Q 160 185 160 150" stroke="url(#stemGreen)" strokeWidth="6" strokeLinecap="round" />
          {/* Taller wrapping leaves */}
          <path
            d="M 158 260 C 122 240 118 170 148 145 C 146 175 152 230 158 260 Z"
            fill="url(#leafGreenLight)"
            stroke="#276749"
            strokeWidth="1.2"
          />
          <path
            d="M 162 260 C 198 240 202 170 172 145 C 174 175 168 230 162 260 Z"
            fill="url(#leafGreenLight)"
            stroke="#276749"
            strokeWidth="1.2"
          />
          {/* Green bud with pink tip */}
          <path
            d="M 160 150 C 148 145 146 125 160 116 C 174 125 172 145 160 150 Z"
            fill="url(#tulipBud)"
            stroke="#15803D"
            strokeWidth="1.2"
          />
        </g>
      );
    case 4:
      return (
        <g id="tulip-almost">
          <path d="M 160 268 Q 159 165 160 135" stroke="url(#stemGreen)" strokeWidth="6.5" strokeLinecap="round" />
          <path
            d="M 158 260 C 115 235 110 150 145 125 C 144 165 150 225 158 260 Z"
            fill="url(#leafGreenLight)"
            stroke="#22543D"
            strokeWidth="1.4"
          />
          <path
            d="M 162 260 C 205 235 210 150 175 125 C 176 165 170 225 162 260 Z"
            fill="url(#leafGreenLight)"
            stroke="#22543D"
            strokeWidth="1.4"
          />
          {/* Pink bud swollen */}
          <g transform="translate(160, 130)">
            <path
              d="M 0 5 C -16 -5 -16 -30 0 -42 C 16 -30 16 -5 0 5 Z"
              fill="url(#tulipPetal)"
              stroke="#BE185D"
              strokeWidth="1.2"
            />
            {/* Center petal split line */}
            <path d="M 0 -42 L 0 5" stroke="#F472B6" strokeWidth="1" opacity="0.6" />
          </g>
        </g>
      );
    case 5:
    default:
      return (
        <g id="tulip-bloom">
          <path d="M 160 268 Q 159 165 160 130" stroke="url(#stemGreen)" strokeWidth="7" strokeLinecap="round" />
          {/* Lush graceful tulip foliage */}
          <path
            d="M 158 260 C 105 230 100 135 142 110 C 140 155 148 220 158 260 Z"
            fill="url(#leafGreenLight)"
            stroke="#1C4532"
            strokeWidth="1.5"
          />
          <path
            d="M 162 260 C 215 230 220 135 178 110 C 180 155 172 220 162 260 Z"
            fill="url(#leafGreenLight)"
            stroke="#1C4532"
            strokeWidth="1.5"
          />
          {/* Blooming Tulip Cup */}
          <g transform="translate(160, 120)">
            {/* Back petal */}
            <path
              d="M 0 5 C -18 -8 -20 -48 0 -58 C 20 -48 18 -8 0 5 Z"
              fill="#DB2777"
              stroke="#9D174D"
              strokeWidth="1"
            />
            {/* Inner stamen warm glow */}
            <circle cx="0" cy="-28" r="8" fill="#FDE047" opacity="0.75" />

            {/* Left front petal */}
            <path
              d="M -3 6 C -28 0 -34 -38 -12 -54 C -2 -42 -1 -12 -3 6 Z"
              fill="url(#tulipPetal)"
              stroke="#BE185D"
              strokeWidth="1.2"
            />
            {/* Right front petal */}
            <path
              d="M 3 6 C 28 0 34 -38 12 -54 C 2 -42 1 -12 3 6 Z"
              fill="url(#tulipPetal)"
              stroke="#BE185D"
              strokeWidth="1.2"
            />
            {/* Center front petal */}
            <path
              d="M 0 7 C -15 2 -18 -38 0 -48 C 18 -38 15 2 0 7 Z"
              fill="url(#tulipPetal)"
              stroke="#9D174D"
              strokeWidth="1.2"
            />
            {/* Petal soft shine */}
            <path d="M -6 -20 Q -8 -36 -2 -44" stroke="#FCE7F3" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.8" />
          </g>
        </g>
      );
  }
}

/* =========================================================================
   3. CACTUS (선인장)
   Stages:
   0: Desert seed in sandy loam
   1: Tiny round baby button cactus
   2: Ribbed oval cactus with little spine tufts
   3: Classic saguaro shape with 2 cute arms
   4: Robust branching cactus with flower bud atop
   5: Crowned with vibrant desert blooms and cute sparkles!
========================================================================= */
function renderCactus(stage: number, percent: number) {
  switch (stage) {
    case 0:
      return (
        <g id="cactus-seed">
          <circle cx="160" cy="266" r="4.5" fill="#292524" />
          <circle cx="152" cy="268" r="2" fill="#D6D3D1" />
          <circle cx="168" cy="267" r="1.5" fill="#D6D3D1" />
        </g>
      );
    case 1:
      return (
        <g id="cactus-baby">
          {/* Round chubby button */}
          <ellipse cx="160" cy="254" rx="16" ry="18" fill="url(#cactusBody)" stroke="#047857" strokeWidth="1.5" />
          {/* Soft little spine dots */}
          <circle cx="154" cy="248" r="1" fill="#FEF08A" />
          <circle cx="166" cy="248" r="1" fill="#FEF08A" />
          <circle cx="160" cy="256" r="1" fill="#FEF08A" />
          <circle cx="153" cy="260" r="1" fill="#FEF08A" />
          <circle cx="167" cy="260" r="1" fill="#FEF08A" />
        </g>
      );
    case 2:
      return (
        <g id="cactus-ribbed">
          {/* Oval ribbed cactus */}
          <ellipse cx="160" cy="235" rx="26" ry="36" fill="url(#cactusBody)" stroke="#047857" strokeWidth="2" />
          {/* Vertical ribs */}
          <path d="M 160 199 L 160 271" stroke="#065F46" strokeWidth="1.5" opacity="0.4" />
          <path d="M 148 203 Q 146 235 150 267" stroke="#065F46" strokeWidth="1.5" opacity="0.4" fill="none" />
          <path d="M 172 203 Q 174 235 170 267" stroke="#065F46" strokeWidth="1.5" opacity="0.4" fill="none" />
          {/* Golden spine tufts */}
          {[-12, 0, 12].map(xOff => (
            <React.Fragment key={xOff}>
              <line x1={160 + xOff - 3} y1={215} x2={160 + xOff + 3} y2={215} stroke="#FEF08A" strokeWidth="1.5" />
              <line x1={160 + xOff} y1={212} x2={160 + xOff} y2={218} stroke="#FEF08A" strokeWidth="1.5" />

              <line x1={160 + xOff - 3} y1={235} x2={160 + xOff + 3} y2={235} stroke="#FEF08A" strokeWidth="1.5" />
              <line x1={160 + xOff} y1={232} x2={160 + xOff} y2={238} stroke="#FEF08A" strokeWidth="1.5" />

              <line x1={160 + xOff - 3} y1={255} x2={160 + xOff + 3} y2={255} stroke="#FEF08A" strokeWidth="1.5" />
              <line x1={160 + xOff} y1={252} x2={160 + xOff} y2={258} stroke="#FEF08A" strokeWidth="1.5" />
            </React.Fragment>
          ))}
        </g>
      );
    case 3:
      return (
        <g id="cactus-arms">
          {/* Main trunk */}
          <rect x="144" y="180" width="32" height="90" rx="16" fill="url(#cactusBody)" stroke="#047857" strokeWidth="2" />
          {/* Left arm */}
          <path
            d="M 146 235 L 124 235 C 116 235 116 205 124 205 L 126 205"
            stroke="url(#cactusBody)"
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 146 235 L 124 235 C 116 235 116 205 124 205 L 126 205"
            stroke="#047857"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Right arm */}
          <path
            d="M 174 225 L 196 225 C 204 225 204 195 196 195 L 194 195"
            stroke="url(#cactusBody)"
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 174 225 L 196 225 C 204 225 204 195 196 195 L 194 195"
            stroke="#047857"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      );
    case 4:
      return (
        <g id="cactus-almost">
          {/* Main trunk */}
          <rect x="142" y="160" width="36" height="110" rx="18" fill="url(#cactusBody)" stroke="#047857" strokeWidth="2" />
          {/* Left arm */}
          <path
            d="M 144 225 L 120 225 C 110 225 110 185 120 185 L 122 185"
            stroke="url(#cactusBody)"
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
          />
          {/* Right arm */}
          <path
            d="M 176 215 L 200 215 C 210 215 210 175 200 175 L 198 175"
            stroke="url(#cactusBody)"
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
          />
          {/* Little pink flower bud on top */}
          <circle cx="160" cy="155" r="9" fill="url(#cactusFlower)" stroke="#BE185D" strokeWidth="1" />
        </g>
      );
    case 5:
    default:
      return (
        <g id="cactus-bloom">
          {/* Robust main trunk */}
          <rect x="140" y="145" width="40" height="125" rx="20" fill="url(#cactusBody)" stroke="#047857" strokeWidth="2" />
          {/* Vertical ribs */}
          <path d="M 160 145 L 160 270" stroke="#065F46" strokeWidth="1.5" opacity="0.4" />
          <path d="M 148 150 Q 146 205 150 268" stroke="#065F46" strokeWidth="1.5" opacity="0.4" fill="none" />
          <path d="M 172 150 Q 174 205 170 268" stroke="#065F46" strokeWidth="1.5" opacity="0.4" fill="none" />

          {/* Left arm */}
          <path
            d="M 142 220 L 115 220 C 104 220 104 175 115 175 L 118 175"
            stroke="url(#cactusBody)"
            strokeWidth="18"
            strokeLinecap="round"
            fill="none"
          />
          {/* Right arm */}
          <path
            d="M 178 208 L 205 208 C 216 208 216 165 205 165 L 202 165"
            stroke="url(#cactusBody)"
            strokeWidth="18"
            strokeLinecap="round"
            fill="none"
          />

          {/* Mini bloom on right arm */}
          <circle cx="205" cy="165" r="7" fill="url(#cactusFlower)" />

          {/* Magnificent Crown Flower atop central trunk */}
          <g transform="translate(160, 140)">
            {/* Multi-petal desert blossom */}
            {Array.from({ length: 12 }).map((_, i) => (
              <path
                key={i}
                d="M 0 0 C -7 -18 7 -18 0 0"
                fill="url(#cactusFlower)"
                stroke="#BE123C"
                strokeWidth="0.8"
                transform={`rotate(${i * 30})`}
              />
            ))}
            <circle cx="0" cy="0" r="9" fill="#FDE047" stroke="#CA8A04" strokeWidth="1" />
            <circle cx="0" cy="0" r="4" fill="#EA580C" />
          </g>

          {/* Cute face on cactus trunk */}
          <circle cx="152" cy="195" r="2.5" fill="#064E3B" />
          <circle cx="168" cy="195" r="2.5" fill="#064E3B" />
          {/* Pink blush cheeks */}
          <ellipse cx="147" cy="200" rx="3" ry="1.5" fill="#FDA4AF" opacity="0.8" />
          <ellipse cx="173" cy="200" rx="3" ry="1.5" fill="#FDA4AF" opacity="0.8" />
          <path d="M 157 202 Q 160 205 163 202" stroke="#064E3B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </g>
      );
  }
}

/* =========================================================================
   4. FOUR-LEAF CLOVER (네잎클로버)
   Stages:
   0: Clover seed in moist soil
   1: Tiny twin-leaflet sprout
   2: Three-leaf shamrock with white chevron marks
   3: Taller cluster + 4th baby leaf emerging
   4: 4 distinct heart leaflets unfolding
   5: Legendary rich green 4-leaf clover with white clover flower & lucky sparkles!
========================================================================= */
function renderClover(stage: number, percent: number) {
  switch (stage) {
    case 0:
      return (
        <g id="clover-seed">
          <ellipse cx="160" cy="266" rx="4" ry="3" fill="#365314" />
          <path d="M 160 265 Q 161 260 162 258" stroke="#84CC16" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      );
    case 1:
      return (
        <g id="clover-sprout">
          <path d="M 160 268 Q 160 248 160 236" stroke="url(#stemGreen)" strokeWidth="3.5" strokeLinecap="round" />
          {/* 2 little heart leaflets */}
          <path
            d="M 160 236 C 145 230 145 215 155 218 C 160 220 160 236 160 236 Z"
            fill="url(#leafGreenLight)"
            stroke="#15803D"
            strokeWidth="1"
          />
          <path
            d="M 160 236 C 175 230 175 215 165 218 C 160 220 160 236 160 236 Z"
            fill="url(#leafGreenLight)"
            stroke="#15803D"
            strokeWidth="1"
          />
        </g>
      );
    case 2:
      return (
        <g id="clover-three">
          <path d="M 160 268 Q 158 220 160 195" stroke="url(#stemGreen)" strokeWidth="4.5" strokeLinecap="round" />
          {/* 3 heart clover leaflets */}
          <g transform="translate(160, 195)">
            {/* Top leaf */}
            <path
              d="M 0 0 C -15 -10 -20 -35 0 -28 C 20 -35 15 -10 0 0 Z"
              fill="url(#leafGreenLight)"
              stroke="#15803D"
              strokeWidth="1.2"
            />
            {/* Left leaf */}
            <path
              d="M 0 0 C -10 -15 -35 -20 -28 0 C -35 20 -10 15 0 0 Z"
              fill="url(#leafGreenLight)"
              stroke="#15803D"
              strokeWidth="1.2"
            />
            {/* Right leaf */}
            <path
              d="M 0 0 C 10 -15 35 -20 28 0 C 35 20 10 15 0 0 Z"
              fill="url(#leafGreenLight)"
              stroke="#15803D"
              strokeWidth="1.2"
            />
          </g>
        </g>
      );
    case 3:
      return (
        <g id="clover-growing">
          <path d="M 160 268 Q 158 190 160 160" stroke="url(#stemGreen)" strokeWidth="5" strokeLinecap="round" />
          <g transform="translate(160, 160)">
            {/* Top leaf */}
            <path d="M 0 0 C -18 -12 -24 -42 0 -34 C 24 -42 18 -12 0 0 Z" fill="url(#leafGreenLight)" stroke="#15803D" strokeWidth="1.2" />
            {/* Left leaf */}
            <path d="M 0 0 C -12 -18 -42 -24 -34 0 C -42 24 -12 18 0 0 Z" fill="url(#leafGreenLight)" stroke="#15803D" strokeWidth="1.2" />
            {/* Right leaf */}
            <path d="M 0 0 C 12 -18 42 -24 34 0 C 42 24 12 18 0 0 Z" fill="url(#leafGreenLight)" stroke="#15803D" strokeWidth="1.2" />
            {/* 4th tiny bottom leaf budding */}
            <path d="M 0 0 C -8 8 -12 20 0 16 C 12 20 8 8 0 0 Z" fill="#86EFAC" stroke="#15803D" strokeWidth="1" />
          </g>
        </g>
      );
    case 4:
      return (
        <g id="clover-almost">
          <path d="M 160 268 Q 158 175 160 145" stroke="url(#stemGreen)" strokeWidth="5.5" strokeLinecap="round" />
          <g transform="translate(160, 145)">
            {/* 4 full heart leaflets */}
            {[0, 90, 180, 270].map((rot, i) => (
              <path
                key={i}
                d="M 0 0 C -16 -12 -22 -38 0 -30 C 22 -38 16 -12 0 0 Z"
                fill="url(#leafGreenLight)"
                stroke="#166534"
                strokeWidth="1.2"
                transform={`rotate(${rot})`}
              />
            ))}
          </g>
        </g>
      );
    case 5:
    default:
      return (
        <g id="clover-bloom">
          <path d="M 160 268 Q 158 165 160 135" stroke="url(#stemGreen)" strokeWidth="6" strokeLinecap="round" />
          {/* Secondary lucky stem with white clover blossom */}
          <path d="M 160 220 Q 185 190 195 160" stroke="url(#stemGreen)" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* White clover pomp-pom blossom */}
          <g transform="translate(195, 155)">
            <circle cx="0" cy="0" r="10" fill="#F0FDF4" stroke="#DCFCE7" strokeWidth="1" />
            {Array.from({ length: 8 }).map((_, i) => (
              <circle key={i} cx={Math.cos((i * Math.PI) / 4) * 8} cy={Math.sin((i * Math.PI) / 4) * 8} r="3.5" fill="#FFFFFF" />
            ))}
          </g>

          {/* Majestic Four-Leaf Clover with White V-stripes */}
          <g transform="translate(160, 135)">
            {[0, 90, 180, 270].map((rot, i) => (
              <g key={i} transform={`rotate(${rot})`}>
                <path
                  d="M 0 0 C -22 -16 -30 -52 0 -42 C 30 -52 22 -16 0 0 Z"
                  fill="url(#leafGreenLight)"
                  stroke="#14532D"
                  strokeWidth="1.5"
                />
                {/* White chevron detail on clover leaflet */}
                <path d="M -12 -28 Q 0 -22 12 -28" stroke="#DCFCE7" strokeWidth="1.8" fill="none" opacity="0.8" />
              </g>
            ))}
            {/* Center dew drop */}
            <circle cx="0" cy="0" r="4" fill="#BBF7D0" stroke="#166534" strokeWidth="1" />
          </g>
        </g>
      );
  }
}

/* =========================================================================
   5. TOMATO (방울토마토)
   Stages:
   0: Tomato seed in soil
   1: Delicate two-leaf seedling
   2: Segmented compound tomato leaves + support stake
   3: Climbing vine + yellow star flowers blooming
   4: Little green baby tomatoes growing on vine
   5: Heavy vine laden with glossy, plump, deep crimson red ripe tomatoes!
========================================================================= */
function renderTomato(stage: number, percent: number) {
  switch (stage) {
    case 0:
      return (
        <g id="tomato-seed">
          <ellipse cx="160" cy="266" rx="4" ry="2.5" fill="#713F12" />
          <circle cx="158" cy="265" r="1" fill="#FEF08A" />
        </g>
      );
    case 1:
      return (
        <g id="tomato-sprout">
          <path d="M 160 268 Q 160 248 160 236" stroke="url(#stemGreen)" strokeWidth="3.5" strokeLinecap="round" />
          <path
            d="M 160 238 C 145 235 140 220 148 218 C 158 215 160 238 160 238 Z"
            fill="url(#leafGreenLight)"
            stroke="#15803D"
            strokeWidth="1"
          />
          <path
            d="M 160 238 C 175 235 180 220 172 218 C 162 215 160 238 160 238 Z"
            fill="url(#leafGreenLight)"
            stroke="#15803D"
            strokeWidth="1"
          />
        </g>
      );
    case 2:
      return (
        <g id="tomato-young">
          {/* Bamboo support stake */}
          <line x1="172" y1="180" x2="172" y2="270" stroke="#A16207" strokeWidth="4" strokeLinecap="round" />
          {/* Vine */}
          <path d="M 160 268 Q 158 225 168 190" stroke="url(#stemGreen)" strokeWidth="4.5" strokeLinecap="round" />
          {/* Tomato serrated leaves */}
          <path
            d="M 160 240 C 130 235 120 215 132 208 C 145 200 156 225 160 240 Z"
            fill="url(#leafGreenLight)"
            stroke="#15803D"
            strokeWidth="1.2"
          />
          <path
            d="M 165 215 C 195 210 205 190 192 185 C 180 180 170 205 165 215 Z"
            fill="url(#leafGreenLight)"
            stroke="#15803D"
            strokeWidth="1.2"
          />
        </g>
      );
    case 3:
      return (
        <g id="tomato-flowers">
          {/* Stake */}
          <line x1="172" y1="140" x2="172" y2="270" stroke="#A16207" strokeWidth="4.5" strokeLinecap="round" />
          {/* Bushy vine */}
          <path d="M 160 268 Q 155 200 168 150" stroke="url(#stemGreen)" strokeWidth="5.5" strokeLinecap="round" />
          {/* Foliage */}
          <path
            d="M 158 230 C 115 220 108 185 125 178 C 142 170 155 210 158 230 Z"
            fill="url(#leafGreenLight)"
            stroke="#15803D"
            strokeWidth="1.2"
          />
          <path
            d="M 165 195 C 205 185 210 155 195 148 C 180 142 168 180 165 195 Z"
            fill="url(#leafGreenLight)"
            stroke="#15803D"
            strokeWidth="1.2"
          />
          {/* Yellow star-shaped tomato flowers */}
          <g transform="translate(142, 170)">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path key={i} d="M 0 0 L -2 -8 L 0 -10 L 2 -8 Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="0.6" transform={`rotate(${angle})`} />
            ))}
            <circle cx="0" cy="0" r="2.5" fill="#EAB308" />
          </g>
        </g>
      );
    case 4:
      return (
        <g id="tomato-green-fruits">
          <line x1="172" y1="120" x2="172" y2="270" stroke="#A16207" strokeWidth="5" strokeLinecap="round" />
          <path d="M 160 268 Q 152 180 168 130" stroke="url(#stemGreen)" strokeWidth="6" strokeLinecap="round" />
          {/* Leaves */}
          <path
            d="M 158 220 C 110 210 100 170 120 160 C 140 150 155 195 158 220 Z"
            fill="url(#leafGreenLight)"
            stroke="#166534"
            strokeWidth="1.2"
          />
          <path
            d="M 166 180 C 215 170 220 130 200 125 C 185 120 170 160 166 180 Z"
            fill="url(#leafGreenLight)"
            stroke="#166534"
            strokeWidth="1.2"
          />
          {/* Baby green tomatoes */}
          <g transform="translate(140, 185)">
            <ellipse cx="0" cy="0" rx="11" ry="10" fill="url(#tomatoGreen)" stroke="#4D7C0F" strokeWidth="1" />
            <path d="M -3 -10 L 0 -8 L 3 -10 L 1 -7 L 0 -11 Z" fill="#365314" />
          </g>
          <g transform="translate(192, 175)">
            <ellipse cx="0" cy="0" rx="9" ry="8.5" fill="url(#tomatoGreen)" stroke="#4D7C0F" strokeWidth="1" />
          </g>
        </g>
      );
    case 5:
    default:
      return (
        <g id="tomato-ripe">
          {/* Bamboo support stake with ties */}
          <line x1="172" y1="105" x2="172" y2="270" stroke="#A16207" strokeWidth="5" strokeLinecap="round" />
          <path d="M 168 175 Q 174 177 176 175" stroke="#713F12" strokeWidth="2" fill="none" />
          <path d="M 166 225 Q 173 227 175 225" stroke="#713F12" strokeWidth="2" fill="none" />

          {/* Thick lush vine */}
          <path d="M 160 268 Q 150 170 168 115" stroke="url(#stemGreen)" strokeWidth="6.5" strokeLinecap="round" />

          {/* Abundant tomato leaves */}
          <path
            d="M 158 215 C 95 205 85 155 110 145 C 135 135 155 185 158 215 Z"
            fill="url(#leafGreenLight)"
            stroke="#14532D"
            strokeWidth="1.5"
          />
          <path
            d="M 166 170 C 225 160 235 115 210 108 C 190 102 172 145 166 170 Z"
            fill="url(#leafGreenLight)"
            stroke="#14532D"
            strokeWidth="1.5"
          />

          {/* Cluster 1: Big Ripe Juicy Red Tomato */}
          <g transform="translate(135, 175)">
            <circle cx="0" cy="0" r="17" fill="url(#tomatoRed)" stroke="#991B1B" strokeWidth="1.2" />
            {/* Glossy highlight */}
            <ellipse cx="-5" cy="-6" rx="4" ry="2.5" fill="#FFFFFF" opacity="0.6" transform="rotate(-30, -5, -6)" />
            {/* Green calyx / sepals */}
            <path d="M -8 -17 Q 0 -13 8 -17 Q 5 -12 8 -8 Q 0 -12 -5 -9 Z" fill="#15803D" stroke="#14532D" strokeWidth="0.8" />
          </g>

          {/* Cluster 2: Second Medium Ripe Tomato */}
          <g transform="translate(195, 160)">
            <circle cx="0" cy="0" r="14" fill="url(#tomatoRed)" stroke="#991B1B" strokeWidth="1.2" />
            <ellipse cx="-4" cy="-5" rx="3.5" ry="2" fill="#FFFFFF" opacity="0.6" transform="rotate(-30, -4, -5)" />
            <path d="M -6 -14 Q 0 -11 6 -14 Q 4 -10 6 -7 Q 0 -10 -4 -8 Z" fill="#15803D" stroke="#14532D" strokeWidth="0.8" />
          </g>

          {/* Cluster 3: Small cute cherry tomato on top */}
          <g transform="translate(150, 125)">
            <circle cx="0" cy="0" r="11" fill="url(#tomatoRed)" stroke="#991B1B" strokeWidth="1" />
            <ellipse cx="-3" cy="-4" rx="2.5" ry="1.5" fill="#FFFFFF" opacity="0.5" transform="rotate(-30, -3, -4)" />
            <path d="M -5 -11 Q 0 -9 5 -11 Q 3 -8 5 -5 Q 0 -8 -3 -6 Z" fill="#15803D" stroke="#14532D" strokeWidth="0.8" />
          </g>
        </g>
      );
  }
}
