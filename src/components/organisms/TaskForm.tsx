import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Box, Typography, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import Button from '../atoms/Button';
import FormField from '../molecules/FormField';
import type{ TaskFormInputs } from '../../features/tasks/schemas/taskSchemas';
import { TasksDtoStatusEnum } from '../../api';
import type{ TasksDto } from '../../api';
import type { UseFormReturn } from 'react-hook-form';
export interface TaskFormProps {
  initialData?: TasksDto;
  onSubmit: (data: TaskFormInputs) => void;
  onCancel?: () => void;
  methods?: UseFormReturn<TaskFormInputs>;
}

const TaskForm: React.FC<TaskFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const { handleSubmit, control } = useFormContext<TaskFormInputs>();

  return (
    <Box component="form" role="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        {initialData ? 'タスクを編集' : '新しいタスクを作成'}
      </Typography>
      <FormField name="title" label="タイトル" />
      <FormField name="description" label="説明" multiline rows={4} />

      <FormControl fullWidth margin="normal">
        <InputLabel id="status-label">状態</InputLabel>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select
              labelId="status-label"
              label="状態"
              {...field}
            >
              <MenuItem value={TasksDtoStatusEnum.Pending}>未完了</MenuItem>
              <MenuItem value={TasksDtoStatusEnum.Completed}>完了</MenuItem>
            </Select>
          )}
        />
      </FormControl>

      <FormField
        name="dueDate"
        label="期限"
        type="date"
        InputLabelProps={{
          shrink: true,
        }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button label="保存" type="submit" variant="contained" sx={{ mr: 1 }} />
        {onCancel && <Button label="キャンセル" variant="outlined" onClick={onCancel} />}
      </Box>
    </Box>
  );
};

export default TaskForm;