function Fabricator(model = {}) {
  const fabricate = opts => Fabricate(model, opts)

  fabricate.extend = (opts = {}) => Fabricator({ ...model, ...opts })

  fabricate.times = (count, opts) => {
    let size
    switch (typeof count) {
      case 'number':
        size = count
        break
      case 'object':
        const { min = 1, max = 10 } = count
        size = Math.floor(Math.random() * (max - min + 1) + min)
        break
      default:
        throw new Error(
          `times expects a number or an object you passed ${typeof count}`
        )
    }

    return Array(size)
      .fill(0)
      .map(() => fabricate(opts))
  }

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
    sequences[name] = 0
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
