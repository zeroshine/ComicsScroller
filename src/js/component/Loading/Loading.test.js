import React from 'react';
import { shallow } from 'enzyme';
import Loading from './';

test('Loading contains circle svg', () => {
  const LoadingCmp = shallow(<Loading />);
  expect(
    LoadingCmp.contains(
      <svg>
        <circle cx="30" cy="30" r="25" />
      </svg>,
    ),
  ).toBe(true);
});
