import 'mocha';
import 'chai/register-should';
import { Disjoiner } from './disjoiner';

describe('Disjoiner', () => {

  it('returns an array of disjoint intervals when input ends on the same date', () => {
    const intervals = [{
      start: 0,
      end: 10,
      value: 1
    }, {
      start: 3,
      end: 10,
      value: 2
    }, {
      start: 6,
      end: 10,
      value: 3
    }];

    const expected = [{
      start: 0,
      end: 3,
      value: 1
    }, {
      start: 3,
      end: 6,
      value: 3
    }, {
      start: 6,
      end: 10,
      value: 6
    }];

    new Disjoiner<number, number>({
      compare: (a, b) => a - b,
      mergeValues: (a, b) => a + b,
      equals: (a, b) => a === b
    }).disjoin(intervals).should.deep.equal(expected);
  });

  it('returns an array of disjoint interval when input does not end on the same date', () => {
    const intervals = [{
      start: 0,
      end: 100,
      value: 1
    }, {
      start: 3,
      end: 6,
      value: 2
    }, {
      start: 6,
      end: 50,
      value: 3
    }, {
      start: 6,
      end: 50,
      value: 3
    }];

    const expected = [{
      start: 0,
      end: 3,
      value: 1
    }, {
      start: 3,
      end: 6,
      value: 3
    }, {
      start: 6,
      end: 50,
      value: 7
    }, {
      start: 50,
      end: 100,
      value: 1
    }];

    new Disjoiner<number, number>({
      compare: (a, b) => a - b,
      mergeValues: (a, b) => a + b,
      equals: (a, b) => a === b
    }).disjoin(intervals).should.deep.equal(expected);

  });

  it('returns an array of disjoint interval with complex overlap', () => {
    const intervals = [{
      start: 0,
      end: 100,
      value: 1
    }, {
      start: 3,
      end: 10,
      value: 2
    }, {
      start: 6,
      end: 50,
      value: 3
    }, {
      start: 6,
      end: 50,
      value: 3
    }];

    const expected = [{
      start: 0,
      end: 3,
      value: 1
    }, {
      start: 3,
      end: 6,
      value: 3
    }, {
      start: 6,
      end: 10,
      value: 9
    }, {
      start: 10,
      end: 50,
      value: 7
    }, {
      start: 50,
      end: 100,
      value: 1
    }];

    new Disjoiner<number, number>({
      compare: (a, b) => a - b,
      mergeValues: (a, b) => a + b,
      equals: (a, b) => a === b
    }).disjoin(intervals).should.deep.equal(expected);
  });

  it('does not exceed 1', () => {
    const intervals = [{
      start: 0,
      end: 10,
      value: 0.4
    }, {
      start: 0,
      end: 5,
      value: 0.7
    }, {
      start: 3,
      end: 7,
      value: 0.5
    }];

    const expected = [{
      start: 0,
      end: 5,
      value: 1
    }, {
      start: 5,
      end: 7,
      value: 0.9
    }, {
      start: 7,
      end: 10,
      value: 0.4
    }];

    new Disjoiner<number, number>({
      compare: (a, b) => a - b,
      mergeValues: (a, b) => Math.min(a + b, 1),
      equals: (a, b) => a === b
    }).disjoin(intervals).should.deep.equal(expected);

  });

  it('splices intervals', () => {
    const intervals = [{
      start: 0,
      end: 5,
      value: 1
    }, {
      start: 5,
      end: 10,
      value: 1
    }, {
      start: 10,
      end: 15,
      value: 0.5
    }];

    const expected = [{
      start: 0,
      end: 10,
      value: 1
    }, {
      start: 10,
      end: 15,
      value: 0.5
    }];

    new Disjoiner<number, number>({
      compare: (a, b) => a - b,
      mergeValues: (a, b) => a + b,
      equals: (a, b) => a === b
    }).disjoin(intervals).should.deep.equal(expected);
  });

  it('does not splice intervals', () => {
    const intervals = [{
      start: 0,
      end: 5,
      value: 1
    }, {
      start: 5,
      end: 10,
      value: 1
    }, {
      start: 10,
      end: 15,
      value: 0.5
    }];

    const expected = [{
      start: 0,
      end: 5,
      value: 1
    }, {
      start: 5,
      end: 10,
      value: 1
    }, {
      start: 10,
      end: 15,
      value: 0.5
    }];

    new Disjoiner<number, number>({
      compare: (a, b) => a - b,
      mergeValues: (a, b) => a + b,
      equals: () => false
    }).disjoin(intervals).should.deep.equal(expected);
  });
});
