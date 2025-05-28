export interface Bus {
  id: string;
  name: string;
  route: string;
  departureTime: string;
  arrivalTime: string;
  totalSeats: number;
  availableSeats: number;
  price: number;
  image: string;
}

const busData: Bus[] = [
  {
    id: '1',
    name: 'Express Line',
    route: 'Downtown → Uptown',
    departureTime: '08:00 AM',
    arrivalTime: '09:30 AM',
    totalSeats: 45,
    availableSeats: 23,
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80'
  },
  {
    id: '2',
    name: 'City Cruiser',
    route: 'Central Park → Beach Side',
    departureTime: '09:15 AM',
    arrivalTime: '10:45 AM',
    totalSeats: 50,
    availableSeats: 15,
    price: 4.50,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1738&q=80'
  },
  {
    id: '3',
    name: 'Metro Connect',
    route: 'Riverside → Shopping District',
    departureTime: '10:30 AM',
    arrivalTime: '11:45 AM',
    totalSeats: 40,
    availableSeats: 8,
    price: 6.25,
    image: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80'
  },
  {
    id: '4',
    name: 'Urban Transit',
    route: 'Business District → Residential Area',
    departureTime: '12:00 PM',
    arrivalTime: '01:15 PM',
    totalSeats: 35,
    availableSeats: 20,
    price: 3.75,
    image: 'https://images.unsplash.com/photo-1556122071-e404cb6f31d0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80'
  },
  {
    id: '5',
    name: 'Rapid Shuttle',
    route: 'Airport → City Center',
    departureTime: '02:30 PM',
    arrivalTime: '03:45 PM',
    totalSeats: 30,
    availableSeats: 5,
    price: 8.50,
    image: 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1744&q=80'
  },
  {
    id: '6',
    name: 'Commuter Express',
    route: 'Suburbs → Downtown',
    departureTime: '04:00 PM',
    arrivalTime: '05:30 PM',
    totalSeats: 45,
    availableSeats: 12,
    price: 5.25,
    image: 'https://images.unsplash.com/photo-1559221884-5d91e38c1e2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80'
  },
  {
    id: '7',
    name: 'Night Rider',
    route: 'Entertainment District → Residential Areas',
    departureTime: '10:00 PM',
    arrivalTime: '11:30 PM',
    totalSeats: 35,
    availableSeats: 25,
    price: 7.00,
    image: 'https://images.unsplash.com/photo-1508059349937-e60d5c5f4dbd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80'
  }
];

export default busData;