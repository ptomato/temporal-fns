import toInteger from '../_lib/toInteger/index.js'
import toDate from '../toDate/index.js'
import requiredArgs from '../_lib/requiredArgs/index.js'
import toTemporalDateTime from '../_lib/toTemporalDateTime/index.js'

/**
 * @name addDays
 * @category Day Helpers
 * @summary Add the specified number of days to the given date.
 *
 * @description
 * Add the specified number of days to the given date.
 *
 * ### v2.0.0 breaking changes:
 *
 * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
 *
 * @param {Date|Temporal.DateTime|Number} date - the date to be changed
 * @param {Number} amount - the amount of days to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
 * @returns {Date} the new date with the days added
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // Add 10 days to 1 September 2014:
 * var result = addDays(new Date(2014, 8, 1), 10)
 * //=> Thu Sep 11 2014 00:00:00
 */
export default function addDays(dirtyDate, dirtyAmount) {
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
    // If 0 days, no-op to avoid changing times in the hour before end of DST
    // (this could be removed if fully using Temporal, but is still required
    // because we return a legacy Date)
    return toDate(dirtyDate)
  }
  if (amount < 0) {
    date = date.minus({ days: -amount })
  } else {
    date = date.plus({ days: amount })
  }
  return toDate(date)
}
