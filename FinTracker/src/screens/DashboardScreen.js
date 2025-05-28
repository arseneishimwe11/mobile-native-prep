import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  RefreshControl,
  SafeAreaView,
  Platform,
  StatusBar,
  Dimensions,
  Animated,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useExpenses } from '../contexts/ExpenseContext';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const COLORS = {
  primary: '#667eea',
  primaryDark: '#5a67d8',
  secondary: '#764ba2',
  success: '#48bb78',
  danger: '#f56565',
  warning: '#ed8936',
  background: '#f7fafc',
  cardBackground: '#ffffff',
  textPrimary: '#2d3748',
  textSecondary: '#718096',
  white: '#ffffff',
  lightGrey: '#edf2f7',
  grey: '#a0aec0',
  shadow: 'rgba(0, 0, 0, 0.1)',
  gradientStart: '#667eea',
  gradientEnd: '#764ba2',
};

const SIZES = {
  base: 8,
  font: 16,
  padding: 20,
  radius: 12,
  headerHeight: 200,
};

// Number formatting utility
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  } else {
    return num.toFixed(2);
  }
};

// Currency formatting with abbreviation
const formatCurrency = (amount) => {
  const num = parseFloat(amount) || 0;
  return `$${formatNumber(num)}`;
};

// Simple gradient replacement component
const SimpleGradient = ({ colors, style, children, ...props }) => (
  <View style={[style, { backgroundColor: colors[0] }]} {...props}>
    {children}
  </View>
);

const DashboardScreen = () => {
  const { logout } = useAuth();
  const { expenses, isLoading, error, fetchExpenses, removeExpense } = useExpenses();
  const navigation = useNavigation();
  const [scrollY] = useState(new Animated.Value(0));

  // Add safety check for expenses
  const safeExpenses = expenses || [];

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const onRefresh = useCallback(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await removeExpense(id);
            
            if (result.success || result.error?.includes('404') || result.error?.includes('Not found')) {
              // Treat 404 as success since item is already gone
              Alert.alert('Success', 'Expense removed successfully!');
              fetchExpenses(); // Refresh to ensure sync
            } else {
              Alert.alert('Error', result.error || 'Failed to delete expense.');
            }
          },
        },
      ]
    );
  };

  const getTotalExpenses = () => {
    if (!safeExpenses || safeExpenses.length === 0) {
      return 0;
    }
    return safeExpenses.reduce((total, expense) => {
      const amount = typeof expense.amount === 'number' ? expense.amount : parseFloat(expense.amount) || 0;
      return total + amount;
    }, 0);
  };

  const getExpenseIcon = (description) => {
    if (!description) return '💰';
    const desc = description.toLowerCase();
    if (desc.includes('food') || desc.includes('lunch') || desc.includes('dinner') || desc.includes('coffee')) return '🍽️';
    if (desc.includes('transport') || desc.includes('uber') || desc.includes('taxi') || desc.includes('gas')) return '🚗';
    if (desc.includes('shopping') || desc.includes('clothes') || desc.includes('store')) return '🛍️';
    if (desc.includes('entertainment') || desc.includes('movie') || desc.includes('game')) return '🎬';
    if (desc.includes('health') || desc.includes('medical') || desc.includes('doctor')) return '🏥';
    return '💰';
  };

  const getThisMonthExpenses = () => {
    if (!safeExpenses || safeExpenses.length === 0) return 0;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return safeExpenses
      .filter(expense => {
        const expenseDate = new Date(expense.createdAt);
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
      })
      .reduce((total, expense) => {
        const amount = typeof expense.amount === 'number' ? expense.amount : parseFloat(expense.amount) || 0;
        return total + amount;
      }, 0);
  };

  const renderExpenseItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ExpenseDetail', { expenseId: item.id })}
      activeOpacity={0.7}
      style={[styles.expenseItem, { marginBottom: index === Math.min(safeExpenses.length - 1, 4) ? 100 : 16 }]}
    >
      <View style={styles.expenseIconContainer}>
        <Text style={styles.expenseIcon}>{getExpenseIcon(item.description)}</Text>
      </View>
      
      <View style={styles.expenseInfo}>
        <Text style={styles.expenseDescription} numberOfLines={1}>
          {item.description || 'No Description'}
        </Text>
        <Text style={styles.expenseDate}>
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }) : ''}
        </Text>
      </View>
      
      <View style={styles.expenseRight}>
        <Text style={styles.expenseAmount}>
          {formatCurrency(item.amount)}
        </Text>
        <TouchableOpacity 
          onPress={(e) => {
            e.stopPropagation();
            handleDelete(item.id);
          }} 
          style={styles.deleteButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.deleteButtonText}>×</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const ListHeader = () => (
    <View style={styles.headerContainer}>
      {/* Top Section with Greeting and Logout */}
      <SimpleGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        style={styles.topSection}
      >
        <View style={styles.topBar}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>Good {getTimeOfDay()}</Text>
            <Text style={styles.dateText}>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{formatCurrency(getTotalExpenses())}</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
            <Text style={styles.statFullValue}>
              ${getTotalExpenses().toFixed(2)}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{formatCurrency(getThisMonthExpenses())}</Text>
            <Text style={styles.statLabel}>This Month</Text>
            <Text style={styles.statFullValue}>
              ${getThisMonthExpenses().toFixed(2)}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{safeExpenses?.length || 0}</Text>
            <Text style={styles.statLabel}>Transactions</Text>
            <Text style={styles.statFullValue}>
              {safeExpenses?.length === 1 ? '1 expense' : `${safeExpenses?.length || 0} expenses`}
            </Text>
          </View>
        </View>
      </SimpleGradient>

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity 
          style={styles.addExpenseButton} 
          onPress={() => navigation.navigate('CreateExpense')}
          activeOpacity={0.8}
        >
          <SimpleGradient
            colors={[COLORS.success, '#38a169']}
            style={styles.addButtonGradient}
          >
            <Text style={styles.addButtonIcon}>+</Text>
            <Text style={styles.addButtonText}>Add New Expense</Text>
          </SimpleGradient>
        </TouchableOpacity>

        {/* View All Expenses Button */}
        <TouchableOpacity 
          style={styles.viewAllButton} 
          onPress={() => navigation.navigate('AllExpenses')}
          activeOpacity={0.8}
        >
          <Text style={styles.viewAllButtonText}>📊 View All Expenses</Text>
        </TouchableOpacity>
      </View>

      {/* Section Title */}
      <View style={styles.sectionTitleContainer}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <Text style={styles.sectionSubtitle}>
          {safeExpenses?.length ? `Last ${Math.min(5, safeExpenses.length)} transactions` : 'No transactions yet'}
        </Text>
      </View>
    </View>
  );

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  };

  const ListEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Text style={styles.emptyIcon}>📊</Text>
      </View>
      <Text style={styles.emptyTitle}>No Expenses Yet</Text>
      <Text style={styles.emptySubtitle}>
        Start tracking your spending by adding your first expense. 
        It's easy and helps you stay on budget!
      </Text>
      <TouchableOpacity 
        style={styles.emptyButton}
        onPress={() => navigation.navigate('CreateExpense')}
      >
        <Text style={styles.emptyButtonText}>Add Your First Expense</Text>
      </TouchableOpacity>
    </View>
  );

  if (error && safeExpenses.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchExpenses}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <FlatList
        data={safeExpenses.slice(0, 5)} // Show only first 5 expenses
        renderItem={renderExpenseItem}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={!isLoading ? ListEmpty : null}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={isLoading} 
            onRefresh={onRefresh} 
            colors={[COLORS.primary]} 
            tintColor={COLORS.primary}
            progressBackgroundColor={COLORS.white}
          />
        }
        bounces={true}
        overScrollMode="auto"
      />

      {isLoading && safeExpenses.length === 0 && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading your expenses...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContainer: {
    flexGrow: 1,
  },
  headerContainer: {
    backgroundColor: COLORS.background,
  },
  topSection: {
    paddingTop: Platform.OS === 'ios' ? 10 : StatusBar.currentHeight + 10 || 10,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: SIZES.padding,
    marginBottom: 30,
  },
  greetingContainer: {
    flex: 1,
  },
  greetingText: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dateText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  statValue: {
    color: COLORS.white,
    fontSize: 18, // Reduced from 20
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11, // Reduced from 12
    textAlign: 'center',
    marginBottom: 2,
  },
  statFullValue: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 9, // Small text showing full value
    textAlign: 'center',
    fontWeight: '400',
  },
  actionButtonsContainer: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: 20,
  },
  addExpenseButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: COLORS.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 12,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  addButtonIcon: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 8,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAllButton: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  viewAllButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitleContainer: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  expenseItem: {
    backgroundColor: COLORS.white,
    marginHorizontal: SIZES.padding,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
  },
  expenseIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  expenseIcon: {
    fontSize: 24,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  expenseDate: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  expenseRight: {
    alignItems: 'flex-end',
  },
  expenseAmount: {
    fontSize: 16, // Reduced from 18
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  deleteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.danger,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: SIZES.padding,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  emptyButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding * 2,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(247, 250, 252, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});

export default DashboardScreen;