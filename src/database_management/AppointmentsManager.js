import {
  addDoc, collection,
  deleteDoc,
  doc, onSnapshot,
  updateDoc
} from "firebase/firestore";
import {db} from "../Firestore";

function getAppointmentDoc(id) {
  return doc(db, 'appointments', id);
}

const appointmentsCollectionRef = collection(db, 'appointments');

function processAppointment(appointment){
  const processedToSave = {...appointment};

  if(appointment.endDate !== undefined)
    processedToSave.endDate = appointment.endDate.toISOString();

  if(appointment.startDate !== undefined)
    processedToSave.startDate = appointment.startDate.toISOString();

  return processedToSave;
}

function processAppointmentsBySnapshot(snapshot, setAppointments){
  const fetchedAppointments = snapshot.docs.map(
    doc => (
      {
        id: doc.id,
        ...doc.data()
      }
    )
  );

  setAppointments(fetchedAppointments);
}

export function setAppointmentsBySnapshot(setAppointments){
  return onSnapshot(
    appointmentsCollectionRef,
      snapshot => processAppointmentsBySnapshot(snapshot, setAppointments)
  );
}

export async function commitChanges(
  added,
  changed,
  deleted
) {
  if (added) {
    const processedToSave = processAppointment(added);

    try {
      await addDoc(appointmentsCollectionRef, processedToSave);
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
  }
  if (deleted !== undefined) {
    try {
      await deleteDoc(getAppointmentDoc(deleted));
    } catch (ex) {
      console.log(ex.message);
    }
  }
}