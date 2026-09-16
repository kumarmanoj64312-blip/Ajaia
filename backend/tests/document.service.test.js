const { connect, closeDatabase, clearDatabase } = require('./testDb');
const documentService = require('../src/services/document.service');
const User = require('../src/models/User.model');

jest.setTimeout(30000);

let user;

beforeAll(async () => {
  await connect();
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

beforeEach(async () => {
  const passwordHash = await User.hashPassword('password123');
  user = await User.create({ name: 'Alice', email: 'alice@test.com', passwordHash });
});

describe('document.service', () => {
  test('createDocument defaults to "Untitled document" and empty content', async () => {
    const doc = await documentService.createDocument({ ownerId: user._id });

    expect(doc.title).toBe('Untitled document');
    expect(doc.content).toEqual({ type: 'doc', content: [{ type: 'paragraph' }] });
    expect(doc.permission).toBe('owner');
  });

  test('renameDocument updates the title', async () => {
    const doc = await documentService.createDocument({ ownerId: user._id, title: 'Draft' });
    const docModel = await require('../src/models/Document.model').findById(doc.id);

    const renamed = await documentService.renameDocument(docModel, 'Final Report', user._id);

    expect(renamed.title).toBe('Final Report');
  });

  test('updateContent persists TipTap JSON content', async () => {
    const doc = await documentService.createDocument({ ownerId: user._id });
    const docModel = await require('../src/models/Document.model').findById(doc.id);

    const newContent = {
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hello', marks: [{ type: 'bold' }] }] }],
    };
    const updated = await documentService.updateContent(docModel, newContent, user._id);

    expect(updated.content).toEqual(newContent);
  });

  test('listForUser separates owned documents from shared ones', async () => {
    const bobHash = await User.hashPassword('password123');
    const bob = await User.create({ name: 'Bob', email: 'bob@test.com', passwordHash: bobHash });

    await documentService.createDocument({ ownerId: user._id, title: 'Alice Doc' });

    const Document = require('../src/models/Document.model');
    await Document.create({
      owner: bob._id,
      title: 'Shared with Alice',
      sharedWith: [{ user: user._id, permission: 'view' }],
    });

    const result = await documentService.listForUser(user._id);

    expect(result.owned).toHaveLength(1);
    expect(result.owned[0].title).toBe('Alice Doc');
    expect(result.shared).toHaveLength(1);
    expect(result.shared[0].title).toBe('Shared with Alice');
    expect(result.shared[0].permission).toBe('view');
  });
});
