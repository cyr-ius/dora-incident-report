import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { FC } from 'react';
import { useLocale } from '../context/LocaleContext';

export const LocaleButton: FC = () => {
  const { locale, setLocale } = useLocale();
  return (
    <Box className="App-language">
      <FormControl size="small">
        <InputLabel id="locale-label">Langue</InputLabel>
        <Select
          labelId="locale-label"
          value={locale}
          label="Langue"
          onChange={e => setLocale(e.target.value as 'en' | 'fr')}>
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="fr">Français</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};
