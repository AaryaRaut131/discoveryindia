import React, { useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ScrollView,
} from 'react-native';
import { X } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { height } = Dimensions.get('window');

interface Destination {
  id: string;
  name: string;
  state: string;
  description: string;
  categories: string[];
}

interface DestinationsModalProps {
  visible: boolean;
  onClose: () => void;
  destinations: Destination[];
}

export default function DestinationsModal({
  visible,
  onClose,
  destinations,
}: DestinationsModalProps) {
  const router = useRouter();

  const handleDestinationPress = useCallback((destination: Destination) => {
    onClose();
    setTimeout(() => {
      router.push({
        pathname: '/plan-trip',
        params: { city: destination.name, state: destination.state },
      });
    }, 0);
  }, [router, onClose]);

  const renderDestination = useCallback(({ item }: { item: Destination }) => (
    <TouchableOpacity
      style={styles.destinationItem}
      onPress={() => handleDestinationPress(item)}>
      <View style={styles.destinationContent}>
        <View>
          <Text style={styles.destinationName}>{item.name}</Text>
          <Text style={styles.destinationState}>{item.state}</Text>
        </View>
        <Text style={styles.destinationDescription}>{item.description}</Text>
        <View style={styles.categoriesContainer}>
          {item.categories.map((category, index) => (
            <View key={index} style={styles.categoryTag}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  ), [handleDestinationPress]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>All Destinations</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={destinations}
            renderItem={renderDestination}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    maxHeight: height * 0.8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  listContainer: {
    paddingBottom: 20,
  },
  destinationItem: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  destinationContent: {
    padding: 15,
  },
  destinationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  destinationState: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  destinationDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  categoryTag: {
    backgroundColor: '#E44D26',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginTop: 6,
  },
  categoryText: {
    color: 'white',
    fontSize: 12,
  },
});