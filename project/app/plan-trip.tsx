import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, Clock, Users, IndianRupee } from 'lucide-react-native';

export default function PlanTripScreen() {
  const { city, state } = useLocalSearchParams();
  const router = useRouter();
  const [days, setDays] = useState('3');
  const [travelers, setTravelers] = useState('2');
  const [budget, setBudget] = useState('mid');

  const handleCreateItinerary = () => {
    router.push({
      pathname: '/itinerary',
      params: {
        city,
        state,
        days,
        travelers,
        budget,
      },
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Plan Your Trip to {city}</Text>
        <Text style={styles.subtitle}>{state}</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Number of Days</Text>
          <View style={styles.inputContainer}>
            <Calendar size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={days}
              onChangeText={setDays}
              keyboardType="numeric"
              placeholder="Enter number of days"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Number of Travelers</Text>
          <View style={styles.inputContainer}>
            <Users size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={travelers}
              onChangeText={setTravelers}
              keyboardType="numeric"
              placeholder="Enter number of travelers"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Budget Category</Text>
          <View style={styles.budgetOptions}>
            <TouchableOpacity
              style={[styles.budgetOption, budget === 'budget' && styles.budgetOptionSelected]}
              onPress={() => setBudget('budget')}>
              <IndianRupee size={16} color={budget === 'budget' ? '#fff' : '#666'} />
              <Text style={[styles.budgetText, budget === 'budget' && styles.budgetTextSelected]}>
                Budget
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.budgetOption, budget === 'mid' && styles.budgetOptionSelected]}
              onPress={() => setBudget('mid')}>
              <IndianRupee size={16} color={budget === 'mid' ? '#fff' : '#666'} />
              <IndianRupee size={16} color={budget === 'mid' ? '#fff' : '#666'} />
              <Text style={[styles.budgetText, budget === 'mid' && styles.budgetTextSelected]}>
                Mid-Range
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.budgetOption, budget === 'luxury' && styles.budgetOptionSelected]}
              onPress={() => setBudget('luxury')}>
              <IndianRupee size={16} color={budget === 'luxury' ? '#fff' : '#666'} />
              <IndianRupee size={16} color={budget === 'luxury' ? '#fff' : '#666'} />
              <IndianRupee size={16} color={budget === 'luxury' ? '#fff' : '#666'} />
              <Text style={[styles.budgetText, budget === 'luxury' && styles.budgetTextSelected]}>
                Luxury
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.createButton} onPress={handleCreateItinerary}>
          <Text style={styles.createButtonText}>Create Itinerary</Text>
        </TouchableOpacity>
      </View>
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
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  budgetOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    marginHorizontal: 5,
  },
  budgetOptionSelected: {
    backgroundColor: '#E44D26',
    borderColor: '#E44D26',
  },
  budgetText: {
    marginLeft: 5,
    color: '#666',
    fontSize: 14,
  },
  budgetTextSelected: {
    color: '#fff',
  },
  createButton: {
    backgroundColor: '#E44D26',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});