// UI Navigation Elements
const navToggler = document.querySelector('.nav-toggler');
const navMenu = document.querySelector('.site-navbar ul');
const navLinks = document.querySelectorAll('.site-navbar a');
 
// Initialize all event listeners
function allEventListners() {
    navToggler.addEventListener('click', togglerClick);
    navLinks.forEach(elem => elem.addEventListener('click', navLinkClick));
}
 
function togglerClick() {
    navToggler.classList.toggle('toggler-open');
    navMenu.classList.toggle('open');
}
 
function navLinkClick() {
    if (navMenu.classList.contains('open')) {
        navToggler.click();
    }
}
 
// Profile and Account Balance
async function fetchTournamentsAndAmount() {
    try {
        const sessionToken = localStorage.getItem('sessionToken');
        const amountResponse = await fetch('http://localhost:6060/api/accfunds', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionToken}`
            }
        });
 
        if (!amountResponse.ok) {
            throw new Error(`Amount: ${amountResponse.status}`);
        }
 
        const amountData = await amountResponse.json();
        const amount2 = amountData.Amount;
 
        const spanElement = document.querySelector('#profile_amount');
        if (!spanElement) {
            throw new Error('Span element not found in the DOM');
        }
        spanElement.textContent = `$${amount2}`;
 
        sessionStorage.setItem('amount2', JSON.stringify(amount2));
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
}
 
// Profile Dropdown Functionality
document.addEventListener('DOMContentLoaded', function() {
    const profileIcon = document.querySelector('.profile');
    const dropdownContent = document.querySelector('.profile-dropdown');
    const logoutBtn = document.querySelector('#logout');
 
    profileIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdownContent.style.display = "block";
    });
 
    document.addEventListener('click', function() {
        dropdownContent.style.display = "none";
    });
 
    logoutBtn.addEventListener('click', function() {
        window.location.href = '../login/login.html';
        sessionStorage.clear();
        localStorage.removeItem('sessionToken');
        history.replaceState(null, null, window.location.href);
    });
});
 
// Sports Data Fetching
async function fetchEvent() {
    const selectElements = document.querySelectorAll('.allSports');
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
            sports = data.map(sport => ({
                id: sport.id,
                name: sport.name
            }));
 
            sessionStorage.setItem('sportsList', JSON.stringify(sports));
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
                option.value = sport.name; // Using sport name instead of ID
                select.appendChild(option);
            });
        });
    } catch (error) {
        console.error('Error fetching sports data:', error);
    }
}
 
// Date Management
function getSelectedDateRange() {
    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;
    return { startDate, endDate };
}
 
// Initialize date picker with current date
document.addEventListener("DOMContentLoaded", function() {
    const today = new Date();
    const formattedDate = formatDate(today);
    document.getElementById("start-date").value = formattedDate;
    document.getElementById("end-date").value = formattedDate;
 
    const timeFrameSelect = document.getElementById("time-frame-select");
    if (timeFrameSelect) {
        timeFrameSelect.addEventListener("change", function() {
            const dates = calculateDates(this.value);
            if (dates) {
                document.getElementById("start-date").value = formatDate(dates.start);
                document.getElementById("end-date").value = formatDate(dates.end);
            }
        });
    }
});
 
function calculateDates(value) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayMilliseconds = 1000 * 60 * 60 * 24;
    let dates = null;
 
    switch (value) {
        case "today":
            dates = { start: today, end: today };
            break;
        case "yesterday":
            const yesterday = new Date(today.getTime() - dayMilliseconds);
            yesterday.setHours(0, 0, 0, 0);
            dates = { start: yesterday, end: yesterday };
            break;
        case "last-7-days":
            dates = {
                start: new Date(today.getTime() - 6 * dayMilliseconds),
                end: today
            };
            break;
        case "last-month":
            const endDate = new Date(today.getFullYear(), today.getMonth(), 0);
            const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
            dates = { start: startDate, end: endDate };
            break;
        case "last-year":
            dates = {
                start: new Date(today.getFullYear() - 1, 0, 1),
                end: new Date(today.getFullYear() - 1, 11, 31)
            };
            break;
    }
    return dates;
}
 
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
}
 
function parseDate(dateString) {
    const parts = dateString.split(/[-/]/);
    if (parts.length !== 3) return null;
 
    const month = parseInt(parts[0]) - 1;
    const day = parseInt(parts[1]);
    const year = parseInt(parts[2]);
 
    const date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0);
    return date;
}
 
// History Filtering and Display
function getHistory() {
    const historyTable = document.querySelector('.history');
    const sportSelect = document.querySelector('.allSports');
    const { startDate, endDate } = getSelectedDateRange();
 
    historyTable.style.display = "block";
 
    // Get history data from session storage or API
    const storedHistory = sessionStorage.getItem('historyData');
   
    if (storedHistory) {
        const historyData = JSON.parse(storedHistory);
        displayFilteredHistory(historyData, startDate, endDate, sportSelect.value);
    } else {
        const sessionToken = localStorage.getItem('sessionToken');
       
        fetch(`http://localhost:6060/api/gethistory`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionToken}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(response => {
            sessionStorage.setItem('historyData', JSON.stringify(response));
            displayFilteredHistory(response, startDate, endDate, sportSelect.value);
        })
        .catch(error => {
            console.error('Error:', error);
            historyTable.style.display = "none";
            alert('Error fetching history data: ' + error.message);
        });
    }
}
 
function displayFilteredHistory(data, startDate, endDate, selectedSport) {
    const historyTable = document.querySelector('.history');
    const dataToDisplay = Array.isArray(data) ? data : [data];
   
    const startDateTime = parseDate(startDate);
    const endDateTime = parseDate(endDate);
   
    const filteredData = dataToDisplay.filter(entry => {
        const meetsDateCriteria = filterByDateRange(entry, startDateTime, endDateTime);
        const meetsSportCriteria = filterBySport(entry, selectedSport);
        return meetsDateCriteria && meetsSportCriteria;
    });
 
    if (filteredData.length === 0) {
        const tbody = historyTable.querySelector('tbody') || historyTable.appendChild(document.createElement('tbody'));
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 20px;">No matching records found</td></tr>';
    } else {
        HistoryRows({ data: filteredData });
    }
}
 
function filterByDateRange(entry, startDateTime, endDateTime) {
    if (!entry.date) return false;
 
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
 
    if (startDateTime.getTime() === endDateTime.getTime()) {
        return entryDate.getTime() === startDateTime.getTime();
    }
 
    return entryDate >= startDateTime && entryDate <= endDateTime;
}
 
function filterBySport(entry, selectedSport) {
    if (!selectedSport || selectedSport === "") {
        return true;
    }
 
    let entrySportName = null;
   
    if (entry.Match && typeof entry.Match === 'string') {
        entrySportName = entry.Match.split(' ')[0];
    }
   
    if (!entrySportName) {
        if (entry.sport && entry.sport.name) entrySportName = entry.sport.name;
        else if (entry.sportName) entrySportName = entry.sportName;
        else if (entry.Sport) entrySportName = entry.Sport;
    }
 
    if (!entrySportName) {
        return false;
    }
 
    return entrySportName.toLowerCase().trim() === selectedSport.toLowerCase().trim();
}
 
function HistoryRows({ data }) {
    const historyTable = document.querySelector('.history');
    const tbody = historyTable.querySelector('tbody') || historyTable.appendChild(document.createElement('tbody'));
    tbody.innerHTML = '';
 
    const dataArray = Array.isArray(data) ? data : [data];
 
    dataArray.forEach(entry => {
        const strategyName = entry.strategy ? entry.strategy.replace('Strategy_', 'Strategy ') : '';
       
        let formattedDate = 'N/A';
        if (entry.date) {
            const dateObj = new Date(entry.date);
            const day = String(dateObj.getUTCDate()).padStart(2, '0');
            const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
            const year = dateObj.getUTCFullYear();
            formattedDate = `${day}/${month}/${year}`;
        }
 
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>${entry.Match || 'N/A'}</td>
            <td>${entry.Player || 'N/A'}</td>
            <td>${strategyName}</td>
            <td>${entry.Odds || 'N/A'}</td>
            <td>${entry.Amount || '0'}</td>
            <td>${entry.Odds || 'N/A'}</td>
            <td>${entry.Status || 'N/A'}</td>
            <td>${entry.ProfitLoss || '0'}</td>
        `;
        tbody.appendChild(row);
    });
}
 
// Event Listeners
document.addEventListener("DOMContentLoaded", function() {
    allEventListners();
    fetchTournamentsAndAmount();
    fetchEvent();
 
    const startDateInput = document.getElementById("start-date");
    const endDateInput = document.getElementById("end-date");
    const timeFrameSelect = document.getElementById("time-frame-select");
    const sportSelect = document.querySelector('.allSports');
    const getHistoryButton = document.getElementById("get-history-button");
 
    // Only trigger getFilteredHistory when the button is clicked
    if (getHistoryButton) {
        getHistoryButton.addEventListener("click", getFilteredHistory);
    }
});
 