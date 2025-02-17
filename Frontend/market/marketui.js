

// -===========================================================

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


// ------------------------------------------------

document.addEventListener('DOMContentLoaded', function() {
  // Update wallet balance from profile_amount
  const profileIcon = document.querySelector('.profile');
  const dropdownContent = document.querySelector('.profile-dropdown');
  const profileAmount = document.getElementById('profile_amount');
  const walletBalance = document.getElementById('wallet-balance');
  const logoutBtn = document.querySelector('#logout');

  profileIcon.addEventListener('click', function(e) {
    console.log("Hiii")
    e.stopPropagation();
    dropdownContent.style.display="block"
  });
  
  document.addEventListener('click', function(e) {
    dropdownContent.style.display="none"
   });
  
  if (profileAmount && walletBalance) {
      // Remove the '$' if it exists in the profile_amount text
      const amount = profileAmount.textContent.replace('$', '').trim();
      walletBalance.textContent = `$${amount}`;
  }
  logoutBtn.addEventListener('click', function() {
    window.location.href = '../login/login.html';
    sessionStorage.clear();
    history.replaceState(null, null, window.location.href); // Replace current state
    localStorage.removeItem('sessionToken');
  });
});



// ================================================



function showloader(){
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.display = 'block';
    }
}

function hideLoader(){
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.display = 'none';
    }
}


// async function fetchTournamentsAndAmount() {
//     try {
//       const sessionToken = localStorage.getItem('sessionToken');
//       const [amountResponse , matchDataResponse] = await Promise.all([
//         // fetch('http://127.0.0.1:5000/get_tournament'),
//         fetch('http://localhost:6060/api/accfunds'),{
//           method: 'POST',
//           headers: {
//               'Content-Type': 'application/json',
//               'Authorization': `Bearer ${sessionToken}`
//           }
//         },
//       fetch(`http://localhost:6060/api/gethistory`, {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//         }
//     })
//       ]);
    
   
//       if (!amountResponse.ok ) {
//         throw new Error(
//           `Amount: ${amountResponse.status}`
//         );
//       }
//       if (!matchDataResponse.ok) {
//         throw new Error(`Match Data API error: ${matchDataResponse.status}`);
//       }


//       const [amountData,  matchData] = await Promise.all([
//         // tournamentResponse.json(),
//         amountResponse.json(),
//         matchDataResponse.json()
//       ]);
    

//       const amount2 = amountData.Amount;
   
//       console.log(amount2)
//       const spanElement = document.querySelector('span');
//       if (!spanElement) {
//         throw new Error('Span element not found in the DOM');
//       }
//       spanElement.textContent = `$${amount2} `;
   
//       sessionStorage.setItem('amount2', JSON.stringify(amount2));
//       sessionStorage.setItem('MarketsStatus', JSON.stringify(matchData.match_status_data));

   
//     } catch (error) {
//       console.error('Error fetching data:', error.message);
//     }
//   }

async function fetchTournamentsAndAmount() {
  // Initialize responses as null
  let amountResponse = null;
  let matchDataResponse = null;
  
  try {
    const sessionToken = localStorage.getItem('sessionToken');
    
    // Fetch account funds with its own try/catch
    try {
      amountResponse = await fetch('http://localhost:6060/api/accfunds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`
        }
      });
      
      if (!amountResponse.ok) {
        throw new Error(`Amount API error: Status ${amountResponse.status}`);
      }
    } catch (amountError) {
      console.error('Error fetching account funds:', amountError.message);
      // Continue execution to try the second fetch
    }
    
    // Fetch match history with its own try/catch
    try {
      matchDataResponse = await fetch('http://localhost:6060/api/gethistory', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!matchDataResponse.ok) {
        throw new Error(`Match Data API error: Status ${matchDataResponse.status}`);
      }
    } catch (matchError) {
      console.error('Error fetching match history:', matchError.message);
      // Continue execution to process any successful responses
    }
    
    // Process successful responses
    if (amountResponse && amountResponse.ok) {
      try {
        const amountData = await amountResponse.json();
        const amount2 = amountData.Amount;
        console.log('Amount data:', amount2);
        
        const spanElement = document.querySelector('#profile_amount');
        if (spanElement) {
          spanElement.textContent = `$${amount2} `;
          sessionStorage.setItem('amount2', JSON.stringify(amount2));
        } else {
          console.warn('Profile amount element not found in the DOM');
        }
      } catch (parseError) {
        console.error('Error parsing amount data:', parseError.message);
      }
    }
    
    if (matchDataResponse && matchDataResponse.ok) {
      try {
        const matchData = await matchDataResponse.json();
        console.log(matchData);
        if (matchData) {
          sessionStorage.setItem('MarketsStatus', JSON.stringify(matchData));
          console.log('Match status data saved to session storage');
        } else {
          console.warn('match_status_data not found in response');
        }
      } catch (parseError) {
        console.error('Error parsing match data:', parseError.message);
      }
    }
    
  } catch (globalError) {
    console.error('Global error in fetchTournamentsAndAmount:', globalError.message);
  } finally {
    // Hide loader regardless of success or failure
    hideLoader();
    
    // Log completion
    console.log('Fetch operation completed - Amount response:', 
                amountResponse ? amountResponse.status : 'failed',
                'Match data response:', 
                matchDataResponse ? matchDataResponse.status : 'failed');
  }
}

document.addEventListener('DOMContentLoaded', fetchTournamentsAndAmount);


document.addEventListener('DOMContentLoaded', function (){
    const profileamount1 = sessionStorage.getItem('amount2');
if (profileamount1) {
    const amount2 = JSON.parse(profileamount1);
    const profileAmountSpan = document.getElementById('profile_amount');
    profileAmountSpan.textContent = `$ ${amount2} `;
} else {
    console.log('amount was not found');
}

})


document.addEventListener('DOMContentLoaded', function () {
  const tableBody = document.getElementById('table-body');
  let hasRefreshed = false; // Ensure the refresh happens only once

  if (!tableBody) {
      console.error('Table body not found.');
      return;
  }

  // Intersection Observer to detect when the table is visible
  const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
          if (entry.isIntersecting && !hasRefreshed) {
              hasRefreshed = true; // Mark as refreshed
              console.log('Table is visible. Refreshing data...');
              
              // Show loader while data updates
              showloader();

              // Fetch data again
              fetchTournamentsAndAmount().then(() => {
                  // Hide loader after updating the table
                  hideLoader();

                  // Optionally re-populate the table with updated data
                  updateTable();
              });

              observer.disconnect(); // Stop observing after first visibility
          }
      });
  }, {
      root: null, // Use the viewport as the root
      threshold: 0.1 // Trigger when 10% of the table is visible
  });

  // Start observing the table body
  observer.observe(tableBody);
});

// Update table function (optional if data is already in session storage)
function updateTable() {
  const MARKETstatus = JSON.parse(sessionStorage.getItem('MarketsStatus')) || [];
  const tableBody = document.getElementById('table-body');

  if (!tableBody) {
      console.error('Table body not found.');
      return;
  }

  // Clear existing rows
  tableBody.innerHTML = '';

  // Populate with updated data
  MARKETstatus.forEach((bet) => {
    if (bet.Status && bet.Status==='Matched') { 
        const row = document.createElement('tr');
        const dateCell = document.createElement('td');
        const matchCell = document.createElement('td');
        const strategyCell = document.createElement('td');
        const typeCell = document.createElement('td');
        const playerCell = document.createElement('td');
        const oddsCell = document.createElement('td');
        const amountCell = document.createElement('td');
        const statusCell = document.createElement('td');

        let formattedDate = 'N/A';
        if (bet.date) {
            const dateObj = new Date(bet.date);
            const day = String(dateObj.getUTCDate()).padStart(2, '0');
            const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
            const year = dateObj.getUTCFullYear();
            formattedDate = `${day}/${month}/${year}`;
        }

        dateCell.textContent = formattedDate || '-';
        matchCell.textContent = bet.Match || '-';
        
        const strategyMap = {
            'strategy_1': 'Strategy 1',
            'strategy_2': 'Strategy 2',
            'strategy_3': 'Strategy 3'
        };
        strategyCell.textContent = strategyMap[bet.strategy] || bet.strategy || '-';
        typeCell.textContent = bet.Type || '-';
        playerCell.textContent = bet.Player || '-';
        oddsCell.textContent = bet.Odds || '-';
        amountCell.textContent = bet.Amount >= 0 ? bet.Amount : '-';
        statusCell.textContent = bet.Status || '-';

        row.appendChild(dateCell);
        row.appendChild(matchCell);
        row.appendChild(strategyCell);
        row.appendChild(typeCell);
        row.appendChild(playerCell);
        row.appendChild(oddsCell);
        row.appendChild(amountCell);
        row.appendChild(statusCell);

        tableBody.appendChild(row);
    }
});

}








