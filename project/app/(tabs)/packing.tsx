import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Check, Plus, CircleAlert as AlertCircle, ChevronDown, ChevronUp } from 'lucide-react-native';

const defaultCategories = {
  documents: {
    title: 'Travel Documents & Money',
    priority: 'essential',
    items: [
      { name: 'Passport', quantity: 1, location: 'carry-on', checked: false },
      { name: 'Visa', quantity: 1, location: 'carry-on', checked: false },
      { name: 'Travel Insurance', quantity: 1, location: 'carry-on', checked: false },
      { name: 'Boarding Pass', quantity: 1, location: 'carry-on', checked: false },
      { name: 'Hotel Reservations', quantity: 1, location: 'carry-on', checked: false },
      { name: 'Cash', quantity: 1, location: 'carry-on', checked: false },
      { name: 'Credit/Debit Cards', quantity: 2, location: 'carry-on', checked: false },
    ],
  },
  clothing: {
    title: 'Clothing',
    priority: 'essential',
    items: [
      { name: 'T-shirts', quantity: 5, location: 'checked', checked: false },
      { name: 'Pants/Shorts', quantity: 3, location: 'checked', checked: false },
      { name: 'Underwear', quantity: 6, location: 'checked', checked: false },
      { name: 'Socks', quantity: 6, location: 'checked', checked: false },
      { name: 'Pajamas', quantity: 2, location: 'checked', checked: false },
      { name: 'Light Jacket', quantity: 1, location: 'carry-on', checked: false },
      { name: 'Swimwear', quantity: 1, location: 'checked', checked: false },
      { name: 'Formal Outfit', quantity: 1, location: 'checked', checked: false },
    ],
  },
  toiletries: {
    title: 'Toiletries & Personal Care',
    priority: 'essential',
    items: [
      { name: 'Toothbrush & Toothpaste', quantity: 1, location: 'checked', checked: false },
      { name: 'Shampoo & Conditioner', quantity: 1, location: 'checked', checked: false },
      { name: 'Deodorant', quantity: 1, location: 'checked', checked: false },
      { name: 'Sunscreen', quantity: 1, location: 'checked', checked: false },
      { name: 'Face Wash', quantity: 1, location: 'checked', checked: false },
      { name: 'Moisturizer', quantity: 1, location: 'checked', checked: false },
      { name: 'Hair Brush', quantity: 1, location: 'checked', checked: false },
    ],
  },
  electronics: {
    title: 'Electronics & Chargers',
    priority: 'essential',
    items: [
      { name: 'Phone Charger', quantity: 1, location: 'carry-on', checked: false },
      { name: 'Power Bank', quantity: 1, location: 'carry-on', checked: false },
      { name: 'Universal Adapter', quantity: 1, location: 'carry-on', checked: false },
      { name: 'Camera', quantity: 1, location: 'carry-on', checked: false },
      { name: 'Laptop & Charger', quantity: 1, location: 'carry-on', checked: false },
      { name: 'Headphones', quantity: 1, location: 'carry-on', checked: false },
    ],
  },
  medical: {
    title: 'First Aid & Medications',
    priority: 'essential',
    items: [
      { name: 'Prescription Medications', quantity: 1, location: 'carry-on', checked: false },
      { name: 'Pain Relievers', quantity: 1, location: 'carry-on', checked: false },
      { name: 'Band-Aids', quantity: 1, location: 'checked', checked: false },
      { name: 'Antiseptic Wipes', quantity: 1, location: 'checked', checked: false },
      { name: 'Motion Sickness Pills', quantity: 1, location: 'carry-on', checked: false },
      { name: 'First Aid Kit', quantity: 1, location: 'checked', checked: false },
    ],
  },
  activities: {
    title: 'Activity-Specific Gear',
    priority: 'optional',
    items: [
      { name: 'Hiking Boots', quantity: 1, location: 'checked', checked: false },
      { name: 'Beach Towel', quantity: 1, location: 'checked', checked: false },
      { name: 'Umbrella', quantity: 1, location: 'checked', checked: false },
      { name: 'Daypack', quantity: 1, location: 'checked', checked: false },
      { name: 'Water Bottle', quantity: 1, location: 'carry-on', checked: false },
    ],
  },
  misc: {
    title: 'Miscellaneous Items',
    priority: 'optional',
    items: [
      { name: 'Travel Pillow', quantity: 1, location: 'carry-on', checked: false },
      { name: 'Eye Mask', quantity: 1, location: 'carry-on', checked: false },
      { name: 'Books/E-reader', quantity: 1, location: 'carry-on', checked: false },
      { name: 'Snacks', quantity: 1, location: 'carry-on', checked: false },
      { name: 'Travel Lock', quantity: 2, location: 'checked', checked: false },
      { name: 'Plastic Bags', quantity: 3, location: 'checked', checked: false },
    ],
  },
};

export default function PackingScreen() {
  const [categories, setCategories] = useState(defaultCategories);
  const [expandedCategories, setExpandedCategories] = useState(
    Object.keys(defaultCategories).reduce((acc, key) => ({ ...acc, [key]: true }), {})
  );
  const [newItemName, setNewItemName] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const toggleCategory = (categoryKey) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryKey]: !prev[categoryKey]
    }));
  };

  const toggleItem = (categoryKey, itemIndex) => {
    setCategories(prev => {
      const newCategories = { ...prev };
      newCategories[categoryKey].items[itemIndex].checked = 
        !newCategories[categoryKey].items[itemIndex].checked;
      return newCategories;
    });
  };

  const handleAddItem = (categoryKey) => {
    if (newItemName) {
      setCategories(prev => {
        const newCategories = { ...prev };
        newCategories[categoryKey].items.push({
          name: newItemName,
          quantity: 1,
          location: 'checked',
          checked: false,
        });
        return newCategories;
      });
      setNewItemName('');
      setShowCategoryModal(false);
    }
  };

  const getProgress = (category) => {
    const total = category.items.length;
    const checked = category.items.filter(item => item.checked).length;
    return `${checked}/${total}`;
  };

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Packing Checklist</Text>
        <Text style={styles.subtitle}>Keep track of your travel essentials</Text>
      </View>

      <View style={styles.addItemContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add new item..."
          value={newItemName}
          onChangeText={setNewItemName}
        />
        <TouchableOpacity
          style={[styles.addButton, !newItemName && styles.addButtonDisabled]}
          onPress={() => newItemName && setShowCategoryModal(true)}
          disabled={!newItemName}>
          <Plus size={24} color={newItemName ? '#fff' : '#999'} />
        </TouchableOpacity>
      </View>

      {Object.entries(categories).map(([key, category]) => (
        <View key={key} style={styles.categoryContainer}>
          <TouchableOpacity
            style={styles.categoryHeader}
            onPress={() => toggleCategory(key)}>
            <View style={styles.categoryTitleContainer}>
              <Text style={styles.categoryTitle}>{category.title}</Text>
              <View style={styles.categoryMeta}>
                <Text style={styles.progress}>{getProgress(category)}</Text>
                {category.priority === 'essential' && (
                  <View style={styles.essentialTag}>
                    <AlertCircle size={12} color="#E44D26" />
                    <Text style={styles.essentialText}>Essential</Text>
                  </View>
                )}
              </View>
            </View>
            {expandedCategories[key] ? (
              <ChevronUp size={24} color="#666" />
            ) : (
              <ChevronDown size={24} color="#666" />
            )}
          </TouchableOpacity>

          {expandedCategories[key] && (
            <View style={styles.itemsContainer}>
              {category.items.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.item}
                  onPress={() => toggleItem(key, index)}>
                  <View style={styles.itemLeft}>
                    <View style={[styles.checkbox, item.checked && styles.checkboxChecked]}>
                      {item.checked && <Check size={16} color="#fff" />}
                    </View>
                    <View style={styles.itemDetails}>
                      <Text style={[styles.itemName, item.checked && styles.itemNameChecked]}>
                        {item.name}
                      </Text>
                      <Text style={styles.itemMeta}>
                        Qty: {item.quantity} • Pack in: {item.location}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      ))}

      <Modal
        visible={showCategoryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Category</Text>
            <ScrollView>
              {Object.entries(categories).map(([key, category]) => (
                <TouchableOpacity
                  key={key}
                  style={styles.categoryOption}
                  onPress={() => handleAddItem(key)}>
                  <Text style={styles.categoryOptionText}>{category.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowCategoryModal(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  addItemContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: '#E44D26',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#f5f5f5',
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  categoryTitleContainer: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  categoryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 12,
  },
  progress: {
    fontSize: 14,
    color: '#666',
  },
  essentialTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  essentialText: {
    fontSize: 12,
    color: '#E44D26',
    fontWeight: '500',
  },
  itemsContainer: {
    paddingHorizontal: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#E44D26',
    borderColor: '#E44D26',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
  itemNameChecked: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  itemMeta: {
    fontSize: 12,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  categoryOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryOptionText: {
    fontSize: 16,
    color: '#333',
  },
  cancelButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
});