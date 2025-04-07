import React, { useRef } from "react";
import html2pdf from "html2pdf.js";
import { Button, Modal } from "react-bootstrap";

export default function IndividualReport({
  showReport,
  handleCloseReport,
  selectedRow,
  reportData,
}) {
  const modalContentRef = useRef();
  console.log(reportData);
  console.log("reportData", reportData.historic_claims_list);

  const handlePrintToPdf = () => {
    // alert('print to pdf');
    const element = modalContentRef.current;
    html2pdf()
      .from(element)
      .set({
        margin: 1,
        filename: "modal-content.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { orientation: "portrait" },
      })
      .save();
  };
  return (
    <>
      <Modal show={showReport} onHide={handleCloseReport} fullscreen={true}>
        <Modal.Body ref={modalContentRef}>
          <div
            style={{
              border: "3px solid #176987",
              width: "100%",
              padding: "20px",
            }}
            id="report"
          >
            <div className="d-flex justify-content-between">
              <div>
                <div>CrediSafe</div>
                <div>Securing you rental investments</div>
              </div>

              <div className="d-flex justify-content-between">
                <div>
                  <br />

                  <br />
                  <br />

                  <br />
                </div>
                <div style={{ lineHeight: "10px" }}>
                  <p style={{ textAlign: "right" }}>+263 71 882 2460</p>
                  <p style={{ textAlign: "right" }}>credisafezw@gmail.com</p>
                  <p style={{ textAlign: "right" }}> www.credi-safe.com</p>
                </div>
              </div>
            </div>
            <div className="mt-5 mb-2">
              <h6>
                Rent Payment Status Report on{" "}
                <span style={{ fontWeight: "bold", color: "#176987" }}>
                  {reportData?.individual_details?.firstname}{" "}
                  {reportData?.individual_details?.surname}{" "}
                </span>
                as at {Date().toLocaleString()}
              </h6>
            </div>
            <div
              className="mb-5"
              style={{
                border: "1px solid #176987",
                width: "100%",
                padding: "5px",
              }}
            >
              <div style={{ padding: "10px" }}>
                <table className="table table-bordered">
                  <tbody>
                    <tr
                      style={{
                        lineHeight: "5px",
                        fontSize: "12px",
                        backgroundColor: "#190062",
                      }}
                    >
                      <th scope="row" colSpan={5} className="text-center text-white">
                        PAYMENT STATUS CLASSIFICATION/INDICATOR
                      </th>
                    </tr>
                    <tr style={{ lineHeight: "5px", fontSize: "12px" }}>
                      <th scope="row" className="text-center">
                        Status
                      </th>

                      <td
                        style={{
                          backgroundColor:
                            reportData?.risk_data?.class == "non-payer"
                              ? reportData?.risk_data?.color
                              : reportData?.risk_data?.class == "high-high"
                                ? reportData?.risk_data?.color
                                : reportData?.risk_data?.class == "high"
                                  ? reportData?.risk_data?.color
                                  : reportData?.risk_data?.class == "medium"
                                    ? reportData?.risk_data?.color
                                    : reportData?.risk_data?.class == "low"
                                      ? reportData?.risk_data?.color
                                      : "",
                          color: reportData?.risk_data?.class == "non-payer" ? "white" : "",
                        }}
                        className="text-center text-white"
                      >
                        {reportData?.risk_data?.class == "non-payer"
                          ? "Non-Payer"
                          : reportData?.risk_data?.class == "high-high"
                            ? "High-High"
                            : reportData?.risk_data?.class == "high"
                              ? "High"
                              : reportData?.risk_data?.class == "medium"
                                ? "Medium"
                                : reportData?.risk_data?.class == "low"
                                  ? "Low"
                                  : ""}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table className="table table-bordered">
                  <tbody>
                    <tr
                      style={{
                        lineHeight: "5px",
                        fontSize: "12px",
                        backgroundColor: "#808080",
                      }}
                    >
                      <th scope="row" colSpan={5} className="text-center text-white">
                        STATUS INDEX
                      </th>
                    </tr>
                    <tr style={{ lineHeight: "5px", fontSize: "12px" }}>
                      <th scope="row" className="text-center bg-success text-white">
                        Low
                      </th>
                      <td
                        style={{
                          fontWeight: "bold",
                        }}
                        className="text-center bg-warning text-white"
                      >
                        Medium Risk
                      </td>
                      <td
                        style={{
                          backgroundColor: "#ff33cc",
                          fontWeight: "bold",
                        }}
                        className="text-center text-white"
                      >
                        High Risk - Lower
                      </td>
                      <td
                        style={{
                          fontWeight: "bold",
                          backgroundColor: "red",
                        }}
                        className="text-center text-white"
                      >
                        High Risk - Upper
                      </td>
                      <td
                        style={{
                          fontWeight: "bold",
                        }}
                        className="text-center bg-dark text-white"
                      >
                        None Payer
                      </td>
                    </tr>
                    <tr style={{ lineHeight: "5px", fontSize: "12px" }}>
                      <th scope="row" className="text-center text-nowrap">
                        Current
                      </th>
                      <td className="text-center text-nowrap">1st Month Outstanding</td>
                      <td className="text-center text-nowrap">2nd Month Outstanding</td>
                      <td className="text-center text-nowrap">3rd Month Outstanding</td>
                      <td className="text-center text-nowrap">+3 Months Outstanding</td>
                    </tr>
                  </tbody>
                </table>
                {/* <table className="table table-bordered">
                  <tbody>
                    <tr
                      style={{
                        lineHeight: '5px',
                        fontSize: '12px',
                        backgroundColor: '#b4c6e7',
                      }}
                    >
                      <th scope="row" colSpan={6} className="text-center ">
                        Score Range
                      </th>
                    </tr>
                    <tr style={{ lineHeight: '5px', fontSize: '12px' }}>
                      <th scope="row">Class</th>
                      <td>Index Range</td>
                      <td>Class</td>
                      <td>Index Range</td>
                      <td>Class</td>
                      <td>Index Range</td>
                    </tr>
                    <tr style={{ lineHeight: '5px', fontSize: '12px' }}>
                      <th
                        scope="row"
                        style={{
                          backgroundColor:
                            reportData?.score_range?.class == 'LLR'
                              ? reportData?.risk_data?.color
                              : '',
                          color:
                            reportData?.score_range?.class === 'LLR'
                              ? 'white'
                              : '',
                        }}
                      >
                        Low Low Risk [LLR]
                      </th>
                      <td>500-417</td>
                      <td
                        style={{
                          backgroundColor:
                            reportData?.score_range?.class == 'LMR'
                              ? reportData?.risk_data?.color
                              : '',
                          color:
                            reportData?.score_range?.class === 'LMR'
                              ? 'white'
                              : '',
                        }}
                      >
                        Low Medium Risk [LMR]
                      </td>
                      <td>332-250</td>
                      <td
                        style={{
                          backgroundColor:
                            reportData?.score_range?.class == 'LHR'
                              ? reportData?.risk_data?.color
                              : '',
                          color:
                            reportData?.score_range?.class === 'LHR'
                              ? 'white'
                              : '',
                        }}
                      >
                        Low High Risk [LHR]
                      </td>
                      <td>165-83</td>
                    </tr>
                    <tr style={{ lineHeight: '5px', fontSize: '12px' }}>
                      <th
                        scope="row"
                        style={{
                          backgroundColor:
                            reportData?.score_range?.class == 'HLR'
                              ? reportData?.risk_data?.color
                              : '',
                          color:
                            reportData?.score_range?.class === 'HLR'
                              ? 'white'
                              : '',
                        }}
                      >
                        High Low Risk [HLR]
                      </th>
                      <td>416-333</td>
                      <td
                        style={{
                          backgroundColor:
                            reportData?.score_range?.class == 'HMR'
                              ? reportData?.risk_data?.color
                              : '',
                          color:
                            reportData?.score_range?.class === 'HMR'
                              ? 'white'
                              : '',
                        }}
                      >
                        High Medium Risk [HMR]
                      </td>
                      <td>249-166</td>
                      <td
                        style={{
                          backgroundColor:
                            reportData?.score_range?.class == 'HHR'
                              ? reportData?.risk_data?.color
                              : '',
                          color:
                            reportData?.score_range?.class === 'HHR'
                              ? 'white'
                              : '',
                        }}
                      >
                        High High Risk [HHR]
                      </td>
                      <td>82-0</td>
                    </tr>
                  </tbody>
                </table> */}
              </div>
            </div>
            <div
              className="mb-5"
              style={{
                border: "1px solid #176987",
                width: "100%",
                padding: "2px",
              }}
            >
              <div style={{ padding: "10px" }}>
                <table className="table table-bordered">
                  <tbody>
                    <tr
                      style={{
                        lineHeight: "5px",
                        fontSize: "12px",
                        backgroundColor: "#305496",
                      }}
                    >
                      <th scope="row" colSpan={4} className="text-center text-white">
                        PERSONAL DETAILS
                      </th>
                    </tr>
                    <tr
                      style={{
                        lineHeight: "5px",
                        fontSize: "12px",
                        backgroundColor: "#b4c6e7",
                      }}
                    >
                      <th scope="row" colSpan={4} className="text-center ">
                        Identification Details
                      </th>
                    </tr>
                    <tr style={{ lineHeight: "5px", fontSize: "12px" }}>
                      <th scope="row">Surname :</th>
                      <td>{reportData?.individual_details?.surname}</td>
                      <td>First Name :</td>
                      <td>{reportData?.individual_details?.firstname}</td>
                    </tr>
                    <tr style={{ lineHeight: "5px", fontSize: "12px" }}>
                      <th scope="row">National ID No:</th>
                      <td>{reportData?.individual_details?.national_id}</td>
                      <td>Date Of Birth:</td>
                      <td>{reportData?.individual_details?.dob}</td>
                    </tr>
                    <tr style={{ lineHeight: "5px", fontSize: "12px" }}>
                      <th scope="row">Marital Status :</th>
                      <td> {reportData?.individual_details?.marital_status}</td>
                      <td>Gender:</td>
                      <td>{reportData?.individual_details?.gender}</td>
                    </tr>
                  </tbody>
                </table>
                <table className="table table-bordered">
                  <tbody>
                    <tr
                      style={{
                        lineHeight: "5px",
                        fontSize: "12px",
                        backgroundColor: "#b4c6e7",
                      }}
                    >
                      <th scope="row" colSpan={6} className="text-center ">
                        Contact Details
                      </th>
                    </tr>
                    <tr style={{ lineHeight: "5px", fontSize: "12px" }}>
                      <th scope="row">Mobile Number :</th>
                      <td>{reportData?.individual_details?.mobile}</td>
                      <td>Telephone No:</td>
                      <td>{reportData?.individual_details?.landline}</td>
                    </tr>
                    <tr style={{ lineHeight: "5px", fontSize: "12px" }}>
                      <th scope="row">Address :</th>
                      <td colSpan={3}>{reportData?.individual_details?.address}</td>
                    </tr>
                    <tr style={{ lineHeight: "5px", fontSize: "12px" }}>
                      <th scope="row">Email :</th>
                      <td colSpan={3}>{reportData?.individual_details?.email}</td>
                    </tr>
                  </tbody>
                </table>

                <table className="table table-bordered">
                  <tbody>
                    <tr
                      style={{
                        lineHeight: "5px",
                        fontSize: "12px",
                        backgroundColor: "#b4c6e7",
                      }}
                    >
                      <th scope="row" colSpan={6} className="text-center ">
                        Employment History
                      </th>
                    </tr>
                    <tr style={{ lineHeight: "5px", fontSize: "12px" }}>
                      <th className="text-center" scope="row">
                        Employer
                      </th>
                      <td className="text-center">Position</td>
                      <td className="text-center">Start Date</td>
                    </tr>
                    <tr style={{ lineHeight: "5px", fontSize: "12px" }}>
                      <th scope="row" className="text-center">
                        {reportData?.individual_details?.employer_name}
                      </th>
                      <td className="text-center">{reportData?.individual_details?.job_title}</td>
                      <td className="text-center">
                        {reportData?.individual_details?.date_of_employment}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div
              className="mb-5"
              style={{
                border: "1px solid #176987",
                width: "100%",
                padding: "2px",
              }}
            >
              <div style={{ padding: "10px" }}>
                <table className="table table-bordered">
                  <tbody>
                    <tr
                      style={{
                        lineHeight: "5px",
                        fontSize: "12px",
                        backgroundColor: "#305496",
                      }}
                    >
                      <th scope="row" colSpan={7} className="text-center text-white">
                        OUTSTANDING RENTALS
                      </th>
                    </tr>
                    <tr
                      style={{
                        lineHeight: "5px",
                        fontSize: "12px",
                        backgroundColor: "#b4c6e7",
                      }}
                    >
                      <th scope="row" colSpan={5} className="text-center ">
                        Claims
                      </th>
                    </tr>
                    <tr style={{ lineHeight: "5px", fontSize: "12px" }}>
                      <th scope="row">Claimant</th>
                      <td>Type</td>
                      <td>Currency</td>
                      <td>Amount</td>
                      <td>Date of Claim </td>
                    </tr>
                    {reportData?.claims_list?.length > 0 &&
                      reportData?.claims_list?.map((claim, index) => (
                        <tr key={"claim" + index} style={{ lineHeight: "5px", fontSize: "12px" }}>
                          <th scope="row">{claim.creditor}</th>
                          <td>{claim.type || ""}</td>
                          <td>{claim.currency}</td>
                          <td>
                            {claim?.owing_amount ? Number(claim.owing_amount).toFixed(2) : ""}
                          </td>
                          <td>{claim.claim_date}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>

                {/* <table className="table table-bordered">
                  <tbody>
                    <tr
                      style={{
                        lineHeight: '5px',
                        fontSize: '12px',
                        backgroundColor: '#b4c6e7',
                      }}
                    >
                      <th scope="row" colSpan={10} className="text-center ">
                        Court Judgements
                      </th>
                    </tr>
                    <tr style={{ lineHeight: '5px', fontSize: '12px' }}>
                      <th className="text-center" scope="row" colSpan={2}>
                        Court
                      </th>
                      <td className="text-center">Plaintiff</td>
                      <td className="text-center">Case No</td>
                      <td className="text-center">Currency</td>
                      <td className="text-center">Amount</td>
                      <td className="text-center">Judgement Date</td>
                    </tr>
                  </tbody>
                </table> */}
              </div>
            </div>
            <div
              className="mb-5"
              style={{
                border: "1px solid #176987",
                width: "100%",
                padding: "2px",
              }}
            >
              <div style={{ padding: "10px" }}>
                <table className="table table-bordered">
                  <tbody>
                    <tr
                      style={{
                        lineHeight: "5px",
                        fontSize: "12px",
                        backgroundColor: "#305496",
                      }}
                    >
                      <th scope="row" colSpan={7} className="text-center">
                        Active
                      </th>
                    </tr>
                    <tr style={{ lineHeight: "5px", fontSize: "12px" }}>
                      <th scope="row">Creditor</th>
                      <td>Type</td>
                      {/* <td>Currency</td> */}
                      <td>Outstanding Since</td>
                      <td>Amount</td>
                    </tr>
                    {reportData?.credit_details?.map((credit) => (
                      <tr key={credit.lease_id} style={{ lineHeight: "5px", fontSize: "12px" }}>
                        <th scope="row">{credit.credit_type}</th>
                        <td> {credit.type || ""}</td>
                        <td> {credit.start_date}</td>
                        <td>
                          {credit.currency}{" "}
                          {credit?.overdue_amount ? Number(credit.overdue_amount).toFixed(2) : ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <table className="table table-bordered">
                  <tbody>
                    <tr
                      style={{
                        lineHeight: "5px",
                        fontSize: "12px",
                        backgroundColor: "#b4c6e7",
                      }}
                    >
                      <th scope="row" colSpan={10} className="text-center ">
                        Historic
                      </th>
                    </tr>
                    <tr style={{ lineHeight: "5px", fontSize: "12px" }}>
                      <th className="" scope="row" colSpan={2}>
                        Creditor
                      </th>
                      <td>Type</td>
                      <td className="">Outstanding Since</td>
                      <td className=""> Amount</td>
                    </tr>

                    {reportData.historic_claims_list?.length > 0 &&
                      reportData.historic_claims_list?.map((claim, index) => (
                        <tr key={"claim" + index} style={{ lineHeight: "5px", fontSize: "12px" }}>
                          <th scope="row" colSpan={2}>
                            {" "}
                            {claim?.creditor}
                          </th>
                          <td>{claim?.type || ""}</td>
                          {/* <td>{claim.currency}</td> */}
                          <td>{claim?.claim_date}</td>
                          <td>
                            {claim?.balance_amount ? Number(claim.balance_amount).toFixed(2) : ""}
                          </td>
                        </tr> // Close the tr tag here
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* <div
              className="mb-5"
              style={{
                border: '1px solid #176987',
                width: '100%',
                padding: '2px',
              }}
            >
              <div style={{ padding: '10px' }}>
                <table className="table table-bordered">
                  <tbody>
                    <tr
                      style={{
                        lineHeight: '5px',
                        fontSize: '12px',
                        backgroundColor: '#305496',
                      }}
                    >
                      <th
                        scope="row"
                        colSpan={7}
                        className="text-center text-white"
                      >
                        ENQUIRIES
                      </th>
                    </tr>

                    <tr style={{ lineHeight: '5px', fontSize: '12px' }}>
                      <th scope="row">Company</th>
                      <td>Enquirer</td>
                      <td>Date Of Enquiry</td>
                    </tr>
                    {reportData?.external_enquiry_details_list?.length > 0 && (
                      <>
                        {reportData?.external_enquiry_details_list?.map(
                          (enquiry, index) => (
                            <tr
                              key={index}
                              style={{ lineHeight: '5px', fontSize: '12px' }}
                            >
                              <th className="text-center" scope="row">
                                {enquiry.company_name}
                              </th>
                              <td className="text-center">
                                {enquiry.enquirer}
                              </td>
                              <td className="text-center">
                                {enquiry.enquiry_date}
                              </td>
                            </tr>
                          )
                        )}
                      </>
                    )}
                  </tbody>
                </table>
                {reportData?.is_internal && (
                  <table className="table table-bordered">
                    <tbody>
                      <tr
                        style={{
                          lineHeight: '5px',
                          fontSize: '12px',
                          backgroundColor: '#b4c6e7',
                        }}
                      >
                        <th scope="row" colSpan={3} className="text-center ">
                          Internal
                        </th>
                      </tr>
                      <tr style={{ lineHeight: '5px', fontSize: '12px' }}>
                        <th className="text-center" scope="row">
                          Enquirer
                        </th>
                        <td className="text-center">Enquiry Date</td>
                      </tr>
                      {reportData?.internal_enquiry_details_list?.length >
                        0 && (
                          <>
                            {reportData?.internal_enquiry_details_list?.map(
                              (enquiry, index) => (
                                <tr
                                  key={index}
                                  style={{
                                    lineHeight: '5px',
                                    fontSize: '12px',
                                  }}
                                >
                                  <th className="text-center" scope="row">
                                    {enquiry.enquirer}
                                  </th>
                                  <td className="text-center">
                                    {enquiry.enquiry_date}
                                  </td>
                                </tr>
                              )
                            )}
                          </>
                        )}
                    </tbody>
                  </table>
                )}
              </div>
            </div> */}
            {/* <div
              className="mb-5"
              style={{
                border: '1px solid #176987',
                width: '100%',
                padding: '2px',
              }}
            >
              <div style={{ padding: '10px' }}>
                <table className="table table-bordered">
                  <tbody>
                    <tr
                      style={{
                        lineHeight: '5px',
                        fontSize: '12px',
                        backgroundColor: '#305496',
                      }}
                    >
                      <th
                        scope="row"
                        colSpan={7}
                        className="text-center text-white"
                      >
                        PUBLIC INFORMATION
                      </th>
                    </tr>

                    <tr style={{ lineHeight: '5px', fontSize: '12px' }}>
                      <th scope="row">Record Date</th>
                      <td>Source</td>
                      <td>Summary</td>
                      <td>Link </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div
              style={{
                border: '1px solid #176987',
                width: '100%',
                padding: '2px',
              }}
            >
              <div style={{ padding: '10px' }}>
                <table className="table table-bordered">
                  <tbody>
                    <tr
                      style={{
                        lineHeight: '5px',
                        fontSize: '12px',
                        backgroundColor: '#305496',
                      }}
                    >
                      <th
                        scope="row"
                        colSpan={7}
                        className="text-center text-white"
                      >
                        AS KEY PERSON IN COMPANIES
                      </th>
                    </tr>
                  </tbody>
                </table>

                <table className="table table-bordered">
                  <tbody>
                    <tr
                      style={{
                        lineHeight: '5px',
                        fontSize: '12px',
                        backgroundColor: '#b4c6e7',
                      }}
                    >
                      <th scope="row" colSpan={3} className="text-center ">
                        Directorships
                      </th>
                    </tr>
                    <tr style={{ lineHeight: '5px', fontSize: '12px' }}>
                      <th className="text-center" scope="row">
                        Company
                      </th>
                      <td className="text-center">Year Of Appointment</td>
                    </tr>
                  </tbody>
                </table>

                <table className="table table-bordered">
                  <tbody>
                    <tr
                      style={{
                        lineHeight: '5px',
                        fontSize: '12px',
                        backgroundColor: '#b4c6e7',
                      }}
                    >
                      <th scope="row" colSpan={3} className="text-center ">
                        Executive
                      </th>
                    </tr>
                    <tr style={{ lineHeight: '5px', fontSize: '12px' }}>
                      <th className="text-center" scope="row">
                        Position
                      </th>
                      <td className="text-center">Company</td>
                      <td className="text-center">Year Of Appointment</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div> */}
            <div
              style={{
                width: "100%",
                padding: "2px",
              }}
            >
              <hr />
              <div>
                <p>
                  Disclaimer: This report is confidential and intended solely for the individual or
                  entity to whom it is addressed. Information on this report is valid at the time of
                  enquiry only. If verification is required, please contact us on the details
                  provided above.
                </p>
                <p>Terms and Conditions apply.</p>
                <p>Copyrights © CrediSafe Zimbabwe</p>
                <p>All rights reserved</p>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="mr-4" variant="secondary" onClick={handleCloseReport}>
            Close
          </Button>
          <Button variant="primary" onClick={handlePrintToPdf}>
            Print
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
