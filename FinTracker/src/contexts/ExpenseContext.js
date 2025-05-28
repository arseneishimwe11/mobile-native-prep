import React, { createContext, useState, useContext, useCallback } from "react";
import expenseService from "../services/expenseService";

const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch all expenses
  const fetchExpenses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const result = await expenseService.getExpenses();
    if (result.success) {
      // Sort expenses by creation date, newest first (optional but good UX)
      const sortedExpenses = result.expenses.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setExpenses(sortedExpenses);
    } else {
      setError(result.error || "Failed to fetch expenses.");
      setExpenses([]); // Clear expenses on error
    }
    setIsLoading(false);
  }, []);

  // Get expense by ID
  const getExpenseById = useCallback(async (id) => {
    setError(null);
    const result = await expenseService.getExpenseById(id);
    if (!result.success) {
      setError(result.error || "Failed to fetch expense details.");
    }
    return result;
  }, []);

  // Add a new expense
  const addExpense = useCallback(async (expenseData) => {
    setIsLoading(true);
    setError(null);
    // Add current date if not provided by form (assuming API doesn't auto-add)
    const dataToSend = { ...expenseData, createdAt: new Date().toISOString() };
    const result = await expenseService.createExpense(dataToSend);
    setIsLoading(false);
    if (result.success) {
      // Add to local state immediately for responsiveness
      setExpenses((prevExpenses) =>
        [result.expense, ...prevExpenses].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      );
      return { success: true };
    } else {
      setError(result.error || "Failed to add expense.");
      return { success: false, error: result.error };
    }
  }, []);

  // Update an expense
  const updateExpense = useCallback(async (id, expenseData) => {
    setIsLoading(true);
    setError(null);
    const result = await expenseService.updateExpense(id, expenseData);
    setIsLoading(false);
    if (result.success) {
      // Update local state immediately for responsiveness
      setExpenses((prevExpenses) =>
        prevExpenses
          .map((expense) => (expense.id === id ? result.expense : expense))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
      return { success: true, expense: result.expense };
    } else {
      setError(result.error || "Failed to update expense.");
      return { success: false, error: result.error };
    }
  }, []);

  // Delete an expense
  const removeExpense = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    const result = await expenseService.deleteExpense(id);
    setIsLoading(false);
    if (result.success) {
      // Remove from local state
      setExpenses((prevExpenses) =>
        prevExpenses.filter((exp) => exp.id !== id)
      );
      return { success: true };
    } else {
      setError(result.error || "Failed to delete expense.");
      return { success: false, error: result.error };
    }
  }, []);

  // Function to get a single expense (might be needed for detail view later)
  // This could also live in the detail screen itself if not needed globally
  const getSingleExpense = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    const result = await expenseService.getExpenseById(id);
    setIsLoading(false);
    if (result.success) {
      return { success: true, expense: result.expense };
    } else {
      setError(result.error || "Failed to fetch expense details.");
      return { success: false, error: result.error };
    }
  }, []);

  const value = {
    expenses,
    isLoading,
    error,
    fetchExpenses,
    getExpenseById,
    addExpense,
    updateExpense,
    removeExpense,
    getSingleExpense,
    clearError,
  };

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error("useExpenses must be used within an ExpenseProvider");
  }
  return context;
};

export default ExpenseContext;
