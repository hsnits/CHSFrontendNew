import React, { useState, useEffect } from 'react';
import { getDataAPI, postDataAPI } from '../../helpers/axiosInstance';
import { toast } from 'react-toastify';
import { getLocalStorage } from '../../helpers/storage';
import { STORAGE } from '../../constants/Storage';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const user = getLocalStorage(STORAGE.USER_KEY);
      
      // Extract profile ID correctly - profile is an object, not a string
      const profileId = user?.profile?._id;
      
      if (!profileId) {
        toast.error('No ambulance profile found');
        return;
      }
      
      const response = await getDataAPI(`/ambulance/appointments?profileId=${profileId}`);
      
      if (response.data.success) {
        setAppointments(response.data.data);
      } else {
        toast.error('Failed to load appointments');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      const response = await postDataAPI('/api/ambulance/appointments/update-status', {
        appointmentId,
        status: newStatus
      });
      
      if (response.data.success) {
        setAppointments(prev => 
          prev.map(appointment => 
            appointment._id === appointmentId 
              ? { ...appointment, status: newStatus }
              : appointment
          )
        );
        toast.success(`Appointment ${newStatus} successfully`);
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast.error('Failed to update appointment status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'confirmed': return '#28a745';
      case 'completed': return '#007bff';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesFilter = filter === 'all' || appointment.status === filter;
    const matchesSearch = 
      appointment.patientDetails?.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patientDetails?.phoneNumber?.includes(searchTerm) ||
      appointment._id.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return <div className="loading">Loading appointments...</div>;
  }

  return (
    <div className="appointments-container">
      <div className="appointments-header">
        <h2>Ambulance Appointments</h2>
        <div className="header-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by patient name, phone, or booking ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending
            </button>
            <button 
              className={`filter-tab ${filter === 'confirmed' ? 'active' : ''}`}
              onClick={() => setFilter('confirmed')}
            >
              Confirmed
            </button>
            <button 
              className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
            <button 
              className={`filter-tab ${filter === 'cancelled' ? 'active' : ''}`}
              onClick={() => setFilter('cancelled')}
            >
              Cancelled
            </button>
          </div>
        </div>
      </div>

      <div className="appointments-list">
        {filteredAppointments.map((appointment) => (
          <div key={appointment._id} className="appointment-card">
            <div className="appointment-header">
              <div className="appointment-id">
                Booking ID: #{appointment._id.slice(-6)}
              </div>
              <div className="appointment-status">
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(appointment.status) }}
                >
                  {appointment.status}
                </span>
              </div>
            </div>

            <div className="appointment-content">
              <div className="patient-info">
                <h4>{appointment.patientDetails?.patientName}</h4>
                <p>📞 {appointment.patientDetails?.phoneNumber}</p>
                <p>📍 From: {appointment.patientDetails?.pickupLocation}</p>
                <p>🏥 To: {appointment.patientDetails?.dropLocation}</p>
              </div>

              <div className="appointment-details">
                <div className="detail-item">
                  <strong>Date & Time:</strong>
                  <span>
                    {new Date(appointment.appointmentDate).toLocaleDateString()} 
                    {appointment.appointmentTime !== 'ASAP' ? ` at ${appointment.appointmentTime}` : ' (ASAP)'}
                  </span>
                </div>
                <div className="detail-item">
                  <strong>Service Type:</strong>
                  <span className={`service-type ${appointment.serviceType}`}>
                    {appointment.serviceType}
                  </span>
                </div>
                <div className="detail-item">
                  <strong>Urgency:</strong>
                  <span className={`urgency ${appointment.patientDetails?.urgencyLevel?.toLowerCase()}`}>
                    {appointment.patientDetails?.urgencyLevel}
                  </span>
                </div>
                <div className="detail-item">
                  <strong>Ambulance Type:</strong>
                  <span>{appointment.patientDetails?.ambulanceType || 'Basic'}</span>
                </div>
              </div>

              <div className="medical-info">
                <div className="detail-item">
                  <strong>Medical Condition:</strong>
                  <span>{appointment.patientDetails?.medicalCondition || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <strong>Emergency Contact:</strong>
                  <span>{appointment.patientDetails?.emergencyContact}</span>
                </div>
              </div>
            </div>

            <div className="appointment-actions">
              {appointment.status === 'pending' && (
                <>
                  <button 
                    className="btn btn-success"
                    onClick={() => updateAppointmentStatus(appointment._id, 'confirmed')}
                  >
                    Confirm
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => updateAppointmentStatus(appointment._id, 'cancelled')}
                  >
                    Cancel
                  </button>
                </>
              )}
              {appointment.status === 'confirmed' && (
                <button 
                  className="btn btn-primary"
                  onClick={() => updateAppointmentStatus(appointment._id, 'completed')}
                >
                  Mark Completed
                </button>
              )}
              <button className="btn btn-outline">View Details</button>
            </div>
          </div>
        ))}

        {filteredAppointments.length === 0 && (
          <div className="no-appointments">
            <p>No appointments found</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .appointments-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .appointments-header {
          margin-bottom: 30px;
        }

        .appointments-header h2 {
          color: #333;
          margin: 0 0 20px 0;
          font-size: 28px;
        }

        .header-actions {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .search-box {
          flex: 1;
          min-width: 300px;
        }

        .search-input {
          width: 100%;
          padding: 10px 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
        }

        .filter-tabs {
          display: flex;
          gap: 10px;
        }

        .filter-tab {
          padding: 8px 16px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .filter-tab:hover {
          background: #f8f9fa;
        }

        .filter-tab.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .appointments-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .appointment-card {
          background: white;
          border-radius: 12px;
          padding: 25px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .appointment-card:hover {
          transform: translateY(-2px);
        }

        .appointment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #eee;
        }

        .appointment-id {
          font-weight: 600;
          color: #333;
          font-size: 16px;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          color: white;
          font-size: 12px;
          font-weight: 500;
          text-transform: capitalize;
        }

        .appointment-content {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 25px;
          margin-bottom: 20px;
        }

        .patient-info h4 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 18px;
        }

        .patient-info p {
          margin: 5px 0;
          color: #666;
          font-size: 14px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          margin-bottom: 10px;
        }

        .detail-item strong {
          color: #333;
          font-size: 13px;
          margin-bottom: 3px;
        }

        .detail-item span {
          color: #666;
          font-size: 14px;
        }

        .service-type {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          text-transform: capitalize;
        }

        .service-type.emergency {
          background: #ff6b6b;
          color: white;
        }

        .service-type.transport {
          background: #4ecdc4;
          color: white;
        }

        .urgency {
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .urgency.low {
          background: #d4edda;
          color: #155724;
        }

        .urgency.medium {
          background: #fff3cd;
          color: #856404;
        }

        .urgency.high {
          background: #f8d7da;
          color: #721c24;
        }

        .urgency.critical {
          background: #dc3545;
          color: white;
        }

        .appointment-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .btn-success {
          background: #28a745;
          color: white;
        }

        .btn-success:hover {
          background: #218838;
        }

        .btn-danger {
          background: #dc3545;
          color: white;
        }

        .btn-danger:hover {
          background: #c82333;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn-primary:hover {
          background: #0056b3;
        }

        .btn-outline {
          background: white;
          color: #007bff;
          border: 1px solid #007bff;
        }

        .btn-outline:hover {
          background: #007bff;
          color: white;
        }

        .no-appointments {
          text-align: center;
          padding: 60px;
          color: #666;
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        @media (max-width: 768px) {
          .header-actions {
            flex-direction: column;
          }
          
          .search-box {
            min-width: auto;
          }
          
          .filter-tabs {
            flex-wrap: wrap;
          }
          
          .appointment-content {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .appointment-actions {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Appointments; 