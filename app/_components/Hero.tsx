"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { v4 as uuidv4 } from "uuid";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";

interface TodoProps {
  id: string;
  text: string;
  complete: boolean;
}

interface TodoItemProps {
  todo: TodoProps;
  onToggleComplete: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
}

// A memoized TodoItem component to avoid unnecessary re-renders
const TodoItem = React.memo(
  ({
    todo,
    onToggleComplete,
    onEdit,
    onDelete,
    onMoveUp,
    onMoveDown,
  }: TodoItemProps) => (
    <li
      className={`text-xl text-indigo-900 px-5 py-3 flex flex-col sm:flex-row items-center justify-between border border-indigo-800 rounded-md my-3 transition-all duration-300 transform ${
        todo.complete
          ? "line-through bg-red-200 hover:scale-105"
          : "bg-green-200 hover:bg-green-300 hover:scale-105"
      }`}
    >
      <div className="flex items-center">
        <input
          className="mx-2"
          type="checkbox"
          id={todo.id}
          checked={todo.complete}
          onChange={() => onToggleComplete(todo.id)}
        />
        <span>{todo.text}</span>
      </div>
      <div className="flex mt-2 sm:mt-0">
        <button
          className="flex items-center mx-1 transition-transform duration-200 hover:scale-110"
          onClick={() => onMoveUp(todo.id)}
        >
          <AiOutlineArrowUp />
        </button>
        <button
          className="flex items-center mx-1 transition-transform duration-200 hover:scale-110"
          onClick={() => onMoveDown(todo.id)}
        >
          <AiOutlineArrowDown />
        </button>
        <button
          onClick={() => onEdit(todo.id)}
          type="button"
          className="flex items-center mx-1 rounded-full px-2 py-2 text-sm font-semibold text-white shadow-sm focus:outline-none bg-indigo-900 h-8 w-8 hover:bg-indigo-600 transition-transform duration-200 hover:scale-110"
        >
          <CiEdit />
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="flex items-center mx-1 bg-violet-800 hover:bg-violet-950 p-2 text-sm font-bold text-white rounded-md transition-transform duration-200 hover:scale-110"
        >
          <MdDelete />
        </button>
      </div>
    </li>
  )
);

const Hero = () => {
  const [todo, setTodo] = useState<string>("");
  const [todos, setTodos] = useState<TodoProps[]>([]);
  const [warning, setWarning] = useState<string>("");

  useEffect(() => {
    const todoString = localStorage.getItem("todos");
    if (todoString) {
      const todos = JSON.parse(todoString);
      setTodos(todos);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleAdd = useCallback(() => {
    if (todo.trim().length > 0) {
      setTodos((prevTodos) => [
        ...prevTodos,
        { id: uuidv4(), text: todo, complete: false },
      ]);
      setTodo("");
      setWarning("");
    } else {
      setWarning("Please enter a todo text.");
    }
  }, [todo]);

  const handleDelete = useCallback((id: string) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  }, []);

  const handleEdit = useCallback(
    (id: string) => {
      const todoToEdit = todos.find((i) => i.id === id);
      if (todoToEdit) {
        setTodo(todoToEdit.text);
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      }
    },
    [todos]
  );

  const handleToggleComplete = useCallback((id: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, complete: !todo.complete } : todo
      )
    );
  }, []);

  const updateTodosOrder = useCallback(
    (id: string, direction: "up" | "down") => {
      setTodos((prevTodos) => {
        const todoIndex = prevTodos.findIndex((todo) => todo.id === id);
        if (
          todoIndex === -1 ||
          (direction === "up" && todoIndex === 0) ||
          (direction === "down" && todoIndex === prevTodos.length - 1)
        ) {
          return prevTodos;
        }
        const newTodos = [...prevTodos];
        if (direction === "up") {
          [newTodos[todoIndex], newTodos[todoIndex - 1]] = [
            newTodos[todoIndex - 1],
            newTodos[todoIndex],
          ];
        } else {
          [newTodos[todoIndex], newTodos[todoIndex + 1]] = [
            newTodos[todoIndex + 1],
            newTodos[todoIndex],
          ];
        }
        return newTodos;
      });
    },
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setTodo(e.target.value);
    setWarning("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-center items-center border border-indigo-600 rounded-lg px-5 w-full sm:w-[90vw] mx-auto my-4">
        <div className="m-5 w-full sm:w-auto">
          <h1 className="text-3xl flex justify-center mb-2">Enter your Todo</h1>
          <input
            className="bg-red-200 text-black w-full sm:w-[60vw] py-2 px-3 rounded-md"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            value={todo}
          />
          {warning && <p className="text-red-500 mt-1">{warning}</p>}
        </div>
        <button
          onClick={handleAdd}
          type="button"
          className="rounded-full px-3 py-3 text-sm font-semibold text-white shadow-sm focus:outline-none bg-indigo-900 h-12 w-12 hover:bg-indigo-600 transition-transform duration-200 hover:scale-110 mt-2 sm:mt-0"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>
      <hr className="shadow-2xl shadow-slate-800 my-4" />

      <div className="flex justify-center items-center">
        {todos.length > 0 ? (
          <ul className="w-full sm:w-[80vw]">
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onMoveUp={() => updateTodosOrder(todo.id, "up")}
                onMoveDown={() => updateTodosOrder(todo.id, "down")}
              />
            ))}
          </ul>
        ) : (
          <p>No todos yet.</p>
        )}
      </div>
    </>
  );
};

export default Hero;
