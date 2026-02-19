"use server";

import { supabase } from "@/lib/supabase";

export async function createTodo(title: string) {
  await supabase.from("todos").insert([{ title }]);
}

export async function getTodos() {
  const { data } = await supabase.from("todos").select("*");
  return data;
}

export async function toggleTodo(id: string, completed: boolean) {
  await supabase
    .from("todos")
    .update({ completed: !completed })
    .eq("id", id);
}

export async function deleteTodo(id: string) {
  await supabase.from("todos").delete().eq("id", id);
}
