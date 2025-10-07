import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "todo:v1";
const THEME_KEY = "theme";

function uid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID)
    return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const fmt = (ts) => (ts ? new Date(ts).toLocaleString() : "");

const FILTERS = {
  all: () => true,
  active: (t) => !t.completed,
  completed: (t) => t.completed,
};

export default function App() {
  const [theme, setTheme] = useState(() => {
    const s = localStorage.getItem(THEME_KEY);
    if (s === "light" || s === "dark") return s;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const [todos, setTodos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {}
  }, [todos]);

  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [toast, setToast] = useState(null);

  const visible = useMemo(() => todos.filter(FILTERS[filter]), [todos, filter]);
  const remaining = useMemo(
    () => todos.filter((t) => !t.completed).length,
    [todos]
  );

  const showToast = (txt) => {
    setToast(txt);
    setTimeout(() => setToast(null), 1400);
  };

  const addTodo = (e) => {
    e?.preventDefault();
    const v = text.trim();
    if (!v) return;
    const id = uid();
    setTodos((p) => [
      { id, text: v, completed: false, createdAt: Date.now() },
      ...p,
    ]);
    setText("");
    showToast("Tarea agregada");
  };

  const toggleTodo = (id) => {
    setTodos((p) =>
      p.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? Date.now() : null,
            }
          : t
      )
    );
  };

  const removeTodo = (id) => {
    setTodos((p) => p.filter((t) => t.id !== id));
    showToast("Tarea eliminada");
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };
  const commitEdit = () => {
    const v = editingText.trim();
    if (!v) setTodos((p) => p.filter((t) => t.id !== editingId));
    else
      setTodos((p) =>
        p.map((t) => (t.id === editingId ? { ...t, text: v } : t))
      );
    setEditingId(null);
    setEditingText("");
  };

  const clearCompleted = () => setTodos((p) => p.filter((t) => !t.completed));

  return (
    <div
      className={`min-h-screen ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      <div className="px-5 py-8">
        <div className="mx-auto max-w-3xl flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">✅ To‑Do App</h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Cada pequeño hábito suma — hoy podés con todo 💪
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              className="px-3 py-2 rounded bg-white/60 dark:bg-gray-800"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </div>

      <main className="px-5 pb-20 -mt-4">
        <section className="mx-auto max-w-3xl">
          <div
            className={`rounded-2xl shadow p-4 ${
              theme === "light" ? "bg-[#c8ad7e] text-black" : "bg-gray-800"
            }`}
          >
            <form onSubmit={addTodo} className="flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1 rounded px-3 py-2 border"
                placeholder="Escribí una tarea y presioná Enter…"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded"
              >
                Agregar
              </button>
            </form>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm">
                Pendientes: <strong>{remaining}</strong>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-3 py-1 rounded flex items-center gap-2 ${
                    filter === "all"
                      ? "bg-indigo-600 text-white"
                      : theme === "dark"
                      ? "bg-gray-200 text-black"
                      : "bg-gray-400 text-black border border-gray-500"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full ${
                      filter === "all"
                        ? "bg-indigo-600"
                        : theme === "dark"
                        ? "bg-gray-200"
                        : "bg-gray-500"
                    }`}
                  ></span>
                  Todas
                </button>
                <button
                  onClick={() => setFilter("active")}
                  className={`px-3 py-1 rounded flex items-center gap-2 ${
                    filter === "active"
                      ? "bg-indigo-600 text-white"
                      : theme === "dark"
                      ? "bg-gray-200 text-black"
                      : "bg-gray-400 text-black border border-gray-500"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full ${
                      filter === "active"
                        ? "bg-green-600"
                        : theme === "dark"
                        ? "bg-gray-200"
                        : "bg-gray-500"
                    }`}
                  ></span>
                  Activas
                </button>
                <button
                  onClick={() => setFilter("completed")}
                  className={`px-3 py-1 rounded flex items-center gap-2 ${
                    filter === "completed"
                      ? "bg-indigo-600 text-white"
                      : theme === "dark"
                      ? "bg-gray-200 text-black"
                      : "bg-gray-400 text-black border border-gray-500"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full ${
                      filter === "completed"
                        ? "bg-red-600"
                        : theme === "dark"
                        ? "bg-gray-200"
                        : "bg-gray-500"
                    }`}
                  ></span>
                  Completadas
                </button>
              </div>
            </div>

            <ul className="mt-4 divide-y">
              {visible.length === 0 && (
                <li className="p-6 text-center text-sm text-slate-500">
                  {todos.length === 0
                    ? "No hay tareas aún"
                    : "No hay tareas que coincidan con el filtro."}
                </li>
              )}

              <AnimatePresence>
                {visible.map((t) => (
                  <motion.li
                    key={t.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-start gap-3 px-3 py-3"
                  >
                    <div className="pt-1">
                      <input
                        type="checkbox"
                        checked={t.completed}
                        onChange={() => toggleTodo(t.id)}
                      />
                    </div>
                    <div className="flex-1">
                      {!editingId || editingId !== t.id ? (
                        <div
                          className={`${
                            t.completed ? "line-through text-slate-400" : ""
                          }`}
                          onDoubleClick={() => startEdit(t.id, t.text)}
                        >
                          {t.text}
                        </div>
                      ) : (
                        <input
                          autoFocus
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          onBlur={commitEdit}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") commitEdit();
                            if (e.key === "Escape") {
                              setEditingId(null);
                              setEditingText("");
                            }
                          }}
                          className="w-full rounded border px-2 py-1"
                        />
                      )}
                      <div className={`text-xs mt-1 ${theme === "light" ? "text-black" : "text-slate-400"}`}>
                        Creada: {fmt(t.createdAt)}
                        {t.completed && t.completedAt
                          ? ` 
                            · Completada: ${fmt(t.completedAt)}`
                          : ""}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 text-xs">
                      <button
                        onClick={() => startEdit(t.id, t.text)}
                        className="text-indigo-600"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => removeTodo(t.id)}
                        className="text-red-600"
                      >
                        Eliminar
                      </button>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            <div className="mt-4 text-center">
              <button
                onClick={clearCompleted}
                className={`px-3 py-1 rounded ${
                  theme === "dark"
                    ? "bg-gray-200 text-black"
                    : "bg-gray-400 text-black border border-gray-500"
                }`}
              >
                Limpiar completadas
              </button>
            </div>
          </div>

          {toast && (
            <div className="fixed left-1/2 transform -translate-x-1/2 bottom-6 z-50">
              <div className="rounded px-4 py-2 bg-black text-white">
                {toast}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
