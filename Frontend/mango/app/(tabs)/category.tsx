import { StyleSheet, Text, View } from 'react-native';

export default function CategoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>카테고리</Text>
      <Text style={styles.subtitle}>카테고리 화면입니다</Text>
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
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});
