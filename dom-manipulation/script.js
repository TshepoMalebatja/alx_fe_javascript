// Array to hold quote objects
let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "The purpose of our lives is to be happy.", category: "Happiness" }
];

// Function to populate the category dropdown
function populateCategorySelect() {
    const categorySelect = document.getElementById('categorySelect');
    const categories = new Set(quotes.map(quote => quote.category));
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

// Function to show a random quote based on selected category
function showRandomQuote() {
    const selectedCategory = document.getElementById('categorySelect').value;
    const filteredQuotes = quotes.filter(quote => !selectedCategory || quote.category === selectedCategory);
    
    if (filteredQuotes.length === 0) {
        document.getElementById('quoteDisplay').innerText = 'No quotes available for the selected category.';
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    document.getElementById('quoteDisplay').innerText = `${quote.text} - ${quote.category}`;
}

// Function to add a new quote
function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value.trim();
    const quoteCategory = document.getElementById('newQuoteCategory').value.trim();

    if (quoteText && quoteCategory) {
        quotes.push({ text: quoteText, category: quoteCategory });
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        
        // Update the category dropdown
        populateCategorySelect();
        showRandomQuote(); // Optionally show the new quote immediately
    } else {
        alert('Please fill out both fields.');
    }
}

// Attach event listeners to buttons and dropdown
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('addQuote').addEventListener('click', addQuote);
document.getElementById('categorySelect').addEventListener('change', showRandomQuote);

// Populate the category dropdown on page load
window.onload = () => {
    populateCategorySelect();
    showRandomQuote(); // Show an initial random quote
};
