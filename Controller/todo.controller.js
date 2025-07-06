import Todo from "../models/todo.model.js";

const createTodo = async (req, res) => {
  try {
    const { text, dueDate, priority, category, completed } = req.body;
    const newTodo = new Todo({
      text,
      dueDate,
      priority,
      category,
      completed,
      userId: req.user._id,
    });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: "Error creating todo", error });
  }
};

const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user._id });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching todos", error });
  }
};
const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, dueDate, priority, category, completed } = req.body;
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { text, dueDate, priority, category, completed },
      { new: true }
    );
    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: "Error updating todo", error });
  }
};
const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await Todo.findByIdAndDelete(id);
    if (!deletedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting todo", error });
  }
};
const getTodoById = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ message: "Error fetching todo", error });
  }
};
export { createTodo, getTodos, updateTodo, deleteTodo, getTodoById };
