let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" }
];

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    loadQuotes();
    showRandomQuote();
});

// Show a random quote
function showRandomQuote() {
    if (quotes.length === 0) {
        document.getElementById('quoteDisplay').innerText = "No quotes available.";
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    document.getElementById('quoteDisplay').innerText = quotes[randomIndex].text;
}

// Add a new quote
function addQuote() {
    const text = document.getElementById('newQuoteText').value;
    const category = document.getElementById('newQuoteCategory').value;

    if (text && category) {
        quotes.push({ text, category });
        saveQuotes();
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        alert('Quote added successfully!');
    } else {
        alert('Please enter both quote text and category.');
    }
}

// Save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Load quotes from local storage
function loadQuotes() {
    const savedQuotes = localStorage.getItem('quotes');
    if (savedQuotes) {
        quotes = JSON.parse(savedQuotes);
    }
}

// Export quotes to JSON file
document.getElementById('exportQuotes').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
});

// Import quotes from JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        if (Array.isArray(importedQuotes)) {
            quotes = importedQuotes;
            saveQuotes();
            showRandomQuote();
            alert('Quotes imported successfully!');
        } else {
            alert('Invalid JSON format.');
        }
    };
    fileReader.readAsText(event.target.files[0]);
}
