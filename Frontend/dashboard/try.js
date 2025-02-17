function submit() {
    const selectedSportId = document.querySelector('.sp').value;
    const selectedTournamentElement = document.querySelector('.tour_text');
    const amountInput = document.getElementById('amount');
    const sessionToken = localStorage.getItem('sessionToken');
    
  
    if (!amountInput || amountInput.value.trim() === '') {
        document.getElementById('amountError').textContent = "Please enter an amount";
        return;
    }
    
    const amount = parseFloat(amountInput.value.trim());
    if (isNaN(amount) || amount < 0) {
        document.getElementById('amountError').textContent = "Amount must be 0 or greater";
        return;
    }

      
    if (!selectedSportId) {
        document.getElementById('tournamentError').textContent = "Please select a sport.";
        return;
    } else {
        document.getElementById('tournamentError').textContent = "";
    }

    if (!tournamentButton.dataset.tournamentId) {
        document.getElementById('tournamentError').textContent = "Please select a tournament.";
        return;
    } else {
        document.getElementById('tournamentError').textContent = "";
    }

    
    const submissionData = {
        eventId: selectedSportId,  
        competitionId: tournamentButton.dataset.tournamentId, 
        amount: parseFloat(amount)
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
            return response.text().then(text => {
                throw new Error(text || response.statusText);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('API Response:', data);
        sessionStorage.setItem('matchData', JSON.stringify(data));
    })
    .catch(error => {
        console.error('Error:', error);
        
        document.getElementById('tournamentError').textContent = error.message;
    });
}