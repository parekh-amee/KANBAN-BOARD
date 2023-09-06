<?php
// Load tasks from JSON file
function loadTasks() {
    $data = file_get_contents("tasks.json");
    return json_decode($data, true);
}

// Save tasks to JSON file
function saveTasks($tasks) {
    $data = json_encode($tasks, JSON_PRETTY_PRINT);
    file_put_contents("tasks.json", $data);
}

// Handle CRUD operations
if ($_SERVER["REQUEST_METHOD"] === "GET") {
    // Read tasks
    $tasks = loadTasks();
    echo json_encode($tasks);
} elseif ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Create a new task
    $data = json_decode(file_get_contents("php://input"), true);
    $tasks = loadTasks();
    $newTask = [
        "id" => uniqid(),
        "title" => $data["title"],
        "description" => $data["description"],
        "status" => "To Do"
    ];
    array_push($tasks, $newTask);
    saveTasks($tasks);
    echo json_encode($newTask);
} elseif ($_SERVER["REQUEST_METHOD"] === "PUT") {
    // Update a task
    $data = json_decode(file_get_contents("php://input"), true);
    $taskId = $data["id"];
    $tasks = loadTasks();
    foreach ($tasks as &$task) {
        if ($task["id"] === $taskId) {
            $task["title"] = $data["title"];
            $task["description"] = $data["description"];
            $task["status"] = $data["status"];
            break;
        }
    }
    saveTasks($tasks);
    echo json_encode(["message" => "Task updated successfully"]);
} elseif ($_SERVER["REQUEST_METHOD"] === "DELETE") {
    // Delete a task
    $taskId = $_GET["id"];
    $tasks = loadTasks();
    foreach ($tasks as $key => $task) {
        if ($task["id"] === $taskId) {
            unset($tasks[$key]);
            break;
        }
    }
    $tasks = array_values($tasks); // Reset array keys
    saveTasks($tasks);
    echo json_encode(["message" => "Task deleted successfully"]);
}
?>
