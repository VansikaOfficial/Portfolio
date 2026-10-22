'use client';

import { motion } from 'framer-motion';
import { Box, useTheme } from '@mui/material';

const POINTS = [12, 28, 18, 40, 34, 52, 46, 68, 58, 82, 74, 94];

const buildPath = (points: number[], width: number, height: number) => {
  const step = width / (points.length - 1);
  const max = Math.max(...points);
  const coords = points.map((p, i) => {
    const x = i * step;
    const y = height - (p / max) * height * 0.86 - 6;
    return [x, y];
  });

  return coords.reduce((acc, [x, y], i) => {
    if (i === 0) return `M ${x} ${y}`;
    const [px, py] = coords[i - 1];
    const cx = (px + x) / 2;
    return `${acc} C ${cx} ${py}, ${cx} ${y}, ${x} ${y}`;
  }, '');
};

export default function DataPulse() {
  const theme = useTheme();
  const width = 520;
  const height = 220;
  const path = buildPath(POINTS, width, height);

  return (
    <Box sx={{ position: 'relative', width: '100%', maxWidth: width }}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="auto" role="presentation">
        <defs>
          <linearGradient id="pulseFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={theme.palette.primary.main} stopOpacity="0.28" />
            <stop offset="100%" stopColor={theme.palette.primary.main} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* grid */}
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={0}
            x2={width}
            y1={height * f}
            y2={height * f}
            stroke={theme.palette.divider}
            strokeDasharray="3 6"
          />
        ))}

        <motion.path
          d={`${path} L ${width} ${height} L 0 ${height} Z`}
          fill="url(#pulseFill)"
          stroke="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
        />

        <motion.path
          d={path}
          fill="none"
          stroke={theme.palette.primary.main}
          strokeWidth={2.5}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1] }}
        />

        <motion.circle
          r={5}
          fill={theme.palette.secondary.main}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.4 }}
          cx={width}
          cy={height - (POINTS[POINTS.length - 1] / Math.max(...POINTS)) * height * 0.86 - 6}
        />
      </svg>
    </Box>
  );
}
