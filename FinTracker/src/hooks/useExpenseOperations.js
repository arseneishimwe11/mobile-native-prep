import { useExpenses } from "../contexts/ExpenseContext";
import { Alert } from "react-native";

export const useExpenseOperations = () => {
  const { updateExpense, removeExpense, getExpenseById } = useExpenses();

  const handleEditExpense = async (navigation, expenseId) => {
    navigation.navigate("EditExpense", { expenseId });
  };

  const handleDeleteExpense = async (expenseId, onSuccess) => {
    Alert.alert(
      "Delete Expense",
      "Are you sure you want to delete this expense? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const result = await removeExpense(expenseId);
            if (result.success) {
              Alert.alert("Success", "Expense deleted successfully!");
              if (onSuccess) onSuccess();
            } else {
              Alert.alert("Error", result.error || "Failed to delete expense.");
            }
          },
        },
      ]
    );
  };

  return {
    handleEditExpense,
    handleDeleteExpense,
  };
};
