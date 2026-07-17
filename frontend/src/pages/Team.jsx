import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useAssignees } from "../context/AssigneeContext";
import { useNotifications } from "../context/NotificationContext";
import { uploadAvatar } from "../lib/supabase";
import { Avatar } from "../components/AssigneeDropdown";
import {
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  ShieldAlert,
  Users,
  Camera,
  Loader2,
} from "lucide-react";

const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2 MB

export default function Team() {
  const { user } = useAuth();
  const { assignees, addAssignee, updateAssignee, updateAvatar, removeAssignee } =
    useAssignees();
  const { addNotification } = useNotifications();

  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [uploadingId, setUploadingId] = useState(null);

  // One hidden file input shared by all rows; targetRef tracks whose photo we're changing
  const fileInputRef = useRef(null);
  const uploadTargetRef = useRef(null);

  // Guard against direct URL access by non-admins (nav item is already hidden for them)
  if (user?.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
        <ShieldAlert size={40} className="text-slate-400" />
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          Admin access required
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">
          Only Admin accounts can manage team assignees.
        </p>
      </div>
    );
  }

  const handleAdd = () => {
    if (!newName.trim()) return;
    addAssignee(newName);
    setNewName("");
  };

  const startEdit = (assignee) => {
    setEditingId(assignee.id);
    setEditingName(assignee.name);
  };

  const saveEdit = () => {
    if (editingId) updateAssignee(editingId, editingName);
    setEditingId(null);
    setEditingName("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  // --- Avatar upload ---

  const pickPhotoFor = (assignee) => {
    uploadTargetRef.current = assignee;
    fileInputRef.current?.click();
  };

  const handlePhotoSelected = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    const target = uploadTargetRef.current;
    uploadTargetRef.current = null;
    if (!file || !target) return;

    if (!file.type.startsWith("image/")) {
      addNotification("Please choose an image file", "error");
      return;
    }
    if (file.size > MAX_AVATAR_SIZE) {
      addNotification("Image must be smaller than 2 MB", "error");
      return;
    }

    setUploadingId(target.id);
    try {
      const publicUrl = await uploadAvatar(file, target.id);
      await updateAvatar(target.id, publicUrl);
      addNotification(`Photo updated for ${target.name}`, "success");
    } catch (err) {
      console.error("Avatar upload failed", err);
      addNotification("Photo upload failed — check Supabase Storage setup", "error");
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <div className="space-y-6 pr-4 max-w-2xl">

      {/* Shared hidden file input for avatar uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoSelected}
        className="hidden"
      />

      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Users size={24} /> Team
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Manage who incidents can be assigned to
        </p>
      </div>

      {/* ADD NEW */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl">
        <label className="block mb-2 text-sm font-medium text-slate-600 dark:text-slate-400">
          Add team member
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Full name"
            className="flex-1 p-3 rounded-xl border bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button
            onClick={handleAdd}
            disabled={!newName.trim()}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium transition"
          >
            <Plus size={18} /> Add
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
          You can add a photo after creating the member.
        </p>
      </div>

      {/* LIST */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {assignees.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
            No team members yet — add one above.
          </div>
        ) : (
          <ul className="divide-y divide-slate-200 dark:divide-slate-800">
            {assignees.map((assignee) => (
              <li key={assignee.id} className="flex items-center gap-3 p-4">

                {/* AVATAR + CHANGE PHOTO */}
                <button
                  onClick={() => pickPhotoFor(assignee)}
                  disabled={uploadingId === assignee.id}
                  title="Change photo"
                  className="relative group flex-shrink-0 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  <Avatar
                    name={assignee.name}
                    avatarUrl={assignee.avatar_url}
                    size={36}
                  />
                  <span
                    className="absolute inset-0 rounded-full flex items-center justify-center
                      bg-slate-900/60 text-white opacity-0 group-hover:opacity-100 transition"
                  >
                    {uploadingId === assignee.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Camera size={14} />
                    )}
                  </span>
                </button>

                {editingId === assignee.id ? (
                  <>
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                      autoFocus
                      className="flex-1 p-2 rounded-lg border bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                    <button
                      onClick={saveEdit}
                      className="p-2 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition"
                    >
                      <Check size={18} />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      <X size={18} />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-sm text-slate-900 dark:text-white">
                      {assignee.name}
                    </span>
                    <button
                      onClick={() => startEdit(assignee)}
                      className="p-2 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => removeAssignee(assignee.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
