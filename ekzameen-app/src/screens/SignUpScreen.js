import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Picker } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { login, signUp, saveAuthData } from '../data/api/authApi'; // Your signup API function

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

  // Watch username field to generate email dynamically
  const username = watch('username');
  const email = `${username}@tempmail.com`; // Hidden email, generated from username

  // Function to handle sign-up form submission
  const onSubmit = async (data) => {
    console.log('onSubmit invoked');
    try {
      // Generate email based on username
      const email = `${data.username}@tempmail.com`;
  
      // Construct formData for signup
      const formData = {
        ...data,
        email, // Hidden email generated from username
        role: signUpAs, // Include the selected role from the state
      };
  
      console.log('Submitting Form Data: ', formData);
  
      // Make the sign-up request
      const signUpResponse = await signUp(formData);
  
      if (signUpResponse && signUpResponse.data) {
        console.log('Sign Up Successful: ', signUpResponse.data);
  
        // Automatically log in the user using their username and password
        const loginData = {
          username: formData.username,
          password: formData.password,
        };
  
        const loginResponse = await login(loginData);
  
        if (loginResponse && loginResponse.data) {
          console.log('Login Successful: ', loginResponse.data);
  
          // Save user token, profile, etc. (depends on your auth handling)
          // Assuming you have a function to handle token saving
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
      <Text style={styles.title}>Create account</Text>

      <Controller
        control={control}
        name="firstName"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.firstName && <Text style={styles.error}>{errors.firstName.message}</Text>}

      <Controller
        control={control}
        name="lastName"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.lastName && <Text style={styles.error}>{errors.lastName.message}</Text>}

      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.username && <Text style={styles.error}>{errors.username.message}</Text>}

      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Phone"
            keyboardType="phone-pad"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.phone && <Text style={styles.error}>{errors.phone.message}</Text>}

      {/* Sign Up As Picker */}
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Sign Up As</Text>
        <Picker
          selectedValue={signUpAs}
          style={styles.picker}
          onValueChange={(itemValue) => setSignUpAs(itemValue)}
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
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

      <Button title="Submit" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

// Styles for the sign-up screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
    borderColor: '#ccc',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  pickerContainer: {
    marginBottom: 10,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default SignUpScreen;
