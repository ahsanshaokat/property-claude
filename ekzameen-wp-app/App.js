import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Platform, Linking, Alert, View, ActivityIndicator, Image } from 'react-native';
import { WebView } from 'react-native-webview';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Function to handle external links
  const handleExternalLink = (request) => {
    const { url } = request;

    // Check if the URL is an external link for SMS, call, or WhatsApp
    if (url.startsWith('tel:') || url.startsWith('sms:') || url.startsWith('https://wa.me/')) {
      Linking.openURL(url).catch((err) => {
        Alert.alert('Error', 'Unable to open the link');
        console.error("Failed to open link: ", err);
      });
      return false; // Prevent WebView from opening this link
    }
    return true; // Allow other URLs to load in the WebView
  };

  // Function to hide the loading indicator once WebView is loaded
  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} />
      {isLoading && (
        <View style={styles.loadingContainer}>
          <Image source={require('./assets/icon.png')} style={styles.logo} />
          <ActivityIndicator size="large" color="#008541" style={styles.loader} />
        </View>
      )}
      <WebView
        source={{ uri: 'https://app.ekzameen.com/' }}
        style={{ flex: 1 }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        onShouldStartLoadWithRequest={handleExternalLink}
        onLoadEnd={handleLoadEnd}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(216 243 229)',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(216 243 229)',
    zIndex: 1,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  loader: {
    marginTop: 20,
  },
});

export default App;
