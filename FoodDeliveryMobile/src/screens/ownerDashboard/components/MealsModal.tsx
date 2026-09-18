import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { X, Plus, Trash2, Check } from 'lucide-react-native';
import Colors from '../../../theme/colors';
import { CustomText } from '../../../components/customText';
import { CustomButton } from '../../../components/customButton';
import { Input } from '../../../components/input';
import { Restaurant } from '../../../types/restaurant';
import { Meal, MealCategory, CreateMealInput } from '../../../types/meal';
import { styles } from '../styles';

interface MealsModalProps {
  visible: boolean;
  restaurant: Restaurant | null;
  meals: Meal[];
  loading: boolean;
  onClose: () => void;
  onCreateMeal: (restaurantId: number, payload: CreateMealInput) => Promise<Meal>;
  onToggleMeal: (mealId: number) => Promise<Meal>;
  onDeleteMeal: (mealId: number) => Promise<void>;
}

export const MealsModal: React.FC<MealsModalProps> = ({
  visible,
  restaurant,
  meals,
  loading,
  onClose,
  onCreateMeal,
  onToggleMeal,
  onDeleteMeal,
}) => {
  const [addVisible, setAddVisible] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<MealCategory>(MealCategory.FAST_FOOD);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAddSubmit = async () => {
    if (!name.trim() || !price.trim() || !restaurant) {
      Alert.alert('Validation Error', 'Meal name and price are required.');
      return;
    }

    try {
      setSaving(true);
      await onCreateMeal(restaurant.id, {
        name: name.trim(),
        price: parseFloat(price),
        category,
        description: description.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
        isAvailable: true,
      });

      setAddVisible(false);
      setName('');
      setPrice('');
      setDescription('');
      setImageUrl('');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to add meal';
      Alert.alert('Error', Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = (mealId: number, mealName: string) => {
    Alert.alert('Delete Meal', `Remove "${mealName}" from the menu?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => onDeleteMeal(mealId),
      },
    ]);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View>
              <CustomText variant="title" weight="bold" color={Colors.charcoal} style={styles.modalTitle}>
                {restaurant?.name} Menu
              </CustomText>
              <CustomText variant="caption" color={Colors.textMuted}>
                {meals.length} items • Toggle kitchen availability
              </CustomText>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalForm}>
            {!addVisible ? (
              <TouchableOpacity
                onPress={() => setAddVisible(true)}
                style={[styles.addButton, { alignSelf: 'flex-start', marginBottom: 16 }]}
              >
                <CustomText style={styles.addButtonText}>+ Add New Dish</CustomText>
              </TouchableOpacity>
            ) : (
              <View style={{ backgroundColor: Colors.surfaceGray, padding: 14, borderRadius: 14, marginBottom: 16 }}>
                <CustomText variant="title" weight="bold" color={Colors.charcoal} style={{ marginBottom: 10 }}>
                  New Dish
                </CustomText>

                <Input
                  label="Dish Name *"
                  placeholder="Enter dish name"
                  value={name}
                  onChangeText={setName}
                />
                <Input
                  label="Price ($) *"
                  placeholder="Enter price (e.g. 9.99)"
                  keyboardType="decimal-pad"
                  value={price}
                  onChangeText={setPrice}
                />

                <CustomText variant="caption" weight="600" color={Colors.charcoal} style={{ marginBottom: 6 }}>
                  Category *
                </CustomText>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                  {Object.values(MealCategory).map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setCategory(cat)}
                      style={[
                        {
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          borderRadius: 16,
                          backgroundColor: Colors.white,
                          borderWidth: 1,
                          borderColor: Colors.border,
                        },
                        (category === cat ? { backgroundColor: Colors.primary, borderColor: Colors.primary } : {}) as any,
                      ]}
                    >
                      <CustomText
                        style={[
                          { fontSize: 12, fontWeight: '600', color: Colors.charcoal },
                          (category === cat ? { color: Colors.white } : {}) as any,
                        ]}
                      >
                        {cat}
                      </CustomText>
                    </TouchableOpacity>
                  ))}
                </View>

                <Input
                  label="Description (Optional)"
                  placeholder="Enter ingredients or description"
                  value={description}
                  onChangeText={setDescription}
                />
                <Input
                  label="Image URL (Optional)"
                  placeholder="Enter image URL"
                  value={imageUrl}
                  onChangeText={setImageUrl}
                />

                <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
                  <View style={{ flex: 1 }}>
                    <CustomButton title="Cancel" variant="secondary" onPress={() => setAddVisible(false)} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <CustomButton title="Save Dish" loading={saving} disabled={saving} onPress={handleAddSubmit} />
                  </View>
                </View>
              </View>
            )}

            {loading ? (
              <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />
            ) : meals.length === 0 ? (
              <CustomText variant="caption" color={Colors.textMuted} style={{ textAlign: 'center', marginVertical: 20 }}>
                No dishes added yet. Tap "+ Add New Dish" above to create menu items.
              </CustomText>
            ) : (
              meals.map((meal) => (
                <View key={meal.id} style={styles.mealRow}>
                  <View style={{ flex: 1 }}>
                    <CustomText weight="bold" color={Colors.charcoal}>
                      {meal.name}
                    </CustomText>
                    <CustomText variant="caption" color={Colors.textMuted}>
                      {meal.category} • ${Number(meal.price).toFixed(2)}
                    </CustomText>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <TouchableOpacity
                      onPress={() => onToggleMeal(meal.id)}
                      style={[
                        styles.toggleBtn,
                        meal.isAvailable ? styles.toggleBtnActive : styles.toggleBtnInactive,
                      ]}
                    >
                      <CustomText
                        style={[
                          styles.toggleBtnText,
                          meal.isAvailable ? styles.toggleBtnTextActive : styles.toggleBtnTextInactive,
                        ]}
                      >
                        {meal.isAvailable ? 'In Stock' : 'Out of Stock'}
                      </CustomText>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleDeleteConfirm(meal.id, meal.name)}
                      style={styles.mealDeleteBtn}
                    >
                      <Trash2 size={16} color={Colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default MealsModal;
