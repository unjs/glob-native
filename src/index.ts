import fsp from 'node:fs/promises'
import { fspGlob as _fspGlob } from './implementation'

export type { GlobOptions } from './implementation'

export const fspGlob = (fsp as any).glob as typeof _fspGlob ?? _fspGlob
