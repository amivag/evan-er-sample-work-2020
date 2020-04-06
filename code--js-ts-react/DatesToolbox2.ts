import moment from "moment";
import { extendMoment } from "moment-range";

interface DateRange {
  date_start: string;
  date_end: string;
  [propName: string]: any;
}

const DEFAULT_DATE_FORMAT = "YYYY-MM-DD";

export const convertDateRangeIntoDiscreteDates = (
  dateStart: string,
  dateEnd: string | never
): Array<string> => {
  const dateStartM = moment(dateStart, DEFAULT_DATE_FORMAT);
  if (!dateStartM.isValid()) {
    return [];
  }
  if (!dateEnd) {
    dateEnd = dateStart;
  }
  const dateEndM = moment(dateEnd, DEFAULT_DATE_FORMAT);
  if (!dateEndM.isValid()) {
    return [];
  }

  // @ts-ignore
  const momentExt = extendMoment(moment);
  const inputDateRange = momentExt.range(dateStartM, dateEndM);

  const datesInRange = [];

  for (let day of inputDateRange.by("day")) {
    datesInRange.push(
      // @ts-ignore
      day.format(DEFAULT_DATE_FORMAT)
    );
  }

  // return array of
  return datesInRange;
};

/**
 * {date_start, date_end}
 * @param dateRangePairs
 */
export const convertDateRangePairsIntoDiscreteDatesSortedAsc = (
  dateRangePairs: Array<DateRange>
) => {
  const discreteDatesUnique = convertDateRangePairsIntoDiscreteDates(
    dateRangePairs
  );

  // sort into ascending
  const sortedDates = sortDatesAsc(discreteDatesUnique);

  return sortedDates;
};

export const convertDateRangePairsIntoDiscreteDates = (
  dateRangePairs: Array<DateRange>
) => {
  let discreteDates: Array<string> = [];
  dateRangePairs.forEach(dateRange => {
    const dateStart = dateRange.date_start; // string "YYYY-MM-DD"
    const dateEnd = dateRange.date_end; // string "YYYY-MM-DD"
    const currentDiscreteDates = convertDateRangeIntoDiscreteDates(
      dateStart,
      dateEnd
    );
    // overwriting variable, not a function approach but...
    if (currentDiscreteDates.length >= 1) {
      discreteDates = discreteDates.concat(currentDiscreteDates);
    }
  });

  // remove duplicates
  const discreteDatesUnique = getDiscreteDatesNoDuplicates(
    discreteDates
  );

  return discreteDatesUnique;
};

export const getDiscreteDatesNoDuplicates = (
  dates: Array<string>
): Array<string | never> => {
  const discreteDatesUnique = [...new Set(dates)];
  return discreteDatesUnique;
};

export const sortDatesAsc = (dates: Array<string> = []) => {
  const sortedReservationsByStartDateAscending = dates.sort(
    (a, b) => {
      const dateA = moment(a, DEFAULT_DATE_FORMAT);
      const dateB = moment(b, DEFAULT_DATE_FORMAT);
      if (!dateA.isValid() || !dateB.isValid()) {
        throw `Invalid date format found! (expecting format ${DEFAULT_DATE_FORMAT}): ${a}, ${b}`;
      }
      return dateA.diff(dateB);
    }
  );
  //console.log(sortedReservationsByStartDateAscending);
  return sortedReservationsByStartDateAscending;
};
