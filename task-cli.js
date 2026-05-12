import { readFile, writeFile } from "node:fs/promises";

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

async function addTask(args) {
  if (args[0] === "add") {
    const tasks = await readTaskFile();
    const firstCommand = args[1];
    if (!firstCommand) {
      console.error("input a task");
      return;
    }
    const newId =
      tasks.length === 0 ? 1 : Math.max(...tasks.map((t) => t.id)) + 1;
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
}
async function updatedTask(args) {
  if (args[0] === "update") {
    const tasks = await readTaskFile();
    const taskId = args[1];
    const newDescription = args[2];

    if (!taskId) {
      console.error("provide the task id");
      return;
    }
    if (!newDescription) {
      console.error("provide the new description");
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
    const selectedId = tasks.findIndex((task) => task.id === parsedID);
    if (selectedId < 0) {
      console.error("Such task doesn'\t exist");
      return;
    }

    const updatedTask = {
      ...tasks[selectedId],
      description: newDescription,
      updatedAt: new Date().toISOString(),
    };
    tasks[selectedId] = updatedTask;
    await writeTaskFile(tasks);
    console.log("Task updated successfully");
    return;
  }
}

async function markInProgress(args) {
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
    const selectedTaskId = tasks.findIndex((t) => t.id === parsedID);
    if (selectedTaskId < 0) {
      console.error("Such task doesn't exist");
      return;
    }
    const updatedTaskStatus = {
      ...tasks[selectedTaskId],
      status: "in-progress",
      updatedAt: new Date().toISOString(),
    };
    if (selectedTaskId < 0) {
      console.error("the selected task id doesn't exist");
      return;
    }
    tasks[selectedTaskId] = updatedTaskStatus;
    await writeTaskFile(tasks);
    console.log(`Task marked as in progress (ID: ${parsedID})`);
    return;
  }
}

async function markDone(args) {
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
    const selectedTaskId = tasks.findIndex((t) => t.id === parsedID);

    if (selectedTaskId < 0) {
      console.error("the selected task id doesn't exist");
      return;
    }
    const updatedTaskStatus = {
      ...tasks[selectedTaskId],
      status: "done",
      updatedAt: new Date().toISOString(),
    };
    tasks[selectedTaskId] = updatedTaskStatus;
    await writeTaskFile(tasks);
    console.log(`Task marked as done (ID:${parsedID})`);
    return;
  }
}

async function deleteTask(args) {
  if (args[0] === "delete") {
    const tasks = await readTaskFile();
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

async function list(args) {
  const tasks = await readTaskFile();
  if (tasks.length === 0) {
    console.log("No tasks found");
    return;
  }
  if (args[0] !== "list") return;
  const filter = args[1];
  if (!filter) {
    console.log(JSON.stringify(tasks, null, 2));
    return;
  }
  const validFilters = ["todo", "in-progress", "done"];
  if (!validFilters.includes(filter)) {
    console.error("Invalid status filter. Use: todo, in-progress, done");
    return;
  }
  const filtered = tasks.filter((t) => t.status === filter);
  console.log(JSON.stringify(filtered, null, 2));
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("no command found");
    return;
  }

  switch (args[0]) {
    case "add":
      return addTask(args);
    case "update":
      return updatedTask(args);
    case "delete":
      return deleteTask(args);
    case "mark-in-progress":
      return markInProgress(args);
    case "mark-done":
      return markDone(args);
    case "list":
      return list(args);
    default:
      console.error("Unknown command:", args[0]);
      console.log(
        "Usage: task-cli [add|update|delete|mark-in-progress|mark-done|list] ...",
      );
  }
}
main().then(() => process.exit(0));
