import {
  Fabricator,
  __MODELS_OBJET_DO_NOT_USE_OR_YOU_WILL_BE_FIRED as models,
} from '../src/fabricator'

describe('Fabricator()', () => {
  beforeEach(() => {
    Object.keys(models).forEach(key => delete models[key])
  })

  it('should store an empty model', () => {
    const modelName = 'user'
    Fabricator(modelName)
    const modelNames = Object.keys(models)
    expect(modelNames).toContain(modelName)
    expect(models[modelName]).toEqual({})
  })

  it('should store a model with a definition', () => {
    const modelName = 'user'
    const model = { id: 1, firstName: () => 'John', lastName: () => 'Doe' }
    Fabricator(modelName, model)
    const modelNames = Object.keys(models)
    expect(modelNames).toContain(modelName)
    expect(models[modelName]).toEqual(model)
  })

  it('should throw an error when registering an existing model', () => {
    const modelName = 'user'
    Fabricator(modelName)
    expect(() => Fabricator(modelName)).toThrowError(
      `Model "${modelName}" has already been registered`
    )
  })

  describe('Fabricator.extend()', () => {
    it('should create an alias for a model', () => {
      const baseModelName = 'user'
      const baseModel = {
        id: 1,
        firstName: () => 'John',
        lastName: () => 'Doe',
      }
      Fabricator(baseModelName, baseModel)

      const modelName = 'admin'
      Fabricator.extend(baseModelName, modelName)

      const modelNames = Object.keys(models)
      expect(modelNames).toContain(baseModelName)
      expect(modelNames).toContain(modelName)
      expect(models[baseModelName]).toEqual(baseModel)
      expect(models[modelName]).toEqual(baseModel)
    })

    it('should create a model starting from an existing one', () => {
      const baseModelName = 'user'
      const baseModel = {
        id: 1,
        firstName: () => 'John',
        lastName: () => 'Doe',
        admin: false,
      }
      Fabricator(baseModelName, baseModel)

      const modelName = 'admin'
      const model = { admin: true }
      Fabricator.extend(baseModelName, modelName, model)

      const modelNames = Object.keys(models)
      expect(modelNames).toContain(baseModelName)
      expect(modelNames).toContain(modelName)
      expect(models[baseModelName]).toEqual(baseModel)
      expect(models[modelName]).toEqual({ ...baseModel, ...model })
    })

    it('should throw an error when registering an existing model', () => {
      const modelName = 'user'
      Fabricator(modelName)
      expect(() => Fabricator.extend(modelName, modelName)).toThrowError(
        `Model "${modelName}" has already been registered`
      )
    })

    it('should throw an error when the base model does not exist', () => {
      const baseModelName = 'user'
      const modelName = 'admin'
      expect(() => Fabricator.extend(baseModelName, modelName)).toThrowError(
        `Base model "${baseModelName}" has not been registered`
      )
    })
  })
})
