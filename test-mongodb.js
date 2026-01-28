// MongoDB Connection Test Utility
const mongoose = require('mongoose');
require('dotenv').config();

console.log('🧪 Testing MongoDB Connection...\n');

// Get connection string from .env
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
    console.log('❌ No MONGODB_URI found in .env file');
    console.log('💡 Add your MongoDB Atlas connection string to .env file');
    console.log('📖 Follow setup-mongodb-atlas.md for instructions\n');
    process.exit(1);
}

console.log('📝 Connection String:', mongoURI.replace(/:[^:@]+@/, ':****@'));
console.log('⏳ Connecting...\n');

mongoose.connect(mongoURI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 10000
})
.then(async () => {
    console.log('✅ MongoDB Connected Successfully!\n');
    
    // Test database operations
    console.log('🧪 Testing database operations...');
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log(`📊 Database: ${db.databaseName}`);
    console.log(`📁 Collections: ${collections.length}`);
    
    if (collections.length > 0) {
        console.log('   Existing collections:');
        collections.forEach(col => console.log(`   - ${col.name}`));
    }
    
    // Test write operation
    const testCollection = db.collection('connection_test');
    await testCollection.insertOne({ 
        test: 'success', 
        timestamp: new Date(),
        message: 'MongoDB connection working!'
    });
    console.log('✅ Write test successful');
    
    // Test read operation
    const doc = await testCollection.findOne({ test: 'success' });
    console.log('✅ Read test successful');
    
    // Cleanup
    await testCollection.deleteMany({ test: 'success' });
    console.log('✅ Cleanup successful\n');
    
    console.log('🎉 All tests passed! MongoDB is ready to use.');
    console.log('💡 Update .env: USE_FILE_DB=false to enable MongoDB\n');
    
    await mongoose.disconnect();
    process.exit(0);
})
.catch(error => {
    console.log('❌ MongoDB Connection Failed\n');
    console.log('Error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    
    if (error.message.includes('ENOTFOUND')) {
        console.log('   - Check internet connection');
        console.log('   - Verify connection string is correct');
        console.log('   - Ensure cluster is running in MongoDB Atlas');
    } else if (error.message.includes('Authentication')) {
        console.log('   - Verify username and password');
        console.log('   - Check user permissions in MongoDB Atlas');
    } else if (error.message.includes('timeout')) {
        console.log('   - Check firewall settings');
        console.log('   - Verify IP is whitelisted (0.0.0.0/0)');
        console.log('   - Try different network');
    }
    
    console.log('\n📖 See setup-mongodb-atlas.md for detailed setup instructions');
    console.log('💡 App will continue using file-based database\n');
    
    process.exit(1);
});