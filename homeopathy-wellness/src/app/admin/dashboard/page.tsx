import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/require-role";
import { LogoutButton } from "@/components/LogoutButton";

export default async function AdminDashboardPage() {
  const { authorized, session } = await requireRole(["ADMIN", "SUPER_ADMIN"]);
  if (!authorized) redirect("/login");

  const [users, doctorCount, patientCount, appointments, recordCount, orders, contactCount] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, include: { patient: { include: { pets: true } }, doctor: true } }),
    prisma.doctor.count({ where: { isActive: true } }),
    prisma.patient.count(),
    prisma.appointment.findMany({ orderBy: { startAtUtc: "desc" }, take: 30, include: { patient: { include: { user: true } }, doctor: { include: { user: true } }, consultationType: true, medicalRecords: true, prescriptions: { orderBy: { createdAt: "desc" } } } }),
    prisma.medicalRecord.count(),
    prisma.medicineOrder.findMany({ orderBy: { createdAt: "desc" }, take: 20, include: { patient: { include: { user: true } } } }),
    prisma.contactSubmission.count(),
  ]);
  const upcoming = appointments.filter((appointment) => appointment.startAtUtc >= new Date() && appointment.status !== "CANCELLED").length;
  const completed = appointments.filter((appointment) => appointment.status === "COMPLETED").length;
  const adminUser = users.find((user) => user.id === session!.user.id);

  return <div className="admin-workspace">
    <header className="panel-header"><div><p className="dashboard-kicker">Control centre</p><h1>Admin dashboard</h1><p>Platform-wide patient, doctor, appointment, record, order, and account visibility.</p><p className="panel-created">Signed in as {session!.user.name} · Account created {adminUser?.createdAt.toLocaleDateString("en-IN") ?? "today"}</p></div><LogoutButton /></header>
    <div className="dashboard-stat-grid"><div className="dashboard-card dashboard-stat"><small>Total accounts</small><strong>{users.length}</strong></div><div className="dashboard-card dashboard-stat"><small>Patients / active doctors</small><strong>{patientCount} / {doctorCount}</strong></div><div className="dashboard-card dashboard-stat"><small>Upcoming / completed</small><strong>{upcoming} / {completed}</strong></div><div className="dashboard-card dashboard-stat"><small>Records / orders</small><strong>{recordCount} / {orders.length}</strong></div></div>
    <section className="admin-section"><h2>All accounts</h2><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Name</th><th>Role</th><th>Email</th><th>Phone</th><th>Created</th><th>Patient / pet details</th></tr></thead><tbody>{users.map((user) => <tr key={user.id}><td>{user.firstName} {user.lastName}</td><td><span className="admin-badge">{user.role}</span></td><td>{user.email}</td><td>{user.phone || "-"}</td><td>{user.createdAt.toLocaleDateString("en-IN")}</td><td>{user.patient ? `${user.patient.pets.length} pet(s), ${user.patient.address || "no address"}` : user.doctor ? user.doctor.qualifications : "-"}</td></tr>)}</tbody></table></div></section>
    <section className="admin-section"><h2>Appointments and patient care history</h2><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Patient</th><th>Animal</th><th>Doctor</th><th>Appointment</th><th>Status</th><th>Records</th><th>Prescribed</th></tr></thead><tbody>{appointments.map((appointment) => <tr key={appointment.id}><td>{appointment.patient.user.firstName} {appointment.patient.user.lastName}</td><td>{appointment.petId ? "Pet consultation" : "Human consultation"}</td><td>Dr. {appointment.doctor.user.firstName} {appointment.doctor.user.lastName}</td><td>{appointment.startAtUtc.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" })}</td><td><span className="admin-badge">{appointment.status}</span></td><td>{appointment.medicalRecords.length}</td><td>{appointment.prescriptions.length ? appointment.prescriptions.map((prescription) => `${prescription.medicine} (${prescription.createdAt.toLocaleDateString("en-IN")})`).join(", ") : "-"}</td></tr>)}</tbody></table></div></section>
    <section className="admin-section"><h2>Medicine order history</h2><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Order</th><th>Patient</th><th>Items</th><th>Status</th><th>Created</th></tr></thead><tbody>{orders.length ? orders.map((order) => <tr key={order.id}><td>#{order.id.slice(-6).toUpperCase()}</td><td>{order.patient.user.firstName} {order.patient.user.lastName}</td><td>{order.items}</td><td><span className="admin-badge">{order.status}</span></td><td>{order.createdAt.toLocaleDateString("en-IN")}</td></tr>) : <tr><td colSpan={5}>No orders yet.</td></tr>}</tbody></table></div></section>
    <p className="admin-footnote">Contact messages stored: {contactCount}. Sensitive details are shown only to authorized administrators.</p>
  </div>;
}
