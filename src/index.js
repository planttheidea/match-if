// utils
import {
  createCase, createMatch
} from './utils';

export const defaultsTo = createCase('defaultsTo');
export const is = createCase('is');
export const not = createCase('not');

export const match = createMatch(false);
export const matchAll = createMatch(true);
