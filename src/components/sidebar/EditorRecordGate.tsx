import type { ReactNode } from 'react';
import { Box, Divider, Typography } from '@mui/material';
import EditorRail from './EditorRail.tsx';
import type { Side } from './Sidebar.tsx';

interface EditorRecordGateProps {
  /** Editor title shown above the failure body. */
  title: string;
  /** Message shown when the fetch succeeded but Sobek has no such record. */
  notFoundLabel: string;
  /** The record id that was requested. */
  id: string;
  /** The by-id fetch's error, if it failed. */
  error: string | null;
  /** Sobek returned nothing for `id`. */
  notFound: boolean;
  /** Rendered while the record is still loading. */
  skeleton: ReactNode;
  onCollapse: () => void;
  side?: Side;
}

/**
 * Body of a sidebar editor whose record has not landed yet: the load error,
 * the not-found message, or else the loading skeleton — each with the rail.
 *
 * @param {EditorRecordGateProps} props - Title/labels, the record's load state and the rail wiring.
 * @returns {JSX.Element} The failure body or the skeleton, beside the editor rail.
 */
export default function EditorRecordGate({
  title,
  notFoundLabel,
  id,
  error,
  notFound,
  skeleton,
  onCollapse,
  side,
}: EditorRecordGateProps) {
  return (
    <>
      {error || notFound ? (
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {title}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {/* A failed request is not a missing record: show why it failed. */}
          {error ? (
            <Typography variant="body2" color="error" sx={{ mb: 1 }}>
              {error}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {notFoundLabel}
            </Typography>
          )}
          <Typography variant="caption" color="text.disabled" sx={{ wordBreak: 'break-all' }}>
            {id}
          </Typography>
        </Box>
      ) : (
        skeleton
      )}
      <EditorRail onCollapse={onCollapse} side={side} />
    </>
  );
}
