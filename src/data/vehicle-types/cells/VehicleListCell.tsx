import { useState } from 'react';
import { Box, Chip, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import type { Vehicle } from '../vehicleTypeTypes.ts';

const MAX_VISIBLE = 5;

interface VehicleListCellProps {
  vehicles: Vehicle[];
}

export default function VehicleListCell({ vehicles }: VehicleListCellProps) {
  const [expanded, setExpanded] = useState(false);

  if (vehicles.length === 0) return null;

  const hiddenCount = Math.max(0, vehicles.length - MAX_VISIBLE);
  const hasMore = hiddenCount > 0;
  const shown = expanded ? vehicles : vehicles.slice(0, MAX_VISIBLE);

  return (
    <Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${MAX_VISIBLE}, max-content)`,
          gap: 0.5,
        }}
      >
        {shown.map(v => (
          <Chip
            key={v.id}
            component={Link}
            // Sobek GQL returns Vehicle.id as DB row id, not netexId — prepend the
            // prefix until Sobek registers getNetexIdFetcher for OUTPUT_TYPE_VEHICLE.
            to={`/vehicle/${encodeURIComponent(`NMR:Vehicle:${v.id}`)}`}
            label={v.registrationNumber}
            size="small"
            clickable
          />
        ))}
      </Box>
      {hasMore && (
        <MuiLink
          component="button"
          variant="body2"
          onClick={e => {
            e.stopPropagation();
            setExpanded(prev => !prev);
          }}
          sx={{ mt: 0.5 }}
        >
          {expanded ? 'Show less' : `+${hiddenCount} more`}
        </MuiLink>
      )}
    </Box>
  );
}
