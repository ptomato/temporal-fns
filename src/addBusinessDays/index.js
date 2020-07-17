import isWeekend from '../isWeekend/index.js'
import toDate from '../toDate/index.js'
import toInteger from '../_lib/toInteger/index.js'
import requiredArgs from '../_lib/requiredArgs/index.js'
import isSunday from '../isSunday/index.js'
import isSaturday from '../isSaturday/index.js'
import toTemporalDateTime from '../_lib/toTemporalDateTime/index.js'

/**
 * @name addBusinessDays
 * @category Day Helpers
 * @summary Add the specified number of business days (mon - fri) to the given date.
 *
 * @description
 * Add the specified number of business days (mon - fri) to the given date, ignoring weekends.
 *
 * @param {Temporal.DateTime|Date|Number} date - the date to be changed
 * @param {Number} amount - the amount of business days to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
 * @returns {Date} the new date with the business days added
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // Add 10 business days to 1 September 2014:
 * var result = addBusinessDays(Temporal.DateTime.from('2014-09-01T00:00'), 10)
 * //=> Mon Sep 15 2014 00:00:00 (skipped weekend days)
 */
export default function addBusinessDays(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments)

  let date
  try {
    date = toTemporalDateTime(dirtyDate)
  } catch (e) {
    if (e instanceof RangeError) return new Date(NaN)
    throw e
  }

  const startedOnWeekend = isWeekend(date)
  const amount = toInteger(dirtyAmount)

  if (isNaN(amount)) return new Date(NaN)

  const sign = Math.sign(amount)
  const fullWeeks = toInteger(Math.abs(amount) / 5)

  date = sign >= 0 ? date.plus({ weeks: fullWeeks }) : date.minus({ weeks: fullWeeks })

  // Get remaining days not part of a full week
  let restDays = Math.abs(amount % 5)

  // Loops over remaining days
  while (restDays > 0) {
    date = sign > 0 ? date.plus({ days: 1 }) : date.minus({ days: 1 })
    if (!isWeekend(date)) restDays -= 1
  }

  // If the date is a weekend day and we reduce a dividable of
  // 5 from it, we land on a weekend date.
  // To counter this, we add days accordingly to land on the next business day
  if (startedOnWeekend && isWeekend(date) && amount !== 0) {
    // If we're reducing days, we want to add days until we land on a weekday
    // If we're adding days we want to reduce days until we land on a weekday
    if (isSaturday(date)) {
      date = sign < 0 ? date.plus({ days: 2 }) : date.minus({ days: 1 })
    }
    if (isSunday(date)) {
      date = sign < 0 ? date.plus({ days: 1 }) : date.minus({ days: 2 });
    }
  }

  return toDate(date)
}
