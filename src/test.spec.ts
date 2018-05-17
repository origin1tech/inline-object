import * as chai from 'chai';
import * as mocha from 'mocha';
import * as hasAnsi from 'has-ansi';
import * as strip from 'strip-ansi';
import { InlineObject } from './';

const expect = chai.expect;
const should = chai.should;
const assert = chai.assert;

const inlineObj = new InlineObject();

const obj = {
  name: 'Office Space',
  year: 1999,
  characters: [
    'Milton Waddams',
    'Peter Gibbons',
    'Bill Lumbergh'
  ],
  rating: 9.2
};

const obj2 = {
  name: 'Office Space',
  year: 1999,
  rating: 9.2
};

const converted = "name='Office Space' year=1999 characters[0]='Milton Waddams' characters[1]='Peter Gibbons' characters[2]='Bill Lumbergh' rating=9.2";

const converted2 = "name='Office Space' year=1999 rating=9.2";

describe('inline-object', () => {

  before((done) => {
    done();
  });

  it('should convert an object to inline string.', () => {
    assert.equal(inlineObj.format(obj), converted);
  });

  it('should revert an inline-object string to an object.', () => {
    assert.deepEqual(inlineObj.revert(converted), obj);
  });

  it('should convert to inline string restricted to first level.', () => {
    assert.equal(inlineObj.format(obj2, 0), converted2);
  });

  it('should revert an inline-object string transforming values.', () => {
    inlineObj.options.castTypes = false;
    inlineObj.options.transform = (k, v) => {
      const float = parseFloat(v); // parse out float/numbers
      if (isNaN(float)) // if not a number return orig. string.
        return v;
      return float; // otherwise return the parsed float/number.
    };
    assert.deepEqual(inlineObj.revert(converted2), obj2);
  });

  it('should colorize inline-object string using util.format.', () => {
    const colorized = inlineObj.format(obj2, 0, true);
    let isColorized = hasAnsi(colorized);
    assert.isTrue(isColorized);
  });


});