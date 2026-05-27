import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function HallManagement() {
  const { isAuthenticated, jwtToken } = useAuth();

  const [halls, setHalls] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    id: null,
    name: "",
    description: "",
    location: "",
    capacity: "",
    hasProjector: false,
    hasAc: false,
    hasWhiteboard: false,
  });

  // 🔐 FIXED: Create config dynamically to get current token
  const getConfig = () => {
    if (!jwtToken) {
      console.error("No JWT token available");
      return null;
    }
    return {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };
  };

  // 🔄 LOAD HALLS
  async function loadHalls() {
    if (!isAuthenticated || !jwtToken) {
      console.log("Not authenticated or no token");
      return;
    }

    setLoading(true);
    try {
      const config = getConfig();
      if (!config) {
        toast.error("Authentication error");
        return;
      }

      console.log("Loading halls with token:", jwtToken.substring(0, 50) + "...");
      
      const response = await axios.get(
        "http://203.94.72.18/trainee/api/production/hall/get/all/active",
        config
      );
      setHalls(response.data);
      toast.success("Halls loaded successfully");
    } catch (err) {
      console.error("Error loading halls:", err);
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else {
        toast.error("Failed to load halls");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(function () {
    if (isAuthenticated && jwtToken) {
      loadHalls();
    }
  }, [isAuthenticated, jwtToken]);

  // ✍️ INPUT CHANGE
  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  // 💾 SAVE / UPDATE
  async function handleSubmit(e) {
    e.preventDefault();

    // Validate required fields
    if (!form.name || !form.location || !form.capacity) {
      toast.error("Name, Location, and Capacity are required");
      return;
    }

    if (!isAuthenticated || !jwtToken) {
      toast.error("Please login to perform this action");
      return;
    }

    try {
      const config = getConfig();
      if (!config) {
        toast.error("Authentication error");
        return;
      }

      if (isEdit) {
        if (!form.id) {
          toast.error("Invalid hall data for update");
          return;
        }
        await axios.post(
          "http://203.94.72.18/trainee/api/production/hall/update",
          form,
          config
        );
        toast.success("Hall updated successfully");
      } else {
        // Don't send id for new hall
        const { id, ...newHall } = form;
        await axios.post(
          "http://203.94.72.18/trainee/api/production/hall/save",
          newHall,
          config
        );
        toast.success("Hall saved successfully");
      }

      resetForm();
      await loadHalls();
    } catch (err) {
      console.error("Save/Update error:", err);
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else if (err.response?.status === 400) {
        toast.error(err.response?.data?.message || "Invalid data provided");
      } else {
        toast.error("Failed to save hall");
      }
    }
  }

  // ✏️ EDIT
  function handleEdit(hall) {
    setForm({
      id: hall.id,
      name: hall.name || "",
      description: hall.description || "",
      location: hall.location || "",
      capacity: hall.capacity || "",
      hasProjector: hall.hasProjector || false,
      hasAc: hall.hasAc || false,
      hasWhiteboard: hall.hasWhiteboard || false,
    });
    setIsEdit(true);
  }

  // 🔄 RESET
  function resetForm() {
    setForm({
      id: null,
      name: "",
      description: "",
      location: "",
      capacity: "",
      hasProjector: false,
      hasAc: false,
      hasWhiteboard: false,
    });
    setIsEdit(false);
  }

  // Check authentication
  if (!isAuthenticated) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Please login to access Hall Management</p>
      </div>
    );
  }

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* FORM */}
      <div className="border p-4 rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-4">
          {isEdit ? "Update Hall" : "Create Hall"}
        </h1>

        <form onSubmit={handleSubmit}>
          <input
            className="w-full p-2 border mb-3 rounded"
            placeholder="Name *"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            className="w-full p-2 border mb-3 rounded"
            placeholder="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
          />

          <input
            className="w-full p-2 border mb-3 rounded"
            placeholder="Location *"
            name="location"
            value={form.location}
            onChange={handleChange}
            required
          />

          <input
            className="w-full p-2 border mb-3 rounded"
            placeholder="Capacity *"
            type="number"
            name="capacity"
            value={form.capacity}
            onChange={handleChange}
            required
          />

          {/* CHECKBOXES */}
          <div className="mb-3 space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="hasProjector"
                checked={form.hasProjector}
                onChange={handleChange}
              />
              Has Projector
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="hasAc"
                checked={form.hasAc}
                onChange={handleChange}
              />
              Has AC
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="hasWhiteboard"
                checked={form.hasWhiteboard}
                onChange={handleChange}
              />
              Has Whiteboard
            </label>
          </div>

          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded w-full hover:bg-gray-800"
          >
            {isEdit ? "Update" : "Save"}
          </button>

          {isEdit && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-4 py-2 rounded w-full mt-2 hover:bg-gray-500"
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* TABLE */}
      <div className="border p-4 rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-4">Halls</h1>
        
        {loading ? (
          <div className="text-center py-4">Loading halls...</div>
        ) : halls.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No halls found</div>
        ) : (
          halls.map(function (hall) {
            return (
              <div key={hall.id} className="border p-3 rounded mb-2 shadow-sm">
                <h2 className="font-bold">{hall.name}</h2>
                <p>Location: {hall.location}</p>
                <p>Capacity: {hall.capacity}</p>
                <div className="flex gap-2 mt-1 text-sm text-gray-600">
                  {hall.hasProjector && <span>📽️ Projector</span>}
                  {hall.hasAc && <span>❄️ AC</span>}
                  {hall.hasWhiteboard && <span>📝 Whiteboard</span>}
                </div>
                <button
                  onClick={() => handleEdit(hall)}
                  className="bg-green-500 text-white px-3 py-1 rounded mt-2 hover:bg-green-600"
                >
                  Update
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default HallManagement;