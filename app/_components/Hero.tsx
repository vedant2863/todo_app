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
const TodoItem = React.memo(({ todo, onToggleComplete, onEdit, onDelete, onMoveUp, onMoveDown }: TodoItemProps) => (
  <li
    className={`text-2xl text-indigo-900 px-5 py-3 flex items-center justify-between border border-indigo-800 rounded-md my-3 ${
      todo.complete ? "line-through bg-red-800" : "bg-green-300"
    }`}
  >
    <input
      className="flex justify-around items-center mx-5"
      type="checkbox"
      id={todo.id}
      checked={todo.complete}
      onChange={() => onToggleComplete(todo.id)}
    />
    <span>{todo.text}</span>
    <span className="flex justify-around items-center mx-9">
      <button className="flex justify-around items-center mx-5" onClick={() => onMoveUp(todo.id)}>
        <AiOutlineArrowUp />
      </button>
      <button className="flex justify-around items-center mx-5" onClick={() => onMoveDown(todo.id)}>
        <AiOutlineArrowDown />
      </button>
      <button onClick={() => onEdit(todo.id)} type="button" className="flex justify-around items-center mx-5 rounded-full px-3 py-3 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-indigo-900 h-8 w-8">
        <CiEdit />
      </button>
      <button onClick={() => onDelete(todo.id)} className="flex justify-around items-center mx-5 bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md">
        <MdDelete />
      </button>
    </span>
  </li>
));

const Hero = () => {
  const [todo, setTodo] = useState<string>("");
  const [todos, setTodos] = useState<TodoProps[]>([]);

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
    if (todo.length > 0) {
      setTodos((prevTodos) => [...prevTodos, { id: uuidv4(), text: todo, complete: false }]);
      setTodo("");
    } else {
      alert("Please enter a todo text.");
    }
  }, [todo]);

  const handleDelete = useCallback((id: string) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  }, []);

  const handleEdit = useCallback((id: string) => {
    const todoToEdit = todos.find((i) => i.id === id);
    if (todoToEdit) {
      setTodo(todoToEdit.text);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    }
  }, [todos]);

  const handleToggleComplete = useCallback((id: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === id ? { ...todo, complete: !todo.complete } : todo))
    );
  }, []);

  const updateTodosOrder = useCallback((id: string, direction: "up" | "down") => {
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
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setTodo(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  return (
    <>
      <div className="flex justify-center items-center border border-indigo-600 rounded-lg px-5">
        <div className="m-5">
          <h1 className="text-3xl flex justify-center">Enter your Todo</h1>
          <input
            className="bg-red-400 text-black w-[60vw]"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            value={todo}
          />
        </div>
        <button
          onClick={handleAdd}
          type="button"
          className="rounded-full px-3 py-3 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-indigo-900 h-8 w-8 hover:bg-indigo-600"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <hr className="shadow-2xl shadow-slate-800" />

      <div className="flex justify-center items-center">
        {todos.length > 0 ? (
          <ul>
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
