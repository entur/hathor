import { LibraryAdd } from '@mui/icons-material';
import { Button, Dialog, type ButtonProps } from '@mui/material';
import { useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MultiImport from './MultiImport';

const VT_PATH = '/vehicle-types';

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
 * completion navigates to /vehicle-types filtered to the imported ids —
 * replacing the history entry only when already there, so Back from a
 * Home-launched import returns to Home.
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
  const { pathname } = useLocation();

  const handleImportComplete = (vehicleTypeIds: string[]) => {
    setOpen(false);
    if (vehicleTypeIds.length > 0) {
      const filterParam = vehicleTypeIds.join(',');
      navigate(`${VT_PATH}?filter=${encodeURIComponent(filterParam)}`, {
        replace: pathname === VT_PATH,
      });
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
