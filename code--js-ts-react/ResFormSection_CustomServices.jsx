import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";

import { Field, FieldArray } from "formik";

import {
  SectionTitle,
  PriceInputField,
  PriceTotal,
  NoteBit,
  InfoItem,
  BinaryCheckbox,
  CtrlAddNewEntry,
  CtrlRemoveEntry
} from "../FormElements/GenericFormElements.jsx";

import {
  PriceEquals,
  LockedIndicator,
  displayUserConfirmAction
} from "../../Elements/FY-UIElements.jsx";

/**
 * Creates (or adds to) the array of removed entry ids
 * */
const addToArrayOfRemovedEntryIds = ({
  values,
  setFieldValue,
  entryId,
  removedEntriesKey
}) => {
  const valuesPreviousRemovedIds = values[removedEntriesKey];
  let removedEntryIds = [];
  if (entryId) {
    if (!valuesPreviousRemovedIds) {
      removedEntryIds = [];
    } else {
      removedEntryIds = valuesPreviousRemovedIds;
    }
    removedEntryIds.push(entryId);
    //console.group("removedEntryIds");
    //console.log(removedEntryIds);
    //console.groupEnd();
    setFieldValue(removedEntriesKey, removedEntryIds);
  }
};

const createNewCustomServiceObject = () => {
  return {
    id: null
  };
};

/**
 *
 * @param {*} preset
 */
const createNewCustomServicePresetObject = preset => {
  const serviceDescription = preset["description"];
  const servicePriceFixed = preset["price_fixed"]
    ? Number(preset["price_fixed"])
    : null;
  const servicePriceDaily = preset["price_daily"]
    ? Number(preset["price_daily"])
    : null;
  const serviceNotesAdmin = preset["notes_admin"];
  const serviceNotesExpert = preset["notes_expert"];
  return {
    id: null,
    description: serviceDescription,
    price_fixed: servicePriceFixed,
    price_daily: servicePriceDaily,
    notes_admin: serviceNotesAdmin,
    notes_expert: serviceNotesExpert
  };
};

/**
 * A single Custom Service input.
 * */
const CustomService = ({
  lockedFromEditing = false,

  serviceData,
  days,
  index,
  removeCtrl,
  currentUserIsAdmin = false
}) => {
  return (
    <div key={index} className="single-entry">
      <div className="entry-header">
        <span className="entry-number">{index + 1}</span>
      </div>
      <div className="entry-body">
        <div className="fields">
          <label className="fy-form-label">
            <span className="label-text">Description</span>
            <Field
              name={`custom_services[${index}].description`}
              className="fy-input"
              disabled={lockedFromEditing}
            />
          </label>
          <label className="fy-form-label">
            <span className="label-text">Fixed Cost (&euro;)</span>
            <Field
              name={`custom_services[${index}].price_fixed`}
              className="fy-input"
              type="number"
              min="0"
              disabled={lockedFromEditing}
            />
          </label>
          <label className="fy-form-label">
            <span className="label-text">
              Daily Cost (&euro;) (* {days} days)
            </span>
            <Field
              name={`custom_services[${index}].price_daily`}
              className="fy-input"
              type="number"
              min="0"
              disabled={lockedFromEditing}
            />
          </label>
          <label className="fy-form-label">
            <span className="label-text">Notes</span>
            <Field
              name={`custom_services[${index}].notes_expert`}
              className="fy-input"
              disabled={lockedFromEditing}
            />
          </label>
          {currentUserIsAdmin && (
            <label className="fy-form-label admin">
              <span className="label-text">Notes [ADMIN]</span>
              <Field
                name={`custom_services[${index}].notes_admin`}
                className="fy-input"
                disabled={lockedFromEditing}
              />
            </label>
          )}
          {removeCtrl}
        </div>
        <div className="section-prices">
          <PriceEquals />
          <PriceTotal
            labelText="Service Cost"
            priceTotal={serviceData["price_total_app-computed"]}
          />
        </div>
      </div>
    </div>
  );
};

const CustomServicesPresetsPicker = ({
  customServicePresets = [],
  addCustomServicePresetId
}) => {
  const [selectedPresetId, selectPresetId] = useState();
  return (
    <div>
      <select
        onChange={e => {
          selectPresetId(Number(e.target.value));
          //console.log(selectedPresetId);
        }}
      >
        <option value="" disabled selected>
          Select preset
        </option>
        {customServicePresets.map(preset => {
          let presetTitle = preset["description"];
          if (preset["price_fixed"]) {
            presetTitle += ` [${Number(preset["price_fixed"]).toFixed(
              2
            )}€`;
          }
          if (preset["price_daily"]) {
            presetTitle += ` [Daily: ${Number(
              preset["price_daily"]
            ).toFixed(2)}€]`;
          }
          return (
            <option key={preset["id"]} value={preset["id"]}>
              {presetTitle}
            </option>
          );
        })}
      </select>
      {selectedPresetId > 0 && (
        <button
          type="button"
          className="btn btn-info"
          onClick={() => addCustomServicePresetId(selectedPresetId)}
        >
          Add Preset
        </button>
      )}
    </div>
  );
};

const filterPresetsByDayType = (presets, dayTypeId) => {
  if (!dayTypeId) {
    return [];
  }
  const filteredPresets = presets.filter(preset => {
    if (preset["day_type_id"] === null) {
      return true; // if no day type defined, assume it's for all types and include it
    } else return preset["day_type_id"] === dayTypeId;
  });
  return filteredPresets;
};

export const ResFormSection_CustomServices = ({
  debug,
  lockedFromEditing,

  values,
  setFieldValue,

  currentUserIsAdmin,
  maxEntries = 10,

  days,

  customServicePresets = []
}) => {
  const geoPlaceId = values["geo_place_id"];
  const dayTypeId = values["day_start_type_id"];

  // const customServicePresetsForLocation = mock_CustomServicePresets.filter(
  //   preset => {
  //     return preset["geo_place_id"] === geoPlaceId;
  //   }
  // );
  const customServices = values["custom_services"] || [];
  const maxEntriesReached = customServices.length >= maxEntries;
  const entriesRemaining = maxEntries - customServices.length;

  const sectionTitle = (
    <span>
      {lockedFromEditing && LockedIndicator} Custom Services [{" "}
      {customServices.length} / {maxEntries}]
    </span>
  );

  const filteredPresetsByDayType = filterPresetsByDayType(
    customServicePresets,
    dayTypeId
  );
  return (
    <div
      className={
        "form-group service section-custom-services " +
        (lockedFromEditing && " locked")
      }
    >
      <SectionTitle title={sectionTitle} />

      <FieldArray
        name="custom_services"
        render={arrayHelpers => (
          <div>
            <CustomServicesPresetsPicker
              customServicePresets={filteredPresetsByDayType}
              addCustomServicePresetId={presetId => {
                const selectedPreset = customServicePresets.find(
                  preset => preset.id === presetId
                );
                //console.log(selectedPreset);
                if (selectedPreset) {
                  arrayHelpers.push(
                    createNewCustomServicePresetObject(selectedPreset)
                  );
                } else {
                  console.error(
                    `Could not find the data for Custom Service Preset with id: ${presetId}`
                  );
                }
              }}
            />
            {customServices.map((entry, index) => (
              <CustomService
                lockedFromEditing={lockedFromEditing}
                days={days}
                serviceData={entry}
                index={index}
                currentUserIsAdmin={currentUserIsAdmin}
                removeCtrl={
                  <CtrlRemoveEntry
                    index={index}
                    handleRemoveEntry={i => {
                      const confirmFirst = true;
                      console.log(
                        "Preparing to remove custom service..."
                      );
                      const isConfirmed = confirmFirst
                        ? displayUserConfirmAction(
                            `Remove Service no.${i + 1}?`
                          )
                        : true;

                      if (isConfirmed) {
                        const entryId = entry["id"];
                        console.log(
                          "Removing custom service..." + entryId
                        );
                        if (entryId) {
                          addToArrayOfRemovedEntryIds({
                            values,
                            setFieldValue,
                            entryId,
                            removedEntriesKey:
                              "custom_services_removed_ids"
                          });
                        }
                        //values["custom_services_removed_ids"] =

                        //console.log(values);

                        arrayHelpers.remove(i);
                      }
                    }}
                  />
                }
              />
            ))}
            <hr />
            <div className="toolbar">
              {!maxEntriesReached && !lockedFromEditing && (
                <CtrlAddNewEntry
                  text="Add new Custom Service"
                  handleAddEntry={() => {
                    //arrayHelpers.push(createNewCustomServiceObject());
                    arrayHelpers.push(createNewCustomServiceObject());
                  }}
                />
              )}
            </div>
            <hr />
            <div className="section-prices small">
              <PriceTotal
                labelText="Total Custom Services Cost"
                priceTotal={
                  values["price_custom_services_total_app-computed"]
                }
              />
            </div>
          </div>
        )}
      />
      {debug && (
        <div className="debug debug-section">
          <div>
            <h3>custom_services</h3>
            <div>
              <pre>
                {JSON.stringify(values["custom_services"], null, 2)}
              </pre>
            </div>
          </div>
          <div>
            <h3>custom_services_removed_ids</h3>
            <div>
              <pre>
                {JSON.stringify(
                  values["custom_services_removed_ids"],
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
