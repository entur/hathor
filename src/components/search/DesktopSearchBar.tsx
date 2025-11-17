import { Box } from '@mui/material';
import SearchAutocomplete from './SearchAutocomplete';
import SearchFilterControl from './SearchFilterControl';

interface DesktopSearchBarProps {
  placeholder: string;
}

export default function DesktopSearchBar({ placeholder }: DesktopSearchBarProps) {
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 400 }}>
        <SearchAutocomplete placeholder={placeholder} />
      </Box>
      <SearchFilterControl />
    </Box>
  );
}
