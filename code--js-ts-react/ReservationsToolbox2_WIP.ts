import * as datesToolbox from "../DatesToolbox.js";

export const resStatusId_Request = 1;
export const resStatusId_Booked = 2;
export const resStatusId_Blocked = 3;
export const resStatusId_Cancelled = 4;

/** Reservation Statuses */
export const reservationStatusesObj = [
  {
    id: resStatusId_Request,
    name: "Requested",
    className: "status-requested"
  },
  {
    id: resStatusId_Booked,
    name: "Booked",
    className: "status-booked"
  },
  {
    id: resStatusId_Blocked,
    name: "Blocked",
    className: "status-blocked"
  },
  {
    id: resStatusId_Cancelled,
    name: "Cancelled",
    className: "status-cancelled"
  }
];

export const dayTypesObj = [
  { id: 1, name: "Full day", className: "daytype-full" },
  {
    id: 2,
    name: "First half",
    className: "daytype-half-first halfday first"
  },
  {
    id: 3,
    name: "Second half",
    className: "daytype-half-second halfday last"
  }
];

/**
 * Tag Reservation states and statuses
 * @param {*} reservationsArray
 * @param {*} currentDateTime
 */
export const tagReservationStatesAndStatuses = (
  reservationsArray: Array<any> = [],
  currentDateTime: number
): Array<any> => {
  const taggedReservationsArray = reservationsArray.map(
    (res: Array<any>) => {
      const resId = res["id"];
      const statusId = res["status_id"];
      const dateStart = res["date_start"];
      const startDayType = res["day_start_type_id"];
      const dateEnd = res["date_end"];

      const isResStatusREQUEST = statusId === resStatusId_Request;
      const isResStatusBOOKED = statusId === resStatusId_Booked;
      const isResStatusBLOCKED = statusId === resStatusId_Blocked;
      const isResStatusCANCELLED = statusId === resStatusId_Cancelled;

      //console.group(`#${resId} - calling: isReservationCurrentlyActive`);
      //console.log(dateStart);
      //console.log(dateEnd);
      //console.groupEnd();
      const isReservationCurrentlyActive = datesToolbox.isDateRangeCurrentlyActive(
        dateStart,
        dateEnd,
        startDayType
      );

      const isReservationExpired = datesToolbox.isDateRangeExpired(
        dateStart,
        dateEnd,
        startDayType
      );

      //console.group(`Reservation #${resId}`);
      if (isReservationCurrentlyActive) {
        //console.log("Reservation currently active!");
      }
      if (isReservationExpired) {
        //console.log("Reservation expired!");
      }
      //console.groupEnd();

      let resRunningStateTag = "-";

      if (!isReservationCurrentlyActive && !isReservationExpired) {
        // res is in the future
        if (isResStatusREQUEST) {
          resRunningStateTag = "PENDING";
        } else if (isResStatusBOOKED || isResStatusBLOCKED) {
          resRunningStateTag = "UPCOMING";
        } else if (isResStatusCANCELLED) {
          resRunningStateTag = "INACTIVE";
        }
      } else if (isReservationExpired) {
        // res is in the past
        if (isResStatusREQUEST) {
          resRunningStateTag = "MISSED";
        } else if (isResStatusBOOKED || isResStatusBLOCKED) {
          resRunningStateTag = "COMPLETED";
        } else if (isResStatusCANCELLED) {
          resRunningStateTag = "INACTIVE-EXPIRED";
        }
      } else if (isReservationCurrentlyActive) {
        // res is in the now
        if (isResStatusREQUEST) {
          resRunningStateTag = "MISSED";
        } else if (isResStatusBOOKED || isResStatusBLOCKED) {
          resRunningStateTag = "RUNNING-NOW";
        } else if (isResStatusCANCELLED) {
          resRunningStateTag = "INACTIVE-NOW";
        }
      }

      res["_RUNNING_STATUS-app-computed"] = resRunningStateTag;
      return res;
    }
  );
  return taggedReservationsArray;
};

/**  */
export const filterReservationsByItemId = (
  resData = [],
  itemId: number
) => {
  const filteredReservations = resData
    ? resData.filter((res: Array<any>) => {
        //console.log(res.id);
        return res["asset_id"] ? res["asset_id"] == itemId : false;
      })
    : []; /*
    console.log(
      `Filtered reservations for asset id ${itemId}: ${JSON.stringify(
        filteredReservations
      )}`
    );*/
  return filteredReservations;
};

/**  */
export const getSelectedAssetLatestDataFromReservation = (
  resData: Array<any>,
  assets = []
) => {
  const hasAsset = resData["asset_id"] ? true : false;
  const asset =
    hasAsset && assets.find(a => a["id"] === resData["asset_id"]);
  return asset;
};

/** */
export const getSelectedItineraryLatestDataFromReservation = (
  resData: Array<any>,
  itineraries = []
) => {
  const hasItinerary = resData["itinerary_id"] ? true : false;
  const itinerary =
    hasItinerary &&
    itineraries.find(i => i["id"] === resData["itinerary_id"]);
  return itinerary;
};

export const getReservationStatusClassname = (statusId: number) => {
  const res = reservationStatusesObj.find(s => s.id === statusId);
  const className = res ? res["className"] : "status-unknown";
  return className;
};
export const getReservationStatusLabel = (statusId: number) => {
  const status = reservationStatusesObj.find(s => s.id === statusId);
  const label = status ? status["name"] : "-unknown-";
  return label;
};

export const getDayTypeInfo = dayTypeId => {
  const type = dayTypesObj.find(s => s["id"] === dayTypeId);
  const dayTypeLabel = type ? type["name"] : ""; // no day-type (multi-days etc)
  const dayTypeClass = type ? type["className"] : ""; // no day-type (multi-days etc)
  return { dayTypeLabel, dayTypeClass };
};

/** Get reservations involving a given asset_id */
export const filterReservationsByAssetId = (
  resData = [],
  assetId
) => {
  const filteredReservations = resData
    ? resData.filter(res => {
        //console.log(res.id);
        return res["asset_id"] ? res["asset_id"] == assetId : false;
      })
    : null;
  return filteredReservations;
};

/** Filter reservations to exclude cancelled (i.e. return only requested, booked and blocked) */
export const filterReservationsExcludeCancelled = resData => {
  const filteredResData = resData.filter(res => {
    return res["status_id"] !== resStatusId_Cancelled; // remove cancelled
  });
  //console.log("Remove cancelled reservations...");
  //console.log(filteredResData);
  return filteredResData;
};

/** values <--- object with reservation data, matching the database columns (plus lots extra data) */
export const processReservationDataBeforeSubmitToServer = (
  newValues,
  prevValues = null
) => {
  // remove unneedeed properties using destructuring
  const {
    created_at,
    updated_at,
    deleted_at,
    asset,
    ...filteredValues
  } = newValues;

  /*
  if (filteredValues["days_total_computed"] === 1) {
    filteredValues["date_end"] = null; // unset end date if single day, to appear cleaner in the DB
  }
  */

  return filteredValues;
};

/** Exclude specific reservation id from array of reservation objects */
export const filterReservationsExcludeResId = (resData, resId) => {
  const filteredResData = resData
    ? resData.filter(res => {
        return res.id != resId;
      })
    : null;
  //console.log(`filteredResData for id ${resId}`);
  //console.log(resData);
  //console.log(filteredResData);
  return filteredResData;
};

export const getReservationDataByResId = (resData = [], resId) => {
  const singleResData = resData.find(res => {
    return res["id"] === resId;
  });
  //console.log(reservationsData);
  //console.log(id);
  //console.log(singleResData);
  return singleResData;
};

/** NOTE: Filter by TAG! Reservations must be tagged first!  */
export const filterOnlyActiveCurrentAndFutureValidReservations = (
  resData: Array<any> = []
) => {
  const filteredReservations = resData.filter(res => {
    return (
      res["_RUNNING_STATUS-app-computed"] === "PENDING" ||
      res["_RUNNING_STATUS-app-computed"] === "UPCOMING" ||
      res["_RUNNING_STATUS-app-computed"] === "RUNNING-NOW"
    );
  });
  return filteredReservations;
};

export const sortReservationsByStartDateAsc = (
  resData: Array<any> = []
) => {
  let sortedReservationsByStartDateAscending = resData;
  sortedReservationsByStartDateAscending.sort((a, b) => {
    const startDateA = a["date_start"];
    const startDateB = b["date_start"];
    const dateStart = new Date(startDateA);
    const dateEnd = new Date(startDateB);
    return Math.abs(<any>dateStart - <any>dateEnd);
  });
  return sortedReservationsByStartDateAscending;
};

/**
 *
 * @param {*} currentAssetId
 * @param {*} allReservations | This better be a list of all active reservations
 */
export const getAssetsCurrentAndUpcomingReservations = ({
  currentAssetId,
  reservationsData
}) => {
  const thisAssetsReservations = filterReservationsByItemId(
    reservationsData,
    currentAssetId
  );
  const taggedReservations = tagReservationStatesAndStatuses(
    thisAssetsReservations,
    Date.now()
  );
  const assetActiveReservationsCurrentAndUpcoming = filterOnlyActiveCurrentAndFutureValidReservations(
    taggedReservations
  );
  const sortedReservationsByStartDate = sortReservationsByStartDateAsc(
    assetActiveReservationsCurrentAndUpcoming
  );

  return sortedReservationsByStartDate;
};
