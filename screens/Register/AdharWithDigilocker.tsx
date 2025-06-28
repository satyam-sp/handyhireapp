import React, { useState } from 'react';
import { View, Button, ActivityIndicator } from 'react-native';
// import { WebView } from 'react-native-webview';

const DIGILOCKER_CLIENT_ID = 'your-client-id';
const REDIRECT_URI = 'your-redirect-uri';
const AUTH_URL = `https://digilocker.meripehchaan.gov.in/public/oauth2/1/authorize?response_type=code&client_id=${DIGILOCKER_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=1234&scope=basic Aadhaar`;

export default function AadhaarViaDigiLocker({ onSuccess }) {
  const [showWebView, setShowWebView] = useState(false);

  const handleWebViewNavigation = async (navState) => {
    const { url } = navState;
    if (url.startsWith(REDIRECT_URI)) {
      const codeMatch = url.match(/[?&]code=([^&]+)/);
      const code = codeMatch?.[1];

      if (code) {
        setShowWebView(false);
        // Exchange code for access token
        const tokenRes = await fetch('https://digilocker.meripehchaan.gov.in/public/oauth2/1/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `grant_type=authorization_code&code=${code}&redirect_uri=${REDIRECT_URI}&client_id=${DIGILOCKER_CLIENT_ID}&client_secret=your-client-secret`
        });
        const tokenData = await tokenRes.json();

        // Now fetch Aadhaar or profile info
        const profileRes = await fetch('https://digilocker.meripehchaan.gov.in/public/oauth2/1/user/profile', {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`
          }
        });
        const profileData = await profileRes.json();

        // You can also call `/user/documents` or `/documents/issued` if needed

        onSuccess(profileData);
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {!showWebView ? (
        <Button title="Verify Aadhaar via DigiLocker" onPress={() => setShowWebView(true)} />
      ) : (null
        // <WebView
        //   source={{ uri: AUTH_URL }}
        //   onNavigationStateChange={handleWebViewNavigation}
        //   startInLoadingState
        //   renderLoading={() => <ActivityIndicator size="large" color="#0000ff" />}
        // />
      )}
    </View>
  );
}
