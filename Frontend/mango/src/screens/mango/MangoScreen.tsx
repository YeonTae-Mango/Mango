import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Layout from '../../components/common/Layout';

interface MangoScreenProps {
  onLogout: () => void;
}

export default function MangoScreen({ onLogout }: MangoScreenProps) {
  const navigation = useNavigation<any>();

  const handleProfilePress = (userName: string) => {
    navigation.navigate('ProfileDetail', { userName, fromScreen: 'Mango' });
  };

  const users = [
    { id: 1, name: '지수' },
    { id: 2, name: '민호' },
    { id: 3, name: '수진' },
    { id: 4, name: '준혁' },
  ];

  return (
    <Layout headerTitle="mango" onLogout={onLogout}>
      <View style={styles.container}>
        <View style={styles.cardContainer}>
          {users.map(user => (
            <TouchableOpacity
              key={user.id}
              style={styles.userCard}
              onPress={() => handleProfilePress(user.name)}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user.name[0]}</Text>
              </View>
              <Text style={styles.userName}>{user.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6D60',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  userCard: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF6D60',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});
