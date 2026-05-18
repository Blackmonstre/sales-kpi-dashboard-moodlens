// ---- DATA ----
var datasets = {
  'This Month': {
    revenue: '$2.84M', deals: '347', conv: '24.6%', avg: '$8.2K',
    revChange: '↑ 12.4%', dealsChange: '↑ 8.1%', convChange: '↓ 2.3%', avgChange: '↑ 3.8%',
    revUp: true, dealsUp: true, convUp: false, avgUp: true,
    revSub: 'vs $2.53M last period', dealsSub: 'vs 321 last period',
    convSub: 'vs 26.9% last period', avgSub: 'vs $7.9K last period',
    monthly: [310,420,390,510,480,560,620,590,710,680,760,840],
  },
  'Last Quarter': {
    revenue: '$7.12M', deals: '892', conv: '27.1%', avg: '$7.9K',
    revChange: '↑ 9.3%', dealsChange: '↑ 5.2%', convChange: '↑ 1.1%', avgChange: '↑ 2.1%',
    revUp: true, dealsUp: true, convUp: true, avgUp: true,
    revSub: 'vs $6.51M prior quarter', dealsSub: 'vs 848 prior quarter',
    convSub: 'vs 26.0% prior quarter', avgSub: 'vs $7.7K prior quarter',
    monthly: [520,610,740,680,820,910,780,860,920,980,1040,1120],
  },
  'YTD': {
    revenue: '$14.3M', deals: '1842', conv: '25.8%', avg: '$7.8K',
    revChange: '↑ 18.2%', dealsChange: '↑ 14.1%', convChange: '↑ 0.8%', avgChange: '↑ 3.4%',
    revUp: true, dealsUp: true, convUp: true, avgUp: true,
    revSub: 'vs $12.1M last year', dealsSub: 'vs 1614 last year',
    convSub: 'vs 25.0% last year', avgSub: 'vs $7.5K last year',
    monthly: [980,1100,1240,1380,1520,1640,1760,1840,1920,2040,2140,2220],
  },
  'Last Year': {
    revenue: '$22.6M', deals: '3104', conv: '23.4%', avg: '$7.3K',
    revChange: '↑ 22.1%', dealsChange: '↑ 19.0%', convChange: '↓ 0.5%', avgChange: '↑ 1.9%',
    revUp: true, dealsUp: true, convUp: false, avgUp: true,
    revSub: 'vs $18.5M prior year', dealsSub: 'vs 2609 prior year',
    convSub: 'vs 23.9% prior year', avgSub: 'vs $7.2K prior year',
    monthly: [1400,1560,1700,1820,1960,2080,2140,2200,2310,2420,2520,2640],
  }
};

var repsData = [
  { name: 'Sarah Chen',     revenue: '$412K', quota: 94,  status: 'on-track' },
  { name: 'Marcus Lee',     revenue: '$389K', quota: 88,  status: 'on-track' },
  { name: 'Priya Sharma',   revenue: '$361K', quota: 102, status: 'exceeded' },
  { name: "James O'Brien",  revenue: '$298K', quota: 76,  status: 'at-risk'  },
  { name: 'Aiko Tanaka',    revenue: '$274K', quota: 71,  status: 'at-risk'  },
  { name: 'Daniel Reyes',   revenue: '$251K', quota: 88,  status: 'on-track' },
];

var statusColors = { 'exceeded': '#4ade80', 'on-track': '#38bdf8', 'at-risk': '#f59e0b' };
var statusLabels = { 'exceeded': 'Exceeded', 'on-track': 'On Track', 'at-risk': 'At Risk' };

var currentPeriod = 'This Month';
var revenueChart, donutChart, pipelineChart;
var currentChartType = 'bar';

// ---- INIT ----
function init() {
  buildRepsTable();
  buildRevenueChart();
  buildDonutChart();
  buildPipelineChart();
}

// ---- FILTERS ----
function setFilter(btn, group) {
  document.querySelectorAll('.filter-btn').forEach(function(b) {
    b.classList.remove('active');
  });
  btn.classList.add('active');
  currentPeriod = btn.textContent.trim();
  updateKPIs();
  updateRevenueChart();
}

function setRegion(val) {
  updateKPIs();
}

function updateKPIs() {
  var d = datasets[currentPeriod] || datasets['This Month'];
  document.getElementById('kpi-revenue').textContent = d.revenue;
  document.getElementById('kpi-deals').textContent   = d.deals;
  document.getElementById('kpi-conv').textContent    = d.conv;
  document.getElementById('kpi-avg').textContent     = d.avg;
  setChange('rev-change',   d.revChange,   d.revUp);
  setChange('deals-change', d.dealsChange, d.dealsUp);
  setChange('conv-change',  d.convChange,  d.convUp);
  setChange('avg-change',   d.avgChange,   d.avgUp);
  document.getElementById('kpi-rev-sub').textContent   = d.revSub;
  document.getElementById('kpi-deals-sub').textContent = d.dealsSub;
  document.getElementById('kpi-conv-sub').textContent  = d.convSub;
  document.getElementById('kpi-avg-sub').textContent   = d.avgSub;
}

function setChange(id, text, isUp) {
  var el = document.getElementById(id);
  el.textContent = text;
  el.className = 'kpi-change ' + (isUp ? 'up' : 'down');
}

// ---- CHARTS ----
var chartScaleDefaults = {
  x: {
    ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 11 } },
    grid:  { color: 'rgba(255,255,255,0.04)' }
  },
  y: {
    ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 11 }, callback: function(v){ return '$' + v + 'K'; } },
    grid:  { color: 'rgba(255,255,255,0.06)' }
  }
};

function buildRevenueChart() {
  var ctx = document.getElementById('revenueChart').getContext('2d');
  var d   = datasets[currentPeriod];
  var isLine = currentChartType === 'line';

  revenueChart = new Chart(ctx, {
    type: isLine ? 'line' : 'bar',
    data: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      datasets: [
        {
          label: 'Revenue',
          data: d.monthly,
          backgroundColor: isLine ? 'rgba(102,126,234,0.15)' : 'rgba(102,126,234,0.65)',
          borderColor: '#667eea',
          borderWidth: isLine ? 2 : 0,
          borderRadius: isLine ? 0 : 6,
          fill: isLine,
          tension: 0.4,
          pointBackgroundColor: '#667eea',
          pointRadius: isLine ? 4 : 0,
        },
        {
          label: 'Pipeline (Forecast)',
          data: d.monthly.map(function(v, i){ return i >= 6 ? Math.round(v * 1.18) : null; }),
          backgroundColor: 'rgba(118,75,162,0.35)',
          borderColor: '#764ba2',
          borderWidth: isLine ? 2 : 0,
          borderRadius: 6,
          fill: false,
          tension: 0.4,
          pointRadius: 0,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { display: false } },
      scales: chartScaleDefaults
    }
  });
}

function buildDonutChart() {
  var ctx = document.getElementById('donutChart').getContext('2d');
  donutChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Enterprise','Mid-Market','SMB','Self-Serve'],
      datasets: [{
        data: [42, 28, 19, 11],
        backgroundColor: ['#667eea','#4ade80','#f59e0b','#38bdf8'],
        borderWidth: 2,
        borderColor: '#0f0f1a',
        hoverOffset: 6,
      }]
    },
    options: {
      responsive: true,
      cutout: '68%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(c){ return ' ' + c.label + ': ' + c.raw + '%'; }
          }
        }
      }
    }
  });
}

function buildPipelineChart() {
  var ctx = document.getElementById('pipelineChart').getContext('2d');
  pipelineChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Prospecting','Qualified','Proposal','Negotiation','Closing','Won'],
      datasets: [{
        label: 'Deals',
        data: [142, 98, 74, 52, 38, 24],
        backgroundColor: [
          'rgba(102,126,234,0.7)',
          'rgba(118,75,162,0.7)',
          'rgba(240,147,251,0.7)',
          'rgba(245,158,11,0.7)',
          'rgba(56,189,248,0.7)',
          'rgba(74,222,128,0.7)',
        ],
        borderRadius: 6,
        borderWidth: 0,
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
        y: { ticks: { color: 'rgba(255,255,255,0.5)', font: { size: 11 } }, grid: { display: false } }
      }
    }
  });
}

function setChartType(btn, type) {
  document.querySelectorAll('.chart-tab').forEach(function(b){ b.classList.remove('active'); });
  btn.classList.add('active');
  currentChartType = type;
  revenueChart.destroy();
  buildRevenueChart();
}

function updateRevenueChart() {
  revenueChart.destroy();
  buildRevenueChart();
}

// ---- TABLE ----
function buildRepsTable() {
  var tbody = document.getElementById('repsBody');
  tbody.innerHTML = '';
  repsData.forEach(function(rep, i) {
    var color = rep.quota >= 100 ? '#4ade80' : rep.quota >= 80 ? '#38bdf8' : '#f59e0b';
    var row = document.createElement('tr');
    row.innerHTML =
      '<td style="color:rgba(255,255,255,0.35);font-size:12px;">' + (i + 1) + '</td>' +
      '<td><span class="rep-name">' + rep.name + '</span></td>' +
      '<td style="color:#4ade80;font-weight:600;">' + rep.revenue + '</td>' +
      '<td style="min-width:120px;">' +
        '<div class="progress-wrap">' +
          '<div class="progress-bar-bg">' +
            '<div class="progress-bar-fill" style="width:' + Math.min(rep.quota, 100) + '%;background:' + color + ';"></div>' +
          '</div>' +
          '<span class="pct-label">' + rep.quota + '%</span>' +
        '</div>' +
      '</td>' +
      '<td><span style="font-size:12px;">' +
        '<span class="status-dot" style="background:' + statusColors[rep.status] + '"></span>' +
        statusLabels[rep.status] +
      '</span></td>';
    tbody.appendChild(row);
  });
}

// ---- REFRESH ----
function refreshData() {
  repsData = repsData.map(function(r) {
    return Object.assign({}, r, {
      quota: Math.min(110, Math.max(60, r.quota + Math.floor(Math.random() * 7 - 3)))
    });
  });
  buildRepsTable();
  updateKPIs();
}

// ---- BOOT ----
init();
