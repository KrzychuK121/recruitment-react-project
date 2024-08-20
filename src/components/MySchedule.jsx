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

import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import {db} from '../Firestore';

import LocaleSwitcher from './LocaleSwitcher';
import appointmentFormMessages from '../locale_messages/AppointmentFormMessages';
import allDayPanelMessages from '../locale_messages/AllDayPanelMessages';
import viewsDisplayNames from '../locale_messages/ViewsDisplayNames';
import confirmationDialogMessages from '../locale_messages/ConfirmationDialogMessages';

function processAppointment(appointment){
  const processedToSave = {...appointment};

  if(appointment.endDate !== undefined)
    processedToSave.endDate = appointment.endDate.toISOString();

  if(appointment.startDate !== undefined)
    processedToSave.startDate = appointment.startDate.toISOString();

  return processedToSave;
}

function getAppointmentDoc(id) {
  return doc(db, 'appointments', id);
}

async function commitChanges(
  added,
  changed,
  deleted,
  appointments,
  setAppointments,
  appointmentsCollectionRef
) {
  if (added) {
    const processedToSave = processAppointment(added);

    try {
      const response = await addDoc(appointmentsCollectionRef, processedToSave);
      setAppointments([...appointments, { id: response.id, ...added }]);
    } catch (ex) {
      console.log(ex.message);
    }
  }
  if (changed) {
    for (const [id, changedProps] of Object.entries(changed)) {
      const appointmentReference = getAppointmentDoc(id);
      try {
        const processedAppointment = processAppointment(changedProps);
        await updateDoc(appointmentReference, processedAppointment);
      } catch (ex) {
        console.log(ex.message);
      }
    }

    setAppointments(
      appointments.map(
        appointment => (
          changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment
        )
      )
    );
  }
  if (deleted !== undefined) {
    try {
      await deleteDoc(getAppointmentDoc(deleted));
    } catch (ex) {
      console.log(ex.message);
    }

    setAppointments(appointments.filter(appointment => appointment.id !== deleted));
  }
}

function MySchedule(){
  const defaultCurrDate = '2024-08-18';
  const appointmentsCollectionRef = collection(db, 'appointments');
  const [appointments, setAppointments] = useState([]);
  const [locale, setLocale] = useState('en-US');

  useEffect(
    () => {
      async function getAppointments(){
        try {
          const response = await getDocs(appointmentsCollectionRef)

          const fetchedAppointments = response.docs.map(
            doc => (
              {
                id: doc.id,
                ...doc.data()
              }
            )
          );

          setAppointments(fetchedAppointments);
        } catch (ex) {
          console.log(ex.message)
        }

      }

      getAppointments();
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
          defaultCurrentDate={defaultCurrDate}
          defaultCurrentViewName='Week'
        />
        <EditingState
          onCommitChanges={
            async ({added, changed, deleted}) => {
              await commitChanges(
                added,
                changed,
                deleted,
                appointments,
                setAppointments,
                appointmentsCollectionRef
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
