require('dotenv').config();
const mongoose = require('mongoose');
const env = require('../src/config/env');
const User = require('../src/models/User.model');
const Document = require('../src/models/Document.model');

const SEED_USERS = [
  { name: 'Alice Anderson', email: 'alice@test.com', password: 'password123' },
  { name: 'Bob Baker', email: 'bob@test.com', password: 'password123' },
  { name: 'Carol Chen', email: 'carol@test.com', password: 'password123' },
];

function welcomeDoc(ownerName) {
  return {
    type: 'doc',
    content: [
      { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: `Welcome, ${ownerName}!` }] },
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: 'This is your first document. Try making some text ' },
          { type: 'text', text: 'bold', marks: [{ type: 'bold' }] },
          { type: 'text', text: ' or ' },
          { type: 'text', text: 'italic', marks: [{ type: 'italic' }] },
          { type: 'text', text: '.' },
        ],
      },
      {
        type: 'bulletList',
        content: [
          { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Create a new document from the dashboard' }] }] },
          { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Import a .txt or .md file' }] }] },
          { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Share this document with a teammate' }] }] },
        ],
      },
    ],
  };
}

async function run() {
  await mongoose.connect(env.mongoUri);
  console.log('Connected to MongoDB for seeding');

  await Promise.all([User.deleteMany({}), Document.deleteMany({})]);
  console.log('Cleared existing users and documents');

  const users = {};
  for (const seedUser of SEED_USERS) {
    const passwordHash = await User.hashPassword(seedUser.password);
    const user = await User.create({ name: seedUser.name, email: seedUser.email, passwordHash });
    users[seedUser.email] = user;
    console.log(`Created user ${seedUser.email}`);
  }

  await Document.create({
    owner: users['alice@test.com']._id,
    title: 'Welcome to Collab Docs',
    content: welcomeDoc('Alice'),
  });

  const sharedDoc = await Document.create({
    owner: users['alice@test.com']._id,
    title: 'Q3 Planning Notes (shared)',
    content: {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Q3 Planning' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Alice shared this document with Bob so you can see how sharing works.' }] },
      ],
    },
    sharedWith: [{ user: users['bob@test.com']._id, permission: 'edit' }],
  });

  await Document.create({
    owner: users['carol@test.com']._id,
    title: "Carol's Draft",
    content: {
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: "This one belongs only to Carol." }] }],
    },
  });

  console.log(`Seeded ${SEED_USERS.length} users and 3 documents (including shared doc ${sharedDoc._id})`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
