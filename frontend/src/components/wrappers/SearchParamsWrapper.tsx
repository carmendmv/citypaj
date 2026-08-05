'use client';

import React, { ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';

interface SearchParamsWrapperProps {
  children: (params: URLSearchParams) => ReactNode;
}

const SearchParamsWrapper: React.FC<SearchParamsWrapperProps> = ({ children }) => {
  const searchParams = useSearchParams();

  return <>{children(searchParams)}</>;
};

export default SearchParamsWrapper;
