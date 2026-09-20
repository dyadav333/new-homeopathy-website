import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/require-role";
import { ConsultationForm } from "../ConsultationForm";

export default async function DoctorDashboardPage() {
  const { authorized, session } = await requireRole(["DOCTOR"]);
  if (!authorized) redirect("/login");
  const doctor = await prisma.doctor.findUnique({ where: { userId: session!.user.id }, include: { appointments: { orderBy: { startAtUtc: "asc" }, include: { patient: { include: { user: true, medicalRecords: true, pets: true } }, consultationType: true, intakeResponse: true, consultation: { include: { notes: true } }, payment: true } } } });
  if (!doctor) redirect("/login");
  const appointments = doctor.appointments.filter((appointment) => appointment.status !== "CANCELLED");
  const completed = appointments.filter((appointment) => appointment.status === "COMPLETED").length;

  return (
    <div className="doctor-workspace">
      <header>
        <p className="dashboard-kicker">Practitioner workspace</p>
        <h1>Good morning, Dr. {session!.user.name?.split(" ").slice(-1)[0]}</h1>
        <p>Review today&apos;s care, patient history, and consultation notes.</p>
      </header>

      <div className="dashboard-stat-grid">
        <div className="dashboard-card dashboard-stat"><small>Assigned appointments</small><strong>{appointments.length}</strong></div>
        <div className="dashboard-card dashboard-stat"><small>Completed consultations</small><strong>{completed}</strong></div>
        <div className="dashboard-card dashboard-stat"><small>Patients in care</small><strong>{new Set(appointments.map((appointment) => appointment.patientId)).size}</strong></div>
      </div>

      <section className="doctor-appointments">
        <h2>Appointment queue</h2>
        {appointments.length === 0 ? <div className="dashboard-card">No appointments assigned yet.</div> : appointments.map((appointment) => (
          <article className="doctor-appointment" key={appointment.id}>
            <div className="doctor-appointment-header">
              <div>
                <h3>{appointment.patient.user.firstName} {appointment.patient.user.lastName}</h3>
                <p>{appointment.consultationType.name} · {appointment.startAtUtc.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" })} IST</p>
              </div>
              <span>{appointment.status}</span>
            </div>
            <div className="doctor-patient-details">
              <p><b>Concern:</b> {appointment.intakeResponse?.concerns ?? "No intake submitted"}</p>
              <p><b>Records:</b> {appointment.patient.medicalRecords.length} · <b>Pets:</b> {appointment.patient.pets.length}</p>
            </div>
            <ConsultationForm appointmentId={appointment.id} />
          </article>
        ))}
      </section>
    </div>
  );
}
