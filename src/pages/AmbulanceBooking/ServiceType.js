import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Zap, Truck, Heart, AlertTriangle } from "react-feather";

export default function ServiceType({
  formData,
  onServiceTypeChange,
}) {
  const serviceTypes = [
    {
      id: "Emergency",
      title: "Emergency Service",
      subtitle: "Medical emergency response",
      icon: <Zap size={32} className="text-danger" />,
      description: "Immediate medical emergency response with trained paramedics",
      features: [
        "24/7 availability",
        "Paramedic-equipped ambulance",
        "Emergency medical equipment",
        "Direct hospital coordination",
        "Priority response time",
        "Life support systems"
      ],
      responseTime: "5-15 minutes",
      color: "danger"
    },
    {
      id: "Transport",
      title: "Patient Transport",
      subtitle: "Non-emergency medical transport",
      icon: <Truck size={32} className="text-primary" />,
      description: "Safe and comfortable transport for non-emergency medical needs",
      features: [
        "Scheduled transport service",
        "Comfortable patient transport",
        "Basic medical monitoring",
        "Wheelchair accessibility",
        "Trained medical attendant",
        "Insurance coordination"
      ],
      responseTime: "30-60 minutes",
      color: "primary"
    }
  ];

  const ServiceCard = ({ service }) => {
    const isSelected = formData.appointmentType === service.id;
    
    return (
      <Col lg={6} md={6} className="mb-4">
        <Card 
          className={`service-card h-100 ${isSelected ? 'selected-service' : ''}`}
          style={{ 
            cursor: 'pointer',
            border: isSelected ? `2px solid var(--bs-${service.color})` : '1px solid #e0e0e0',
            transition: 'all 0.3s ease'
          }}
          onClick={() => onServiceTypeChange(service.id)}
        >
          <Card.Body className="d-flex flex-column">
            <div className="service-header text-center mb-3">
              <div className="service-icon mb-2">
                {service.icon}
              </div>
              <h4 className="service-title">{service.title}</h4>
              <p className="service-subtitle text-muted">{service.subtitle}</p>
            </div>
            
            <div className="service-description mb-3">
              <p className="text-muted">{service.description}</p>
            </div>
            
            <div className="service-features flex-grow-1">
              <h6 className="mb-2">Features:</h6>
              <ul className="feature-list">
                {service.features.map((feature, index) => (
                  <li key={index} className="feature-item">
                    <i className="fas fa-check text-success me-2"></i>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="service-response-time mt-3">
              <div className={`alert alert-${service.color} alert-sm`}>
                <AlertTriangle size={16} className="me-2" />
                <strong>Response Time:</strong> {service.responseTime}
              </div>
            </div>
            
            <div className="service-action mt-2">
              <div className={`btn btn-${isSelected ? service.color : 'outline-' + service.color} w-100`}>
                {isSelected ? (
                  <>
                    <i className="fas fa-check me-2"></i>
                    Selected
                  </>
                ) : (
                  <>
                    Select {service.title}
                  </>
                )}
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    );
  };

  return (
    <Container>
      <div className="service-type-header mb-4">
        <h4 className="service-title">Select Service Type</h4>
        <p className="service-subtitle text-muted">
          Choose the type of ambulance service you need
        </p>
      </div>
      
      <Row className="justify-content-center">
        {serviceTypes.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </Row>
      
      {/* Important Information */}
      <Row className="mt-4">
        <Col lg={12}>
          <Card className="info-card">
            <Card.Body>
              <h6 className="mb-3">
                <Heart size={20} className="text-danger me-2" />
                Important Information
              </h6>
              <ul className="info-list">
                <li>
                  <strong>Emergency Service:</strong> For life-threatening situations, chest pain, difficulty breathing, severe injuries, or unconsciousness.
                </li>
                <li>
                  <strong>Transport Service:</strong> For scheduled hospital visits, discharge transport, or non-urgent medical transfers.
                </li>
                <li>
                  <strong>Payment:</strong> Emergency services may require immediate payment or insurance verification.
                </li>
                <li>
                  <strong>Cancellation:</strong> Please cancel at least 30 minutes before scheduled time for transport services.
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <style jsx>{`
        .service-card {
          transition: all 0.3s ease;
        }
        .service-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .selected-service {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        }
        .feature-list {
          list-style: none;
          padding: 0;
        }
        .feature-item {
          padding: 2px 0;
          font-size: 0.9rem;
        }
        .service-icon {
          padding: 10px;
        }
        .info-list {
          margin-bottom: 0;
        }
        .info-list li {
          margin-bottom: 8px;
          font-size: 0.9rem;
        }
        .alert-sm {
          padding: 8px 12px;
          font-size: 0.875rem;
        }
      `}</style>
    </Container>
  );
} 