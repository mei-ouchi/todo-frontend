import { setupServer } from 'msw/node';
import { handlers } from './handlers';

//Node.js環境でモックサーバーをセットアップ
export const server = setupServer(...handlers);