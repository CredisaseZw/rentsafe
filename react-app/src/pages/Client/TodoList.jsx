import Layout from "../../components/Layouts/client/Layout.jsx";
import useToDoList from "../../hooks/page-hooks/useToDoList.js";
import WorksAndMaintenance from "../../components/Client/ClientView/WorksAndMaintenance.jsx";
import { formatCurrency } from "../../utils/formatting.js";
import { truncate } from "lodash";

export default function TodoList({ status, message, works, reminders, maintenance }) {
  const {
    todos,
    lease,
    username,
    viewDefaults,
    done,
    dismiss,
    closeWorks,
    goToOrigin,
    openScheduledWorks,
  } = useToDoList(works, reminders, maintenance);

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
          lease={lease}
          viewDefaults={viewDefaults}
        />
      )}

      <div>
        <h5 className="text-center bg-danger p-3 mb-0 text-white bg-info">To Do List</h5>

        <div className="custom-bg-grey-2 text-white text-center px-3 py-2 d-flex justify-content-between align-items-center">
          <div>{new Date().toDateString()}</div>
          <div>User: {username}</div>
        </div>

        <table className="table table-responsive table-bordered table-sm">
          <thead className="sticky-top bg-white shadow-sm">
            <tr>
              <th className="text-nowrap">#</th>
              <th className="text-nowrap custom-mn-w-07">Date</th>
              <th className="text-nowrap">Function</th>
              <th className="text-nowrap custom-mn-w-3">Details</th>
              <th className="text-nowrap">Balance Owing</th>
              <th className="text-nowrap custom-mn-w-06"></th>
              <th className="text-nowrap custom-mn-w-06"></th>
              <th className="text-nowrap custom-mn-w-06"></th>
            </tr>
          </thead>

          <tbody>
            {todos.map((todo, index) => (
              <tr key={index} className={todo.status === "DONE" ? "c-done-block" : ""}>
                <th className="text-nowrap">{index + 1}</th>

                <td>{todo.date ? new Date(todo.date).toISOString().split("T")[0] : "N/A"}</td>

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

                <th className="custom-w-5">
                  <p className={"m-0 c-line-clamp-1 " + (todo.status === "DONE" ? "c-done" : "")}>
                    <span className="text-capitalize">{todo?.title}</span>
                    {todo?.title && todo?.details ? " - " : ""}
                    <span className="text-capitalize"> {todo?.details}</span>
                  </p>
                </th>

                <td
                  style={{
                    backgroundColor: todo.color ? todo.color : "inherit",
                    color: todo.color ? "white" : "inherit",
                  }}
                  className="text-center d-block"
                >
                  <div>
                    {todo.balance_owing
                      ? todo.balance_owing < 0
                        ? `(${formatCurrency(todo.balance_owing * -1)})`
                        : formatCurrency(todo.balance_owing)
                      : "_"}
                  </div>
                </td>

                <td
                  onClick={() => goToOrigin(todo)}
                  className="bg-info text-white text-center c-pointer"
                >
                  View
                </td>

                <td
                  className={
                    "text-white text-center " +
                    (todo.status === "DONE" ? "c-muted c-not-allowed" : "bg-success c-pointer")
                  }
                  onClick={todo.status === "DONE" ? undefined : () => done(todo)}
                >
                  Done
                </td>

                <td
                  className="text-white text-center bg-danger c-pointer"
                  onClick={() => dismiss(todo)}
                >
                  Dismiss
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!Boolean(todos.length) && (
          <div className="custom-h-2 d-flex justify-content-center align-items-center border border-2">
            Nothing to show
          </div>
        )}
      </div>
    </>
  );
}

TodoList.layout = (page) => <Layout children={page} title="Todo List" />;
