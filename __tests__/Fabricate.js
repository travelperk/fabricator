import {
  Fabricator,
  Fabricate,
  __MODELS_OBJET_DO_NOT_USE_OR_YOU_WILL_BE_FIRED as models,
} from '../src/fabricator'

describe('Fabricate()', () => {
  beforeEach(() => {
    Object.keys(models).forEach(key => delete models[key])
  })

  it('should return an object based on the model', () => {
    Fabricator('empty-object')
    expect(Fabricate('empty-object')).toEqual({})

    Fabricator('hardcoded-values', {
      boolean: true,
      number: 1,
      string: 'a',
      array: [0],
    })
    expect(Fabricate('hardcoded-values')).toEqual({
      boolean: true,
      number: 1,
      string: 'a',
      array: [0],
    })

    Fabricator('calculated-values', { foo: () => 'bar' })
    expect(Fabricate('calculated-values')).toEqual({ foo: 'bar' })

    Fabricator('function-value', () => 5 + 3)
    expect(Fabricate('function-value')).toEqual(8)
  })

  it('should return an object based on the model and on the variations', () => {
    Fabricator('user', { id: 1, admin: false })
    expect(Fabricate('user', { admin: true })).toEqual({ id: 1, admin: true })
  })

  it('should throw an error if the model is not registered', () => {
    const modelName = 'user'
    expect(() => Fabricate(modelName)).toThrowError(
      `Model "${modelName}" has not been registered`
    )
  })

  describe('Fabricate.times()', () => {
    it('should create an array based on the model', () => {
      const modelName = 'user'
      const model = { id: 1 }
      Fabricator(modelName, model)
      const times = 3
      const objs = Fabricate.times(3, modelName)
      expect(objs.length).toBe(times)
      objs.forEach(obj => expect(obj).toEqual({ id: 1 }))
    })

    it('should create an array based on the model and variations', () => {
      const modelName = 'user'
      const model = { id: 1, admin: false }
      Fabricator(modelName, model)
      const times = 3
      const objs = Fabricate.times(3, modelName, { admin: true })
      expect(objs.length).toBe(times)
      objs.forEach(obj => expect(obj).toEqual({ id: 1, admin: true }))
    })

    it('should throw an error if the model is not registered', () => {
      const modelName = 'user'
      expect(() => Fabricate('user')).toThrowError(
        `Model "${modelName}" has not been registered`
      )
    })
  })

  describe('Fabricate.sequence()', () => {
    it('should return an increasing number every time it gets called', () => {
      for (let i = 0; i < 20; i++) {
        expect(Fabricate.sequence()).toBe(i)
      }
    })

    it('should increase the sequences separately', () => {
      const names = ['foo', 'bar', 'baz']
      for (let i = 0; i < 20; i++) {
        names.forEach(name => expect(Fabricate.sequence(name)).toBe(i))
      }
    })
  })

  describe('Fabricate.sequence.reset()', () => {
    beforeEach(() => Fabricate.sequence.reset())

    it('should reset all sequences when called with no arguments', () => {
      const names = ['foo', 'bar', 'baz']
      for (let i = 0; i < 20; i++) {
        names.forEach(name => Fabricate.sequence(name))
      }
      Fabricate.sequence.reset()
      for (let i = 0; i < 20; i++) {
        names.forEach(name => expect(Fabricate.sequence(name)).toBe(i))
      }
    })

    it('should reset the sequence selected by name', () => {
      const names = ['foo', 'bar', 'baz']
      for (let i = 0; i < 20; i++) {
        names.forEach(name => Fabricate.sequence(name))
        Fabricate.sequence('extra')
      }
      Fabricate.sequence.reset('extra')
      for (let i = 0; i < 20; i++) {
        names.forEach(name => expect(Fabricate.sequence(name)).toBe(i + 20))
        expect(Fabricate.sequence('extra')).toBe(i)
      }
    })

    it('should throw an error if the sequence does not exist', () => {
      const name = 'none'
      expect(() => Fabricate.sequence.reset(name)).toThrowError(
        `Sequece "${name}" does not exist`
      )
    })
  })
})
