import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image, ScrollView, Platform } from 'react-native';
import { Search, MapPin, List } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import DestinationsModal from '../../components/DestinationsModal';
import { useState, useCallback, useMemo } from 'react';

const categories = [
  { id: '1', name: 'Historical', icon: '🏛️' },
  { id: '2', name: 'Nature', icon: '🌿' },
  { id: '3', name: 'Beach', icon: '🏖️' },
  { id: '4', name: 'Food', icon: '🍜' },
  { id: '5', name: 'Culture', icon: '🎭' },
  { id: '6', name: 'Adventure', icon: '🏔️' },
  { id: '7', name: 'Spiritual', icon: '🕉️' },
];

const destinations = [
  {
    id: '1',
    name: 'Mumbai',
    state: 'Maharashtra',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800',
    description: 'The City of Dreams',
    categories: ['Food', 'Culture'],
  },
  {
    id: '2',
    name: 'Delhi',
    state: 'Delhi',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800',
    description: 'The Heart of India',
    categories: ['Historical', 'Food'],
  },
  {
    id: '3',
    name: 'Jaipur',
    state: 'Rajasthan',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800',
    description: 'The Pink City',
    categories: ['Historical', 'Culture'],
  },
  {
    id: '4',
    name: 'Goa',
    state: 'Goa',
    image: 'https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?w=800',
    description: 'Beach Paradise',
    categories: ['Beach', 'Food'],
  },
  {
    id: '5',
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    image: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=800',
    description: 'The Spiritual Capital',
    categories: ['Spiritual', 'Culture'],
  },
  {
    id: '6',
    name: 'Agra',
    state: 'Uttar Pradesh',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
    description: 'City of the Taj Mahal',
    categories: ['Historical'],
  },
  {
    id: '7',
    name: 'Udaipur',
    state: 'Rajasthan',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800',
    description: 'City of Lakes',
    categories: ['Historical', 'Culture'],
  },
  {
    id: '8',
    name: 'Rishikesh',
    state: 'Uttarakhand',
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800',
    description: 'Yoga Capital of the World',
    categories: ['Spiritual', 'Adventure'],
  },
  {
    id: '9',
    name: 'Kerala',
    state: 'Kerala',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800',
    description: 'God\'s Own Country',
    categories: ['Nature', 'Beach'],
  },
  {
    id: '10',
    name: 'Ladakh',
    state: 'Ladakh',
    image: 'https://images.unsplash.com/photo-1627896157734-4d7d4388f28b?w=800',
    description: 'Land of High Passes',
    categories: ['Adventure', 'Nature'],
  },
  {
    id: '11',
    name: 'Hampi',
    state: 'Karnataka',
    image: 'https://images.unsplash.com/photo-1613473060226-dd81153a63db?w=800',
    description: 'The City of Ruins',
    categories: ['Historical', 'Culture'],
  },
  {
    id: '12',
    name: 'Andaman',
    state: 'Andaman & Nicobar',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',
    description: 'Paradise Islands',
    categories: ['Beach', 'Nature'],
  },
  {
    id: '14',
    name: 'Amritsar',
    state: 'Punjab',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800',
    description: 'The Golden City',
    categories: ['Spiritual', 'Food'],
  },
  {
    id: '15',
    name: 'Munnar',
    state: 'Kerala',
    image: 'https://images.unsplash.com/photo-1593181629936-11c609b8db9b?w=800',
    description: 'Kashmir of South India',
    categories: ['Nature', 'Adventure'],
  },
  {
    id: '17',
    name: 'Manali',
    state: 'Himachal Pradesh',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
    description: 'Valley of the Gods',
    categories: ['Adventure', 'Nature'],
  },
  {
    id: '19',
    name: 'Mysore',
    state: 'Karnataka',
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800',
    description: 'City of Palaces',
    categories: ['Historical', 'Culture'],
  },
  {
    id: '20',
    name: 'Pune',
    state: 'Maharashtra',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800',
    description: 'Oxford of the East',
    categories: ['Culture', 'Food'],
  },
  {
    id: '22',
    name: 'Ooty',
    state: 'Tamil Nadu',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800',
    description: 'Queen of Hill Stations',
    categories: ['Nature', 'Adventure'],
  },
  {
    id: '25',
    name: 'Gangtok',
    state: 'Sikkim',
    image: 'https://images.unsplash.com/photo-1593181629936-11c609b8db9b?w=800',
    description: 'Gateway to Sikkim',
    categories: ['Nature', 'Adventure'],
  },
  {
    id: '29',
    name: 'Mahabaleshwar',
    state: 'Maharashtra',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800',
    description: 'Strawberry Country',
    categories: ['Nature', 'Food'],
  },
  {
    id: '30',
    name: 'Shillong',
    state: 'Meghalaya',
    image: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=800',
    description: 'Scotland of the East',
    categories: ['Nature', 'Culture'],
  }
];

export default function DiscoverScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const handleDestinationPress = useCallback((destination) => {
    router.push({
      pathname: '/plan-trip',
      params: { city: destination.name, state: destination.state },
    });
  }, [router]);

  const renderDestinationCard = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.destinationCard}
      onPress={() => handleDestinationPress(item)}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: item.image }} 
          style={styles.destinationImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.destinationInfo}>
        <Text style={styles.destinationName}>{item.name}</Text>
        <View style={styles.locationContainer}>
          <MapPin size={14} color="#666" />
          <Text style={styles.destinationState}>{item.state}</Text>
        </View>
        <Text style={styles.destinationDescription}>{item.description}</Text>
        <View style={styles.categoryTags}>
          {item.categories.map((category, index) => (
            <View key={index} style={styles.categoryTag}>
              <Text style={styles.categoryTagText}>{category}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  ), [handleDestinationPress]);

  const renderCategoryItem = useCallback(({ item }) => (
    <TouchableOpacity 
      style={[
        styles.categoryItem,
        selectedCategory === item.name && styles.categoryItemSelected
      ]}
      onPress={() => setSelectedCategory(selectedCategory === item.name ? null : item.name)}>
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={[
        styles.categoryName,
        selectedCategory === item.name && styles.categoryNameSelected
      ]}>{item.name}</Text>
    </TouchableOpacity>
  ), [selectedCategory]);

  const filteredDestinations = useMemo(() => {
    return destinations.filter(destination => {
      const matchesSearch = destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          destination.state.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !selectedCategory || destination.categories.includes(selectedCategory);
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Discover India</Text>
          <TouchableOpacity 
            style={styles.listButton}
            onPress={() => setModalVisible(true)}>
            <List size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Find your perfect journey</Text>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search destinations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.categoriesContainer}>
        <Text style={styles.sectionTitle}>Explore by Category</Text>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      <View style={styles.popularContainer}>
        <Text style={styles.sectionTitle}>
          {searchQuery || selectedCategory ? 'Search Results' : 'Popular Destinations'}
        </Text>
        <FlatList
          data={filteredDestinations}
          renderItem={renderDestinationCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          ListEmptyComponent={() => (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>No destinations found</Text>
              <Text style={styles.noResultsSubtext}>Try adjusting your search or filters</Text>
            </View>
          )}
        />
      </View>

      <DestinationsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        destinations={destinations}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 15,
    color: '#333',
  },
  categoriesList: {
    paddingHorizontal: 15,
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 5,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    minWidth: 100,
  },
  categoryItemSelected: {
    backgroundColor: '#E44D26',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  categoryName: {
    fontSize: 14,
    color: '#333',
  },
  categoryNameSelected: {
    color: '#fff',
  },
  popularContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  destinationCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
  },
  destinationImage: {
    width: '100%',
    height: '100%',
    ...Platform.select({
      web: {
        objectFit: 'cover',
      },
    }),
  },
  destinationInfo: {
    padding: 15,
  },
  destinationName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  destinationState: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  destinationDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    marginBottom: 10,
  },
  categoryTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  categoryTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 5,
    marginBottom: 5,
  },
  categoryTagText: {
    fontSize: 12,
    color: '#666',
  },
  noResults: {
    padding: 20,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#666',
  },
  listButton: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 12,
  },
});