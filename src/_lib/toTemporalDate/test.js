// @flow
/* eslint-env mocha */

import assert from 'power-assert'
import sinon from 'sinon'
import toTemporalDate from '.'
import {Temporal} from 'proposal-temporal/lib/index.mjs'

describe('toTemporalDate', () => {
  describe('Temporal.Date argument', () => {
    it('returns a clone of the given Temporal.Date', () => {
      const date = Temporal.Date.from('2016-01-01')
      const dateClone = toTemporalDate(date)
      dateClone._prop = 'value'
      assert.deepEqual(date._prop, undefined)
    })
  })

  describe('Temporal.DateTime argument', () => {
    it('returns the date portion of the DateTime', () => {
      const dt = Temporal.DateTime.from('2016-01-01T23:30:45.123')
      const date = toTemporalDate(dt)
      assert(date.equals(Temporal.Date.from('2016-01-01')))
    })
  });

  describe('timestamp argument', () => {
    it('creates a Temporal.Date from the timestamp', () => {
      const timestamp = new Date(2016, 0, 1, 23, 30, 45, 123).getTime()
      const result = toTemporalDate(timestamp)
      assert(result.equals(Temporal.Date.from('2016-01-01')))
    })

    it('creates a Temporal.Date from the legacy Date', () => {
      const timestamp = new Date(2016, 0, 1, 23, 30, 45, 123)
      const result = toTemporalDate(timestamp)
      assert(result.equals(Temporal.Date.from('2016-01-01')))
    })
  })

  describe('invalid argument', () => {
    mockConsoleWarn()

    it('throws RangeError if argument is a string', () => {
      // $ExpectedMistake
      assert.throws(() => toTemporalDate('1987-02-11'), RangeError)
    })

    it('prints deprecation warning if the argument is a string', () => {
      // $ExpectedMistake
      console.warn = sinon.spy() // eslint-disable-line no-console
      // $ExpectedMistake
      try {
        toTemporalDate('1987-02-11')
      } catch {
        // pass
      }
      assert(
        // eslint-disable-next-line no-console
        console.warn.calledWith(
          "Starting with v2.0.0-beta.1 date-fns doesn't accept strings as arguments. Please use `parseISO` to parse strings. See: https://git.io/fjule"
        )
      )
    })

    it('throws RangeError if argument is NaN', () => {
      assert.throws(() => toTemporalDate(NaN))
    })

    it('throws RangeError if argument is Invalid Date', () => {
      assert.throws(() => toTemporalDate(new Date(NaN)))
    })

    it('throws RangeError if argument is null', () => {
      // $ExpectedMistake
      assert.throws(() => toTemporalDate(null))
    })

    it('throws RangeError if argument is undefined', () => {
      // $ExpectedMistake
      assert.throws(() => toTemporalDate(undefined))
    })

    it('throws RangeError if argument is false', () => {
      // $ExpectedMistake
      assert.throws(() => toTemporalDate(false))
    })

    it('throws RangeError if argument is true', () => {
      // $ExpectedMistake
      assert.throws(() => toTemporalDate(true))
    })
  })

  describe('argument conversion', () => {
    it('implicitly converts instance of Number into a number', () => {
      // eslint-disable-next-line no-new-wrappers
      const timestamp = new Number(
        new Date(2016, 0, 1, 23, 30, 45, 123).getTime()
      )
      // $ExpectedMistake
      const result = toTemporalDate(timestamp)
      assert(result.equals(Temporal.Date.from('2016-01-01')))
    })
  })

  it('throws TypeError exception if passed less than 1 argument', () => {
    assert.throws(toTemporalDate.bind(null), TypeError)
  })
})

function mockConsoleWarn() {
  let originalWarn

  beforeEach(() => {
    originalWarn = console.warn // eslint-disable-line no-console
    // $ExpectedMistake
    console.warn = () => {} // eslint-disable-line no-console
  })

  afterEach(() => {
    // $ExpectedMistake
    console.warn = originalWarn // eslint-disable-line no-console
  })
}
