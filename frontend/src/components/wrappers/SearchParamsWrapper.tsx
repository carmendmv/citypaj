'use client';

import { Suspense } from 'react';
import { Spinner } from '@/components/ui/Spinner';

interface SearchParamsWrapperProps {
  children: React.ReactNode;
}

export function SearchParamsWrapper({ children }: SearchParamsWrapperProps) {
  return (
    <Suspense fallback={<Spinner />}>
      {children}
    </Suspense>
  );
}
