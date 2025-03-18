import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { usePage } from "@inertiajs/inertia-react";
import SearchComponent from "../../../components/search.jsx";
import { formatCurrency } from "../../../utils/formatting.js";

const Pricing = () => {
  const {
    last_day_changed: lastDayChanged,
    current_usd_rate: currentUsdRate,
    client_data: clientData,
    company_charge: companyCharge,
    individual_charge: individualCharge,
  } = usePage().props;
  const [isAdding, setIsAdding] = useState(false);
  const [rate, setRate] = useState(currentUsdRate ? currentUsdRate : 0);
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [customerType, setCustomerType] = useState("company");
  const [customer, setCustomer] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [clientId, setClientId] = useState("");
  const [clientName, setClientName] = useState("");
  const [searchUrl, setSearchUrl] = useState(reverseUrl("get_searched_companies"));
  const [individualPrice, setIndividualPrice] = useState(0);
  const [companyPrice, setCompanyPrice] = useState(0);
  const [specialPricingData, setSpecialPricingData] = useState([]);
  const [defaultIndividualPrice, setDefaultIndividualPrice] = useState(
    individualCharge ? individualCharge : 1
  );
  const [defaultCompanyPrice, setDefaultCompanyPrice] = useState(companyCharge ? companyCharge : 2);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    setSpecialPricingData(clientData);
  }, []);

  useEffect(() => {
    if (customerType === "company") {
      setSearchUrl(reverseUrl("get_searched_companies"));
    }
    if (customerType === "individual") {
      setSearchUrl(reverseUrl("get_searched_individuals"));
    }
  }, [customerType]);

  const onRateUpdate = async () => {
    setLoading(true);
    toast.loading("Updating...", { id: "update_rate", duration: 3000 });
    try {
      const response = await axios.post(reverseUrl("update_usd_rate"), {
        rate: Number(rate),
        individualPrice: Number(defaultIndividualPrice),
        companyPrice: Number(defaultCompanyPrice),
      });
      if (response.data.status === "success") {
        toast.success("Rate Updated Successfully", { id: "update_rate" });
      } else {
        toast.error(response.data.message || "Something went wrong! Please try again", {
          id: "update_rate",
        });
      }
    } catch (error) {
      toast.error("Something went wrong! Please try again", {
        id: "update_rate",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSpecialPricingUpdate = async () => {
    if (isAdding) {
      try {
        setAddLoading(true);
        toast.loading("Updating...", { id: "update_special_pricing" });
        const response = await axios.post(reverseUrl("create_special_pricing"), {
          clientCustomer: clientName,
          currencyType: currency,
          individualCharge: individualPrice,
          companyCharge: companyPrice,
        });
        if (response.data.status === "success") {
          toast.success("Special Pricing Updated Successfully", {
            id: "update_special_pricing",
          });
          setSpecialPricingData([
            ...specialPricingData,
            {
              id: response.data.special_pricing,
              client_company: clientName,
              currency_type: currency,
              individual_charge: individualPrice,
              company_charge: companyPrice,
            },
          ]);
          setCompanyPrice(0);
          setIndividualPrice(0);
          setCurrency("USD");
          setCustomer("");
          setIsAdding(false);
          setErrors([]);
        } else {
          toast.error("Something went wrong! Please try again", {
            id: "update_special_pricing",
          });
          setErrors(response.data.errors);
          return;
        }
      } catch (error) {
        toast.error("Something went wrong! Please try again", {
          id: "update_special_pricing",
        });
      } finally {
        setAddLoading(false);
      }
    } else {
      setIsAdding(true);
    }
  };

  const removeSpecialPricing = async (index, client) => {
    const specialPricingId = client.id;
    try {
      toast.loading("Updating...", { id: "update_special_pricing" });
      if (!specialPricingId) {
        toast.error("Data is not loaded correctly, please reload page.", {
          id: "update_special_pricing",
        });
      }
      const response = await axios.post(reverseUrl("delete_special_pricing"), {
        specialPricingId,
      });
      if (response.data.status === "success") {
        toast.success("Special Pricing Updated Successfully", {
          id: "update_special_pricing",
        });
      } else {
        toast.error("Something went wrong! Please try again", {
          id: "update_special_pricing",
        });
        return;
      }
      const data = [...specialPricingData];
      data.splice(index, 1);
      setSpecialPricingData(data);
      toast.success("Updated successifully", {
        id: "update_special_pricing",
      });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong! Please try again", {
        id: "update_special_pricing",
      });
    }
  };

  return (
    <>
      <div className="card mt-2" style={{ width: "100%", marginLeft: "-3px" }}>
        <div className="card">
          <div
            className="card-header bg-info px-4"
            style={{ paddingTop: "2px", paddingBottom: "2px" }}
          >
            <div
              className="d-flex justify-content-center
            align-items-center"
            >
              <div className="me-4">
                <h6 className="display-6 mb-0 text-white">SUBSCRIPTION PRICING</h6>
                <div className="card-text"></div>
              </div>
            </div>
          </div>
          <div
            className=""
            style={{
              borderStyle: "solid",
              borderColor: "#26a69a",
            }}
          >
            <div className="data-table py-4">
              <div className="table-responsive rounded">
                <table className="table table-bordered">
                  <tr className="bg-info text-white p-4">
                    <th className="px-4 py-1">Today Date</th>
                    <th className="px-4 py-1">Last Change</th>
                    <th className="text-center w-25">USD Rate</th>
                  </tr>
                  <tbody>
                    <tr
                      style={{
                        lineHeight: "5px",
                        fontSize: "12px",
                      }}
                    >
                      <td>
                        {parseInt(new Date().getDate()) < 10
                          ? "0" + new Date().getDate()
                          : new Date().getDate()}{" "}
                        - {new Date().toDateString().split(" ")[1]} - {new Date().getFullYear()}
                      </td>
                      <td>{lastDayChanged}</td>

                      {
                        <td>
                          <input
                            type="number"
                            value={rate}
                            onChange={(e) => {
                              setRate(e.target.value);
                            }}
                            className="form-control form-control-sm"
                          />
                        </td>
                      }
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="d-flex justify-content-center align-items-center">
              <h6
                className="display-6 text-center bg-info text-white px-4"
                style={{ width: "100%" }}
              >
                RentSafe
              </h6>
            </div>
            <div className="data-table p-4">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <tr>
                    <th scope="row">Customers</th>
                    <th>Currency</th>
                    <th className="text-end">Individual Per Month</th>
                    <th className="text-end">Company Per Month</th>
                    <th></th>
                  </tr>
                  <tbody>
                    <tr
                      style={{
                        lineHeight: "5px",
                        fontSize: "12px",
                      }}
                    >
                      <td scope="row">All</td>
                      <td>USD</td>
                      <td className="text-end w-25">
                        <input
                          type="number"
                          value={defaultIndividualPrice}
                          onChange={(e) => {
                            setDefaultIndividualPrice(e.target.value);
                          }}
                          className="form-control form-control-sm"
                        />
                      </td>
                      <td className="text-end w-25 ">
                        <input
                          type="number"
                          value={defaultCompanyPrice}
                          onChange={(e) => {
                            setDefaultCompanyPrice(e.target.value);
                          }}
                          className="form-control form-control-sm"
                        />
                      </td>
                      <td></td>
                    </tr>
                    <tr
                      style={{
                        lineHeight: "5px",
                        fontSize: "12px",
                      }}
                    >
                      <td scope="row">All</td>
                      <td>ZWG</td>
                      <td className="text-end">
                        {formatCurrency(Number(rate) * defaultIndividualPrice)}
                      </td>
                      <td className="text-end">
                        {formatCurrency(Number(rate) * defaultCompanyPrice)}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div
                  className="d-flex justify-content-end align-items-center p-4"
                  onClick={onRateUpdate}
                >
                  <button className="btn btn-success text-white">
                    {loading ? "Updating..." : "Update"}
                  </button>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center align-items-center px-4 w-100  bg-info rounded-4 ">
              <h6
                className="display-6 text-start px-4 w-100 text-white"
                // style={{ backgroundColor: '#00ff00' }}
              >
                RentSafe Special Pricing
              </h6>
            </div>
            <div className="table-responsive">
              <table className="table table-bordered">
                <tbody>
                  {specialPricingData.length > 0 &&
                    specialPricingData.map((data, index) => (
                      <tr
                        key={index}
                        style={{
                          lineHeight: "5px",
                          fontSize: "12px",
                        }}
                      >
                        <th scope="row">{data.client_company}</th>
                        <td>{data.currency_type}</td>
                        <td className="text-end">{formatCurrency(data.individual_charge)}</td>
                        <td className="text-end">{formatCurrency(data.company_charge)}</td>
                        <td
                          className="text-center bg-info text-white"
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() => removeSpecialPricing(index, data)}
                        >
                          <i className="material-icons p-0">remove</i>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {isAdding && (
                <div
                  className="p-4"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
                    gap: "10px",
                  }}
                >
                  <div>
                    <select
                      className="form-select form-select-sm  flex-1"
                      aria-label="Default select example"
                      value={customerType}
                      onChange={(e) => {
                        setCustomerType(e.target.value);
                        setCustomer("");
                        setClientId("");
                        setClientName("");
                        setCurrency("USD");
                        setErrors([]);
                        setAddLoading(false);
                        setIndividualPrice(0);
                        setCompanyPrice(0);
                      }}
                    >
                      <option selected>Client Type (Default is C)</option>
                      <option value="Individual">I</option>
                      <option value="company">C</option>
                    </select>
                    {errors && errors.clientType && (
                      <p className="text-danger">{errors.clientType}</p>
                    )}
                  </div>
                  <div>
                    <SearchComponent
                      placeholder={"Type client name or ID/Reg. No."}
                      url={searchUrl}
                      value={customer}
                      type={customerType}
                      setValue={setCustomer}
                      setClientName={setClientName}
                      setClientId={setClientId}
                    />
                    {errors && errors.clientCustomer && (
                      <p className="text-danger">{errors.clientCustomer}</p>
                    )}
                  </div>
                  <div>
                    <select
                      className="form-select form-select-sm  flex-1"
                      aria-label="Default select example"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                    >
                      <option selected>Currency</option>
                      <option value="USD">USD</option>
                      <option value="ZWG">ZWG</option>
                    </select>
                    {errors && errors.currencyType && (
                      <p className="text-danger">{errors.currencyType}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="number"
                      className="form-control form-control-sm flex-1"
                      value={individualPrice > 0 ? individualPrice : ""}
                      placeholder="Individual Price Per Month"
                      onChange={(e) => setIndividualPrice(e.target.value)}
                    />
                    {errors && errors.individualCharge && (
                      <p className="text-danger">{errors.individualCharge}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="number"
                      className="form-control form-control-sm flex-1"
                      value={companyPrice > 0 ? companyPrice : ""}
                      placeholder="Company Price Per Month"
                      onChange={(e) => setCompanyPrice(e.target.value)}
                    />
                    {errors && errors.companyCharge && (
                      <p className="text-danger">{errors.companyCharge}</p>
                    )}
                  </div>
                </div>
              )}
              <div className="d-flex justify-content-end align-items-center p-4">
                <button
                  className="btn btn-primary text-white"
                  onClick={onSpecialPricingUpdate}
                  disabled={addLoading}
                >
                  {!isAdding && <i className="material-icons">add</i>}
                  {addLoading ? "Adding..." : isAdding ? "Submit" : "Add New"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pricing;
