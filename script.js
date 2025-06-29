document.addEventListener('DOMContentLoaded', () => {
    const itemInput = document.getElementById('itemInput');
    const addItemBtn = document.getElementById('addItemBtn');
    const quickList = document.getElementById('quickList');

    // Load items from local storage
    loadItems();

    addItemBtn.addEventListener('click', addItem);
    itemInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addItem();
        }
    });

    function addItem() {
        const itemText = itemInput.value.trim();
        if (itemText === '') {
            return; // Don't add empty items
        }

        const listItem = createListItem(itemText);
        quickList.appendChild(listItem);

        saveItem(itemText); // Save to local storage
        itemInput.value = ''; // Clear input field
        itemInput.focus();
    }

    function createListItem(text, completed = false) {
        const li = document.createElement('li');
        li.textContent = text;
        if (completed) {
            li.classList.add('completed');
        }

        // Toggle completed state
        li.addEventListener('click', () => {
            li.classList.toggle('completed');
            updateItemInStorage(text, li.classList.contains('completed'));
        });

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent li click event from firing
            quickList.removeChild(li);
            removeItemFromStorage(text);
        });

        li.appendChild(deleteBtn);
        return li;
    }

    function saveItem(itemText, completed = false) {
        let items = getItemsFromStorage();
        items.push({ text: itemText, completed: completed });
        localStorage.setItem('quickListItems', JSON.stringify(items));
    }

    function loadItems() {
        let items = getItemsFromStorage();
        items.forEach(item => {
            const listItem = createListItem(item.text, item.completed);
            quickList.appendChild(listItem);
        });
    }

    function getItemsFromStorage() {
        const itemsJSON = localStorage.getItem('quickListItems');
        return itemsJSON ? JSON.parse(itemsJSON) : [];
    }

    function removeItemFromStorage(itemText) {
        let items = getItemsFromStorage();
        items = items.filter(item => item.text !== itemText);
        localStorage.setItem('quickListItems', JSON.stringify(items));
    }

    function updateItemInStorage(itemText, completed) {
        let items = getItemsFromStorage();
        const itemIndex = items.findIndex(item => item.text === itemText);
        if (itemIndex > -1) {
            items[itemIndex].completed = completed;
            localStorage.setItem('quickListItems', JSON.stringify(items));
        }
    }
});
