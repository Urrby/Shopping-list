const text = document.querySelector(`[type="text"]`);
const submit = document.querySelector(`[type="submit"]`);
const form = document.querySelector(".shopping");
const list = document.querySelector(".list");
let items = [];

function submitHandler(e) {
    e.preventDefault();
    const name = text.value;
    if(!name) return;
    const item = {
        name,
        id: Date.now(),
        completed: false,
    }
    items.push(item);
    form.reset();
    list.dispatchEvent(new CustomEvent("itemsUpdated"));
}



// Display items function
function displayItems(e) {
    const html = items.map(item => `
    <li class="shopping-item">
        <input type="checkbox" value="${item.id}" ${item.completed ? "checked" : ""}>
        <span class="itemName">${item.name}</span>
        <button type="button" value="${item.id}">&times;</button>
    </li>
    `).join("");
    list.innerHTML = html;
}

// Add to local storage function
function addToLocalStorage() {
    localStorage.setItem("items", JSON.stringify(items));
}


// Restore from local storage function
function restoreFromLocalStorage() {
    const localStorageItem = JSON.parse(localStorage.getItem("items"));
    if(localStorageItem.length) {
        items.push(...localStorageItem);
    }
    list.dispatchEvent(new CustomEvent("itemsUpdated"));
}

  


// Delete items function
function deleteItem(id) {
    items = items.filter(item => item.id !== id);
    list.dispatchEvent(new CustomEvent("itemsUpdated"));
}


// Save checked
function saveChecked(id) {
    let itemRef = items.find(item => item.id === id);
    itemRef.completed = !itemRef.completed;
    list.dispatchEvent(new CustomEvent("itemsUpdated"));
    
    
}


// Event listeners
submit.addEventListener("click", submitHandler);
list.addEventListener("itemsUpdated", displayItems);
list.addEventListener("itemsUpdated", addToLocalStorage);
list.addEventListener("click", function(e) {
    const id = parseInt(e.target.value);
    if(e.target.matches("button")) {
        deleteItem(id);
    }
    if(e.target.matches(`[type="checkbox"]`)) {
        saveChecked(id);
    }


})
restoreFromLocalStorage();
