import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { DealFormData } from '../types';
import { apiService } from '../services/api';

interface CreateDealScreenProps {
  navigation: any;
  route: { params: { userId: number } };
}

export const CreateDealScreen: React.FC<CreateDealScreenProps> = ({ navigation, route }) => {
  const { userId } = route.params;
  const [formData, setFormData] = useState<DealFormData>({
    amount: 0,
    description: '',
    sellerUsername: '',
  });
  const [loading, setLoading] = useState(false);

  const handleCreateDeal = async () => {
    if (!formData.amount || formData.amount <= 0) {
      Alert.alert('Ошибка', 'Введите корректную сумму');
      return;
    }

    if (!formData.description.trim()) {
      Alert.alert('Ошибка', 'Введите описание сделки');
      return;
    }

    if (!formData.sellerUsername.trim()) {
      Alert.alert('Ошибка', 'Введите username продавца');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.createDeal(userId, formData);
      
      if (response.success && response.data) {
        Alert.alert(
          'Успешно!',
          `Сделка #${response.data.id} создана!`,
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('DealDetails', { dealId: response.data!.id }),
            },
          ]
        );
      } else {
        Alert.alert('Ошибка', response.error || 'Не удалось создать сделку');
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось создать сделку');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Создать сделку</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Сумма (USDT)</Text>
            <TextInput
              style={styles.input}
              value={formData.amount.toString()}
              onChangeText={(text) => setFormData({ ...formData, amount: parseFloat(text) || 0 })}
              keyboardType="numeric"
              placeholder="Введите сумму"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Описание сделки</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Опишите, что вы покупаете"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username продавца</Text>
            <TextInput
              style={styles.input}
              value={formData.sellerUsername}
              onChangeText={(text) => setFormData({ ...formData, sellerUsername: text })}
              placeholder="@username"
              placeholderTextColor="#999"
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={[styles.createButton, loading && styles.disabledButton]}
            onPress={handleCreateDeal}
            disabled={loading}
          >
            <Text style={styles.createButtonText}>
              {loading ? 'Создание...' : 'Создать сделку'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Как это работает:</Text>
          <Text style={styles.infoText}>
            1. Средства будут заморожены на время сделки{'\n'}
            2. Продавец получит уведомление{'\n'}
            3. После получения товара подтвердите сделку{'\n'}
            4. Средства автоматически перейдут продавцу
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  form: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  createButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  createButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: 'white',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
  },
}); 