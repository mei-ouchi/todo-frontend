import '@testing-library/jest-dom';
import { server } from './mocks/server';
import { beforeAll, afterEach, afterAll } from 'vitest';

beforeAll(() => server.listen()); //すべてのテストの前にサーバーを起動
afterEach(() => server.resetHandlers()); //各テストの後にハンドラーをリセット
afterAll(() => server.close()); //すべてのテストの後にサーバーを停止