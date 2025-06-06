import React from "react";
import { X } from "lucide-react";

const PrescriptionDetailsModal = ({ prescription, onClose }) => {
  if (!prescription) return null;

  return (
    <div className="modal-overlay">
      <div className="prescription-details-modal">
        <div className="prescription-details-header">
          <h2>Prescription Details</h2>
          <button className="prescription-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="prescription-details-body">
          <table className="prescription-table">
            <thead>
              <tr>
                <th>Test Name</th>
                <th>Health Status</th>
                <th>Comments</th>
                <th>Prescription</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{prescription.testName || "--"}</td>
                <td>{prescription.healthStatus || "--"}</td>
                <td>{prescription.comments || "--"}</td>
                <td className="prescription-text-cell">
                  {prescription.prescriptionText || "--"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionDetailsModal;
