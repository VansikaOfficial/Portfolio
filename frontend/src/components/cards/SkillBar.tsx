'use client';

import { Box, Typography, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { Skill } from '@/types';

export default function SkillBar({ skill }: { skill: Skill }) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
        <Typography variant="body2" fontWeight={600}>
          {skill.name}
        </Typography>
        <Typography variant="caption" className="mono" color="text.secondary">
          {skill.percentage}%
        </Typography>
      </Stack>
      <Box sx={{ height: 6, borderRadius: 999, bgcolor: 'action.hover', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{
            height: '100%',
            borderRadius: 999,
            background: skill.color || '#2DD4BF',
          }}
        />
      </Box>
    </Box>
  );
}
