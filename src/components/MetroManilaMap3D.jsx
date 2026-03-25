import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MAP_LGUS = [
  { id: 'manila', name: 'Manila', path: "M310.14,413.71 L301.79,440.16 L376.41,495.09 L400.71,518.96 L377.34,558.28 L330.64,605.08 L296.67,601.14 L248.86,543.55 L227.51,541.35 L217.24,500.23 L236.25,419.06 L247.24,417.95 L310.14,413.71 Z", color: "#0369a1" },
  { id: 'quezon', name: 'Quezon City', path: "M658.13,196.43 L648.06,243.12 L625.98,250.06 L612.92,307.16 L560.30,365.14 L532.56,456.24 L542.24,460.43 L564.06,489.47 L547.02,528.42 L490.37,537.06 L489.28,502.96 L464.31,482.39 L431.30,490.82 L392.30,471.56 L376.41,495.09 L301.79,440.16 L310.14,413.71 L332.17,335.75 L403.90,274.06 L389.27,227.82 L412.03,182.96 L472.14,144.59 L559.59,140.19 L614.20,89.24 L639.69,84.99 L641.19,135.87 L674.32,147.19 L658.13,196.43 Z", color: "#0d9488" },
  { id: 'caloocan', name: 'Caloocan', path: "M403.90,274.06 L332.17,335.75 L310.14,413.71 L247.24,417.95 L241.32,352.66 L333.08,325.84 L335.67,287.90 L366.68,294.46 L403.90,274.06 Z M614.20,89.24 L559.59,140.19 L472.14,144.59 L412.03,182.96 L389.27,227.82 L354.01,220.14 L376.27,141.25 L346.89,131.52 L446.54,94.94 L446.48,74.19 L454.26,48.70 L504.68,30.00 L531.10,69.29 L614.20,89.24 Z", color: "#4338ca" },
  { id: 'laspinas', name: 'Las Piñas', path: "M400.55,945.56 L360.38,1058.02 L371.29,1087.38 L292.81,948.18 L265.03,932.95 L244.13,864.42 L257.35,838.22 L287.52,800.92 L341.92,855.73 L341.27,883.32 L400.55,945.56 Z", color: "#be185d" },
  { id: 'makati', name: 'Makati', path: "M455.72,588.68 L512.89,614.23 L506.67,627.82 L512.22,670.61 L485.56,707.71 L442.27,733.60 L395.05,686.78 L378.94,688.58 L330.64,605.08 L377.34,558.28 L422.93,590.40 L455.72,588.68 Z", color: "#064e3b" },
  { id: 'malabon', name: 'Malabon', path: "M226.18,276.45 L292.97,325.76 L335.67,287.90 L333.08,325.84 L241.32,352.66 L225.59,387.69 L139.53,246.24 L147.68,237.44 L192.70,293.30 L226.18,276.45 Z", color: "#b91c1c" },
  { id: 'mandaluyong', name: 'Mandaluyong', path: "M490.37,537.06 L483.68,575.88 L455.72,588.68 L422.93,590.40 L377.34,558.28 L400.71,518.96 L423.65,530.54 L489.28,502.96 L490.37,537.06 Z", color: "#7c2d12" },
  { id: 'marikina', name: 'Marikina', path: "M682.16,364.93 L671.17,393.23 L628.37,412.73 L611.16,452.05 L557.10,445.27 L542.24,460.43 L532.56,456.24 L560.30,365.14 L612.92,307.16 L666.36,320.81 L682.16,364.93 Z", color: "#1e3a8a" },
  { id: 'muntinlupa', name: 'Muntinlupa', path: "M487.05,858.46 L472.17,907.14 L472.38,1040.13 L484.93,1095.46 L450.14,1111.47 L371.92,1170.00 L360.72,1150.47 L371.29,1087.38 L360.38,1058.02 L400.55,945.56 L443.55,921.42 L456.14,854.99 L487.05,858.46 Z", color: "#111827" },
  { id: 'navotas', name: 'Navotas', path: "M241.32,352.66 L247.24,417.95 L236.25,419.06 L209.09,414.02 L191.24,358.65 L117.84,264.62 L147.68,237.44 L139.53,246.24 L225.59,387.69 L241.32,352.66 Z", color: "#1e40af" },
  { id: 'paranaque', name: 'Parañaque', path: "M340.14,748.81 L343.21,772.58 L429.54,752.20 L459.98,769.11 L456.14,854.99 L443.55,921.42 L400.55,945.56 L341.27,883.32 L341.92,855.73 L287.52,800.92 L308.78,766.61 L269.72,750.37 L281.23,684.31 L333.29,680.47 L340.14,748.81 Z", color: "#4c1d95" },
  { id: 'pasay', name: 'Pasay', path: "M340.14,748.81 L333.29,680.47 L281.23,684.31 L280.50,624.53 L296.67,601.14 L330.64,605.08 L378.94,688.58 L395.05,686.78 L429.54,752.20 L343.21,772.58 L340.14,748.81 Z", color: "#581c87" },
  { id: 'pasig', name: 'Pasig', path: "M611.16,452.05 L623.72,557.73 L585.43,592.57 L604.78,638.05 L591.27,663.01 L545.86,646.39 L506.67,627.82 L512.89,614.23 L455.72,588.68 L483.68,575.88 L490.37,537.06 L547.02,528.42 L564.06,489.47 L542.24,460.43 L557.10,445.27 L611.16,452.05 Z", color: "#312e81" },
  { id: 'pateros', name: 'Pateros', path: "M545.86,646.39 L512.22,670.61 L506.67,627.82 L545.86,646.39 Z", color: "#db2777" },
  { id: 'sanjuan', name: 'San Juan', path: "M489.28,502.96 L423.65,530.54 L400.71,518.96 L376.41,495.09 L392.30,471.56 L431.30,490.82 L464.31,482.39 L489.28,502.96 Z", color: "#ea580c" },
  { id: 'taguig', name: 'Taguig', path: "M591.27,663.01 L617.05,692.42 L588.46,706.25 L570.85,746.66 L530.34,738.13 L503.31,788.29 L487.05,858.46 L456.14,854.99 L459.98,769.11 L429.54,752.20 L395.05,686.78 L442.27,733.60 L485.56,707.71 L512.22,670.61 L545.86,646.39 L591.27,663.01 Z", color: "#1e1b4b" },
  { id: 'valenzuela', name: 'Valenzuela', path: "M389.27,227.82 L403.90,274.06 L366.68,294.46 L335.67,287.90 L292.97,325.76 L226.18,276.45 L218.19,219.13 L199.15,220.96 L166.90,162.43 L201.15,148.20 L248.80,168.12 L272.09,210.28 L319.26,203.74 L314.22,156.25 L346.89,131.52 L376.27,141.25 L354.01,220.14 L389.27,227.82 Z", color: "#374151" },

];

const MetroManilaMap3D = ({ onCitySelect }) => {
  const [hoveredCity, setHoveredCity] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0, rotateX: 45, scale: 0.8 },
    visible: { 
      opacity: 1, 
      rotateX: 18, 
      rotateZ: -4,
      scale: 1,
      transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative perspective-[1500px] overflow-visible">
      <motion.div
        className="w-full h-full flex items-center justify-center translate-y-[2%]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.svg
          viewBox="0 0 800 1200"
          className="w-full max-w-[480px] h-auto drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
          style={{ transformStyle: "preserve-3d" }}
        >
          <defs>
            <filter id="box-shadow-hover" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="15" stdDeviation="10" floodColor="#000" floodOpacity="1" />
              <feDropShadow dx="0" dy="25" stdDeviation="20" floodColor="#000" floodOpacity="0.8" />
            </filter>
          </defs>
          
          <g style={{ transformStyle: "preserve-3d" }}>
            {MAP_LGUS.map((lgu) => {
              const isHovered = hoveredCity === lgu.id;
              
              return (
                <motion.path
                  key={lgu.id}
                  id={lgu.id}
                  d={lgu.path}
                  fill={isHovered ? "#10b981" : lgu.color} 
                  stroke="#09090b"
                  strokeWidth={2}
                  strokeLinejoin="round"
                  onClick={() => onCitySelect && onCitySelect(lgu.name)}
                  onMouseEnter={() => setHoveredCity(lgu.id)}
                  onMouseLeave={() => setHoveredCity(null)}
                  animate={{
                    z: isHovered ? 45 : 0, 
                    y: isHovered ? -25 : 0,
                    scale: isHovered ? 1.04 : 1,
                    filter: isHovered ? "url(#box-shadow-hover)" : "none",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 18
                  }}
                  className="cursor-pointer transition-colors duration-200"
                  style={{ 
                    transformStyle: "preserve-3d",
                    transformBox: "fill-box",
                    originX: "50%",
                    originY: "50%"
                  }} 
                />
              );
            })}
          </g>
        </motion.svg>
      </motion.div>
      
      {/* City Label Overlay - Positioned safely within parent */}
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="absolute bottom-10 left-10 px-8 py-4 bg-zinc-950/90 border border-zinc-700/50 rounded-3xl backdrop-blur-2xl shadow-[0_20px_40px_rgba(0,0,0,0.6)] z-50 flex flex-col items-start gap-1 min-w-[200px]"
        >
          <p className="text-zinc-500 font-mono text-[10px] tracking-[0.3em] uppercase whitespace-nowrap text-left">
            {hoveredCity ? "Selected Sector" : "Region Overview"}
          </p>
          <p className="text-emerald-400 font-bold text-xl tracking-tight text-left">
            {hoveredCity ? MAP_LGUS.find(c => c.id === hoveredCity)?.name : "Metro Manila"}
          </p>
        </motion.div>
      </AnimatePresence>
      
      {/* Removed "Interactive 2.5D" badge */}
    </div>
  );
};

export default MetroManilaMap3D;
