import * as React from 'react';
import {useEffect, useState} from "react";

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
import {commitChanges, setAppointmentsBySnapshot} from "../database_management/AppointmentsManager";

function MySchedule(){
  const [appointments, setAppointments] = useState([]);
  const [locale, setLocale] = useState('en-US');

  useEffect(
    () => {
      const unsubscribe = setAppointmentsBySnapshot(setAppointments);

      return () => {
        unsubscribe();
      }
    }, []
  );

  return (
    <>
      <LocaleSwitcher
        currentLocale={locale}
        setLocale={setLocale}
      />

      <Scheduler
        data={appointments}
        locale={locale}
        height={660}
      >
        <ViewState
          defaultCurrentViewName='Week'
        />
        <EditingState
          onCommitChanges={
            async ({added, changed, deleted}) => {
              await commitChanges(
                added,
                changed,
                deleted
              );
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
