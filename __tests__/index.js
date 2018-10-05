import { Fabricator, sequence } from '../src/'

describe('fabricator', () => {
  it('should export Fabricator()', () => {
    expect(Fabricator).toBeDefined()
    expect(typeof Fabricator).toBe('function')
  })

  it('should export sequence()', () => {
    expect(sequence).toBeDefined()
    expect(typeof sequence).toBe('function')
  })
})
