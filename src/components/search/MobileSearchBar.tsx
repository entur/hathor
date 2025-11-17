import { Box } from '@mui/material';
import SearchAutocomplete from './SearchAutocomplete';
import SearchFilterControl from './SearchFilterControl';

interface MobileSearchBarProps {
  placeholder: string;
  onCloseRequest: () => void;
}

export default function MobileSearchBar({ placeholder, onCloseRequest }: MobileSearchBarProps) {
  return (
    <Box sx={{ flexGrow: 1, width: '100%', display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box sx={{ flexGrow: 1 }}>
        <SearchAutocomplete
          placeholder={placeholder}
          isMobile={true}
          onCloseRequest={onCloseRequest}
        />
      </Box>
      <SearchFilterControl />
    </Box>
  );
}
