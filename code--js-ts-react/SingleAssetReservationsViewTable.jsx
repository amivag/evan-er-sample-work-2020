import React, { Component } from "react";

import ReactTable from "react-table-6";
import "react-table-6/react-table.css";

import PropTypes from "prop-types";

import * as tableTools from "./TableTools/TableTools.jsx";
import * as datesToolbox from "../../libs/DatesToolbox.js";

export const SingleAssetReservationsViewTable = props => {
  const reservations = props.reservations || [];
  const currentUserId = props.currentUserId;
  const caption = props.caption || "Reservations";

  return (
    <table className="fy-table reservations-table single-asset-reservations">
      <caption>
        <span>{caption}</span>
      </caption>
      <thead>
        <tr>
          <th scope="col">id</th>
          <th scope="col">Status</th>
          <th scope="col">Starts</th>
          <th scope="col">Ends</th>
          <th scope="col">Day Type</th>
          <th scope="col">Asset id</th>
          <th scope="col">Created at</th>
          <th scope="col">Created by</th>
        </tr>
      </thead>
      <tbody>
        {reservations.map((res, i) => {
          return (
            <tr key={res.id}>
              <td>{res.id}</td>
              <td>
                <tableTools.ReservationStatusLabel statusId={res.status_id} />
              </td>
              <td>
                <tableTools.ReservationDate dateStr={res.date_start} />
              </td>
              <td>
                <tableTools.ReservationDate dateStr={res.date_end} />
              </td>
              <td>
                {res.day_start_type_id && (
                  <tableTools.DayTypeLabel dayTypeId={res.day_start_type_id} />
                )}
              </td>
              <td>{res.asset_id}</td>
              <td>
                <datesToolbox.getTimestampFormatted
                  timestampStr={res.created_at}
                />
              </td>
              <td>
                <tableTools.ByUser
                  userId={res.created_by_userid}
                  username={
                    res.user_created_by && res.user_created_by.user_name
                  }
                  isCurrentUser={
                    props.currentUserId
                      ? res.created_by_userid == currentUserId
                      : false
                  }
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
SingleAssetReservationsViewTable.propTypes = {
  reservations: PropTypes.array.isRequired,
  currentUserId: PropTypes.number
};
