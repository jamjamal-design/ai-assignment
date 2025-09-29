const mongoose = require('mongoose');
require('dotenv').config();

const testMongoDB = async () => {
  try {
    console.log('🧪 Testing MongoDB Atlas connection...\n');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Successfully connected to MongoDB Atlas');
    console.log('🌍 Database:', mongoose.connection.name);
    console.log('🔗 Host:', mongoose.connection.host);
    console.log('📊 Ready State:', mongoose.connection.readyState === 1 ? 'Connected' : 'Not Connected');
    
    // Test collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`\n📚 Available collections: ${collections.length}`);
    collections.forEach(col => {
      console.log(`  - ${col.name}`);
    });
    
    // Test a simple operation
    const Conversation = require('./models/Conversation');
    const count = await Conversation.countDocuments();
    console.log(`\n💬 Current conversations count: ${count}`);
    
    console.log('\n🎉 MongoDB Atlas is working perfectly!');
    
  } catch (error) {
    console.error('❌ MongoDB test failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Test completed, connection closed');
  }
};

testMongoDB();