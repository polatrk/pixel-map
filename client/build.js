// build.js
require('dotenv').config({ path: '.env.production' });
const { execSync } = require('child_process');

// Execute the build command
execSync('react-scripts build', { stdio: 'inherit' });
