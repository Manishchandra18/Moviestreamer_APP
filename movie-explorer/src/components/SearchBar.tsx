import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Close';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import { useRef } from 'react';

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
};

export const SearchBar = ({ value, onChange, onSearch }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch();
  };

  return (
    <Paper
      component="form"
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        position: 'absolute',
        top: { xs: 24, md: 40 },
        left: '50%',
        transform: 'translateX(-50%)',
        width: { xs: '90%', sm: 500, md: 700, lg: 900 },
        maxWidth: '95vw',
        borderRadius: 3,
        boxShadow: 3,
        zIndex: 10,
      }}
      onSubmit={handleSubmit}
      elevation={4}
    >
      <InputBase
        inputRef={inputRef}
        sx={{ ml: 1, flex: 1, fontSize: '1.1rem' }}
        placeholder="Search movies..."
        inputProps={{ 'aria-label': 'search movies' }}
    value={value}
        onChange={e => onChange(e.target.value)}
        endAdornment={
          value && (
            <IconButton size="small" onClick={handleClear} aria-label="clear" sx={{ mr: 0.5 }}>
              <ClearIcon fontSize="small" />
            </IconButton>
          )
        }
  />
      <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
      <IconButton sx={{ p: '10px' }} aria-label="enter" onClick={onSearch}>
        <KeyboardReturnIcon />
      </IconButton>
    </Paper>
);
};
