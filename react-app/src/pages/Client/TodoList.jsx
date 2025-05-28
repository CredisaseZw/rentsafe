import Layout from "../../components/Layouts/client/Layout.jsx";

export default function TodoList({ status, message, works, reminders, maintenance }) {
  return (
    <div>
      <h1>Todo List</h1>
      <pre>
        {JSON.stringify(
          {
            status: status,
            message: message,
            works: works,
            reminders: reminders,
            maintenance: maintenance,
          },
          null,
          2
        )}
      </pre>
    </div>
  );
}

TodoList.layout = (page) => <Layout children={page} title="Todo List" />;
