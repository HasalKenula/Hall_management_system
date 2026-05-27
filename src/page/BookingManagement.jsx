import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function BookingManagement() {
  const { isAuthenticated, jwtToken } = useAuth();
  
  const [bookings, setBookings] = useState([]);
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  
  const [form, setForm] = useState({
    id: null,
    reservedDate: "",
    startTime: "",
    endTime: "",
    bookingFor: "",
    expectedParticipants: "",
    specialRequirements: "",
    hall: {
      id: ""
    },
    requestedBy: {
      userId: ""
    }
  });

  // Get current user ID from login response
  const getCurrentUserId = () => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user.userId;
      } catch (e) {
        return "5c6d7e8f-1a2b-4c3d-9e0f-1a2b3c4d5e10";
      }
    }
    return "5c6d7e8f-1a2b-4c3d-9e0f-1a2b3c4d5e10";
  };

  // Get auth config
  const getConfig = () => {
    if (!jwtToken) {
      console.error("No JWT token available");
      return null;
    }
    return {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
    };
  };

  // Load all bookings
  async function loadBookings() {
    if (!isAuthenticated || !jwtToken) {
      return;
    }

    setLoading(true);
    try {
      const config = getConfig();
      if (!config) {
        toast.error("Authentication error");
        return;
      }

      const response = await axios.get(
        "http://203.94.72.18/trainee/api/production/booking/get/all/bookings",
        config
      );
      setBookings(response.data);
      toast.success("Bookings loaded successfully");
    } catch (err) {
      console.error("Error loading bookings:", err);
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else {
        toast.error("Failed to load bookings");
      }
    } finally {
      setLoading(false);
    }
  }

  // Load halls for dropdown
  async function loadHalls() {
    if (!isAuthenticated || !jwtToken) {
      return;
    }

    try {
      const config = getConfig();
      if (!config) {
        return;
      }

      const response = await axios.get(
        "http://203.94.72.18/trainee/api/production/hall/get/all/active",
        config
      );
      setHalls(response.data);
    } catch (err) {
      console.error("Error loading halls:", err);
      toast.error("Failed to load halls");
    }
  }

  useEffect(() => {
    if (isAuthenticated && jwtToken) {
      loadBookings();
      loadHalls();
    }
  }, [isAuthenticated, jwtToken]);

  // Handle input changes
  function handleChange(e) {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setForm({
        ...form,
        [parent]: {
          ...form[parent],
          [child]: value
        }
      });
    } else {
      setForm({
        ...form,
        [name]: value
      });
    }
  }

  // Format time to HH:MM:SS
  function formatTimeToSeconds(time) {
    if (!time) return null;
    // If time already has seconds, return as is
    if (time.split(':').length === 3) return time;
    // Add :00 seconds if not present
    return `${time}:00`;
  }

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();

    // Validate required fields
    if (!form.reservedDate || !form.startTime || !form.bookingFor || 
        !form.expectedParticipants || !form.hall.id) {
      toast.error("Reserved Date, Start Time, Booking For, Expected Participants, and Hall are required");
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

      // Prepare the data with correct format
      const bookingData = {
        reservedDate: form.reservedDate,
        startTime: formatTimeToSeconds(form.startTime),
        endTime: form.endTime ? formatTimeToSeconds(form.endTime) : null,
        bookingFor: form.bookingFor,
        expectedParticipants: parseInt(form.expectedParticipants),
        specialRequirements: form.specialRequirements || "",
        hall: {
          id: form.hall.id
        },
        requestedBy: {
          userId: getCurrentUserId()
        },
        createdAt: new Date().toISOString()
      };

      // Add id for update
      if (isEdit && form.id) {
        bookingData.id = form.id;
      }

      console.log("Sending booking data:", bookingData);

      let response;
      if (isEdit && form.id) {
        response = await axios.post(
          "http://203.94.72.18/trainee/api/production/booking/update",
          bookingData,
          config
        );
        toast.success("Booking updated successfully");
      } else {
        response = await axios.post(
          "http://203.94.72.18/trainee/api/production/booking/save",
          bookingData,
          config
        );
        toast.success("Booking created successfully");
      }

      console.log("API Response:", response.data);
      resetForm();
      await loadBookings();
    } catch (err) {
      console.error("Save/Update error:", err);
      if (err.response) {
        console.error("Error response data:", err.response.data);
        const errorMessage = err.response.data?.message || 
                           err.response.data?.error || 
                           "Failed to save booking";
        toast.error(errorMessage);
      } else {
        toast.error("Failed to save booking");
      }
    }
  }

  // Edit booking
  function handleEdit(booking) {
    // Extract time without seconds for display in input fields
    const startTimeWithoutSeconds = booking.startTime?.substring(0, 5) || "";
    const endTimeWithoutSeconds = booking.endTime?.substring(0, 5) || "";
    
    setForm({
      id: booking.id,
      reservedDate: booking.reservedDate?.split('T')[0] || "",
      startTime: startTimeWithoutSeconds,
      endTime: endTimeWithoutSeconds,
      bookingFor: booking.bookingFor || "",
      expectedParticipants: booking.expectedParticipants || "",
      specialRequirements: booking.specialRequirements || "",
      hall: {
        id: booking.hall?.id || ""
      },
      requestedBy: {
        userId: booking.requestedBy?.userId || getCurrentUserId()
      }
    });
    setIsEdit(true);
  }

  // Delete booking
  async function handleDelete(bookingId) {
    if (!window.confirm("Are you sure you want to delete this booking?")) {
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

      await axios.delete(
        `http://203.94.72.18/trainee/api/production/booking/delete/${bookingId}`,
        config
      );
      toast.success("Booking deleted successfully");
      await loadBookings();
    } catch (err) {
      console.error("Delete error:", err);
      if (err.response?.status === 404) {
        toast.error("Booking not found");
      } else {
        toast.error("Failed to delete booking");
      }
    }
  }

  // Reset form
  function resetForm() {
    setForm({
      id: null,
      reservedDate: "",
      startTime: "",
      endTime: "",
      bookingFor: "",
      expectedParticipants: "",
      specialRequirements: "",
      hall: {
        id: ""
      },
      requestedBy: {
        userId: getCurrentUserId()
      }
    });
    setIsEdit(false);
  }

  // Format date for display
  function formatDate(dateString) {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  }

  // Format time for display (remove seconds)
  function formatTime(timeString) {
    if (!timeString) return "N/A";
    return timeString.substring(0, 5);
  }

  // Check authentication
  if (!isAuthenticated) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Please login to access Booking Management</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* FORM SECTION */}
        <div className="border p-6 rounded-lg shadow-lg bg-white">
          <h1 className="text-2xl font-bold mb-6">
            {isEdit ? "Update Booking" : "Create New Booking"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Reserved Date *</label>
              <input
                type="date"
                name="reservedDate"
                value={form.reservedDate}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Start Time *</label>
                <input
                  type="time"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Format: HH:MM (seconds will be added automatically)</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End Time</label>
                <input
                  type="time"
                  name="endTime"
                  value={form.endTime}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-1">Format: HH:MM (seconds will be added automatically)</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Booking For *</label>
              <input
                type="text"
                name="bookingFor"
                value={form.bookingFor}
                onChange={handleChange}
                placeholder="e.g., Conference, Meeting, Workshop"
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Expected Participants *</label>
              <input
                type="number"
                name="expectedParticipants"
                value={form.expectedParticipants}
                onChange={handleChange}
                placeholder="Number of participants"
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Select Hall *</label>
              <select
                name="hall.id"
                value={form.hall.id}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                required
              >
                <option value="">Select a hall</option>
                {halls.map((hall) => (
                  <option key={hall.id} value={hall.id}>
                    {hall.name} - {hall.location} (Capacity: {hall.capacity})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Special Requirements</label>
              <textarea
                name="specialRequirements"
                value={form.specialRequirements}
                onChange={handleChange}
                rows="3"
                placeholder="Any special requirements or notes..."
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
              >
                {isEdit ? "Update Booking" : "Create Booking"}
              </button>
              
              {isEdit && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 font-medium"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* BOOKINGS LIST SECTION */}
        <div className="border p-6 rounded-lg shadow-lg bg-white overflow-auto">
          <h1 className="text-2xl font-bold mb-6">Bookings List</h1>
          
          {loading ? (
            <div className="text-center py-8">Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No bookings found</div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">{booking.bookingFor}</h3>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-semibold">Date:</span> {formatDate(booking.reservedDate)}
                        </div>
                        <div>
                          <span className="font-semibold">Time:</span> {formatTime(booking.startTime)} 
                          {booking.endTime && ` - ${formatTime(booking.endTime)}`}
                        </div>
                        <div>
                          <span className="font-semibold">Hall:</span> {booking.hall?.name || "N/A"}
                        </div>
                        <div>
                          <span className="font-semibold">Location:</span> {booking.hall?.location || "N/A"}
                        </div>
                        <div>
                          <span className="font-semibold">Participants:</span> {booking.expectedParticipants}
                        </div>
                        <div>
                          <span className="font-semibold">Status:</span> 
                          <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                            booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                            booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.status || 'CONFIRMED'}
                          </span>
                        </div>
                      </div>
                      
                      {booking.specialRequirements && (
                        <div className="mt-2 text-sm">
                          <span className="font-semibold">Requirements:</span> {booking.specialRequirements}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(booking)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(booking.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingManagement;