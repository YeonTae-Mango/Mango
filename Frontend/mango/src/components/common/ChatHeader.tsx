import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ChatHeaderProps {
  userName?: string;
  title?: string;
  showUserInfo?: boolean;
  showMenu?: boolean;
  onBackPress: () => void;
  onProfilePress?: () => void;
  onMenuPress?: () => void;
}

export default function ChatHeader({
  userName,
  title,
  showUserInfo = false,
  showMenu = false,
  onBackPress,
  onProfilePress,
  onMenuPress,
}: ChatHeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {showUserInfo && userName ? (
        <TouchableOpacity style={styles.userInfo} onPress={onProfilePress}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userName[0]}</Text>
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userStatus}>핫플헌터</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>{title || '제목'}</Text>
        </View>
      )}

      {showMenu ? (
        <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
          <Ionicons name="ellipsis-vertical" size={24} color="#333" />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nameContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  userStatus: {
    fontSize: 12,
    color: '#999',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  menuButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
    height: 40,
  },
});
