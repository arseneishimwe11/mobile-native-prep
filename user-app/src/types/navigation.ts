import { Bus } from '../data/busData';

export type RootStackParamList = {
  Home: undefined;
  Details: { bus: Bus };
  BookBus: { bus: Bus };
  MyBookings: undefined;
};