import requiredArgs from '../_lib/requiredArgs/index.js'
import toTemporalDate from '../_lib/toTemporalDate/index.js'

/**
 * @name isWeekend
 * @category Weekday Helpers
 * @summary Does the given date fall on a weekend?
 *
 * @description
 * Does the given date fall on a weekend?
 *
 * ### v2.0.0 breaking changes:
 *
 * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
 *
 * @param {Temporal.DateTime|Temporal.Date|Date|Number} date - the date to check
 * @returns {Boolean} the date falls on a weekend
 * @throws {TypeError} 1 argument required
 *
 * @example
 * // Does 5 October 2014 fall on a weekend?
 * var result = isWeekend(Temporal.Date.from('2014-10-05'))
 * //=> true
 */
export default function isWeekend(dirtyDate) {
  requiredArgs(1, arguments)

  let date
  try {
    date = toTemporalDate(dirtyDate)
  } catch (e) {
    if (e instanceof RangeError) return false
    throw e
  }
  const day = date.dayOfWeek
  return day === 6 || day === 7
}
