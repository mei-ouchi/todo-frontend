import { describe, it, expect } from 'vitest';
import { taskSchema, taskUpdateSchema } from './taskSchemas';

describe('taskSchemas', () => {

  //taskSchema(タスクの新規作成)のテスト
  describe('taskSchema for creation', () => {
    it('should validate a valid task', () => {
      const validTask = {
        title: 'Valid Task Title',
        description: 'これはテストです',
        status: 'PENDING',
        dueDate: '2026-01-01',
      };
      const result = taskSchema.safeParse(validTask);
      expect(result.success).toBe(true);
    });

    it('should fail validation if title is empty', () => {
      const invalidTask = {
        title: '',
        status: 'PENDING',
      };
      const result = taskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('タイトルは必須です。');
      }
    });

    it('should fail validation if dueDate is in the past', () => {
      const invalidTask = {
        title: 'Past Due Date Task',
        status: 'PENDING',
        dueDate: '2024-01-01',
      };
      const result = taskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('期限は過去の日付に設定できません。');
      }
    });
  });

  //taskUpdateSchema(タスクの編集)のテスト
  describe('taskUpdateSchema for update', () => {
    it('should validate a task with a past due date', () => {
      const validTask = {
        title: 'Updated Task',
        status: 'COMPLETED',
        dueDate: '2024-01-01',
      };
      const result = taskUpdateSchema.safeParse(validTask);
      expect(result.success).toBe(true);
    });

    it('should still require a title', () => {
      const invalidTask = {
        title: '',
        status: 'PENDING',
      };
      const result = taskUpdateSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('タイトルは必須です。');
      }
    });
  });
});