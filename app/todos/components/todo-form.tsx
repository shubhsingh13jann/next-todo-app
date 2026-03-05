"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTodo } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  title: z.string().min(3),
  priority: z.enum(["low", "medium", "high"]),
});

type FormData = z.infer<typeof schema>;

export function TodoForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  

  const onSubmit = async (data: FormData) => {
    await createTodo(data.title, data.priority);
    form.reset();
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">

      <Input {...form.register("title")} placeholder="New todo" />

      <select {...form.register("priority")} className="border p-2 rounded">
        
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>

      </select>

      <Button type="submit">Add</Button>
      
    </form>
  );
}
