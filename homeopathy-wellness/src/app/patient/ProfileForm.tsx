"use client";

import { FormEvent, useState } from "react";

type Profile = { user: { firstName: string; lastName: string; email: string; phone: string | null; gender: string | null; bloodGroup: string | null; photoData: string | null }; patient: { dateOfBirth: Date | null; address: string | null; country: string | null; pincode: string | null } };

export function ProfileForm({ profile }: { profile: Profile }) {
  const [status, setStatus] = useState("");
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus("Saving...");
    const form = new FormData(event.currentTarget);
    const photo = form.get("photo") as File | null;
    const photoData = photo?.size ? await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = reject; reader.readAsDataURL(photo); }) : "";
    const result = await fetch("/api/patient/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...Object.fromEntries(form), photoData }) }).then((response) => response.json());
    setStatus(result.success ? "Profile saved" : result.error?.message ?? "Could not save profile");
  }
  return <form onSubmit={save} className="profile-form">
    <div className="profile-form-grid">
      <label>Profile photo<input name="photo" type="file" accept="image/*" /></label>
      <label>First name<input name="firstName" required defaultValue={profile.user.firstName} /></label>
      <label>Last name<input name="lastName" required defaultValue={profile.user.lastName} /></label>
      <label>Phone number<input name="phone" defaultValue={profile.user.phone ?? ""} /></label>
      <label>Email address<input disabled value={profile.user.email} readOnly /></label>
      <label>Gender<select name="gender" defaultValue={profile.user.gender ?? ""}><option value="">Select an option</option><option>Female</option><option>Male</option><option>Non-binary</option><option>Prefer not to say</option></select></label>
      <label>Blood group<select name="bloodGroup" defaultValue={profile.user.bloodGroup ?? ""}><option value="">Select an option</option>{["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((value) => <option key={value}>{value}</option>)}</select></label>
      <label>Date of birth<input name="dateOfBirth" type="date" defaultValue={profile.patient.dateOfBirth ? new Date(profile.patient.dateOfBirth).toISOString().slice(0, 10) : ""} /></label>
      <label>Timezone<input disabled value="Asia/Kolkata (UTC+05:30)" readOnly /></label>
    </div>
    <label>Address<textarea name="address" rows={3} defaultValue={profile.patient.address ?? ""} placeholder="House number, street, area" /></label>
    <div className="profile-form-grid"><label>Country<input name="country" defaultValue={profile.patient.country ?? "India"} /></label><label>Pincode<input name="pincode" defaultValue={profile.patient.pincode ?? ""} /></label></div>
    <div className="profile-actions"><span>{status}</span><button type="submit">Save changes</button></div>
  </form>;
}