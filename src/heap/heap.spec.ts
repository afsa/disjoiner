import 'mocha';
import 'chai/register-should';
import { BinaryHeap } from './heap';

describe('BinaryHeap', () => {

  // Testset
  const items = [7, 1, 3, 5, 5, 9, 1, 2, 0, -10];

  it('has a size equal to the number of items', () => {
    const heap = new BinaryHeap<number>((a, b) => a < b ? -1 : 1);

    let i = 0;
    heap.size().should.equal(i);

    // Insert into heap
    for (const item of items) {
      heap.push(item);
      i++;

      heap.size().should.equal(i);
    }
  });

  it('places the smallest item on top', () => {
    const heap = new BinaryHeap<number>((a, b) => a < b ? -1 : 1);
    const sortedItems = items.sort().reverse();

    // Insert into heap
    for (const item of items) {
      heap.push(item);
    }

    // Check that the items are sorted
    while (!heap.isEmpty()) {
      const heapItem = heap.pop();
      const expectedItem = sortedItems.pop();

      if (heapItem === null) {
        throw new Error("heapItem is null.");
      }

      heapItem.should.equal(expectedItem);
    }
  });

  it('places the largest item on top', () => {
    const heap = new BinaryHeap<number>((a, b) => a < b ? 1 : -1);
    const sortedItems = items.sort();

    // Insert into heap
    for (const item of items) {
      heap.push(item);
    }

    // Check that the items are sorted
    while (!heap.isEmpty()) {
      const heapItem = heap.pop();
      const expectedItem = sortedItems.pop();

      if (heapItem === null) {
        throw new Error("heapItem is null.");
      }

      heapItem.should.equal(expectedItem);
    }
  });

  it('clears the heap when clear is called', () => {
    const heap = new BinaryHeap<number>((a, b) => a < b ? 1 : -1);

    // Insert into heap
    for (const item of items) {
      heap.push(item);
    }

    heap.clear().isEmpty().should.be.true;
  });

  it('shows the root item when peaking', () => {
    const heap = new BinaryHeap<number>((a, b) => a < b ? -1 : 1);

    // Insert into heap
    for (const item of items) {
      heap.push(item);
    }

    // Check that the items are sorted
    while (!heap.isEmpty()) {
      const heapPeak = heap.peak();
      const heapItem = heap.pop();

      if (heapItem === null) {
        throw new Error("heapItem is null.");
      }

      if (heapPeak === null) {
        throw new Error("heapPeak is null.");
      }

      heapItem.should.equal(heapPeak);
    }
  });
});
