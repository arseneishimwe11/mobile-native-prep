import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useExpenses } from "../contexts/ExpenseContext";

const EditExpenseScreen = ({ route, navigation }) => {
  const { expenseId } = route.params;
  const { updateExpense, getExpenseById, error, clearError } = useExpenses();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    category: "",
    date: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingExpense, setIsLoadingExpense] = useState(true);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  // Categories for the picker
  const categories = [
    "Food & Dining",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Bills & Utilities",
    "Healthcare",
    "Travel",
    "Education",
    "Other",
  ];

  // Load expense data when component mounts
  useEffect(() => {
    loadExpenseData();
  }, [expenseId]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const loadExpenseData = async () => {
    setIsLoadingExpense(true);
    const result = await getExpenseById(expenseId);
    if (result.success) {
      const expense = result.expense;
      setFormData({
        title: expense.title || "",
        description: expense.description || "",
        amount: expense.amount ? expense.amount.toString() : "",
        category: expense.category || "",
        date: expense.date || "",
      });
    } else {
      Alert.alert(
        "Error",
        "Failed to load expense details. Please try again.",
        [
          {
            text: "Go Back",
            onPress: () => navigation.goBack(),
          },
          {
            text: "Retry",
            onPress: loadExpenseData,
          },
        ]
      );
    }
    setIsLoadingExpense(false);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      Alert.alert("Validation Error", "Please enter a title for the expense.");
      return false;
    }
    if (!formData.amount.trim()) {
      Alert.alert("Validation Error", "Please enter an amount.");
      return false;
    }
    if (
      isNaN(parseFloat(formData.amount)) ||
      parseFloat(formData.amount) <= 0
    ) {
      Alert.alert(
        "Validation Error",
        "Please enter a valid amount greater than 0."
      );
      return false;
    }
    if (!formData.category) {
      Alert.alert("Validation Error", "Please select a category.");
      return false;
    }
    if (!formData.date.trim()) {
      Alert.alert("Validation Error", "Please enter a date.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    const expenseData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date.trim(),
    };

    const result = await updateExpense(expenseId, expenseData);

    setIsSubmitting(false);

    if (result.success) {
      Alert.alert("Success", "Expense updated successfully!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } else {
      Alert.alert(
        "Error",
        result.error || "Failed to update expense. Please try again."
      );
    }
  };

  // const formatDate = (dateString) => {
  //   try {
  //     const date = new Date(dateString);
  //     return date.toISOString().split("T")[0]; // YYYY-MM-DD format
  //   } catch {
  //     return dateString;
  //   }
  // };

  if (isLoadingExpense) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#f7fafc" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading expense details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f7fafc" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Custom Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Edit Expense</Text>

          <TouchableOpacity
            style={[
              styles.saveButton,
              isSubmitting && styles.saveButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeOpacity={0.7}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Form Content */}
        <ScrollView
          style={styles.form}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.formContent}
          keyboardShouldPersistTaps="handled"
        >
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              value={formData.title}
              onChangeText={(value) => handleInputChange("title", value)}
              placeholder="Enter expense title"
              maxLength={100}
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(value) => handleInputChange("description", value)}
              placeholder="Enter description (optional)"
              multiline
              numberOfLines={3}
              maxLength={500}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount *</Text>
            <TextInput
              style={styles.input}
              value={formData.amount}
              onChangeText={(value) => handleInputChange("amount", value)}
              placeholder="0.00"
              keyboardType="numeric"
              maxLength={10}
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category *</Text>
            <TouchableOpacity
              style={styles.categoryButton}
              onPress={() => setShowCategoryPicker(!showCategoryPicker)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  !formData.category && styles.placeholderText,
                ]}
              >
                {formData.category || "Select a category"}
              </Text>
              <Text
                style={[
                  styles.dropdownIcon,
                  showCategoryPicker && styles.dropdownIconRotated,
                ]}
              >
                ▼
              </Text>
            </TouchableOpacity>

            {showCategoryPicker && (
              <View style={styles.categoryPicker}>
                <ScrollView
                  style={styles.categoryPickerScroll}
                  nestedScrollEnabled
                >
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryOption,
                        formData.category === category &&
                          styles.selectedCategory,
                      ]}
                      onPress={() => {
                        handleInputChange("category", category);
                        setShowCategoryPicker(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.categoryOptionText,
                          formData.category === category &&
                            styles.selectedCategoryText,
                        ]}
                      >
                        {category}
                      </Text>
                      {formData.category === category && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date *</Text>
            <TextInput
              style={styles.input}
              value={formData.date}
              onChangeText={(value) => handleInputChange("date", value)}
              placeholder="YYYY-MM-DD"
              maxLength={10}
              returnKeyType="done"
            />
          </View>

          {/* Add some bottom padding for better scrolling */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7fafc",
  },
  container: {
    flex: 1,
    backgroundColor: "#f7fafc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7fafc",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cancelButton: {
    padding: 5,
    minWidth: 60,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a202c",
    flex: 1,
    textAlign: "center",
  },
  saveButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonDisabled: {
    backgroundColor: "#a0aec0",
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  form: {
    flex: 1,
  },
  formContent: {
    padding: 20,
    paddingBottom: 40,
  },
  errorContainer: {
    backgroundColor: "#fed7d7",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#c53030",
  },
  errorText: {
    color: "#c53030",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2d3748",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: "#2d3748",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  categoryButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryButtonText: {
    fontSize: 16,
    color: "#2d3748",
  },
  placeholderText: {
    color: "#a0aec0",
  },
  dropdownIcon: {
    fontSize: 12,
    color: "#718096",
    transform: [{ rotate: "0deg" }],
  },
  dropdownIconRotated: {
    transform: [{ rotate: "180deg" }],
  },
  categoryPicker: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    marginTop: 5,
    maxHeight: 200,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryPickerScroll: {
    maxHeight: 200,
  },
  categoryOption: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f7fafc",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedCategory: {
    backgroundColor: "#ebf8ff",
  },
  categoryOptionText: {
    fontSize: 16,
    color: "#2d3748",
  },
  selectedCategoryText: {
    color: "#007AFF",
    fontWeight: "600",
  },
  checkmark: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "bold",
    marginLeft: 5,
  },
  bottomPadding: {
    height: 20,
  },
});

export default EditExpenseScreen;
