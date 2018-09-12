const models = {}

function Fabricator(name, model = {}) {
  if (models[name]) {
    throw new Error(`Model "${name}" has already been registered`)
  }
  Object.keys(model).forEach(key => {
    if (typeof model[key] !== 'function') {
      console.warn(
        `Defining a fabricator using a constant is going to be deprecated in the next version. Please use a function instead. Check ${name}.${key}.`
      )
    }
  })

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

Fabricate.times = (count, name, defaults) =>
  Array(count)
    .fill(0)
    .map(() => Fabricate(name, defaults))

let sequences = {}

Fabricate.sequence = (
  name = '__VOID_SEQUENCE_NAME_DO_NOT_USE_OR_YOU_WILL_BE_FIRED'
) => {
  if (sequences[name] == null) {
    sequences[name] = -1
  }
  return ++sequences[name]
}

Fabricate.sequence.reset = name => {
  if (name) {
    if (sequences[name] != null) {
      delete sequences[name]
    } else {
      throw new Error(`Sequece "${name}" does not exist`)
    }
  } else {
    sequences = {}
  }
}

export {
  Fabricator,
  Fabricate,
  models as __MODELS_OBJET_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
}
