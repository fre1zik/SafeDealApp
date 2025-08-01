/**
 * SafeDeal App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Alert,
  Dimensions,
  TextInput,
  Modal,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

const { width } = Dimensions.get('window');

// Типы данных
interface User {
  id: number;
  username: string;
  balance: number;
  frozen_balance: number;
  deals_completed: number;
  rating: number;
  rating_count: number;
  referrer_id?: number;
  is_first_deal: boolean;
}

interface Deal {
  id: number;
  buyer_id: number;
  seller_id: number;
  amount: number;
  description: string;
  status: string;
  buyer_rating?: number;
  seller_rating?: number;
  created_at: string;
}

interface ReferralStats {
  total_referrals: number;
  active_referrals: number;
  referral_link: string;
}

interface TopUser {
  user_id: number;
  username: string;
  rating: number;
  rating_count: number;
  deals_completed: number;
}

// API сервис
class ApiService {
  private baseUrl = 'http://localhost:8001/api';

  async getUserInfo(userId: number): Promise<User> {
    const response = await fetch(`${this.baseUrl}/user/${userId}`);
    if (!response.ok) throw new Error('Ошибка получения данных пользователя');
    return response.json();
  }

  async getUserDeals(userId: number): Promise<Deal[]> {
    const response = await fetch(`${this.baseUrl}/user/${userId}/deals`);
    if (!response.ok) throw new Error('Ошибка получения сделок');
    return response.json();
  }

  async createDeal(data: {
    buyer_id: number;
    amount: number;
    description: string;
    seller_username: string;
  }): Promise<any> {
    const response = await fetch(`${this.baseUrl}/deals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Ошибка создания сделки');
    return response.json();
  }

  async confirmDeal(dealId: number, userId: number): Promise<any> {
    const response = await fetch(`${this.baseUrl}/deals/${dealId}/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
    });
    if (!response.ok) throw new Error('Ошибка подтверждения сделки');
    return response.json();
  }

  async openDispute(dealId: number, userId: number, reason: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/deals/${dealId}/dispute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, reason }),
    });
    if (!response.ok) throw new Error('Ошибка открытия спора');
    return response.json();
  }

  async submitRating(data: {
    deal_id: number;
    rating: number;
    role: string;
  }): Promise<any> {
    const response = await fetch(`${this.baseUrl}/ratings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Ошибка отправки рейтинга');
    return response.json();
  }

  async createDeposit(data: {
    user_id: number;
    amount: number;
    method: string;
  }): Promise<any> {
    const response = await fetch(`${this.baseUrl}/deposit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Ошибка создания депозита');
    return response.json();
  }

  async getReferralStats(userId: number): Promise<ReferralStats> {
    const response = await fetch(`${this.baseUrl}/user/${userId}/referral-stats`);
    if (!response.ok) throw new Error('Ошибка получения статистики рефералов');
    return response.json();
  }

  async getTopUsers(limit: number = 10): Promise<TopUser[]> {
    const response = await fetch(`${this.baseUrl}/top-users?limit=${limit}`);
    if (!response.ok) throw new Error('Ошибка получения топ пользователей');
    return response.json();
  }
}

const api = new ApiService();

function App(): React.JSX.Element {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<'main' | 'deals' | 'create_deal' | 'deposit' | 'rating' | 'referral'>('main');
  const [user, setUser] = useState<User | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(null);
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Модальные окна
  const [showCreateDeal, setShowCreateDeal] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [showTopUsers, setShowTopUsers] = useState(false);

  // Формы
  const [dealForm, setDealForm] = useState({
    amount: '',
    description: '',
    seller_username: '',
  });

  const [depositForm, setDepositForm] = useState({
    amount: '',
    method: 'crypto' as 'crypto' | 'sberbank',
  });

  const [ratingForm, setRatingForm] = useState({
    deal_id: 0,
    rating: 5,
    role: 'buyer' as 'buyer' | 'seller',
  });

  // Тестовый пользователь (в реальном приложении это будет из авторизации)
  const TEST_USER_ID = 524638015;

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userData = await api.getUserInfo(TEST_USER_ID);
      setUser(userData);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить данные пользователя');
    } finally {
      setLoading(false);
    }
  };

  const loadDeals = async () => {
    try {
      const dealsData = await api.getUserDeals(TEST_USER_ID);
      setDeals(dealsData);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить сделки');
    }
  };

  const loadReferralStats = async () => {
    try {
      const stats = await api.getReferralStats(TEST_USER_ID);
      setReferralStats(stats);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить статистику рефералов');
    }
  };

  const loadTopUsers = async () => {
    try {
      const users = await api.getTopUsers(10);
      setTopUsers(users);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить топ пользователей');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      loadUserData(),
      loadDeals(),
      loadReferralStats(),
    ]);
    setRefreshing(false);
  };

  const handleCreateDeal = async () => {
    if (!dealForm.amount || !dealForm.description || !dealForm.seller_username) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }

    try {
      setLoading(true);
      await api.createDeal({
        buyer_id: TEST_USER_ID,
        amount: parseFloat(dealForm.amount),
        description: dealForm.description,
        seller_username: dealForm.seller_username,
      });
      
      Alert.alert('Успех', 'Сделка создана!');
      setShowCreateDeal(false);
      setDealForm({ amount: '', description: '', seller_username: '' });
      loadDeals();
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось создать сделку');
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!depositForm.amount) {
      Alert.alert('Ошибка', 'Введите сумму');
      return;
    }

    try {
      setLoading(true);
      const result = await api.createDeposit({
        user_id: TEST_USER_ID,
        amount: parseFloat(depositForm.amount),
        method: depositForm.method,
      });
      
      if (depositForm.method === 'crypto') {
        await Linking.openURL(result.pay_url);
      } else {
        Alert.alert(
          'Сбербанк',
          `Переведите ${result.amount} USDT на счет: ${result.account}\n\nОписание: ${result.description}`
        );
      }
      
      setShowDeposit(false);
      setDepositForm({ amount: '', method: 'crypto' });
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось создать депозит');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDeal = async (dealId: number) => {
    try {
      await api.confirmDeal(dealId, TEST_USER_ID);
      Alert.alert('Успех', 'Сделка подтверждена!');
      loadDeals();
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось подтвердить сделку');
    }
  };

  const handleOpenDispute = async (dealId: number) => {
    Alert.prompt(
      'Открыть спор',
      'Укажите причину спора:',
      async (reason) => {
        if (reason) {
          try {
            await api.openDispute(dealId, TEST_USER_ID, reason);
            Alert.alert('Успех', 'Спор открыт!');
            loadDeals();
          } catch (error) {
            Alert.alert('Ошибка', 'Не удалось открыть спор');
          }
        }
      }
    );
  };

  const openBot = async () => {
    try {
      const url = 'https://t.me/SdelkaSafe_bot';
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Ошибка', 'Не удалось открыть ссылку на бота');
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось открыть ссылку на бота');
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF',
  };

  const renderMainScreen = () => (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={backgroundStyle}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDarkMode ? '#2A2A2A' : '#007AFF' }]}>
        <Text style={styles.headerTitle}>SafeDeal</Text>
        <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
          <Text style={styles.themeButtonText}>
            {isDarkMode ? '☀️' : '🌙'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* User Info */}
      {user && (
        <View style={[styles.section, { backgroundColor: isDarkMode ? '#2A2A2A' : '#F8F9FA' }]}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
            👤 Ваш профиль
          </Text>
          <View style={styles.userInfo}>
            <Text style={[styles.userInfoText, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
              @{user.username}
            </Text>
            <Text style={[styles.userInfoText, { color: isDarkMode ? '#CCCCCC' : '#666666' }]}>
              💰 Баланс: {user.balance} USDT
            </Text>
            <Text style={[styles.userInfoText, { color: isDarkMode ? '#CCCCCC' : '#666666' }]}>
              🔒 Заморожено: {user.frozen_balance} USDT
            </Text>
            <Text style={[styles.userInfoText, { color: isDarkMode ? '#CCCCCC' : '#666666' }]}>
              🤝 Сделок: {user.deals_completed}
            </Text>
            <Text style={[styles.userInfoText, { color: isDarkMode ? '#CCCCCC' : '#666666' }]}>
              ⭐ Рейтинг: {user.rating} ({user.rating_count} отзывов)
            </Text>
          </View>
        </View>
      )}

      {/* Main Menu */}
      <View style={[styles.section, { backgroundColor: isDarkMode ? '#2A2A2A' : '#F8F9FA' }]}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
          🎯 Главное меню
        </Text>
        
        <View style={styles.menuGrid}>
          <TouchableOpacity 
            onPress={() => setShowCreateDeal(true)}
            style={[styles.menuItem, { backgroundColor: isDarkMode ? '#007AFF' : '#007AFF' }]}
          >
            <Text style={styles.menuItemIcon}>🆕</Text>
            <Text style={styles.menuItemText}>Создать сделку</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setCurrentScreen('deals')}
            style={[styles.menuItem, { backgroundColor: isDarkMode ? '#28A745' : '#28A745' }]}
          >
            <Text style={styles.menuItemIcon}>💼</Text>
            <Text style={styles.menuItemText}>Мои сделки</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setShowDeposit(true)}
            style={[styles.menuItem, { backgroundColor: isDarkMode ? '#FFC107' : '#FFC107' }]}
          >
            <Text style={styles.menuItemIcon}>💳</Text>
            <Text style={styles.menuItemText}>Пополнить</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setShowRating(true)}
            style={[styles.menuItem, { backgroundColor: isDarkMode ? '#FF9500' : '#FF9500' }]}
          >
            <Text style={styles.menuItemIcon}>⭐</Text>
            <Text style={styles.menuItemText}>Рейтинг</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setCurrentScreen('referral')}
            style={[styles.menuItem, { backgroundColor: isDarkMode ? '#6F42C1' : '#6F42C1' }]}
          >
            <Text style={styles.menuItemIcon}>👥</Text>
            <Text style={styles.menuItemText}>Рефералы</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={openBot}
            style={[styles.menuItem, { backgroundColor: isDarkMode ? '#17A2B8' : '#17A2B8' }]}
          >
            <Text style={styles.menuItemIcon}>🤖</Text>
            <Text style={styles.menuItemText}>Telegram</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={[styles.section, { backgroundColor: isDarkMode ? '#2A2A2A' : '#F8F9FA' }]}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
          🚀 Быстрые действия
        </Text>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            onPress={openBot}
            style={[styles.actionButton, { backgroundColor: isDarkMode ? '#007AFF' : '#007AFF' }]}
          >
            <Text style={styles.actionButtonText}>Открыть бота</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={toggleTheme}
            style={[styles.actionButton, { backgroundColor: isDarkMode ? '#FF9500' : '#FF9500' }]}
          >
            <Text style={styles.actionButtonText}>
              {isDarkMode ? 'Светлая тема' : 'Темная тема'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  const renderDealsScreen = () => (
    <View style={backgroundStyle}>
      <View style={[styles.header, { backgroundColor: isDarkMode ? '#2A2A2A' : '#007AFF' }]}>
        <TouchableOpacity onPress={() => setCurrentScreen('main')} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Мои сделки</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.dealsList}>
        {deals.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: isDarkMode ? '#CCCCCC' : '#666666' }]}>
              У вас пока нет сделок
            </Text>
          </View>
        ) : (
          deals.map((deal) => (
            <View key={deal.id} style={[styles.dealItem, { backgroundColor: isDarkMode ? '#2A2A2A' : '#F8F9FA' }]}>
              <Text style={[styles.dealTitle, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
                Сделка #{deal.id}
              </Text>
              <Text style={[styles.dealAmount, { color: isDarkMode ? '#007AFF' : '#007AFF' }]}>
                {deal.amount} USDT
              </Text>
              <Text style={[styles.dealDescription, { color: isDarkMode ? '#CCCCCC' : '#666666' }]}>
                {deal.description}
              </Text>
              <Text style={[styles.dealStatus, { color: getStatusColor(deal.status) }]}>
                {getStatusText(deal.status)}
              </Text>
              
              {deal.status === 'pending' && deal.buyer_id === TEST_USER_ID && (
                <View style={styles.dealActions}>
                  <TouchableOpacity 
                    onPress={() => handleConfirmDeal(deal.id)}
                    style={[styles.dealActionButton, { backgroundColor: '#28A745' }]}
                  >
                    <Text style={styles.dealActionText}>✅ Подтвердить</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => handleOpenDispute(deal.id)}
                    style={[styles.dealActionButton, { backgroundColor: '#DC3545' }]}
                  >
                    <Text style={styles.dealActionText}>⚖️ Спор</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );

  const renderReferralScreen = () => (
    <View style={backgroundStyle}>
      <View style={[styles.header, { backgroundColor: isDarkMode ? '#2A2A2A' : '#007AFF' }]}>
        <TouchableOpacity onPress={() => setCurrentScreen('main')} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Реферальная программа</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.referralContent}>
        {referralStats && (
          <View style={[styles.section, { backgroundColor: isDarkMode ? '#2A2A2A' : '#F8F9FA' }]}>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
              📊 Ваша статистика
            </Text>
            <Text style={[styles.referralText, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
              Всего рефералов: {referralStats.total_referrals}
            </Text>
            <Text style={[styles.referralText, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
              Активных рефералов: {referralStats.active_referrals}
            </Text>
            
            <TouchableOpacity 
              onPress={() => Linking.openURL(referralStats.referral_link)}
              style={[styles.referralButton, { backgroundColor: isDarkMode ? '#007AFF' : '#007AFF' }]}
            >
              <Text style={styles.referralButtonText}>🔗 Поделиться ссылкой</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={[styles.section, { backgroundColor: isDarkMode ? '#2A2A2A' : '#F8F9FA' }]}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
            🎁 Бонусы для рефералов
          </Text>
          <Text style={[styles.referralText, { color: isDarkMode ? '#CCCCCC' : '#666666' }]}>
            • Первая сделка БЕСПЛАТНО (0% комиссии)
          </Text>
          <Text style={[styles.referralText, { color: isDarkMode ? '#CCCCCC' : '#666666' }]}>
            • Обычные сделки: 3% комиссия
          </Text>
        </View>
      </ScrollView>
    </View>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FFC107';
      case 'completed': return '#28A745';
      case 'disputed': return '#DC3545';
      default: return '#6C757D';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '⏳ Ожидает';
      case 'completed': return '✅ Завершена';
      case 'disputed': return '⚖️ Спор';
      default: return status;
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Загрузка...</Text>
        </View>
      )}

      {currentScreen === 'main' && renderMainScreen()}
      {currentScreen === 'deals' && renderDealsScreen()}
      {currentScreen === 'referral' && renderReferralScreen()}

      {/* Модальное окно создания сделки */}
      <Modal visible={showCreateDeal} animationType="slide">
        <View style={[styles.modalContainer, backgroundStyle]}>
          <View style={[styles.modalHeader, { backgroundColor: isDarkMode ? '#2A2A2A' : '#007AFF' }]}>
            <TouchableOpacity onPress={() => setShowCreateDeal(false)}>
              <Text style={styles.modalCloseButton}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Создать сделку</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.modalContent}>
            <TextInput
              style={[styles.input, { 
                backgroundColor: isDarkMode ? '#2A2A2A' : '#F8F9FA',
                color: isDarkMode ? '#FFFFFF' : '#000000',
                borderColor: isDarkMode ? '#444444' : '#DDDDDD'
              }]}
              placeholder="Сумма USDT"
              placeholderTextColor={isDarkMode ? '#888888' : '#999999'}
              value={dealForm.amount}
              onChangeText={(text) => setDealForm({...dealForm, amount: text})}
              keyboardType="numeric"
            />

            <TextInput
              style={[styles.input, { 
                backgroundColor: isDarkMode ? '#2A2A2A' : '#F8F9FA',
                color: isDarkMode ? '#FFFFFF' : '#000000',
                borderColor: isDarkMode ? '#444444' : '#DDDDDD'
              }]}
              placeholder="Описание сделки"
              placeholderTextColor={isDarkMode ? '#888888' : '#999999'}
              value={dealForm.description}
              onChangeText={(text) => setDealForm({...dealForm, description: text})}
              multiline
            />

            <TextInput
              style={[styles.input, { 
                backgroundColor: isDarkMode ? '#2A2A2A' : '#F8F9FA',
                color: isDarkMode ? '#FFFFFF' : '#000000',
                borderColor: isDarkMode ? '#444444' : '#DDDDDD'
              }]}
              placeholder="@username продавца"
              placeholderTextColor={isDarkMode ? '#888888' : '#999999'}
              value={dealForm.seller_username}
              onChangeText={(text) => setDealForm({...dealForm, seller_username: text})}
            />

            <TouchableOpacity 
              onPress={handleCreateDeal}
              style={[styles.modalButton, { backgroundColor: '#007AFF' }]}
            >
              <Text style={styles.modalButtonText}>Создать сделку</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Модальное окно пополнения */}
      <Modal visible={showDeposit} animationType="slide">
        <View style={[styles.modalContainer, backgroundStyle]}>
          <View style={[styles.modalHeader, { backgroundColor: isDarkMode ? '#2A2A2A' : '#007AFF' }]}>
            <TouchableOpacity onPress={() => setShowDeposit(false)}>
              <Text style={styles.modalCloseButton}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Пополнить баланс</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.modalContent}>
            <TextInput
              style={[styles.input, { 
                backgroundColor: isDarkMode ? '#2A2A2A' : '#F8F9FA',
                color: isDarkMode ? '#FFFFFF' : '#000000',
                borderColor: isDarkMode ? '#444444' : '#DDDDDD'
              }]}
              placeholder="Сумма USDT"
              placeholderTextColor={isDarkMode ? '#888888' : '#999999'}
              value={depositForm.amount}
              onChangeText={(text) => setDepositForm({...depositForm, amount: text})}
              keyboardType="numeric"
            />

            <View style={styles.methodSelector}>
              <TouchableOpacity 
                onPress={() => setDepositForm({...depositForm, method: 'crypto'})}
                style={[
                  styles.methodButton,
                  { backgroundColor: depositForm.method === 'crypto' ? '#007AFF' : isDarkMode ? '#2A2A2A' : '#F8F9FA' }
                ]}
              >
                <Text style={[styles.methodButtonText, { color: depositForm.method === 'crypto' ? '#FFFFFF' : isDarkMode ? '#FFFFFF' : '#000000' }]}>
                  💰 Криптовалюта
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => setDepositForm({...depositForm, method: 'sberbank'})}
                style={[
                  styles.methodButton,
                  { backgroundColor: depositForm.method === 'sberbank' ? '#007AFF' : isDarkMode ? '#2A2A2A' : '#F8F9FA' }
                ]}
              >
                <Text style={[styles.methodButtonText, { color: depositForm.method === 'sberbank' ? '#FFFFFF' : isDarkMode ? '#FFFFFF' : '#000000' }]}>
                  🏦 Сбербанк
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              onPress={handleDeposit}
              style={[styles.modalButton, { backgroundColor: '#007AFF' }]}
            >
              <Text style={styles.modalButtonText}>Пополнить</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  themeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  themeButtonText: {
    fontSize: 20,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  section: {
    margin: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  userInfo: {
    gap: 8,
  },
  userInfoText: {
    fontSize: 16,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  menuItem: {
    width: (width - 60) / 2,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  menuItemIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  menuItemText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  dealsList: {
    flex: 1,
    padding: 15,
  },
  dealItem: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  dealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dealAmount: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  dealDescription: {
    fontSize: 14,
    marginBottom: 5,
  },
  dealStatus: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  dealActions: {
    flexDirection: 'row',
    gap: 10,
  },
  dealActionButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  dealActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 50,
  },
  emptyStateText: {
    fontSize: 16,
  },
  referralContent: {
    flex: 1,
    padding: 15,
  },
  referralText: {
    fontSize: 16,
    marginBottom: 8,
  },
  referralButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  referralButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  modalCloseButton: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  methodSelector: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  methodButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  methodButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default App;
