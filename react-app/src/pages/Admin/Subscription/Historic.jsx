import React from "react";
import PageHeader from "../../../components/PageHeader.jsx";
import { Link } from "@inertiajs/inertia-react";

export default function Dashboard() {
  return (
    <main>
      <PageHeader title={"Historic Subscriptions"} />
      <div className="container-xl p-5">
        <div className="row align-items-center mb-5">
          <div className="col-md-6">
            <div className="card card-raised  overflow-hidden">
              <div className="card-header bg-info text-white px-4">
                <div className="fw-500 text-center"></div>
              </div>
              <div className="card-body p-0">
                <div className="d-flex justify-content-around mt-2 mb-2">
                  <div>
                    <Link
                      href={reverseUrl("historic-subs-individual")}
                      style={{ color: "#176987", textDecoration: "none" }}
                    >
                      Individual
                    </Link>
                  </div>
                  <div>|</div>
                  <div>
                    <Link
                      href={reverseUrl("historic-subs-company")}
                      style={{ color: "#176987", textDecoration: "none" }}
                    >
                      Company
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
