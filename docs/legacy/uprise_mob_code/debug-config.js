// Debug script to check react-native-config values
import Config from 'react-native-config';

console.log('=== React Native Config Debug ===');
console.log('All Config values:', JSON.stringify(Config, null, 2));
console.log('API_BASE_URL specifically:', Config.API_BASE_URL);
console.log('BASE_URL (fallback):', Config.BASE_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('==================================');