import type { KeyboardEvent } from 'react';
import {
  Box,
  Autocomplete,
  TextField,
  InputAdornment,
  useTheme,
  CircularProgress,
  Typography,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useSearch } from './searchUtils';
import type { SearchResultItem } from './searchTypes';
import { getIconUrl } from '../../utils/iconLoaderUtils.ts';
import type { StopPlace } from '../../data/vehicle-types/stopPlaceTypes.ts';

const getIconKeyFromResult = (option: SearchResultItem): string => {
  if (option.originalData) {
    if (option.type === 'map') {
      const props = option.originalData as { icon?: string };
      return props.icon || 'default';
    }
    if (option.type === 'data') {
      const sp = option.originalData as StopPlace;
      if (sp.__typename === 'ParentStopPlace') {
        return 'parentStopPlace';
      }
      return sp.stopPlaceType || 'default';
    }
  }
  return 'default';
};

interface SearchAutocompleteProps {
  placeholder: string;
  isMobile?: boolean;
  onCloseRequest?: () => void;
}

export default function SearchAutocomplete({
  placeholder,
  isMobile = false,
  onCloseRequest,
}: SearchAutocompleteProps) {
  const theme = useTheme();
  const {
    searchQuery,
    setSearchQuery,
    performSearch,
    clearSearch,
    isLoading,
    activeSearchContext,
    suggestionResults,
    setSelectedItem,
  } = useSearch();

  const handleTextFieldKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && searchQuery.trim()) {
      performSearch();
      event.preventDefault();
    }
  };

  const handleClearAndClose = () => {
    clearSearch();
    if (onCloseRequest) {
      onCloseRequest();
    }
  };

  return (
    <Autocomplete<SearchResultItem, false, false, true>
      fullWidth
      value={null}
      inputValue={searchQuery}
      onInputChange={(_event, newInputValue, reason) => {
        if (reason === 'input') {
          setSearchQuery(newInputValue);
        } else if (reason === 'clear' && !isMobile) {
          setSearchQuery('');
        }
      }}
      options={suggestionResults}
      getOptionKey={option => (typeof option === 'string' ? option : option.id)}
      getOptionLabel={option => (typeof option === 'string' ? option : option.name || '')}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={(_event, value, reason) => {
        if (reason === 'selectOption' && value) {
          if (typeof value === 'string') {
            setSearchQuery(value);
            setTimeout(() => performSearch(), 0);
          } else {
            setSearchQuery(value.name);
            setSelectedItem(value);
            if (isMobile && onCloseRequest) {
              onCloseRequest();
            }
          }
        }
      }}
      renderOption={(props, option) => {
        const iconKey = getIconKeyFromResult(option);
        const iconUrl = getIconUrl(iconKey);
        return (
          <li {...props}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <Box
                component="img"
                src={iconUrl}
                sx={{ width: 24, height: 24, mr: 1.5, flexShrink: 0 }}
              />
              <Box>
                <Typography variant="body1">{option.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  ID: {option.id}
                </Typography>
              </Box>
            </Box>
          </li>
        );
      }}
      loading={isLoading}
      freeSolo
      disabled={isLoading || !activeSearchContext}
      onKeyDown={handleTextFieldKeyDown}
      renderInput={params => (
        <TextField
          {...params}
          autoFocus={isMobile}
          size="small"
          placeholder={placeholder}
          variant="outlined"
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <>
                  {isLoading && <CircularProgress color="inherit" size={20} sx={{ mr: 1 }} />}
                  {isMobile ? (
                    <IconButton
                      size="small"
                      onClick={handleClearAndClose}
                      aria-label="close search"
                    >
                      <CloseIcon />
                    </IconButton>
                  ) : (
                    params.InputProps.endAdornment
                  )}
                </>
              ),
              sx: {
                backgroundColor: theme.palette.background.default,
              },
            },
          }}
        />
      )}
    />
  );
}
