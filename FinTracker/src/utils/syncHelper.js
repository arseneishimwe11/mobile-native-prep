const handleDelete = async (id) => {
  try {
    const result = await removeExpense(id);
    
    if (result.success || result.error?.includes('404') || result.error?.includes('Not found')) {
      // Treat 404 as success since item is already gone
      Alert.alert('Success', 'Expense removed successfully!');
      fetchExpenses(); // Refresh to ensure sync
    } else {
      Alert.alert('Error', result.error || 'Failed to delete expense.');
    }
  } catch (error) {
    console.error('Delete error:', error);
    Alert.alert('Error', 'Something went wrong. Please try again.');
  }
};