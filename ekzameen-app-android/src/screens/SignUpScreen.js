import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import ModalSelector from 'react-native-modal-selector';
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

  // Data for ModalSelector
  const signUpOptions = [
    { key: 'user', label: 'User' },
    { key: 'agent', label: 'Agent' },
  ];

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
          />
        )}
      />
      {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}

      {/* Sign Up As Picker */}
      <Text style={styles.label}>Sign Up As</Text>
      <ModalSelector
        data={signUpOptions}
        initValue={signUpAs === 'user' ? 'User' : 'Agent'}
        onChange={(option) => setSignUpAs(option.key)}
        style={styles.modalPicker}
        initValueTextStyle={styles.pickerText}
        selectTextStyle={styles.pickerText}
      />

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
          />
        )}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles for the sign-up screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#008a43',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#008a43',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalPicker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  pickerText: {
    fontSize: 16,
    color: '#333',
  },
});

export default SignUpScreen;
