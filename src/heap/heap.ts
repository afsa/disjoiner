
export class BinaryHeap<T> {

  private storage: T[] = [];

  /**
   * Create a new binary heap.
   * @param compare A function that compares two objects. The compare function should return 0 if a and b are equal, 1
   * if b < a (i.e. b should be higher up in the heap) and -1 if a < b (i.e. if a should be higher up in the heap).
   */
  constructor(
    private compare: (a: T, b: T) => number,
    initialValues: T[] = []
  ) {
    for (const item of initialValues) {
      this.push(item);
    }
  }

  /**
   * Add a new item to the heap. Once inserted it is moved to the correct position.
   * @param item The item to be added to the heap.
   * @returns A reference to this for chaining.
   */
  public push(item: T): BinaryHeap<T> {

    // Current and parent position
    let currentIndex = this.storage.length;
    let parentIndex = this.getParentIndex(currentIndex);

    // Move the item upwards so it is in the right place
    while (parentIndex !== null && this.compare(item, this.storage[parentIndex]) < 0) {

      // Swap positions between
      this.storage[currentIndex] = this.storage[parentIndex]

      currentIndex = parentIndex;
      parentIndex = this.getParentIndex(currentIndex);
    }

    // Insert the item into the correct position
    this.storage[currentIndex] = item;

    return this;
  }

  /**
   * Get the parent index for a given a current index
   * @param currentIndex The current index
   * @returns The parent index if the current index is larger than zero, otherwise null.
   */
  private getParentIndex(currentIndex: number): number | null {

    if (currentIndex == 0) {
      return null;
    }

    return Math.floor((currentIndex + 1) / 2) - 1;
  }

  /**
   * Removes the root item from the heap and returns it.
   * @returns The root item in the heap if it is not empty, otherwise null.
   */
  public pop(): T | null {

    // Return null if the heap is empty
    if (this.isEmpty()) {
      return null;
    }

    // Get the root
    const root = this.storage[0];

    // Get the last item and insert it into the root
    const item = this.storage.pop() as T;

    // If the heap only contained a single element then return it
    if (this.isEmpty()) {
      return root;
    }

    // Get the smallest child index
    let currentIndex: number | null = 0;
    let childIndex = this.getSmallestChildIndex(currentIndex);

    while (childIndex !== null && this.compare(item, this.storage[childIndex]) > 0) {

      // Swap positions
      this.storage[currentIndex] = this.storage[childIndex];

      currentIndex = childIndex;
      childIndex = this.getSmallestChildIndex(currentIndex);
    }

    this.storage[currentIndex] = item;

    return root;
  }

  /**
   * Get the index corresponding to the smallest child
   * @param currentIndex The index corresponding to the parent for the children
   * @returns The index for the smallest child if the current index is not a leaf, otherwise null
   */
  private getSmallestChildIndex(currentIndex: number): number | null {
    const leftChild = 2 * currentIndex + 1;
    const rightChild = 2 * currentIndex + 2;

    // The item is already a leaf
    if (leftChild >= this.size()) {
      return null;
    }

    // Only the left child exists
    if (rightChild >= this.size()) {
      return leftChild;
    }

    // Both children exists, take the smallest one
    return this.compare(this.storage[leftChild], this.storage[rightChild]) < 0 ? leftChild : rightChild;
  }

  /**
   * Peak on the root item in the heap without removing it.
   * @returns The root item if the heap is not empty, otherwise null.
   */
  public peak(): T | null {

    // Return null if the heap is empty
    if (this.isEmpty()) {
      return null;
    }

    // Otherwise return the first item
    return this.storage[0]
  }

  /**
   * Remove all items from the heap.
   * @returns A reference to this for chaining.
   */
  public clear(): BinaryHeap<T> {
    this.storage.splice(0, this.storage.length);
    return this;
  }

  /**
   * Get the size of the heap.
   * @returns The number of items in the heap.
   */
  public size(): number {
    return this.storage.length;
  }

  /**
   * Check if the heap is empty.
   * @returns Returns true if the heap has zero items, otherwise false.
   */
  public isEmpty(): boolean {
    return this.size() === 0;
  }
}
