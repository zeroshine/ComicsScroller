import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import { ComicImage } from './';

describe('ComicImage type className check', () => {
  it('ComicImage type = undefined => className = ComicImageInit', () => {
    const Cmp = shallow(<ComicImage />);
    expect(Cmp.find('.ComicImageInit').length).toBe(1);
  });

  it('ComicImage type = normal => className = ComicImage', () => {
    const Cmp = shallow(<ComicImage type={'normal'} />);
    expect(Cmp.find('.ComicImage').length).toBe(1);
  });

  it('ComicImage type = wide => className = ComicImageWide', () => {
    const Cmp = shallow(<ComicImage type={'wide'} />);
    expect(Cmp.find('.ComicImageWide').length).toBe(1);
  });

  it('ComicImage type = natural => className = ComicImageNatural', () => {
    const Cmp = shallow(<ComicImage type={'natural'} />);
    expect(Cmp.find('.ComicImageNatural').length).toBe(1);
  });

});

describe('ComicImage Loading controls', () => {
  it('contain Loading when init', () => {
    const Cmp = shallow(<ComicImage />);
    expect(Cmp.contains(<div>Loading...</div>)).toBe(true);
  });

  it('state { showImage: true } hidding Loading', ()=> {
    const Cmp = shallow(<ComicImage />);
    Cmp.setState({ showImage: true });
    expect(Cmp.contains(<div>Loading...</div>)).toBe(false);
  });

})

describe('ComicImage shows End', () => {
   it('ComicImage type = end => className = ComicImageEnd', () => {
    const Cmp = shallow(<ComicImage type={'end'} />);
    expect(Cmp.find('.ComicImageEnd').length).toBe(1);
  });

  it('show End when props { type = end }', () => {
    const Cmp = shallow(<ComicImage type={'end'} />)
    expect(Cmp.text()).toBe('本 章 結 束');
  });

  it('show End when props { type = end } state { showImage = true }', () => {
    const Cmp = shallow(<ComicImage type={'end'} />)
    Cmp.setState({ showImage: true });
    expect(Cmp.contains(<div>Loading...</div>)).toBe(false);
    expect(Cmp.find('img').length).toBe(0);
    expect(Cmp.text()).toBe('本 章 結 束');
  });

  it('show End when props { type = end, loading = true }', () => {
    const Cmp = shallow(<ComicImage type={'end'} loading={true} />)
    expect(Cmp.contains(<div>Loading...</div>)).toBe(false);
    expect(Cmp.find('img').length).toBe(0);
    expect(Cmp.text()).toBe('本 章 結 束');
  });
});

describe('ComicImage shows Image', ()=> {
  it('contains image when props { loading = true }', () => {
    const Cmp = shallow(<ComicImage loading={true} />);
    expect(Cmp.find('img').length).toBe(1);
  });   
});
