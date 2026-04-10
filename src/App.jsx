import { useEffect, useState } from "react";
import "./App.css";
import supabase from '../supabase-client';
function App() {
  const [todoList, setTodoList] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  useEffect(() => {
    consulta();
  }, []);
  const consulta = async () => {
    const { data, error } = await supabase.from("pendientes").select("*");
    console.log(data);
    if (error) {
      console.log("Error de conexion en consulta: ", error);
    } else {
      setTodoList(data);
    }
  };
  const addTodo = async () => {
    if (!newTodo.trim()) return; // Evita insertar strings vacíos
    const newTodoData = {
      name: newTodo.trim(),
      isCompleted: false,
    };
    console.log([newTodoData]);
    const { data, error } = await supabase
      .from("pendientes")
      .insert([newTodoData])
      .select(); // Esto hace que retorne los datos insertados
    if (error) {
      console.log("Error en el insert: ", error);
    } else {
      // data será un array, toma el primer elemento
      setTodoList((prev) => [...prev, data[0]]);
      setNewTodo("");
    }
  };

  const completeTask = async (id, isCompleted) => {
    const { data, error } = await supabase
      .from("pendientes")
      .update({ isCompleted: !isCompleted })
      .eq("id", id);
    if (error) {
      console.log("error en el update task: ", error);
    } else {
      const updatedTodoList = todoList.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !isCompleted } : todo
      );
      setTodoList(updatedTodoList);
    }
  };
  const deleteTask = async (id) => {
    const { data, error } = await supabase
      .from("pendientes")
      .delete()
      .eq("id", id);
    if (error) {
      console.log("error deleting task: ", error);
    } else {
      setTodoList((prev) => prev.filter((todo) => todo.id !== id));
    }
  };

  return (
    <div>
      {" "}
      <h1>Todo List</h1>
      <div>
        <input
          type="text"
          placeholder="New Todo..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button onClick={addTodo}> Add Todo Item</button>
      </div>
      <ul>
        {todoList.map((todo) => (
          <li>
            <p> {todo.name}</p>
            <button onClick={() => completeTask(todo.id, todo.isCompleted)}>
              {" "}
              {todo.isCompleted ? "Undo" : "Complete Task"}
            </button>
            <button onClick={() => deleteTask(todo.id)}> Delete Task</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default App;