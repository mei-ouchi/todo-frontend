import React from 'react';
import { TextField as MuiTextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';

export type CustomTextFieldProps = TextFieldProps & {
  label: string;
};

const TextField: React.FC<CustomTextFieldProps> = ({ label, ...props }) => {
  return <MuiTextField label={label} {...props} fullWidth margin="normal" />;
};

export default TextField;