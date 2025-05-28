import AsyncStorage from '@react-native-async-storage/async-storage';
import { Booking } from '../context/BookingContext';

const BOOKINGS_KEY = '@lbta_bookings';

export const saveBookings = async (bookings: Booking[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  } catch (error) {
    console.error('Error saving bookings:', error);
    throw error;
  }
};

export const getBookings = async (): Promise<Booking[]> => {
  try {
    const bookingsJson = await AsyncStorage.getItem(BOOKINGS_KEY);
    return bookingsJson ? JSON.parse(bookingsJson) : [];
  } catch (error) {
    console.error('Error getting bookings:', error);
    return [];
  }
};

export const clearAllBookings = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(BOOKINGS_KEY);
  } catch (error) {
    console.error('Error clearing bookings:', error);
    throw error;
  }
};