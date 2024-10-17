import React from 'react';
import { WebView } from 'react-native-webview';
import { Linking, Alert } from 'react-native'; // Linking from react-native

const WebViewApp = () => {
  
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
    <WebView
      source={{ uri: 'https://app.ekzameen.com/' }} // Your WebView URL
      onShouldStartLoadWithRequest={handleExternalLink} // Intercept external URLs
      javaScriptEnabled={true} // Enable JavaScript
      domStorageEnabled={true} // Enable DOM Storage if needed
    />
  );
};

export default WebViewApp;
