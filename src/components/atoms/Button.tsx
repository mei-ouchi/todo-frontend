import React from 'react';
import { Button as MuiButton } from '@mui/material';
import type{ ButtonProps } from '@mui/material';

type CustomButtonProps = ButtonProps & {
  label: string;
};

const Button: React.FC<CustomButtonProps> = ({ label, ...props }) => {
  return <MuiButton {...props}>{label}</MuiButton>;
};

export default Button;