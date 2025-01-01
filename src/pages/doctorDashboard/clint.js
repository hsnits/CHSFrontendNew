import React from "react";
import { Col, Row } from "react-bootstrap";
import { useForm, useFieldArray } from "react-hook-form";
import ErrorInput from "../../components/common/errorInput";

const ClinicForm = () => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      clinicName: "",
      price: "",
      schedule: [
        { day: "Monday", startTime: "", endTime: "" },
        { day: "Tuesday", startTime: "", endTime: "" },
        { day: "Wednesday", startTime: "", endTime: "" },
        { day: "Thursday", startTime: "", endTime: "" },
        { day: "Friday", startTime: "", endTime: "" },
        { day: "Saturday", startTime: "", endTime: "" },
        { day: "Sunday", startTime: "", endTime: "" },
      ],
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  const schedule = watch("schedule"); // Watch schedule field for dynamic rendering

  return (
    <>
      <div className="setting-title">
        <h5>Clinic Details</h5>
      </div>
      <hr />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
        <div className="setting-card">
          <Row>
            <Col lg="4" md="6">
              <div className="form-wrap">
                <label className="font-medium">Clinic Name</label>
                <input
                  type="text"
                  {...register("clinicName", {
                    required: "Clinic name is required",
                  })}
                  className="border rounded p-2 w-full"
                />
                <ErrorInput error={errors?.clinicName?.message} />
              </div>
            </Col>
            <Col lg="4" md="6">
              <div className="form-wrap">
                <label className="block font-medium">Price</label>
                <input
                  type="number"
                  {...register("price", {
                    required: "Price is required",
                    min: {
                      value: 0,
                      message: "Price must be a positive number",
                    },
                  })}
                  className="border rounded p-2 w-full"
                />
                <ErrorInput error={errors?.price?.message} />
              </div>
            </Col>

            {/* Weekly Schedule */}
            <div>
              <label className="block font-medium mb-2 font-bold">
                Weekly Schedule
              </label>

              {schedule.map((day, index) => (
                <>
                  {index == 0 && (
                    <div key={index} className="flex  justify-between  mb-2">
                      <span className="w-50"></span>

                      <span>
                        <b>Morning</b>
                      </span>
                      <span>
                        <b>Evening</b>
                      </span>
                    </div>
                  )}
                  <div key={index} className="flex  justify-between  mb-2">
                    <span className="w-50">
                      <b>{day.day}:</b>
                    </span>

                    <input
                      type="time"
                      {...register(`schedule.${index}.startTime`, {
                        // required: "Start time is required",
                      })}
                      className="border rounded p-1"
                    />
                    <input
                      type="time"
                      {...register(`schedule.${index}.endTime`, {
                        // required: "End time is required",
                      })}
                      className="border rounded p-0"
                    />

                    {errors.schedule?.[index]?.startTime && (
                      <span className="text-red-500 text-sm">
                        {errors.schedule[index].startTime.message}
                      </span>
                    )}
                    {errors.schedule?.[index]?.endTime && (
                      <span className="text-red-500 text-sm">
                        {errors.schedule[index].endTime.message}
                      </span>
                    )}
                  </div>
                </>
              ))}
            </div>
          </Row>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-white py-2 px-4 rounded text-blue hover:bg-blue-700 "
        >
          UPDATE
        </button>
      </form>
    </>
  );
};

export default ClinicForm;
