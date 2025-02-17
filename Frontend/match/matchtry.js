let gselectedMatches = [];
let gselectedStrategies = []// Array to store selected strategy for each match
let gselectedAmounts = [];
c=true
let all_data = { "data": { "market_catalogue": [] } }
let all_changes = { "data": { "market_catalogue": [] } }
let ID = [];
let ID_2 = [];
cc=0
let selectedStrategy = 'strategy_1'; // Default value set to 'strategy_1'
let REDIRECT = false;
const UPDATED_DATA = {}
var CHANGES = [];
var Type = '';
// var Type_lay
var backOdds = ""
var layOdds = ""


const submit_disable = document.getElementById('Submit_button');
const loader_overlay = document.querySelector('.loading-overlay');

function nextBtn() {
    window.location.href = "../market/market.html";
}

function showloader() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.display = 'block';
    }
}

function hideLoader() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.display = 'none';
    }
}

// ----------------------------------------------------------------------------------
 
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
 
 
document.addEventListener('DOMContentLoaded', function() {
    // Update wallet balance from profile_amount
    const profileIcon = document.querySelector('.profile');
    const dropdownContent = document.querySelector('.profile-dropdown');
    const logoutBtn = document.querySelector('#logout');
    const profileAmount = document.getElementById('profile_amount');
    const walletBalance = document.getElementById('wallet-balance');
   
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
 
 
// --------------------------------------------------------------------------------------------------------



async function fetchTournamentsAndAmount() {
    try {
    const sessionToken = localStorage.getItem('sessionToken');
      const [amountResponse] = await Promise.all([
        // fetch('http://127.0.0.1:5000/get_tournament'),
        fetch('http://localhost:6060/api/accfunds'),{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionToken}`
            }
        }
      ]);

   
      if (!amountResponse.ok) {
        throw new Error(
          ` Amount: ${amountResponse.status}`
        );
      }
   
      const [amountData] = await Promise.all([
        // tournamentResponse.json(),
        amountResponse.json()
      ]);
   
      const amount2 = amountData.amount;
   
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


document.addEventListener('DOMContentLoaded', fetchTournamentsAndAmount);



document.addEventListener('DOMContentLoaded', function () {

    const profileamount1 = sessionStorage.getItem('amount2');
    const selectedMatchTag = document.getElementById('selectedMatch');
    const selectedStrategyTag = document.getElementById('Selected_Strategy');
    const selectedAmountTag = document.getElementById('final_amount');

    if (profileamount1) {
        const amount = JSON.parse(profileamount1);
        const profileAmountSpan = document.getElementById('profile_amount');

        profileAmountSpan.textContent = `$${amount} `;
    } else {
        console.log('No amount found in sessionStorage');
    }

    const selectAllCheckbox = document.getElementById('select-all-checkbox');
    const tableBody = document.getElementById('table-body');

    const matchesData = sessionStorage.getItem('market_catalogue');
  
// console.log("matchesData" ,matchesData);


    let matches = [];

    if (matchesData) {
        try {
            matches = JSON.parse(matchesData);
         
        } catch (error) {
            console.error('Error parsing matches from sessionStorage:', error);
        }
    }

    if (!Array.isArray(matches)) {
        console.error("Invalid data structure for matches.");
        return;
    }


    const matches1 = matches.map(match => {
        const players = match.runners.map(runner => runner.runnerName);
        return `${players[0]} VS ${players[1]}`;
    });

    const matches11 = matches.map(match => {
       
        return match;
    });


    // Append rows dynamically
    matches.forEach((match, index) => {

        const totalMatched = matches11[index]?.totalMatched || 0;
        const row = document.createElement('tr');
        // Add checkbox cell
        const selectCell = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.style.cursor = 'pointer';
        checkbox.type = 'checkbox';
        checkbox.value = `match_${index}`;
        selectCell.appendChild(checkbox);
        row.appendChild(selectCell);

        // Add other cells
        const runnersCell = document.createElement('td');
        const marketTimeCell = document.createElement('td');
        const winnerCell = document.createElement('td')
        const probabilitycell = document.createElement('td')
        const oddsCell = document.createElement('td')
        const volumeCell = document.createElement('td');
        const strategyCell = document.createElement('td');
        const amountCell = document.createElement('td');


        const rawData = sessionStorage.getItem('winning_player');
        const winning_player_odds = rawData ? JSON.parse(rawData) : null;

       var backOdds = ""
       var layOdds = ""

        if (winning_player_odds && Array.isArray(winning_player_odds.winning_player_data)) {
            // Loop through the array of winning player data
            winning_player_odds.winning_player_data.forEach((playerData, dataIndex) => {
          
    
                if (dataIndex === index) {
                    // Access the required player data
                    const playerName = playerData.player_name || 'No Player';
                    const playerWinProb = playerData.player_win_prob || '-';
                     backOdds = playerData.player_back_odds || '--';
                     layOdds = playerData.player_lay_odds || '--';
                  

                    if(playerName === 'Player Not Found!'){
                    }else{
                        ID_2.push(index)

                    }

                    // Format the playerWinProb to 2 decimal places, if it's a valid number
                    const formattedPlayerWinProb = (typeof playerWinProb === 'number') ? playerWinProb.toFixed(2) : playerWinProb;
                    // Fill cells only when index matches
                    winnerCell.textContent = playerName;
                    probabilitycell.textContent = formattedPlayerWinProb;
                    oddsCell.innerHTML = `Back: ${backOdds}<br>Lay: ${layOdds}`;





                    if (backOdds >layOdds){
                        Type = 'Back' 
                    }else {
                        Type = 'Lay' 
                    }

                    // if (backOdds <layOdds){
                       
                    // }

                    CHANGES.push({
                        winner: winnerCell.textContent,
                        probability: probabilitycell.textContent,
                        Type: Type,
                        backOdds: parseFloat(backOdds),
                        layOdds: parseFloat(layOdds),

                    });      
                //  console.log("---", Type.textContent);
                    
                }
            });
        } 
 
        const marketTime = matches11[index]["marketStartTime"] || '-';
        marketTimeCell.textContent = marketTime || '-';

        // console.log("market",marketTime )
      
    // var amount_target =""
        
       const amountInput = document.createElement('input');
        amountInput.min = 0;
        amountInput.className = 'input_amount';
        amountInput.type = 'number';
        amountInput.placeholder = ' 0 ($)';
        amountInput.style.textAlign = 'center';
        amountInput.value = match.amount || 0;
        amountInput.style.width = '60px';
        amountInput.style.height = '24px';
        amountInput.style.textDecoration = 'none';
        amountInput.style.border = '1px solid black';
        amountCell.appendChild(amountInput);


        amount_target = amountInput.textContent; 
        
        
        runnersCell.textContent = matches1[index];
        // console.log( "match",runnersCell.textContent)
        
        const strategyDisplayNames = {
            'strategy_1': 'Strategy 1',
            'strategy_2': 'Strategy 2',
            'strategy_3': 'Strategy 3'
        };
        
        // console.log("amount", amount_target);

        const messageDisplay = document.createElement('div');
        messageDisplay.style.position = 'absolute';
        messageDisplay.style.top = '0';
        messageDisplay.style.left = '100%';
        messageDisplay.style.marginLeft = '10px';
        messageDisplay.style.padding = '5px';
        messageDisplay.style.border = '2px solid red';  // Apply the red border as requested
        messageDisplay.style.backgroundColor = '#fff';
        messageDisplay.style.display = 'none';  // Initially hide it
        messageDisplay.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        messageDisplay.style.fontSize = '12px';
        messageDisplay.style.whiteSpace = 'nowrap';

        // Create dropdown for strategies
        let matchStrategy = (probabilitycell.textContent === '-') ? 'strategy_3' : (match.selectedStrategy || 'strategy_1');
        // let matchStrategy = matches11[index].gp_strat
        const dropdownWrapper = document.createElement('div');
        dropdownWrapper.style.position = 'relative';
        dropdownWrapper.style.border = '1px solid black';
        dropdownWrapper.style.borderRadius = '3px';
        dropdownWrapper.style.paddingBottom = '3px';

        const dropdownIcon = document.createElement('span');
        dropdownIcon.textContent = strategyDisplayNames[matchStrategy];
        // dropdownIcon.textContent = `${matchStrategy}`;
        dropdownIcon.style.cursor = 'pointer';
        dropdownIcon.style.padding = '5px';
        dropdownIcon.style.fontSize = '14px';


        const dropdownMenu = document.createElement('ul');

        dropdownMenu.style.position = 'absolute';
        dropdownMenu.style.listStyle = 'none';
        dropdownMenu.style.padding = '10px';
        dropdownMenu.style.margin = '0';
        dropdownMenu.style.backgroundColor = '#fff';
        dropdownMenu.style.border = '1px solid #ccc';
        dropdownMenu.style.display = 'none';
        dropdownMenu.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        dropdownMenu.style.zIndex = '999';
        dropdownMenu.style.marginLeft = '-45px';
        dropdownMenu.style.marginTop = '5px';

        const strategies = ['strategy_1', 'strategy_2', 'strategy_3'];

        matches11[index].selectedStrategy = matchStrategy;


        strategies.forEach(strategy => {
            const listItem = document.createElement('li');
            listItem.textContent = strategyDisplayNames[strategy];
            listItem.style.cursor = 'pointer';
            listItem.style.padding = '5px';
            listItem.style.borderBottom = '1px solid #ccc';
            listItem.style.position = 'relative'; // Important for absolute positioning of message box
            listItem.style.fontSize = '15px';

            listItem.id = `strategy-${index}`;

            const infoIcon = document.createElement('i');
            infoIcon.classList.add('fa-solid', 'fa-circle-info');
            infoIcon.style.marginLeft = '10px';
            infoIcon.style.cursor = 'pointer';

            // Create message box
            const messageBox = document.createElement('div');
            

            let messageText = '';

            if (strategy === 'strategy_3' || (probabilitycell.textContent !== '-' )) {
                // Enable Strategy 3
                listItem.disabled = false;
                listItem.style.cursor = 'pointer';
                listItem.style.color = 'black';
                listItem.style.pointerEvents = 'auto'; 
                listItem.classList.remove('disabled');
        
                listItem.addEventListener('click', () => {
                    dropdownIcon.textContent = strategyDisplayNames[strategy];
                    matches11[index].selectedStrategy = strategy;
                    dropdownMenu.style.display = 'none';
                });
            } else {
                // Disable all other strategies
                listItem.disabled = true;
                listItem.style.cursor = 'not-allowed';
                listItem.style.color = 'grey';
                listItem.classList.add('disabled');
                listItem.style.pointerEvents = 'none'; 
                listItem.setAttribute('tabindex', '-1');
            }
           
           
            if (strategy === 'strategy_1') {
                messageBox.style.marginTop = '-125%';
                messageBox.style.left = '-100px';
                
                // strr_1 = backOdds-1

                messageText = '<b>Hedging Strategy</b><br>' +
                    'This approach secures steady, small profits by placing both Back and Lay bets on the player ' +
                    'predicted by our ML Model. A Back bet is placed pre-match on the predicted winner, and a Lay bet ' +
                    'is placed live at lower odds. <br>' +
                    '<b>Unmatched Risk:</b> Moderate, There are chances of Unmatched Lay Bet. <br>' +
                    '<b>Minimum Amount:</b> $2 per match. <br>' +
                    '<b>Estimated Profit:</b> 5% to 10% of the stake per match.';
            } else if (strategy === 'strategy_2') {
                messageBox.style.marginTop = '-135%';
                messageBox.style.left = '-135px';
                messageBox.style.zIndex = '10';

                messageText = '<b>Probability-Based Strategy</b><br>' +
                    'This approach secures high profit by Leveraging the ML model\'s prediction to find value in ' +
                    'market odds. Implied probabilities are calculated using the formula p* = 1/ (a+b) to identify ' +
                    'favorable opportunities. ' +
                    'With this strategy we either place a Back Bet if the model suggests higher winning chances than ' +
                    'the market, or a Lay Bet if the model predicts lower chances.<br>' +
                    '<b>Unmatched Risk:</b> Low, There are no chances of Unmatched bet. <br>' +
                    '<b>Minimum Amount:</b> $1 per match. <br>' +
                    '<b>Estimated Profit:</b> 5% to 100% of the stake per match.';
            } else if (strategy === 'strategy_3') {
                messageBox.style.marginTop = '-135%';
                messageBox.style.zIndex = '10';
                messageBox.style.left = '-100px';

                messageText = '<b>Hybrid Strategy</b><br>' +
                    'This approach enhances hedging strategy by adjusting stakes on Back and Lay bets to guarantee profit, ' +
                    'regardless of the outcome. <br>' +
                    '<b>Unmatched Risk:</b> Moderate, There are chances of Unmatched Lay Bet.<br>' +
                    '<b>Minimum Amount:</b> $3 per match.<br>' +
                    '<b>Estimated Profit:</b> 2.5% to 10% of the stake per match.';
            }

            // In the messageBox creation part, use innerHTML instead of textContent
            messageBox.innerHTML = messageText;
            messageBox.style.textAlign = 'justify';
            messageBox.style.position = 'absolute';
            // messageBox.style.width = '100%';
            messageBox.style.width = '400px';
            messageBox.style.fontSize = '12px';
            messageBox.style.height = 'auto'; // Height auto to fit content
            messageBox.style.top = '100%'; // Position below the list item
            // messageBox.style.left = '-150px';
            messageBox.style.transform = 'translateX(-50%)'; // Center the message box
            messageBox.style.backgroundColor = 'beige'; // Changed background color to beige
            messageBox.style.border = '1px solid #ccc';
            messageBox.style.padding = '10px'; // Increased padding for better readability
            messageBox.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
            messageBox.style.display = 'none';
            messageBox.style.zIndex = '1';
            messageBox.style.wordWrap = 'break-word'; // Ensure long words break and wrap
            messageBox.style.overflowWrap = 'break-word'; // Additional support for word wrapping
            // Show message box on hover
            infoIcon.addEventListener('mouseenter', () => {
                messageBox.style.display = 'block';
            });

            // Hide message box when mouse leaves
            infoIcon.addEventListener('mouseleave', () => {
                messageBox.style.display = 'none';
            });

            // Append message box to list item
            listItem.appendChild(infoIcon);
            listItem.appendChild(messageBox);

            // Rest of your existing code...
                matches11[index]["gp_strat"] = matchStrategy
                matches11[index]["gp_amount"] = amountInput.value


                listItem.addEventListener('click', () => {


                matchStrategy = strategy;
                matches11[index].selectedStrategy = strategy; 
                matches11[index]["gp_strat"] = matchStrategy
                dropdownIcon.textContent = ` ${strategyDisplayNames[matchStrategy]}`;
                gselectedStrategies[index] = matchStrategy;
                // console.log("strategy" ,matchStrategy )
                // Type = ''

                var temp_data = {
                    "amount": 0,
                    "competition": matches11[index]["competition"],
                    "marketId": matches11[index]["marketId"],
                    "marketName": matches11[index]["marketName"],
                    "marketStartTime" : matches11[index]["marketStartTime"],
                    "runners": matches11[index]["runners"],
                    "strategies": matchStrategy,
                    "totalMatched": matches11[index]["totalMatched"],
                    "winner": winnerCell.textContent,
                    "probability": probabilitycell.textContent,
                    "backOdds": parseFloat(backOdds),
                    "layOdds": parseFloat(layOdds),
                    "Type":Type,
                }


             

                // console.log("temp_data",temp_data)

                const ind = all_data["data"]["market_catalogue"].findIndex(obj => obj.marketId === temp_data.marketId)

                // if (ind !== -1) {
                //     all_data["data"]["market_catalogue"][ind] = temp_data;
                // }

                if (checkbox.checked) {
                    const marketId = matches11[index].marketId;
                    const ind = all_data.data.market_catalogue.findIndex(obj => obj.marketId === marketId);
                    
                    if (ind !== -1) {
                        all_data.data.market_catalogue[ind].strategies = strategy;
                        
                        // Update the display in the selected matches table
                        const selectedRow = document.getElementById(`${marketId}`);
                        if (selectedRow) {
                            const strategyCell = selectedRow.querySelector('.strategy_sel');
                            const profitCell = selectedRow.querySelector('.profit_sel');
                            
                            if (strategyCell && profitCell) {
                                strategyCell.textContent = strategyDisplayNames[strategy];
                                
                                // Get the amount from the amount cell
                                const amountCell = selectedRow.querySelector('.amount_sel');
                                const amount = parseFloat(amountCell.textContent.replace('$', ''));
                                
                                // Calculate profits based on strategy
                                if (strategyDisplayNames[strategy] === 'Strategy 1') {
                                    let new_backO = (amount/2)*(backOdds-1);
                                    let new_layO = (amount/2)*(layOdds-1);
                                    let strr_1 = new_backO-new_layO;
                                    profitCell.textContent = strr_1.toFixed(2);
                                    
                                } else if (strategyDisplayNames[strategy] === 'Strategy 2') {
                                    let strr_2 = (amount)*(backOdds-1);
                                    profitCell.textContent = strr_2.toFixed(2);
                                    
                                } else if (strategyDisplayNames[strategy] === 'Strategy 3') {
                                    let lay_val3 = (layOdds)*(amount/2);
                                    let back_val3 = lay_val3/backOdds;
                                    let Awin = ((backOdds - 1) * back_val3) - ((layOdds - 1) * (amount / 2));
                                    let Bwin = (amount / 2) - back_val3;
                                    profitCell.textContent = `Player1: ${Awin.toFixed(2)} \n Player2: ${Bwin.toFixed(2)}`;
                                }
                                
                                // console.log("updatedStrategy", strategyCell.textContent);
                                // console.log("updatedProfit", profitCell.textContent);
                            }
                        }

                    }
                }

                dropdownMenu.style.display = 'none';
            });

            dropdownMenu.appendChild(listItem);
        });

        if (dropdownMenu.lastChild) {
            dropdownMenu.lastChild.style.borderBottom = 'none';
        }


        dropdownIcon.addEventListener('click', () => {
            dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
        });

        document.addEventListener('click', (event) => {
            // Check if the click is outside the dropdownWrapper
            if (!dropdownWrapper.contains(event.target)) {
                dropdownMenu.style.display = 'none';
            }
        });

        dropdownWrapper.appendChild(dropdownIcon);
        dropdownWrapper.appendChild(dropdownMenu);
        strategyCell.appendChild(dropdownWrapper);

        if(winnerCell.textContent != 'Player Not Found!'){
            
            row.appendChild(runnersCell);
            row.appendChild(marketTimeCell);
            row.appendChild(winnerCell);
            row.appendChild(probabilitycell);
            row.appendChild(oddsCell);
            row.appendChild(volumeCell);
            row.appendChild(amountCell);
            row.appendChild(strategyCell);

            volumeCell.textContent = Math.round(totalMatched * 100) / 100;

            // console.log("Volume Cell" ,volumeCell.textContent)
            volumeCell.style.width = '100px';
           
            tableBody.appendChild(row);

        }else{
            ID.push(matches11[index]["marketId"])

        }

    
        amountInput.addEventListener('input', (e) => {
            let changeamount = parseFloat(e.target.value) || 0;
            let totalAmount = 0;
            document.querySelectorAll('input[type="number"]').forEach(input => {
                totalAmount += parseFloat(input.value) || 0;
            });

            // console.log("totalamount", totalAmount)
            const profileAmount1 = sessionStorage.getItem('amount1');
            
            if (profileAmount1) {
                const profileAmount = JSON.parse(profileAmount1);

                if (totalAmount > profileAmount) {
                    InsufficientBalance('*InsuccientBalance Balance', true)
                    document.getElementById('Submit_button').disabled = true;
                    // document.querySelector('.input_amount').style.border = 'none';
                    document.querySelector('.input_amount').style.border = '2px solid red';
                    // e.target.value = changeamount - parseFloat(e.target.value) ; // Reset the value
                    // this.style.border = '2px solid red';

                    return;
                } else {
                    document.getElementById('Submit_button').disabled = false;
                    InsufficientBalance('*Insufficient Balance', false)
                    amountInput.style.border = '';
                    
                }
            }

            matches11[index]["gp_amount"] = changeamount
            CHANGES=[];
            // Type=[]
            
            let temp_data = {
                "amount": changeamount,
                "competition": matches11[index]["competition"],
                "marketId": matches11[index]["marketId"],
                "marketName": matches11[index]["marketName"],
                "marketStartTime" : matches11[index]["marketStartTime"],
                "runners": matches11[index]["runners"],
                "strategies": matchStrategy,
                "totalMatched": matches11[index]["totalMatched"],
                "winner": winnerCell.textContent,
                "probability": probabilitycell.textContent,
                "backOdds": parseFloat(backOdds),
                "layOdds": parseFloat(layOdds),
                "Type":Type,
            }


            const ind = all_data["data"]["market_catalogue"].findIndex(obj => obj.marketId === temp_data.marketId)

            if (ind !== -1) {
                all_data["data"]["market_catalogue"][ind] = temp_data;
            } else {
                // all_data["data"]["market_catalogue"].push(temp_data)
            }
           
        })


        function updateSelectAllCheckbox() {
            const checkboxes = tableBody.querySelectorAll('input[type="checkbox"]');
            const selectAllCheckbox = document.getElementById('select-all-checkbox');
            const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
            selectAllCheckbox.checked = allChecked;
        }
        

    
        checkbox.addEventListener('change', () => {// Inside the matches.forEach loop, update the checkbox event listener
            const matchIndex = parseInt(checkbox.value.split('_')[1]);
            const selectedMatch = matches[matchIndex];
            // const currentStrategy = matches11[matchIndex]["gp_strat"]; 
            let enteredAmount = parseInt(amountInput.value) || 0;
         


            let temp_data = {
                "amount": enteredAmount,
                "competition": matches11[matchIndex]["competition"],
                "marketId": matches11[matchIndex]["marketId"],
                "marketName": matches11[matchIndex]["marketName"],
                "marketStartTime" : matches11[index]["marketStartTime"],
                "runners": matches11[matchIndex]["runners"],
                "strategies": matchStrategy,
                "totalMatched": matches11[matchIndex]["totalMatched"],
                "winner": winnerCell.textContent,
                "probability": probabilitycell.textContent,
                "backOdds": parseFloat(backOdds),
                "layOdds": parseFloat(layOdds),
                "Type":Type,
            };

           

            
            const calculateProfits = (strategy, amount) => {
                const new_backO = (amount/2)*(backOdds-1);
                const new_layO = (amount/2)*(layOdds-1);
                const strr_1 = new_backO-new_layO;
                const strr_2 = (amount)*(backOdds-1);
                const lay_val3 = (layOdds)*(amount/2);
                const back_val3 = lay_val3/backOdds;
                const Awin = ((backOdds - 1) * back_val3) - ((layOdds - 1) * (amount / 2));
                const Bwin = (amount / 2) - back_val3;
                var strr_3_amountt = (amount/2) + back_val3 ;
           
                switch(strategy) {
                    case 'Strategy 1':
                        return strr_1.toFixed(2);
                    case 'Strategy 2':
                        return strr_2.toFixed(2);
                    case 'Strategy 3':
                        return `Player1 Wins: ${Awin.toFixed(2)}\n Player2 Wins: ${Bwin.toFixed(2)}`;
                    default:
                        return '-';
                }
            };


            const updateDisplay = () => {
                const tablebody = document.getElementById('table-body_selected');
                let existingRow = document.getElementById(`${temp_data.marketId}`);
        
                if (checkbox.checked) {
                    if (!existingRow) {
                        // Create new row
                        const newRow = document.createElement('tr');
                        newRow.id = `${temp_data.marketId}`;
                        newRow.className = 'match_row';
        
                        const cells = ['match_sel', 'amount_sel', 'strategy_sel', 'profit_sel'].map(className => {
                            const cell = document.createElement('td');
                            cell.className = className;
                            return cell;
                        });
        
                        cells[0].textContent = matches1[matchIndex];

                        if (strategyDisplayNames[temp_data.strategies] === 'Strategy 3') {
                            const lay_val3 = (layOdds) * (temp_data.amount / 2);
                            const back_val3 = lay_val3 / backOdds;
                            const strr_3_amountt = (temp_data.amount / 2) + back_val3;
                            cells[1].textContent = `$${strr_3_amountt.toFixed(2)}`;
                        } else {
                            cells[1].textContent = `$${temp_data.amount}`;
                        }



                        cells[2].textContent = strategyDisplayNames[temp_data.strategies];

                        
                        cells[3].textContent = calculateProfits(strategyDisplayNames[temp_data.strategies], temp_data.amount);
        
                        cells.forEach(cell => newRow.appendChild(cell));
                        tablebody.appendChild(newRow);
                    } else {
                        // Update existing row while preserving strategy
                        const cells = existingRow.getElementsByTagName('td');

                        if (strategyDisplayNames[temp_data.strategies] === 'Strategy 3') {
                            const lay_val3 = (layOdds) * (temp_data.amount / 2);
                            const back_val3 = lay_val3 / backOdds;
                            const strr_3_amountt = (temp_data.amount / 2) + back_val3;
                            cells[1].textContent = `$${strr_3_amountt.toFixed(2)}`;
                        } else {
                            cells[1].textContent = `$${temp_data.amount}`;
                        }


                        cells[2].textContent = strategyDisplayNames[temp_data.strategies];
                        const currentStrategy = cells[2].textContent; 
                        // Only update profit based on current amount and preserved strategy
                        cells[3].textContent = calculateProfits(currentStrategy, temp_data.amount);
                    }
                } else if (!checkbox.checked && existingRow) {
                    existingRow.remove();
                }
            };
          
            // Handle checkbox state
            if (checkbox.checked) {

                REDIRECT = true;
                CHANGES = []; 

              if( backOdds > layOdds){
                  Type = 'Back'

              }else{
                 Type = 'Lay'
              }

          
                CHANGES.push({
                    matches: runnersCell.textContent,
                    winner: winnerCell.textContent,
                    probability: probabilitycell.textContent,
                    backOdds: parseFloat(backOdds),
                    layOdds: parseFloat(layOdds),
                    volume: volumeCell.textContent,
                    amount: enteredAmount,
                    strategy: strategyCell.querySelector('span').textContent  ,
                    Type: Type,
                  
                });


               if(oddsCell.textContent == backOdds>layOdds){
                // console.log("hello")
               }

                // console.log("CHANGES for selected row:", CHANGES);
                const ind = all_data["data"]["market_catalogue"].findIndex(obj => obj.marketId === temp_data.marketId);
                
                if (ind !== -1) {
                    all_data["data"]["market_catalogue"][ind] = temp_data;
                } else {
                 
                    
                    if(volumeCell.textContent < 1000) {
                        alert("Volume Low : There might be chances of unmatched bets and you might loose your money");
                    }
                    all_data["data"]["market_catalogue"].push(temp_data);
                    // console.log("values", temp_data.strategies )
                    // console.log("valuesMatch" , temp_data.amount)
                }
            } else {
                const ind = all_data["data"]["market_catalogue"].findIndex(obj => obj.marketId === temp_data.marketId);
                if (ind !== -1) {
                    all_data["data"]["market_catalogue"].splice(ind, 1);
                }

            }

            updateDisplay();

            // Update amount input listener

            amountInput.addEventListener('input', (e) => {
                enteredAmount = parseInt(e.target.value) || 0;
                
                if (strategyDisplayNames[temp_data.strategies] === 'Strategy 3') {
                    const lay_val3 = (layOdds) * (enteredAmount / 2);
                    const back_val3 = lay_val3 / backOdds;
                    temp_data.amount = (enteredAmount / 2) + back_val3;
                } else {
                    temp_data.amount = enteredAmount;
                }
                
                const ind = all_data["data"]["market_catalogue"].findIndex(obj => obj.marketId === temp_data.marketId);
                if (ind !== -1) {
                    all_data["data"]["market_catalogue"][ind].amount = temp_data.amount;
                }
                
                updateDisplay();
            });

            // amountInput.addEventListener('input', (e) => {
                
            //     enteredAmount = parseInt(e.target.value) || 0;
            //     temp_data.amount = enteredAmount;
                
                
            //     const ind = all_data["data"]["market_catalogue"].findIndex(obj => obj.marketId === temp_data.marketId);
            //     if (ind !== -1) {
            //         all_data["data"]["market_catalogue"][ind].amount = enteredAmount;
            //         // console.log("Amount", enteredAmount)

            //     }
                
            //     updateDisplay();
            // });

            updateSelectAllCheckbox();
            
        
        });

      
        selectAllCheckbox.addEventListener('change', function () {
            const amountInputs = document.querySelectorAll('input[type="number"]');
            const checkboxes = tableBody.querySelectorAll('input[type="checkbox"]');
            const enteredAmount = parseInt(amountInput.value) || 0;
            const tablebody = document.getElementById('table-body_selected');
           
 
            idx = 0
            if (selectAllCheckbox.checked) {
               
 
 
                REDIRECT = true;
                checkboxes.forEach((checkbox, index) => {
                    checkbox.checked = true;
                    REDIRECT = true;
                   
                    CHANGES = [];
                   
                    Type='';
 
                    if( backOdds > layOdds){
                        Type = 'Back'
                      //  console.log(" Content " , Type)
                    }else{
                       Type = 'Lay'
                    }
     
 
                    CHANGES.push({
                        matches: runnersCell.textContent,
                        winner: winnerCell.textContent,
                        probability: probabilitycell.textContent,
                        backOdds: parseFloat(backOdds),
                        layOdds: parseFloat(layOdds),
                        volume: volumeCell.textContent,
                        amount: enteredAmount,
                        strategy: strategyCell.querySelector('span').textContent,
                        Type:Type,
                    });
 
                    index = ID_2[idx]
                   
                   
                    let temp_data = {
                        "amount": matches11[index]["gp_amount"],
                        "competition": matches11[index]["competition"],
                        "marketId": matches11[index]["marketId"],
                        "marketName": matches11[index]["marketName"],
                        "marketStartTime" : matches11[index]["marketStartTime"],
                        "runners": matches11[index]["runners"],
                        "strategies": matches11[index]["gp_strat"],
                        "totalMatched": matches11[index]["totalMatched"],
                        "winner": winnerCell.textContent,
                        "probability": probabilitycell.textContent,
                        "backOdds": parseFloat(backOdds),
                        "layOdds": parseFloat(layOdds),
                        "Type":Type,
                    };

                    if (strategyDisplayNames[temp_data.strategies] === 'Strategy 3') {
                        const lay_val3 = (layOdds) * (temp_data.amount / 2);
                        const back_val3 = lay_val3 / backOdds;
                        temp_data.amount = (temp_data.amount / 2) + back_val3;
                    }
               
                    // console.log("temp_data_(----------)", temp_data);
                 
                   
                    cc+=1
             
                    idx=idx+1
 
                    const calculateProfits = (strategy, amount) => {
                        const new_backO = (amount / 2) * (backOdds - 1);
                        const new_layO = (amount / 2) * (layOdds - 1);
                        const strr_1 = new_backO - new_layO;
                        const strr_2 = amount * (backOdds - 1);
                        const lay_val3 = layOdds * (amount / 2);
                        const back_val3 = lay_val3 / backOdds;
                        const Awin = ((backOdds - 1) * back_val3) - ((layOdds - 1) * (amount / 2));
                        const Bwin = (amount / 2) - back_val3;
                   
                        switch (strategy) {
                            case 'Strategy 1':
                                return strr_1.toFixed(2);
                            case 'Strategy 2':
                                return strr_2.toFixed(2);
                            case 'Strategy 3':
                                return `Player1 Wins: ${Awin.toFixed(2)}\n Player2 Wins: ${Bwin.toFixed(2)}`;
                            default:
                                return '-';
                        }
                    };
                   
 
                    var amounttt = temp_data.amount
                    var Awin =""
                    var Bwin = ""
                    let new_backO = (amounttt/2)*(backOdds-1)
                    let new_layO = (amounttt/2)*(layOdds-1)
 
                    var strr_1 = new_backO-new_layO
                    // console.log("strr_1", strr_1);
                   
                    var strr_2 = (amounttt)*(backOdds-1)
                    // console.log("strr_2", strr_2);
                   
                    var lay_val3 = (layOdds)*(amounttt/2)
                    var back_val3 = lay_val3/backOdds;
                    // var strr_3_amountt = (amounttt/2) + back_val3 ;
 
 
 
                    // console.log("===================",strr_3_amountt)
 
   
                    Awin = ((backOdds - 1) * back_val3) - ((layOdds - 1) * (amounttt / 2));
                    Bwin = (amounttt / 2) - back_val3;
   
                    // Update all_data if checkbox is checked
                    const ind = all_data["data"]["market_catalogue"].findIndex(obj => obj.marketId === temp_data.marketId);
                    if (ind === -1) {
                        all_data["data"]["market_catalogue"].push(temp_data);
                     
                        const newRow = document.createElement('tr');
                        newRow.id = `${temp_data.marketId}`;
                        newRow.className = 'match_row';
           
                        // Create and populate cells
                        const selMatchCell = document.createElement('td');
                        const selAmountCell = document.createElement('td');
                        const selStrategyCell = document.createElement('td');
                        const selProfitCell = document.createElement('td');
           
                        selMatchCell.textContent = matches1[index];
 
                       
                        selAmountCell.textContent = `$${temp_data.amount}`;
 
 
                        // if (strategyDisplayNames[temp_data.strategies] === 'Strategy 3') {
                        //     selAmountCell.textContent = `$${strr_3_amountt.toFixed(2)}`;
                        //     // console.log("stratttttt===========", strr_3_amountt )
                        // } else {
                        //     selAmountCell.textContent = `$${temp_data.amount}`;
                        // }
 
 
 
                        selStrategyCell.textContent = strategyDisplayNames[temp_data.strategies];
                        // selProfitCell.textContent = '-';
                        if( selStrategyCell.textContent == 'Strategy 1'){
                            selProfitCell.textContent = strr_1.toFixed(2);
                        }else if(selStrategyCell.textContent == 'Strategy 2'){
                            selProfitCell.textContent = strr_2.toFixed(2);
                        }else if (selStrategyCell.textContent == 'Strategy 3'){
                            selProfitCell.textContent =  `Player1 : ${Awin.toFixed(2)}\n Player2 : ${Bwin.toFixed(2)}` ;
                        }
           
                        // Set cell classes
                        selMatchCell.className = 'match_sel';
                        selAmountCell.className = 'amount_sel';
                        selStrategyCell.className = 'strategy_sel';
                        selProfitCell.className = 'profit_sel';
           
                        // Append cells to row
                        newRow.appendChild(selMatchCell);
                        newRow.appendChild(selAmountCell);
                        newRow.appendChild(selStrategyCell);
                        newRow.appendChild(selProfitCell);
                       
                        // Add row to table
                        tablebody.appendChild(newRow);

                       
                 
                        const currentAmountInput = amountInputs[index];
                        if (currentAmountInput) {
                            currentAmountInput.addEventListener('input', () => {
                                const newAmount = parseInt(currentAmountInput.value) || 0;

                                if (selStrategyCell.textContent === 'Strategy 3') {
                                    const lay_val3 = layOdds * (newAmount / 2);
                                    const back_val3 = lay_val3 / backOdds;
                                    temp_data.amount = (newAmount / 2) + back_val3;
                                } else {
                                    temp_data.amount = newAmount;
                                }
                                // temp_data.amount = newAmount;
                       
                                // Update selAmountCell for Strategy 3
                                if (selStrategyCell.textContent === 'Strategy 3') {
                                    const lay_val3 = layOdds * (newAmount / 2);
                                    const back_val3 = lay_val3 / backOdds;
                                    const strr_3_amountt = (newAmount / 2) + back_val3;
                                    selAmountCell.textContent = `$${strr_3_amountt.toFixed(2)}`;
                                } else {
                                    selAmountCell.textContent = `$${newAmount}`;
                                }
                       
                                // Update profit display
                                selProfitCell.textContent = calculateProfits(selStrategyCell.textContent, newAmount);
                       
                                // Update data in all_data
                                const dataIndex = all_data["data"]["market_catalogue"].findIndex(obj => obj.marketId === temp_data.marketId);
                                if (dataIndex !== -1) {
                                    all_data["data"]["market_catalogue"][dataIndex].amount = newAmount;
                                }
                            });
                        }
                       
                    }
                });
            } else {
 
                checkboxes.forEach((checkbox, index) => {
 
                    const SelectButton = document.getElementById('select-all-checkbox')
                    checkbox.checked = false;
 
                    CHANGES = [];
                    Type=''
 
                    CHANGES.push({
                        matches: runnersCell.textContent,
                        winner: winnerCell.textContent,
                        probability: probabilitycell.textContent,
                        backOdds: parseFloat(backOdds),
                        layOdds: parseFloat(layOdds),
                        volume: volumeCell.textContent,
                        amount: enteredAmount,
                        strategy: strategyCell.querySelector('span').textContent,
                        Type : Type,
                    });
                   
                    let temp_data = {
                        "amount": enteredAmount,
                        "competition": matches11[index]["competition"],
                        "marketId": matches11[index]["marketId"],
                        "marketName": matches11[index]["marketName"],
                        "marketStartTime" : matches11[index]["marketStartTime"],
                        "runners": matches11[index]["runners"],
                        "strategies": matchStrategy,
                        "totalMatched": matches11[index]["totalMatched"],
                        "winner": winnerCell.textContent,
                        "probability": probabilitycell.textContent,
                        "backOdds": parseFloat(backOdds),
                        "layOdds": parseFloat(layOdds),
                        "Type":Type,
                    };
 
 
                    // console.log("temp_data_select", temp_data);
                   
                    // Remove all match details from the display
 
                    const allRows = tablebody.querySelectorAll('.match_row');
                    allRows.forEach(row => row.remove());
 
                });
 
                submit_disable.style.disabled= true;
 
                // Reset all_data to an empty state if selectAllCheckbox is unchecked
                all_data["data"]["market_catalogue"] = [];
            }
        });
        tableBody.addEventListener('change', function(event) {
            if (event.target.type === 'checkbox') {
                updateSelectAllCheckbox();
            }
        });
       
    });

    
});


function InsufficientBalance(message, show) {
    const amountErrorElement = document.getElementById('amounterror');
    if (amountErrorElement) {
        if (show) {
            amountErrorElement.textContent = message;
            amountErrorElement.style.color = 'red';
            amountErrorElement.style.fontSize = '12px';
            amountErrorElement.style.marginLeft = '88%';
            amountErrorElement.style.marginTop = '1%';
            amountErrorElement.style.display = 'block';

        } else {
            amountErrorElement.textContent = '';  // Clear the message
            amountErrorElement.style.display = 'none';  // Hide the error message
        }


    } else {
        console.error("Amount error element not found");
    }
}


function submitBtn() {
    // console.log("ALL DATA", all_data);
 
    if (REDIRECT) {
        showloader();
        loader_overlay.style.display = 'block';
        console.log("Mapped market_catalogue:", gselectedMatches);
 
        // Create both API calls
        const firstApiCall = fetch('http://127.0.0.1:5000/fetch_market_status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(all_data),
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        });
 
        // const secondApiCall = fetch('http://127.0.0.1:5000/filtered_market', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(all_data),
        // }).then(response => {
        //     if (!response.ok) {
        //         throw new Error('Network response was not ok ' + response.statusText);
        //     }
        //     return response.json();
        // });
 
        // Handle the first API call and redirect
        firstApiCall
            .then(data => {
                hideLoader();
                loader_overlay.style.display = 'none';
                // sessionStorage.setItem('MarketsStatus', JSON.stringify(data));
                Swal.fire({
                    text: "Bets placed successfully",
                    icon: "success",
                    confirmButtonText: "OK"
                }).then(() => {
                    window.location.href = "../market/marketui.html?reload=true";
                    // window.location.reload();
                   
                });
            })
            .catch(error => {
                hideLoader();
                loader_overlay.style.display = 'none';
                console.error('Error:', error);
 
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong. Please try again later.',
                });
            });
 
        // Continue with second API call
        secondApiCall
            .then(filteredData => {
                console.log("Filtered market data:", filteredData);
            })
            .catch(error => {
                console.error('Error in second API call:', error);
            });
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
