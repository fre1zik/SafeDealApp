import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { User, Deal } from '../types';
import { apiService } from '../services/api';

interface HomeScreenProps {
  navigation: any;
  userId: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, userId }) => {
  const [user, setUser] = useState<User | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [userResponse, dealsResponse] = await Promise.all([
        apiService.getUserInfo(userId),
        apiService.getUserDeals(userId),
      ]);

      if (userResponse.success && userResponse.data) {
        setUser(userResponse.data);
      }

      if (dealsResponse.success && dealsResponse.data) {
        setDeals(dealsResponse.data);
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить данные');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userId]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'pending':
        return '🔒';
      case 'completed':
        return '✅';
      case 'disputed':
        return '⚖️';
      case 'pending_seller':
        return '⏳';
      default:
        return '❓';
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Загрузка...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Заголовок */}
      <View style={styles.header}>
        <Text style={styles.title}>SafeDeal</Text>
        <Text style={styles.subtitle}>Безопасные сделки</Text>
      </View>

      {/* Информация о пользователе */}
      {user && (
        <View style={styles.userInfo}>
          <Text style={styles.userName}>@{user.username}</Text>
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Баланс:</Text>
            <Text style={styles.balanceAmount}>{user.balance} USDT</Text>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{user.dealsCompleted}</Text>
              <Text style={styles.statLabel}>Сделок</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{user.rating.toFixed(1)}⭐</Text>
              <Text style={styles.statLabel}>Рейтинг</Text>
            </View>
          </View>
        </View>
      )}

      {/* Кнопки действий */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('CreateDeal', { userId })}
        >
          <Text style={styles.actionButtonText}>🆕 Создать сделку</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Deposit', { userId })}
        >
          <Text style={styles.actionButtonText}>💳 Пополнить</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Referral', { userId })}
        >
          <Text style={styles.actionButtonText}>👥 Реферальная программа</Text>
        </TouchableOpacity>
      </View>

      {/* Последние сделки */}
      <View style={styles.dealsContainer}>
        <Text style={styles.sectionTitle}>Последние сделки</Text>
        {deals.length === 0 ? (
          <Text style={styles.noDealsText}>У вас пока нет сделок</Text>
        ) : (
          deals.slice(0, 5).map((deal) => (
            <TouchableOpacity
              key={deal.id}
              style={styles.dealItem}
              onPress={() => navigation.navigate('DealDetails', { dealId: deal.id })}
            >
              <View style={styles.dealHeader}>
                <Text style={styles.dealId}>#{deal.id}</Text>
                <Text style={styles.dealStatus}>
                  {getStatusEmoji(deal.status)} {deal.status}
                </Text>
              </View>
              <Text style={styles.dealDescription} numberOfLines={2}>
                {deal.description}
              </Text>
              <Text style={styles.dealAmount}>{deal.amount} USDT</Text>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
  },
  userInfo: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#666',
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  actionsContainer: {
    margin: 15,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  dealsContainer: {
    margin: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noDealsText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  dealItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  dealId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  dealStatus: {
    fontSize: 12,
    color: '#666',
  },
  dealDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  dealAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
}); 