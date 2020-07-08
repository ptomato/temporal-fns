// @flow
/* eslint-env mocha */

import assert from 'power-assert'
import sinon from 'sinon'
import toTemporalDateTime from '.'
import {Temporal} from 'proposal-temporal/lib/index.mjs'

describe('toTemporalDateTime', () => {
  describe('Temporal.DateTime argument', () => {
    it('returns a clone of the given Temporal.DateTime', () => {
      const dt = Temporal.DateTime.from('2016-01-01T23:30:45.123')
      const dtClone = toTemporalDateTime(dt)
      dtClone._prop = 'value'
      assert.deepEqual(dt._prop, undefined)
    })
  })

  describe('timestamp argument', () => {
    it('creates a Temporal.DateTime from the timestamp', () => {
      const timestamp = new Date(2016, 0, 1, 23, 30, 45, 123).getTime()
      const result = toTemporalDateTime(timestamp)
      assert(result.equals(Temporal.DateTime.from('2016-01-01T23:30:45.123')))
    })

    it('creates a Temporal.DateTime from the legacy Date', () => {
      const timestamp = new Date(2016, 0, 1, 23, 30, 45, 123)
      const result = toTemporalDateTime(timestamp)
      assert(result.equals(Temporal.DateTime.from('2016-01-01T23:30:45.123')))
    })
  })

  describe('invalid argument', () => {
    mockConsoleWarn()

    it('throws RangeError if argument is a string', () => {
      // $ExpectedMistake
      assert.throws(() => toTemporalDateTime('1987-02-11'), RangeError)
    })

    it('prints deprecation warning if the argument is a string', () => {
      // $ExpectedMistake
      console.warn = sinon.spy() // eslint-disable-line no-console
      // $ExpectedMistake
      try {
        toTemporalDateTime('1987-02-11')
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
      assert.throws(() => toTemporalDateTime(NaN))
    })

    it('throws RangeError if argument is Invalid Date', () => {
      assert.throws(() => toTemporalDateTime(new Date(NaN)))
    })

    it('throws RangeError if argument is null', () => {
      // $ExpectedMistake
      assert.throws(() => toTemporalDateTime(null))
    })

    it('throws RangeError if argument is undefined', () => {
      // $ExpectedMistake
      assert.throws(() => toTemporalDateTime(undefined))
    })

    it('throws RangeError if argument is false', () => {
      // $ExpectedMistake
      assert.throws(() => toTemporalDateTime(false))
    })

    it('throws RangeError if argument is true', () => {
      // $ExpectedMistake
      assert.throws(() => toTemporalDateTime(true))
    })
  })

  describe('argument conversion', () => {
    it('implicitly converts instance of Number into a number', () => {
      // eslint-disable-next-line no-new-wrappers
      const timestamp = new Number(
        new Date(2016, 0, 1, 23, 30, 45, 123).getTime()
      )
      // $ExpectedMistake
      const result = toTemporalDateTime(timestamp)
      assert(result.equals(Temporal.DateTime.from('2016-01-01T23:30:45.123')))
    })
  })

  it('throws TypeError exception if passed less than 1 argument', () => {
    assert.throws(toTemporalDateTime.bind(null), TypeError)
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
