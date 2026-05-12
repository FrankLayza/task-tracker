# Task Tracker CLI

A simple command-line interface (CLI) tool for managing your tasks. Track your to-do items, mark them as in progress or done, and organize them efficiently.

## Features

- Add new tasks with descriptions
- Update existing task descriptions
- Delete tasks
- Mark tasks as in progress or completed
- List all tasks or filter by status (todo, in-progress, done)
- Persistent storage using JSON file

## Installation

1. Ensure you have Node.js installed (version 14 or higher recommended).
2. Clone or download this repository.
3. Navigate to the project directory.

No additional dependencies are required as this uses only Node.js built-in modules.

## Usage

Run the CLI using Node.js:

```bash
node task-cli.js <command> [arguments]
```

### Commands

#### Add a Task
```bash
node task-cli.js add "Your task description"
```
Example:
```bash
node task-cli.js add "Buy groceries"
```
Output: `Task added successfully (ID: 1)`

#### Update a Task
```bash
node task-cli.js update <task_id> "New description"
```
Example:
```bash
node task-cli.js update 1 "Buy groceries and cook dinner"
```
Output: `Task updated successfully`

#### Mark Task as In Progress
```bash
node task-cli.js mark-in-progress <task_id>
```
Example:
```bash
node task-cli.js mark-in-progress 1
```
Output: `Task marked as in progress (ID: 1)`

#### Mark Task as Done
```bash
node task-cli.js mark-done <task_id>
```
Example:
```bash
node task-cli.js mark-done 1
```
Output: `Task marked as done (ID: 1)`

#### Delete a Task
```bash
node task-cli.js delete <task_id>
```
Example:
```bash
node task-cli.js delete 1
```
Output: `Task 1 deleted successfully`

#### List Tasks
```bash
node task-cli.js list [status]
```
- Without status: Lists all tasks
- With status: Filters tasks by status (`todo`, `in-progress`, `done`)

Examples:
```bash
node task-cli.js list
node task-cli.js list todo
node task-cli.js list in-progress
node task-cli.js list done
```

## Data Storage

Tasks are stored in a `tasks.json` file in the same directory as the CLI script. Each task has:
- `id`: Unique identifier (number)
- `description`: Task description (string)
- `status`: Current status (`todo`, `in-progress`, `done`)
- `createdAt`: Creation timestamp (ISO string)
- `updatedAt`: Last update timestamp (ISO string)

## Error Handling

The CLI provides helpful error messages for:
- Missing arguments
- Invalid task IDs
- Non-existent tasks
- Invalid status filters

## Examples

1. Add multiple tasks:
```bash
node task-cli.js add "Complete project proposal"
node task-cli.js add "Review code changes"
node task-cli.js add "Attend team meeting"
```

2. View all tasks:
```bash
node task-cli.js list
```

3. Mark a task as in progress and then done:
```bash
node task-cli.js mark-in-progress 2
node task-cli.js mark-done 2
```

4. Update a task description:
```bash
node task-cli.js update 3 "Attend weekly team standup"
```

5. Delete a completed task:
```bash
node task-cli.js delete 2
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source. Please check the license file for details.