import { Modal, Button, Spinner } from "react-bootstrap";
import RemoveIcon from "../../assets/images/remove-icon.gif";

const DeleteModal = ({
  type = "delete",
  loading,
  isOpen,
  onClose,
  title,
  onConfirm,
}) => {
  return (
    <Modal show={isOpen} onHide={onClose} centered backdrop="static">
      <Modal.Body className="text-center p-4">
        <div className="d-flex justify-content-center">
          {type == "delete" && (
            <img width={100} height={100} src={RemoveIcon} alt="Delete Icon" />
          )}
        </div>
        <h4 className="mt-3">{title}</h4>
        {type == "delete" ? (
          <div className="d-flex justify-content-center gap-3 mt-4">
            <Button variant="danger" onClick={onConfirm} disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Delete"}
            </Button>
            <Button variant="secondary" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
          </div>
        ) : (
          <div className="d-flex justify-content-center gap-3 mt-4">
            <Button variant="danger" onClick={onConfirm} disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Confirm"}
            </Button>
            <Button variant="secondary" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default DeleteModal;
