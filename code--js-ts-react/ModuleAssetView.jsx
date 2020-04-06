/**
 *
 * View Asset module with info and calendar.
 *
 */

import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

import { PropertyEntry } from "../Elements/FY-UIElements.jsx";

export class ModuleAssetView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { assetObject } = this.props;
    const assetDetails = (assetObject && assetObject["details"]) || {};

    const {
      id,
      title,
      name,
      description,

      guest_capacity_daily,
      guest_capacity_overnight,

      notes_expert,
      notes_admin
    } = assetObject ? assetObject : {};

    const {
      manufacturer,
      length_feet,
      year_constructed,
      year_refitted,

      guest_cabins,
      guest_baths,

      crew,
      crew_cabins,
      crew_baths
    } = assetDetails;

    return (
      <div>
        {id && (
          <Fragment>
            <div className="item-view-section">
              <h4 className="section-title">General</h4>
              <div className="section-body">
                <dl>
                  <PropertyEntry label="Manufacturer" value={manufacturer} />
                  <PropertyEntry label="ft" value={length_feet} />
                  <PropertyEntry label="Constructed" value={year_constructed} />
                  <PropertyEntry label="Refitted" value={year_refitted} />
                </dl>
              </div>
            </div>

            <div className="item-view-section">
              <h4 className="section-title">Guests & Crew Capacity</h4>
              <div className="section-body">
                <dl>
                  <PropertyEntry
                    label="Guests Daily"
                    value={guest_capacity_daily}
                  />
                  <PropertyEntry
                    label="Guests Overnight"
                    value={guest_capacity_overnight}
                  />
                  <PropertyEntry label="Guest Cabins" value={guest_cabins} />
                  <PropertyEntry label="Guest Baths" value={guest_baths} />
                  <PropertyEntry label="Crew" value={crew} />
                  <PropertyEntry label="Crew Cabins" value={crew_cabins} />
                  <PropertyEntry label="Crew Baths" value={crew_baths} />
                </dl>
              </div>
            </div>

            {description && (
              <div className="item-view-section">
                <h4 className="section-title">Description</h4>
                <div className="section-body">
                  <dl>
                    <PropertyEntry valueHTML={description} />
                  </dl>
                </div>
              </div>
            )}

            {notes_expert && (
              <div className="item-view-section">
                <h4 className="section-title">Notes</h4>
                <div className="section-body">
                  <dl>
                    <PropertyEntry value={notes_expert} />
                  </dl>
                </div>
              </div>
            )}
          </Fragment>
        )}
      </div>
    );
  }
}

ModuleAssetView.propTypes = {
  assetObject: PropTypes.object
};
