class WikiSearch {
    constructor(formSelector, inputSelector, resultsSelector, apiUrl) {
        this.formDOM = document.querySelector(formSelector);
        this.inputDOM = document.querySelector(inputSelector);
        this.resultsDOM = document.querySelector(resultsSelector);
        this.apiUrl = apiUrl;

        this.addEventListeners();
    }

    addEventListeners() {
        this.formDOM.addEventListener('submit', this.handleFormSubmit.bind(this));
    }

    async handleFormSubmit(event) {
        event.preventDefault();
        const searchValue = this.inputDOM.value.trim();

        if (!searchValue) {
            this.displayError('Please enter a valid search term');
            return;
        }
        await this.fetchPages(searchValue);
    }

    async fetchPages(searchValue) {
        this.resultsDOM.innerHTML = '<div class="loading">loading</div>';
        try {
            const response = await fetch(`${this.apiUrl}${searchValue}`);
            const data = await response.json();
            const results = data.query.search;
            results.length < 1 ? this.displayError('No matching results. Please try again') : this.renderResults(results);
        } catch (error) {
            this.displayError('There was an error...');
        }
    }

    renderResults(results) {
        const cardsList = results.map(({ title, snippet, pageid }) =>
          `<a href="http://en.wikipedia.org/?curid=${pageid}" target="_blank">
             <h4>${title}</h4>
             <p>${snippet}</p>
           </a>`
        ).join('');
        this.resultsDOM.innerHTML = `<div class="articles">${cardsList}</div>`;
      }
    
      displayError(message) {
        this.resultsDOM.innerHTML = `<div class="error">${message}</div>`;
      }
      
}

const wikiSearch = new WikiSearch('.form', '.form-input', '.results', 'https://en.wikipedia.org/w/api.php?action=query&list=search&srlimit=20&format=json&origin=*&srsearch=');
