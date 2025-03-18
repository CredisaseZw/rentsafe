import { Head } from "@inertiajs/inertia-react";
import { useState } from "react";
import ActiveSub from "../../../components/ActiveSub.jsx";
import PageHeader from "../../../components/PageHeader.jsx";
import SubOrigination from "../../../components/SubOrigination.jsx";
import { Modal } from "react-bootstrap";

export default function Active() {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <main>
      <Head title="Active Subscriptions" />
      <PageHeader title={"Active Subscriptions"} />

      {isAdding && (
        <Modal
          show={isAdding}
          onHide={() => setIsAdding(false)}
          size="xl"
          backdrop="static"
          centered
        >
          <Modal.Header className="p-0">
            <div className="w-100 p-3 text-end">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="btn btn-danger btn-sm"
              >
                <i className="material-icons fs-3">close</i>
              </button>
            </div>
          </Modal.Header>

          <Modal.Body>
            <div className="py-5">
              <SubOrigination />
            </div>
          </Modal.Body>
        </Modal>
      )}

      <div className="p-4">
        <div className="text-end">
          <button className="btn btn-primary" onClick={() => setIsAdding((prev) => !prev)}>
            <i className="leading-icon material-icons">add</i>
            Add Subscription
          </button>
        </div>

        <ActiveSub />
      </div>
    </main>
  );
}
