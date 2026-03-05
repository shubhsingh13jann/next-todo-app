export const dynamic = "force-dynamic";

import { getTodos, toggleTodo, deleteTodo, getTasksByDate, updatePriority } from "./todos/actions";
import { TodoForm } from "./todos/components/todo-form";
import { Button } from "@/components/ui/button";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  created_at: string;
  completed_at: string | null;
};

export default async function TodosPage() {
  const todos: Todo[] | null = await getTodos();

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-4">

      <h1 className="text-2xl font-bold">Todos</h1>

      {/* Create Todo */}
      <TodoForm />

      <form
        action={async (formData) => {
          "use server";
          const date = formData.get("date") as string;
          const tasks = await getTasksByDate(date);
          console.log(tasks);
        }}
        className="flex gap-2 items-center mt-4"
      >
        <input
          type="date"
          name="date"
          className="border p-2 rounded"
        />
        <Button type="submit">Search</Button>
      </form>

      {todos?.map((todo: Todo) => {

        const pendingDays = Math.floor(
          (Date.now() - new Date(todo.created_at).getTime()) /
            (1000 * 60 * 60 * 24)
        );

        return (
          <div
            key={todo.id}
            className="p-4 border rounded-lg flex flex-col gap-2"
          >
            {/* Title + Assigned Date */}
            <div className="flex justify-between items-center">

              {/* Task title */}
              <span className={todo.completed ? "line-through font-medium" : "font-medium"}>
                {todo.title}
              </span>

              {/* Assigned date + counter */}
              <div className="text-xs text-gray-500 text-right">
                <p>
                  Assigned: {new Date(todo.created_at).toLocaleDateString()}
                </p>

                <p className="text-blue-600 font-medium">
                  {pendingDays} day{pendingDays !== 1 ? "s" : ""} ago
                </p>
              </div>

            </div>

            {/* Priority + Edit */}
            <div className="flex items-center gap-2 text-xs text-gray-500">

              <span>
                Priority: <span className="font-semibold">{todo.priority}</span>
              </span>

              <form
                action={async (formData) => {
                  "use server";
                  const priority = formData.get("priority") as string;
                  await updatePriority(todo.id, priority);
                }}
              >
                <select
                  name="priority"
                  defaultValue={todo.priority}
                  className="border rounded px-1 py-0.5 text-xs"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>

                <Button type="submit" size="sm">
                  Update
                </Button>
              </form>

            </div>

            {/* Pending days */}
            {!todo.completed && (
              <p className="text-xs text-red-500">
                Pending for:{" "}
                {Math.floor(
                  (Date.now() - new Date(todo.created_at).getTime()) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                days
              </p>
            )}

            {/* Completed date */}
            {todo.completed && todo.completed_at && (
              <p className="text-xs text-green-600">
                Completed on:{" "}
                {new Date(todo.completed_at).toLocaleDateString()}
              </p>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 pt-2">
              <form
                action={async () => {
                  "use server";
                  await toggleTodo(todo.id, todo.completed);
                }}
              >
                <Button type="submit">Toggle</Button>
              </form>

              <form
                action={async () => {
                  "use server";
                  await deleteTodo(todo.id);
                }}
              >
                <Button variant="destructive" type="submit">
                  Delete
                </Button>
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
}