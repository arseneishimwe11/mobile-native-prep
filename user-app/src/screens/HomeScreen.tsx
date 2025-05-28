import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  SafeAreaView, 
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import BusCard from '../components/BusCard';
import Header from '../components/Header';
import busData, { Bus } from '../data/busData';
import colors from '../styles/colors';
import spacing from '../styles/spacing';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredBuses = busData.filter(bus => 
    bus.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bus.route.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBusPress = (bus: Bus) => {
    navigation.navigate('Details', { bus });
  };

  const navigateToMyBookings = () => {
    navigation.navigate('MyBookings');
  };

  const renderBusItem = ({ item }: { item: Bus }) => (
    <BusCard bus={item} onPress={handleBusPress} />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header 
        title="Local Bus Transport" 
        rightComponent={
          <TouchableOpacity onPress={navigateToMyBookings}>
            <Ionicons name="bookmarks-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        }
      />
      
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search buses or routes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textLight}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.textLight} />
            </TouchableOpacity>
          )}
        </View>
        
        <FlatList
          data={filteredBuses}
          renderItem={renderBusItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: colors.text,
    fontSize: 16,
  },
  listContent: {
    paddingBottom: spacing.lg,
  },
});

export default HomeScreen;