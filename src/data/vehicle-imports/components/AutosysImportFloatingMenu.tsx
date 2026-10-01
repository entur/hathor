import { LibraryAdd } from '@mui/icons-material';
import { Button, Dialog, type ButtonProps } from '@mui/material';
import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import MultiImport from './MultiImport';

interface AutosysImportFloatingMenuProps {
  /** Button text; defaults to `vehicleType.actions.importMulti`. */
  label?: string;
  /** Leading icon; defaults to `<LibraryAdd />`. Pass `null` to drop it. */
  startIcon?: ReactNode;
  /** Trailing icon, e.g. a source logo. */
  endIcon?: ReactNode;
  variant?: ButtonProps['variant'];
  testId?: string;
}

/**
 * Button that opens the Autosys bulk-import dialog ({@link MultiImport}); on
 * completion navigates to /vehicle-types filtered to the imported ids.
 * @param {AutosysImportFloatingMenuProps} props - optional look overrides.
 * @returns the trigger button plus its dialog.
 */
export default function AutosysImportFloatingMenu({
  label,
  startIcon = <LibraryAdd />,
  endIcon,
  variant = 'contained',
  testId = 'import-vehicle-multi-button',
}: AutosysImportFloatingMenuProps = {}) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const text = label ?? t('vehicleType.actions.importMulti');

  const handleImportComplete = (vehicleTypeIds: string[]) => {
    setOpen(false);
    if (vehicleTypeIds.length > 0) {
      const filterParam = vehicleTypeIds.join(',');
      navigate(`/vehicle-types?filter=${encodeURIComponent(filterParam)}`, { replace: true });
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
        aria-label={text}
        sx={{
          textTransform: 'none',
          // centre a tall endIcon (e.g. a logo img) on the label instead of its baseline
          '& .MuiButton-endIcon': { display: 'flex', alignItems: 'center', my: -0.5 },
        }}
      >
        {text}
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <MultiImport onClose={() => setOpen(false)} onImportComplete={handleImportComplete} />
      </Dialog>
    </>
  );
}
