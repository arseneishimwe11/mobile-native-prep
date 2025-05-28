const API_BASE_URL = 'https://jsonplaceholder.typicode.com'; // Example fake API
// You can replace this with any fake API like:
// - https://reqres.in/api
// - https://fakestoreapi.com
// - https://dummyjson.com
// - Your exam's provided API URL

class ApiService {
  // Generic API call method
  async makeRequest(endpoint, options = {}) {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Get all buses
  async getBuses() {
    // For demo, we'll use JSONPlaceholder posts and transform them to bus data
    const posts = await this.makeRequest('/posts');
    
    // Transform the fake data to match our bus structure
    return posts.slice(0, 10).map((post, index) => ({
      id: post.id.toString(),
      name: `Bus ${post.id} - ${post.title.split(' ').slice(0, 2).join(' ')}`,
      route: `Route ${index + 1}: City A → City B`,
      departureTime: `${8 + index}:00 AM`,
      arrivalTime: `${10 + index}:30 AM`,
      price: 25 + (index * 5),
      availableSeats: 45 - (index * 3),
      totalSeats: 50,
      image: `https://picsum.photos/300/200?random=${post.id}`,
      amenities: ['WiFi', 'AC', 'Charging Port', 'Reclining Seats'],
    }));
  }

  // Get single bus details
  async getBusById(busId) {
    const post = await this.makeRequest(`/posts/${busId}`);
    
    return {
      id: post.id.toString(),
      name: `Bus ${post.id} - ${post.title.split(' ').slice(0, 2).join(' ')}`,
      route: `Route ${post.id}: City A → City B`,
      departureTime: `${8 + (post.id % 12)}:00 AM`,
      arrivalTime: `${10 + (post.id % 12)}:30 AM`,
      price: 25 + (post.id * 5),
      availableSeats: 45 - (post.id % 20),
      totalSeats: 50,
      image: `https://picsum.photos/300/200?random=${post.id}`,
      amenities: ['WiFi', 'AC', 'Charging Port', 'Reclining Seats'],
    };
  }

  // Create a booking
  async createBooking(bookingData) {
    const response = await this.makeRequest('/posts', {
      method: 'POST',
      body: JSON.stringify({
        title: `Booking for ${bookingData.passengerName}`,
        body: JSON.stringify(bookingData),
        userId: 1,
      }),
    });

    return {
      id: response.id.toString(),
      ...bookingData,
      bookingDate: new Date().toISOString(),
      status: 'confirmed',
    };
  }

  // Get user bookings
  async getUserBookings(userId = 1) {
    // For demo, get user's posts and transform to bookings
    const posts = await this.makeRequest(`/users/${userId}/posts`);
    
    return posts.slice(0, 5).map((post, index) => ({
      id: post.id.toString(),
      busId: post.id.toString(),
      busName: `Bus ${post.id} - Express`,
      route: `Route ${index + 1}: City A → City B`,
      departureTime: `${9 + index}:00 AM`,
      arrivalTime: `${11 + index}:30 AM`,
      price: 30 + (index * 5),
      passengerName: 'John Doe',
      phoneNumber: '+1234567890',
      numberOfSeats: 1 + (index % 3),
      totalPrice: (30 + (index * 5)) * (1 + (index % 3)),
      bookingDate: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toISOString(),
      status: 'confirmed',
    }));
  }

  // Cancel a booking
  async cancelBooking(bookingId) {
    await this.makeRequest(`/posts/${bookingId}`, {
      method: 'DELETE',
    });
    return { success: true, message: 'Booking cancelled successfully' };
  }
}

export default new ApiService();