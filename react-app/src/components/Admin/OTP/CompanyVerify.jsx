import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useForm, usePage } from "@inertiajs/inertia-react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

export const CompanyVerify = ({
  show,
  handleClose,
  url,
  setVerified,
  verification_type,
  setCreditInfo,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { data, setData, post, reset } = useForm({
    otp: "",
    verification_type: verification_type,
  });

  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(30);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(intervalId);
          setCanResend(true);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);
  const handleOTPResend = async () => {
    setCanResend(false);
    try {
      const response = await axios.get(reverseUrl("new_otp"));
      if (response.data.status === "success") {
        toast.success("OTP sent successfully");
      } else {
        toast.error("Something went wrong! Please try again");
      }
    } catch (err) {
      toast.error("Something went wrong! Please try again");
    }
  };

  const changeHandler = (e) => setData({ ...data, [e.target.id]: e.target.value });

  const isOTPValid = () => {
    if (data.otp.length !== 4) {
      setErrors({ otp: "otp must be four digits" });
      return false;
    } else if (!Boolean(parseInt(data.otp, 10))) {
      setErrors({ otp: "otp must be a number" });
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    console.log("indi");

    e.preventDefault();
    if (isOTPValid()) {
      post(reverseUrl(url), {
        onStart: () => {
          setIsLoading(true);
        },
        onSuccess: (response) => {
          handleClose();
          reset();
          toast.success("User verified successfully");
          setIsLoading(false);
          // setShow(!show)
          // setCreditInfo(response.props.user);
          setVerified(true);
          window.location.reload();
        },
        onError: (e) => {
          toast.error("Something went wrong! Please try again");
          setErrors(e);
          setIsLoading(false);
        },
      });
      setIsLoading(false);
    }
  };
  return (
    <>
      <Modal size="lg" show={show} onHide={handleClose} centered>
        <div>
          <div className="card card-raised">
            <div className="card-header bg-info px-4">
              <div
                className="d-flex justify-content-between
                                align-items-center"
              >
                <div className="me-4">
                  <h2 className="display-6 mb-0 text-white">Verify OTP</h2>
                  <div className="card-text"></div>
                </div>
                <div className="d-flex gap-2"></div>
              </div>
            </div>
            <div className="card-body p-4">
              <div className="card">
                <div
                  className="card-body p-4"
                  style={{
                    borderStyle: "solid",
                    borderColor: "#26a69a",
                  }}
                >
                  <Modal.Body>
                    <div className="row mb-4">
                      <div className="col-md-12">
                        <div>
                          <p>
                            {verification_type === "individual"
                              ? "Enter the 4-digit code we sent to user's mobile number. This code will expire after 5 minutes"
                              : "Enter the 4-digit code we sent to user's email. This code will expire after 5 minutes"}
                          </p>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <label className="form-label">Verification Code</label>
                            <input
                              value={data.otp}
                              onChange={changeHandler}
                              type="text"
                              name="otp"
                              id="otp"
                              placeholder="Enter your 4 digit otp"
                              className="form-control form-control-sm"
                            />

                            {errors && <div className="text-danger mt-1">{errors.otp}</div>}
                          </div>
                        </div>
                      </div>
                      <div className="mt-5 d-flex gap-4 align-items-center ">
                        <p>
                          Didn't receive code?
                          <button
                            onClick={handleOTPResend}
                            className="ms-2 text-decoration-underline border-0 bg-transparent text-info"
                            disabled={canResend === false}
                          >
                            Resend Code
                          </button>
                        </p>
                        {countdown > 0 && (
                          <p className="text-success">{`Resend code in ${countdown} seconds`}</p>
                        )}
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      className="text-white"
                      variant="info"
                      onClick={(e) => handleSubmit(e)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-grow spinner-grow-sm"></span>
                          <span className="ml-2">processing..</span>
                        </>
                      ) : (
                        "Verify"
                      )}
                    </Button>
                  </Modal.Footer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
