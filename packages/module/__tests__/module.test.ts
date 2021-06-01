'use strict';

import getSomethings from '../src';

describe('module', () => {
  test('getSomethings has options', () => {
    expect(getSomethings({ test: true })).toBe(undefined);
  });
});
