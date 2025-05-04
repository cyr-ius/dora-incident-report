import {
  ControlProps,
  isBooleanControl,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const YesNoBoolean = ({ data, handleChange, path, label }: ControlProps) => {
  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        value={data === true ? 'Yes' : data === false ? 'No' : ''}
        onChange={event => handleChange(path, event.target.value === 'Yes')}>
        <MenuItem value="Yes">Yes</MenuItem>
        <MenuItem value="No">No</MenuItem>
      </Select>
    </FormControl>
  );
};

export const YesNoBooleanRenderer = withJsonFormsControlProps(YesNoBoolean);

export const yesNoBooleanTester: RankedTester = rankWith(4, isBooleanControl);
