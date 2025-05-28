import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Animated,
  Platform,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useExpenses } from "../contexts/ExpenseContext";
import expenseService from "../services/expenseService";

const { width, height } = Dimensions.get("window");

const COLORS = {
  primary: "#6C5CE7",
  secondary: "#A29BFE",
  success: "#00B894",
  danger: "#E17055",
  warning: "#FDCB6E",
  background: "#F8F9FA",
  cardBackground: "#FFFFFF",
  textPrimary: "#2D3436",
  textSecondary: "#636E72",
  white: "#FFFFFF",
  lightGrey: "#DDD6FE",
  grey: "#B2BEC3",
  shadow: "rgba(108, 92, 231, 0.15)",
};

const SIZES = {
  base: 8,
  font: 16,
  padding: 20,
  radius: 16,
  headerHeight: 120,
};

// Simple gradient replacement component
const SimpleGradient = ({ colors, style, children, ...props }) => (
  <View style={[style, { backgroundColor: colors[0] }]} {...props}>
    {children}
  </View>
);

const ExpenseDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { expenseId } = route.params;
  const { removeExpense, isLoading: isDeleting } = useExpenses();

  const [expense, setExpense] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  const fetchExpenseDetails = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const result = await expenseService.getExpenseById(expenseId);
    if (result.success) {
      setExpense(result.expense);
      // Animate content in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      setError(result.error || "Failed to load expense details.");
      Alert.alert("Error", result.error || "Failed to load expense details.");
    }
    setIsLoading(false);
  }, [expenseId, fadeAnim, slideAnim]);

  useEffect(() => {
    fetchExpenseDetails();
  }, [fetchExpenseDetails]);

  const getExpenseIcon = (description) => {
    if (!description) return "💰";
    const desc = description.toLowerCase();
    if (
      desc.includes("food") ||
      desc.includes("lunch") ||
      desc.includes("dinner") ||
      desc.includes("coffee")
    )
      return "🍽️";
    if (
      desc.includes("transport") ||
      desc.includes("uber") ||
      desc.includes("taxi") ||
      desc.includes("gas")
    )
      return "🚗";
    if (
      desc.includes("shopping") ||
      desc.includes("clothes") ||
      desc.includes("store")
    )
      return "🛍️";
    if (
      desc.includes("entertainment") ||
      desc.includes("movie") ||
      desc.includes("game")
    )
      return "🎬";
    if (
      desc.includes("health") ||
      desc.includes("medical") ||
      desc.includes("doctor")
    )
      return "🏥";
    return "💰";
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Expense",
      "Are you sure you want to delete this expense? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const result = await removeExpense(expenseId);
            if (result.success) {
              Alert.alert("Success", "Expense deleted successfully.", [
                { text: "OK", onPress: () => navigation.goBack() },
              ]);
            } else {
              Alert.alert("Error", result.error || "Failed to delete expense.");
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

        {/* Header */}
        <SimpleGradient
          colors={[COLORS.primary, COLORS.secondary]}
          style={styles.header}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Expense Details</Text>
          <View style={styles.headerRight} />
        </SimpleGradient>

        <View style={styles.loadingContainer}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading expense details...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !expense) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

        {/* Header */}
        <SimpleGradient
          colors={[COLORS.primary, COLORS.secondary]}
          style={styles.header}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Expense Details</Text>
          <View style={styles.headerRight} />
        </SimpleGradient>

        <View style={styles.errorContainer}>
          <View style={styles.errorCard}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorTitle}>Something went wrong</Text>
            <Text style={styles.errorText}>
              {error || "Expense not found."}
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={fetchExpenseDetails}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const formattedDate = expense.createdAt
    ? new Date(expense.createdAt).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";
  const formattedTime = expense.createdAt
    ? new Date(expense.createdAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";
  const formattedAmount =
    typeof expense.amount === "number"
      ? expense.amount.toFixed(2)
      : expense.amount;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <SimpleGradient
        colors={[COLORS.primary, COLORS.secondary]}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Expense Details</Text>
        <View style={styles.headerRight} />
      </SimpleGradient>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.mainCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Expense Icon and Amount */}
          <View style={styles.expenseHeader}>
            <View style={styles.iconContainer}>
              <Text style={styles.expenseIcon}>
                {getExpenseIcon(expense.description)}
              </Text>
            </View>
            <Text style={styles.amountText}>${formattedAmount}</Text>
            <Text style={styles.amountLabel}>Total Amount</Text>
          </View>

          {/* Expense Details */}
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <View style={styles.detailIconContainer}>
                <Text style={styles.detailIcon}>📝</Text>
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Description</Text>
                <Text style={styles.detailValue}>{expense.description}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIconContainer}>
                <Text style={styles.detailIcon}>📅</Text>
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>{formattedDate}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIconContainer}>
                <Text style={styles.detailIcon}>⏰</Text>
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Time</Text>
                <Text style={styles.detailValue}>{formattedTime}</Text>
              </View>
            </View>

            <View style={[styles.detailRow, styles.lastDetailRow]}>
              <View style={styles.detailIconContainer}>
                <Text style={styles.detailIcon}>🔢</Text>
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Expense ID</Text>
                <Text style={[styles.detailValue, styles.idValue]}>
                  {expense.id}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View
          style={[
            styles.actionContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
            disabled={isDeleting}
            activeOpacity={0.8}
          >
            <SimpleGradient
              colors={[COLORS.danger, "#D63031"]}
              style={styles.buttonGradient}
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <>
                  <Text style={styles.buttonIcon}>🗑️</Text>
                  <Text style={styles.buttonText}>Delete Expense</Text>
                </>
              )}
            </SimpleGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("EditExpense", { expenseId: expense.id })
            }
            style={styles.editButton}
          >
            <Text style={styles.editButtonText}>Edit Expense</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Additional Info Card */}
        <Animated.View
          style={[
            styles.infoCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.infoTitle}>💡 Quick Tips</Text>
          <Text style={styles.infoText}>
            • Keep track of your daily expenses to better manage your budget
            {"\n"}• Review your spending patterns regularly{"\n"}• Set monthly
            spending goals to stay on track
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    height: SIZES.headerHeight,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SIZES.padding,
    paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight || 0,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "bold",
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "bold",
  },
  headerRight: {
    width: 40,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: SIZES.padding,
    paddingBottom: SIZES.padding * 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SIZES.padding,
  },
  loadingCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius * 1.5,
    padding: SIZES.padding * 2,
    alignItems: "center",
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
  },
  loadingText: {
    marginTop: SIZES.padding,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SIZES.padding,
  },
  errorCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius * 1.5,
    padding: SIZES.padding * 2,
    alignItems: "center",
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: SIZES.padding,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: SIZES.base,
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SIZES.padding * 2,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.padding,
    paddingHorizontal: SIZES.padding * 2,
    borderRadius: SIZES.radius,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  mainCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius * 1.5,
    marginBottom: SIZES.padding * 1.5,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
    overflow: "hidden",
  },
  expenseHeader: {
    alignItems: "center",
    paddingVertical: SIZES.padding * 2,
    paddingHorizontal: SIZES.padding,
    backgroundColor: COLORS.lightGrey,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SIZES.padding,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 4,
  },
  expenseIcon: {
    fontSize: 36,
  },
  amountText: {
    fontSize: 42,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: SIZES.base / 2,
  },
  amountLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  detailsContainer: {
    padding: SIZES.padding * 1.5,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  lastDetailRow: {
    borderBottomWidth: 0,
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SIZES.padding,
  },
  detailIcon: {
    fontSize: 18,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  idValue: {
    fontSize: 14,
    color: COLORS.grey,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  actionContainer: {
    marginBottom: SIZES.padding * 1.5,
  },
  actionButton: {
    borderRadius: SIZES.radius,
    overflow: "hidden",
    marginBottom: SIZES.padding,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 4,
  },
  deleteButton: {
    shadowColor: "rgba(225, 112, 85, 0.3)",
  },
  editButton: {
    shadowColor: "rgba(253, 203, 110, 0.3)",
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SIZES.padding,
    paddingHorizontal: SIZES.padding * 1.5,
  },
  buttonIcon: {
    fontSize: 18,
    marginRight: SIZES.base,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding * 1.5,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 4,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: SIZES.padding,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
});

export default ExpenseDetailScreen;
