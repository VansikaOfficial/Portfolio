'use client';

import { useState, KeyboardEvent } from 'react';
import { Box, Chip, TextField, Typography } from '@mui/material';

export default function TagInput({
  label,
  value,
  onChange,
  placeholder = 'Type and press Enter',
}: {
  label: string;
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState('');

  const addTag = () => {
    const trimmed = draft.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setDraft('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !draft && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 1 }}>
        {label}
      </Typography>
      <TextField
        fullWidth
        placeholder={placeholder}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
      />
      {value.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 1.25 }}>
          {value.map((tag) => (
            <Chip key={tag} label={tag} size="small" onDelete={() => onChange(value.filter((t) => t !== tag))} />
          ))}
        </Box>
      )}
    </Box>
  );
}
