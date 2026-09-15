
'use client';

import { useState, useEffect } from 'react';
import { SplashScreen } from '@/components/layout/SplashScreen';
import { ScrollProgressIndicator } from '@/components/layout/ScrollProgressIndicator';
import { AnimatePresence } from 'framer-motion';

// Firebase
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import { getPerformance } from "firebase/performance";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
let app: FirebaseApp | undefined;
// Check if all config values are provided before initializing
if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
}


export function ClientLayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    // Initialize Firebase services on client side only if app was initialized
    if (typeof window !== 'undefined' && app) {
      // Initialize Analytics
      isAnalyticsSupported().then((supported) => {
        if (supported) {
          getAnalytics(app as FirebaseApp);
        }
      });

      // Initialize Performance Monitoring
      try {
        getPerformance(app as FirebaseApp);
      } catch (error) {
        console.error("Firebase Performance Monitoring initialization failed:", error);
      }
    }

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && <SplashScreen />}
      </AnimatePresence>
      
      {!isLoading && <ScrollProgressIndicator />}
      {children}
    </>
  );
}
