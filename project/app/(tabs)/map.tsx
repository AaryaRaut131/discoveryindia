import { View, Text, StyleSheet } from 'react-native';
import { Map } from 'lucide-react-native';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <Map size={64} color="#E44D26" style={styles.icon} />
      <Text style={styles.title}>Coming Soon!</Text>
      <Text style={styles.subtitle}>
        We're working on an interactive map feature to help you explore destinations more easily.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 20,
    opacity: 0.8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 24,
  },
});