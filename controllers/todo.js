import moment from "moment/moment.js";
import Todo from "../models/todo.js";
import User from "../models/user.js";

// Create a new todo and associate it with a user
export const createTodo = async (req, res) => {
  try {
    const userID = req.params.userID;
    const { title, category } = req.body;

    const newTodo = new Todo({
      title,
      category,
      dueDate: moment().format("YYYY-MM-DD"),
    });

    await newTodo.save();

    const user = await User.findById(userID);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.todos.push(newTodo._id);
    await user.save();

    res.status(200).json({ message: "Todo added successfully", todo: newTodo });
  } catch (error) {
    console.error("Error in createTodo:", error);
    res.status(500).json({ error: "Todo not added", details: error.message });
  }
};

// Get all todos for a user
export const getTodos = async (req, res) => {
  try {
    const userID = req.params.userID;

    const user = await User.findById(userID).populate("todos");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ todos: user.todos });
  } catch (error) {
    console.error("Error in getTodos:", error);
    res
      .status(500)
      .json({ error: "Something went wrong", details: error.message });
  }
};

// Mark a todo as completed
export const modifyTodo = async (req, res) => {
  try {
    const todoID = req.params.todoID;

    const updatedTodo = await Todo.findByIdAndUpdate(
      todoID,
      { status: "completed" },
      { new: true }
    );

    if (!updatedTodo) return res.status(404).json({ error: "Todo not found" });

    res
      .status(200)
      .json({ message: "Todo marked as complete", todo: updatedTodo });
  } catch (error) {
    console.error("Error in modifyTodo:", error);
    res
      .status(500)
      .json({ error: "Something went wrong", details: error.message });
  }
};

// Get completed todos by date
export const todoCompletedOnDate = async (req, res) => {
  try {
    const date = req.params.date;

    const start = new Date(`${date}T00:00:00.000Z`);
    const end = new Date(`${date}T23:59:59.999Z`);

    const completedTodos = await Todo.find({
      status: "completed",
      createdAt: { $gte: start, $lt: end },
    });

    res.status(200).json({ completedTodos });
  } catch (error) {
    console.error("Error in todoCompletedOnDate:", error);
    res
      .status(500)
      .json({ error: "Something went wrong", details: error.message });
  }
};

// Count completed and pending todos
export const countTodo = async (req, res) => {
  try {
    const [totalCompletedTodos, totalPendingTodos] = await Promise.all([
      Todo.countDocuments({ status: "completed" }),
      Todo.countDocuments({ status: "pending" }),
    ]);

    console.log(
      "Stats - Completed:",
      totalCompletedTodos,
      "Pending:",
      totalPendingTodos
    );

    res.status(200).json({ totalCompletedTodos, totalPendingTodos });
  } catch (error) {
    console.error("Error in countTodo:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};
