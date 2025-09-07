# LinkedIn Profile Hunter Chrome Extension

A Chrome extension that fetches LinkedIn profile details using Hunter.io API.

## Demo

<video src="demo/screen-recording.mp4" width="600" controls></video>

## Setup Steps

1. **Get Hunter.io API Key**
   - Visit [https://hunter.io/pricing](https://hunter.io/pricing)
   - Sign up for a free account
   - Get your API key from the dashboard

2. **Configure API Key**
   - Open `config.js`
   - Replace `'YOUR_API_KEY_HERE'` with your actual Hunter.io API key

3. **Load Extension in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the extension folder

## How to Test

1. Navigate to the test LinkedIn profile: [https://www.linkedin.com/in/ayush-tripathi-72241b149/](https://www.linkedin.com/in/ayush-tripathi-72241b149/)
2. Click the extension icon in the Chrome toolbar
3. The popup will display the fetched profile data

## Features

- Extracts Full Name, Organisation, and Designation from LinkedIn profile
- Uses Hunter.io API to find email addresses
- Shows "No data found" message when no information is available
- Works on any LinkedIn profile page (linkedin.com/in/*)

## File Structure

- `manifest.json` - Extension configuration
- `popup.html` - Extension popup UI
- `popup.js` - Main logic and API calls
- `content.js` - Content script for LinkedIn pages
- `config.js` - API key configuration
- `demo/screen-recording.mp4` - Demo video
- `README.md` - Setup and usage instructions

## Troubleshooting

- Ensure you're on a LinkedIn profile page (URL contains linkedin.com/in/)
- Check that your Hunter.io API key is correctly configured in config.js
- Open Developer Tools (F12) and check Console for any errors
