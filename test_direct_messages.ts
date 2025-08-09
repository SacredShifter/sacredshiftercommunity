// Test script for DirectMessagesService debugging
// Copy and paste this into your browser console or create a test component

import { directMessagesService, debugDirectMessageInsert } from './src/lib/directMessagesService';

// Simple test function you can call in your app
export async function testDirectMessages() {
  console.log('🧪 Starting Direct Messages Test Suite');
  
  try {
    // Test 1: Check table and policies
    console.log('\n1️⃣ Testing table and policies...');
    const tableCheck = await directMessagesService.checkTableAndPolicies();
    console.log('Table check result:', tableCheck);

    // Test 2: Check user and policies
    console.log('\n2️⃣ Testing user authentication and policies...');
    const userCheck = await directMessagesService.debugUserAndPolicies();
    console.log('User check result:', userCheck);

    // Test 3: Check banned users table
    console.log('\n3️⃣ Testing banned users table...');
    const bannedCheck = await directMessagesService.testBannedUsersTable();
    console.log('Banned users check:', bannedCheck);

    // Test 4: Full insert debug (requires user IDs)
    // You'll need to replace these with actual user IDs from your system
    const currentUser = userCheck.user;
    if (currentUser) {
      console.log('\n4️⃣ Running full insert debug...');
      await debugDirectMessageInsert(currentUser, currentUser); // Send message to self for testing
    } else {
      console.log('\n4️⃣ Skipping insert debug - no authenticated user');
    }

    console.log('\n✅ Test suite completed!');
    
  } catch (error) {
    console.error('❌ Test suite failed:', error);
  }
}

// Quick one-liner for testing - call this in your component
export async function quickTest() {
  const result = await directMessagesService.debugUserAndPolicies();
  console.log('Quick test result:', result);
  return result;
}
