import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Calendar, Users, Trash2 } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getImageUrl = (city: string) => {
  // Map of cities to specific, verified Unsplash photos
  const cityImages = {
    'Mumbai': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f',
    'Delhi': 'https://images.unsplash.com/photo-1587474260584-136574528ed5',
    'Jaipur': 'https://images.unsplash.com/photo-1599661046289-e31897846e41',
    'Goa': 'https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3',
    'Varanasi': 'https://images.unsplash.com/photo-1561361058-c24cecae35ca',
    'Agra': 'https://images.unsplash.com/photo-1548013146-72479768bada',
    'Udaipur': 'https://images.unsplash.com/photo-1599661046289-e31897846e41',
    'Rishikesh': 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7',
    'Kerala': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944',
    'Ladakh': 'https://images.unsplash.com/photo-1627896157734-4d7d4388f28b',
    'default': 'https://images.unsplash.com/photo-1599661046289-e31897846e41'
  };
  
  return cityImages[city] || cityImages.default;
};

export default function SavedScreen() {
  const router = useRouter();
  const [savedItineraries, setSavedItineraries] = useState([]);

  useEffect(() => {
    loadSavedItineraries();
  }, []);

  const loadSavedItineraries = async () => {
    try {
      const saved = await AsyncStorage.getItem('savedItineraries');
      if (saved) {
        const itineraries = JSON.parse(saved);
        // Update each itinerary with a verified image URL
        const updatedItineraries = itineraries.map(itinerary => ({
          ...itinerary,
          image: getImageUrl(itinerary.city)
        }));
        setSavedItineraries(updatedItineraries);
      }
    } catch (error) {
      console.error('Error loading saved itineraries:', error);
    }
  };

  const handleViewItinerary = (itinerary) => {
    router.push({
      pathname: '/itinerary',
      params: {
        city: itinerary.city,
        state: itinerary.state,
        days: itinerary.days,
        travelers: itinerary.travelers,
        budget: itinerary.budget,
      },
    });
  };

  const handleDeleteItinerary = async (id) => {
    try {
      const updatedItineraries = savedItineraries.filter(item => item.id !== id);
      await AsyncStorage.setItem('savedItineraries', JSON.stringify(updatedItineraries));
      setSavedItineraries(updatedItineraries);
    } catch (error) {
      console.error('Error deleting itinerary:', error);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Itineraries</Text>
        <Text style={styles.subtitle}>Your planned adventures</Text>
      </View>

      {savedItineraries.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No saved itineraries yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Save your favorite itineraries to access them later
          </Text>
        </View>
      ) : (
        savedItineraries.map((itinerary) => (
          <View key={itinerary.id} style={styles.itineraryCard}>
            <Image 
              source={{ uri: itinerary.image }} 
              style={styles.itineraryImage}
              resizeMode="cover"
            />
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.cityName}>{itinerary.city}</Text>
                  <View style={styles.locationContainer}>
                    <MapPin size={14} color="#666" />
                    <Text style={styles.stateText}>{itinerary.state}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteItinerary(itinerary.id)}>
                  <Trash2 size={20} color="#E44D26" />
                </TouchableOpacity>
              </View>

              <View style={styles.tripDetails}>
                <View style={styles.detailItem}>
                  <Calendar size={16} color="#666" />
                  <Text style={styles.detailText}>{itinerary.days} Days</Text>
                </View>
                <View style={styles.detailItem}>
                  <Users size={16} color="#666" />
                  <Text style={styles.detailText}>{itinerary.travelers} Travelers</Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.savedDate}>
                  Saved on {new Date(itinerary.savedDate).toLocaleDateString()}
                </Text>
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => handleViewItinerary(itinerary)}>
                  <Text style={styles.viewButtonText}>View Itinerary</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))
      )}
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
    backgroundColor: '#E44D26',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
    opacity: 0.8,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  itineraryCard: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  itineraryImage: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cityName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  stateText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  deleteButton: {
    padding: 8,
  },
  tripDetails: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  cardFooter: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savedDate: {
    fontSize: 12,
    color: '#666',
  },
  viewButton: {
    backgroundColor: '#E44D26',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});