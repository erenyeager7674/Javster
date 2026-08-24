// stores.js
import { writable } from 'svelte/store';

export const nsfwTweets = writable([]);
export const currentUser = writable(null);
export const loading = writable(false);
export const error = writable('');
