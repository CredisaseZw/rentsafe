import Layout from "../../components/Layouts/client/Layout.jsx";
import useToDoList from "../../hooks/page-hooks/useToDoList.js";
import WorksAndMaintenance from "../../components/Client/ClientView/WorksAndMaintenance.jsx";
import { formatCurrency } from "../../utils/formatting.js";
import { truncate } from "lodash";
import { friendlyDate } from "../../utils/index.js";

export default function TodoList({ status, message, works, reminders, maintenance, Auth }) {
  const {
    todos,
    username,
    viewDefaults,
    done,
    dismiss,
    closeWorks,
    goToOrigin,
    openScheduledWorks,
  } = useToDoList(works, reminders, maintenance, Auth);

  if (status === "error") {
    return (
      <div className="alert alert-danger d-flex gap-2 align-items-center" role="alert">
        {truncate(message, { length: 200 })}
      </div>
    );
  }

  return (
    <>
      {Boolean(viewDefaults) && (
        <WorksAndMaintenance
          isOpen={Boolean(viewDefaults)}
          close={closeWorks}
          lease={{}}
          viewDefaults={viewDefaults}
        />
      )}

      <h6 className="text-center bg-danger p-1 m-0 text-white rounded-3">To Do List</h6>

      <div className="p-2 fw-bold d-flex justify-content-between align-items-center">
        <div>{friendlyDate(new Date())}</div>
        <div>{username}</div>
      </div>

      <table className="table table-responsive table-bordered table-sm bg-white">
        <thead className="position-sticky bg-white shadow-sm c-table-top text-nowrap">
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Function</th>
            <th className="custom-mn-w-5">Details</th>
            <th>Balance Owing</th>
            <th className="custom-mn-w-06"></th>
          </tr>
        </thead>

        <tbody>
          {todos.map((todo, index) => (
            <tr key={index} className={todo.status === "DONE" ? "c-done-block" : ""}>
              <th className="text-nowrap ps-3">{index + 1}</th>

              <td className="ps-3 text-nowrap">
                {todo.date ? new Date(todo.date).toISOString().split("T")[0] : "N/A"}
              </td>

              {todo.function.toLowerCase() === "works" ? (
                <td
                  onClick={() => openScheduledWorks(todo)}
                  className={`text-white bg-primary text-center ${todo.function === "works" ? "c-pointer" : ""}`}
                >
                  {todo.function}
                </td>
              ) : (
                <th className="text-nowrap text-center bg-light">{todo.function}</th>
              )}

              <th className="custom-mn-w-4  px-2">
                <p className={"m-0 c-line-clamp-1" + (todo.status === "DONE" ? "c-done" : "")}>
                  <span className="text-capitalize">{todo?.title}</span>
                  {todo?.title && todo?.details ? " - " : ""}
                  <span className="text-capitalize"> {todo?.details}</span>
                </p>
              </th>

              <td>
                <div
                  className="text-center btn btn-sm w-100 d-block"
                  style={{
                    cursor: "default",
                    backgroundColor: todo.color ? todo.color : "inherit",
                    color: todo.color ? "white" : "inherit",
                  }}
                >
                  {todo.balance_owing
                    ? todo.balance_owing < 0
                      ? `(${formatCurrency(todo.balance_owing * -1)})`
                      : formatCurrency(todo.balance_owing)
                    : "_"}
                </div>
              </td>

              <td>
                <div className="d-flex justify-content-center align-items-center gap-2">
                  <button
                    onClick={() => goToOrigin(todo)}
                    className="btn btn-sm flex-fill justify-content-center btn-info text-white"
                  >
                    View
                  </button>

                  <button
                    disabled={todo.status === "DONE"}
                    className={"btn btn-sm btn-success flex-fill justify-content-center "}
                    onClick={() => done(todo)}
                  >
                    Done
                  </button>

                  <button
                    className="btn btn-sm btn-danger flex-fill justify-content-center"
                    onClick={() => dismiss(todo)}
                  >
                    Dismiss
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {!Boolean(todos.length) && (
            <tr>
              <td colSpan={6} className="p-5 text-center">
                Nothing to show
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}

TodoList.layout = (page) => <Layout children={page} title="Todo List" />;
