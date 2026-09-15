
'use client'; // Ensure client component directive

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

const sectionAnimationVariants = { // Copied from weather/page.tsx for consistency if used
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeOut" } }
};

export const WeatherPageSkeleton: React.FC = () => (
  <>
    <motion.div
        key="skeleton-current"
        variants={sectionAnimationVariants}
        initial="visible" // Start visible as it's part of loading state
        animate="visible"
        exit="exit"
        className="max-w-lg mx-auto bg-card/90 dark:bg-card/80 backdrop-blur-md rounded-lg shadow-xl"
      >
      <Card className="shadow-none w-full bg-transparent">
        <CardHeader className="text-center pb-2">
          <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
          <Skeleton className="h-4 w-1/4 mx-auto mb-2" />
          <div className="flex items-center justify-center space-x-4 mt-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-20" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center space-y-2">
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-6 w-2/3" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-2 p-3 bg-muted/60 dark:bg-muted/50 rounded-lg">
                <Skeleton className="h-5 w-5 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>

    <motion.div
      key="skeleton-hourly"
      variants={sectionAnimationVariants}
      initial="visible"
      animate="visible"
      exit="exit"
      className="max-w-lg mx-auto mt-8 bg-card/90 dark:bg-card/80 backdrop-blur-md rounded-lg shadow-xl">
      <Card className="shadow-none w-full bg-transparent">
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full whitespace-nowrap rounded-md">
            <div className="flex space-x-4 pb-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="flex flex-col items-center p-3 rounded-lg bg-muted/40 dark:bg-muted/30 w-24 text-center shadow-md flex-shrink-0">
                  <Skeleton className="h-4 w-12 mb-1" />
                  <Skeleton className="h-10 w-10 rounded-full my-1" />
                  <Skeleton className="h-5 w-10 mb-0.5" />
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>

    <motion.div
      key="skeleton-daily"
      variants={sectionAnimationVariants}
      initial="visible"
      animate="visible"
      exit="exit"
      className="max-w-lg mx-auto mt-8 bg-card/90 dark:bg-card/80 backdrop-blur-md rounded-lg shadow-xl">
      <Card className="shadow-none w-full bg-transparent">
        <CardHeader>
           <Skeleton className="h-6 w-1/3" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(3)].map((_, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center justify-between p-3 rounded-lg bg-muted/40 dark:bg-muted/30 shadow gap-3">
                <div className="flex items-center space-x-3 text-center">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <div className="flex flex-col items-center text-center space-y-1.5">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-4 w-3/4" />
                <div className="flex flex-row items-center gap-x-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
              {index < 2 && <Separator />}
            </React.Fragment>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  </>
);
