// frontend/src/test-api.js 
import api from './src/services/api.js';

const testAPI = async () => {
    try {
        console.log('🔍 Testing API connection...');
        console.log('📡 URL:', api.defaults.baseURL);
        
        const response = await api.get('/health');
        console.log('✅ API is working!', response.data);
        
        const rooms = await api.get('/rooms');
        console.log(`✅ Found ${rooms.data.count} rooms`);
        
        return true;
    } catch (error) {
        console.error('❌ API Error:', error.message);
        console.error('   Status:', error.response?.status);
        console.error('   Data:', error.response?.data);
        return false;
    }
};

testAPI();