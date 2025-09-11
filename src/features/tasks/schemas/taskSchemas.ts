import { z } from 'zod';

//タスク作成用のスキーマ
export const taskSchema = z.object({
  title: z.string()
    .min(1, { message: 'タイトルは必須です。' })
    .max(20, { message: 'タイトルは20文字以内で入力してください。' }),
  description: z.string()
    .max(50, { message: '説明は50文字以内で入力してください。' })
    .regex(/^[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}\p{Punctuation}\p{Symbol}\s]*$/u, { message: '説明には半角英数字を含めることはできません。' })
    .nullable()
    .optional(),
  status: z.enum(['PENDING', 'COMPLETED']),
  dueDate: z.string().refine((val) => {
    if (!val) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inputDate = new Date(val);
    inputDate.setHours(0, 0, 0, 0);
    return inputDate >= today;
  }, {
    message: '期限は過去の日付に設定できません。',
  }).nullable().optional(),
});

//タスク編集用のスキーマ
export const taskUpdateSchema = z.object({
  title: z.string()
    .min(1, { message: 'タイトルは必須です。' })
    .max(20, { message: 'タイトルは20文字以内で入力してください。' }),
  description: z.string()
    .max(50, { message: '説明は50文字以内で入力してください。' })
    .regex(/^[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}\p{Punctuation}\p{Symbol}\s]*$/u, { message: '説明には半角英数字を含めることはできません。' })
    .nullable()
    .optional(),
  status: z.enum(['PENDING', 'COMPLETED']),
  dueDate: z.string().nullable().optional(),
});


export type TaskFormInputs = z.infer<typeof taskSchema>;
export type TaskUpdateFormInputs = z.infer<typeof taskUpdateSchema>;