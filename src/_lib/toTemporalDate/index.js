import requiredArgs from '../requiredArgs/index.js'
import {Temporal} from 'proposal-temporal/lib/index.mjs'

/**
 * @name toTemporalDate
 * @category Common Helpers
 * @summary Convert the given argument to an instance of Temporal.Date.
 *
 * @description
 * Convert the given argument to an instance of Temporal.Date.
 *
 * If the argument is an instance of Temporal.Date, the function returns its clone.
 *
 * If the argument is a number or an instance of Date, it is treated as a timestamp in the current local time zone.
 *
 * If the argument is none of the above, the function throws a RangeError.
 *
 * **Note**: *all* Temporal.Date arguments passed to any *date-fns* function are processed by `toTemporalDateTime`.
 *
 * @param {Temporal.Date|Temporal.DateTime|Date|Number} argument - the value to convert
 * @returns {Temporal.DateTime} the converted date
 * @throws {TypeError} 1 argument required
 * @throws {RangeError} invalid date
 *
 * @example
 * // Clone the object:
 * const result = toTemporalDateTime(Temporal.DateTime.from('2014-02-11T11:30:30'))
 * //=> Temporal.DateTime <2014-02-11T11:30:30>
 *
 * @example
 * // Convert the timestamp to Temporal.DateTime in local time zone:
 * const result = toTemporalDateTime(1392098430000)
 * //=> Temporal.DateTime <2014-02-11T11:30:30>
 */
export default function toTemporalDateTime(argument) {
  requiredArgs(1, arguments)

  const argStr = Object.prototype.toString.call(argument)

  // Clone the date
  if (argument instanceof Temporal.Date) {
    return Temporal.Date.from(argument)
  } else if (argument instanceof Temporal.DateTime) {
    return argument.toDate()
  } else if (
    argument instanceof Date ||
    (typeof argument === 'object' && argStr === '[object Date]')
  ) {
    return Temporal.Absolute.fromEpochMilliseconds(argument.getTime()).toDateTime(Temporal.now.timeZone()).toDate()
  } else if (typeof argument === 'number' || argStr === '[object Number]') {
    return Temporal.Absolute.fromEpochMilliseconds(argument).toDateTime(Temporal.now.timeZone()).toDate()
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
    throw new RangeError('invalid date')
  }
}
