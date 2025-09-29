const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Conversation = require('../models/Conversation');

class DataMigration {
  constructor() {
    this.dataFile = path.join(__dirname, '..', 'data', 'conversations.json');
  }

  async connectToMongoDB() {
    try {
      const mongooseOptions = {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4
      };

      await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
      console.log('📦 Connected to MongoDB for migration');
      return true;
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error.message);
      return false;
    }
  }

  loadFileData() {
    try {
      if (fs.existsSync(this.dataFile)) {
        const data = fs.readFileSync(this.dataFile, 'utf8');
        const conversations = JSON.parse(data);
        console.log(`📁 Found ${conversations.length} conversations in file storage`);
        return conversations;
      } else {
        console.log('📁 No file storage data found');
        return [];
      }
    } catch (error) {
      console.error('❌ Error reading file storage:', error.message);
      return [];
    }
  }

  async migrateToMongoDB(conversations) {
    let migrated = 0;
    let errors = 0;

    for (const conv of conversations) {
      try {
        // Check if conversation already exists in MongoDB
        const existing = await Conversation.findOne({ 
          sessionId: conv.sessionId,
          createdAt: conv.createdAt 
        });

        if (!existing) {
          // Create new conversation in MongoDB
          const newConv = new Conversation({
            title: conv.title,
            messages: conv.messages.map(msg => ({
              role: msg.role,
              content: msg.content,
              timestamp: msg.timestamp || new Date(conv.createdAt)
            })),
            sessionId: conv.sessionId,
            tags: conv.tags || [],
            createdAt: new Date(conv.createdAt),
            updatedAt: new Date(conv.updatedAt)
          });

          await newConv.save();
          migrated++;
          console.log(`✅ Migrated conversation: ${conv.title.substring(0, 50)}...`);
        } else {
          console.log(`⏭️  Skipped existing conversation: ${conv.title.substring(0, 50)}...`);
        }
      } catch (error) {
        errors++;
        console.error(`❌ Failed to migrate conversation "${conv.title}":`, error.message);
      }
    }

    return { migrated, errors };
  }

  async createBackup() {
    const backupFile = path.join(__dirname, '..', 'data', `conversations_backup_${Date.now()}.json`);
    
    try {
      if (fs.existsSync(this.dataFile)) {
        fs.copyFileSync(this.dataFile, backupFile);
        console.log(`💾 Created backup: ${backupFile}`);
        return true;
      }
    } catch (error) {
      console.error('❌ Failed to create backup:', error.message);
      return false;
    }
  }

  async run() {
    console.log('🚀 Starting data migration from file storage to MongoDB...\n');

    // Connect to MongoDB
    const connected = await this.connectToMongoDB();
    if (!connected) {
      console.log('❌ Cannot proceed without MongoDB connection');
      process.exit(1);
    }

    // Load file data
    const conversations = this.loadFileData();
    if (conversations.length === 0) {
      console.log('✅ No data to migrate. Migration complete.');
      process.exit(0);
    }

    // Create backup
    await this.createBackup();

    // Migrate data
    console.log(`\n🔄 Migrating ${conversations.length} conversations...\n`);
    const result = await this.migrateToMongoDB(conversations);

    // Summary
    console.log('\n📊 Migration Summary:');
    console.log(`✅ Successfully migrated: ${result.migrated} conversations`);
    console.log(`❌ Errors: ${result.errors} conversations`);
    console.log(`📊 Total processed: ${conversations.length} conversations`);

    if (result.migrated > 0) {
      console.log('\n🎉 Migration completed successfully!');
      console.log('💡 You can now safely delete the file storage data or keep it as backup.');
    }

    // Close connection
    await mongoose.connection.close();
    console.log('\n👋 MongoDB connection closed');
  }
}

// Run migration if called directly
if (require.main === module) {
  const migration = new DataMigration();
  migration.run().catch(console.error);
}

module.exports = DataMigration;