import {
  convertDateRangeIntoDiscreteDates,
  convertDateRangePairsIntoDiscreteDates,
  convertDateRangePairsIntoDiscreteDatesSortedAsc,
  sortDatesAsc
} from "./DatesToolbox2";

//////////////////////////////////////////
// convertDateRangeIntoDiscreteDates
test("non-date input", () => {
  expect(convertDateRangeIntoDiscreteDates("a", "b")).toEqual([]);
});

test("non-date input", () => {
  expect(convertDateRangeIntoDiscreteDates("a")).toEqual([]);
});

test("single date", () => {
  expect(convertDateRangeIntoDiscreteDates("2020-05-05")).toEqual([
    "2020-05-05"
  ]);
});
test("single date", () => {
  expect(
    convertDateRangeIntoDiscreteDates("2020-05-05", "2020-05-05")
  ).toEqual(["2020-05-05"]);
});

test("two days", () => {
  expect(
    convertDateRangeIntoDiscreteDates("2020-05-05", "2020-05-06")
  ).toEqual(["2020-05-05", "2020-05-06"]);
});

test("four days", () => {
  expect(
    convertDateRangeIntoDiscreteDates("2020-05-05", "2020-05-08")
  ).toEqual(["2020-05-05", "2020-05-06", "2020-05-07", "2020-05-08"]);
});
///////////////////////////////////////////////////////

//////////////////////////////////////////
// convertDateRangePairsIntoDiscreteDates
test("single date", () => {
  expect(
    convertDateRangePairsIntoDiscreteDates([
      { date_start: "2020-05-05" }
    ])
  ).toEqual(["2020-05-05"]);
});
test("single date", () => {
  expect(
    convertDateRangePairsIntoDiscreteDates([
      { date_start: "2020-05-05", date_end: "2020-05-05" }
    ])
  ).toEqual(["2020-05-05"]);
});
test("two identical ranges, remove duplicates", () => {
  expect(
    convertDateRangePairsIntoDiscreteDates([
      { date_start: "2020-05-05", date_end: "2020-05-05" },
      { date_start: "2020-05-05", date_end: "2020-05-05" }
    ])
  ).toEqual(["2020-05-05"]);
});
test("two ranges, remove duplicates", () => {
  expect(
    convertDateRangePairsIntoDiscreteDates([
      { date_start: "2020-05-05", date_end: "2020-05-05" },
      { date_start: "2020-05-05", date_end: "2020-05-08" }
    ])
  ).toEqual(["2020-05-05", "2020-05-06", "2020-05-07", "2020-05-08"]);
});
test("three ranges, remove duplicates", () => {
  expect(
    convertDateRangePairsIntoDiscreteDates([
      { date_start: "2020-05-05", date_end: "2020-05-05" },
      { date_start: "2020-05-05", date_end: "2020-05-08" },
      { date_start: "2020-05-20", date_end: "2020-05-21" }
    ])
  ).toEqual([
    "2020-05-05",
    "2020-05-06",
    "2020-05-07",
    "2020-05-08",
    "2020-05-20",
    "2020-05-21"
  ]);
});

///////////////////////////////////////////////////////////////
/// sortDatesAsc
test("sort dates, correct order", () => {
  expect(
    sortDatesAsc([
      "2020-05-20",
      "2020-05-06",
      "2020-05-04",
      "2020-05-21",
      "2020-05-05",
      "2020-05-07",
      "2020-05-08",
      "2019-05-07"
    ])
  ).toEqual([
    "2019-05-07",
    "2020-05-04",
    "2020-05-05",
    "2020-05-06",
    "2020-05-07",
    "2020-05-08",
    "2020-05-20",
    "2020-05-21"
  ]);
});

////////////////////////////////////////////////////////////////////////
// convertDateRangePairsIntoDiscreteDates
test("three ranges, correct order", () => {
  expect(
    convertDateRangePairsIntoDiscreteDatesSortedAsc([
      { date_start: "2020-05-05", date_end: "2020-05-05" },
      { date_start: "2020-05-04", date_end: "2020-05-08" },
      { date_start: "2020-05-20", date_end: "2020-05-21" }
    ])
  ).toEqual([
    "2020-05-04",
    "2020-05-05",
    "2020-05-06",
    "2020-05-07",
    "2020-05-08",
    "2020-05-20",
    "2020-05-21"
  ]);
});
