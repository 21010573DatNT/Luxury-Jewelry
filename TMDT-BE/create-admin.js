// Script to create an admin account
require('dotenv').config();
const mongoose = require('mongoose');
const md5 = require('md5');
const Account = require('./api/v1/models/account.model');
const Role = require('./api/v1/models/role.model');
const db = require('./config/database');

async function createAdminAccount() {
    await db.connect();

    // Find or create admin role
    let adminRole = await Role.findOne({ title: 'admin' });
    if (!adminRole) {
        adminRole = await Role.create({
            title: 'admin',
            description: 'Administrator',
            permissions: ['*'],
        });
        console.log('Admin role created.');
    }

    const email = 'admin@example.com';
    const password = 'admin123';
    const fullName = 'Admin';

    // Check if admin account exists
    let admin = await Account.findOne({ email });
    if (admin) {
        console.log('Admin account already exists.');
        process.exit(0);
    }

    const hashedPassword = md5(String(password || ''));

    await Account.create({
        fullName,
        email,
        password: hashedPassword,
        role_id: adminRole._id.toString(),
        role_name: adminRole.title,
        status: 'active',
    });

    console.log('Admin account created successfully!');
    process.exit(0);
}

createAdminAccount().catch((err) => {
    console.error(err);
    process.exit(1);
});
