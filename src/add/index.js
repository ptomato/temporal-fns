import toDate from '../toDate/index.js'
import requiredArgs from '../_lib/requiredArgs/index.js'
import toTemporalDateTime from '../_lib/toTemporalDateTime/index.js'
import {Temporal} from 'proposal-temporal/lib/index.mjs'

/**
 * @name add
 * @category Common Helpers
 * @summary Add the specified years, months, weeks, days, hours, minutes and seconds to the given date.
 *
 * @description
 * Add the specified years, months, weeks, days, hours, minutes and seconds to the given date.
 *
 * @param {Temporal.DateTime|Date|Number} date - the date to be changed
 * @param {Temporal.Duration|Duration} duration - the object with years, months, weeks, days, hours, minutes and seconds to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
 *
 * | Key            | Description                        |
 * |----------------|------------------------------------|
 * | years          | Amount of years to be added        |
 * | months         | Amount of months to be added       |
 * | weeks          | Amount of weeks to be added       |
 * | days           | Amount of days to be added         |
 * | hours          | Amount of hours to be added        |
 * | minutes        | Amount of minutes to be added      |
 * | seconds        | Amount of seconds to be added      |
 *
 * All values default to 0
 *
 * @returns {Date} the new date with the seconds added
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // Add the following duration to 1 September 2014, 10:19:50
 * var result = add(Temporal.DateTime.from('2014-09-01T10:19:50'), {
 *   years: 2,
 *   months: 9,
 *   weeks: 1,
 *   days: 7,
 *   hours: 5,
 *   minutes: 9,
 *   seconds: 30,
 * })
 * //=> Thu Jun 15 2017 15:29:20
 */
export default function add(dirtyDate, duration) {
  requiredArgs(2, arguments)

  if (!duration || typeof duration !== 'object') return new Date(NaN)
  if (!(duration instanceof Temporal.Duration)) {
    duration = Temporal.Duration.from(duration);
  }

  // Add years and months
  let date
  try {
    date = toTemporalDateTime(dirtyDate)
  } catch (e) {
    if (e instanceof RangeError) {
      return new Date(NaN)
    }
    throw e
  }

  return toDate(date.plus(duration));
}
