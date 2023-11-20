import { User } from './index.js';

export type Comment = {
  text: string;
  date: string;
  rating: number;
  user: User;
  }
