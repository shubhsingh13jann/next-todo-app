"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseClient } from "@/lib/supabase";

export async function createTodo(title: string, priority: string) {
  const supabase = getSupabaseClient();

  const { error } = await supabase.from("todos").insert([
    {
      title,
      priority,
      completed: false,
    },
  ]);

  if (error) {
    console.error("CREATE ERROR:", error);
  }

  revalidatePath("/");
}

export async function getTodos() {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("GET ERROR:", error);
  }

  return data || [];
}

export async function toggleTodo(id: string, completed: boolean) {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from("todos")
    .update({
      completed: !completed,
      completed_at: !completed ? new Date().toISOString() : null,
    })
    .eq("id", id);

  if (error) {
    console.error("TOGGLE ERROR:", error);
  }

  revalidatePath("/");
}

export async function deleteTodo(id: string) {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from("todos")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("DELETE ERROR:", error);
  }

  revalidatePath("/");
}

export async function getTasksByDate(date: string) {
  const supabase = getSupabaseClient();

  const start = new Date(date);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .gte("completed_at", start.toISOString())
    .lte("completed_at", end.toISOString());

  if (error) {
    console.error("DATE SEARCH ERROR:", error);
  }

  return data || [];
}

export async function getPendingTodos() {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("completed", false)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("PENDING ERROR:", error);
  }

  return data || [];
  
}
export async function updatePriority(id: string, priority: string) {
const supabase = getSupabaseClient();

const { error } = await supabase
  .from("todos")
  .update({ priority })
  .eq("id", id);

if (error) {
  console.error("PRIORITY UPDATE ERROR:", error);
}

revalidatePath("/");
}