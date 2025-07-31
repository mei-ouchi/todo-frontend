import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { TextField as MuiTextField } from '@mui/material';
import type{ TextFieldProps } from '@mui/material';
import type{ TaskFormInputs } from '../../features/tasks/schemas/taskSchemas';

type FormFieldProps = TextFieldProps & {
  name: keyof TaskFormInputs;
  label: string;
};

const FormField: React.FC<FormFieldProps> = ({ name, label, ...props }) => {
  const { control } = useFormContext<TaskFormInputs>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <MuiTextField
          {...field}
          label={label}
          fullWidth
          margin="normal"
          error={!!error}
          helperText={error ? error.message : null}
          {...props}
        />
      )}
    />
  );
};

export default FormField;