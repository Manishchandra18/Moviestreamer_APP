export type UserProfile = {
  username: string;
  password: string;
  name: string;
  interests: string[];
  favorites: any[];
};

const USERS_KEY = 'users';

export function registerUser(profile: Omit<UserProfile, 'favorites'>) {
  const users = getAllUsers();
  if (users.find(u => u.username === profile.username)) {
    throw new Error('Username already exists');
  }
  const newUser: UserProfile = { ...profile, favorites: [] };
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem('currentUser', profile.username);
  return newUser;
}

export function getAllUsers(): UserProfile[] {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
}

export function getCurrentUser(): UserProfile | null {
  const username = localStorage.getItem('currentUser');
  if (!username) return null;
  return getAllUsers().find(u => u.username === username) || null;
}

export function updateCurrentUserProfile(updates: Partial<Omit<UserProfile, 'username' | 'favorites'>>) {
  const users = getAllUsers();
  const username = localStorage.getItem('currentUser');
  if (!username) return;
  const idx = users.findIndex(u => u.username === username);
  if (idx === -1) return;
  users[idx] = { ...users[idx], ...updates };
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function updateCurrentUserFavorites(favorites: any[]) {
  const users = getAllUsers();
  const username = localStorage.getItem('currentUser');
  if (!username) return;
  const idx = users.findIndex(u => u.username === username);
  if (idx === -1) return;
  users[idx].favorites = favorites;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
} 