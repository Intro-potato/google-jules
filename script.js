document.addEventListener('DOMContentLoaded', () => {
    const quickList = document.getElementById('quickList');
    const moodButtons = {
        happyBtn: '😊 Happy',
        sadBtn: '😢 Sad',
        angryBtn: '😠 Angry',
        neutralBtn: '😐 Neutral',
        excitedBtn: '🥳 Excited'
    };

    // Load items from local storage
    loadMoods();

    // Add event listeners for mood buttons
    for (const btnId in moodButtons) {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.addEventListener('click', () => {
                addMoodEntry(moodButtons[btnId]);
            });
        }
    }

    function addMoodEntry(mood) {
        const timestamp = new Date();
        const formattedTimestamp = `${timestamp.getFullYear()}-${(timestamp.getMonth() + 1).toString().padStart(2, '0')}-${timestamp.getDate().toString().padStart(2, '0')} ${timestamp.getHours().toString().padStart(2, '0')}:${timestamp.getMinutes().toString().padStart(2, '0')}`;
        const moodEntryText = `${mood} - ${formattedTimestamp}`;

        const listItem = createListItem(moodEntryText);
        quickList.appendChild(listItem);

        saveMood(moodEntryText); // Save to local storage
    }

    function createListItem(text) {
        const li = document.createElement('li');
        li.textContent = text;

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent li click event from firing
            quickList.removeChild(li);
            removeMoodFromStorage(text);
        });

        li.appendChild(deleteBtn);
        return li;
    }

    function saveMood(moodEntryText) {
        let moods = getMoodsFromStorage();
        moods.push({ text: moodEntryText }); // Store as an object for consistency, though only 'text' is used for now
        localStorage.setItem('moodJournalEntries', JSON.stringify(moods));
    }

    function loadMoods() {
        let moods = getMoodsFromStorage();
        moods.forEach(mood => {
            const listItem = createListItem(mood.text);
            quickList.appendChild(listItem);
        });
    }

    function getMoodsFromStorage() {
        const moodsJSON = localStorage.getItem('moodJournalEntries');
        return moodsJSON ? JSON.parse(moodsJSON) : [];
    }

    function removeMoodFromStorage(moodEntryText) {
        let moods = getMoodsFromStorage();
        moods = moods.filter(mood => mood.text !== moodEntryText);
        localStorage.setItem('moodJournalEntries', JSON.stringify(moods));
    }
});
