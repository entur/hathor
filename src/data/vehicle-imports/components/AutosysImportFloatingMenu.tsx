import { LibraryAdd } from '@mui/icons-material';
import { Button, Dialog, type ButtonProps } from '@mui/material';
import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import MultiImport from './MultiImport';
import {
  VEHICLE_TYPE_FILTER_PARAM,
  VEHICLE_TYPES_PATH,
} from '../../vehicle-types/components/VehicleTypeCollectionPage.tsx';

interface AutosysImportFloatingMenuProps {
  /** Button text (already translated). */
  label: string;
  /** Leading icon; defaults to `<LibraryAdd />`. Pass `null` to drop it. */
  startIcon?: ReactNode;
  /** Trailing icon, e.g. a source logo. */
  endIcon?: ReactNode;
  variant?: ButtonProps['variant'];
  testId: string;
}

/**
 * Button that opens the Autosys bulk-import dialog ({@link MultiImport}); on
 * completion navigates to the vehicle-type collection filtered to the imported ids (a
 * push: Back returns to Home, its only launcher).
 * @param {AutosysImportFloatingMenuProps} props - label + test id, plus optional look overrides.
 * @returns the trigger button plus its dialog.
 */
export default function AutosysImportFloatingMenu({
  label,
  startIcon = <LibraryAdd />,
  endIcon,
  variant = 'contained',
  testId,
}: AutosysImportFloatingMenuProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleImportComplete = (vehicleTypeIds: string[]) => {
    setOpen(false);
    if (vehicleTypeIds.length > 0) {
      const filterParam = vehicleTypeIds.join(',');
      navigate(
        `${VEHICLE_TYPES_PATH}?${VEHICLE_TYPE_FILTER_PARAM}=${encodeURIComponent(filterParam)}`
      );
    }
  };

  return (
    <>
      <Button
        variant={variant}
        color="primary"
        startIcon={startIcon}
        endIcon={endIcon}
        onClick={() => setOpen(true)}
        data-testid={testId}
        aria-label={label}
        sx={{
          textTransform: 'none',
          // centre a tall endIcon (e.g. a logo img) on the label instead of its baseline
          '& .MuiButton-endIcon': { display: 'flex', alignItems: 'center', my: -0.5 },
        }}
      >
        {label}
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <MultiImport onClose={() => setOpen(false)} onImportComplete={handleImportComplete} />
      </Dialog>
    </>
  );
}
