import React, { useState } from 'react';

const ServiceType = ({ selectedServiceType, onNext, onBack, isLoading }) => {
  const [serviceType, setServiceType] = useState(selectedServiceType || '');

  const serviceOptions = [
    {
      id: 'consultation',
      title: 'OPD Consultation',
      description: 'Outpatient consultation with specialist doctors',
      features: [
        'Specialist doctor consultation',
        'Medical diagnosis and advice',
        'Prescription and treatment plan',
        'Follow-up recommendations',
        'Medical certificate if needed'
      ],
      duration: '30-45 minutes',
      pricing: '₹500 - ₹2,000',
      icon: '👨‍⚕️'
    },
    {
      id: 'admission',
      title: 'Patient Admission',
      description: 'Inpatient admission with room and medical care',
      features: [
        'Private/shared room accommodation',
        'Nursing care 24/7',
        'Doctor rounds and monitoring',
        'Medication administration',
        'Meal service included'
      ],
      duration: 'As per medical requirement',
      pricing: '₹2,000 - ₹10,000/day',
      icon: '🏥'
    },
    {
      id: 'surgery',
      title: 'Surgical Procedures',
      description: 'Planned surgical procedures with pre/post-operative care',
      features: [
        'Pre-operative assessment',
        'Surgical procedure',
        'Post-operative monitoring',
        'ICU care if required',
        'Discharge planning'
      ],
      duration: '1-7 days',
      pricing: '₹15,000 - ₹5,00,000',
      icon: '🔬'
    },
    {
      id: 'emergency',
      title: 'Emergency Services',
      description: 'Immediate medical attention for emergencies',
      features: [
        'Immediate triage and assessment',
        'Emergency treatment',
        'Trauma care',
        'Critical care monitoring',
        'Stabilization procedures'
      ],
      duration: 'Immediate response',
      pricing: '₹1,000 - ₹50,000',
      icon: '🚨'
    },
    {
      id: 'diagnostic',
      title: 'Diagnostic Services',
      description: 'Comprehensive diagnostic tests and imaging',
      features: [
        'Laboratory tests',
        'Radiology services (X-ray, CT, MRI)',
        'Cardiac diagnostics (ECG, Echo)',
        'Endoscopy procedures',
        'Biopsy services'
      ],
      duration: '1-4 hours',
      pricing: '₹200 - ₹15,000',
      icon: '🔍'
    },
    {
      id: 'health-checkup',
      title: 'Health Checkup Packages',
      description: 'Comprehensive health screening and wellness packages',
      features: [
        'Complete health assessment',
        'Preventive screening tests',
        'Specialist consultations',
        'Detailed health report',
        'Lifestyle recommendations'
      ],
      duration: '2-4 hours',
      pricing: '₹3,000 - ₹25,000',
      icon: '📋'
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
      <h3>Select Service Package</h3>
      <p className="step-description">
        Choose the hospital service package that best fits your medical needs
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
                <h5>Service Includes:</h5>
                <ul>
                  {option.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              
              <div className="service-info">
                <div className="duration">
                  <strong>Duration:</strong> {option.duration}
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
          <strong>Note:</strong> All services include comprehensive medical care, 
          qualified medical staff, and adherence to medical protocols. 
          Emergency services are available 24/7. Pricing may vary based on 
          specific requirements and insurance coverage.
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
          {isLoading ? 'Booking...' : 'Book Hospital Service'}
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

        .duration,
        .pricing {
          font-size: 13px;
          color: #666;
        }

        .duration strong,
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