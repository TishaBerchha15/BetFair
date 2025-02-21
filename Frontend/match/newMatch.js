document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.getElementById('table-body');
    const selectedTableBody = document.getElementById('table-body_selected');
    const selectAllCheckbox = document.getElementById('select-all-checkbox');
    let all_data = { "data": { "market_catalogue": [] } };

    async function fetchMatchData() {
        try {
            const matchesData = sessionStorage.getItem('Match Data');
            const probabilityData = sessionStorage.getItem('Probability Data');
            let matches = matchesData ? JSON.parse(matchesData) : [];
            let probabilities = probabilityData ? JSON.parse(probabilityData) : [];
            if (!Array.isArray(matches) || !Array.isArray(probabilities)) return;

            matches.forEach((match, index) => {
                const row = document.createElement('tr');

                // Checkbox Column
                const selectCell = document.createElement('td');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = `match_${index}`;
                selectCell.appendChild(checkbox);
                row.appendChild(selectCell);

                // Match Details Columns
                const runnersCell = document.createElement('td');
                runnersCell.textContent = match.runners.map(runner => runner.runnerName).join(' vs ');
                row.appendChild(runnersCell);

                // Market Time
                const marketTimeCell = document.createElement('td');
                marketTimeCell.textContent = match.marketStartTime || '-';
                row.appendChild(marketTimeCell);

                // API Data Columns (Probability, Odds, Volume)
                const probabilityCell = document.createElement('td');
                const oddsCell = document.createElement('td');
                const volumeCell = document.createElement('td');
                const winningPlayerCell = document.createElement('td');
                
                let probability = probabilities[index]?.player_win_prob || '-';
                probabilityCell.textContent = probability;
                oddsCell.textContent = probabilities[index] ? `Back: ${probabilities[index].player_back_odds} Lay: ${probabilities[index].player_lay_odds}` : '-';
                winningPlayerCell.textContent = probabilities[index]?.player_name || 'No Player';
                volumeCell.textContent = match.totalMatched || '-';
                row.appendChild(winningPlayerCell);
                row.appendChild(probabilityCell);
                row.appendChild(oddsCell);
                row.appendChild(volumeCell);

                // Amount Input Column (Default 0)
                const amountCell = document.createElement('td');
                const amountInput = document.createElement('input');
                amountInput.type = 'number';
                amountInput.placeholder = '0 ($)';
                amountInput.value = 0;
                amountInput.style.width = '60px';
                amountCell.appendChild(amountInput);
                row.appendChild(amountCell);

                // Strategy Dropdown Column
                const strategyCell = document.createElement('td');
                const strategySelect = document.createElement('select');
                const strategies = ['Strategy 1', 'Strategy 2', 'Strategy 3'];
                strategies.forEach(strategy => {
                    const option = document.createElement('option');
                    option.value = strategy;
                    option.textContent = strategy;
                    if (probability === '-') {
                        option.disabled = strategy !== 'Strategy 3';
                    }
                    strategySelect.appendChild(option);
                });
                strategyCell.appendChild(strategySelect);
                row.appendChild(strategyCell);

                // Strategy Info Icon
                const infoIcon = document.createElement('i');
                infoIcon.classList.add('fa-solid', 'fa-circle-info');
                infoIcon.style.marginLeft = '10px';
                infoIcon.style.cursor = 'pointer';
                strategyCell.appendChild(infoIcon);

                function updateSelectedTable() {
                    let temp_data = {
                        match: runnersCell.textContent,
                        probability: probability,
                        odds: oddsCell.textContent,
                        amount: amountInput.value,
                        strategy: strategySelect.value
                    };
                    console.log("Selected Match Data:", temp_data);

                    if (checkbox.checked) {
                        let existingRow = document.getElementById(`selected_${index}`);
                        if (!existingRow) {
                            existingRow = document.createElement('tr');
                            existingRow.id = `selected_${index}`;
                            selectedTableBody.appendChild(existingRow);
                        }
                        existingRow.innerHTML = `
                            <td>${runnersCell.textContent}</td>
                            <td>${amountInput.value}</td>
                            <td>${strategySelect.value}</td>
                        `;
                        
                        const ind = all_data["data"]["market_catalogue"].findIndex(obj => obj.match === temp_data.match);
                        if (ind !== -1) {
                            all_data["data"]["market_catalogue"][ind] = temp_data;
                        } else {
                            all_data["data"]["market_catalogue"].push(temp_data);
                        }
                    } else {
                        document.getElementById(`selected_${index}`)?.remove();
                    }
                }

                amountInput.addEventListener('input', updateSelectedTable);
                strategySelect.addEventListener('change', updateSelectedTable);
                checkbox.addEventListener('change', updateSelectedTable);
                
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error fetching match data:', error);
        }
    }

    fetchMatchData();
});
