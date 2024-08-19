import MenuItem from '@mui/material/MenuItem';
import * as React from "react";
import classes from './LocaleSwitcher.module.css';
import {FormControl, InputLabel, Select} from '@mui/material';

function changeLocale(event, setLocale){
  setLocale(event.target.value);
}

function LocaleSwitcher({ currentLocale, setLocale }){
  const selectLabels = {
    'pl-PL': {
      selectLabel: 'Region',
    },
    'en-US': {
      selectLabel: 'Locale',
    },
  };

  return(
      <div className={classes.locale_container}>
        <FormControl>
          <InputLabel id='locale-label'>{selectLabels[currentLocale].selectLabel}</InputLabel>
          <Select
            labelId='locale-label'
            id='locale-select'
            value={currentLocale}
            label={selectLabels[currentLocale].selectLabel}
            onChange={
              (event) => changeLocale(event, setLocale)
            }
          >
            <MenuItem value='pl-PL'>Polski (Polish)</MenuItem>
            <MenuItem value='en-US'>English (United States)</MenuItem>
          </Select>
        </FormControl>
      </div>
  );
}

export default LocaleSwitcher;