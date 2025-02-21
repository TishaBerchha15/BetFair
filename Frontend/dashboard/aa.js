


// document.addEventListener('DOMContentLoaded', function() {
//     let chart1 = null;  
//     let chart2 = null;
 
//     // Define a comprehensive color palette
//     const colorPalette = {
//         // Primary colors for profit/loss
//         profit: 'rgba(26, 87, 79, 0.8)',      // Green
//         loss: 'rgba(214, 48, 49, 0.8)',       // Red
       
//         // Sport-specific colors (for consistent coloring per sport)
//         sports: {
//             'Volleyball': 'rgb(42,102,102)',    
//             'Tennis': 'rgb(54, 105, 105)',      
//             'Basketball': 'rgb(64, 116, 116)',
//             'Snooker': 'rgb(78, 141, 141)',        
//             'American Football': 'rgb(72, 150, 150)',    
//             'Australlian Rules': 'rgb(55, 121, 121)',  
//             'Martial Arts': 'rgb(89, 175, 175)',  
//             // Add more sports as needed
//         },
       
//         // Strategy colors
//         strategies: [
//             'rgb(53,146,129)',   // Strategy 1
//             'rgba(58, 122, 112, 0.8)',  // Strategy 2
//             'rgb(61,113,106)'   // Strategy 3
//         ],
       
//         // Fallback colors for any additional categories
//         fallback: [
//             'rgb(42,102,102)',  // Blue
//             'rgb(54, 105, 105)',  // Purple
//             'rgb(64,116,116)',  // Orange
//             'rgb(78, 141, 141)',   // Green
//             'rgb(72, 150, 150)',   // Red
//             'rgb(55, 121, 121)' , // Gray
//             'rgb(89, 175, 175)'
//         ]
//     };
 
//     // Helper function to get color for a sport
//     function getSportColor(sport) {
//         return colorPalette.sports[sport] ||
//             colorPalette.fallback[Math.abs(sport.hashCode()) % colorPalette.fallback.length];
//     }
 
//     // Add a simple hash function for string to number conversion
//     String.prototype.hashCode = function() {
//         let hash = 0;
//         for (let i = 0; i < this.length; i++) {
//             const char = this.charCodeAt(i);
//             hash = ((hash << 5) - hash) + char;
//             hash = hash & hash; // Convert to 32bit integer
//         }
//         return hash;
//     };
 
//     // Initialize charts
//     function initializeCharts() {
//         const ctx1 = document.createElement('canvas');
//         document.querySelector('.pie1').appendChild(ctx1);
       
//         // Initialize first chart
//         chart1 = new Chart(ctx1, {
//             type: 'pie',
//             data: {
//                 labels: [],
//                 datasets: [{
//                     data: [],
//                     backgroundColor: [],
//                     rawValues: []
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 plugins: {
//                     legend: {
//                         position: 'right',
//                         labels: {
//                             boxWidth: 15,
//                             usePointStyle: false, // Circular legend indicators
//                             font: {
//                                 size: 10
//                             },
//                             color:'black'
//                         }
//                     },
//                     title: {
//                         display: false // Hide title at top
//                     },
//                     datalabels: {
//                         display: false,
//                     }
//                 }
//             },
//             plugins: [ChartDataLabels]
//         });
   
//         const ctx2 = document.createElement('canvas');
//         document.querySelector('.pie2').appendChild(ctx2);
       
//         // Initialize second chart for strategies
//         chart2 = new Chart(ctx2, {
//             type: 'pie',
//             data: {
//                 labels: [],
//                 datasets: [{
//                     data: [],
//                     backgroundColor: [],
//                     rawValues: []
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 plugins: {
//                     title: {
//                         display: false // Hide title at top
//                     },
//                     legend: {
//                         position: 'right',
//                         labels: {
//                             boxWidth: 15,
//                             usePointStyle: false, // Circular legend indicators
//                             font: {
//                                 size: 10
//                             },
//                             color:'black',
//                         }
//                     },
//                     datalabels: {
//                         display: false,
//                         color: 'white',
//                         font: {
//                             weight: 'bold'
//                         },
                     
//                     },
//                     tooltip: {
//                         callbacks: {
//                             label: function(context) {
//                                 const strategy = context.label.split(' (')[0];
//                                 const value = context.chart.data.datasets[0].rawValues[context.dataIndex];
//                                 const percentage = ((Math.abs(value) /
//                                                    context.chart.data.datasets[0].rawValues.reduce((a, b) => Math.abs(a) + Math.abs(b), 0)) * 100).toFixed(1);
//                                 return [
//                                     `${strategy}`,
//                                     `Amount: $${value.toFixed(2)}`,
//                                     `Percentage: ${percentage}%`,
//                                     `Status: ${value >= 0 ? 'Profit' : 'Loss'}`
//                                 ];
//                             }
//                         }
//                     }
//                 }
//             },
//             plugins: [ChartDataLabels]  // Add plugin here
//         });
       
//         // Add titles below charts
//         const title1 = document.createElement('p');
//         title1.textContent = 'Sports Profit/Loss Distribution';
//         title1.className = 'chart-title';
//         document.querySelector('.pie1').appendChild(title1);
       
//         const title2 = document.createElement('p');
//         title2.textContent = 'Strategy Profit/Loss Distribution';
//         title2.className = 'chart-title';
//         document.querySelector('.pie2').appendChild(title2);
//     }
   
 
//     // Reference to metric boxes
//     const metricBoxes = {
//         overall_PL: document.getElementById('over_PL'),
//         total_bet: document.getElementById('TB'),
//         bet_matched: document.getElementById('BM'),
//         bet_unmatched: document.getElementById('UM'),
//         strat1_PL: document.getElementById('PL1'),
//         strat2_PL: document.getElementById('PL2'),
//         strat3_PL: document.getElementById('PL3'),
//         Indicator: document.getElementById('Indicator'),
//         Indicator0: document.getElementById('Indicator0'),
//         Indicator4: document.getElementById('Indicator4'),
//         Indicator5: document.getElementById('Indicator5'),
//         Indicator1: document.getElementById('Indicator1'),
//         Indicator2: document.getElementById('Indicator2'),
//         Indicator3: document.getElementById('Indicator3')
//     };
 
//     // Fetch data from API
//     async function fetchData() {
//         const sessionToken = localStorage.getItem('sessionToken');
//         console.log('Session Token:', sessionToken ? 'Present' : 'Missing');
       
//         try {
//             const response = await fetch('http://localhost:6060/api/gethistory', {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${sessionToken}`
//                 }
//             });
       
//             if (!response.ok) {
//                 console.error('API Error:', response.status, response.statusText);
//                 const errorText = await response.text();
//                 console.error('Error details:', errorText);
//                 throw new Error(`API response not OK: ${response.status}`);
//             }
       
//             const data = await response.json();
//             console.log('API Response Data:', data);
           
//             if (!Array.isArray(data) || data.length === 0) {
//                 console.warn('API returned empty or invalid data');
//             }
           
//             return Array.isArray(data) ? data : [];
//         } catch (error) {
//             console.error('Detailed fetch error:', error);
//             return [];
//         }
//     }
 
//     // Get sport for an item - improved to handle different formats
//     function getSport(item) {
//         if (item.Sport) return item.Sport;
//         if (item.Match && typeof item.Match === 'string') {
//             const parts = item.Match.split('/');
//             return parts.length > 0 ? parts[0].trim() : 'Unknown';
//         }
//         return 'Unknown';
//     }
   
//     // Enhanced filterData function to properly handle sport selection

//     function filterData(data) {
//         const sportSelect = document.querySelector('.allSports');
//         const dateInputs = document.querySelectorAll('.filters input[type="date"]');
//         const selectedSport = sportSelect ? sportSelect.value : 'All Sports';
        
//         let startDate = dateInputs[0] && dateInputs[0].value ? new Date(dateInputs[0].value) : null;
//         let endDate = dateInputs[1] && dateInputs[1].value ? new Date(dateInputs[1].value) : null;
        
//         // Automatically set endDate to 7 days after startDate if startDate is selected
//         if (startDate) {
//             const newEndDate = new Date(startDate);
//             newEndDate.setDate(newEndDate.getDate() + 7);
//             dateInputs[1].value = newEndDate.toISOString().split('T')[0]; // Set input value
//             endDate = newEndDate; // Update the endDate variable
//         }
    
//         return data.filter(item => {
//             const itemSport = getSport(item);
//             const itemDate = new Date(item.date || item.created_at);
            
//             const sportMatch = selectedSport === 'All Sports' ||
//                               itemSport.toLowerCase() === selectedSport.toLowerCase() ||
//                               (selectedSport !== 'All Sports' && itemSport.toLowerCase().includes(selectedSport.toLowerCase()));
            
//             const dateMatch = (!startDate || itemDate >= startDate) &&
//                               (!endDate || itemDate <= endDate);
    
//             return sportMatch && dateMatch;
//         });
//     }
    
 
//     // Check if bet is matched
//     function checkBetMatched(item) {
//         if (item.Status) {
//             const status = item.Status.toUpperCase();
//             return status !== 'UNMATCHED';
//         }
//         if (item.state) {
//             const state = item.state.toUpperCase();
//             return ['MATCHED', 'EXECUTED', 'SETTLED'].includes(state);
//         }
//         // For legacy data with only Result field
//         return item.Result === 'win' || item.Result === 'lose';
//     }
   
//     // Update metrics with new data
//     function updateMetrics(filteredData) {
//         if (filteredData.length === 0) {
//             resetMetrics();
//             return;
//         }
 
//         let metrics = {
//             totalBet: 0,
//             totalPL: 0,
//             betMatched: 0,
//             betUnmatched: 0,
//             strat1PL: 0,
//             strat2PL: 0,
//             strat3PL: 0
//         };
 
//         // Create sports-based profit/loss tracking
//         let sportsPL = {};
 
//         filteredData.forEach(item => {
//             metrics.totalBet++;
           
//             // Calculate Profit/Loss
//             const profitLoss = Number(item.ProfitLoss) || 0;
//             metrics.totalPL += profitLoss;
 
//             // Update bet matching status
//             if (checkBetMatched(item)) {
//                 metrics.betMatched++;
//             } else {
//                 metrics.betUnmatched++;
//             }
 
//             // Track profit/loss by sport
//             const sport = getSport(item);
//             if (!sportsPL[sport]) {
//                 sportsPL[sport] = 0;
//             }
//             sportsPL[sport] += profitLoss;
 
//             // For backward compatibility, keep strategy metrics
//             const strategyMetrics = calculateStrategyMetrics(item, profitLoss);
//             metrics.strat1PL += strategyMetrics.strat1PL;
//             metrics.strat2PL += strategyMetrics.strat2PL;
//             metrics.strat3PL += strategyMetrics.strat3PL;
//         });
 
//         // Update UI with new metrics
//         updateMetricBoxes(metrics);
//         updateCharts(metrics, sportsPL);
//     }
 
 
//     // Calculate strategy metrics (kept for backward compatibility)
//     function calculateStrategyMetrics(item, profitLoss) {
//         let metrics = {
//             strat1PL: 0,
//             strat2PL: 0,
//             strat3PL: 0,
//             piechart2Text:' '
//         };
 
//         let strategy = '';
//         if (item.strategy === 'Strategy_1') {
//             metrics.strat1PL += profitLoss;
//         } else if (item.strategy === 'Strategy_2') {
//             metrics.strat2PL += profitLoss;
//         } else if (item.strategy === 'Strategy_3') {
//             metrics.strat3PL += profitLoss;
//         }
//         else {
//             metrics.piechart2Text = 'No strategy found';
//         }
 
//         return metrics;
//     }
 
//     function resetMetrics() {
//         const emptyMetrics = {
//             totalBet: 0,
//             totalPL: 0,
//             betMatched: 0,
//             betUnmatched: 0,
//             strat1PL: 0,
//             strat2PL: 0,
//             strat3PL: 0
//         };
//         updateMetricBoxes(emptyMetrics);
//         updateCharts(emptyMetrics, {});
//     }
 
//     function updateMetricBoxes(metrics) {
//         if (metricBoxes.overall_PL) {
//             metricBoxes.overall_PL.textContent = `$${metrics.totalPL.toFixed(2)}`;
//             updateIndicator(metricBoxes.Indicator, metrics.totalPL);
//         }
//         if (metricBoxes.total_bet) {
//             metricBoxes.total_bet.textContent = metrics.totalBet;
//             animateCountUp(metricBoxes.total_bet, 0, metrics.totalBet, 1000);
//         }
 
//         if (metricBoxes.bet_matched) {
//             metricBoxes.bet_matched.textContent = metrics.betMatched;
//             animateCountUp(metricBoxes.bet_matched, 0, metrics.betMatched, 1000);
//         }
 
//         if (metricBoxes.bet_unmatched) {
//             metricBoxes.bet_unmatched.textContent = metrics.betUnmatched;
//             animateCountUp(metricBoxes.bet_unmatched, 0, metrics.betUnmatched, 1000);
//         }
 
//         if (metricBoxes.strat1_PL) {
//             metricBoxes.strat1_PL.textContent = `$${metrics.strat1PL.toFixed(2)}`;
//             updateIndicator(metricBoxes.Indicator1, metrics.strat1PL);
//         }
//         if (metricBoxes.strat2_PL) {
//             metricBoxes.strat2_PL.textContent = `$${metrics.strat2PL.toFixed(2)}`;
//             updateIndicator(metricBoxes.Indicator2, metrics.strat2PL);
//         }
//         if (metricBoxes.strat3_PL) {
//             metricBoxes.strat3_PL.textContent = `$${metrics.strat3PL.toFixed(2)}`;
//             updateIndicator(metricBoxes.Indicator3, metrics.strat3PL);
//         }
//     }
 
//     function updateIndicator(indicator, value) {
//         if (indicator) {
//             indicator.textContent = value >= 0 ? '▲' : '▼';
//             indicator.style.color = value >= 0 ? 'green' : 'red';
//         }
//     }
 
//     function updateCharts(metrics, sportsPL) {
//         // Get current selected sport
//         const sportSelect = document.querySelector('.allSports');
//         const selectedSport = sportSelect ? sportSelect.value : 'All Sports';
       
//         // Update chart title based on selection
//         const title1Element = document.querySelector('.pie1 .chart-title');
//         if (title1Element) {
//             if (selectedSport === 'All Sports') {
//                 title1Element.textContent = 'Sports Profit/Loss Distribution';
//             } else {
//                 title1Element.textContent = `${selectedSport} Profit/Loss Distribution`;
//             }
//         }
       
//         if (chart1) {
//             // Calculate total absolute profit/loss
//             const totalPL = Object.values(sportsPL).reduce((sum, value) => sum + Math.abs(value), 0);
           
//             if (selectedSport !== 'All Sports' && Object.keys(sportsPL).length <= 1) {
//                 // For single sport view, show profit/loss by strategy instead
//                 const strategyData = [metrics.strat1PL, metrics.strat2PL, metrics.strat3PL];
//                 const strategyLabels = ['Strategy 1', 'Strategy 2', 'Strategy 3'];
//                 const strategyColors = colorPalette.strategies;
               
//                 chart1.data = {
//                     labels: strategyLabels.map((strat, i) =>
//                         `${strat} ($${strategyData[i].toFixed(2)})`
//                     ),
//                     datasets: [{
//                         data: strategyData.map(Math.abs),
//                         backgroundColor: strategyColors,
//                         rawValues: strategyData
//                     }]
//                 };
               
//                 // Update tooltip for strategy-based view
//                 chart1.options.plugins.tooltip = {
//                     callbacks: {
//                         label: function(context) {
//                             const strategy = strategyLabels[context.dataIndex];
//                             const value = strategyData[context.dataIndex];
//                             const totalAbsValue = strategyData.reduce((a, b) => Math.abs(a) + Math.abs(b), 0);
//                             const percentage = totalAbsValue > 0 ?
//                                 ((Math.abs(value) / totalAbsValue) * 100).toFixed(1) : '0';
//                             return [
//                                 `${strategy}`,
//                                 `Amount: $${value.toFixed(2)}`,
//                                 `Percentage: ${percentage}%`,
//                                 `Status: ${value >= 0 ? 'Profit' : 'Loss'}`
//                             ];
//                         }
//                     }
//                 };
//             } else {
//                 // For all sports view, show distribution by sport
//                 const sports = Object.keys(sportsPL);
//                 const profitLossValues = sports.map(sport => sportsPL[sport]);
               
//                 // Calculate percentages of total P/L
//                 const percentages = profitLossValues.map(value =>
//                     totalPL > 0 ? ((Math.abs(value) / totalPL) * 100).toFixed(1) : '0'
//                 );
               
//                 if (sports.length > 0) {
//                     // Get sport-specific colors
//                     const backgroundColors = sports.map(sport => getSportColor(sport));
                   
//                     // Update chart data
//                     chart1.data = {
//                         labels: sports.map((sport, i) =>
//                             `${sport} ($${profitLossValues[i].toFixed(2)})`
//                         ),
//                         datasets: [{
//                             data: profitLossValues.map(Math.abs),
//                             backgroundColor: backgroundColors,
//                             percentages: percentages,
//                             rawValues: profitLossValues
//                         }]
//                     };
                   
//                     // Update tooltip for sport-based view
//                     chart1.options.plugins.tooltip = {
//                         callbacks: {
//                             label: function(context) {
//                                 const sport = sports[context.dataIndex];
//                                 const value = profitLossValues[context.dataIndex];
//                                 const percentage = percentages[context.dataIndex];
//                                 return [
//                                     `${sport}`,
//                                     `Amount: $${value.toFixed(2)}`,
//                                     `Percentage: ${percentage}%`,
//                                     `Status: ${value >= 0 ? 'Profit' : 'Loss'}`
//                                 ];
//                             }
//                         }
//                     };
//                 }
//             }
           
//             chart1.update();
//         }
   
//         if (chart2) {
//             // Get strategy profit/loss values
//             const strat1PL = metrics.strat1PL;
//             const strat2PL = metrics.strat2PL;
//             const strat3PL = metrics.strat3PL;
           
//             // Calculate total absolute profit/loss
//             const totalStratPL = Math.abs(strat1PL) + Math.abs(strat2PL) + Math.abs(strat3PL);
           
//             // Strategy profit/loss values
//             const strategyPLValues = [strat1PL, strat2PL, strat3PL];
           
//             // Strategy labels with profit/loss amounts
//             const strategyLabels = [
//                 `Strategy 1 ($${strat1PL.toFixed(2)})`,
//                 `Strategy 2 ($${strat2PL.toFixed(2)})`,
//                 `Strategy 3 ($${strat3PL.toFixed(2)})`
//             ];
           
//             // Use consistent strategy colors from palette
//             const backgroundColors = colorPalette.strategies;
           
//             // Calculate percentages for strategies
//             const strategyPercentages = strategyPLValues.map(value =>
//                 totalStratPL > 0 ? ((Math.abs(value) / totalStratPL) * 100).toFixed(1) : '0'
//             );
           
//             chart2.data = {
//                 labels: strategyLabels,
//                 datasets: [{
//                     data: strategyPLValues.map(Math.abs),
//                     backgroundColor: backgroundColors,
//                     percentages: strategyPercentages,
//                     rawValues: strategyPLValues
//                 }]
//             };
           
//             chart2.update();
//         }
//     }
 
//     // Populate sports dropdown from data
//     async function populateSportsDropdown() {
//         try {
//             const data = await fetchData();
//             if (!Array.isArray(data) || data.length === 0) return;
           
//             // Extract unique sports
//             const sportsSet = new Set();
//             data.forEach(item => {
//                 const sport = getSport(item);
//                 if (sport && sport !== 'Unknown') {
//                     sportsSet.add(sport);
//                 }
//             });
           
//             const sports = Array.from(sportsSet).sort();
           
//             // Add options to dropdown
//             const sportSelect = document.querySelector('.allSports');
//             if (sportSelect) {
//                 // Clear existing options
//                 sportSelect.innerHTML = '';
               
//                 // Add "All Sports" option
//                 const allOption = document.createElement('option');
//                 allOption.value = 'All Sports';
//                 allOption.textContent = 'All Sports';
//                 sportSelect.appendChild(allOption);
               
//                 // Add individual sport options
//                 sports.forEach(sport => {
//                     const option = document.createElement('option');
//                     option.value = sport;
//                     option.textContent = sport;
//                     sportSelect.appendChild(option);
//                 });
//             }
//         } catch (error) {
//             console.error('Error populating sports dropdown:', error);
//         }
//     }
 
//     // Initialize event listeners
//     function initializeEventListeners() {
//         const sportSelect = document.querySelector('.allSports');
//         const dateInputs = document.querySelectorAll('.filters input[type="date"]');
 
//         const debouncedUpdate = debounce(async () => {
//             const data = await fetchData();
//             const filteredData = filterData(data);
//             updateMetrics(filteredData);
//         }, 300);
 
//         if (sportSelect) {
//             sportSelect.addEventListener('change', debouncedUpdate);
//         }
 
//         dateInputs.forEach(input => {
//             input.addEventListener('change', debouncedUpdate);
//         });
 
//         window.addEventListener('resize', debounce(() => {
//             if (chart1) chart1.resize();
//             if (chart2) chart2.resize();
//         }, 250));
//     }
 
//     // Debounce helper function
//     function debounce(func, wait) {
//         let timeout;
//         return function executedFunction(...args) {
//             const later = () => {
//                 clearTimeout(timeout);
//                 func(...args);
//             };
//             clearTimeout(timeout);
//             timeout = setTimeout(later, wait);
//         };
//     }
 
//     // Initialize the dashboard
//     async function initializeDashboard() {
//         await populateSportsDropdown();
//         initializeCharts();
//         initializeEventListeners();
       
//         const initialData = await fetchData();
//         if (initialData.length > 0) {
//             const filteredData = filterData(initialData);
//             updateMetrics(filteredData);
//         }
//     }
 
//     // Start the application
//     initializeDashboard();
// });
 
 

 
// const overall_PL= document.getElementById('over_PL')
// const total_bet= document.getElementById('TB')
// const bet_matched= document.getElementById('BM')
// const bet_unmatched= document.getElementById('UM')
// const strat1_PL= document.getElementById('PL1')
// const strat2_PL= document.getElementById('PL2')
// const strat3_PL= document.getElementById('PL3')
 
 
 
// function animateCountUp(element, start, end, duration) {
//     if (!element) return;
   
//     let startTime = null;
   
//     function updateCounter(currentTime) {
//         if (!startTime) startTime = currentTime;
//         let elapsedTime = currentTime - startTime;
//         let progress = Math.min(elapsedTime / duration, 1);
//         let currentValue = Math.floor(progress * (end - start) + start);
     
//         element.textContent = currentValue;
     
//         if (progress < 1) {
//             requestAnimationFrame(updateCounter);
//         }
//     }
   
//     requestAnimationFrame(updateCounter);
// }
 







document.addEventListener('DOMContentLoaded', function() {
    let chart1 = null;  
    let chart2 = null;
 
    // Define a comprehensive color palette
    const colorPalette = {
        // Primary colors for profit/loss
        profit: 'rgba(26, 87, 79, 0.8)',      // Green
        loss: 'rgba(214, 48, 49, 0.8)',       // Red
       
        // Sport-specific colors (for consistent coloring per sport)
        sports: {
            'Volleyball': 'rgb(42,102,102)',    
            'Tennis': 'rgb(54, 105, 105)',      
            'Basketball': 'rgb(64, 116, 116)',
            'Snooker': 'rgb(78, 141, 141)',        
            'American Football': 'rgb(72, 150, 150)',    
            'Australlian Rules': 'rgb(55, 121, 121)',  
            'Martial Arts': 'rgb(89, 175, 175)',  
            // Add more sports as needed
        },
       
        // Strategy colors
        strategies: [
            'rgb(53,146,129)',   // Strategy 1
            'rgba(58, 122, 112, 0.8)',  // Strategy 2
            'rgb(61,113,106)'   // Strategy 3
        ],
       
        // Fallback colors for any additional categories
        fallback: [
            'rgb(42,102,102)',  // Blue
            'rgb(54, 105, 105)',  // Purple
            'rgb(64,116,116)',  // Orange
            'rgb(78, 141, 141)',   // Green
            'rgb(72, 150, 150)',   // Red
            'rgb(55, 121, 121)' , // Gray
            'rgb(89, 175, 175)'
        ]
    };
 
    // Helper function to get color for a sport
    function getSportColor(sport) {
        return colorPalette.sports[sport] ||
            colorPalette.fallback[Math.abs(sport.hashCode()) % colorPalette.fallback.length];
    }
 
    // Add a simple hash function for string to number conversion
    String.prototype.hashCode = function() {
        let hash = 0;
        for (let i = 0; i < this.length; i++) {
            const char = this.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    };
 
    // Initialize charts
   // Initialize charts
function initializeCharts() {
    // Create title elements first (before charts)
    const title1 = document.createElement('p');
    title1.textContent = 'Sports Profit/Loss Distribution';
    title1.className = 'chart-title';
    title1.style.color = '#888888'; // Light grey color
    title1.style.margin = '0 0 10px 0'; // Add some bottom margin
    title1.style.fontWeight = 'bold';
    
    const title2 = document.createElement('p');
    title2.textContent = 'Strategy Profit/Loss Distribution';
    title2.className = 'chart-title';
    title2.style.color = '#888888'; // Light grey color
    title2.style.margin = '0 0 10px 0'; // Add some bottom margin
    title2.style.fontWeight = 'bold';
    
    // Add titles to containers BEFORE the charts
    document.querySelector('.pie1').appendChild(title1);
    document.querySelector('.pie2').appendChild(title2);
    
    // Create canvas elements for charts
    const ctx1 = document.createElement('canvas');
    document.querySelector('.pie1').appendChild(ctx1);
    
    // Initialize first chart
    chart1 = new Chart(ctx1, {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [],
                rawValues: []
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 15,
                        usePointStyle: false,
                        font: {
                            size: 10
                        },
                        color:'black'
                    }
                },
                title: {
                    display: false // Keep this false since we're using custom titles
                },
                datalabels: {
                    display: false,
                }
            }
        },
        plugins: [ChartDataLabels]
    });

    const ctx2 = document.createElement('canvas');
    document.querySelector('.pie2').appendChild(ctx2);
    
    // Initialize second chart for strategies
    chart2 = new Chart(ctx2, {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [],
                rawValues: []
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: false // Keep this false since we're using custom titles
                },
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 15,
                        usePointStyle: false,
                        font: {
                            size: 10
                        },
                        color:'black',
                    }
                },
                datalabels: {
                    display: false,
                    color: 'white',
                    font: {
                        weight: 'bold'
                    },
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const strategy = context.label.split(' (')[0];
                            const value = context.chart.data.datasets[0].rawValues[context.dataIndex];
                            const percentage = ((Math.abs(value) /
                                               context.chart.data.datasets[0].rawValues.reduce((a, b) => Math.abs(a) + Math.abs(b), 0)) * 100).toFixed(1);
                            return [
                                `${strategy}`,
                                `Amount: $${value.toFixed(2)}`,
                                `Percentage: ${percentage}%`,
                                `Status: ${value >= 0 ? 'Profit' : 'Loss'}`
                            ];
                        }
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}
   
 
    // Reference to metric boxes
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
        console.log('Session Token:', sessionToken ? 'Present' : 'Missing');
       
        try {
            const response = await fetch('http://localhost:6060/api/gethistory', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionToken}`
                }
            });
       
            if (!response.ok) {
                console.error('API Error:', response.status, response.statusText);
                const errorText = await response.text();
                console.error('Error details:', errorText);
                throw new Error(`API response not OK: ${response.status}`);
            }
       
            const data = await response.json();
            console.log('API Response Data:', data);
           
            if (!Array.isArray(data) || data.length === 0) {
                console.warn('API returned empty or invalid data');
            }
           
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Detailed fetch error:', error);
            return [];
        }
    }

    // Get sport for an item - improved to handle different formats
    function getSport(item) {
        if (item.Sport) return item.Sport;
        if (item.Match && typeof item.Match === 'string') {
            const parts = item.Match.split('/');
            return parts.length > 0 ? parts[0].trim() : 'Unknown';
        }
        return 'Unknown';
    }
   
    // Enhanced filterData function to properly handle sport selection
    function filterData(data) {
        const sportSelect = document.querySelector('.allSports');
        const dateInputs = document.querySelectorAll('.filters input[type="date"]');
        const selectedSport = sportSelect ? sportSelect.value : 'All Sports';
        
        let startDate = dateInputs[0] && dateInputs[0].value ? new Date(dateInputs[0].value) : null;
        let endDate = dateInputs[1] && dateInputs[1].value ? new Date(dateInputs[1].value) : null;
        
        // Automatically set endDate to 7 days after startDate if startDate is selected
        if (startDate) {
            const newEndDate = new Date(startDate);
            newEndDate.setDate(newEndDate.getDate() + 7);
            dateInputs[1].value = newEndDate.toISOString().split('T')[0]; // Set input value
            endDate = newEndDate; // Update the endDate variable
        }
    
        return data.filter(item => {
            const itemSport = getSport(item);
            const itemDate = new Date(item.date || item.created_at);
            
            const sportMatch = selectedSport === 'All Sports' ||
                              itemSport.toLowerCase() === selectedSport.toLowerCase() ||
                              (selectedSport !== 'All Sports' && itemSport.toLowerCase().includes(selectedSport.toLowerCase()));
            
            const dateMatch = (!startDate || itemDate >= startDate) &&
                              (!endDate || itemDate <= endDate);
    
            return sportMatch && dateMatch;
        });
    }
 
    // Check if bet is matched
    function checkBetMatched(item) {
        if (item.Status) {
            const status = item.Status.toUpperCase();
            return status !== 'UNMATCHED';
        }
        if (item.state) {
            const state = item.state.toUpperCase();
            return ['MATCHED', 'EXECUTED', 'SETTLED'].includes(state);
        }
        // For legacy data with only Result field
        return item.Result === 'win' || item.Result === 'lose';
    }   
    
    // Update metrics with new data
    function updateMetrics(filteredData) {
        if (filteredData.length === 0) {
            resetMetrics();
            return;
        }
 
        let metrics = {
            totalBet: 0,
            totalPL: 0,
            betMatched: 0,
            betUnmatched: 0,
            strat1PL: 0,
            strat2PL: 0,
            strat3PL: 0
        };
 
        // Create sports-based profit/loss tracking
        let sportsPL = {};
 
        filteredData.forEach(item => {
            metrics.totalBet++;
           
            // Calculate Profit/Loss
            const profitLoss = Number(item.ProfitLoss) || 0;
            metrics.totalPL += profitLoss;
 
            // Update bet matching status
            if (checkBetMatched(item)) {
                metrics.betMatched++;
            } else {
                metrics.betUnmatched++;
            }
 
            // Track profit/loss by sport
            const sport = getSport(item);
            if (!sportsPL[sport]) {
                sportsPL[sport] = 0;
            }
            sportsPL[sport] += profitLoss;
 
            // For backward compatibility, keep strategy metrics
            const strategyMetrics = calculateStrategyMetrics(item, profitLoss);
            metrics.strat1PL += strategyMetrics.strat1PL;
            metrics.strat2PL += strategyMetrics.strat2PL;
            metrics.strat3PL += strategyMetrics.strat3PL;
        });
 
        // Update UI with new metrics
        updateMetricBoxes(metrics);
        updateCharts(metrics, sportsPL,filteredData);
    }
 
 
    // Calculate strategy metrics (kept for backward compatibility)
    function calculateStrategyMetrics(item, profitLoss) {
        let metrics = {
            strat1PL: 0,
            strat2PL: 0,
            strat3PL: 0
        };
 
        let strategy = '';
        if (item.strategy === 'Strategy_1') {
            metrics.strat1PL += profitLoss;
        } else if (item.strategy === 'Strategy_2') {
            metrics.strat2PL += profitLoss;
        } else if (item.strategy === 'Strategy_3') {
            metrics.strat3PL += profitLoss;
        }
 
        return metrics;
    }
 
    function resetMetrics() {
        const emptyMetrics = {
            totalBet: 0,
            totalPL: 0,
            betMatched: 0,
            betUnmatched: 0,
            strat1PL: 0,
            strat2PL: 0,
            strat3PL: 0
        };
        updateMetricBoxes(emptyMetrics);
        updateCharts(emptyMetrics, {});
    }
 
    function updateMetricBoxes(metrics) {
        if (metricBoxes.overall_PL) {
            metricBoxes.overall_PL.textContent = `$${metrics.totalPL.toFixed(2)}`;
            updateIndicator(metricBoxes.Indicator, metrics.totalPL);
        }
        if (metricBoxes.total_bet) {
            metricBoxes.total_bet.textContent = metrics.totalBet;
            animateCountUp(metricBoxes.total_bet, 0, metrics.totalBet, 1000);
        }
 
        if (metricBoxes.bet_matched) {
            metricBoxes.bet_matched.textContent = metrics.betMatched;
            animateCountUp(metricBoxes.bet_matched, 0, metrics.betMatched, 1000);
        }
 
        if (metricBoxes.bet_unmatched) {
            metricBoxes.bet_unmatched.textContent = metrics.betUnmatched;
            animateCountUp(metricBoxes.bet_unmatched, 0, metrics.betUnmatched, 1000);
        }
 
        if (metricBoxes.strat1_PL) {
            metricBoxes.strat1_PL.textContent = `$${metrics.strat1PL.toFixed(2)}`;
            updateIndicator(metricBoxes.Indicator1, metrics.strat1PL);
        }
        if (metricBoxes.strat2_PL) {
            metricBoxes.strat2_PL.textContent = `$${metrics.strat2PL.toFixed(2)}`;
            updateIndicator(metricBoxes.Indicator2, metrics.strat2PL);
        }
        if (metricBoxes.strat3_PL) {
            metricBoxes.strat3_PL.textContent = `$${metrics.strat3PL.toFixed(2)}`;
            updateIndicator(metricBoxes.Indicator3, metrics.strat3PL);
        }
    }
 
    function updateIndicator(indicator, value) {
        if (indicator) {
            indicator.textContent = value >= 0 ? '▲' : '▼';
            indicator.style.color = value >= 0 ? 'green' : 'red';
        }
    }
 
    function calculateProfitLoss(item) {
        return Number(item.ProfitLoss) || 0;
    }

    function updateCharts(metrics, sportsPL, filteredData) {
        const sportSelect = document.querySelector('.allSports');
        const selectedSport = sportSelect ? sportSelect.value : 'All Sports';
        const container1 = document.querySelector('.pie1');
        const container2 = document.querySelector('.pie2');
        
        // Update chart titles
        const title1Element = document.querySelector('.pie1 .chart-title');
        if (title1Element) {
            title1Element.textContent = selectedSport === 'All Sports' ? 
                'Sports Profit/Loss Distribution' : 
                `${selectedSport} Profit/Loss Over Time`;
        }
        
        // Update second chart title
        const title2Element = document.querySelector('.pie2 .chart-title');
        if (title2Element) {
            title2Element.textContent = selectedSport === 'All Sports' ? 
                'Strategy Profit/Loss Distribution' : 
                `${selectedSport} Strategy Performance`;
        }
    
        // Destroy existing charts
        if (chart1) {
            chart1.destroy();
        }
    
        const ctx1 = document.createElement('canvas');
        container1.innerHTML = '';
        container1.appendChild(ctx1);
    
        if (selectedSport === 'All Sports') {
            // First chart - Pie chart for all sports (unchanged)
            const sports = Object.keys(sportsPL);
            const profitLossValues = sports.map(sport => sportsPL[sport]);
            const totalPL = profitLossValues.reduce((sum, value) => sum + Math.abs(value), 0);
            const percentages = profitLossValues.map(value => 
                totalPL > 0 ? ((Math.abs(value) / totalPL) * 100).toFixed(1) : '0'
            );
    
            chart1 = new Chart(ctx1, {
                type: 'pie',
                data: {
                    labels: sports.map((sport, i) => `${sport} ($${profitLossValues[i].toFixed(2)})`),
                    datasets: [{
                        data: profitLossValues.map(Math.abs),
                        backgroundColor: sports.map(sport => getSportColor(sport)),
                        rawValues: profitLossValues
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                boxWidth: 15,
                                font: { size: 10 },
                                color: 'black'
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const sport = sports[context.dataIndex];
                                    const value = profitLossValues[context.dataIndex];
                                    const percentage = percentages[context.dataIndex];
                                    return [
                                        `${sport}`,
                                        `Amount: $${value.toFixed(2)}`,
                                        `Percentage: ${percentage}%`,
                                        `Status: ${value >= 0 ? 'Profit' : 'Loss'}`
                                    ];
                                }
                            }
                        }
                    }
                }
            });
    
            // Update strategy pie chart (unchanged)
            if (chart2) {
                const strategyData = [
                    metrics.strat1PL,
                    metrics.strat2PL,
                    metrics.strat3PL
                ];
                
                chart2.data = {
                    labels: [
                        `Strategy 1 ($${metrics.strat1PL.toFixed(2)})`,
                        `Strategy 2 ($${metrics.strat2PL.toFixed(2)})`,
                        `Strategy 3 ($${metrics.strat3PL.toFixed(2)})`
                    ],
                    datasets: [{
                        data: strategyData.map(Math.abs),
                        backgroundColor: colorPalette.strategies,
                        rawValues: strategyData
                    }]
                };
                
                chart2.update();
            }
        } else {
            // Filter data for selected sport
            const sportData = filteredData
                .filter(item => getSport(item) === selectedSport)
                .sort((a, b) => new Date(a.date || a.created_at) - new Date(b.date || b.created_at));
    
            if (sportData.length === 0) {
                container1.innerHTML = `<div style="text-align:center;padding:40px;color:#666;">No data available for ${selectedSport}</div>`;
                container2.innerHTML = `<div style="text-align:center;padding:40px;color:#666;">No data available for ${selectedSport}</div>`;
                return;
            }
    
            // First line chart - overall performance (unchanged)
            let cumulative = 0;
            const chartData = sportData.map(item => {
                cumulative += calculateProfitLoss(item);
                return {
                    x: new Date(item.date || item.created_at),
                    y: cumulative
                };
            });
    
            chart1 = new Chart(ctx1, {
                type: 'line',
                data: {
                    datasets: [{
                        label: 'Cumulative Profit/Loss',
                        data: chartData,
                        borderColor: "#4ecf86",
                        backgroundColor: "rgb(181,214,200)",
                        fill: true,
                        tension: 0.1,
                        pointBackgroundColor: chartData.map(point => 
                            point.y >= 0 ? colorPalette.profit : colorPalette.loss
                        ),
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                unit: 'day',
                                displayFormats: {
                                    day: 'MMM d'
                                }
                            },
                            title: {
                                display: true,
                                text: 'Date'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Cumulative Profit/Loss ($)'
                            }
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `Profit/Loss: $${context.parsed.y.toFixed(2)}`;
                                }
                            }
                        }
                    }
                }
            });
    
            // Destroy existing second chart
            if (chart2) {
                chart2.destroy();
            }
            
            // Create a new canvas for the second chart
            const ctx2 = document.createElement('canvas');
            container2.innerHTML = '';
            container2.appendChild(ctx2);
    
            // Find all unique strategies in the data
            const strategies = [...new Set(sportData.map(item => item.strategy))].filter(Boolean);
            
            // Prepare strategy-wise cumulative data
            const strategyPerfData = {};
            
            strategies.forEach(strategy => {
                strategyPerfData[strategy] = {
                    label: `Strategy ${strategy}`,
                    data: [],
                    cumulative: 0,
                    color: getStrategyColor(strategy)
                };
            });
            
            // Sort data by date
            const sortedData = [...sportData].sort((a, b) => 
                new Date(a.date || a.created_at) - new Date(b.date || b.created_at)
            );
            
            // Group data by date and strategy
            const dateMap = {};
            
            sortedData.forEach(item => {
                const strategy = item.strategy;
                if (!strategy) return;
                
                const date = new Date(item.date || item.created_at);
                const dateStr = date.toISOString().split('T')[0];
                
                if (!dateMap[dateStr]) {
                    dateMap[dateStr] = {
                        date: date,
                        strategies: {}
                    };
                }
                
                if (!dateMap[dateStr].strategies[strategy]) {
                    dateMap[dateStr].strategies[strategy] = 0;
                }
                
                dateMap[dateStr].strategies[strategy] += calculateProfitLoss(item);
            });
            
            // Convert to sorted array
            const sortedDates = Object.values(dateMap).sort((a, b) => a.date - b.date);
            
            // Calculate cumulative values for each strategy
            strategies.forEach(strategy => {
                let cumulative = 0;
                
                sortedDates.forEach(dateData => {
                    if (dateData.strategies[strategy] !== undefined) {
                        cumulative += dateData.strategies[strategy];
                    }
                    
                    strategyPerfData[strategy].data.push({
                        x: dateData.date,
                        y: cumulative
                    });
                });
            });
            
            // Function to get color for strategy
            function getStrategyColor(strategy) {
                const strategyColors = [
                    '#2E7D32',  
                    '#4CAF50',  
                    '#81C784'  
                ]
                return strategyColors[strategy] || '#2E7D32'; 
            }
            // Create datasets for chart
            const datasets = strategies.map(strategy => ({
                label: `${strategy}`,
                data: strategyPerfData[strategy].data,
                borderColor: getStrategyColor(strategy),
                backgroundColor: `${getStrategyColor(strategy)}20`,
                fill: false,
                tension: 0.1,
                pointRadius: 4,
                pointHoverRadius: 6,
                borderWidth: 2
            }));
            
            // Create the strategy performance chart
            chart2 = new Chart(ctx2, {
                type: 'line',
                data: {
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                unit: 'day',
                                displayFormats: {
                                    day: 'MMM d'
                                }
                            },
                            title: {
                                display: true,
                                text: 'Date'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Cumulative Strategy P/L ($)'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                            align: 'center',
                            labels: {
                                boxWidth: 15,
                                font: { size: 11 },
                                color: 'black'
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const strategy = context.dataset.label;
                                    const value = context.parsed.y;
                                    return `${strategy}: $${value.toFixed(2)}`;
                                }
                            }
                        }
                    }
                }
            });
        }
    }


    async function populateSportsDropdown() {
        try {
            const data = await fetchData();
            if (!Array.isArray(data) || data.length === 0) return;
            
            // Extract unique sports
            const sportsSet = new Set();
            data.forEach(item => {
                const sport = getSport(item);
                if (sport && sport !== 'Unknown') {
                    sportsSet.add(sport);
                }
            });
            
            const sports = Array.from(sportsSet).sort();
            
            // Add options to dropdown
            const sportSelect = document.querySelector('.allSports');
            if (sportSelect) {
                // Clear existing options
                sportSelect.innerHTML = '';
                
                // Add "All Sports" option
                const allOption = document.createElement('option');
                allOption.value = 'All Sports';
                allOption.textContent = 'All Sports';
                sportSelect.appendChild(allOption);
                
                // Add individual sport options
                sports.forEach(sport => {
                    const option = document.createElement('option');
                    option.value = sport;
                    option.textContent = sport;
                    sportSelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error populating sports dropdown:', error);
        }
    }
 
    // Initialize event listeners
    function initializeEventListeners() {
        const sportSelect = document.querySelector('.allSports');
        const dateInputs = document.querySelectorAll('.filters input[type="date"]');
 
        const debouncedUpdate = debounce(async () => {
            const data = await fetchData();
            const filteredData = filterData(data);
            updateMetrics(filteredData);
        }, 300);
 
        if (sportSelect) {
            sportSelect.addEventListener('change', debouncedUpdate);
        }
 
        dateInputs.forEach(input => {
            input.addEventListener('change', debouncedUpdate);
        });
 
        window.addEventListener('resize', debounce(() => {
            if (chart1) chart1.resize();
            if (chart2) chart2.resize();
        }, 250));
    }
 
    // Debounce helper function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
 
    // Initialize the dashboard
    async function initializeDashboard() {
        await populateSportsDropdown();
        initializeCharts();
        initializeEventListeners();
       
        const initialData = await fetchData();
        if (initialData.length > 0) {
            const filteredData = filterData(initialData);
            updateMetrics(filteredData);
        }
    }
 
    // Start the application
    initializeDashboard();
});

 
 
 
function animateCountUp(element, start, end, duration) {
    if (!element) return;
    
    let startTime = null;
    
    function updateCounter(currentTime) {
        if (!startTime) startTime = currentTime;
        let elapsedTime = currentTime - startTime;
        let progress = Math.min(elapsedTime / duration, 1);
        let currentValue = Math.floor(progress * (end - start) + start);
     
        element.textContent = currentValue;
     
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}