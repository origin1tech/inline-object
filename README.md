# Inline Object

Formats an object into an inline string using dot notation to indicate level and position in array.

#### Converts this:

```ts
  name: 'Milton Waddams',
  quotes: [
    'I believe you have my stapler'
  ]
```

#### To this:

```sh
name='Milton Waddams' quote[0]='I believe you have my stapler'
```

## Install

```sh
npm install inline-object
```

## Usage

Using ES6

```ts
import { InlineObject } from 'inline-object';
const inlineObj = new InlineObject();

const formatted = inlineObj.format({
  name: 'Milton Waddams',
  movie: 'Office Space',
  year: 1999
});
```

Using ES5

```ts
var InlineObject = require('inline-object').InlineObject;
var inlineObj = new InlineObject();

var formatted = inlineObj.format({
  name: 'Milton Waddams',
  movie: 'Office Space',
  year: 1999
});
```

The Result

```sh
name='Milton Waddams' movie='Office Space' year=1999
```

## Options

Options can be set in the constructor or through the instantiated instance.

### depth

The max depth to parse when converting an object to inline string. When null allows any depth with 0 being the top level.

<table>
  <tr><td>Type</td><td>Number</td></tr>
  <tr><td>Default</td><td>null</td></tr>
</table>

### colorize

When true Node's util.inspect is used to colorize by type.

<table>
  <tr><td>Type</td><td>Boolean</td></tr>
  <tr><td>Default</td><td>false</td></tr>
</table>

### castTypes

When true and reverting an inline string, values are cast back to their original type if possible. (not full proof).

<table>
  <tr><td>Type</td><td>Boolean</td></tr>
  <tr><td>Default</td><td>true</td></tr>
</table>

### transform

<table>
  <tr><td>Type</td><td>Number</td></tr>
  <tr><td>Arguments</td><td>(key: string, value: any)</td><td>must return a value.</td></tr>
  <tr><td>Default</td><td>noop</td></tr>
</table>

## API

Inline object api methods. If you are familiar with Typescript the below annotations will look familiar. For those who are not you can ignore said annotaitons. They merely indicate the "types" for method arguments and return values. If you are NOT using Typescript you can completely ignore them. The module will work as expected without using typings.

For example the revert arguments indicate the following:

```ts
// indicates expects a string.
str: string

// Indicates the method expects a key which is a string,
// a value of any type and it expects a returned value of
// any type. The "?" simply indicates that the argument is optional
transform?: (key: string, value: any) => any
```

### format

Formats an object resulting in an inline string.

<table>
  <tr><td>Arguments</td><td>(obj: object, depth?: number, colorize?: boolean)</td></tr>
  <tr><td>Returns</td><td>string</td></tr>
</table>

### revert

Rerverts a formatted inline string back to an object. Accepts additonal

<table>
  <tr><td>Arguments</td><td>(str: string, transform?: (key: string, value: any) => any)</td></tr>
  <tr><td>Returns</td><td>T</td></tr>
</table>


## Examples

Assumes using one of the above import methods of your choice (ES6, Typescript or ES5).

### Limiting Depth

```ts
const formatted = inlineObj.format({
  name: 'Milton Waddams',
  movie: 'Office Space',
  year: 1999,
  quotes: [
    // will NOT output
  ]
}, 0, true);
```

### Using Transform with Revert

```ts
const str = "name='Milton Waddams' movie='Office Space' year=1999";
const reverted = inlineObj.revert(str, function (k, v) {
  const float = parseFloat(v); // parse out float/numbers
  if (isNaN(float)) // if not a number return orig. string.
    return v;
  return float; // otherwise return the parsed float/number.
});
```

### Nested Output

The output follows the same naming convention as lodash's get/set methods. If you are familiar with those this will make sense.

```ts
const formatted = inlineObj.format({
  name: 'Milton Waddams',
  movie: 'Office Space',
  year: 1999,
  quotes: [
    'I believe you have my stapler'
  ]
});
```

Results in

```sh
name='Milton Waddams' movie='Office Space' year=1999 quote[0]='I believe you have my stapler'
```

## Test

```sh
npm test
```

## Change

See [CHANGE.md](CHANGE.md)

## License

See [LICENSE.md](LICENSE.md)



