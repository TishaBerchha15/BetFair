document.addEventListener('DOMContentLoaded', function() {
    // Sample data for pie charts (replace with your actual data)
    const pieData1 = {
        labels: ['Strategy 1', 'Strategy 2', 'Strategy 3'],
        datasets: [{
            data: [0, 0, 0],  // Initially set data to 0 (will be updated dynamically)
            backgroundColor: [
                'rgba(26, 87, 79, 0.8)', 
                'rgba(16, 129, 107, 0.8)', 
                'rgba(58, 122, 112, 0.8)'
            ]
        }]
    };

    const pieData2 = {
        labels: ['Matched Bets', 'Unmatched Bets'],
        datasets: [{
            data: [0, 0],  // Initially set data to 0 (will be updated dynamically)
            backgroundColor: [
                'rgba(26, 87, 79, 0.8)', 
                'rgba(16, 129, 107, 0.8)'
            ]
        }]
    };

    const chartConfig = {
        type: 'pie',
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Overall Profit/Loss'
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    };

    let chart1 = null;  // For Strategy Pie chart
    let chart2 = null;  // For Bet Matched/Unmatched Pie chart

    // Create first pie chart (Strategy P/L)
    const ctx1 = document.createElement('canvas');
    document.querySelector('.pie1').appendChild(ctx1);
    chart1 = new Chart(ctx1, {
        ...chartConfig,
        data: pieData1
    });

    // Create second pie chart (Bet Matched/Unmatched)
    const ctx2 = document.createElement('canvas');
    document.querySelector('.pie2').appendChild(ctx2);
    chart2 = new Chart(ctx2, {
        ...chartConfig,
        data: pieData2,
        options: {
            ...chartConfig.options,
            plugins: {
                ...chartConfig.options.plugins,
                title: {
                    display: true,
                    text: 'Bet Matching Status'
                }
            }
        }
    });

    // Variables to store metrics
    const metricBoxes = {
        overall_PL: document.getElementById('over_PL'),
        total_bet: document.getElementById('TB'),
        bet_matched: document.getElementById('BM'),
        bet_unmatched: document.getElementById('UM'),
        strat1_PL: document.getElementById('PL1'),
        strat2_PL: document.getElementById('PL2'),
        strat3_PL: document.getElementById('PL3'),
        Indicator: document.getElementById('Indicator'),
        Indicator0: document.getElementById('Indicator0'),
        Indicator4: document.getElementById('Indicator4'),
        Indicator5: document.getElementById('Indicator5'),
        Indicator1: document.getElementById('Indicator1'),
        Indicator2: document.getElementById('Indicator2'),
        Indicator3: document.getElementById('Indicator3')
    };

    // Fetch data from API

    async function fetchData() {
        const sessionToken = localStorage.getItem('sessionToken');
        try {
            const response = await fetch(`http://localhost:6060/api/gethistory`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionToken}`
                }
            })
            const data = await response.json();
            if (!data || !Array.isArray(data)) {
                console.error('Data is not in the expected format');
                return [];
            }
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    }

    // Filter data based on selected sport and date range
    function filterData(data) {
        const sportSelect = document.querySelector('.allSports');
        const dateInputs = document.querySelectorAll('.filters input[type="date"]');
        const selectedSport = sportSelect.value;
        const startDate = dateInputs[0].value ? new Date(dateInputs[0].value) : null;
        const endDate = dateInputs[1].value ? new Date(dateInputs[1].value) : null;

        return data.filter(item => {
            const itemDate = new Date(item.date);
            const sportMatch = selectedSport === 'All Sports' || item.sport === selectedSport;
            const dateMatch = (!startDate || itemDate >= startDate) && 
                              (!endDate || itemDate <= endDate);

            return sportMatch && dateMatch;
        });
    }

    // Update metrics and charts
    function updateMetrics(filteredData) {
        let totalBet = 0;
        let totalPL = 0;
        let positivePL = 0;
        let negativePL = 0;
        let betMatched = 0;
        let betUnmatched = 0;
        let strat1PL = 0;
        let strat2PL = 0;
        let strat3PL = 0;

        // Loop through filtered data to calculate metrics
        filteredData.forEach(item => {
            totalBet++;
            const profitLoss = Number(item["Profit/Loss"]) || 0;
            if (profitLoss > 0) {
                positivePL += profitLoss;
            } else {
                negativePL += Math.abs(profitLoss);
            }
            totalPL = positivePL - negativePL;

            if (item.Status === 'Matched' || item.Status === 'MATCHED') {
                betMatched++;
            } else if (item.Status === 'UnMatched') {
                betUnmatched++;
            }

            if (item.strategy === 'Strategy 1') {
                strat1PL += profitLoss;
            } else if (item.strategy === 'Strategy_2') {
                strat2PL += profitLoss;
            } else if (item.strategy === 'Strategy 3') {
                strat3PL += profitLoss;
            }
        });

        // Update metric boxes
        if (metricBoxes.overall_PL) {
            metricBoxes.overall_PL.textContent = `$${totalPL.toFixed(2)}`;
            metricBoxes.Indicator.textContent = totalPL >= 0 ? '▲' : '▼';
        }
        if (metricBoxes.total_bet) {
            metricBoxes.total_bet.textContent = `${totalBet}`;
            metricBoxes.Indicator0.textContent = '';
        }
        if (metricBoxes.bet_matched) {
            metricBoxes.bet_matched.textContent = `${betMatched}`;
            metricBoxes.Indicator4.textContent = '';
        }
        if (metricBoxes.bet_unmatched) {
            metricBoxes.bet_unmatched.textContent = `${betUnmatched}`;
            metricBoxes.Indicator5.textContent = '';
        }
        if (metricBoxes.strat1_PL) {
            metricBoxes.strat1_PL.textContent = `$${strat1PL.toFixed(2)}`;
            metricBoxes.Indicator1.textContent = strat1PL >= 0 ? '▲' : '▼';
        }
        if (metricBoxes.strat2_PL) {
            metricBoxes.strat2_PL.textContent = `$${strat2PL.toFixed(2)}`;
            metricBoxes.Indicator2.textContent = strat2PL >= 0 ? '▲' : '▼';
        }
        if (metricBoxes.strat3_PL) {
            metricBoxes.strat3_PL.textContent = `$${strat3PL.toFixed(2)}`;
            metricBoxes.Indicator3.textContent = strat3PL >= 0 ? '▲' : '▼';
        }

        // Update the charts with the new data
        updateCharts(betMatched, betUnmatched, strat1PL, strat2PL, strat3PL);
    }

    // Update charts with new data dynamically
    function updateCharts(betMatched, betUnmatched, strat1PL, strat2PL, strat3PL) {
        if (chart1) {
            chart1.data.datasets[0].data = [strat1PL, strat2PL, strat3PL];
            chart1.update();
        }

        if (chart2) {
            chart2.data.datasets[0].data = [betMatched, betUnmatched];
            chart2.update();
        }
    }

    // Event listeners for sport selection and date inputs
    const sportSelect = document.querySelector('.allSports');
    const dateInputs = document.querySelectorAll('.filters input[type="date"]');

    sportSelect.addEventListener('change', async () => {
        const data = await fetchData();
        const filteredData = filterData(data);
        updateMetrics(filteredData);
    });

    dateInputs.forEach(input => {
        input.addEventListener('change', async () => {
            const data = await fetchData();
            const filteredData = filterData(data);
            updateMetrics(filteredData);
        });
    });

    // Initial data fetch and render
    fetchData().then(data => {
        const filteredData = filterData(data);
        updateMetrics(filteredData);
    });  

    const sportSelect2 = document.getElementById("tournamentButton");
    const apiUrlTournaments = '';
    
    // //dropdown function
    sportSelect2.addEventListener('click',()=>{
        sportSelect2.style.display="block";
        console.log("HII");
        
    })


    // Fetch tournament data and populate the select dropdown
    async function fetchTournaments() {
        const sessionToken = localStorage.getItem('sessionToken');
        try {
            const response = await fetch(`http://localhost:6060/api/gethistory`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionToken}`
                }
            })
            const data = await response.json();
            if (!data || !Array.isArray(data)) {
                console.error('Data is not in the expected format');
                return [];
            }
            return data;

        } catch (error) {
            console.error('Error fetching tournament data:', error);
        }
    }

    // Fetch the tournaments when the page loads
    fetchTournaments();

    // Event listener for sport selection
    sportSelect2.addEventListener('change', async () => {
        const data = await fetchData();
        const filteredData = filterData(data);
        updateMetrics(filteredData);
    });

    // Initial data fetch and render

    fetchData().then(data => {
        const filteredData = filterData(data);
        updateMetrics(filteredData);
    });

});
