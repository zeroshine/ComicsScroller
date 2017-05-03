import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
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

test('Loading snapshot', () => {
  const tree = renderer.create(
    <Loading />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
