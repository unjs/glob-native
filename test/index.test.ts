import fsp from 'node:fs/promises'
import path from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { fspGlob } from '../src/implementation.js'

const relativeFixturePath = 'node_modules/_test_fixture'
const absoluteFixturePath = path.resolve(relativeFixturePath)

const fixture = [
  '.dot/file.js',
  'dir/index.js',
  'dir/README.md',
  'other/file.ts',
]

const cases = new Map<Parameters<typeof fspGlob>, any>([
  [
    ['**/*.js', { cwd: relativeFixturePath }],
    ['dir/index.js'],
  ],
  [
    ['**/*', { cwd: relativeFixturePath }],
    ['dir', 'other', 'other/file.ts', 'dir/README.md', 'dir/index.js'],
  ],
  [
    // negative patterns are not supported
    [['**/*', '!**/*.md'], { cwd: relativeFixturePath }],
    ['dir', 'other', 'other/file.ts', 'dir/README.md', 'dir/index.js'],
  ],
  [
    // file types
    [['**/*.js'], { cwd: relativeFixturePath, withFileTypes: true as const }],
    [expect.objectContaining({
      name: 'index.js',
      parentPath: path.join(absoluteFixturePath, 'dir'),
      path: path.join(absoluteFixturePath, 'dir'),
    })],
  ],
  [
    // exclude - note that the node behaviour doesn't entirely match the docs - it only triggers on directories
    [['fixture/**/*.*'], { cwd: 'test', exclude: path => path.endsWith('dir') }],
    ['fixture/other/file.ts'],
  ],
  [
    // exclude - note that the node behaviour doesn't entirely match the docs - it only triggers on directories
    [['fixture/**/*.*'], { cwd: 'test', exclude: path => path.endsWith('.ts') }],
    ['fixture/dir/README.md', 'fixture/dir/index.js'],
  ],
  // Inconsistent implementation from polyfill
  // [
  //   // exclude - note that the node behaviour doesn't entirely match the docs - it only triggers on directories
  //   [['fixture/**/*'], { cwd: 'test', exclude: path => path.endsWith('dir') }],
  //   ['fixture/other', 'fixture/other/file.ts'],
  // ],
  // Buggy implementation from Node
  // [
  //   // exclude - note that the node behaviour doesn't entirely match the docs - it only triggers on directories
  //   [['fixture/**/*'], { cwd: 'test', exclude: path => path.endsWith('.ts') }],
  //   ['fixture/dir', 'fixture/other', 'fixture/dir/README.md', 'fixture/dir/index.js', 'fixture/other/file.ts'],
  // ],
])

const implementations = {
  native: (fsp as any).glob as typeof fspGlob,
  polyfill: fspGlob,
}

describe('fspGlob', () => {
  beforeAll(async () => {
    await fsp.rm(absoluteFixturePath, { recursive: true, force: true })
    for (const file of fixture) {
      const filePath = path.join(absoluteFixturePath, file)
      await fsp.mkdir(path.dirname(filePath), { recursive: true })
      await fsp.writeFile(filePath, '')
    }
  })

  it.each(Object.entries(implementations))('works with %s implementation', async (name, implementation) => {
    for (const [args, result] of cases) {
      const entries = []
      for await (const entry of implementation(...args)) {
        entries.push(entry)
      }
      expect(entries.sort()).toEqual(result.sort())
    }
  })

  afterAll(async () => {
    // await fsp.rm(absoluteFixturePath, { recursive: true, force: true })
  })
})
