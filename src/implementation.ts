import process from 'node:process'
import path from 'node:path'
import type { Dirent } from 'node:fs'
import fsp from 'node:fs/promises'

import { fdir as FDir } from 'fdir'

// https://nodejs.org/api/fs.html#fspromisesglobpattern-options
export interface GlobOptions<WithFileTypes extends boolean = false> {
  /** current working directory. Default: process.cwd() */
  cwd?: string
  /**
   * Function to filter out files/directories.
   * Return true to exclude the item, false to include it.
   * @default undefined
   */
  exclude?: (path: string) => boolean
  /**
   * Whether the glob should return paths as Dirents.
   * @default false
   */
  withFileTypes?: WithFileTypes
}

export async function *fspGlob<WithFileTypes extends boolean = false>(pattern: string | string[], options?: GlobOptions<WithFileTypes>): AsyncGenerator<(WithFileTypes extends true ? Dirent : string) | undefined, void, unknown> {
  // Normalise options
  const patterns = Array.isArray(pattern) ? pattern : [pattern]
  const dir = options?.cwd ? path.resolve(options.cwd) : process.cwd()
  const withFileTypes = !!options?.withFileTypes
  type GlobReturn = WithFileTypes extends true ? Dirent : string

  // Initialise watcher
  const fdir = new FDir({
    exclude: options?.exclude ? dirName => options.exclude!(dirName) : undefined,
    filters: options?.exclude ? [(filePath, _isDirectory) => !options.exclude!(path.basename(filePath))] : [],
    includeDirs: true,
    relativePaths: true,
  })

  const files = await fdir.globWithOptions(patterns, {
    dot: false,
    cwd: dir,
    nonegate: true,
  }).crawl(dir).withPromise()

  const contents: Record<string, Dirent[]> = {}

  for (const file of files) {
    const absolutePath = path.resolve(dir, file)
    const relativePath = path.relative(dir, absolutePath)

    if (relativePath) {
      if (withFileTypes) {
        const dirname = path.dirname(absolutePath)
        contents[dirname] ||= await fsp.readdir(dirname, { withFileTypes: true })
        yield contents[dirname].find(file => file.name === path.basename(absolutePath)) as GlobReturn
      }
      else {
        yield relativePath as GlobReturn
      }
    }
  }
}
