import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Clock, MapPin, Coffee, Utensils, Bed, Map, BookmarkPlus } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const cityItineraries = {
  'Mumbai': {
    places: {
      historical: ['Gateway of India', 'Chhatrapati Shivaji Terminus', 'Elephanta Caves', 'Prince of Wales Museum', 'Haji Ali Dargah'],
      food: ['Leopold Cafe', 'Britannia & Co.', 'Trishna', 'Swati Snacks', 'Mohammad Ali Road Food Street'],
      shopping: ['Colaba Causeway', 'Fashion Street', 'Linking Road', 'Crawford Market', 'Chor Bazaar'],
      cultural: ['Dharavi', 'Bollywood Studios', 'Kala Ghoda Arts District', 'Jehangir Art Gallery', 'NCPA'],
    },
  },
  'Delhi': {
    places: {
      historical: ['Red Fort', 'Qutub Minar', 'Humayun\'s Tomb', 'India Gate', 'Jama Masjid'],
      food: ['Karim\'s', 'Paranthe Wali Gali', 'Indian Accent', 'Bukhara', 'Dilli Haat'],
      shopping: ['Chandni Chowk', 'Connaught Place', 'Sarojini Nagar', 'Khan Market', 'Dilli Haat'],
      cultural: ['National Museum', 'Akshardham Temple', 'Lotus Temple', 'National Gallery of Modern Art', 'Nizamuddin Dargah'],
    },
  },
  'Jaipur': {
    places: {
      historical: ['Amber Fort', 'Hawa Mahal', 'City Palace', 'Jantar Mantar', 'Nahargarh Fort'],
      food: ['Lassiwala', 'Niros Restaurant', 'Sanjay Omelette', 'Lakshmi Misthan Bhandar', 'Chokhi Dhani'],
      shopping: ['Johari Bazaar', 'Bapu Bazaar', 'Tripolia Bazaar', 'Nehru Bazaar', 'Kishanpole Bazaar'],
      cultural: ['Albert Hall Museum', 'Jawahar Kala Kendra', 'Raj Mandir Cinema', 'Birla Temple', 'Central Museum'],
    },
  },
  'Goa': {
    places: {
      historical: ['Basilica of Bom Jesus', 'Fort Aguada', 'Se Cathedral', 'Chapora Fort', 'Church of St. Francis of Assisi'],
      food: ['Fisherman\'s Wharf', 'Thalassa', 'Britto\'s', 'Vinayak Family Restaurant', 'Gunpowder'],
      shopping: ['Anjuna Flea Market', 'Mapusa Market', 'Calangute Market Square', 'Arpora Night Market', 'Margao Municipal Market'],
      cultural: ['Museum of Goa', 'Houses of Goa Museum', 'Ancestral Goa', 'Goa State Museum', 'Mario Gallery'],
    },
  },
  'Varanasi': {
    places: {
      historical: ['Kashi Vishwanath Temple', 'Ramnagar Fort', 'Alamgir Mosque', 'Chunar Fort', 'Gyanvapi Mosque'],
      food: ['Deena Chat Bhandar', 'Kashi Chat Bhandar', 'Blue Lassi Shop', 'Pizzeria Vaatika Cafe', 'Canton Royale'],
      shopping: ['Vishwanath Gali', 'Thatheri Bazaar', 'Godowlia Market', 'Chowk', 'Lanka Market'],
      cultural: ['Ghats of Varanasi', 'Banaras Hindu University', 'Bharat Mata Temple', 'Sarnath', 'Assi Ghat'],
    },
  },
  'Udaipur': {
    places: {
      historical: ['City Palace', 'Lake Palace', 'Jagdish Temple', 'Bagore Ki Haveli', 'Sajjangarh Palace'],
      food: ['Ambrai', 'Upre', 'Tribute Restaurant', 'Royal Repast', 'Savage Garden'],
      shopping: ['Hathi Pol Bazaar', 'Bada Bazaar', 'Clock Tower Market', 'Lake City Mall', 'Chetak Circle'],
      cultural: ['Bagore Ki Haveli Museum', 'Shilpgram', 'Bharatiya Lok Kala Museum', 'Vintage Car Museum', 'Saheliyon Ki Bari'],
    },
  },
  'Rishikesh': {
    places: {
      historical: ['Lakshman Jhula', 'Ram Jhula', 'Triveni Ghat', 'Neelkanth Mahadev Temple', 'Beatles Ashram'],
      food: ['Chotiwala', 'Little Buddha Cafe', 'Freedom Cafe', '60\'s Cafe', 'Pyramid Cafe'],
      shopping: ['Lakshman Jhula Market', 'Ram Jhula Market', 'Ganga Beach Market', 'Local Market', 'Tibetan Market'],
      cultural: ['Parmarth Niketan', 'Sivananda Ashram', 'Swarg Ashram', 'Gita Bhavan', 'Yoga Study Centre'],
    },
  },
  'Darjeeling': {
    places: {
      historical: ['Ghoom Monastery', 'Peace Pagoda', 'Himalayan Mountaineering Institute', 'Toy Train', 'Tiger Hill'],
      food: ['Glenary\'s', 'Kunga Restaurant', 'Keventer\'s', 'Nathmull\'s Tea Room', 'Hot Stimulating Cafe'],
      shopping: ['Mahakal Market', 'Chowk Bazaar', 'Dragon Market', 'Batasia Market', 'Mall Road'],
      cultural: ['Japanese Peace Pagoda', 'Tibetan Refugee Self Help Center', 'Padmaja Naidu Himalayan Zoo', 'Rock Garden', 'Happy Valley Tea Estate'],
    },
  },
  'Amritsar': {
    places: {
      historical: ['Golden Temple', 'Jallianwala Bagh', 'Wagah Border', 'Gobindgarh Fort', 'Ram Bagh Palace'],
      food: ['Brothers Dhaba', 'Kesar Da Dhaba', 'Bharawan Da Dhaba', 'Makhan Fish', 'Beera Chicken House'],
      shopping: ['Hall Bazaar', 'Lawrence Road', 'Katra Jaimal Singh Market', 'Guru Bazaar', 'Shastri Market'],
      cultural: ['Partition Museum', 'Central Sikh Museum', 'Maharaja Ranjit Singh Museum', 'War Memorial', 'Ram Tirath Temple'],
    },
  },
  'Munnar': {
    places: {
      historical: ['Tata Tea Museum', 'Christ Church', 'Munnar Indo-Swiss Farm', 'Old Munnar Town', 'Kannan Devan Hills'],
      food: ['Saravana Bhavan', 'Rapsy Restaurant', 'Royal Retreat', 'SN Restaurant', 'Copper Castle'],
      shopping: ['Munnar Market', 'Abbas & Company', 'Mattupetty Dam Market', 'Krishna Shopping Centre', 'Spice Market'],
      cultural: ['Punarjani Traditional Village', 'Kalari Centre', 'Tea Gardens', 'Blossom Hydel Park', 'Srishti Welfare Center'],
    },
  },
  'Manali': {
    places: {
      historical: ['Hadimba Temple', 'Naggar Castle', 'Vashisht Temple', 'Manu Temple', 'Buddhist Monasteries'],
      food: ['Johnson\'s Cafe', 'Casa Bella Vista', 'Drifters\' Cafe', 'Renaissance Cafe', 'Mount View Restaurant'],
      shopping: ['Mall Road', 'Old Manali Market', 'Tibetan Market', 'Manu Market', 'Hong Kong Market'],
      cultural: ['Museum of Himachal Culture', 'Naggar Art Gallery', 'Gauri Shankar Temple', 'Nicholas Roerich Art Gallery', 'Club House'],
    },
  },
  'Mysore': {
    places: {
      historical: ['Mysore Palace', 'Chamundi Hill Temple', 'St. Philomena\'s Church', 'Jaganmohan Palace', 'Lalitha Mahal'],
      food: ['Vinayaka Mylari', 'RRR Restaurant', 'Hotel Hanumanthu', 'Oyster Bay', 'Hotel Siddharta'],
      shopping: ['Devaraja Market', 'Cauvery Arts & Crafts Emporium', 'Mall of Mysore', 'Sayyaji Rao Road', 'Ashoka Road'],
      cultural: ['Folklore Museum', 'Rail Museum', 'Melody World Wax Museum', 'Sand Sculpture Museum', 'Regional Museum of Natural History'],
    },
  },
  'Ooty': {
    places: {
      historical: ['St. Stephen\'s Church', 'Stone House', 'Nilgiri Mountain Railway', 'Government Rose Garden', 'Ooty Lake'],
      food: ['Earl\'s Secret', 'Quality Restaurant', 'Sidewalk Cafe', 'Willy\'s Coffee Pub', 'King\'s Cliff'],
      shopping: ['Commercial Road', 'Tibetan Market', 'Upper Bazaar Road', 'Main Bazaar', 'Charing Cross'],
      cultural: ['Tea Museum', 'Thread Garden', 'Tribal Research Centre Museum', 'Toda Huts', 'Government Museum'],
    },
  },
  'Gangtok': {
    places: {
      historical: ['Enchey Monastery', 'Do Drul Chorten', 'Rumtek Monastery', 'Tsuk La Khang', 'Ganesh Tok'],
      food: ['Baker\'s Cafe', 'Roll House', 'Taste of Tibet', 'The Square', 'Mu Kimchi'],
      shopping: ['MG Marg', 'Lal Market', 'New Market', 'Old Market', 'Dragon Market'],
      cultural: ['Namgyal Institute of Tibetology', 'Directorate of Handicrafts & Handloom', 'Ridge Park', 'Flower Exhibition Centre', 'Tashi View Point'],
    },
  },
  'Shillong': {
    places: {
      historical: ['Ward\'s Lake', 'Lady Hydari Park', 'Shillong Peak', 'Cathedral of Mary Help of Christians', 'All Saints\' Church'],
      food: ['City Hut Family Dhaba', 'Cafe Shillong', 'ML 05 Cafe', 'Jadoh', 'You & I Arts Cafe'],
      shopping: ['Police Bazaar', 'Bara Bazaar', 'Glory\'s Plaza', 'Lewduh Market', 'OB Shopping Mall'],
      cultural: ['Don Bosco Museum', 'State Museum', 'Butterfly Museum', 'Air Force Museum', 'Captain Williamson Sangma State Museum'],
    },
  },
  'Agra': {
    places: {
      historical: ['Taj Mahal', 'Agra Fort', 'Fatehpur Sikri', 'Akbar\'s Tomb', 'Mehtab Bagh'],
      food: ['Pinch of Spice', 'Bon Barbecue', 'Joney\'s Place', 'Cafeteria', 'Pind Balluchi'],
      shopping: ['Sadar Bazaar', 'Kinari Bazaar', 'Raja Ki Mandi', 'Subhash Bazaar', 'TDI Mall'],
      cultural: ['Kalakriti Cultural Center', 'Taj Museum', 'Mariam\'s Tomb', 'Ram Bagh', 'Chini ka Rauza'],
    },
  },
  'Kerala': {
    places: {
      historical: ['Fort Kochi', 'Mattancherry Palace', 'Jewish Synagogue', 'Hill Palace Museum', 'Bekal Fort'],
      food: ['Grand Pavilion', 'Paragon Restaurant', 'Dhe Puttu', 'Kayees Rahmathulla Hotel', 'Salkara Restaurant'],
      shopping: ['Lulu Mall', 'Broadway Market', 'Marine Drive', 'MG Road', 'Jew Town'],
      cultural: ['Kerala Kathakali Centre', 'Kerala Folklore Museum', 'Kochi-Muziris Biennale', 'Vasco da Gama Square', 'Greenix Village'],
    },
  },
  'Ladakh': {
    places: {
      historical: ['Leh Palace', 'Hemis Monastery', 'Thiksey Monastery', 'Shanti Stupa', 'Namgyal Tsemo Monastery'],
      food: ['Leh View Restaurant', 'Lamayuru Restaurant', 'Chopsticks Noodle Bar', 'Gesmo Restaurant', 'Summer Harvest'],
      shopping: ['Leh Main Market', 'Moti Market', 'Tibetan Handicraft Market', 'Old Town Market', 'Ladakh Art Palace'],
      cultural: ['Hall of Fame', 'Central Asian Museum', 'Ladakh Arts & Media Organization', 'Stok Palace Museum', 'Ladakh Cultural Centre'],
    },
  },
  'Hampi': {
    places: {
      historical: ['Virupaksha Temple', 'Vittala Temple', 'Lotus Mahal', 'Queen\'s Bath', 'Elephant Stables'],
      food: ['Mango Tree Restaurant', 'Laughing Buddha', 'Gopi Island Restaurant', 'New Shanthi Restaurant', 'Hampi Roof'],
      shopping: ['Hampi Bazaar', 'Virupapura Gadde', 'Anegundi Craft Market', 'Hampi World Heritage Market', 'Local Handicraft Shops'],
      cultural: ['Archaeological Museum', 'Tungabhadra Dam', 'Sasivekalu Ganesha Temple', 'Kadalekalu Ganesha Temple', 'Achyutaraya Temple'],
    },
  },
  'Andaman': {
    places: {
      historical: ['Cellular Jail', 'Ross Island', 'Viper Island', 'Japanese Bunkers', 'Chatham Saw Mill'],
      food: ['New Lighthouse Restaurant', 'Annapurna Restaurant', 'Icy Spicy', 'Mandalay Restaurant', 'Amaya'],
      shopping: ['Aberdeen Bazaar', 'Sagarika Emporium', 'MG Road Market', 'Phoenix Bay Market', 'City Centre Shopping Complex'],
      cultural: ['Anthropological Museum', 'Samudrika Marine Museum', 'Zonal Anthropological Museum', 'Forest Museum', 'Fisheries Museum'],
    },
  },
  'Pune': {
    places: {
      historical: ['Aga Khan Palace', 'Shaniwar Wada', 'Sinhagad Fort', 'Lal Mahal', 'Pataleshwar Cave Temple'],
      food: ['Vaishali', 'Goodluck Cafe', 'Kayani Bakery', 'German Bakery', 'Savya Rasa'],
      shopping: ['MG Road', 'Laxmi Road', 'FC Road', 'Hong Kong Lane', 'Phoenix Market City'],
      cultural: ['Raja Dinkar Kelkar Museum', 'National War Museum', 'Tribal Cultural Museum', 'Pune University', 'NFAI'],
    },
  },
  'Mahabaleshwar': {
    places: {
      historical: ['Pratapgad Fort', 'Mahabaleshwar Temple', 'Old Mahabaleshwar Temple', 'Bombay Point', 'Arthur\'s Seat'],
      food: ['The Grapevine', 'Imperial Restaurant', 'Bagicha Corner', 'Elsie\'s Dairy', 'Mapro Garden Restaurant'],
      shopping: ['Town Bazaar', 'Imperial Mall', 'Mahabaleshwar Market', 'Mapro Garden Shop', 'Maharashtra Emporium'],
      cultural: ['Venna Lake', 'Lingmala Waterfall', 'Wilson Point', 'Elephant\'s Head Point', 'Kate\'s Point'],
    },
  }
};

const generateItinerary = (city: string, days: number) => {
  const cityData = cityItineraries[city];
  
  if (!cityData) {
    return generateDefaultItinerary(days);
  }

  const allPlaces = Object.values(cityData.places).flat();
  let placeIndex = 0;
  const itinerary = [];

  for (let day = 1; day <= days; day++) {
    const activities = [
      {
        time: '09:00 AM',
        activity: 'Breakfast',
        location: cityData.places.food ? cityData.places.food[day % cityData.places.food.length] : 'Local Restaurant',
        duration: '1 hour',
        type: 'meal',
        icon: Coffee,
      },
      {
        time: '10:30 AM',
        activity: allPlaces[placeIndex % allPlaces.length],
        location: city,
        duration: '2.5 hours',
        type: 'activity',
        icon: MapPin,
      },
      {
        time: '01:00 PM',
        activity: 'Lunch',
        location: cityData.places.food ? cityData.places.food[(day + 1) % cityData.places.food.length] : 'Traditional Restaurant',
        duration: '1.5 hours',
        type: 'meal',
        icon: Utensils,
      },
      {
        time: '03:00 PM',
        activity: allPlaces[(placeIndex + 1) % allPlaces.length],
        location: city,
        duration: '3 hours',
        type: 'activity',
        icon: MapPin,
      },
      {
        time: '07:00 PM',
        activity: 'Dinner',
        location: cityData.places.food ? cityData.places.food[(day + 2) % cityData.places.food.length] : 'Local Cuisine Restaurant',
        duration: '1.5 hours',
        type: 'meal',
        icon: Utensils,
      },
      {
        time: '09:00 PM',
        activity: 'Return to Hotel',
        location: 'Hotel',
        duration: 'Overnight',
        type: 'accommodation',
        icon: Bed,
      },
    ];

    placeIndex += 2;
    itinerary.push({
      day,
      activities,
    });
  }

  return itinerary;
};

const generateDefaultItinerary = (days: number) => {
  const itinerary = [];
  
  for (let day = 1; day <= days; day++) {
    const activities = [
      {
        time: '09:00 AM',
        activity: 'Breakfast',
        location: 'Local Restaurant',
        duration: '1 hour',
        type: 'meal',
        icon: Coffee,
      },
      {
        time: '10:30 AM',
        activity: 'Sightseeing',
        location: 'City Center',
        duration: '2.5 hours',
        type: 'activity',
        icon: MapPin,
      },
      {
        time: '01:00 PM',
        activity: 'Lunch',
        location: 'Traditional Restaurant',
        duration: '1.5 hours',
        type: 'meal',
        icon: Utensils,
      },
      {
        time: '03:00 PM',
        activity: 'Cultural Visit',
        location: 'Local Attraction',
        duration: '3 hours',
        type: 'activity',
        icon: MapPin,
      },
      {
        time: '07:00 PM',
        activity: 'Dinner',
        location: 'Local Cuisine Restaurant',
        duration: '1.5 hours',
        type: 'meal',
        icon: Utensils,
      },
      {
        time: '09:00 PM',
        activity: 'Return to Hotel',
        location: 'Hotel',
        duration: 'Overnight',
        type: 'accommodation',
        icon: Bed,
      },
    ];

    itinerary.push({
      day,
      activities,
    });
  }

  return itinerary;
};

const openInGoogleMaps = (location: string, city: string) => {
  const encodedLocation = encodeURIComponent(`${location}, ${city}`);
  const url = Platform.select({
    ios: `maps://maps.apple.com/?q=${encodedLocation}`,
    android: `geo:0,0?q=${encodedLocation}`,
    web: `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`,
  });

  if (url) {
    Linking.openURL(url).catch((err) => 
      console.error('Error opening maps:', err)
    );
  }
};

export default function ItineraryScreen() {
  const { city, state, days, travelers, budget } = useLocalSearchParams();
  const router = useRouter();
  const [itinerary, setItinerary] = useState([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (city && days) {
      const generatedItinerary = generateItinerary(city as string, Number(days));
      setItinerary(generatedItinerary);
    }
  }, [city, days]);

  useEffect(() => {
    checkIfSaved();
  }, []);

  const checkIfSaved = async () => {
    try {
      const savedItineraries = await AsyncStorage.getItem('savedItineraries');
      if (savedItineraries) {
        const itineraries = JSON.parse(savedItineraries);
        const isSaved = itineraries.some(it => 
          it.city === city && 
          it.state === state && 
          it.days === Number(days) && 
          it.travelers === Number(travelers)
        );
        setSaved(isSaved);
      }
    } catch (error) {
      console.error('Error checking saved status:', error);
    }
  };

  const handleSave = async () => {
    try {
      const existingData = await AsyncStorage.getItem('savedItineraries');
      const currentItineraries = existingData ? JSON.parse(existingData) : [];
      
      const newItinerary = {
        id: Date.now().toString(),
        city,
        state,
        days: Number(days),
        travelers: Number(travelers),
        budget,
        savedDate: new Date().toISOString(),
        image: `https://source.unsplash.com/featured/?${encodeURIComponent(city as string)},landmark`,
      };

      const updatedItineraries = [...currentItineraries, newItinerary];
      await AsyncStorage.setItem('savedItineraries', JSON.stringify(updatedItineraries));
      
      setSaved(true);
      setTimeout(() => {
        router.push('/saved');
      }, 1000);
    } catch (error) {
      console.error('Error saving itinerary:', error);
    }
  };

  const renderActivityContent = (activity) => {
    const Icon = activity.icon;
    const isMeal = activity.type === 'meal';
    
    return (
      <View style={styles.activityDetails}>
        <Icon size={20} color="#E44D26" style={styles.activityIcon} />
        <View style={styles.activityInfo}>
          <Text style={styles.activityName}>{activity.activity}</Text>
          <Text style={styles.activityLocation}>{activity.location}</Text>
          
          {isMeal && (
            <TouchableOpacity 
              style={styles.mapButton}
              onPress={() => openInGoogleMaps(activity.location, city as string)}>
              <Map size={16} color="#E44D26" />
              <Text style={styles.mapButtonText}>View Restaurant</Text>
            </TouchableOpacity>
          )}
          
          {activity.type === 'activity' && (
            <TouchableOpacity 
              style={styles.mapButton}
              onPress={() => openInGoogleMaps(activity.activity, city as string)}>
              <Map size={16} color="#E44D26" />
              <Text style={styles.mapButtonText}>View on Map</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (!itinerary || itinerary.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Generating your itinerary...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>{city} Itinerary</Text>
            <Text style={styles.subtitle}>{days} Days • {travelers} Travelers</Text>
          </View>
          {!saved && (
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSave}>
              <BookmarkPlus size={24} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {itinerary.map((day) => (
        <View key={day.day} style={styles.dayContainer}>
          <Text style={styles.dayTitle}>Day {day.day}</Text>
          
          {day.activities.map((activity, index) => (
            <View key={index} style={styles.activityContainer}>
              <View style={styles.timeline}>
                <View style={styles.timelineDot} />
                {index !== day.activities.length - 1 && <View style={styles.timelineLine} />}
              </View>
              
              <View style={styles.activityContent}>
                <View style={styles.activityHeader}>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                  <View style={styles.durationContainer}>
                    <Clock size={14} color="#666" />
                    <Text style={styles.durationText}>{activity.duration}</Text>
                  </View>
                </View>
                
                {renderActivityContent(activity)}
              </View>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 60,
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#E44D26',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  saveButton: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
  },
  dayContainer: {
    padding: 20,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  activityContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timeline: {
    alignItems: 'center',
    width: 20,
    marginRight: 15,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E44D26',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#eee',
    marginVertical: 4,
  },
  activityContent: {
    flex: 1,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityTime: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontSize: 12,
    color: '#666',
  },
  activityDetails: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 12,
  },
  activityIcon: {
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  activityLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E44D26',
  },
  mapButtonText: {
    fontSize: 12,
    color: '#E44D26',
    fontWeight: '500',
  },
});