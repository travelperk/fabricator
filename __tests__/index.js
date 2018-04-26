import { Fabricator, Fabricate, faker } from '../src/fabricator'

describe('fabricator', () => {
  it('should export Fabricator()', () => {
    expect(Fabricator).toBeDefined()
    expect(typeof Fabricator).toBe('function')
  })

  it('should export Fabricate()', () => {
    expect(Fabricate).toBeDefined()
    expect(typeof Fabricate).toBe('function')
  })
})
