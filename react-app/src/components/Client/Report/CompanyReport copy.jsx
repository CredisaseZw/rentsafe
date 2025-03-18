import React from "react";
import { Button, Modal } from "react-bootstrap";
export default function CompanyReport({ showReport, handleCloseReport, selectedRow, reportData }) {
  return (
    <>
      <Modal show={showReport} onHide={handleCloseReport} fullscreen={true}>
        <Modal.Body>
          <div
            style={{
              border: "3px solid #176987",

              width: "100%",
              padding: "20px",
            }}
          >
            <div class="d-flex justify-content-between">
              <div>CrediSafe</div>
              <div class="d-flex justify-content-between">
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
                Payment Risk Report on{" "}
                <span style={{ fontWeight: "bold", color: "#176987" }}>
                  {reportData?.company_details?.registration_name}{" "}
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
                <table class="table table-bordered">
                  <tbody>
                    <tr
                      style={{
                        lineHeight: "5px",
                        fontSize: "12px",
                        backgroundColor: "#305496",
                      }}
                    >
                      <th scope="row" colSpan={5} className="text-center text-white">
                        RISK CLASSIFICATION / INDICATOR
                      </th>
                    </tr>
                    <tr style={{ lineHeight: "5px", fontSize: "12px" }}>
                      <th
                        style={{
                          backgroundColor:
                            reportData?.risk_data?.class == "low"
                              ? reportData?.risk_data?.color
                              : "",
                          color: reportData?.risk_data?.class == "low" ? "white" : "",
                        }}
                        scope="row"
                        className="text-center"
                      >
                        Low Risk[
                        {reportData?.risk_data?.class == "low" ? reportData?.risk_data?.score : ""}]
                      </th>
                      <td
                        style={{
                          backgroundColor:
                            reportData?.risk_data?.class == "medium"
                              ? reportData?.risk_data?.color
                              : "",
                          color: reportData?.risk_data?.class == "medium" ? "white" : "",
                        }}
                        className="text-center"
                      >
                        Medium Risk[
                        {reportData?.risk_data?.class == "medium"
                          ? reportData?.risk_data?.score
                          : ""}
                        ]
                      </td>

                      <td
                        style={{
                          backgroundColor: reportData?.risk_data?.class == "high" ? "#f87171" : "",
                          color: reportData?.risk_data?.class == "high" ? "white" : "",
                        }}
                        className="text-center"
                      >
                        High Risk[
                        {reportData?.risk_data?.class == "high" ? reportData?.risk_data?.score : ""}
                        ]
                      </td>
                      <td
                        style={{
                          backgroundColor:
                            reportData?.risk_data?.class == "high-high"
                              ? reportData?.risk_data?.color
                              : "",
                          color: reportData?.risk_data?.class == "high-high" ? "white" : "",
                        }}
                        className="text-center"
                      >
                        High-High Risk[
                        {reportData?.risk_data?.class == "high-high"
                          ? reportData?.risk_data?.score
                          : ""}
                        ]
                      </td>
                      <td
                        style={{
                          backgroundColor:
                            reportData?.risk_data?.class == "non-payer"
                              ? reportData?.risk_data?.color
                              : "",
                          color: reportData?.risk_data?.class == "non-payer" ? "white" : "",
                        }}
                        className="text-center"
                      >
                        None Payer[
                        {reportData?.risk_data?.class == "non-payer"
                          ? reportData?.risk_data?.score
                          : ""}
                        ]
                      </td>
                    </tr>
                  </tbody>
                </table>
                {/* <table class="table table-bordered">
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
                <table class="table table-bordered">
                  <tbody>
                    <tr
                      style={{
                        lineHeight: "5px",
                        fontSize: "12px",
                        backgroundColor: "#305496",
                      }}
                    >
                      <th scope="row" colSpan={4} className="text-center text-white">
                        COMPANY DETAILS
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
                        Registration Details
                      </th>
                    </tr>
                    <tr style={{ lineHeight: "5px", fontSize: "12px" }}>
                      <th scope="row">Registered Name :</th>
                      <td>{reportData?.company_details?.registration_name} </td>
                      <td>Trading Name:</td>
                      <td>{reportData?.company_details?.trading_name}</td>
                    </tr>
                    <tr style={{ lineHeight: "5px", fontSize: "12px" }}>
                      <th scope="row">Registration number:</th>
                      <td>{reportData?.company_details?.registration_number}</td>
                      <td>Year of registration:</td>
                      <td>{reportData?.company_details?.registration_date}</td>
                    </tr>
                    <tr style={{ lineHeight: "5px", fontSize: "12px" }}>
                      <th scope="row">Trading Status:</th>
                      <td>{reportData?.company_details?.trading_status}</td>
                      <td>Industry Sector</td>
                      <td>{reportData?.company_details?.industry}</td>
                    </tr>
                  </tbody>
                </table>
                <table class="table table-bordered">
                  <tbody>
                    <tr
                      style={{
                        lineHeight: "5px",
                        fontSize: "12px",
                        backgroundColor: "#b4c6e7",
                      }}
                    >
                      <th scope="row" colSpan={6} className="text-center">
                        Contact Details
                      </th>
                    </tr>
                    <tr style={{ lineHeight: "5px", fontSize: "12px" }}>
                      <th scope="row">Telephone No.:</th>
                      <td>{reportData?.company_details?.telephone}</td>
                      <td>Mobile No.:</td>
                      <td>{reportData?.company_details?.mobile_phone}</td>
                    </tr>
                    <tr style={{ lineHeight: "5px", fontSize: "12px" }}>
                      <th scope="row">Physical Address:</th>
                      <td colSpan={3}>{reportData?.company_details?.current_address}</td>
                    </tr>
                    <tr style={{ lineHeight: "5px", fontSize: "12px" }}>
                      <th scope="row">Email :</th>
                      <td>{reportData?.company_details?.email}</td>
                      <td>Website:</td>
                      <td>{reportData?.company_details?.website}</td>
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
                <table class="table table-bordered">
                  <tbody>
                    <tr
                      style={{
                        lineHeight: "5px",
                        fontSize: "12px",
                        backgroundColor: "#305496",
                      }}
                    >
                      <th scope="row" colSpan={7} className="text-center text-white">
                        CREDIT ACCOUNTS
                      </th>
                    </tr>
                    <tr
                      style={{
                        lineHeight: "5px",
                        fontSize: "12px",
                        backgroundColor: "#b4c6e7",
                      }}
                    >
                      <th scope="row" colSpan={7} className="text-center">
                        Active Credit Accounts
                      </th>
                    </tr>
                    <tr style={{ lineHeight: "5px", fontSize: "12px" }}>
                      <th scope="row">Credit Type</th>
                      <td>Currency</td>
                      <td>Start Date</td>
                      <td>End Date</td>
                      <td>Principal Amount</td>
                      <td>Instalment Amount</td>
                      <td>Overdue Amount</td>
                    </tr>
                    {reportData?.credit_details?.map((credit) => (
                      <tr key={credit.lease_id} style={{ lineHeight: "5px", fontSize: "12px" }}>
                        <th scope="row">{credit.credit_type}</th>
                        <td>{credit.currency}</td>
                        <td> {credit.start_date}</td>
                        <td> {credit.end_date}</td>
                        <td> {credit.principal_amount}</td>
                        <td> {credit.instalment_amount}</td>
                        <td> {credit.overdue_amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <table class="table table-bordered">
                  <tbody>
                    <tr
                      style={{
                        lineHeight: "5px",
                        fontSize: "12px",
                        backgroundColor: "#b4c6e7",
                      }}
                    >
                      <th scope="row" colSpan={10} className="text-center ">
                        Hire Purchase Information
                      </th>
                    </tr>
                    <tr style={{ lineHeight: "5px", fontSize: "12px" }}>
                      <th className="text-center" scope="row">
                        Credit Type
                      </th>
                      <td className="text-center">Make</td>
                      <td className="text-center">Model</td>
                      <td className="text-center">Reg No. /Serial No.</td>
                      <td className="text-center">Chassis No.</td>
                      <td className="text-center">Engin No.</td>
                      <td className="text-center">Start Date</td>
                      <td className="text-center">End Date</td>
                      <td className="text-center">Balance</td>
                      <td className="text-center">Overdue Amount</td>
                    </tr>
                  </tbody>
                </table>

                <table class="table table-bordered">
                  <tbody>
                    <tr
                      style={{
                        lineHeight: "5px",
                        fontSize: "12px",
                        backgroundColor: "#b4c6e7",
                      }}
                    >
                      <th scope="row" colSpan={10} className="text-center ">
                        Historic Credit Accounts
                      </th>
                    </tr>
                    <tr style={{ lineHeight: "5px", fontSize: "12px" }}>
                      <th className="text-center" scope="row" colSpan={2}>
                        Credit Type
                      </th>
                      <td className="text-center">Currency</td>
                      <td className="text-center">Start Date</td>
                      <td className="text-center">End Date</td>
                      <td className="text-center">Principal Amount</td>
                      <td className="text-center">Instalment Amount</td>
                    </tr>
                    <tr style={{ lineHeight: "5px", fontSize: "12px" }}>
                      <th className="text-center" scope="row" colSpan={2}>
                        Bank Loan
                      </th>
                      <td className="text-center"></td>
                      <td className="text-center"></td>
                      <td className="text-center"></td>
                      <td className="text-center"></td>
                      <td className="text-center"></td>
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
                <table class="table table-bordered">
                  <tbody>
                    <tr
                      style={{
                        lineHeight: "5px",
                        fontSize: "12px",
                        backgroundColor: "#305496",
                      }}
                    >
                      <th scope="row" colSpan={7} className="text-center text-white">
                        ADVERSE RECORDS
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
                        Claims
                      </th>
                    </tr>
                    <tr style={{ lineHeight: "5px", fontSize: "12px" }}>
                      <th scope="row">Claimant</th>
                      <td>Currency</td>
                      <td>Amount</td>
                      <td>Date of Claim </td>
                    </tr>
                    {reportData?.claims_list?.length > 0 &&
                      reportData?.claims_list?.map((claim, index) => (
                        <tr key={"claim" + index} style={{ lineHeight: "5px", fontSize: "12px" }}>
                          <th scope="row">{claim.creditor}</th>
                          <td>{claim.currency}</td>
                          <td>{claim.owing_amount}</td>
                          <td>{claim.claim_date}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>

                <table class="table table-bordered">
                  <tbody>
                    <tr
                      style={{
                        lineHeight: "5px",
                        fontSize: "12px",
                        backgroundColor: "#b4c6e7",
                      }}
                    >
                      <th scope="row" colSpan={3} className="text-center ">
                        Absconder
                      </th>
                    </tr>
                    <tr style={{ lineHeight: "5px", fontSize: "12px" }}>
                      <th className="text-center" scope="row">
                        Creditor
                      </th>
                      <td className="text-center">Currency</td>
                      <td className="text-center">Amount</td>
                    </tr>
                  </tbody>
                </table>

                <table class="table table-bordered">
                  <tbody>
                    <tr
                      style={{
                        lineHeight: "5px",
                        fontSize: "12px",
                        backgroundColor: "#b4c6e7",
                      }}
                    >
                      <th scope="row" colSpan={10} className="text-center ">
                        Court Judgements
                      </th>
                    </tr>
                    <tr style={{ lineHeight: "5px", fontSize: "12px" }}>
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
                <table class="table table-bordered">
                  <tbody>
                    <tr
                      style={{
                        lineHeight: "5px",
                        fontSize: "12px",
                        backgroundColor: "#305496",
                      }}
                    >
                      <th scope="row" colSpan={7} className="text-center text-white">
                        ENQUIRIES
                      </th>
                    </tr>

                    <tr style={{ lineHeight: "5px", fontSize: "12px" }}>
                      <th scope="row">Company</th>
                      <td>Enquirer</td>
                      <td>Date Of Enquiry</td>
                    </tr>
                    {reportData?.external_enquiry_details_list?.length > 0 && (
                      <>
                        {reportData?.external_enquiry_details_list
                          ?.sort((a, b) => new Date(b.enquiry_date) - new Date(a.enquiry_date))
                          ?.map((data, index) => (
                            <tr key={index} style={{ lineHeight: "5px", fontSize: "12px" }}>
                              <th className="text-center" scope="row">
                                {data.company_name}
                              </th>
                              <td className="text-center">{data.enquirer}</td>
                              <td className="text-center">{data.enquiry_date}</td>
                            </tr>
                          ))}
                      </>
                    )}
                  </tbody>
                </table>
                {reportData?.is_internal && (
                  <table class="table table-bordered">
                    <tbody>
                      <tr
                        style={{
                          lineHeight: "5px",
                          fontSize: "12px",
                          backgroundColor: "#b4c6e7",
                        }}
                      >
                        <th scope="row" colSpan={3} className="text-center ">
                          Internal
                        </th>
                      </tr>
                      <tr style={{ lineHeight: "5px", fontSize: "12px" }}>
                        <th className="text-center" scope="row">
                          Enquirer
                        </th>
                        <td className="text-center">Enquiry Date</td>
                      </tr>
                      {reportData?.internal_enquiry_details_list?.length > 0 && (
                        <>
                          {reportData?.internal_enquiry_details_list
                            ?.sort((a, b) => new Date(b.enquiry_date) - new Date(a.enquiry_date))
                            ?.map((data, index) => (
                              <tr key={index} style={{ lineHeight: "5px", fontSize: "12px" }}>
                                <th className="text-center" scope="row">
                                  {data.enquirer}
                                </th>
                                <td className="text-center">{data.enquiry_date}</td>
                              </tr>
                            ))}
                        </>
                      )}
                    </tbody>
                  </table>
                )}
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
                <table class="table table-bordered">
                  <tbody>
                    <tr
                      style={{
                        lineHeight: "5px",
                        fontSize: "12px",
                        backgroundColor: "#305496",
                      }}
                    >
                      <th scope="row" colSpan={7} className="text-center text-white">
                        PUBLIC INFORMATION
                      </th>
                    </tr>

                    <tr style={{ lineHeight: "5px", fontSize: "12px" }}>
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
                border: "1px solid #176987",
                width: "100%",
                padding: "2px",
              }}
            >
              <div style={{ padding: "10px" }}>
                <table class="table table-bordered">
                  <tbody>
                    <tr
                      style={{
                        lineHeight: "5px",
                        fontSize: "12px",
                        backgroundColor: "#305496",
                      }}
                    >
                      <th scope="row" colSpan={7} className="text-center text-white">
                        AS KEY PERSON IN COMPANIES
                      </th>
                    </tr>
                  </tbody>
                </table>

                <table class="table table-bordered">
                  <tbody>
                    <tr
                      style={{
                        lineHeight: "5px",
                        fontSize: "12px",
                        backgroundColor: "#b4c6e7",
                      }}
                    >
                      <th scope="row" colSpan={3} className="text-center ">
                        Directorships
                      </th>
                    </tr>
                    <tr style={{ lineHeight: "5px", fontSize: "12px" }}>
                      <th className="text-center" scope="row">
                        Company
                      </th>
                      <td className="text-center">Year Of Appointment</td>
                    </tr>
                  </tbody>
                </table>

                <table class="table table-bordered">
                  <tbody>
                    <tr
                      style={{
                        lineHeight: "5px",
                        fontSize: "12px",
                        backgroundColor: "#b4c6e7",
                      }}
                    >
                      <th scope="row" colSpan={3} className="text-center ">
                        Executive
                      </th>
                    </tr>
                    <tr style={{ lineHeight: "5px", fontSize: "12px" }}>
                      <th className="text-center" scope="row">
                        Position
                      </th>
                      <td className="text-center">Company</td>
                      <td className="text-center">Year Of Appointment</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

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
          <Button variant="secondary" onClick={handleCloseReport}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCloseReport}>
            Print
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
// 05075824Z18
