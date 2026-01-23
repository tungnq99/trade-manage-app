/**
 * Migration Script: Add role field to existing users
 * Run this once to update all existing users with default role
 */

import mongoose from 'mongoose';
import { User } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

async function migrateUserRoles() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trade-manage-app');
        console.log('✅ Connected to MongoDB');

        // Find users without role field
        const usersWithoutRole = await User.find({ role: { $exists: false } });
        console.log(`Found ${usersWithoutRole.length} users without role field`);

        if (usersWithoutRole.length === 0) {
            console.log('✅ All users already have role field. Nothing to migrate.');
            process.exit(0);
        }

        // Update users
        const result = await User.updateMany(
            { role: { $exists: false } },
            { $set: { role: 'user' } }
        );

        console.log(`✅ Updated ${result.modifiedCount} users with default role: 'user'`);

        // Verify migration
        const adminCount = await User.countDocuments({ role: 'admin' });
        const userCount = await User.countDocuments({ role: 'user' });

        console.log('\n📊 Role Distribution:');
        console.log(`   Admin: ${adminCount}`);
        console.log(`   User: ${userCount}`);

        // Close connection
        await mongoose.disconnect();
        console.log('\n✅ Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

// Run migration
migrateUserRoles();
