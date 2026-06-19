import React from 'react';

const LOCATIONS = [
  { id: 'nua', name: 'Ngàn Nưa', x: 50, y: 50 },
  { id: 'bodien', name: 'Bồ Điền', x: 150, y: 120 },
  { id: 'tung', name: 'Núi Tùng', x: 250, y: 80 }
];

export default function MapPanel({ onLocationClick, isReceiving, visitedLocations }) {
  return (
    <div style={{ height: '300px', width: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-panel)', position: 'relative' }}>
      <svg width="100%" height="100%" viewBox="0 0 300 200" preserveAspectRatio="xMidYMid meet">
        {/* Draw lines */}
        <line x1="50" y1="50" x2="150" y2="120" stroke="var(--border-color)" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="150" y1="120" x2="250" y2="80" stroke="var(--border-color)" strokeWidth="2" strokeDasharray="5,5" />
        
        {/* Draw nodes */}
        {LOCATIONS.map(loc => {
          const isVisited = visitedLocations.includes(loc.id);
          const color = isVisited ? 'var(--text-secondary)' : 'var(--accent-primary)';
          return (
            <g 
              key={loc.id} 
              transform={`translate(${loc.x}, ${loc.y})`}
              onClick={() => {
                if (!isReceiving && !isVisited) {
                  onLocationClick(loc);
                }
              }}
              style={{ cursor: (isReceiving || isVisited) ? 'not-allowed' : 'pointer' }}
            >
              <circle r="14" fill={color} />
              <circle r="20" fill="transparent" stroke={color} strokeWidth="2" strokeDasharray={isVisited ? "" : "3,3"} />
              <text 
                y="35" 
                textAnchor="middle" 
                fill={color}
                fontSize="14"
                fontWeight="bold"
              >
                {loc.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
