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
})
