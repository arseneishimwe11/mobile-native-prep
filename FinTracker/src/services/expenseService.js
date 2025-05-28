import apiClient from './apiClient';

// Function to create a new expense
const createExpense = async (expenseData) => {
  try {
    // Ensure all required fields are present
    const dataToSend = {
      title: expenseData.title,
      description: expenseData.description || expenseData.title,
      amount: expenseData.amount,
      category: expenseData.category,
      date: expenseData.date,
      createdAt: expenseData.createdAt || new Date().toISOString(),
    };

    const response = await apiClient.post('/expenses', dataToSend);
    return {
      success: true,
      expense: response.data,
    };
  } catch (error) {
    console.error('Create Expense API Error:', error.response || error.message);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to create expense. Please try again.',
    };
  }
};

// Function to get all expenses
const getExpenses = async () => {
  try {
    const response = await apiClient.get('/expenses');
    return {
      success: true,
      expenses: response.data,
    };
  } catch (error) {
    console.error('Get Expenses API Error:', error.response || error.message);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch expenses. Please try again.',
    };
  }
};

// Function to get a single expense by ID
const getExpenseById = async (id) => {
  try {
    const response = await apiClient.get(`/expenses/${id}`);
    return {
      success: true,
      expense: response.data,
    };
  } catch (error) {
    console.error('Get Expense By ID API Error:', error.response || error.message);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch expense details. Please try again.',
    };
  }
};

// Function to update an expense by ID
const updateExpense = async (id, expenseData) => {
  try {
    const dataToSend = {
      title: expenseData.title,
      description: expenseData.description || expenseData.title,
      amount: expenseData.amount,
      category: expenseData.category,
      date: expenseData.date,
      updatedAt: new Date().toISOString(),
    };

    const response = await apiClient.put(`/expenses/${id}`, dataToSend);
    return {
      success: true,
      expense: response.data,
    };
  } catch (error) {
    console.error('Update Expense API Error:', error.response || error.message);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update expense. Please try again.',
    };
  }
};

// Function to delete an expense by ID
const deleteExpense = async (id) => {
  try {
    console.log(`Attempting to delete expense with ID: ${id}`);
    
    const response = await apiClient.delete(`/expenses/${id}`);
    
    return {
      success: true,

      message: 'Expense deleted successfully'
    };
  } catch (error) {

    console.error('Delete Expense API Error:', error);
    
    // Handle specific error cases
    if (error.response?.status === 404) {
      return {
        success: true, // Treat as success since the item is already gone
        message: 'Expense was already deleted',
        wasAlreadyDeleted: true
      };
    }
    
    return {
      success: false,

      error: error.response?.data?.message || 
             error.message || 
             'Failed to delete expense. Please try again.'
    };
  }
};

// A method to verify expense exists before deletion
const verifyExpenseExists = async (id) => {
  try {
    await apiClient.get(`/expenses/${id}`);
    return true;
  } catch (error) {
    if (error.response?.status === 404) {
      return false;
    }
    throw error;
  }
};

const expenseService = {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  verifyExpenseExists,
};

export default expenseService;
