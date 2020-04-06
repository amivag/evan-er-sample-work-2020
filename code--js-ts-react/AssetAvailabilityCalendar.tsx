import React, { Component, Fragment, useState } from 'react';

import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

/// https://kentcdodds.com/blog/stop-using-isloading-booleans/
// const isLoading = status === 'idle' || status === 'pending'
// const isResolved = status === 'resolved'
// const isRejected = status === 'rejected'

const convertDatesArrayStringToDate = (datesStringArray: Array<string> = []) => {
	const datesArray = datesStringArray.map((date) => {
		return new Date(date);
	});
	return datesArray;
};

// https://stackoverflow.com/questions/3552461/how-to-format-a-javascript-date
const formatDateIntoString = (date: Date) => {
	const dtf = new Intl.DateTimeFormat('en', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	});
	const [ { value: mo }, , { value: da }, , { value: ye } ] = dtf.formatToParts(date);
	const dateString = `${ye}-${mo}-${da}`;

	return dateString;
};

const addStringDateToArray = (newDate: string, dates: Array<string>): Array<string> => {
	const updatedDates = [ ...dates, newDate ];
	const updatedDatesUnique = [ ...new Set(updatedDates) ];
	return updatedDatesUnique;
};

const removeStringDateFromArray = (newDate: string, dates: Array<string>): Array<string> => {
	const updatedDates = dates.filter((date) => date !== newDate);
	return updatedDates;
};

export const AssetAvailabilityCalendar = ({
	isLoading = false, // TODO: Convert to state --> https://kentcdodds.com/blog/stop-using-isloading-booleans/
	loadingStatus = false,
	allowDayBlocking = false,
	numberOfMonths = 3,
	datesDiscreteBlocked = [],
	resDatesRequested = [],
	resDatesUnavailable = []
}) => {
	const [ datesBlocked, setDatesBlocked ] = useState<Array<string>>(datesDiscreteBlocked);
	const [ datesSelected, setDatesSelected ] = useState<Array<string>>([]);
	const [ datesToBlock, setDatesToBlock ] = useState<Array<string>>([]);
	const [ datesToUnblock, setDatesToUnblock ] = useState<Array<string>>([]);
	const handleDayClick = (selectedDay: Date, modifiers: DayModifiers) => {
		if (!allowDayBlocking || modifiers.disabled) {
			return;
		}
		const isDayAlreadySelected = modifiers.selected;
		const isDayAlreadyBlocked = modifiers.blocked;
		const selectedDayString = formatDateIntoString(selectedDay);

		//const selectedDate = modifiers?.selected;
		//console.group("handleDayClick");
		if (isDayAlreadyBlocked) {
			console.log('Day was blocked previously');
			const newUnblockDates = addStringDateToArray(selectedDayString, datesToUnblock);
			setDatesToUnblock(newUnblockDates);

			const newDatesBlocked = removeStringDateFromArray(selectedDayString, datesBlocked);
			setDatesBlocked(newDatesBlocked);
		} else {
			//console.log("Day was unblocked previously");
			// TODO: Check if unavailable
			const newBlockDates = addStringDateToArray(selectedDayString, datesToBlock);
			setDatesToBlock(newBlockDates);

			const newDatesBlocked = addStringDateToArray(selectedDayString, datesBlocked);
			setDatesBlocked(newDatesBlocked);
		}

		// console.log(modifiers);
		// console.log(selectedDayString);
		// console.log(datesToBlock);
		// console.log(datesToUnblock);
		// console.groupEnd();
	};

	const modifiers = {
		requested: convertDatesArrayStringToDate(resDatesRequested),
		unavailable: convertDatesArrayStringToDate(resDatesUnavailable),
		blockedOriginally: convertDatesArrayStringToDate(datesDiscreteBlocked),
		blocked: convertDatesArrayStringToDate(datesBlocked)
	};

	const selectedDays = allowDayBlocking ? convertDatesArrayStringToDate(datesDiscreteBlocked) : [];

	return (
		<div className="assetAvailabilityCal">
			<DayPicker
				initialMonth={new Date()}
				numberOfMonths={numberOfMonths}
				modifiers={modifiers}
				disabledDays={convertDatesArrayStringToDate(resDatesUnavailable)}
				selectedDays={selectedDays}
				onDayClick={handleDayClick}
			/>
		</div>
	);
};
