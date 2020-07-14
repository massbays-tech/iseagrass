import { NextRouter } from 'next/router'

export const int = (r: NextRouter, param: string): number | undefined =>
  r.query[param] ? parseInt(r.query[param] as string) : undefined
