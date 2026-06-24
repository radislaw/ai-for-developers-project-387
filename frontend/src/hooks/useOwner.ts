import { useQuery } from '@tanstack/react-query';
import { getOwner } from '../api/owner';

export function useOwner() {
  return useQuery({
    queryKey: ['owner'],
    queryFn: getOwner,
    staleTime: 10 * 60 * 1000,
  });
}