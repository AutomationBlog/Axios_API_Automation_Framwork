// Custom script for enhanced test report functionality

document.addEventListener('DOMContentLoaded', function() {
  // Initialize the report
  initializeReport();
  
  // Add filter functionality
  addFilterButtons();
  
  // Add collapsible test suites
  addCollapsibleSuites();
  
  // Add search functionality
  addSearchBar();
  
  // Add charts
  renderCharts();
});

function initializeReport() {
  console.log('API Test Report Initialized');
  
  // Add timestamp
  const timestampElement = document.querySelector('.timestamp');
  if (timestampElement) {
    const now = new Date().toLocaleString();
    timestampElement.textContent = `Generated on: ${now}`;
  }
}

function addFilterButtons() {
  const reportContainer = document.querySelector('.report-container');
  if (!reportContainer) return;
  
  const filterContainer = document.createElement('div');
  filterContainer.className = 'filter-buttons';
  filterContainer.innerHTML = `
    <button class="filter-btn all active" onclick="filterTests('all')">All Tests</button>
    <button class="filter-btn passed" onclick="filterTests('passed')">Passed</button>
    <button class="filter-btn failed" onclick="filterTests('failed')">Failed</button>
  `;
  
  const firstSuite = document.querySelector('.test-suite');
  if (firstSuite) {
    firstSuite.parentNode.insertBefore(filterContainer, firstSuite);
  }
}

function filterTests(type) {
  // Update active button
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`.filter-btn.${type}`).classList.add('active');
  
  // Filter test cases
  const testCases = document.querySelectorAll('.test-case');
  testCases.forEach(testCase => {
    if (type === 'all') {
      testCase.style.display = 'flex';
    } else {
      testCase.style.display = testCase.classList.contains(type) ? 'flex' : 'none';
    }
  });
  
  // Update suite visibility
  document.querySelectorAll('.test-suite').forEach(suite => {
    const visibleTests = suite.querySelectorAll('.test-case[style*="display: flex"]');
    suite.style.display = visibleTests.length > 0 ? 'block' : 'none';
  });
}

function addCollapsibleSuites() {
  const suiteHeaders = document.querySelectorAll('.test-suite-header');
  
  suiteHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const suite = this.parentElement;
      const content = suite.querySelector('.test-suite-content');
      
      if (content) {
        content.style.display = content.style.display === 'none' ? 'block' : 'none';
        this.classList.toggle('collapsed');
      }
    });
  });
}

function addSearchBar() {
  const reportContainer = document.querySelector('.report-container');
  if (!reportContainer) return;
  
  const searchContainer = document.createElement('div');
  searchContainer.className = 'search-container';
  searchContainer.innerHTML = `
    <input 
      type="text" 
      id="testSearch" 
      placeholder="Search tests..." 
      style="width: 100%; padding: 12px; margin-bottom: 20px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1em;"
      oninput="searchTests(this.value)"
    />
  `;
  
  const filterButtons = document.querySelector('.filter-buttons');
  if (filterButtons) {
    filterButtons.parentNode.insertBefore(searchContainer, filterButtons.nextSibling);
  }
}

function searchTests(query) {
  const searchTerm = query.toLowerCase();
  const testCases = document.querySelectorAll('.test-case');
  
  testCases.forEach(testCase => {
    const testName = testCase.querySelector('.test-name').textContent.toLowerCase();
    testCase.style.display = testName.includes(searchTerm) ? 'flex' : 'none';
  });
  
  // Update suite visibility based on search
  document.querySelectorAll('.test-suite').forEach(suite => {
    const visibleTests = suite.querySelectorAll('.test-case[style*="display: flex"]');
    suite.style.display = visibleTests.length > 0 ? 'block' : 'none';
  });
}

function renderCharts() {
  // Get test statistics
  const stats = getTestStatistics();
  
  // Create pie chart container if it doesn't exist
  let chartContainer = document.querySelector('.chart-container');
  if (!chartContainer) {
    chartContainer = document.createElement('div');
    chartContainer.className = 'chart-container';
    
    const summaryCards = document.querySelector('.summary-cards');
    if (summaryCards) {
      summaryCards.parentNode.insertBefore(chartContainer, summaryCards.nextSibling);
    }
  }
  
  // Add progress bar
  const passRate = stats.total > 0 ? (stats.passed / stats.total * 100).toFixed(1) : 0;
  chartContainer.innerHTML = `
    <h3>Test Pass Rate</h3>
    <div class="progress-bar">
      <div class="progress-fill" style="width: ${passRate}%">${passRate}%</div>
    </div>
    <div style="margin-top: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
      <div style="text-align: center;">
        <div style="font-size: 2em; color: #4CAF50;">✓ ${stats.passed}</div>
        <div style="color: #666;">Passed</div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 2em; color: #f44336;">✗ ${stats.failed}</div>
        <div style="color: #666;">Failed</div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 2em; color: #2196F3;">Σ ${stats.total}</div>
        <div style="color: #666;">Total</div>
      </div>
    </div>
  `;
}

function getTestStatistics() {
  const passed = document.querySelectorAll('.test-case.passed').length;
  const failed = document.querySelectorAll('.test-case.failed').length;
  const total = passed + failed;
  
  return { passed, failed, total };
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
  // Ctrl/Cmd + F to focus search
  if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
    e.preventDefault();
    const searchInput = document.getElementById('testSearch');
    if (searchInput) {
      searchInput.focus();
    }
  }
  
  // Escape to clear search
  if (e.key === 'Escape') {
    const searchInput = document.getElementById('testSearch');
    if (searchInput) {
      searchInput.value = '';
      searchTests('');
    }
  }
});

// Export functionality
function exportReport() {
  const stats = getTestStatistics();
  const reportData = {
    timestamp: new Date().toISOString(),
    statistics: stats,
    testSuites: []
  };
  
  document.querySelectorAll('.test-suite').forEach(suite => {
    const suiteName = suite.querySelector('.test-suite-title').textContent;
    const tests = [];
    
    suite.querySelectorAll('.test-case').forEach(testCase => {
      const testName = testCase.querySelector('.test-name').textContent;
      const status = testCase.classList.contains('passed') ? 'passed' : 'failed';
      tests.push({ name: testName, status });
    });
    
    reportData.testSuites.push({ name: suiteName, tests });
  });
  
  const dataStr = JSON.stringify(reportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'test-report-data.json';
  link.click();
}

// Make functions globally available
window.filterTests = filterTests;
window.searchTests = searchTests;
window.exportReport = exportReport;
