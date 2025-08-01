/**
 * SafeDeal App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
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
} from 'react-native';

const { width } = Dimensions.get('window');

function App(): React.JSX.Element {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF',
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
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

  const openTelegram = async () => {
    try {
      const url = 'https://t.me/SdelkaSafe_bot';
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Ошибка', 'Не удалось открыть Telegram');
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось открыть Telegram');
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDarkMode ? '#2A2A2A' : '#007AFF' }]}>
        <Text style={styles.headerTitle}>SafeDeal</Text>
        <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
          <Text style={styles.themeButtonText}>
            {isDarkMode ? '☀️' : '🌙'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        
        {/* Welcome Section */}
        <View style={[styles.section, { backgroundColor: isDarkMode ? '#2A2A2A' : '#F8F9FA' }]}>
          <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
            Добро пожаловать в SafeDeal! 🎉
          </Text>
          <Text style={[styles.subtitle, { color: isDarkMode ? '#CCCCCC' : '#666666' }]}>
            Безопасные сделки с гарантией
          </Text>
        </View>

        {/* Bot Link Section */}
        <View style={[styles.section, { backgroundColor: isDarkMode ? '#2A2A2A' : '#F8F9FA' }]}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
            🤖 Наш Telegram Бот
          </Text>
          <TouchableOpacity 
            onPress={openBot}
            style={[styles.botButton, { backgroundColor: isDarkMode ? '#007AFF' : '#007AFF' }]}
          >
            <Text style={styles.botButtonText}>@SdelkaSafe_bot</Text>
            <Text style={styles.botButtonSubtext}>Нажмите чтобы открыть</Text>
          </TouchableOpacity>
        </View>

        {/* Features Section */}
        <View style={[styles.section, { backgroundColor: isDarkMode ? '#2A2A2A' : '#F8F9FA' }]}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
            ✨ Возможности
          </Text>
          
          <View style={styles.featureItem}>
            <Text style={[styles.featureIcon, { color: isDarkMode ? '#00FF00' : '#008000' }]}>🔒</Text>
            <View style={styles.featureText}>
              <Text style={[styles.featureTitle, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
                Безопасные сделки
              </Text>
              <Text style={[styles.featureDescription, { color: isDarkMode ? '#CCCCCC' : '#666666' }]}>
                Эскроу-сервис для защиты средств
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Text style={[styles.featureIcon, { color: isDarkMode ? '#00FF00' : '#008000' }]}>⭐</Text>
            <View style={styles.featureText}>
              <Text style={[styles.featureTitle, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
                Система рейтингов
              </Text>
              <Text style={[styles.featureDescription, { color: isDarkMode ? '#CCCCCC' : '#666666' }]}>
                Отзывы и рейтинги пользователей
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Text style={[styles.featureIcon, { color: isDarkMode ? '#00FF00' : '#008000' }]}>👥</Text>
            <View style={styles.featureText}>
              <Text style={[styles.featureTitle, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
                Реферальная программа
              </Text>
              <Text style={[styles.featureDescription, { color: isDarkMode ? '#CCCCCC' : '#666666' }]}>
                Приглашайте друзей и получайте бонусы
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Text style={[styles.featureIcon, { color: isDarkMode ? '#00FF00' : '#008000' }]}>💳</Text>
            <View style={styles.featureText}>
              <Text style={[styles.featureTitle, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
                Криптоплатежи
              </Text>
              <Text style={[styles.featureDescription, { color: isDarkMode ? '#CCCCCC' : '#666666' }]}>
                Поддержка USDT и других криптовалют
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={[styles.section, { backgroundColor: isDarkMode ? '#2A2A2A' : '#F8F9FA' }]}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
            🚀 Быстрые действия
          </Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              onPress={openTelegram}
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

        {/* Status Section */}
        <View style={[styles.section, { backgroundColor: isDarkMode ? '#2A2A2A' : '#F8F9FA' }]}>
          <View style={[styles.statusContainer, { backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF' }]}>
            <Text style={[styles.statusText, { color: isDarkMode ? '#00FF00' : '#008000' }]}>
              ✅ Приложение работает
            </Text>
            <Text style={[styles.statusSubtext, { color: isDarkMode ? '#CCCCCC' : '#666666' }]}>
              Все системы функционируют нормально
            </Text>
          </View>
        </View>

      </ScrollView>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  botButton: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  botButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  botButtonSubtext: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 5,
    opacity: 0.8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 15,
    width: 30,
    textAlign: 'center',
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
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
  statusContainer: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statusSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default App;
