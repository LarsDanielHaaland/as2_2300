// Function to fetch and display TODO items
function fetchTodos() {
    fetch('http://localhost:5000/api/items/')
        .then(response => response.json())
        .then(data => {
            const todoList = document.getElementById('todo-list');
            todoList.innerHTML = ''; // Clear previous items
            data.items.forEach(item => {
                const listItem = document.createElement('li');

                // Create a checkbox for each item
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = item.done;
                checkbox.addEventListener('change', () => {
                    toggleComplete(item.id, checkbox.checked); // Call toggleComplete function on checkbox change
                });

                // Create a label for the checkbox
                const label = document.createElement('label');
                label.textContent = item.name;

                // Create a delete button for each item
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => {
                    deleteTodo(item.id); // Call the deleteTodo function when the button is clicked
                });

                listItem.appendChild(checkbox);
                listItem.appendChild(label);
                listItem.appendChild(deleteButton);
                todoList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error fetching TODO items:', error);
        });
}
// Function to add a new TODO item
function addTodo(name) {
    const newItem = { name, done: false };

    fetch('http://localhost:5000/api/items/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
    })
        .then(response => response.json())
        .then(data => {
            // Optionally, you can handle the success response here
            // For example, you can add the newly created item to the UI
            console.log('New item added:', data.item);
            fetchTodos(); // Refresh the TODO list
        })
        .catch(error => {
            console.error('Error adding new item:', error);
        });
}
// Function to handle the form submission for adding a new TODO item
function handleAddTodoFormSubmit(event) {
    event.preventDefault(); // Prevent the default form submission

    const todoInput = document.getElementById('todo-input');
    const todoText = todoInput.value.trim(); // Get the trimmed input text

    if (todoText) {
        addTodo(todoText); // Call the addTodo function with the input text
        todoInput.value = ''; // Clear the input field after adding
    }
}

// Function to toggle the "completed" state of a TODO item
function toggleComplete(itemId, isCompleted) {
    const updatedItem = { done: isCompleted };

    fetch(`http://localhost:5000/api/items/${itemId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItem),
    })
        .then(response => response.json())
        .then(data => {
            // Optionally, you can handle the success response here
            // For example, you can update the UI to reflect the new state
            console.log(`Item with ID ${itemId} marked as completed: ${isCompleted}`);
        })
        .catch(error => {
            console.error(`Error marking item with ID ${itemId} as completed:`, error);
        });
}

// Function to delete a TODO item
function deleteTodo(itemId) {
    fetch(`http://localhost:5000/api/items/${itemId}`, {
        method: 'DELETE',
    })
        .then(response => response.json())
        .then(data => {
            // Optionally, you can handle the success response here
            // For example, you can remove the deleted item from the UI
            console.log(`Item with ID ${itemId} deleted successfully.`);
            fetchTodos(); // Refresh the TODO list
        })
        .catch(error => {
            console.error(`Error deleting item with ID ${itemId}:`, error);
        });
}

// Function to mark all TODO items as done
function markAllDone() {
    // Fetch all TODO items and mark them as done
    fetch('http://localhost:5000/api/items/')
        .then(response => response.json())
        .then(data => {
            data.items.forEach(item => {
                if (!item.done) {
                    // Only mark items as done if they are not already marked as done
                    toggleComplete(item.id, true);
                }
            });
        })
        .then(() => {
            // After marking all items as done, refresh the TODO list
            fetchTodos();
        })
        .catch(error => {
            console.error('Error marking all items as done:', error);
        });
}

// Attach event listener to the "Mark All as Done" button
const markAllDoneButton = document.getElementById('mark-all-done');
markAllDoneButton.addEventListener('click', markAllDone);
// Attach event listener to the form for adding a new TODO item
const addTodoForm = document.getElementById('add-todo-form');
addTodoForm.addEventListener('submit', handleAddTodoFormSubmit);

// ... (add the deleteTodo function as shown in the previous responses)

// Fetch and display TODO items when the page loads
fetchTodos();
