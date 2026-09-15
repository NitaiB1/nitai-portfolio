
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface ParallaxBackgroundProps {
  targetImageSrc: string;
  ultimateFallbackSrc: string;
  onImageLoadStatusChange: (status: {
    isLoading: boolean;
    success: boolean;
    loadedSrc: string;
    errorType?: 'preload' | 'render';
    errorMessage?: string;
  }) => void;
}

export function ParallaxBackground({
  targetImageSrc,
  ultimateFallbackSrc,
  onImageLoadStatusChange,
}: ParallaxBackgroundProps) {
  const [currentDisplayedImage, setCurrentDisplayedImage] = useState<{ src: string; key: string }>({
    src: ultimateFallbackSrc,
    key: 'initial_fallback_' + Date.now(),
  });

  useEffect(() => {
    if (targetImageSrc === currentDisplayedImage.src) {
      onImageLoadStatusChange({ isLoading: false, success: true, loadedSrc: targetImageSrc });
      return;
    }

    onImageLoadStatusChange({ isLoading: true, success: false, loadedSrc: currentDisplayedImage.src });

    if (targetImageSrc === ultimateFallbackSrc) {
      setCurrentDisplayedImage({ src: ultimateFallbackSrc, key: 'fallback_direct_' + Date.now() });
      onImageLoadStatusChange({ isLoading: false, success: true, loadedSrc: ultimateFallbackSrc });
      return;
    }

    const preloader = new window.Image();
    preloader.onload = () => {
      setCurrentDisplayedImage({ src: targetImageSrc, key: targetImageSrc + Date.now() });
      onImageLoadStatusChange({ isLoading: false, success: true, loadedSrc: targetImageSrc });
    };
    preloader.onerror = () => {
      // console.error('ParallaxBackground: Image preloading failed for src:', targetImageSrc); // Kept for essential error diagnosis
      if (currentDisplayedImage.src !== ultimateFallbackSrc) {
        setCurrentDisplayedImage({ src: ultimateFallbackSrc, key: 'fallback_preload_error_' + Date.now() });
      }
      onImageLoadStatusChange({
        isLoading: false,
        success: false,
        loadedSrc: ultimateFallbackSrc,
        errorType: 'preload',
        errorMessage: `Image preloading failed for ${targetImageSrc}.`,
      });
    };
    preloader.src = targetImageSrc;

    return () => {
      preloader.onload = null;
      preloader.onerror = null;
    };
  }, [targetImageSrc, ultimateFallbackSrc, onImageLoadStatusChange, currentDisplayedImage.src]);


  const handleImageComponentError = useCallback(() => {
    // console.error('ParallaxBackground: next/image onError triggered for src:', currentDisplayedImage.src); // Kept for essential error diagnosis
    if (currentDisplayedImage.src !== ultimateFallbackSrc) {
      setCurrentDisplayedImage({ src: ultimateFallbackSrc, key: 'fallback_render_error_' + Date.now() });
      onImageLoadStatusChange({
        isLoading: false,
        success: false,
        loadedSrc: ultimateFallbackSrc,
        errorType: 'render',
        errorMessage: `Image rendering failed for ${currentDisplayedImage.src}. Displaying fallback.`,
      });
    } else {
      onImageLoadStatusChange({
        isLoading: false,
        success: false,
        loadedSrc: ultimateFallbackSrc,
        errorType: 'render',
        errorMessage: `Ultimate fallback image rendering failed for ${currentDisplayedImage.src}.`,
      });
    }
  }, [currentDisplayedImage.src, ultimateFallbackSrc, onImageLoadStatusChange]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentDisplayedImage.key}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 1.0, ease: 'easeInOut' } }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
          className="absolute inset-0"
        >
          <Image
            src={currentDisplayedImage.src}
            alt="Weather background"
            fill
            sizes="100vw"
            style={{ objectFit: 'fill' }}
            priority={currentDisplayedImage.src === ultimateFallbackSrc}
            quality={currentDisplayedImage.src.startsWith('http') ? 95 : 100}
            onError={handleImageComponentError}
            data-ai-hint={currentDisplayedImage.src === ultimateFallbackSrc ? "stars night sky space" : "weather condition"}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
