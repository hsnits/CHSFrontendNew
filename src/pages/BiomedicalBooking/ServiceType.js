import React, { useState } from 'react';

const ServiceType = ({ selectedServiceType, onNext, onBack, isLoading }) => {
  const [serviceType, setServiceType] = useState(selectedServiceType || '');

  const serviceOptions = [
    {
      id: 'maintenance',
      title: 'Preventive Maintenance',
      description: 'Regular maintenance and inspection of medical equipment',
      features: [
        'Scheduled maintenance visits',
        'Performance optimization',
        'Preventive care protocols',
        'Compliance documentation',
        'Equipment health reports'
      ],
      responseTime: '24-48 hours',
      pricing: 'Standard rates apply',
      icon: '🔧'
    },
    {
      id: 'repair',
      title: 'Equipment Repair',
      description: 'Diagnosis and repair of faulty medical equipment',
      features: [
        'Quick diagnostic assessment',
        'On-site repair services',
        'Genuine spare parts',
        'Post-repair testing',
        'Service warranty included'
      ],
      responseTime: '4-12 hours',
      pricing: 'Based on repair complexity',
      icon: '🛠️'
    },
    {
      id: 'installation',
      title: 'Equipment Installation',
      description: 'Professional installation and setup of new medical equipment',
      features: [
        'Professional installation',
        'System configuration',
        'Staff training included',
        'Compliance certification',
        'Complete documentation'
      ],
      responseTime: '1-3 days',
      pricing: 'Installation package rates',
      icon: '⚙️'
    },
    {
      id: 'calibration',
      title: 'Equipment Calibration',
      description: 'Precision calibration and accuracy verification',
      features: [
        'Precision calibration',
        'Accuracy verification',
        'Calibration certificates',
        'Compliance standards met',
        'Regular calibration schedules'
      ],
      responseTime: '2-4 hours',
      pricing: 'Per equipment rates',
      icon: '📏'
    },
    {
      id: 'inspection',
      title: 'Safety Inspection',
      description: 'Comprehensive safety and compliance inspection',
      features: [
        'Safety compliance check',
        'Performance evaluation',
        'Risk assessment',
        'Detailed inspection report',
        'Compliance certification'
      ],
      responseTime: '1-2 hours',
      pricing: 'Inspection package rates',
      icon: '🔍'
    },
    {
      id: 'emergency',
      title: 'Emergency Service',
      description: 'Immediate response for critical equipment failures',
      features: [
        'Immediate response',
        'Priority service',
        '24/7 availability',
        'Critical equipment focus',
        'Emergency repair protocols'
      ],
      responseTime: '30 minutes - 2 hours',
      pricing: 'Emergency service rates',
      icon: '🚨'
    }
  ];

  const handleServiceTypeSelect = (type) => {
    setServiceType(type);
  };

  const handleSubmit = () => {
    if (serviceType) {
      onNext(serviceType);
    }
  };

  return (
    <div className="service-type-step">
      <h3>Select Service Type</h3>
      <p className="step-description">
        Choose the type of biomedical service you need for your equipment
      </p>
      
      <div className="service-options">
        {serviceOptions.map((option) => (
          <div
            key={option.id}
            className={`service-option ${serviceType === option.id ? 'selected' : ''}`}
            onClick={() => handleServiceTypeSelect(option.id)}
          >
            <div className="service-header">
              <div className="service-icon">{option.icon}</div>
              <div className="service-title">
                <h4>{option.title}</h4>
                <p className="service-description">{option.description}</p>
              </div>
              <div className="service-select">
                <input
                  type="radio"
                  name="serviceType"
                  value={option.id}
                  checked={serviceType === option.id}
                  onChange={() => handleServiceTypeSelect(option.id)}
                />
              </div>
            </div>
            
            <div className="service-details">
              <div className="service-features">
                <h5>Service Features:</h5>
                <ul>
                  {option.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              
              <div className="service-info">
                <div className="response-time">
                  <strong>Response Time:</strong> {option.responseTime}
                </div>
                <div className="pricing">
                  <strong>Pricing:</strong> {option.pricing}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="service-note">
        <div className="alert alert-info">
          <strong>Note:</strong> All services include comprehensive documentation, 
          compliance with medical device regulations, and follow-up support. 
          Emergency services are available 24/7 for critical equipment failures.
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onBack} className="btn btn-secondary">
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!serviceType || isLoading}
          className="btn btn-primary"
        >
          {isLoading ? 'Booking...' : 'Book Biomedical Service'}
        </button>
      </div>

      <style jsx>{`
        .service-type-step {
          padding: 20px;
        }

        .step-description {
          margin-bottom: 30px;
          color: #666;
          font-size: 16px;
        }

        .service-options {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 30px;
        }

        .service-option {
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          background: white;
        }

        .service-option:hover {
          border-color: #007bff;
          box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
        }

        .service-option.selected {
          border-color: #007bff;
          background: #f8f9ff;
          box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
        }

        .service-header {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          margin-bottom: 15px;
        }

        .service-icon {
          font-size: 24px;
          min-width: 40px;
        }

        .service-title {
          flex: 1;
        }

        .service-title h4 {
          margin: 0 0 8px 0;
          color: #333;
          font-size: 18px;
          font-weight: 600;
        }

        .service-description {
          margin: 0;
          color: #666;
          font-size: 14px;
        }

        .service-select input[type="radio"] {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }

        .service-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #eee;
        }

        .service-features h5 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 14px;
          font-weight: 600;
        }

        .service-features ul {
          margin: 0;
          padding-left: 20px;
          color: #666;
          font-size: 13px;
        }

        .service-features li {
          margin-bottom: 4px;
        }

        .service-info {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .response-time,
        .pricing {
          font-size: 13px;
          color: #666;
        }

        .response-time strong,
        .pricing strong {
          color: #333;
        }

        .service-note {
          margin-bottom: 30px;
        }

        .alert {
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #bee5eb;
          background-color: #d1ecf1;
          color: #0c5460;
        }

        .alert-info {
          border-color: #bee5eb;
          background-color: #d1ecf1;
          color: #0c5460;
        }

        .form-actions {
          display: flex;
          gap: 15px;
          justify-content: flex-end;
        }

        .btn {
          padding: 10px 20px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn-secondary:hover {
          background: #5a6268;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #0056b3;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .service-details {
            grid-template-columns: 1fr;
            gap: 15px;
          }
          
          .service-header {
            flex-direction: column;
            gap: 10px;
          }
          
          .service-select {
            align-self: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default ServiceType; 