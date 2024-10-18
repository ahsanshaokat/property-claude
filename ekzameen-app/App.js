import React, { useState } from 'react';
import { WebView } from 'react-native-webview';
import { View, ActivityIndicator, StyleSheet, Image, Linking, Alert } from 'react-native';

const WebViewApp = () => {
  const [loading, setLoading] = useState(true); // State to control loading indicator

  // Function to handle external URLs like calls, SMS, WhatsApp, etc.
  const handleExternalLink = (event) => {
    const { url } = event;

    // Check if the URL is a tel: (call), sms: (SMS), or WhatsApp link
    if (url.startsWith('tel:') || url.startsWith('sms:') || url.startsWith('whatsapp://')) {
      // Use Linking API to open external apps
      Linking.openURL(url).catch(err => 
        Alert.alert('Error', 'Unable to open the link')
      );
      return false; // Prevent WebView from handling this URL
    }

    return true; // Allow WebView to handle other URLs
  };

  return (
    <View style={{ flex: 1 }}>
      {loading && (
        <View style={styles.loadingContainer}>
          {/* Splash or loading indicator */}
          <Image 
            source={require('../assets/splash-image.png')} // Your splash image here
            style={styles.splashImage} 
          />
          <ActivityIndicator size="large" color="#008a43" style={styles.activityIndicator} />
        </View>
      )}
      <WebView
        source={{ uri: 'https://app.ekzameen.com/' }} // Your WebView URL
        onShouldStartLoadWithRequest={handleExternalLink} // Intercept external URLs
        javaScriptEnabled={true} // Enable JavaScript
        domStorageEnabled={true} // Enable DOM Storage if needed
        onLoad={() => setLoading(false)} // Hide loading when page loads
        onLoadStart={() => setLoading(true)} // Show loading when page starts loading
        onLoadEnd={() => setLoading(false)} // Hide loading when page finishes loading
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Background color for splash/loading screen
    zIndex: 10,
  },
  splashImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  activityIndicator: {
    marginTop: 20,
  },
});

export default WebViewApp;
