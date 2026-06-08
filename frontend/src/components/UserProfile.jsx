import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { highFidelityReport } from "../assets/designAssets";

function TagInput({ tags, setTags, placeholder }) {
  const [value, setValue] = useState("");
  const addTag = () => {
    const v = value.trim().toLowerCase();
    if (!v) return;
    if (tags.length >= 10) return;
    if (v.length > 50) return;
    setTags([...tags, v]);
    setValue("");
  };
  const removeTag = (i) => setTags(tags.filter((_, idx) => idx !== i));
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((t, i) => (
          <span
            key={i}
            className="bg-teal-100 text-teal-800 px-2 py-1 rounded flex items-center gap-2"
          >
            {t}
            <button onClick={() => removeTag(i)} className="text-sm">
              ✕
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addTag();
            }
          }}
          placeholder={placeholder}
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={addTag}
          className="px-3 py-1 bg-teal-500 text-white rounded"
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default function UserProfile({ isOpen, onClose, onSelectDiagnosis }) {
  const [profile, setProfile] = useState(null);
  const [diagnoses, setDiagnoses] = useState([]);
  const [savedDoctors, setSavedDoctors] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  useEffect(() => {
    if (!isOpen) return;
    async function load() {
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) return;
      const uid = session.user.id;
      const { data: profileData } = await supabase
        .from("profiles")
        .select()
        .eq("user_id", uid)
        .single();
      setProfile(profileData);
      setForm(profileData || {});
      const { data: diag } = await supabase
        .from("diagnoses")
        .select()
        .eq("user_id", uid)
        .order("created_at", { ascending: false })
        .limit(5);
      setDiagnoses(diag || []);
      const { data: docs } = await supabase
        .from("saved_doctors")
        .select()
        .eq("user_id", uid);
      setSavedDoctors(docs || []);
    }
    load();
  }, [isOpen]);

  const saveProfile = async () => {
    const session = (await supabase.auth.getSession()).data.session;
    if (!session) return;
    const uid = session.user.id;
    const updates = { ...form };
    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("user_id", uid);
    if (!error) {
      setEditMode(false);
      setProfile({ ...profile, ...updates });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="absolute right-0 top-0 h-full w-full md:w-96 bg-white shadow-lg transform transition-transform"
      style={{ zIndex: 60 }}
    >
      <div className="p-4 h-full overflow-auto">
        <div className="mb-4 rounded overflow-hidden">
          <img
            src={highFidelityReport}
            alt="Profile banner"
            className="w-full h-28 object-cover rounded"
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-teal-200 rounded-full flex items-center justify-center">
              {profile?.full_name
                ? profile.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                : "U"}
            </div>
            <div>
              <div className="font-semibold">
                {profile?.full_name || "Unknown"}
              </div>
              <div className="text-sm text-gray-500">
                {profile?.email || ""}
              </div>
            </div>
          </div>
          <div>
            <button onClick={onClose} className="px-3 py-1 border rounded">
              Close
            </button>
          </div>
        </div>

        <div className="mt-4">
          <div className="font-semibold mb-2">Health Profile</div>
          <div className="flex items-center gap-2 mb-2">
            <div className="text-sm text-gray-500">Blood type:</div>
            <div className="px-2 py-1 bg-gray-100 rounded">
              {profile?.blood_type || "unknown"}
            </div>
          </div>

          <div className="mb-4">
            <div className="text-sm text-gray-500">Chronic conditions</div>
            {profile?.chronic_conditions &&
            profile.chronic_conditions.length ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.chronic_conditions.map((c, i) => (
                  <span key={i} className="bg-teal-100 px-2 py-1 rounded">
                    {c}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 mt-2">None recorded</div>
            )}
          </div>

          <div className="mb-4">
            <div className="text-sm text-gray-500">Allergies</div>
            {profile?.allergies && profile.allergies.length ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.allergies.map((c, i) => (
                  <span key={i} className="bg-red-100 px-2 py-1 rounded">
                    {c}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 mt-2">None recorded</div>
            )}
          </div>

          <div className="mb-6">
            <div className="font-semibold">Recent Diagnoses</div>
            {diagnoses.length ? (
              diagnoses.map((d) => (
                <div
                  key={d.id}
                  className="p-2 border rounded mt-2 cursor-pointer"
                  onClick={() => onSelectDiagnosis && onSelectDiagnosis(d)}
                >
                  <div className="text-sm text-gray-600">
                    {new Date(d.created_at).toLocaleString()}
                  </div>
                  <div className="font-medium">
                    {d.symptoms_input.slice(0, 60)}
                  </div>
                  <div className="text-xs mt-1">{d.urgency_level}</div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500 mt-2">
                No recent diagnoses
              </div>
            )}
          </div>

          <div className="mb-6">
            <div className="font-semibold">Saved Doctors</div>
            {savedDoctors.length ? (
              savedDoctors.map((s) => (
                <div key={s.id} className="p-2 border rounded mt-2">
                  <div className="font-medium">
                    {s.doctor_name || s.hospital}
                  </div>
                  <div className="text-sm text-gray-500">
                    {s.specialization} · {s.city}
                  </div>
                  {s.is_ai_suggested && (
                    <div className="text-xs text-yellow-700">
                      AI suggested — verify before visiting
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500 mt-2">No saved doctors</div>
            )}
          </div>

          <div>
            <button
              onClick={() => setEditMode(true)}
              className="px-3 py-2 bg-blue-50 border rounded"
            >
              Edit Profile
            </button>
          </div>

          {editMode && (
            <div className="mt-4 border-t pt-4">
              <div className="mb-2">Edit profile</div>
              <input
                value={form.full_name || ""}
                onChange={(e) =>
                  setForm({ ...form, full_name: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
                placeholder="Full name"
              />
              <input
                value={form.date_of_birth || ""}
                onChange={(e) =>
                  setForm({ ...form, date_of_birth: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
                placeholder="Date of birth"
              />
              <select
                value={form.gender || "prefer_not_to_say"}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="w-full p-2 border rounded mb-2"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
              <input
                value={form.city || ""}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full p-2 border rounded mb-2"
                placeholder="City"
              />
              <input
                value={form.country || ""}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="w-full p-2 border rounded mb-2"
                placeholder="Country"
              />
              <select
                value={form.blood_type || "unknown"}
                onChange={(e) =>
                  setForm({ ...form, blood_type: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
              >
                <option value="unknown">Unknown</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>

              <div className="mb-2">Chronic conditions</div>
              <TagInput
                tags={form.chronic_conditions || []}
                setTags={(t) => setForm({ ...form, chronic_conditions: t })}
                placeholder="Type and press Enter"
              />
              <div className="mb-2">Allergies</div>
              <TagInput
                tags={form.allergies || []}
                setTags={(t) => setForm({ ...form, allergies: t })}
                placeholder="Type and press Enter"
              />

              <div className="flex gap-2 mt-4">
                <button
                  onClick={saveProfile}
                  className="px-3 py-2 bg-teal-500 text-white rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-3 py-2 border rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
