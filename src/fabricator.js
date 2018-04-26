const models = {}

function Fabricator(name, model = {}) {
  if (models[name]) {
    throw new Error(`Model "${name}" has already been registered`)
  }
  models[name] = model
}

Fabricator.extend = (from, name, model = {}) => {
  if (!models[from]) {
    throw new Error(`Base model "${from}" has not been registered`)
  }
  Fabricator(name, { ...models[from], ...model })
}

function Fabricate(name, defaults = {}) {
  const model = models[name]

  if (!model) {
    throw new Error(`Model "${name}" has not been registered`)
  }

  if (typeof model === 'function') {
    return model.apply()
  }

  const extendedModel = { ...model, ...defaults }
  const object = Object.keys(extendedModel).reduce((object, key) => {
    const value = extendedModel[key]
    object[key] = typeof value === 'function' ? value.apply() : value
    return object
  }, {})

  return object
}

export {
  Fabricator,
  Fabricate,
  models as __MODELS_OBJET_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
}
