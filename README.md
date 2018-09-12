# Fabricator

Fabricate objects for your tests

Fabricator is based on the excellent
[Fabrication](https://www.fabricationgem.org/). Its purpose is to easily
generate objects in JavaScript. It is particularly useful for testing.

## Installation

`npm install --dev @travelperksl/fabricator`

## Defining Models

Models are defined with `Fabricator()` in this way:

```js
import { Fabricator, Fabricate } from '@travelperksl/fabricator'

Fabricator('user', {
  id: () => Fabricate.sequence('userId'),
  name: () => faker.name.firstName() + faker.name.lastName(),
  admin: () => false,
})
```

You simply pass a name for the model and its definition. The definition is an
object where each key is a function. If you need dynamic data you can use
`Fabricate.sequence()` or use a library like
[faker](https://www.npmjs.com/package/faker).

You can also extend existing models. For example:

```js
Fabricator.extend('user', 'admin', { admin: () => true })
```

In this case, `admin` will inherit all the properties from `user` but will
overwrite the value for `admin`.

## Fabricating Objects

Once your model is defined you can create it with `Fabricate()`:

```js
const user = Fabricate('user')
// => { id: 1, name: 'John Doe', admin: false }
const admin = Fabricate('admin')
// => { id: 2, name: 'Susan Smith', admin: true }
```

You can overwrite some values by passing a model definition as second parameter:

```js
const blockedUser = Fabricate('user', { isBlocked: () => true })
// => { id: 3, name: 'Donald Brown', admin: false, isBlocked: true }
```

### Fabricate.times()

If you need to quickly generate more than one object you can use
`Fabricate.times()`:

```js
const people = Fabricate.times(2, 'user')
// => [{ id: 3, ... }, { id: 4, ... }]

const colleagues = Fabricate.times(2, 'user', { companyId: () => 5 })
// => [{ id: 5, companyId: 5 }, { id: 6, companyId: 6 }]
```

### Fabricate.sequence()

Sometimes it can be useful to have an increasing value for a field, for example
`id`. You can do this with `Fabricate.sequence()`

```js
Fabricate.sequence() // => 0
Fabricate.sequence() // => 1
Fabricate.sequence() // => 2
```

In some cases you might want to have different sequences, you can simply pass a
sequence name:

```js
Fabricate.sequence('user') // => 0
Fabricate.sequence('company') // => 0
Fabricate.sequence('user') // => 1
Fabricate.sequence('user') // => 2
Fabricate.sequence('company') // => 1
```

### Fabricate.sequence.reset()

If you are checking the sequence id, for example if you do
[snapshot testing](https://facebook.github.io/jest/docs/en/snapshot-testing.html)
you want your sequence numbers to be the same every time you execute your test.
In this case you can simply reset the sequence before running the test:

```js
Fabricate.sequence('user') // => 0
Fabricate.sequence('company') // => 0
Fabricate.sequence('user') // => 1
Fabricate.sequence('company') // => 1

Fabricate.sequence.reset()

Fabricate.sequence('user') // => 0
Fabricate.sequence('company') // => 0
Fabricate.sequence('user') // => 1
Fabricate.sequence('company') // => 1

Fabricate.sequence.reset('company')

Fabricate.sequence('user') // => 2
Fabricate.sequence('company') // => 0
Fabricate.sequence('user') // => 3
Fabricate.sequence('company') // => 1
```
