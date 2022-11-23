type SetDifference<A, B> = A extends B ? never : A

type SetComplement<A, A1 extends A> = SetDifference<A, A1>

type Subtract<T extends T1, T1 extends object> = Pick<
  T,
  SetComplement<keyof T, keyof T1>
>

type Intersection<T extends object, U extends object> = Pick<
  T,
  Extract<keyof T, keyof U> & Extract<keyof U, keyof T>
>

type FabricatorType<T, X extends T = T> = { [P in keyof T]?: () => X[P] }
type Modifier<T> = { [P in keyof T]?: T[P] }

interface FabricatedValue<T extends object> {
  (modifier?: Modifier<T>): T
  extend: <U extends T>(
    fabricator?: FabricatorType<Subtract<U, T>, U> &
      FabricatorType<Intersection<U, T>, U>
  ) => FabricatedValue<U>
  times: (
    count: number | { min?: number; max?: number },
    fabricator?: FabricatorType<T>
  ) => Array<T>
}

export function Fabricator<T extends object>(
  model: FabricatorType<T> = {}
): FabricatedValue<T> {
  const fabricate = (opts?: FabricatorType<T> | Modifier<T>) =>
    Fabricate(model, opts)

  fabricate.extend = <U extends T>(
    fabricator?: FabricatorType<Subtract<U, T>, U> &
      FabricatorType<Intersection<U, T>, U>
  ) => Fabricator({ ...model, ...fabricator }) as FabricatedValue<U>

  fabricate.times = (
    count: number | { min?: number; max?: number },
    mod?: FabricatorType<T>
  ): Array<T> => {
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
      .map(() => fabricate(mod))
  }

  return fabricate
}

function Fabricate<T>(
  model: FabricatorType<T>,
  modifier?: Modifier<T> | FabricatorType<T>
): T {
  if (typeof model === 'function') {
    return (model as any).apply()
  }

  const extendedModel = { ...model, ...modifier }
  const object = Object.keys(extendedModel).reduce((object, key) => {
    const value = extendedModel[key as keyof T]
    // @ts-expect-error
    object[key] = typeof value === 'function' ? value.apply() : value
    return object
  }, {}) as T

  return object
}

let sequences: { [key: string]: number } = {}

export function sequence(
  sequenceName = '__VOID_SEQUENCE_NAME_DO_NOT_USE_OR_YOU_WILL_BE_FIRED'
): number {
  if (sequences[sequenceName] == null) {
    sequences[sequenceName] = 0
  }
  return ++sequences[sequenceName]
}

sequence.reset = (sequenceName?: string) => {
  if (sequenceName) {
    if (sequences[sequenceName] != null) {
      delete sequences[sequenceName]
    } else {
      throw new Error(`Sequece "${sequenceName}" does not exist`)
    }
  } else {
    sequences = {}
  }
}

export {}
