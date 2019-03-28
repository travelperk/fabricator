import { Fabricator, sequence } from '../src/fabricator'

describe('sequence()', () => {
  it('should return an increasing number every time it gets called', () => {
    for (let i = 1; i <= 20; i++) {
      expect(sequence()).toBe(i)
    }
  })

  it('should increase the sequences separately', () => {
    const names = ['foo', 'bar', 'baz']
    for (let i = 1; i <= 20; i++) {
      names.forEach(name => expect(sequence(name)).toBe(i))
    }
  })
})

describe('sequence.reset()', () => {
  beforeEach(() => sequence.reset())

  it('should reset all sequences when called with no arguments', () => {
    const names = ['foo', 'bar', 'baz']
    for (let i = 1; i <= 20; i++) {
      names.forEach(name => sequence(name))
    }
    sequence.reset()
    for (let i = 1; i <= 20; i++) {
      names.forEach(name => expect(sequence(name)).toBe(i))
    }
  })

  it('should reset the sequence selected by name', () => {
    const names = ['foo', 'bar', 'baz']
    for (let i = 1; i <= 20; i++) {
      names.forEach(name => sequence(name))
      sequence('extra')
    }
    sequence.reset('extra')
    for (let i = 1; i <= 20; i++) {
      names.forEach(name => expect(sequence(name)).toBe(i + 20))
      expect(sequence('extra')).toBe(i)
    }
  })

  it('should throw an error if the sequence does not exist', () => {
    const name = 'none'
    expect(() => sequence.reset(name)).toThrowError(
      `Sequece "${name}" does not exist`
    )
  })
})
