import requiredArgs from '../_lib/requiredArgs/index.js'
import {Temporal} from 'proposal-temporal/lib/index.mjs'

/**
 * @name toDate
 * @category Common Helpers
 * @summary Convert the given argument to an instance of Date.
 *
 * @description
 * Convert the given argument to an instance of Date.
 *
 * If the argument is an instance of Date, the function returns its clone.
 *
 * If the argument is a number or an instance of Temporal.Absolute, it is treated as a timestamp.
 *
 * If the argument is an instance of Temporal.DateTime, it is treated as if it were in the local
 * time zone. This matches the behaviour of `new Date(y, m, d, ...)`.
 *
 * If the argument is none of the above, the function returns Invalid Date.
 *
 * **Note**: *all* Date arguments returned from any *date-fns* function are processed by `toDate`.
 *
 * @param {Temporal.Absolute|Temporal.DateTime|Date|Number} argument - the value to convert
 * @returns {Date} the converted date
 * @throws {TypeError} 1 argument required
 *
 * @example
 * // Clone the date:
 * const result = toDate(new Date(2014, 1, 11, 11, 30, 30))
 * //=> Tue Feb 11 2014 11:30:30
 *
 * @example
 * // Convert the timestamp to date:
 * const result = toDate(1392098430000)
 * //=> Tue Feb 11 2014 11:30:30
 */
export default function toDate(argument) {
  requiredArgs(1, arguments)

  const argStr = Object.prototype.toString.call(argument)

  // Clone the date
  if (
    argument instanceof Date ||
    (typeof argument === 'object' && argStr === '[object Date]')
  ) {
    // Prevent the date to lose the milliseconds when passed to new Date() in IE10
    return new Date(argument.getTime())
  } else if (argument instanceof Temporal.Absolute) {
    return new Date(argument.getEpochMilliseconds())
  } else if (argument instanceof Temporal.DateTime) {
    return new Date(argument.toAbsolute(Temporal.now.timeZone()).getEpochMilliseconds())
  } else if (typeof argument === 'number' || argStr === '[object Number]') {
    return new Date(argument)
  } else {
    if (
      (typeof argument === 'string' || argStr === '[object String]') &&
      typeof console !== 'undefined'
    ) {
      // eslint-disable-next-line no-console
      console.warn(
        "Starting with v2.0.0-beta.1 date-fns doesn't accept strings as arguments. Please use `parseISO` to parse strings. See: https://git.io/fjule"
      )
      // eslint-disable-next-line no-console
      console.warn(new Error().stack)
    }
    return new Date(NaN)
  }
}
