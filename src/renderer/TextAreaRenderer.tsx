import {
  ControlProps,
  isStringControl,
  rankWith,
  TesterContext,
} from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { FormControl, TextField } from '@mui/material';

const TextArea = (props: ControlProps) => {
  const hasError = props.errors?.length > 0;
  return (
    <FormControl fullWidth>
      <TextField
        {...props}
        onChange={event => props.handleChange(props.path, event.target.value)}
        value={props.data}
        multiline
        minRows={1} ></TextField>
    </FormControl>
  );
};

export const TextAreaRenderer = withJsonFormsControlProps(TextArea);

export const TextAreaTester = rankWith(
  10,
  (uischema, schema, context: TesterContext) => {
    if (!isStringControl(uischema, schema, context)) return false;

    const scope = (uischema as any).scope as string | undefined;
    if (!scope || !schema || !schema.properties) return false;

    const match = scope.match(/#\/properties\/([^/]+)/);
    if (!match) return false;

    const propName = match[1];
    const propSchema = schema.properties[propName];

    return (
      propSchema &&
      propSchema.type === 'string' &&
      typeof propSchema.maxLength === 'number' &&
      propSchema.maxLength >= 32767
    );
  },
);
