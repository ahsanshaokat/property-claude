import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const ForgotUsernameScreen = ({ navigation }) => {
  const [email, setEmail] = React.useState('');

  const handleForgotUsername = () => {
    // Call API to recover the username
    console.log('Recovering username for:', email);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
      />
      <Button title="Recover Username" onPress={handleForgotUsername} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 4 },
});

export default ForgotUsernameScreen;
