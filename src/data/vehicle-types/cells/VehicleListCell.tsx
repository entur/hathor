import { useState } from 'react';
import { Box, Chip, Link } from '@mui/material';
import type { Vehicle } from '../vehicleTypeTypes.ts';

const MAX_VISIBLE = 5;

interface VehicleListCellProps {
  vehicles: Vehicle[];
}

export default function VehicleListCell({ vehicles }: VehicleListCellProps) {
  const [expanded, setExpanded] = useState(false);

  if (vehicles.length === 0) return null;

  const visible = vehicles.slice(0, MAX_VISIBLE);
  const hidden = vehicles.slice(MAX_VISIBLE);
  const hasMore = hidden.length > 0;

  return (
    <Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${MAX_VISIBLE}, max-content)`,
          gap: 0.5,
        }}
      >
        {visible.map(v => (
          <Chip key={v.id} label={v.registrationNumber} size="small" />
        ))}
        {expanded && hidden.map(v => <Chip key={v.id} label={v.registrationNumber} size="small" />)}
      </Box>
      {hasMore && (
        <Link
          component="button"
          variant="body2"
          onClick={e => {
            e.stopPropagation();
            setExpanded(prev => !prev);
          }}
          sx={{ mt: 0.5 }}
        >
          {expanded ? 'Show less' : `+${hidden.length} more`}
        </Link>
      )}
    </Box>
  );
}
