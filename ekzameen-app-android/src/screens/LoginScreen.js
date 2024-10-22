import React, { useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { login } from '../data/api/authApi';  
import { AuthContext } from '../data/context/AuthContext'; 

const loginSchema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters long').required(),
});

const LoginScreen = ({ navigation }) => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
  });
  const { loginUser } = useContext(AuthContext);

  const onSubmit = async (data) => {
    try {
      const response = await login(data);
      if (response.status === 200 || response.status === 201) {
        const { access_token, refresh_token, user } = response.data;

        loginUser(user);
        await AsyncStorage.setItem('accessToken', access_token);
        await AsyncStorage.setItem('refreshToken', refresh_token);
        await AsyncStorage.setItem('user', JSON.stringify(user));

        Alert.alert('Success', 'Login successful!');
        navigation.navigate('Home');
      }
    } catch (error) {
      Alert.alert('Error', 'Invalid login credentials. Please try again.');
      console.error('Login error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.title}>Log In to Continue</Text>
      </View>

      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.username && styles.inputError]}
            placeholder="Username"
            value={value}
            onChangeText={onChange}
            accessibilityLabel="Username Input"
          />
        )}
      />
      {errors.username && <Text style={styles.error}>{errors.username.message}</Text>}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            placeholder="Password"
            secureTextEntry
            value={value}
            onChangeText={onChange}
            accessibilityLabel="Password Input"
          />
        )}
      />
      {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

      <TouchableOpacity 
        onPress={() => navigation.navigate('ForgotPassword')} 
        style={styles.forgotPasswordButton}
        accessibilityLabel="Forgot Password Button"
        accessibilityHint="Navigate to reset your password"
      >
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.loginButton} 
        onPress={handleSubmit(onSubmit)}
        accessibilityLabel="Log In Button"
        accessibilityHint="Tap to log in to your account"
      >
        <Text style={styles.loginButtonText}>Log In</Text>
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <Text>Do not have an account?</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('SignUp')}
          accessibilityLabel="Sign Up Button"
          accessibilityHint="Navigate to the sign-up screen"
        >
          <Text style={styles.signupText}> Sign Up with Username</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#004d26', // Darker shade for improved contrast
  },
  input: {
    borderWidth: 1,
    borderColor: '#8b8b8b', // Slightly darker border for contrast
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
    backgroundColor: '#f9f9f9', // Light background for better contrast
  },
  inputError: {
    borderColor: '#d32f2f', // High contrast red for error indication
  },
  error: {
    color: '#d32f2f', // Consistent with error border for readability
    marginBottom: 10,
  },
  forgotPasswordButton: {
    minHeight: 48, 
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#006b3c', // Darker green for improved contrast
    textAlign: 'right',
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#006b3c', // Darker green for improved contrast
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    minHeight: 48,
    width: '100%',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    color: '#006b3c', // Darker green for better contrast
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LoginScreen;
