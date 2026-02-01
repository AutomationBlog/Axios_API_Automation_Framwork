# HTML Test Reports Guide

## Overview

The framework includes advanced HTML reporting with multiple formats:
1. **jest-html-reporter** - Clean, single-page report
2. **jest-html-reporters** - Detailed multi-page report
3. **Enhanced Custom Report** - Interactive report with filtering and search

## Features

✅ **Interactive Dashboard** - Visual summary with statistics
✅ **Search & Filter** - Find tests quickly
✅ **Collapsible Test Suites** - Organize results efficiently
✅ **Pass Rate Visualization** - Progress bars and charts
✅ **Export Functionality** - Download results as JSON
✅ **Dark Mode Support** - Automatic theme detection
✅ **Keyboard Shortcuts** - Fast navigation
✅ **Responsive Design** - Works on all devices

## Generated Reports

After running tests, you'll find reports in the `/reports` directory:

```
reports/
├── test-report.html           # Main HTML report (jest-html-reporter)
├── html-report/
│   └── detailed-report.html   # Detailed report (jest-html-reporters)
├── enhanced-report.html       # Custom enhanced report
├── custom-report-style.css    # Custom styling
└── custom-report-script.js    # Interactive features
```

## Running Tests with Reports

### Generate all reports
```bash
npm test
```

### Generate and open reports
```bash
npm run test:report
npm run report:open
```

### View specific report types

The test run automatically generates:
- Console output (default Jest reporter)
- HTML report at `reports/test-report.html`
- Detailed report at `reports/html-report/detailed-report.html`
- Enhanced report at `reports/enhanced-report.html`

## Report Features

### 1. Summary Dashboard

The report header shows:
- Total number of tests
- Passed/Failed counts
- Pass rate percentage
- Test execution time
- Environment details

### 2. Interactive Filtering

**Filter Buttons:**
- All Tests - Show all test results
- Passed - Show only passing tests
- Failed - Show only failing tests

**Search Bar:**
- Real-time search across test names
- Keyboard shortcut: `Ctrl/Cmd + F`
- Clear with `ESC` key

### 3. Test Suite Organization

Each test suite displays:
- Suite name and file path
- Number of passed/failed tests
- Individual test cases with status
- Execution time per test
- Error details for failures

### 4. Visual Elements

**Progress Bars:**
- Overall pass rate visualization
- Color-coded success/failure indicators

**Status Icons:**
- ✓ Green checkmark for passed tests
- ✗ Red cross for failed tests

**Color Coding:**
- Green - Successful tests
- Red - Failed tests
- Blue - Overall statistics
- Orange - Warnings/pending

### 5. Export & Share

**Export JSON:**
Click the "Export Results" button to download test data as JSON:
```json
{
  "timestamp": "2024-01-30T12:00:00.000Z",
  "statistics": {
    "total": 15,
    "passed": 14,
    "failed": 1,
    "passRate": "93.3"
  },
  "testSuites": [...]
}
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + F` | Focus search box |
| `ESC` | Clear search |
| Click suite header | Collapse/expand suite |

## Customization

### Custom Styles

Edit `/reports/custom-report-style.css` to customize:
- Colors and themes
- Layout and spacing
- Font sizes and families
- Dark mode colors

Example:
```css
:root {
  --primary-color: #4CAF50;
  --danger-color: #f44336;
  --warning-color: #ff9800;
}
```

### Custom Scripts

Edit `/reports/custom-report-script.js` to add:
- New filtering options
- Additional charts
- Custom export formats
- Enhanced search capabilities

## Integration with CI/CD

### GitHub Actions Example

```yaml
- name: Run Tests
  run: npm test

- name: Upload Test Report
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: test-report
    path: reports/
```

### Jenkins Example

```groovy
stage('Test') {
    steps {
        sh 'npm test'
    }
    post {
        always {
            publishHTML([
                reportDir: 'reports',
                reportFiles: 'test-report.html',
                reportName: 'Test Report'
            ])
        }
    }
}
```

## Viewing Reports

### Locally

Open any report file in your browser:
```bash
# macOS
open reports/test-report.html

# Linux
xdg-open reports/test-report.html

# Windows
start reports/test-report.html

# Or use npm script
npm run report:open
```

### Via HTTP Server

```bash
# Using Python
cd reports
python -m http.server 8000

# Using Node.js
npx http-server reports

# Then visit: http://localhost:8000
```

## Troubleshooting

### Reports not generating
- Ensure tests are running: `npm test`
- Check `reports/` directory exists
- Verify `jest.config.js` has reporters configured

### Styles not applying
- Check `custom-report-style.css` path in `jest.config.js`
- Verify CSS file exists in `/reports` directory
- Clear browser cache

### Interactive features not working
- Check `custom-report-script.js` path
- Verify JavaScript file exists
- Check browser console for errors

## Report Configuration

Configure reporters in `jest.config.js`:

```javascript
reporters: [
  'default',
  [
    'jest-html-reporter',
    {
      pageTitle: 'API E2E Test Report',
      outputPath: './reports/test-report.html',
      theme: 'darkTheme',
      includeFailureMsg: true,
      includeConsoleLog: true
    }
  ]
]
```

### Available Options

**jest-html-reporter:**
- `pageTitle` - Report title
- `outputPath` - Output file path
- `theme` - Theme (defaultTheme/darkTheme)
- `includeFailureMsg` - Show error messages
- `includeConsoleLog` - Include console output
- `dateFormat` - Date format string

**jest-html-reporters:**
- `publicPath` - Output directory
- `filename` - Report filename
- `expand` - Auto-expand test suites
- `openReport` - Auto-open in browser
- `inlineSource` - Inline CSS/JS

## Best Practices

1. **Run tests before committing** - Ensure reports are up to date
2. **Archive reports** - Keep historical reports for comparison
3. **Share reports** - Send HTML files to stakeholders
4. **Review failures** - Use filter to focus on failed tests
5. **Track trends** - Compare pass rates over time
6. **Customize for your team** - Adjust colors and layout as needed

## Advanced Features

### Trend Analysis

Keep historical reports to track:
- Pass rate trends
- Test execution time
- Flaky test detection
- Coverage improvements

### Screenshot Integration

Add screenshots to failed tests:
```javascript
// In your test
if (testFailed) {
  await browser.screenshot('failure.png');
}
```

### Email Reports

Send reports via email:
```bash
# Using mailx
cat reports/test-report.html | mailx -s "Test Report" team@example.com
```

## Support

For issues or questions about HTML reports:
1. Check the troubleshooting section
2. Review Jest documentation
3. Check reporter plugin documentation
4. Submit an issue on GitHub
