import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Home, MapPin, Clock, User, Shield, Truck } from "react-feather";

export default function CollectionType({
  formData,
  onCollectionTypeChange,
  onPreferredTimeChange,
}) {
  const collectionTypes = [
    {
      id: "Lab",
      title: "Lab Visit",
      subtitle: "Visit our laboratory",
      icon: <MapPin size={32} />,
      description: "Visit our fully equipped laboratory for sample collection",
      features: [
        "Immediate sample collection",
        "Professional lab environment",
        "All test types available",
        "Instant report generation",
        "No additional charges",
        "Experienced technicians"
      ],
      timeSlots: [
        "8:00 AM - 10:00 AM",
        "10:00 AM - 12:00 PM",
        "12:00 PM - 2:00 PM",
        "2:00 PM - 4:00 PM",
        "4:00 PM - 6:00 PM",
        "6:00 PM - 8:00 PM"
      ]
    },
    {
      id: "Home Collection",
      title: "Home Collection",
      subtitle: "We come to you",
      icon: <Home size={32} />,
      description: "Our trained phlebotomist will visit your home for sample collection",
      features: [
        "Convenient home service",
        "Trained phlebotomist",
        "Safe sample handling",
        "Contactless collection",
        "Flexible timing",
        "Additional service charges apply"
      ],
      timeSlots: [
        "7:00 AM - 9:00 AM",
        "9:00 AM - 11:00 AM",
        "11:00 AM - 1:00 PM",
        "2:00 PM - 4:00 PM",
        "4:00 PM - 6:00 PM",
        "6:00 PM - 8:00 PM"
      ]
    }
  ];

  return (
    <Container>
      <style jsx>{`
        .collection-type-container {
          padding: 20px 0;
        }
        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 30px;
          text-align: center;
          border-bottom: 3px solid #4e73df;
          padding-bottom: 10px;
        }
        .collection-card {
          border: 2px solid #e3e6f0;
          border-radius: 12px;
          padding: 25px;
          margin-bottom: 20px;
          transition: all 0.3s ease;
          cursor: pointer;
          height: 100%;
        }
        .collection-card:hover {
          border-color: #4e73df;
          box-shadow: 0 4px 12px rgba(78, 115, 223, 0.15);
          transform: translateY(-2px);
        }
        .collection-card.selected {
          border-color: #28a745;
          background: #f8fff9;
          box-shadow: 0 4px 12px rgba(40, 167, 69, 0.15);
        }
        .collection-header {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
        }
        .collection-icon {
          background: #4e73df;
          color: white;
          padding: 12px;
          border-radius: 50%;
          margin-right: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .collection-card.selected .collection-icon {
          background: #28a745;
        }
        .collection-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #2c3e50;
          margin: 0;
        }
        .collection-subtitle {
          font-size: 0.875rem;
          color: #6c757d;
          margin: 0;
        }
        .collection-description {
          color: #495057;
          margin-bottom: 20px;
          line-height: 1.5;
        }
        .features-list {
          list-style: none;
          padding: 0;
          margin-bottom: 20px;
        }
        .features-list li {
          padding: 5px 0;
          display: flex;
          align-items: center;
          font-size: 0.875rem;
          color: #495057;
        }
        .features-list li:before {
          content: "✓";
          color: #28a745;
          font-weight: bold;
          margin-right: 10px;
        }
        .time-slots-section {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e3e6f0;
        }
        .time-slots-title {
          font-size: 1rem;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
        }
        .time-slots-title .icon {
          margin-right: 8px;
          color: #4e73df;
        }
        .time-slots-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 10px;
        }
        .time-slot-btn {
          padding: 8px 12px;
          border: 1px solid #d1d3e2;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          text-align: center;
          font-size: 0.75rem;
          transition: all 0.2s ease;
        }
        .time-slot-btn:hover {
          border-color: #4e73df;
          background: #f8f9fc;
        }
        .time-slot-btn.selected {
          border-color: #28a745;
          background: #d4edda;
          color: #155724;
        }
        .collection-radio {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }
        .additional-info {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 6px;
          padding: 15px;
          margin-top: 20px;
        }
        .additional-info.home-collection {
          background: #d1ecf1;
          border-color: #bee5eb;
        }
        .additional-info h6 {
          margin: 0 0 10px 0;
          color: #856404;
          display: flex;
          align-items: center;
        }
        .additional-info.home-collection h6 {
          color: #0c5460;
        }
        .additional-info .icon {
          margin-right: 8px;
        }
        .additional-info ul {
          margin: 0;
          padding-left: 20px;
        }
        .additional-info li {
          font-size: 0.875rem;
          color: #856404;
          margin-bottom: 5px;
        }
        .additional-info.home-collection li {
          color: #0c5460;
        }
        .selection-indicator {
          position: absolute;
          top: 15px;
          right: 15px;
          background: #28a745;
          color: white;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: bold;
        }
      `}</style>

      <div className="collection-type-container">
        <h4 className="section-title">Choose Sample Collection Method</h4>

        <Row>
          {collectionTypes.map((type) => (
            <Col lg="6" md="6" key={type.id}>
              <div
                className={`collection-card ${
                  formData.appointmentType === type.id ? "selected" : ""
                }`}
                onClick={() => onCollectionTypeChange(type.id)}
              >
                <input
                  type="radio"
                  className="collection-radio"
                  name="collectionType"
                  value={type.id}
                  checked={formData.appointmentType === type.id}
                  onChange={() => onCollectionTypeChange(type.id)}
                />
                
                {formData.appointmentType === type.id && (
                  <div className="selection-indicator">✓</div>
                )}

                <div className="collection-header">
                  <div className="collection-icon">
                    {type.icon}
                  </div>
                  <div>
                    <h5 className="collection-title">{type.title}</h5>
                    <p className="collection-subtitle">{type.subtitle}</p>
                  </div>
                </div>

                <p className="collection-description">{type.description}</p>

                <ul className="features-list">
                  {type.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>

                <div className="time-slots-section">
                  <h6 className="time-slots-title">
                    <Clock size={16} className="icon" />
                    Available Time Slots
                  </h6>
                  <div className="time-slots-grid">
                    {type.timeSlots.map((slot, index) => (
                      <div
                        key={index}
                        className={`time-slot-btn ${
                          formData.time === slot ? "selected" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onPreferredTimeChange({ target: { value: slot } });
                        }}
                      >
                        {slot}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        {/* Additional Information */}
        {formData.appointmentType === "Lab" && (
          <div className="additional-info">
            <h6>
              <MapPin size={16} className="icon" />
              Lab Visit Information
            </h6>
            <ul>
              <li>Please bring a valid ID proof</li>
              <li>Arrive 15 minutes before your scheduled time</li>
              <li>Follow fasting instructions if applicable</li>
              <li>Parking is available at the facility</li>
              <li>COVID-19 safety protocols are in place</li>
            </ul>
          </div>
        )}

        {formData.appointmentType === "Home Collection" && (
          <div className="additional-info home-collection">
            <h6>
              <Home size={16} className="icon" />
              Home Collection Information
            </h6>
            <ul>
              <li>Additional service charges: ₹150 - ₹300</li>
              <li>Our phlebotomist will call 30 minutes before arrival</li>
              <li>Please ensure someone is available at the given time</li>
              <li>Maintain fasting if required for your tests</li>
              <li>Have your ID proof ready for verification</li>
              <li>Service available within 25 km radius</li>
            </ul>
          </div>
        )}

        {formData.appointmentType && formData.time && (
          <div className="mt-4 p-3 bg-light border rounded">
            <h6 className="mb-2">
              <Shield size={16} className="me-2" />
              Booking Summary
            </h6>
            <p className="mb-1">
              <strong>Collection Method:</strong> {formData.appointmentType}
            </p>
            <p className="mb-1">
              <strong>Selected Time:</strong> {formData.time}
            </p>
            <p className="mb-0">
              <strong>Date:</strong> {new Date(formData.date).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </Container>
  );
} 