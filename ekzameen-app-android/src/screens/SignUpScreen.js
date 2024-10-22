import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Picker } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { login, signUp, saveAuthData } from '../data/api/authApi';

// Validation schema using Yup
const signUpSchema = yup.object({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  username: yup.string().required('Username is required'),
  phone: yup.string().required('Phone number is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters long').required('Password is required'),
});

const SignUpScreen = ({ navigation }) => {
  const [signUpAs, setSignUpAs] = useState('user'); // Default role as 'User'
  const { control, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: yupResolver(signUpSchema),
  });

  const username = watch('username');
  const email = `${username}@tempmail.com`; // Hidden email, generated from username

  // Function to handle sign-up form submission
  const onSubmit = async (data) => {
    try {
      const email = `${data.username}@tempmail.com`;
      const formData = { ...data, email, role: signUpAs };

      const signUpResponse = await signUp(formData);
      if (signUpResponse && signUpResponse.data) {
        const loginData = { username: formData.username, password: formData.password };
        const loginResponse = await login(loginData);

        if (loginResponse && loginResponse.data) {
          saveAuthData(loginResponse.data);
          Alert.alert('Welcome', 'You have been logged in automatically!', [{ text: 'OK', onPress: () => navigation.navigate('Home') }]);
          navigation.navigate('Home');
        } else {
          Alert.alert('Login Failed', 'Unable to log in automatically. Please try logging in manually.');
        }
      } else {
        Alert.alert('Sign Up Failed', 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.log('Error during Sign Up or Login:', error);
      Alert.alert('Error', 'An error occurred during sign-up or login. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <Controller
        control={control}
        name="firstName"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.firstName && styles.inputError]}
            placeholder="First Name"
            value={value}
            onChangeText={onChange}
            accessibilityLabel="First Name Input"
          />
        )}
      />
      {errors.firstName && <Text style={styles.errorText}>{errors.firstName.message}</Text>}

      <Controller
        control={control}
        name="lastName"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.lastName && styles.inputError]}
            placeholder="Last Name"
            value={value}
            onChangeText={onChange}
            accessibilityLabel="Last Name Input"
          />
        )}
      />
      {errors.lastName && <Text style={styles.errorText}>{errors.lastName.message}</Text>}

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
      {errors.username && <Text style={styles.errorText}>{errors.username.message}</Text>}

      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.phone && styles.inputError]}
            placeholder="Phone"
            keyboardType="phone-pad"
            value={value}
            onChangeText={onChange}
            accessibilityLabel="Phone Number Input"
          />
        )}
      />
      {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}

      <Text style={styles.label}>Sign Up As</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={signUpAs}
          style={styles.picker}
          onValueChange={(itemValue) => setSignUpAs(itemValue)}
          accessibilityLabel="Sign Up Role Selector"
          accessibilityHint="Select your role as either User or Agent"
        >
          <Picker.Item label="User" value="user" />
          <Picker.Item label="Agent" value="agent" />
        </Picker>
      </View>

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
      {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

      <TouchableOpacity 
        style={styles.submitButton} 
        onPress={handleSubmit(onSubmit)}
        accessibilityLabel="Register Account Button"
        accessibilityHint="Tap to create your new account"
      >
        <Text style={styles.submitButtonText}>Register Account</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles for the sign-up screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#006b3c', // Darker green for improved contrast
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#8b8b8b', // Darker border for better contrast
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
    minHeight: 48,
    width: '100%',
  },
  inputError: {
    borderColor: '#d32f2f', // High contrast red for errors
  },
  errorText: {
    color: '#d32f2f',
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#8b8b8b', // Ensuring contrast for the picker container
    borderRadius: 8,
    marginBottom: 10,
    minHeight: 48,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  picker: {
    height: 48,
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#006b3c', // Darker green for better contrast
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    minHeight: 48,
    width: '100%',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SignUpScreen;
