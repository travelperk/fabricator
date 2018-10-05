<div align="center">
<h1>Fabricator</h1>

<a href="https://www.emojione.com/emoji/1f527">
<img height="80" width="80" alt="wrench" src="https://raw.githubusercontent.com/travelperk/fabricator/master/other/wrench.png" />
</a>

<p>Fabricate objects for your tests</p>
</div>
<hr />

[![Build Status](https://travis-ci.org/travelperk/fabricator.svg?branch=master)](https://travis-ci.org/travelperk/fabricator)
[![Maintainability](https://api.codeclimate.com/v1/badges/3b4b6cb754d1b30ec6e7/maintainability)](https://codeclimate.com/github/travelperk/fabricator/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/3b4b6cb754d1b30ec6e7/test_coverage)](https://codeclimate.com/github/travelperk/fabricator/test_coverage)

## The Problem

Fabricator is based on the excellent
[Fabrication](https://www.fabricationgem.org/). Its purpose is to easily
generate objects in JavaScript. It is particularly useful for testing.

## Installation

`npm install --dev @travelperksl/fabricator`

## Defining Models

Models are defined with `Fabricator()` in this way:

```js
import { Fabricator, sequence } from '@travelperksl/fabricator'
import faker from 'faker'

const userFabricator = Fabricator({
  id: () => sequence('userId'),
  name: () => faker.name.firstName() + faker.name.lastName(),
  admin: false,
})
```

You simply pass a model definition. The definition is an object where each key
is a function. If you need dynamic data you can use `sequence()` or use a
library like [faker](https://www.npmjs.com/package/faker).

You can also extend existing models. For example:

```js
const adminFabricator = userFabricator.extend({ admin: true })
```

In this case, `adminFabricator` will inherit all the properties from
`userFabricator` but will overwrite the value for the `admin` property.

## Fabricating Objects

Once your model is defined you can create it by calling the returned function:

```js
const user = userFabricator()
// => { id: 1, name: 'John Doe', admin: false }
const admin = adminFabricator()
// => { id: 2, name: 'Susan Smith', admin: true }
```

You can overwrite some values by passing a model definition as parameter:

```js
const blockedUser = userFabricator({ isBlocked: true })
// => { id: 3, name: 'Donald Brown', admin: false, isBlocked: true }
```

Note that there's a difference between passing a function and a static value in
a fabricator definition. A function gets executed every time you create a new
object, a constant value is cached. Consider the following example:

```js
const withConstant = Fabricator({ foo: Math.random() })
withConstant() // => { foo: 0.11134742452557367 }
withConstant() // => { foo: 0.11134742452557367 }
withConstant() // => { foo: 0.11134742452557367 }

const withMethod = Fabricator({ foo: () => Math.random() })
withMethod('withMethod') // => { foo: 0.4426388385403983 }
withMethod('withMethod') // => { foo: 0.572825488636862 }
withMethod('withMethod') // => { foo: 0.4322506522885017 }
```

### Fabricator.times()

If you need to quickly generate more than one object you can use
`Fabricator.times()`:

```js
const people = userFabricator.times(2)
// => [{ id: 3, ... }, { id: 4, ... }]

const colleagues = userFabricator.times(2, { companyId: 5 })
// => [{ id: 5, companyId: 5 }, { id: 6, companyId: 6 }]
```

### sequence()

Sometimes it can be useful to have an increasing value for a field, for example
`id`. You can do this with `sequence()`

```js
sequence() // => 0
sequence() // => 1
sequence() // => 2
```

In some cases you might want to have different sequences, you can simply pass a
sequence name:

```js
sequence('user') // => 0
sequence('company') // => 0
sequence('user') // => 1
sequence('user') // => 2
sequence('company') // => 1
```

### sequence.reset()

If you are checking the sequence id, for example if you do
[snapshot testing](https://facebook.github.io/jest/docs/en/snapshot-testing.html)
you want your sequence numbers to be the same every time you execute your test.
In this case you can simply reset the sequence before running the test:

```js
sequence('user') // => 0
sequence('company') // => 0
sequence('user') // => 1
sequence('company') // => 1

sequence.reset()

sequence('user') // => 0
sequence('company') // => 0
sequence('user') // => 1
sequence('company') // => 1

sequence.reset('company')

sequence('user') // => 2
sequence('company') // => 0
sequence('user') // => 3
sequence('company') // => 1
```
