import { StyleSheet, Text, View } from 'react-native';

export default function MangoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>망고</Text>
      <Text style={styles.subtitle}>망고 화면입니다</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#FF6D60',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});
