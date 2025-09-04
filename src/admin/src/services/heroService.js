// services/firebaseService.js
import { ref, get, set, remove } from 'firebase/database';
import { db } from '../firebase/config';
const HERO_DATA_KEY = 'heroContent';

// Get hero data
export const getHeroData = async () => {
  try {
    const snapshot = await get(ref(db, HERO_DATA_KEY));
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null; // No data in DB
    }
  } catch (error) {
    console.error("Error fetching hero data:", error);
    throw error;
  }
};

// Create or Update hero data
export const setHeroData = async (data) => {
  try {
    await set(ref(db, HERO_DATA_KEY), data);
    console.log("Hero data saved successfully");
  } catch (error) {
    console.error("Error saving hero data:", error);
    throw error;
  }
};

// Delete hero data
export const deleteHeroData = async () => {
  try {
    await remove(ref(db, HERO_DATA_KEY));
    console.log("Hero data deleted successfully");
  } catch (error) {
    console.error("Error deleting hero data:", error);
    throw error;
  }
};