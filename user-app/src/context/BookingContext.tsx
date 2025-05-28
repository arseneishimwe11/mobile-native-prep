import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Bus } from '../data/busData';
import { getBookings, saveBookings } from '../utils/storage';

export interface Booking {
  id: string;
  busId: string;
  busName: string;
  route: string;
  departureTime: string;
  passengerName: string;
  phoneNumber: string;
  seats: number;
  totalPrice: number;
  bookingDate: string;
}

interface BookingContextType {
  bookings: Booking[];
  loading: boolean;
  addBooking: (booking: Omit<Booking, 'id' | 'bookingDate'>) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
  refreshBookings: () => Promise<void>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};

interface BookingProviderProps {
  children: ReactNode;
}

export const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const savedBookings = await getBookings();
      setBookings(savedBookings);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const addBooking = async (bookingData: Omit<Booking, 'id' | 'bookingDate'>) => {
    try {
      const newBooking: Booking = {
        ...bookingData,
        id: Date.now().toString(),
        bookingDate: new Date().toISOString(),
      };
      
      const updatedBookings = [...bookings, newBooking];
      await saveBookings(updatedBookings);
      setBookings(updatedBookings);
    } catch (error) {
      console.error('Failed to add booking:', error);
      throw error;
    }
  };

  const deleteBooking = async (id: string) => {
    try {
      const updatedBookings = bookings.filter(booking => booking.id !== id);
      await saveBookings(updatedBookings);
      setBookings(updatedBookings);
    } catch (error) {
      console.error('Failed to delete booking:', error);
      throw error;
    }
  };

  const refreshBookings = async () => {
    await loadBookings();
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        loading,
        addBooking,
        deleteBooking,
        refreshBookings,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};