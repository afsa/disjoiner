import { ValuedInterval } from './valued-interval';
import { BinaryHeap } from './heap/heap';

export interface DisjoinerConfig<K, V> {
  compare: (obj1: K, obj2: K) => number;
  mergeValues: (val1: V, val2: V) => V;
  equals: (val1: V, val2: V) => boolean;
}

export class Disjoiner<K, V> {

  /**
   * Create a new disjoiner. The behavior on how to compare interval keys, how to merge values and check if values are
   * equal are needed.
   *
   * The compare function takes two interval keys and specifies the order. For compare(a, b) the value -1 is expected
   * if a is before b, 0 is expected if a and b are equal, and 1 is expected if a is after b (see the compare function
   * for Array.sort https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort). If
   * the input is numeric it is recommended to use (a, b) => a - b.
   *
   * The mergeValue function takes two values and merges them when intervals overlap. For numeric values the easiest
   * example is (a, b) => a + b, but for percentages it can be beneficial to use (a, b) => Math.min(a + b, 1). Other
   * behavior can easily be implemented, for example, only use the largest value (a, b) => Math.max(a, b). Note that the
   *  mergeValue function needs to be associative and commutative to give well defined results.
   *
   * The equals function checks if two values are equal and is used to splice intervals with the same value. If no
   * splicing is wanted always return false.
   *
   * @param config The config containing the compare and mergeValue functions.
   */
  constructor(
    private config: DisjoinerConfig<K, V>
  ) {}

  /**
   * Merge a set of valued intervals into a set of disjoint intervals.
   * @param items The set of intervals to be merged into disjoint intervals.
   * @returns An array of disjoint valued intervals.
   */
  public disjoin(items: ValuedInterval<K, V>[]): ValuedInterval<K, V>[] {

    // Return an empty list if the input is empty
    if (items.length === 0) {
      return [];
    }

    // Generate heap from the array of items
    const heap = new BinaryHeap<ValuedInterval<K, V>>((a, b) => this.config.compare(a.start, b.start), items);

    // Create an array to store the output
    const disjointIntervals: ValuedInterval<K, V>[] = [];

    // The current active item
    let active = heap.pop() as ValuedInterval<K, V>;

    while (!heap.isEmpty()) {

      // Merge the active item and the next
      const mergedItems = this.merge(active, heap.pop() as ValuedInterval<K, V>).reverse();

      // Check if the item can be added to the output
      while (mergedItems.length > 1) {

        const mergedItem = mergedItems.pop() as ValuedInterval<K, V>;

        if (heap.isEmpty()
          || this.config.compare(mergedItem.end, (heap.peak() as ValuedInterval<K, V>).start as K) <= 0) {
            disjointIntervals.push(mergedItem);
        } else {
          mergedItems.push(mergedItem);
          break;
        }
      }

      active = mergedItems.pop() as ValuedInterval<K, V>;

      // Push extra items to the heap
      while (mergedItems.length > 0) {
        heap.push(mergedItems.pop() as ValuedInterval<K, V>);
      }
    }

    // Add the active element to the output
    disjointIntervals.push(active);

    // Merge intervals that can be joint
    const output: ValuedInterval<K, V>[] = [];
    let currentInterval = disjointIntervals[0];

    for (let i = 1; i < disjointIntervals.length; ++i) {

      if (this.isSplicable(currentInterval, disjointIntervals[i])) {
        currentInterval = this.splice(currentInterval, disjointIntervals[i]);
      } else {
        output.push(currentInterval);
        currentInterval = disjointIntervals[i];
      }

    }

    output.push(currentInterval);

    return output;
  }

  protected merge(first: ValuedInterval<K, V>, last: ValuedInterval<K, V>): ValuedInterval<K, V>[] {
    const output: ValuedInterval<K, V>[] = [];

        // Check if the intervals are disjoint
        if (this.config.compare(first.end, last.start as K) <= 0) {
          return [first, last];
        }

        // Add the first interval to the output
        output.push({
          start: first.start,
          end: last.start,
          value: first.value
        });

        // Check if last is contained in first
        if (first.end >= last.end) {
          output.push({
            start: last.start,
            end: last.end,
            value: this.config.mergeValues(first.value, last.value)
          });

          output.push({
            start: last.end,
            end: first.end,
            value: first.value
          });
        } else {
          output.push({
            start: last.start,
            end: first.end,
            value: this.config.mergeValues(first.value, last.value)
          });

          output.push({
            start: first.end,
            end: last.end,
            value: last.value
          });
        }

        // Remove items where start is equal to end
        const result = output.filter(item => this.config.compare(item.start, item.end as K) < 0);

        return result;
  }

  protected isSplicable(first: ValuedInterval<K, V>, last: ValuedInterval<K, V>): boolean {
    return this.config.compare(first.end, last.start) === 0 && this.config.equals(first.value, last.value);
  }

  protected splice(first: ValuedInterval<K, V>, last: ValuedInterval<K, V>): ValuedInterval<K, V> {
    return {
      start: first.start,
      end: last.end,
      value: first.value
    };
  }
}
