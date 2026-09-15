
'use client';
import { cn } from "@/lib/utils";
import createGlobe from "cobe";
import { useEffect, useRef, useState } from "react";

interface GlobeLocation {
  lat: number;
  lon: number;
}

export const Globe = ({
  className,
  location,
}: {
  className?: string;
  location: GlobeLocation | null;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const easedPhiRef = useRef(0);
  const easedThetaRef = useRef(0.3);

  // State to hold the globe's width, allows re-rendering on resize
  const [globeWidth, setGlobeWidth] = useState(0);

  // Effect to set initial width and add resize listener
  useEffect(() => {
    const onResize = () => {
      if (canvasRef.current) setGlobeWidth(canvasRef.current.offsetWidth);
    };
    window.addEventListener('resize', onResize);
    onResize();
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (globeWidth === 0 || !canvasRef.current) return;
    
    const spinRate = 0.03;
    const easing = 0.1;

    const targetPhi = location ? location.lon * (Math.PI / 180) : 0;
    const targetTheta = location ? location.lat * (Math.PI / 180) : 0.3;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: globeWidth * 2,
      height: globeWidth * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 2.5,
      baseColor: [0.294, 0, 0.51], // Deep Indigo
      markerColor: [0.847, 0.706, 0.996], // Soft Violet
      glowColor: [0.847, 0.706, 0.996], // Soft Violet
      markers: location
        ? [{ location: [location.lat, location.lon], size: 0.1 }]
        : [],
      onRender: (state) => {
        easedPhiRef.current += (targetPhi - easedPhiRef.current) * easing;
        easedThetaRef.current += (targetTheta - easedThetaRef.current) * easing;
        rotationRef.current += spinRate;
        state.phi = rotationRef.current - easedPhiRef.current;
        state.theta = easedThetaRef.current;
      },
    });

    return () => globe.destroy();
  }, [location, globeWidth]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
      className={cn("mx-auto", className)}
    />
  );
};
