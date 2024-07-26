// Array to hold quote objects
let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "The purpose of our lives is to be happy.", category: "Happiness" }
];

// Mock server URL for simulation
const serverUrl = 'https://jsonplaceholder.typicode.com/posts'; // Example endpoint for simulation

// Load quotes from local storage
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }
}

// Save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Populate the category dropdown for filtering
function populateCategoryFilter() {
    const categoryFilter = document.getElementById('categoryFilter');
    const categories = new Set(quotes.map(quote => quote.category));
    categoryFilter.innerHTML = '<option value="all">All Categories</option>'; // Reset options
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Function to filter quotes based on selected category
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    let filteredQuotes = quotes;
    if (selectedCategory !== 'all') {
        filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
    }
    displayQuotes(filteredQuotes);
    
    // Save the last selected filter to local storage
    localStorage.setItem('selectedCategory', selectedCategory);
}

// Function to display quotes
function displayQuotes(filteredQuotes) {
    const quoteDisplay = document.getElementById('quoteDisplay');
    if (filteredQuotes.length === 0) {
        quoteDisplay.innerText = 'No quotes available for the selected category.';
    } else {
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        const quote = filteredQuotes[randomIndex];
        quoteDisplay.innerText = `${quote.text} - ${quote.category}`;
    }
}

// Function to show a random quote based on selected category
function showRandomQuote() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    filterQuotes(); // This will also handle showing the random quote
}

// Function to add a new quote
function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value.trim();
    const quoteCategory = document.getElementById('newQuoteCategory').value.trim();

    if (quoteText && quoteCategory) {
        quotes.push({ text: quoteText, category: quoteCategory });
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        
        // Update the category dropdowns
        populateCategoryFilter();
        filterQuotes(); // Optionally show the new quote immediately

        // Save quotes to local storage
        saveQuotes();

        // Sync with server after adding a quote
        syncDataWithServer();
    } else {
        alert('Please fill out both fields.');
    }
}

// Function to export quotes to JSON
function exportToJson() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
}

// Function to import quotes from JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes = [...importedQuotes];
        saveQuotes();
        populateCategoryFilter();
        filterQuotes();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

// Fetch quotes from the simulated server
function fetchFromServer() {
    fetch(serverUrl)
        .then(response => response.json())
        .then(data => {
            // Simulate resolving conflicts and updating local storage
            resolveConflicts(data);
        })
        .catch(error => console.error('Error fetching from server:', error));
}

// Post quotes to the simulated server
function postToServer() {
    fetch(serverUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(quotes)
    })
    .then(response => response.json())
    .then(data => console.log('Posted to server:', data))
    .catch(error => console.error('Error posting to server:', error));
}

// Simulate periodic data fetching from the server
function startPeriodicFetch() {
    setInterval(fetchFromServer, 30000); // Fetch every 30 seconds
}

// Resolve conflicts and update local storage
function resolveConflicts(serverData) {
    const localData = JSON.parse(localStorage.getItem('quotes')) || [];
    // Conflict resolution strategy: Server data takes precedence
    quotes = serverData;
    saveQuotes(); // Save updated quotes to local storage
    populateCategoryFilter(); // Refresh category filter options
    filterQuotes(); // Refresh displayed quotes based on the filter
    notifyUser('Data has been updated from the server.');
}

// Notify user with message
function notifyUser(message) {
    document.getElementById('notification').innerText = message;
}

// Sync local data with the server
function syncDataWithServer() {
    postToServer();
}

// Attach event listeners to buttons and dropdown
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('addQuote').addEventListener('click', addQuote);
document.getElementById('categoryFilter').addEventListener('change', filterQuotes);
document.getElementById('exportQuotes').addEventListener('click', exportToJson);
document.getElementById('importFile').addEventListener('change', importFromJsonFile);
document.getElementById('resolveConflicts').addEventListener('click', fetchFromServer);

// Load quotes from local storage, populate category filter, and display an initial random quote
window.onload = () => {
    loadQuotes();
    populateCategoryFilter();
    const lastSelectedCategory = localStorage.getItem('selectedCategory') || 'all';
    document.getElementById('categoryFilter').value = lastSelectedCategory;
    filterQuotes();
    
    // Start periodic data fetching
    startPeriodicFetch();
};
