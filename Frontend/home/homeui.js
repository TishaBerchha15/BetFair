// define all UI variable
const navToggler = document.querySelector('.nav-toggler');
const navMenu = document.querySelector('.site-navbar ul');
const navLinks = document.querySelectorAll('.site-navbar a');

// load all event listners
allEventListners();

// functions of all event listners
function allEventListners() {
  // toggler icon click event
  navToggler.addEventListener('click', togglerClick);
  // nav links click event
  navLinks.forEach( elem => elem.addEventListener('click', navLinkClick));
}

// togglerClick function
function togglerClick() {
  navToggler.classList.toggle('toggler-open');
  navMenu.classList.toggle('open');
}

// navLinkClick function
function navLinkClick() {
  if(navMenu.classList.contains('open')) {
    navToggler.click();
  }
}

// ------------------------------------------

document.addEventListener('DOMContentLoaded', function() {
    // Update wallet balance from profile_amount
    const profileAmount = document.getElementById('profile_amount');
    const walletBalance = document.getElementById('wallet-balance');
    
    if (profileAmount && walletBalance) {
        // Remove the '$' if it exists in the profile_amount text
        const amount = profileAmount.textContent.replace('$', '').trim();
        walletBalance.textContent = `$${amount}`;
    }
});


// ---------------------------------------------------

let selectedTournaments = null;
const loader_overlay = document.querySelector('.loading-overlay');

function showloader() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.display = 'block';
    } else {
        console.error("Loader element not found!");
    }
}

function hideLoader() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.display = 'none';
    } else {
        console.error("Loader element not found!");
    }
}

function toggleDropdown() {
    const tournamentsDiv = document.getElementById('dropdown');
    const arrowSpan = document.getElementById('arrow');

    if (tournamentsDiv.style.display === 'none' || tournamentsDiv.style.display === '') {
        arrowSpan.innerHTML = '&#11165;'; // Up arrow
        tournamentsDiv.style.display = 'block';
    } else {
        arrowSpan.innerHTML = '&#11167;'; // Down arrow
        tournamentsDiv.style.display = 'none';
    }
}


async function fetchTournamentsAndAmount() {
    try {
        const [tournamentResponse, amountResponse, historyResponse] = await Promise.all([
            fetch('http://127.0.0.1:5000/get_tournament'),
            fetch('http://127.0.0.1:5000/get_amount'),
            fetch('http://127.0.0.1:5000/home_fetch_data')
        ]);
   
        if (!tournamentResponse.ok || !amountResponse.ok || !historyResponse.ok) {
            throw new Error(
                `Network response was not ok: Tournament: ${tournamentResponse.status}, Amount: ${amountResponse.status}, History: ${historyResponse.status}`
            );
        }
   
        const [tournamentData, amountData, historyData] = await Promise.all([
            tournamentResponse.json(),
            amountResponse.json(),
            historyResponse.json()
        ]);

        console.log("data",historyData)
        
        // Access the data array from the wrapped response
        const historyRecords = historyData.data;
        console.log("data---------",historyRecords)
        if (historyRecords && historyRecords.length > 0) {
            const data = historyRecords[0];
            const Indicator = (value) => {
                if (value === null || value === undefined) return '';
                // Using actual triangle Unicode characters instead of HTML entities
                
                return value >= 0 ? '\u25B2' : '\u25BC'; // ↑ and ↓
            };
            
            const updateCell = (valueId, indicatorId, value) => {
                const valueElement = document.getElementById(valueId);
                const indicator = document.getElementById(indicatorId);
                
                if (!valueElement || !indicator) {
                    console.warn(`Elements not found for ${valueId} or ${indicatorId}`);
                    return;
                }
                
                valueElement.textContent = value;


                const excludeIndicators = ['TB', 'BM', 'UM'];
                if (excludeIndicators.includes(valueId)) {
                    indicator.textContent = ''; // Clear the indicator content
                    indicator.style.color = 'inherit'; // Reset color
                    indicator.style.fontSize = 'inherit'; // Reset font size
                    return;
                }

                if (value !== null) {
                    indicator.textContent = Indicator(value);

                    indicator.style.color = value >= 0 ? '#04aa6d' : '#ff0000'; // 0 treated as positive
                    indicator.style.fontSize = '21px';
                } else {
                    indicator.textContent = '--';
                    indicator.style.color = 'inherit';
                }
            };
           
            // Update each pair of cells
            updateCell('over_PL','Indicator', data.overall_pnl.toFixed(2))
            updateCell("TB" ,'Indicator0', data.total_bp)
            updateCell("BM" ,'Indicator4', data.total_M)
            updateCell("UM" ,'Indicator5', data.total_UM)
            updateCell('PL1', 'Indicator1', data.strategy_1_pnl.toFixed(2));
            updateCell('PL2', 'Indicator2', data.strategy_2_pnl.toFixed(2));
            updateCell('PL3', 'Indicator3', data.strategy_3_pnl.toFixed(2));
        }

        if (typeof populateDropdown !== 'function') {
            throw new Error('populateDropdown function is not defined!');
        }
   
        sessionStorage.setItem('tournaments', JSON.stringify(tournamentData.tournaments));
        populateDropdown(tournamentData.tournaments);
   
        const amount1 = amountData.amount;
   
        const spanElement = document.querySelector('span');
        if (!spanElement) {
            throw new Error('Span element not found in the DOM');
        }
        spanElement.textContent = `$${amount1} `;
   
        sessionStorage.setItem('amount1', JSON.stringify(amount1));
   
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
}


  function populateDropdown(tournaments) {
    const tournamentsDiv = document.getElementById('dropdown');
    tournamentsDiv.innerHTML = "";

    tournaments.forEach(tournament => {
        const item = document.createElement('div');
        item.className = 'dropdown-item';
        item.textContent = tournament;
        item.onclick = () => {
            selectedTournaments = tournament;
            sessionStorage.setItem('selectedTournament', tournament);
            tournamentsDiv.style.display = "none";
            tournamentsDiv.style.fontSize = '13px';

            const tournamentButton = document.getElementById('tournamentButton');
            tournamentButton.innerHTML = `${tournament} <span id="arrow">&#11167;</span>`; // Keep the arrow icon

            displayError('tournamentError', '', false);
        };

        tournamentsDiv.appendChild(item);
    });
}

document.addEventListener('DOMContentLoaded', fetchTournamentsAndAmount);



// Hide dropdown if clicked outside
window.onclick = function (event) {
    const tournamentsDiv = document.getElementById('dropdown');
    const arrowSpan = document.getElementById('arrow');
    const button = document.getElementById('tournamentButton');

    if (!button.contains(event.target) && !tournamentsDiv.contains(event.target)) {
        tournamentsDiv.style.display = 'none';
        arrowSpan.innerHTML = '&#11167;'; // Down arrow
    }
};


document.getElementById('amount').addEventListener('input', function () {
    const inputAmount = parseFloat(this.value);
    const amount1 = JSON.parse(sessionStorage.getItem('amount1'));

    if (inputAmount > amount1) {
        displayAmountError('*Insufficient Balance', true);
        this.style.border = '2px solid red';
        document.getElementById('submitbutton').disabled = true;
    } else if (inputAmount !== "" && !isNaN(inputAmount) && inputAmount >= 0) {
        displayAmountError('', false);
        this.style.border = '';
        document.getElementById('submitbutton').disabled = false;
    } else {
        displayAmountError('*Please write a valid amount', true);
        this.style.border = '2px solid red';
        document.getElementById('submitbutton').disabled = true;
    }

});




function submit() {
    showloader();
    let formValid = true;

    // Check if tournament is selected
    if (!selectedTournaments) {
        hideLoader();
        displayError('tournamentError', '*Please select a tournament', true); // Show tournament error
        formValid = false;
    } else {
        displayError('tournamentError', '', false); // Clear error if tournament is selected
    }

    const inputAmount = document.getElementById("amount").value;

    // Validate amount input
    if (inputAmount === "" || inputAmount === null || isNaN(inputAmount) || parseFloat(inputAmount) < 0) {
        hideLoader();
        displayAmountError('*Please write a valid amount', true); // Show error for invalid amount
        formValid = false;
    } else {
        displayAmountError('', false); // Clear error if amount is valid
    }

    if (!formValid) {
        return;  // Exit the function early
    }

    loader_overlay.style.display = 'flex';  // Ensure loader is visible while the request is processed

    const retrieve_matches = {
        tournament: selectedTournaments,
        amount: parseFloat(inputAmount),
    };

    fetch('http://127.0.0.1:5000/retrieve_matches', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(retrieve_matches),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            // Add a dictionary to the first API's output
            let marketCatalogue = data.market_catalogue;
            marketCatalogue.forEach(item => {
                item.newKey = "newValue"; // Example of adding a new key-value pair
            });

            // Store the modified output in sessionStorage
            sessionStorage.setItem('market_catalogue', JSON.stringify(marketCatalogue));
            console.log("-----")
            // window.location.href = "../match/match1.html";

            // Proceed to the second API call with the updated data
            return fetch('http://127.0.0.1:5000/fetch_particular_match', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "data": { "market_catalogue": marketCatalogue } }),
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            sessionStorage.setItem('winning_player', JSON.stringify(data));
           
            // Redirect or handle the second API's response
            window.location.href = "../match/matchui.html";
        })
        .catch(error => {
            loader_overlay.style.display = 'none';

            console.error('Error:', error);
            Swal.fire({
                title: 'Error!',
                text: 'An error occurred while submitting the data.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        })
        .finally(() => {
            loader_overlay.style.display = 'none';
            hideLoader();
        });
}




// Function to display the tournament error
function displayError(elementId, message, show) {
    const errorElement = document.getElementById(elementId);
    if (show) {
        errorElement.textContent = message;
        errorElement.style.color = 'red';
        errorElement.style.fontSize = '12px';
        errorElement.style.marginTop = '6%';
        errorElement.style.display = 'block';
    } else {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}
// margin-top: 9%;

// Function to display the amount error
function displayAmountError(message, show) {
    const amountErrorElement = document.getElementById('amountError');
    const amountInput = document.getElementById('amount');
    if (amountErrorElement) {
        if (show) {
            amountErrorElement.textContent = message;
            amountErrorElement.style.color = 'red';
            amountErrorElement.style.fontSize = '12px';
            amountErrorElement.style.marginTop = '6%';
            amountErrorElement.style.display = 'block';
            amountInput.style.border = '2px solid red';
        } else {
            amountErrorElement.textContent = '';
            amountErrorElement.style.display = 'none';
            amountInput.style.border = '';
        }
    } else {
        console.error("Amount error element not found");
    }
}





// -------------------------------------------------

