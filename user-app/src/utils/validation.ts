export const validateName = (name: string): string | null => {
  if (!name.trim()) {
    return 'Name is required';
  }
  if (name.trim().length < 3) {
    return 'Name must be at least 3 characters';
  }
  return null;
};

export const validatePhone = (phone: string): string | null => {
  if (!phone.trim()) {
    return 'Phone number is required';
  }
  
  // Basic phone validation - at least 10 digits
  const phoneRegex = /^\d{10,15}$/;
  if (!phoneRegex.test(phone.replace(/[^0-9]/g, ''))) {
    return 'Please enter a valid phone number (10-15 digits)';
  }
  
  return null;
};

export const validateSeats = (seats: string, availableSeats: number): string | null => {
  if (!seats.trim()) {
    return 'Number of seats is required';
  }
  
  const seatsNum = parseInt(seats, 10);
  
  if (isNaN(seatsNum) || seatsNum <= 0) {
    return 'Please enter a valid number of seats';
  }
  
  if (seatsNum > availableSeats) {
    return `Only ${availableSeats} seats available`;
  }
  
  return null;
};