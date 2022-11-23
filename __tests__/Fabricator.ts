import { Fabricator } from '../src/fabricator'

describe('Fabricator()', () => {
  it('should create an empty model', () => {
    const user = Fabricator()
    expect(user()).toEqual({})
  })

  it('should create a model based on a definition', () => {
    const user = Fabricator({
      id: () => 1,
      firstName: () => 'John',
      lastName: () => 'Doe',
    })
    expect(user()).toEqual({ id: 1, firstName: 'John', lastName: 'Doe' })
  })

  it('should return an object based on a function', () => {
    const functionValue = Fabricator(() => 5 + 3)
    expect(functionValue()).toEqual(8)
  })

  it('should return an object based on the model and on the variations', () => {
    const user = Fabricator({ id: () => 1, admin: () => false })
    expect(user({ admin: true })).toEqual({ id: 1, admin: true })
  })

  describe('model.extend()', () => {
    it('should create an alias for a model', () => {
      const user = Fabricator({
        id: () => 1,
        firstName: () => 'John',
        lastName: () => 'Doe',
      })
      const admin = user.extend()

      expect(user()).toEqual({ id: 1, firstName: 'John', lastName: 'Doe' })
      expect(admin()).toEqual({ id: 1, firstName: 'John', lastName: 'Doe' })
    })

    it('should create a model starting from an existing one', () => {
      const user = Fabricator({
        id: () => 1,
        firstName: () => 'John',
        lastName: () => 'Doe',
        admin: () => false,
      })

      const admin = user.extend({ admin: () => true })

      expect(user()).toEqual({
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        admin: false,
      })
      expect(admin()).toEqual({
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        admin: true,
      })
    })
  })

  describe('model.times()', () => {
    it('should create an array based on the model', () => {
      const user = Fabricator({ id: () => 1 })
      const times = 3
      const objs = user.times(times)
      expect(objs.length).toBe(times)
      objs.forEach((obj) => expect(obj).toEqual({ id: 1 }))
    })

    it('should create an array based on the model and variations', () => {
      const user = Fabricator({ id: () => 1, admin: () => false })
      const times = 3
      const objs = user.times(3, { admin: () => true })
      expect(objs.length).toBe(times)
      objs.forEach((obj) => expect(obj).toEqual({ id: 1, admin: true }))
    })

    it.each`
      min          | max
      ${undefined} | ${10}
      ${0}         | ${10}
      ${3}         | ${undefined}
      ${5}         | ${7}
    `(
      'should create an array of length between min: $min and max: $max',
      ({ min = 1, max = 10 }) => {
        const user = Fabricator({})
        const objs = user.times({ min, max })
        expect(objs.length).toBeGreaterThanOrEqual(min)
        expect(objs.length).toBeLessThanOrEqual(max)
      }
    )
  })

  it.each(['1', true, false, undefined, null, () => {}])(
    'should throw if the count is not a number or an object (test with %p)',
    (count) => {
      expect(() => Fabricator({}).times(count as any)).toThrow()
    }
  )
})
