"use client";
import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { uuid } from "uuidv4";
import { AiOutlineArrowUp } from "react-icons/ai";
import { AiOutlineArrowDown } from "react-icons/ai";

const Hero = () => {
  interface todoProps {
    id: string;
    text: string;
    complete: boolean;
  }

  //form data
  const [todo, setTodo] = useState<string>("");
  console.log(" form:", todo);

  //ALL Todos
  const [todos, setTodos] = useState<todoProps[]>([]);
  console.log(" todos:", todos);

  useEffect(() => {
    let todoString = localStorage.getItem("todos");
    if (todoString) {
      let todos = JSON.parse(todoString);
      setTodos(todos);
    }
  }, []);

  const saveTodos = () => {
    let ls = localStorage.setItem("todos", JSON.stringify(todos));
    console.log("Todos saved successfully to LS: ", ls);
  };

  const handleAdd = () => {
    if (todo.length > 0) {
      setTodos([...todos, { id: uuid(), text: todo, complete: false }]);
      setTodo("");
      saveTodos();
    } else {
      alert("Please enter a todo text.");
    }
  };

  const handleDelete = (id: string) => {
    const filteredTodos = todos.filter((todo) => todo.id !== id);
    setTodos(filteredTodos);
    saveTodos();
  };

  const handleEdit = (id: string) => {
    let t = todos.filter((i) => i.id === id);
    console.log(t);

    setTodo(t[0].text);
    const filteredTodos = todos.filter((todo) => todo.id !== id);
    setTodos(filteredTodos);
    saveTodos();
  };

  const handleToggleComplete = (id: string) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, complete: !todo.complete } : todo
    );
    setTodos(updatedTodos);
    saveTodos();
    console.log("toggle");
  };

  const updateTodosOrder = (id: string, direction: "up" | "down") => {
    const todoIndex = todos.findIndex((todo) => todo.id === id);
    if (
      todoIndex === -1 ||
      (direction === "up" && todoIndex === 0) ||
      (direction === "down" && todoIndex === todos.length - 1)
    ) {
      return;
    }
    const newTodos = [...todos];
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
    setTodos(newTodos);
    saveTodos();
  };

  const moveUp = (id: string) => {
    updateTodosOrder(id, "up");
    saveTodos();
  };

  const moveDown = (id: string) => {
    saveTodos();
    updateTodosOrder(id, "down");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault;
    setTodo(e.target.value);
  };

  return (
    <>
      <div className="flex justify-center items-center border border-indigo-600 rounded-lg px-5 ">
        <div className="m-5">
          <h1 className="text-3xl flex justify-center">Enter your Todo</h1>
          <input
            className="bg-red-400 text-black w-[60vw]"
            onChange={handleChange}
            value={todo}
          />
        </div>
        <button
          onClick={handleAdd}
          type="button"
          className="rounded-full  px-3 py-3 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-indigo-900 h-8 w-8 hover:bg-indigo-600"
        >
          <Plus className="h-4 w-4 " />
        </button>
      </div>
      <hr className="shadow-2xl  shadow-slate-800" />

      <div className="flex justify-center items-center">
        {todos.length > 0 ? (
          <ul>
            {todos.map((todo: todoProps) => (
              <li
                key={todo.id}
                className={` text-2xl text-indigo-900 px-5 py-3 flex items-center justify-between border border-indigo-800 rounded-md my-3 ${
                  todo.complete ? "line-through bg-red-800" : "bg-green-300"
                }`}
              >
                <input
                  className="flex justify-around items-center mx-5"
                  type="checkbox"
                  name=""
                  id={todo.id}
                  checked={todo.complete} // Set checked based on todo.complete
                  onChange={() => handleToggleComplete(todo.id)}
                />
                <span>{todo.text}</span>
                <span className="flex justify-around items-center mx-9">
                  <button
                    className="flex justify-around items-center mx-5"
                    onClick={() => moveUp(todo.id)}
                  >
                    <i className="fas fa-arrow-up">
                      <AiOutlineArrowUp />
                    </i>
                  </button>

                  <button
                    className="flex justify-around items-center mx-5"
                    onClick={() => moveDown(todo.id)}
                  >
                    <i className="fas fa-arrow-down">
                      <AiOutlineArrowDown />
                    </i>
                  </button>
                  <button
                    onClick={() => handleEdit(todo.id)}
                    type="button"
                    className="
                  flex justify-around items-center mx-5
                  rounded-full  px-3 py-3 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-indigo-900 h-8 w-8"
                  >
                    <CiEdit />
                  </button>
                  <button
                    onClick={(e) => {
                      handleDelete(todo.id);
                    }}
                    className="
                  flex justify-around items-center mx-5
                  bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md "
                  >
                    <MdDelete />
                  </button>
                </span>
              </li>
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
