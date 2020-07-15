import toInteger from '../_lib/toInteger/index.js'
import toDate from '../toDate/index.js'
import requiredArgs from '../_lib/requiredArgs/index.js'
import toTemporalDateTime from '../_lib/toTemporalDateTime/index.js'

/**
 * @name addMonths
 * @category Month Helpers
 * @summary Add the specified number of months to the given date.
 *
 * @description
 * Add the specified number of months to the given date.
 *
 * ### v2.0.0 breaking changes:
 *
 * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
 *
 * @param {Temporal.DateTime|Date|Number} date - the date to be changed
 * @param {Number} amount - the amount of months to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
 * @returns {Date} the new date with the months added
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // Add 5 months to 1 September 2014:
 * var result = addMonths(Temporal.DateTime.from({ year: 2014, month: 9, day: 1 }), 5)
 * //=> Sun Feb 01 2015 00:00:00
 */
export default function addMonths(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments)

  let date
  try {
    date = toTemporalDateTime(dirtyDate)
  } catch (e) {
    if (e instanceof RangeError) {
      return new Date(NaN)
    }
    throw e
  }
  var amount = toInteger(dirtyAmount)
  if (isNaN(amount)) {
    return new Date(NaN)
  }
  if (!amount) {
    // If 0 months, no-op to avoid changing times in the hour before end of DST
    return toDate(dirtyDate)
  }
  if (amount < 0) {
    date = date.minus({ months: -amount })
  } else {
    date = date.plus({ months: amount })
  }
  return toDate(date)
}
