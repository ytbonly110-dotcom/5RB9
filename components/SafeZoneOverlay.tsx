
import React from 'react';

interface SafeZoneOverlayProps {
  isVisible: boolean;
}

const SafeZoneOverlay: React.FC<SafeZoneOverlayProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-red-500/30 flex items-center justify-center">
      {/* Central Safe Area: 1546 x 423 px roughly translates to these percentages on 16:9 */}
      <div className="w-[60%] h-[29%] border-2 border-white/50 bg-black/10 flex items-center justify-center">
        <div className="text-[10px] md:text-xs font-bold text-white bg-black/60 px-2 py-1 rounded uppercase tracking-widest">
          Safe Zone (Text & Logos)
        </div>
      </div>
      
      {/* Indicators for desktop/tablet etc */}
      <div className="absolute top-4 left-4 text-[8px] md:text-[10px] text-white/40 bg-black/20 p-1">
        Full Image: TV (2560x1440)
      </div>
    </div>
  );
};

export default SafeZoneOverlay;
