import React, { useEffect } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Typography, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import Button from '../atoms/Button';
import FormField from '../molecules/FormField';
import { taskSchema } from '../../features/tasks/schemas/taskSchemas';
import type{ TaskFormInputs } from '../../features/tasks/schemas/taskSchemas';
import { TasksDtoStatusEnum } from '../../api';
import type{ TasksDto } from '../../api';

interface TaskFormProps {
  initialData?: TasksDto;
  onSubmit: (data: TaskFormInputs) => void;
  onCancel?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const methods = useForm<TaskFormInputs>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: TasksDtoStatusEnum.Pending,
      dueDate: '',
    },
  });

  const { handleSubmit, reset, control, formState: { errors } } = methods;

  useEffect(() => {
    if (initialData) {
      const formattedDueDate = initialData.dueDate
        ? new Date(initialData.dueDate).toISOString().split('T')[0]
        : '';

      reset({
        title: initialData.title,
        description: initialData.description || '',
        status: initialData.status || TasksDtoStatusEnum.Pending,
        dueDate: formattedDueDate,
      });
    } else {
      reset({
        title: '',
        description: '',
        status: TasksDtoStatusEnum.Pending,
        dueDate: '',
      });
    }
  }, [initialData, reset]);

  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
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
    </FormProvider>
  );
};

export default TaskForm;