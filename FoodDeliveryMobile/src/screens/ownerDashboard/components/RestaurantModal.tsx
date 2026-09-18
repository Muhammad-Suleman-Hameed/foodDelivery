import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X } from 'lucide-react-native';
import Colors from '../../../theme/colors';
import { CustomText } from '../../../components/customText';
import { CustomButton } from '../../../components/customButton';
import { Input } from '../../../components/input';
import { Restaurant, CreateRestaurantInput } from '../../../types/restaurant';
import { styles } from '../styles';

interface RestaurantModalProps {
  visible: boolean;
  editingRestaurant: Restaurant | null;
  defaultAddress?: string;
  onClose: () => void;
  onSave: (payload: CreateRestaurantInput, editingId?: number | null) => Promise<void>;
}

export const RestaurantModal: React.FC<RestaurantModalProps> = ({
  visible,
  editingRestaurant,
  defaultAddress,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('20-30 min');
  const [deliveryFee, setDeliveryFee] = useState('1.49');
  const [imageUrl, setImageUrl] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingRestaurant) {
      setName(editingRestaurant.name);
      setCuisine(editingRestaurant.cuisine);
      setAddress(editingRestaurant.address);
      setDescription(editingRestaurant.description || '');
      setDeliveryTime(editingRestaurant.deliveryTime);
      setDeliveryFee(String(editingRestaurant.deliveryFee));
      setImageUrl(editingRestaurant.imageUrl || '');
    } else {
      setName('');
      setCuisine('Fast Food');
      setAddress(defaultAddress || '');
      setDescription('');
      setDeliveryTime('20-30 min');
      setDeliveryFee('1.49');
      setImageUrl('https://images.unsplash.com/photo-1550547660-d9450f859349?w=600');
    }
    setFormError(null);
  }, [editingRestaurant, defaultAddress, visible]);

  const handleSubmit = async () => {
    if (!name.trim() || !address.trim()) {
      setFormError('Restaurant name and address are required');
      return;
    }

    try {
      setSaving(true);
      setFormError(null);

      await onSave(
        {
          name: name.trim(),
          cuisine: cuisine.trim() || 'Fast Food',
          address: address.trim(),
          description: description.trim() || undefined,
          deliveryTime: deliveryTime.trim() || '20-30 min',
          deliveryFee: parseFloat(deliveryFee) || 1.49,
          imageUrl: imageUrl.trim() || undefined,
        },
        editingRestaurant?.id,
      );

      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to save restaurant';
      setFormError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <CustomText variant="title" weight="bold" color={Colors.charcoal} style={styles.modalTitle}>
              {editingRestaurant ? 'Edit Restaurant' : 'Add Restaurant'}
            </CustomText>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalForm}>
            <Input
              label="Restaurant Name *"
              placeholder="Enter restaurant name"
              value={name}
              onChangeText={setName}
            />
            <Input
              label="Cuisine Category"
              placeholder="Enter cuisine (e.g. Fast Food, Drinks)"
              value={cuisine}
              onChangeText={setCuisine}
            />
            <Input
              label="Address *"
              placeholder="Enter complete address"
              value={address}
              onChangeText={setAddress}
            />
            <Input
              label="Description (Optional)"
              placeholder="Enter restaurant description"
              value={description}
              onChangeText={setDescription}
            />
            <Input
              label="Estimated Delivery Time"
              placeholder="Enter delivery time (e.g. 20-30 min)"
              value={deliveryTime}
              onChangeText={setDeliveryTime}
            />
            <Input
              label="Delivery Fee ($)"
              placeholder="Enter delivery fee (e.g. 1.49)"
              keyboardType="decimal-pad"
              value={deliveryFee}
              onChangeText={setDeliveryFee}
            />
            <Input
              label="Image URL (Optional)"
              placeholder="Enter banner image URL"
              value={imageUrl}
              onChangeText={setImageUrl}
            />

            {formError ? (
              <CustomText variant="caption" color={Colors.error} style={{ marginBottom: 12 }}>
                {formError}
              </CustomText>
            ) : null}

            <CustomButton
              title={editingRestaurant ? 'Save Changes' : 'Create Restaurant'}
              loading={saving}
              disabled={saving}
              onPress={handleSubmit}
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default RestaurantModal;
