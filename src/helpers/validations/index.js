import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  heartRate: Yup.number()
    .min(30, "Heart rate should be at least 30 BPM")
    .max(200, "Heart rate should not exceed 200 BPM")
    .required("Heart rate is required"),

  bodyTemperature: Yup.number()
    .min(30, "Body temperature should be at least 30°C")
    .max(45, "Body temperature should not exceed 45°C")
    .required("Body temperature is required"),

  glucoseLevel: Yup.number()
    .min(50, "Glucose level should be at least 50 mg/dL")
    .max(500, "Glucose level should not exceed 500 mg/dL")
    .required("Glucose level is required"),

  spo2: Yup.number()
    .min(50, "SpO2 should be at least 50%")
    .max(100, "SpO2 should not exceed 100%")
    .required("SpO2 level is required"),

  bloodPressure: Yup.string().required("Blood pressure is required"),

  bmi: Yup.number()
    .required("BMI is required")
    .min(10, "BMI should be at least 10")
    .max(50, "BMI should not exceed 50"),
});

export { validationSchema };
