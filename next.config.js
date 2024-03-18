/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = nextConfig;

// const { debounce } = require('lodash'); 

// module.exports = {
//     webpack: (config, { isServer }) => {
//       // Only apply the changes in development
//       if (!isServer) {
//         config.watchOptions = {
//           poll: 1000, // Check for changes every second
//           aggregateTimeout: 2000, // Delay before rebuilding 
//         };
//       }
//       return config;
//     },
// };