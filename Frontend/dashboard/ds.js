var session=sessionStorage

// ========================================================================

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

const loader_overlay = document.querySelector('.loading-overlay');

// ========================  FETCH ALL SPORTS ===================================
 
async function fetchTournamentsAndAmount() {
    try {
        const sessionToken = localStorage.getItem('sessionToken');
        const [amountResponse] = await Promise.all([
            fetch('http://localhost:6060/api/accfunds',  {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionToken}`
                }
            })
        ]);
 
        if (!amountResponse.ok) {
            throw new Error(`Amount: ${amountResponse.status}`);
        }
 
        const [amountData] = await Promise.all([
            amountResponse.json()
        ]);
 
        const amount2 = amountData.Amount;
 
        const spanElement = document.querySelector('span');
        if (!spanElement) {
            throw new Error('Span element not found in the DOM');
        }
        spanElement.textContent = `$${amount2} `;
 
        sessionStorage.setItem('amount2', JSON.stringify(amount2));
 
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
}
 
 
async function populateSportsSelect() {
    const selectElements = document.querySelectorAll('.allSports, .sp');
 
    selectElements.forEach(selectElement => {
        selectElement.innerHTML = '';
    });
 
    try {
        const storedSports = sessionStorage.getItem('sportsList');
        let sports;
 
        if (storedSports) {
            sports = JSON.parse(storedSports);
        } else {
            const sessionToken = localStorage.getItem('sessionToken');
            console.log("From Event",sessionToken);
            if (!sessionToken) {
                throw new Error("No session token found. User may not be logged in.");
            }
 
            const response = await fetch('http://localhost:6060/api/event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionToken}`
                },
                body: JSON.stringify({})
            });
 
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
 
            const data = await response.json();
            console.log("Sports API Response:", data); // Debugging log
 
            if (Array.isArray(data) && data.length) {
                sports = data.map(sport => ({
                    id: sport.id,
                    name: sport.name
                }));
 
                sessionStorage.setItem('sportsList', JSON.stringify(sports));
            } else {
                throw new Error('Invalid data structure');
            }
        }
 
 
        selectElements.forEach(select => {
            const allSportsOption = document.createElement('option');
            allSportsOption.id = 'allsports';
            allSportsOption.textContent = 'All Sports';
            allSportsOption.value = ''; 
            select.appendChild(allSportsOption);
 
            sports.forEach(sport => {
                const option = document.createElement('option');
                option.textContent = sport.name;
                option.value = sport.id;  
                select.appendChild(option);
            });
            select.addEventListener('change', () => {
                if (select.value) {
                    document.getElementById('sportError').textContent = "";
                    
                    
                    const selectedSport = sports.find(sport => sport.id === select.value);
                    
                    
                    const selectedSportData = {
                        id: select.value,
                        name: selectedSport ? selectedSport.name : 'All Sports'
                    };

                    
                    console.log('Selected Sport:', selectedSportData);
                    
                 
                    sessionStorage.setItem('selectedSport', JSON.stringify(selectedSportData));
                } else {
               
                    console.log('Selected Sport: All Sports');
                    sessionStorage.setItem('selectedSport', JSON.stringify({ id: '', name: 'All Sports' }));
                }
            });
        });
    } catch (error) {
        console.error('Error fetching sports data:', error);
    }
}
 
 
document.addEventListener('DOMContentLoaded', populateSportsSelect);
document.addEventListener('DOMContentLoaded', fetchTournamentsAndAmount);
 
// ====================== FETCH  TOURNAMENT ==================================
 
async function toggleTournamentDropdown() {    
    const selectedSportId = document.querySelector('.sp').value;
    const dropdown = document.getElementById('dropdown');  
    const loader = document.createElement('div');
   
    if (!dropdown) {        
        console.error('Dropdown element not found');        
        return;    
    }      
 
    if (!selectedSportId) {        
        dropdown.innerHTML = '<div>No sport selected.</div>';        
        return;    
    }      
 
    console.log("Selected Sport ID (should be numeric):", selectedSportId);      
 
    try {          
        const sessionToken = localStorage.getItem('sessionToken');        
        if (!sessionToken) {            
            throw new Error("No session token found. User may not be logged in.");        
        }        
 
        // Show loading indicator
        loader.classList.add('Tloader');
        loader.innerHTML = `<div class="spinner"></div>`;
        dropdown.innerHTML = ''; // Clear previous results
        dropdown.appendChild(loader);
        dropdown.style.display = 'block';
 
        const response = await fetch('http://localhost:6060/api/tournament', {            
            method: 'POST',            
            headers: {                
                'Content-Type': 'application/json',                
                'Authorization': `Bearer ${sessionToken}`            
            },            
            body: JSON.stringify({ id: selectedSportId })  
        });          
 
        if (!response.ok) {            
            throw new Error(`Failed to fetch tournaments. Status: ${response.status}`);        
        }          
 
        const data = await response.json();        
        console.log("Tournament API Response:", data);          
 
        if (!data || !data.result || !Array.isArray(data.result)) {            
            console.error("Invalid API response format", data);            
            dropdown.innerHTML = '<div>Error fetching tournaments. Check console.</div>';            
            return;        
        }          
 
        const tournaments = data.result;        
        dropdown.innerHTML = ''; // Clear previous results          
 
        if (tournaments.length) {            
            tournaments.forEach(tournament => {                
                const tournamentOption = document.createElement('div');                
                tournamentOption.classList.add('tournament-option');                
                tournamentOption.textContent = tournament.competition.name;                  
 
                tournamentOption.dataset.tournamentId = tournament.competition.id;                
                tournamentOption.dataset.tournamentName = tournament.competition.name;                  
 
                tournamentOption.addEventListener('click', () => {                    
                    const tournamentButton = document.getElementById('tournamentButton');                    
                    tournamentButton.textContent = tournament.competition.name;                    
                    // Store selected tournament data                    
                    tournamentButton.dataset.tournamentId = tournament.competition.id;                    
                    tournamentButton.dataset.tournamentName = tournament.competition.name;                    
                    console.log('Selected Tournament:', {                        
                        id: tournament.competition.id,                        
                        name: tournament.competition.name                    
                    });                    
                    closeDropdown();    
                   
                    document.getElementById("tournamentError").textContent="";
                });                  
 
                dropdown.appendChild(tournamentOption);            
            });              
 
            dropdown.style.display = 'block';        
        } else {            
            dropdown.innerHTML = '<div>No tournaments found.</div>';            
            dropdown.style.display = 'block';        
        }    
    } catch (error) {        
        console.error('Error fetching tournaments:', error);        
        dropdown.innerHTML = `<div>Failed to fetch tournaments. ${error.message}</div>`;    
    }
}
 
 
// ==================== PROFILE ==========================
 
 
document.addEventListener('DOMContentLoaded', function() {
    const profileIcon = document.querySelector('.profile');
    const dropdownContent = document.querySelector('.dropdown-content');
    const logoutBtn = document.querySelector('.logout-btn');
 
    // Toggle dropdown when clicking profile icon
    profileIcon.addEventListener('click', function(e) {
      e.stopPropagation();
      dropdownContent.classList.toggle('show');
    });
 
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.matches('.profile')) {
        if (dropdownContent.classList.contains('show')) {
          dropdownContent.classList.remove('show');
        }
      }
    });
 
    // Handle logout
    logoutBtn.addEventListener('click', function() {
      window.location.href = '../login/login.html';
      sessionStorage.clear();
      history.replaceState(null, null, window.location.href); // Replace current state
      localStorage.removeItem('sessionToken');
    });
  });
 
 
 
 
// ======================  DROPDOWN CLOSE  ======================
 
function closeDropdown() {
    document.getElementById('dropdown').style.display = 'none';
}
 

 
document.addEventListener('click', (event) => {
    const dropdown = document.getElementById('dropdown');
    const button = document.getElementById('tournamentButton');
 
    if (!dropdown.contains(event.target) && !button.contains(event.target)) {
        closeDropdown();
    }
});
 
document.getElementById('tournamentButton').addEventListener('click', (event) => {
    event.stopPropagation();
    toggleTournamentDropdown();
});
 


// ---------------------------------------------------------------
 
    function submit() {
       
        const selectedSportId = document.querySelector('.sp').value;
        const tournamentButton = document.getElementById('tournamentButton');
        const amountInput = document.getElementById('amount');  
        const sessionToken = localStorage.getItem('sessionToken');
    
        let isValid = true;

        document.getElementById('sportError').textContent = "";
        document.getElementById('amountError').textContent = "";
        document.getElementById('tournamentError').textContent = "";
    
        // Validate amount
        if (!amountInput || amountInput.value.trim() === '') {
            document.getElementById('amountError').textContent = "Please enter an amount";
            isValid = false;
        } else {
            const amount = parseFloat(amountInput.value.trim());
            if (isNaN(amount) || amount < 0) {
                document.getElementById('amountError').textContent = "Amount must be 0 or greater";
                isValid = false;
            }
        }
    
        if (!selectedSportId) {
            document.getElementById('sportError').textContent = "Please select a sport.";
            isValid = false;
        }
    
        if (!tournamentButton.dataset.tournamentId) {
            document.getElementById('tournamentError').textContent = "Please select a tournament.";
            isValid = false;
        }
    
        if (!isValid) return;

        showloader();
        loader_overlay.style.display="flex";

    
        const submissionData = {
            eventId: selectedSportId,                          
            competitionId: tournamentButton.dataset.tournamentId,
            amount: parseFloat(amountInput.value.trim())
        };
    
    
        console.log('Form Submission Data:', submissionData);
        console.log('Session Token:', sessionToken);
    
        fetch('http://localhost:6060/api/match', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionToken}`
            },
            body: JSON.stringify(submissionData),
    
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();    
        })
        .then(submissionData => {
            // sessionStorage.setItem('Match Data',  sessionStorage.setItem('Match Data', submissionData) )
            sessionStorage.setItem('Match Data', JSON.stringify(submissionData));
        
            console.log('Match Data:',submissionData );
        
        })
        .then(data => {
            const probabilityData = {
                amount: amount,
                strategies: "default"
            };
    
            // Make the probability API call
            return fetch('http://localhost:6060/api/probability', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionToken}`
                },
                body: JSON.stringify(probabilityData)
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(probabilityData => {
            sessionStorage.setItem('Probability Data' ,JSON.stringify(probabilityData.winning_player_data));
            console.log('Probability Data:', probabilityData);
            hideLoader()
           
            window.location.href = "../match/matchui.html";
            // loader_overlay.style.display='flex';
        
        })
        .catch(error => {
            console.error('Error:', error);
        // Hide loader and overlay on error
        hideLoader();
        loader_overlay.style.display = "none";
        
        // Show sweet alert for error
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong! Please try again.',
            confirmButtonColor: '#3085d6'
        });
    });
    }
    
  




// ========================================================

    // function checkSessionData() {
    //     const matchData = sessionStorage.getItem('Match Data');
    //     const probabilityData = sessionStorage.getItem('Probability Data');
    
    //     const matchDis = document.getElementById('match_dis');
    //     const matchStatDis = document.getElementById('matchstat_dis');
    
    //     const matchLink = matchDis.querySelector('a');
    //     const matchStatLink = matchStatDis.querySelector('a');
    
    //     if (!matchData && !probabilityData) {
    //         matchDis.classList.add('disabled');
    //         matchStatDis.classList.add('disabled');
    
    //         matchLink.addEventListener('click', preventNavigation);
    //         matchStatLink.addEventListener('click', preventNavigation);
    
    //         // console.log("Links disabled due to missing session data.");
    //     } else {
    //         matchDis.classList.remove('disabled');
    //         matchStatDis.classList.remove('disabled');
    
    //         matchLink.removeEventListener('click', preventNavigation);
    //         matchStatLink.removeEventListener('click', preventNavigation);
    
    //         // console.log("Links enabled. MatchData:", matchData, "ProbabilityData:", probabilityData);
    //     }
    // }
    
    // function preventNavigation(event) {
    //     event.preventDefault();
    // }
    // ;

// ========================================================
 

document.getElementById('amount').addEventListener('input', function () {
    const amount = parseFloat(this.value.trim());
    if (!isNaN(amount) && amount >= 0) {
        document.getElementById('amountError').textContent = "";
    }
});
 
document.addEventListener('DOMContentLoaded', function () {
    // Check session token and redirect if not found
    const sessionToken = sessionStorage.getItem('sessionToken');
    if (!sessionToken) {
        window.location.href = "../login/login.html";
        window.history.forward(1);
      

    } else {
        history.pushState(null, null, location.href);
        window.onpopstate = function () {
            history.pushState(null, null, location.href);
        };
    }


    // checkSessionData();
});














// const matchDisable = document.getElementById('match_dis')

// console.log("---",session.getItem('Match Data') )
// console.log("probability ", session.getItem('Probability Data'))
 


// if (!sessionStorage.getItem('MatchData') && sessionStorage.getItem('ProbabilityData')) {
//     document.getElementById('match_dis').classList.add('disabled');
//     document.getElementById('matchstat_dis').classList.add('disabled');

//     console.log(" empty");
// } else {
//     document.getElementById('match_dis').classList.remove('disabled');
//     document.getElementById('matchstat_dis').classList.remove('disabled');
//     console.log("hello");
// }

 
function submit() {
    const selectedSportId = document.querySelector('.sp').value;
    const tournamentButton = document.getElementById('tournamentButton');
    const amountInput = document.getElementById('amount');  
    const sessionToken = localStorage.getItem('sessionToken');
    let isValid = true;

    // Clear previous error messages
    document.getElementById('sportError').textContent = "";
    document.getElementById('amountError').textContent = "";
    document.getElementById('tournamentError').textContent = "";

    // Validate inputs before showing loader
    if (!amountInput || amountInput.value.trim() === '') {
        document.getElementById('amountError').textContent = "Please enter an amount";
        isValid = false;
    } else {
        const amount = parseFloat(amountInput.value.trim());
        if (isNaN(amount) || amount < 0) {
            document.getElementById('amountError').textContent = "Amount must be 0 or greater";
            isValid = false;
        }
    }

    if (!selectedSportId) {
        document.getElementById('sportError').textContent = "Please select a sport.";
        isValid = false;
    }

    if (!tournamentButton.dataset.tournamentId) {
        document.getElementById('tournamentError').textContent = "Please select a tournament.";
        isValid = false;
    }

    // If validation fails, return early without showing loader
    if (!isValid) {
        return;
    }

    // Show loader only if validation passes
    showloader();
    loader_overlay.style.display = "flex";

    const submissionData = {
        eventId: selectedSportId,                          
        competitionId: tournamentButton.dataset.tournamentId,
        amount: parseFloat(amountInput.value.trim())
    };

    console.log('Form Submission Data:', submissionData);

    fetch('http://localhost:6060/api/match', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionToken}`
        },
        body: JSON.stringify(submissionData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();    
    })
    .then(submissionData => {
        sessionStorage.setItem('Match Data', JSON.stringify(submissionData));
        console.log('Match Data:', submissionData);
        
        const probabilityData = {
            amount: amountInput.value.trim(),
            strategies: "default"
        };

        return fetch('http://localhost:6060/api/probability', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionToken}`
            },
            body: JSON.stringify(probabilityData)
        });
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(probabilityData => {
        sessionStorage.setItem('Probability Data', JSON.stringify(probabilityData.winning_player_data));
        console.log('Probability Data:', probabilityData);
        hideLoader();
        window.location.href = "../match/matchui.html";
    })
    .catch(error => {
        console.error('Error:', error);
        // Hide loader and overlay on error
        hideLoader();
        loader_overlay.style.display = "none";
        
        // Show sweet alert for error
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong! Please try again.',
            confirmButtonColor: '#3085d6'
        });
    });
} 
 
 






