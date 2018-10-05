function Fabricator(model = {}) {
  const fabricate = opts => Fabricate(model, opts)

  fabricate.extend = (opts = {}) => Fabricator({ ...model, ...opts })

  fabricate.times = (count, opts) =>
    Array(count)
      .fill(0)
      .map(() => fabricate(opts))

  return fabricate
}

function Fabricate(model, opts = {}) {
  if (typeof model === 'function') {
    return model.apply()
  }

  const extendedModel = { ...model, ...opts }
  const object = Object.keys(extendedModel).reduce((object, key) => {
    const value = extendedModel[key]
    object[key] = typeof value === 'function' ? value.apply() : value
    return object
  }, {})

  return object
}

let sequences = {}

const sequence = (
  name = '__VOID_SEQUENCE_NAME_DO_NOT_USE_OR_YOU_WILL_BE_FIRED'
) => {
  if (sequences[name] == null) {
    sequences[name] = -1
  }
  return ++sequences[name]
}

sequence.reset = name => {
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

export { Fabricator, sequence }
