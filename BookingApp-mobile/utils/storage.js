import AsyncStorage from '@react-native-async-storage/async-storage';

const BOOKINGS_KEY = 'user_bookings';

export const saveBooking = async (booking) => {
  try {
    const existingBookings = await getBookings();
    const newBooking = {
      ...booking,
      id: Date.now().toString(),
      bookingDate: new Date().toISOString(),
    };
    const updatedBookings = [...existingBookings, newBooking];
    await AsyncStorage.setItem(BOOKINGS_KEY, JSON.stringify(updatedBookings));
    return newBooking;
  } catch (error) {
    console.error('Error saving booking:', error);
    throw error;
  }
};

export const getBookings = async () => {
  try {
    const bookings = await AsyncStorage.getItem(BOOKINGS_KEY);
    return bookings ? JSON.parse(bookings) : [];
  } catch (error) {
    console.error('Error getting bookings:', error);
    return [];
  }
};

export const deleteBooking = async (bookingId) => {
  try {
    const existingBookings = await getBookings();
    const updatedBookings = existingBookings.filter(booking => booking.id !== bookingId);
    await AsyncStorage.setItem(BOOKINGS_KEY, JSON.stringify(updatedBookings));
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }
};