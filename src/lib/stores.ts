import { writable } from 'svelte/store';

export const THEME_KEY = 'svedocs:theme';

export const is_dark = writable(false);
