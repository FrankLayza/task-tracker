import { readFile, writeFile } from "node:fs/promises";
// interface TaskProp {
//   readonly id: string;
//   description: string;
//   status: "todo" | "in-progress" | "done";
//   createdAt: Date;
//   updatedAt: Date;
// }

async function readTaskFile() {
  try {
    const taskFileData = await readFile("./tasks.json", "utf8");
    if (taskFileData.length === 0) {
      console.log("empty file");
      return [];
    }
    const parsedData = JSON.parse(taskFileData);
    return [...parsedData];
  } catch (error) {
    console.error("error reading file", error.message);
    return [];
  }
}
// readTaskFile().then((tasks) => {
//   console.log("Found tasks:", tasks.length);
//   // Do something with the tasks here
//   tasks.map((task) => console.log(task.title))
// });

async function writeTaskFile(tasks) {
  try {
    if (!Array.isArray(tasks)) {
      return false;
    }
    await writeFile("./tasks.json", JSON.stringify(tasks, null, 2));
    return true;
  } catch (error) {
    console.error("Error writing tasks", error.message);
    return false;
  }
}
const args = process.argv.slice(2);
const tasks = await readTaskFile();

async function getUserCommand() {
  const newId =
    tasks.length === 0 ? 1 : Math.max(...tasks.map((t) => t.id)) + 1;

  if (args[0] === "add") {
    const firstCommand = args[1];
    if (!firstCommand) {
      console.log("input a task");
      return;
    }
    const newTask = {
      id: newId,
      description: firstCommand,
      status: "todo",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    await writeTaskFile(tasks);
    console.log(`Task added successfully (ID: ${newTask.id})`);
  }

  if (args[0] === "delete") {
  }

  if (args[0] === "update") {
  }
}

function addTask() {}
async function updatedTask() {
  // const tasks = await readTaskFile();
  // const args = process.argv.slice(2);
  if (args[0] === "update") {
    const taskId = args[1];
    const newDescription = args[2];

    if (!taskId) {
      console.log("provide the task id");
      return;
    }
    if (!newDescription) {
      console.log("provide the new description");
      return;
    }
    const parsedID = parseInt(taskId, 10);
    if (isNaN(parsedID)) {
      console.error("Invalid value");
      return;
    }
    if (tasks.length === 0) {
      console.error("Nothing to update");
      return;
    }
    const taskToUpdate = tasks.find((t) => t.id === parsedID);
    if (!taskToUpdate) {
      console.error(`Task not found`);
      return;
    }
    const updatedTask = {
      ...taskToUpdate,
      description: newDescription,
      updatedAt: new Date().toISOString(),
    };
    const selectedId = tasks.findIndex((task) => task.id === parsedID);
    tasks[selectedId] = updatedTask;
    await writeTaskFile(tasks);
    console.log("Task updated successfully");
    return;
  }
}

async function markInProgress() {
  if (args[0] === "mark-in-progress") {
    const tasks = await readTaskFile();
    const taskID = args[1];
    const parsedID = parseInt(taskID, 10);
    if (isNaN(parsedID)) {
      console.error("Invalid value");
      return;
    }
    if (tasks.length === 0) {
      console.error("Empty Array");
      return;
    }
    const selectedTask = tasks.find((t) => t.id === parsedID);
    if (!selectedTask) {
      console.error("the selected task doesn't exist");
      return;
    }
    const updatedTaskStatus = {
      ...selectedTask,
      status: "in-progress",
      updatedAt: new Date().toISOString(),
    };
    const selectedTaskId = tasks.findIndex((t) => t.id === parsedID);
    if (selectedTaskId < 0) {
      console.error("the selected task id doesn't exist");
      return;
    }
    tasks[selectedTaskId] = updatedTaskStatus;
    await writeTaskFile(tasks);
    console.log(`Task marked as in progress ${parsedID}`);
    return;
  }
}

async function markDone() {
  if (args[0] === "mark-done") {
    const tasks = await readTaskFile();
    const taskID = args[1];
    const parsedID = parseInt(taskID, 10);
    if (isNaN(parsedID)) {
      console.error("Invalid value");
      return;
    }
    if (tasks.length === 0) {
      console.error("Empty Array");
      return;
    }
    const selectedTask = tasks.find((t) => t.id === parsedID);
    if (!selectedTask) {
      console.error("the selected task doesn't exist");
      return;
    }
    const updatedTaskStatus = {
      ...selectedTask,
      status: "done",
      updatedAt: new Date().toISOString(),
    };
    const selectedTaskId = tasks.findIndex((t) => t.id === parsedID);
    if (selectedTaskId < 0) {
      console.error("the selected task id doesn't exist");
      return;
    }
    tasks[selectedTaskId] = updatedTaskStatus;
    await writeTaskFile(tasks);
    console.log(`Task marked as done (ID:${parsedID})`);
    return;
  }
}

async function deleteTask() {
  const tasks = await readTaskFile();
  if (args[0] === "delete") {
    const taskId = args[1];
    if (!taskId) {
      console.error("Provide a task ID");
      return;
    }
    const parsedID = parseInt(taskId, 10);
    if (isNaN(parsedID)) {
      console.error("Invalid value");
      return;
    }
    if (tasks.length === 0) {
      console.error("Empty Array");
      return;
    }
    const filteredTasks = tasks.filter((task) => task.id !== parsedID);
    if (filteredTasks.length === tasks.length) {
      console.error(`Task ${parsedID} not found`);
      return;
    }
    await writeTaskFile(filteredTasks);
    console.log(`Task ${parsedID} deleted successfully`);
    return;
  }
}

async function list() {
  const tasks = await readTaskFile();
  if (args[0] === "list") {
    console.log(JSON.stringify(tasks, null, 2));
    return
  }
  if (args[0] === "list" && args[1] === "todo") {
    const filteredTodoTasks = tasks.filter((t) => t.status === "todo");
    console.log(JSON.stringify(filteredTodoTasks, null, 2));
    return
  }
  if (args[0] === "list" && args[1] === "in-progress") {
    const filteredInProgressTasks = tasks.filter(
      (t) => t.status === "in-progress",
    );
    console.log(JSON.stringify(filteredInProgressTasks, null, 2));
    return
  }
  if (args[0] === "list" && args[1] === "done") {
    const filteredDoneTasks = tasks.filter((t) => t.status === "done");
    console.log(JSON.stringify(filteredDoneTasks, null, 2));
    return
  }
  if (tasks.length === 0) {
    console.error("Empty Array");
    return;
  }
}
