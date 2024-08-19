import * as React from 'react';
import {useState} from "react";

import {EditingState, IntegratedEditing, ViewState} from '@devexpress/dx-react-scheduler';

import {
  Scheduler,
  WeekView,
  Appointments,
  DateNavigator,
  Toolbar,
  ViewSwitcher,
  MonthView,
  DayView,
  AllDayPanel,
  AppointmentTooltip,
  AppointmentForm,
  ConfirmationDialog,
} from '@devexpress/dx-react-scheduler-material-ui';

import LocaleSwitcher from './LocaleSwitcher';
import appointmentFormMessages from '../locale_messages/AppointmentFormMessages';
import allDayPanelMessages from '../locale_messages/AllDayPanelMessages';
import viewsDisplayNames from '../locale_messages/ViewsDisplayNames';
import confirmationDialogMessages from '../locale_messages/ConfirmationDialogMessages';

// TODO: Change this method to work with Firestore
function commitChanges(added, changed, deleted, dataStorage, setDataStorage) {
  if (added) {
    const startingAddedId = dataStorage.length > 0 ? dataStorage[dataStorage.length - 1].id + 1 : 0;
    setDataStorage([...dataStorage, { id: startingAddedId, ...added }]);
  }
  if (changed) {
    setDataStorage(
      dataStorage.map(
        appointment => (
          changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment
        )
      )
    );
  }
  if (deleted !== undefined) {
    setDataStorage(dataStorage.filter(appointment => appointment.id !== deleted));
  }
}

function MySchedule(){
  const defaultCurrDate = '2024-08-18';
  const [data, setData] = useState(
    [
      {
        id: 1,
        startDate: new Date(`${defaultCurrDate}T09:45`),
        endDate: new Date(`${defaultCurrDate}T11:00`),
        title: 'Spotkanie'
      },
      {
        id: 2,
        startDate: new Date(`${defaultCurrDate}T12:00`),
        endDate: new Date(`${defaultCurrDate}T13:30`),
        title: 'Pójść na siłownię'
      }
    ]
  );
  const [locale, setLocale] = useState('en-US');

  return (
    <>
      <LocaleSwitcher
        currentLocale={locale}
        setLocale={setLocale}
      />

      <Scheduler
        data={data}
        locale={locale}
        height={660}
      >
        <ViewState
          defaultCurrentDate={defaultCurrDate}
          defaultCurrentViewName='Week'
        />
        <EditingState
          onCommitChanges={
            ({added, changed, deleted}) => {
              commitChanges(added, changed, deleted, data, setData);
            }
          }
        />

        <DayView
          displayName={viewsDisplayNames[locale].day}
        />
        <WeekView
          displayName={viewsDisplayNames[locale].week}
        />
        <MonthView
          displayName={viewsDisplayNames[locale].month}
        />

        <Toolbar />
        <DateNavigator />
        <ViewSwitcher />
        <AllDayPanel
          messages={allDayPanelMessages[locale]}
        />
        <Appointments />

        <IntegratedEditing />
        <AppointmentTooltip
          showOpenButton
          showDeleteButton
        />
        <AppointmentForm
          messages={appointmentFormMessages[locale]}
          dateEditorComponent={
            // Locale not working for some unclear reason (https://github.com/DevExpress/devextreme-reactive/issues/3064).
            ({...restProps}) => <AppointmentForm.DateEditor {...restProps} locale={locale} />
          }
        />
        <ConfirmationDialog
          messages={confirmationDialogMessages[locale]}
        />
      </Scheduler>
    </>
  );
}

export default MySchedule;
