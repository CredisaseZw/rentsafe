import Layout from "../../components/Layouts/client/Layout.jsx";
import useToDoList from "../../hooks/page-hooks/useToDoList.js";
import WorksAndMaintenance from "../../components/Client/ClientView/WorksAndMaintenance.jsx";
import { formatCurrency } from "../../utils/formatting.js";
import { truncate } from "lodash";
import { friendlyDate } from "../../utils/index.js";
import * as CustomTable from "../../components/Client/table/CustomTable.jsx";

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
    <div>
      {Boolean(viewDefaults) && (
        <WorksAndMaintenance
          isOpen={Boolean(viewDefaults)}
          close={closeWorks}
          lease={{}}
          viewDefaults={viewDefaults}
        />
      )}

      <CustomTable.Table tabletitle="To Do List" tabletitleBg="danger" tabletitleColor="white">
        <colgroup>
          <col style={{ width: "1%" }} />
          <col style={{ width: "1%" }} />
          <col style={{ width: "1%" }} />
          <col />
          <col style={{ width: "1%" }} />
          <col style={{ width: "1%" }} />
        </colgroup>

        <thead className={CustomTable.STICKY_TABLE_HEADER_CLASS}>
          <tr>
            <th colSpan={6}>
              <div className="fw-bold d-flex justify-content-between align-items-center">
                <div>{friendlyDate(new Date())}</div>
                <div>{username}</div>
              </div>
            </th>
          </tr>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Function</th>
            <th>Details</th>
            <th>Balance Owing</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {todos.map((todo, index) => (
            <tr key={index} className={todo.status === "DONE" ? "c-done-block" : ""}>
              <td>{index + 1}</td>

              <td className="ps-3 text-nowrap">{todo.date ? friendlyDate(todo.date) : "N/A"}</td>

              {todo.function.toLowerCase() === "works" ? (
                <td>
                  <CustomTable.ActionButtonTemplate
                    onClick={() => openScheduledWorks(todo)}
                    variant="primary"
                  >
                    {todo.function}
                  </CustomTable.ActionButtonTemplate>
                </td>
              ) : (
                <td className="text-nowrap text-center bg-light">{todo.function}</td>
              )}

              <td className={todo.status === "DONE" ? "c-done" : ""}>
                <small>
                  <span className="text-capitalize">{todo?.title}</span>
                  {todo?.title && todo?.details ? " - " : ""}
                  <span className="text-capitalize"> {todo?.details}</span>
                </small>
              </td>

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
                <CustomTable.ActionButtonsContainer>
                  <CustomTable.ActionButtonTemplate onClick={() => goToOrigin(todo)}>
                    View
                  </CustomTable.ActionButtonTemplate>

                  <CustomTable.ActionButtonTemplate
                    disabled={todo.status === "DONE"}
                    variant="success"
                    onClick={() => done(todo)}
                  >
                    Done
                  </CustomTable.ActionButtonTemplate>

                  <CustomTable.ActionButtonTemplate variant="danger" onClick={() => dismiss(todo)}>
                    Dismiss
                  </CustomTable.ActionButtonTemplate>
                </CustomTable.ActionButtonsContainer>
              </td>
            </tr>
          ))}

          {!Boolean(todos.length) && (
            <tr>
              <td colSpan={6}>
                <CustomTable.NothingToShow />
              </td>
            </tr>
          )}
        </tbody>
      </CustomTable.Table>
    </div>
  );
}

TodoList.layout = (page) => <Layout children={page} title="Todo List" />;
