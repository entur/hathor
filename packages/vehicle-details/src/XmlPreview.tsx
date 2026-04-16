import { useMemo } from 'react';
import type React from 'react';
import type { Vehicle } from './generated/Vehicle.js';
import Box from '@mui/material/Box';
import { serialize } from './serialize.js';

export interface XmlPreviewProps {
  value: Partial<Vehicle>;
}

export function XmlPreview({ value }: XmlPreviewProps): React.JSX.Element {
  const xml = useMemo(() => serialize(value), [value]);

  return (
    <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, overflow: 'auto' }}>
      <pre
        style={{
          margin: 0,
          fontFamily: 'monospace',
          fontSize: '0.8rem',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {xml}
      </pre>
    </Box>
  );
}
