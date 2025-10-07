import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "todo:v1";
const THEME_KEY = "theme"; // 'light' | 'dark'

const FILTERS = {
  all: () => true,
  active: (t) => !t.completed,
  completed: (t) => t.completed,
};
const FILTER_LABELS = {
  all: "Todas",
  active: "Activas",
  completed: "Completadas",
};

function uid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID)
    return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// Formateo de fecha/hora (es-AR, zona Salta)
const fmt = (ts) => {
  if (!ts) return "";
  try {
    return new Intl.DateTimeFormat("es-AR", {
      dateStyle: "medium",
      timeStyle: "short",
      hour12: false,
      timeZone: "America/Argentina/Salta",
    }).format(new Date(ts));
  } catch {
    return new Date(ts).toLocaleString();
  }
};

export default function App() {
  // Tema (clase .dark en <html>)
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  // To-dos
  const [todos, setTodos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
    } catch {
      return [];
    }
  });
  useEffect(
    () => localStorage.setItem(STORAGE_KEY, JSON.stringify(todos)),
    [todos]
  );

  const [filter, setFilter] = useState("all");
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const visible = useMemo(() => todos.filter(FILTERS[filter]), [todos, filter]);
  const remaining = useMemo(() => todos.filter(FILTERS.active).length, [todos]);

  function addTodo(e) {
    e.preventDefault();
    const val = text.trim();
    if (!val) return;
    setTodos((p) => [
      {
        id: uid(),
        text: val,
        completed: false,
        createdAt: Date.now(),
        completedAt: null,
      },
      ...p,
    ]);
    setText("");
  }

  // Toggle: setea/borra completedAt junto con completed
  const toggleTodo = (id) =>
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

  const removeTodo = (id) => {
    setTodos((p) => p.filter((t) => t.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditingText("");
    }
  };

  const startEdit = (id, current) => {
    setEditingId(id);
    setEditingText(current);
  };

  const commitEdit = () => {
    const val = editingText.trim();
    if (!val) {
      setTodos((p) => p.filter((t) => t.id !== editingId));
    } else {
      setTodos((p) =>
        p.map((t) => (t.id === editingId ? { ...t, text: val } : t))
      );
    }
    setEditingId(null);
    setEditingText("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };
  const clearCompleted = () => setTodos((p) => p.filter((t) => !t.completed));

  return (
    <div className="min-h-screen bg-gradient-to-b from-ink-50 to-ink-100 text-ink-800 dark:from-ink-900 dark:to-ink-900 dark:text-ink-100">
      {/* HERO: verde→violeta en claro; violeta oscuro→ink en oscuro */}
      <div className="relative overflow-hidden">
        <div
          className="
            absolute inset-0 bg-gradient-to-r
            from-brand-600 to-accent-600
            dark:from-accent-800 dark:to-ink-900
            transition-colors duration-300
          "
        />
        {/* Créditos + toggle tema */}
        <div className="absolute right-4 top-3 z-20 flex items-center gap-2 text-[11px] text-white/85">
          <span className="hidden sm:inline">Créditos a</span>
          <span className="font-semibold">Fernando Romera</span>
          <button
            onClick={toggleTheme}
            className="ml-2 rounded-full px-2 py-1 bg-white/20 border border-white/25 backdrop-blur
                       hover:bg-white/30 active:scale-[0.98] transition
                       dark:bg-ink-800/60 dark:border-ink-700 dark:hover:bg-ink-700"
            title="Cambiar tema"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>

        <header className="relative px-5 pt-14 pb-20">
          <div className="relative z-10 mx-auto max-w-3xl text-white drop-shadow">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              ✅To-Do App
            </h1>
            <p className="mt-2 text-brand-200">Tu lista, sin distracciones.</p>
          </div>
        </header>
      </div>

      {/* Card principal */}
      <main className="relative z-10 px-5 -mt-16 pb-20">
        <section className="mx-auto max-w-3xl">
          <div className="bg-white dark:bg-ink-800 rounded-2xl shadow-soft border border-ink-100 dark:border-ink-700">
            {/* Alta */}
            <form
              onSubmit={addTodo}
              className="p-4 sm:p-6 border-b border-ink-100 dark:border-ink-700"
            >
              <label htmlFor="new-todo" className="sr-only">
                Nueva tarea
              </label>
              <div className="flex gap-2">
                <input
                  id="new-todo"
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Escribí una tarea y presioná Enter…"
                  className="flex-1 rounded-xl border border-ink-200 dark:border-ink-600 px-4 py-3 outline-none
                             bg-white dark:bg-ink-800 text-ink-900 dark:text-ink-100
                             placeholder:text-ink-400 dark:placeholder:text-ink-500
                             focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-800/40"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="rounded-xl px-5 py-3 bg-red-600 text-white font-medium
                             hover:bg-red-700 active:scale-[0.99] transition shadow-soft"
                >
                  Agregar
                </button>
              </div>
            </form>

            {/* Controles */}
            <div className="px-4 sm:px-6 py-3 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="flex items-center gap-2" aria-live="polite">
                <span className="inline-flex items-center rounded-full bg-ink-100 dark:bg-ink-700 px-3 py-1 text-sm">
                  Pendientes:{" "}
                  <strong className="ml-1 text-ink-800 dark:text-white">
                    {remaining}
                  </strong>
                </span>
                {todos.length > 0 && (
                  <button
                    onClick={clearCompleted}
                    className="text-sm text-ink-500 dark:text-ink-300 hover:text-ink-700 dark:hover:text-white underline underline-offset-4"
                  >
                    Limpiar completadas
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {Object.keys(FILTERS).map((key) => {
                  const active = filter === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setFilter(key)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition
                        ${
                          active
                            ? "bg-ink-900 text-white border-ink-900 dark:bg-ink-100 dark:text-ink-900 dark:border-ink-100"
                            : "bg-white text-ink-700 border-ink-200 hover:border-ink-300 dark:bg-ink-800 dark:text-ink-200 dark:border-ink-600 dark:hover:border-ink-500"
                        } focus:outline-none focus:ring-2 focus:ring-brand-200 dark:focus:ring-brand-800/40`}
                      aria-pressed={active}
                    >
                      {FILTER_LABELS[key]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lista */}
            <ul className="divide-y divide-ink-100 dark:divide-ink-700/60">
              {visible.length === 0 && (
                <li className="p-10 text-center">
                  <div
                    className="inline-flex items-center gap-3 px-4 py-2 rounded-xl
                                  bg-brand-50 text-brand-700 border border-brand-100
                                  dark:bg-ink-700/40 dark:text-ink-100 dark:border-ink-600"
                  >
                    <span className="text-lg">✨</span>
                    <span>
                      {todos.length === 0
                        ? "No hay tareas. ¡Creá la primera y arrancá el día!"
                        : "No hay tareas que coincidan con el filtro."}
                    </span>
                  </div>
                </li>
              )}

              {visible.map((t) => {
                const isEditing = editingId === t.id;
                return (
                  <li
                    key={t.id}
                    className="group px-4 sm:px-6 py-3 flex items-start gap-3"
                  >
                    {/* Checkbox */}
                    <div className="pt-1">
                      <input
                        id={`chk-${t.id}`}
                        type="checkbox"
                        checked={t.completed}
                        onChange={() => toggleTodo(t.id)}
                        className="h-5 w-5 rounded border-ink-300 dark:border-ink-600 accent-brand-600 focus:ring-brand-300"
                      />
                    </div>

                    {/* Texto / edición */}
                    <div className="flex-1">
                      {!isEditing ? (
                        <>
                          <label
                            htmlFor={`chk-${t.id}`}
                            className={`block cursor-pointer select-text leading-relaxed ${
                              t.completed
                                ? "line-through decoration-2 decoration-danger-500 text-danger-500"
                                : "text-ink-900 dark:text-ink-50"
                            }`}
                            onDoubleClick={() => startEdit(t.id, t.text)}
                            title="Doble clic para editar"
                          >
                            {t.text}
                          </label>

                          {/* Metadatos: fechas */}
                          <div className="mt-1 text-[11px] text-ink-500 dark:text-ink-400">
                            <span>Creada: {fmt(t.createdAt)}</span>
                            {t.completed && t.completedAt && (
                              <span> · Completada: {fmt(t.completedAt)}</span>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <input
                            autoFocus
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            onBlur={commitEdit}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") commitEdit();
                              if (e.key === "Escape") cancelEdit();
                            }}
                            className="w-full rounded-lg border border-ink-300 dark:border-ink-600 px-3 py-2 outline-none
                                       bg-white dark:bg-ink-800 text-ink-900 dark:text-ink-100
                                       focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-800/40"
                            placeholder="Descripción de la tarea"
                          />

                          {/* Metadatos (solo lectura) mientras edito */}
                          <div className="mt-1 text-[11px] text-ink-500 dark:text-ink-400">
                            <span>Creada: {fmt(t.createdAt)}</span>
                            {t.completed && t.completedAt && (
                              <span> · Completada: {fmt(t.completedAt)}</span>
                            )}
                          </div>
                        </>
                      )}

                      {/* Acciones */}
                      <div className="mt-1 flex flex-wrap gap-3 opacity-0 group-hover:opacity-100 transition">
                        {!isEditing ? (
                          <button
                            onClick={() => startEdit(t.id, t.text)}
                            className="text-xs text-ink-500 dark:text-ink-300 hover:text-ink-700 dark:hover:text-white underline underline-offset-4"
                          >
                            Editar
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={commitEdit}
                              className="text-xs text-success-500 hover:text-success-500/90 underline underline-offset-4"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="text-xs text-ink-500 dark:text-ink-300 hover:text-ink-700 dark:hover:text-white underline underline-offset-4"
                            >
                              Cancelar
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => removeTodo(t.id)}
                          className="text-xs text-danger-500 hover:text-danger-500/90 underline underline-offset-4"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-ink-400 dark:text-ink-400 mt-6">
            Hecho con{" "}
            <span className="text-brand-600 dark:text-brand-400 font-medium">
              React/Vite/Tailwind CSS
            </span>
          </p>
        </section>
      </main>
    </div>
  );
}
