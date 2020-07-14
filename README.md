# disjoiner

Split a set of valued intervals into disjoint intervals. Useful for computing occupancy in overlapping schedules.

## Installing

Using npm

```shell script
npm install disjoiner
```

Using yarn

```shell script
yarn add disjoiner
```

## Example

```typescript
import { Disjoiner } from 'disjoiner';

// Specify how to disjoin the intervals
const disjoiner = new Disjoiner<Date, number>({

  // Specify how to compare two dates
  // Same type of compare function that is used in Array.sort
  // (see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
  compare: (obj1, obj2) => obj1.getTime() - obj2.getTime(),

  // Set how to merge two values of overlapping intervals
  // For example add the values
  mergeValues: (val1, val2) => val1 + val2,

  // Check if two values are equal
  // Used to merge intervals
  equals: (val1, val2) => val1 === val2
});

// Some example intervals
const intervals = [{
  start: new Date('2020-01-01'),
  end: new Date('2020-06-01'),
  value: 10
}, {
  start: new Date('2020-03-01'),
  end: new Date('2020-04-05'),
  value: 20
}, {
  start: new Date('2020-01-01'),
  end: new Date('2020-07-01'),
  value: 10
}];

// Run disjoiner
const disjointIntervals = disjoiner.disjoin(intervals);

// Outputs:
// [{
//   start: new Date('2020-01-01'),
//   end: new Date('2020-03-01'),
//   value: 20
// }, {
//   start: new Date('2020-03-01'),
//   end: new Date('2020-04-05'),
//   value: 40
// }, {
//   start: new Date('2020-04-05'),
//   end: new Date('2020-06-01'),
//   value: 20
// }, {
//   start: new Date('2020-06-01'),
//   end: new Date('2020-07-01'),
//   value: 10
// }]
```

## Documentation

### Disjoiner<K, V>

Class that converts an array of valued intervals to an array of disjoint intervals. The generic type `K` specifies the type of the interval start and end, while the generic type `V` specifies the type of the value.

- `new Disjoiner<K, V>(config: DisjoinerConfig<K, V>)` Constructs a disjoiner.
- `disjoin(items: ValuedIntervals<K, V>[]): ValuedInterval<K, V>[]` Takes an array of valued intervals and converts it to an array of disjoint intervals.

### DisjoinerConfig<K, V>

Config for the disjoiner constructor.

- `compare(obj1: K, obj2: K): number` A compareator functions for the interval range limits `obj1` and `obj2`. The result should be negative if `obj1 < obj2`, zero if `obj1 === obj2`, and positive if `obj1 > obj2`. This function works the same was as the compare function in `Array.sort` (see [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)).
- `mergeValues(val1: V, val2: V): V` Specify how values should be merged when two intervals overlap. The simplest function is to add the values. Note that this function should be associative and commutative to give a well defined output.
- `equals(val1: V, val2: V): boolean` Checks if two values are equal. This function is used to merge intervals next to each other where the values are the same. To turn off this functionality always return `false`.

### ValiedInterval<K, V>

An interval with a value.

- `start: K` The start of the interval (e.g. a date specifying the start of an event).
- `end: K` The end of the interval (e.g. a date specifying the end of an event).
- `value: V` The value of the interval (e.g. salary per hour during this interval).

## License

[MIT](LICENSE)
