import { useRouter } from 'next/router'

export const useQuery = (q: string): number | undefined => {
  const router = useRouter()
  return router.query[q] ? parseInt(router.query[q] as string) : undefined
}
