import React, { useEffect } from 'react';
import { View, Text, Platform, Linking } from 'react-native';

const WebViewScreen = () => {
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Open the URL in the browser for Web platform
      window.location.href = 'https://app.ekzameen.com/';
    }
  }, []);

  // Handle other platforms
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    return (
      <WebView
        source={{ uri: 'https://app.ekzameen.com/' }}
        style={{ flex: 1 }}
      />
    );
  } else {
    // Fallback for unsupported platforms (native apps)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>WebView is not supported on this platform.</Text>
      </View>
    );
  }
};

export default WebViewScreen;
