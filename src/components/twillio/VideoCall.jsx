import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DoctorCall from "./ex/DoctorCall";
import { STORAGE } from "../../constants";
import { getLocalStorage } from "../../helpers/storage";

const VideoCall = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userRole = getLocalStorage(STORAGE.USER_KEY)?.role;

  const { patientId, doctorId, appointmentId, mode } = location.state || {};

  useEffect(() => {
    if (!patientId || !doctorId || !appointmentId) {
      navigate("/", { replace: true });
    }
  }, [patientId, doctorId, appointmentId]);

  return (
    <>
      <DoctorCall
        doctorId={doctorId}
        patientId={patientId}
        appointmentId={appointmentId}
        role={userRole && userRole?.toLowerCase()}
        mode={mode || "audio"}
      />
    </>
  );
};

export default VideoCall;
