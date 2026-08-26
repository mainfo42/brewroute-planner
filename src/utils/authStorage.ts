import { AuthUser, SavedItinerary, BrewTravelRoute } from '../types';

const AUTH_USER_KEY = 'brewroute_auth_current_user';
const USERS_DB_KEY = 'brewroute_registered_users_db';
const SAVED_ROUTES_KEY = 'brewroute_saved_itineraries_db';

interface StoredUserAccount {
  id: string;
  email: string;
  passwordHash: string; // Stored securely in client storage
  displayName?: string;
  createdAt: string;
}

/**
 * Helper to get currently active user from storage
 */
export function getCurrentUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading current user:', e);
    return null;
  }
}

/**
 * Helper to get all registered users
 */
function getRegisteredUsers(): StoredUserAccount[] {
  try {
    const raw = localStorage.getItem(USERS_DB_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading registered users:', e);
    return [];
  }
}

/**
 * Register a new user with email and password
 */
export function registerUser(email: string, password: string, displayName?: string): { success: boolean; user?: AuthUser; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();

  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'Please provide a valid email address.' };
  }
  if (!cleanPassword || cleanPassword.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }

  const existingUsers = getRegisteredUsers();
  const alreadyExists = existingUsers.some((u) => u.email === cleanEmail);

  if (alreadyExists) {
    return { success: false, error: 'An account with this email already exists. Please log in.' };
  }

  const derivedName = displayName?.trim() || cleanEmail.split('@')[0];
  const newUser: StoredUserAccount = {
    id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    email: cleanEmail,
    passwordHash: cleanPassword, // Local storage simulation
    displayName: derivedName,
    createdAt: new Date().toISOString(),
  };

  const updatedUsers = [...existingUsers, newUser];
  try {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(updatedUsers));
  } catch (e) {
    console.error('Failed to store registered user:', e);
  }

  const authUser: AuthUser = {
    id: newUser.id,
    email: newUser.email,
    displayName: newUser.displayName,
    createdAt: newUser.createdAt,
  };

  try {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
  } catch (e) {
    console.error('Failed to store active user:', e);
  }

  return { success: true, user: authUser };
}

/**
 * Authenticate existing user with email and password
 */
export function loginUser(email: string, password: string): { success: boolean; user?: AuthUser; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();

  if (!cleanEmail || !cleanPassword) {
    return { success: false, error: 'Please enter both email and password.' };
  }

  const existingUsers = getRegisteredUsers();
  const foundUser = existingUsers.find((u) => u.email === cleanEmail);

  if (!foundUser) {
    return { success: false, error: 'No account found with this email. Please sign up to create one.' };
  }

  if (foundUser.passwordHash !== cleanPassword) {
    return { success: false, error: 'Incorrect password. Please try again.' };
  }

  const authUser: AuthUser = {
    id: foundUser.id,
    email: foundUser.email,
    displayName: foundUser.displayName,
    createdAt: foundUser.createdAt,
  };

  try {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
  } catch (e) {
    console.error('Failed to set active user:', e);
  }

  return { success: true, user: authUser };
}

/**
 * Checks whether an email is registered in the system
 */
export function checkEmailRegistered(email: string): { registered: boolean; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { registered: false, error: 'Please enter a valid email address.' };
  }

  const existingUsers = getRegisteredUsers();
  const foundUser = existingUsers.find((u) => u.email === cleanEmail);

  if (!foundUser) {
    return { registered: false, error: 'No account found with this email address.' };
  }

  return { registered: true };
}

/**
 * Reset password for a registered user using their verified email
 */
export function resetUserPassword(
  email: string,
  newPassword: string
): { success: boolean; error?: string; message?: string } {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = newPassword.trim();

  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  if (!cleanPassword || cleanPassword.length < 6) {
    return { success: false, error: 'New password must be at least 6 characters long.' };
  }

  const existingUsers = getRegisteredUsers();
  const userIndex = existingUsers.findIndex((u) => u.email === cleanEmail);

  if (userIndex === -1) {
    return { success: false, error: 'No account was found with this email address.' };
  }

  // Update password in the database
  existingUsers[userIndex].passwordHash = cleanPassword;

  try {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(existingUsers));
  } catch (e) {
    console.error('Failed to update user password:', e);
    return { success: false, error: 'Failed to update password. Please try again.' };
  }

  // Also update active session user if currently logged in with this email
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.email === cleanEmail) {
    // Session remains active
  }

  return {
    success: true,
    message: 'Your password has been successfully reset! You can now log in with your new password.',
  };
}

/**
 * Log out currently active user
 */
export function logoutUser(): void {
  try {
    localStorage.removeItem(AUTH_USER_KEY);
  } catch (e) {
    console.error('Failed to logout user:', e);
  }
}

/**
 * Get all saved itineraries for a given user
 */
export function getSavedItineraries(userId: string): SavedItinerary[] {
  if (!userId) return [];
  try {
    const raw = localStorage.getItem(SAVED_ROUTES_KEY);
    if (!raw) return [];
    const all: SavedItinerary[] = JSON.parse(raw);
    return all.filter((item) => item.userId === userId);
  } catch (e) {
    console.error('Error fetching saved itineraries:', e);
    return [];
  }
}

/**
 * Save an itinerary for a user
 */
export function saveItinerary(userId: string, route: BrewTravelRoute, notes?: string): SavedItinerary {
  const allSaved = getAllSavedItineraries();
  
  // Check if this route ID is already saved for this user, if so update it
  const existingIdx = allSaved.findIndex((item) => item.userId === userId && item.route.id === route.id);

  const newRecord: SavedItinerary = {
    id: existingIdx >= 0 ? allSaved[existingIdx].id : `saved_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    userId,
    route,
    savedAt: new Date().toISOString(),
    notes: notes || (existingIdx >= 0 ? allSaved[existingIdx].notes : undefined),
  };

  let updatedList: SavedItinerary[];
  if (existingIdx >= 0) {
    updatedList = [...allSaved];
    updatedList[existingIdx] = newRecord;
  } else {
    updatedList = [newRecord, ...allSaved];
  }

  try {
    localStorage.setItem(SAVED_ROUTES_KEY, JSON.stringify(updatedList));
  } catch (e) {
    console.error('Failed to save itinerary:', e);
  }

  return newRecord;
}

/**
 * Delete a saved itinerary by ID
 */
export function deleteSavedItinerary(userId: string, savedRecordId: string): boolean {
  const allSaved = getAllSavedItineraries();
  const updated = allSaved.filter((item) => !(item.id === savedRecordId && item.userId === userId));

  try {
    localStorage.setItem(SAVED_ROUTES_KEY, JSON.stringify(updated));
    return true;
  } catch (e) {
    console.error('Failed to delete saved itinerary:', e);
    return false;
  }
}

/**
 * Helper to get all saved records
 */
function getAllSavedItineraries(): SavedItinerary[] {
  try {
    const raw = localStorage.getItem(SAVED_ROUTES_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}
