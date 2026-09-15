
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface WeatherErrorDisplayProps {
  errorText: string;
  sectionAnimationVariants: any;
}

export function WeatherErrorDisplay({ errorText, sectionAnimationVariants }: WeatherErrorDisplayProps) {
  return (
    <motion.section
      id="weather-error"
      className="max-w-lg mx-auto"
      variants={sectionAnimationVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Card className="bg-destructive/90 dark:bg-destructive/80 text-destructive-foreground backdrop-blur-sm w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-center flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Weather Alert
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center whitespace-pre-wrap">{errorText.split('\\n').map((line,i) => <React.Fragment key={i}>{line}<br/></React.Fragment>)}</p>
        </CardContent>
      </Card>
    </motion.section>
  );
}
