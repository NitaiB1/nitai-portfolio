
'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { SparklesCore } from "@/components/ui/sparkles";

// --- Game Configuration ---
const STAR_COUNT = 200;
const ROCKET_WIDTH = 40;
const ROCKET_HEIGHT = 63;
const ASTEROID_SPAWN_RATE_INITIAL = 40; // Lower is faster
const ASTEROID_SPEED_INITIAL = 4;
const ASTEROID_SPEED_INCREASE = 0.0001;

// The SVG for the rocket as a string constant for cleaner code.
const ROCKET_SVG_STRING = `
<svg width="52" height="82" viewBox="0 0 52 82" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M38 52L49 82H41L38 52Z" fill="#4B0082"/>
    <path d="M14 52L3 82H11L14 52Z" fill="#4B0082"/>
    <path d="M26 0C26 0 52 23.0187 52 52H0C0 23.0187 26 0 26 0Z" fill="#F0F8FF" stroke="#4B0082" stroke-width="2"/>
    <circle cx="26" cy="40" r="11" fill="#4B0082"/>
    <circle cx="26" cy="40" r="9" fill="#87CEFA"/>
    <path d="M21 35C21 35 24 32 28 34" stroke="white" stroke-width="2" stroke-linecap="round"/>
    <path d="M26 0C26 0 34 10 26 22C18 10 26 0 26 0Z" fill="#FF6347"/>
</svg>`;


// --- Interfaces for Game Objects ---
interface Star {
  x: number; y: number; radius: number; alpha: number; twinkleSpeed: number;
}
interface Rocket {
  x: number; y: number; width: number; height: number; speed: number;
}
interface Point { x: number; y: number; }
interface Crater { x: number; y: number; radius: number; }
interface Asteroid {
  x: number; y: number; radius: number; speed: number; rotation: number;
  rotationSpeed: number; points: Point[]; craters: Crater[];
}

// --- Helper Functions & Sub-components ---

// Creates a new asteroid with pre-calculated shape and craters
const createAsteroid = (canvasWidth: number, currentSpeed: number): Asteroid => {
  const radius = 20 + Math.random() * 25;
  const points: Point[] = [];
  const pointCount = 7 + Math.floor(Math.random() * 3);
  for (let i = 0; i < pointCount; i++) {
    const angle = (i * 2 * Math.PI) / pointCount;
    const r = radius * (0.8 + Math.random() * 0.4);
    points.push({ x: r * Math.cos(angle), y: r * Math.sin(angle) });
  }

  const craters: Crater[] = [];
  const craterCount = 1 + Math.floor(Math.random() * 3);
  for (let i = 0; i < craterCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distFromCenter = Math.random() * radius * 0.6;
    craters.push({
      x: Math.cos(angle) * distFromCenter,
      y: Math.sin(angle) * distFromCenter,
      radius: radius * (0.1 + Math.random() * 0.15)
    });
  }

  return {
    x: Math.random() * canvasWidth,
    y: -radius, // Start off-screen
    radius,
    speed: currentSpeed + Math.random() * 1.5,
    rotation: 0,
    rotationSpeed: (Math.random() - 0.5) * 0.05,
    points,
    craters,
  };
};

const drawRocketFlame = (ctx: CanvasRenderingContext2D, rocket: Rocket) => {
    if (Math.random() < 0.2) return; // Adds flicker effect

    ctx.fillStyle = '#FF5A79';
    const flameBaseY = rocket.y + rocket.height * 0.95;
    const flameFlickerHeight = 15 + Math.random() * 10;
    const flameWidth = rocket.width * 0.5;

    ctx.beginPath();
    ctx.moveTo(rocket.x - flameWidth / 2, flameBaseY);
    ctx.lineTo(rocket.x + flameWidth / 2, flameBaseY);
    ctx.lineTo(rocket.x, flameBaseY + flameFlickerHeight);
    ctx.closePath();
    ctx.fill();
};


const MenuScreen = ({ onStartGame }: { onStartGame: () => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    className="z-10 text-center bg-black/50 backdrop-blur-sm p-8 rounded-lg flex flex-col items-center"
  >
    <h1 className="text-5xl md:text-7xl font-bold text-accent mb-2">Astro World 🚀</h1>
     <div className="w-full max-w-lg mb-4">
        {/* Instructions */}
        <p className="text-lg text-muted-foreground mb-4">Dodge the asteroids and travel as far as you can!</p>
        <div className="text-sm text-muted-foreground/80 mb-2">
            <p>
                <span className="font-semibold text-accent/90">Controls:</span> Use <kbd className="px-2 py-1 text-xs font-semibold text-foreground bg-background/50 border border-border rounded-md">←</kbd> <kbd className="px-2 py-1 text-xs font-semibold text-foreground bg-background/50 border border-border rounded-md">→</kbd> or tap the left/right side of the screen to move.
            </p>
        </div>

        {/* Sparkles */}
        <div className="w-full h-20 relative">
             <SparklesCore
                id="menu-sparkles"
                background="transparent"
                minSize={0.4}
                maxSize={1.2}
                particleDensity={1000}
                className="w-full h-full"
                particleColor="#D8B4FE" // Soft Violet accent
            />
        </div>
    </div>
    <Button size="lg" onClick={onStartGame}>Start Game</Button>
  </motion.div>
);

const GameOverScreen = ({ onRestart, finalDistance, highScore }: { onRestart: () => void; finalDistance: number; highScore: number; }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    className="z-10 text-center bg-black/50 backdrop-blur-sm p-8 rounded-lg"
  >
    <h2 className="text-5xl md:text-7xl font-bold text-destructive mb-4">Game Over</h2>
    <p className="text-2xl text-white mb-2">You traveled</p>
    <p className="text-4xl font-bold text-accent mb-6">{finalDistance} km</p>
    <p className="text-xl text-muted-foreground mb-8">Best: {highScore} km</p>
    <Button size="lg" onClick={onRestart}>Play Again</Button>
  </motion.div>
);

const GameHUD = ({ distance, highScore }: { distance: number; highScore: number; }) => (
  <>
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="absolute top-5 left-5 z-10 text-xl font-bold text-white/90 bg-black/50 p-3 rounded-md"
    >
      Best: {highScore} km
    </motion.div>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute top-5 right-5 z-10 text-2xl font-bold text-white/90 bg-black/50 p-3 rounded-md"
    >
      Distance: {distance} km
    </motion.div>
  </>
);

const TouchControls = ({ onTouch }: { onTouch: (side: 'left' | 'right', state: boolean) => void }) => (
  <>
    <div
      className="absolute left-0 top-0 h-full w-1/2 z-20"
      onTouchStart={() => onTouch('left', true)}
      onTouchEnd={() => onTouch('left', false)}
    ></div>
    <div
      className="absolute right-0 top-0 h-full w-1/2 z-20"
      onTouchStart={() => onTouch('right', true)}
      onTouchEnd={() => onTouch('right', false)}
    ></div>
  </>
);


// --- Main Game Component ---
export default function AstroWorldPageClient() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameOver'>('menu');
    const [distance, setDistance] = useState(0);
    const [finalDistance, setFinalDistance] = useState(0);
    const [highScore, setHighScore] = useState(0);

    // Use refs for game state that changes every frame to avoid re-renders
    const gameLoopRef = useRef<number>();
    const rocketRef = useRef<Rocket | null>(null);
    const asteroidsRef = useRef<Asteroid[]>([]);
    const starsRef = useRef<Star[]>([]);
    const keysRef = useRef<{ [key: string]: boolean }>({});
    const touchStateRef = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });
    const asteroidSpawnTimerRef = useRef(ASTEROID_SPAWN_RATE_INITIAL);
    const distanceRef = useRef(0);
    const gameSpeedRef = useRef(ASTEROID_SPEED_INITIAL);
    const rocketImageRef = useRef<HTMLImageElement | null>(null);
    const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);

    // --- Canvas Drawing Functions ---
    const drawStars = useCallback((ctx: CanvasRenderingContext2D) => {
        ctx.save();
        starsRef.current.forEach(star => {
            star.alpha += star.twinkleSpeed;
            if (star.alpha > 1) { star.alpha = 1; star.twinkleSpeed *= -1; }
            else if (star.alpha < 0.2) { star.alpha = 0.2; star.twinkleSpeed *= -1; }
            ctx.globalAlpha = star.alpha;
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.restore();
    }, []);

    const drawRocket = useCallback((ctx: CanvasRenderingContext2D) => {
        const rocket = rocketRef.current;
        if (!rocket) return;
        
        ctx.save();

        // Draw flame first so it appears behind the rocket
        drawRocketFlame(ctx, rocket);
        
        if (rocketImageRef.current) {
            ctx.drawImage(rocketImageRef.current, rocket.x - rocket.width / 2, rocket.y, rocket.width, rocket.height);
        }
        ctx.restore();
    }, []);

    const drawAsteroids = useCallback((ctx: CanvasRenderingContext2D) => {
        ctx.save();
        const mainColor = '#966F33';
        const shadowColor = '#654321';
        const craterColor = '#5C4033';

        asteroidsRef.current.forEach(asteroid => {
            ctx.save();
            ctx.translate(asteroid.x, asteroid.y);
            ctx.rotate(asteroid.rotation);
            
            // Draw shadow
            ctx.fillStyle = shadowColor;
            ctx.beginPath();
            ctx.moveTo(asteroid.points[0].x + 2, asteroid.points[0].y + 2);
            for (let i = 1; i < asteroid.points.length; i++) {
                ctx.lineTo(asteroid.points[i].x + 2, asteroid.points[i].y + 2);
            }
            ctx.closePath();
            ctx.fill();

            // Draw main body
            ctx.fillStyle = mainColor;
            ctx.beginPath();
            ctx.moveTo(asteroid.points[0].x, asteroid.points[0].y);
            for (let i = 1; i < asteroid.points.length; i++) {
                ctx.lineTo(asteroid.points[i].x, asteroid.points[i].y);
            }
            ctx.closePath();
            ctx.fill();

            // Draw craters
            asteroid.craters.forEach(crater => {
                ctx.fillStyle = craterColor;
                ctx.beginPath();
                ctx.arc(crater.x, crater.y, crater.radius, 0, Math.PI * 2);
                ctx.fill();
            });

            ctx.restore();
        });
        ctx.restore();
    }, []);


    // --- Game Logic ---
    const updateStars = useCallback((canvasHeight: number, canvasWidth: number) => {
        starsRef.current.forEach(star => {
            star.y += gameSpeedRef.current / 4;
            if (star.y > canvasHeight) {
                star.y = 0;
                star.x = Math.random() * canvasWidth;
            }
        });
    }, []);

    const updateRocketPosition = useCallback((canvasWidth: number) => {
        const rocket = rocketRef.current;
        if (!rocket) return;
        if (keysRef.current['ArrowLeft'] || touchStateRef.current.left) rocket.x -= rocket.speed;
        if (keysRef.current['ArrowRight'] || touchStateRef.current.right) rocket.x += rocket.speed;
        rocket.x = Math.max(rocket.width / 2, Math.min(canvasWidth - rocket.width / 2, rocket.x));
    }, []);

    const updateAsteroidsAndCheckCollisions = useCallback((canvasHeight: number) => {
        const rocket = rocketRef.current;
        if (!rocket) return false;
    
        // Define rocket's bounding box once for performance
        const rocketLeft = rocket.x - rocket.width / 2;
        const rocketRight = rocket.x + rocket.width / 2;
        const rocketTop = rocket.y;
        const rocketBottom = rocket.y + rocket.height;
    
        for (let i = asteroidsRef.current.length - 1; i >= 0; i--) {
            const asteroid = asteroidsRef.current[i];
            asteroid.y += asteroid.speed;
            asteroid.rotation += asteroid.rotationSpeed;
    
            if (asteroid.y > canvasHeight + asteroid.radius) {
                asteroidsRef.current.splice(i, 1);
                continue;
            }
    
            // --- Improved Collision Detection (Circle vs. Rectangle) ---
            // Find the closest point on the rocket's bounding box to the asteroid's center
            const closestX = Math.max(rocketLeft, Math.min(asteroid.x, rocketRight));
            const closestY = Math.max(rocketTop, Math.min(asteroid.y, rocketBottom));
    
            // Calculate the squared distance between the closest point and the asteroid's center
            const dx = asteroid.x - closestX;
            const dy = asteroid.y - closestY;
            const distanceSquared = (dx * dx) + (dy * dy);
    
            // If the squared distance is less than the asteroid's squared radius, a collision occurred
            if (distanceSquared < (asteroid.radius * asteroid.radius)) {
                return true; // Collision detected
            }
        }
        return false; // No collision
    }, []);

    const handleAsteroidSpawning = useCallback((canvasWidth: number) => {
        asteroidSpawnTimerRef.current--;
        if (asteroidSpawnTimerRef.current <= 0) {
            asteroidsRef.current.push(createAsteroid(canvasWidth, gameSpeedRef.current));
            const spawnRate = ASTEROID_SPAWN_RATE_INITIAL / Math.sqrt(gameSpeedRef.current);
            asteroidSpawnTimerRef.current = Math.max(20, spawnRate);
        }
    }, []);

    const updateGameProgress = useCallback(() => {
        gameSpeedRef.current += ASTEROID_SPEED_INCREASE;
        distanceRef.current += gameSpeedRef.current * 0.1;
        setDistance(Math.floor(distanceRef.current));
    }, []);
    
    const gameLoop = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;
        
        // --- 1. UPDATE GAME STATE ---
        updateRocketPosition(canvas.width);
        updateStars(canvas.height, canvas.width);
        
        const collisionDetected = updateAsteroidsAndCheckCollisions(canvas.height);
        
        if (collisionDetected) {
            const finalScore = Math.floor(distanceRef.current);
            setFinalDistance(finalScore);
            if (finalScore > highScore) {
                setHighScore(finalScore);
            }
            setGameState('gameOver');
            if (backgroundAudioRef.current) {
                backgroundAudioRef.current.pause();
            }
            return; // Stop the loop
        }

        handleAsteroidSpawning(canvas.width);
        updateGameProgress();

        // --- 2. DRAW EVERYTHING ---
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawStars(ctx);
        drawAsteroids(ctx);
        drawRocket(ctx);
        
        // --- 3. QUEUE NEXT FRAME ---
        gameLoopRef.current = requestAnimationFrame(gameLoop);
    }, [
        highScore, 
        updateStars, 
        updateRocketPosition, 
        updateAsteroidsAndCheckCollisions, 
        handleAsteroidSpawning, 
        updateGameProgress, 
        drawStars, 
        drawRocket, 
        drawAsteroids
    ]);

    const initializeCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const { width, height } = canvas.getBoundingClientRect();
        canvas.width = width;
        canvas.height = height;

        starsRef.current = [];
        for (let i = 0; i < STAR_COUNT; i++) {
            starsRef.current.push({
                x: Math.random() * canvas.width, y: Math.random() * canvas.height,
                radius: Math.random() * 1.5, alpha: 0.5,
                twinkleSpeed: (Math.random() - 0.5) * 0.015,
            });
        }
    }, []);
    
    const startGame = useCallback(() => {
        initializeCanvas();
        const canvas = canvasRef.current;
        if (!canvas) return;

        distanceRef.current = 0;
        setDistance(0);
        gameSpeedRef.current = ASTEROID_SPEED_INITIAL;
        asteroidsRef.current = [];
        rocketRef.current = {
            x: canvas.width / 2, y: canvas.height - 100,
            width: ROCKET_WIDTH, height: ROCKET_HEIGHT, speed: 7,
        };
        keysRef.current = {};
        touchStateRef.current = { left: false, right: false };
        setGameState('playing');
        if (backgroundAudioRef.current) {
            backgroundAudioRef.current.currentTime = 0;
            backgroundAudioRef.current.play().catch(e => console.error("Audio playback failed:", e));
        }
    }, [initializeCanvas]);

    // --- Effects ---
    
    useEffect(() => {
        const img = new Image();
        img.onload = () => { rocketImageRef.current = img; };
        img.src = `data:image/svg+xml;base64,${btoa(ROCKET_SVG_STRING)}`;
    }, []);

    useEffect(() => {
        // Preload audio
        backgroundAudioRef.current = new Audio('/astro.mp3');
        backgroundAudioRef.current.loop = true;
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => { keysRef.current[e.code] = true; };
        const handleKeyUp = (e: KeyboardEvent) => { keysRef.current[e.code] = false; };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useEffect(() => {
        if (gameState === 'playing') {
            gameLoopRef.current = requestAnimationFrame(gameLoop);
        }
        return () => {
            if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
        };
    }, [gameState, gameLoop]);
    
    useEffect(() => {
      window.addEventListener('resize', initializeCanvas);
      initializeCanvas(); // Initial call
      return () => window.removeEventListener('resize', initializeCanvas);
    }, [initializeCanvas]);


    return (
        <div className="flex flex-col min-h-screen bg-black text-white font-headline">
            <Header />
            <main className="flex-grow flex items-center justify-center relative w-full h-full overflow-hidden">
                <canvas ref={canvasRef} onContextMenu={(e) => e.preventDefault()} className="absolute top-0 left-0 w-full h-full" />
                
                {gameState === 'playing' && (
                    <TouchControls onTouch={(side, state) => touchStateRef.current[side] = state} />
                )}

                <AnimatePresence>
                    {gameState === 'menu' && <MenuScreen onStartGame={startGame} />}
                </AnimatePresence>
                
                <AnimatePresence>
                    {gameState === 'playing' && <GameHUD distance={distance} highScore={highScore} />}
                </AnimatePresence>

                <AnimatePresence>
                    {gameState === 'gameOver' && <GameOverScreen onRestart={startGame} finalDistance={finalDistance} highScore={highScore} />}
                </AnimatePresence>
            </main>
            <Footer />
        </div>
    );
};
