'use client';

import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

const DEFAULT_ROLES = ['Data Analyst', 'Data Scientist', 'Machine Learning Engineer', 'AI Engineer'];

export default function TypingRoles({ roles = DEFAULT_ROLES }: { roles?: string[] }) {
  const list = roles.length ? roles : DEFAULT_ROLES;
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = list[roleIndex % list.length];
    const speed = deleting ? 40 : 75;

    const timeout = setTimeout(() => {
      if (!deleting) {
        if (text.length < current.length) {
          setText(current.slice(0, text.length + 1));
        } else {
          setTimeout(() => setDeleting(true), 1400);
        }
      } else {
        if (text.length > 0) {
          setText(current.slice(0, text.length - 1));
        } else {
          setDeleting(false);
          setRoleIndex((i) => i + 1);
        }
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [text, deleting, roleIndex, list]);

  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', minHeight: { xs: 40, md: 52 } }}>
      <Typography
        component="span"
        variant="h4"
        sx={{
          fontFamily: 'var(--font-jetbrains-mono)',
          color: 'primary.main',
          fontWeight: 500,
          fontSize: { xs: '1.3rem', md: '1.75rem' },
        }}
      >
        {text}
      </Typography>
      <Box
        component="span"
        sx={{
          width: '2px',
          height: { xs: 22, md: 30 },
          bgcolor: 'primary.main',
          ml: 0.6,
          animation: 'blink 1s step-start infinite',
          '@keyframes blink': { '50%': { opacity: 0 } },
        }}
      />
    </Box>
  );
}
