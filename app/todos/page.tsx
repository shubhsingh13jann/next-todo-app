import { getTodos, toggleTodo, deleteTodo } from "./actions";
import { TodoForm } from "./components/todo-form";
import { Button } from "@/components/ui/button";

export default async function TodosPage() {
  const todos = await getTodos();

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-4">
      <h1 className="text-2xl font-bold">Todos</h1>

      <TodoForm />

      {todos?.map((todo) => (
        <div
          key={todo.id}
          className="flex justify-between p-3 border rounded-lg"
        >
          <span
            className={todo.completed ? "line-through" : ""}
          >
            {todo.title}
          </span>

          <div className="flex gap-2">
            <form action={() => toggleTodo(todo.id, todo.completed)}>
              <Button type="submit">Toggle</Button>
            </form>

            <form action={() => deleteTodo(todo.id)}>
              <Button variant="destructive" type="submit">
                Delete
              </Button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}
