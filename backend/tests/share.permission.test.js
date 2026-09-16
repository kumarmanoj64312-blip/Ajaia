const request = require('supertest');
const app = require('../app');
const { connect, closeDatabase, clearDatabase } = require('./testDb');

jest.setTimeout(30000);

beforeAll(async () => {
  await connect();
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

async function registerUser(name, email) {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ name, email, password: 'password123' });
  return { token: res.body.data.token, user: res.body.data.user };
}

describe('document sharing & permissions', () => {
  test('owner has full access; unrelated user is forbidden; shared user gets scoped access', async () => {
    const alice = await registerUser('Alice', 'alice@test.com');
    const bob = await registerUser('Bob', 'bob@test.com');
    const carol = await registerUser('Carol', 'carol@test.com');

    const createRes = await request(app)
      .post('/api/documents')
      .set('Authorization', `Bearer ${alice.token}`)
      .send({ title: 'Roadmap' });
    expect(createRes.status).toBe(201);
    const docId = createRes.body.data.id;

    // Unrelated user cannot read the document at all.
    const carolRead = await request(app)
      .get(`/api/documents/${docId}`)
      .set('Authorization', `Bearer ${carol.token}`);
    expect(carolRead.status).toBe(403);

    // Owner shares with Bob as view-only.
    const shareRes = await request(app)
      .post(`/api/documents/${docId}/shares`)
      .set('Authorization', `Bearer ${alice.token}`)
      .send({ email: 'bob@test.com', permission: 'view' });
    expect(shareRes.status).toBe(200);

    // Bob can now read it, and his permission is reported as "view".
    const bobRead = await request(app)
      .get(`/api/documents/${docId}`)
      .set('Authorization', `Bearer ${bob.token}`);
    expect(bobRead.status).toBe(200);
    expect(bobRead.body.data.permission).toBe('view');

    // But a view-only collaborator cannot mutate content.
    const bobEditAttempt = await request(app)
      .patch(`/api/documents/${docId}/content`)
      .set('Authorization', `Bearer ${bob.token}`)
      .send({ content: { type: 'doc', content: [{ type: 'paragraph' }] } });
    expect(bobEditAttempt.status).toBe(403);

    // Nor can Bob rename or delete — those are owner-only regardless of share level.
    const bobRenameAttempt = await request(app)
      .patch(`/api/documents/${docId}/title`)
      .set('Authorization', `Bearer ${bob.token}`)
      .send({ title: 'Hijacked title' });
    expect(bobRenameAttempt.status).toBe(403);

    // Owner upgrades Bob to "edit" — now content mutation succeeds.
    await request(app)
      .post(`/api/documents/${docId}/shares`)
      .set('Authorization', `Bearer ${alice.token}`)
      .send({ email: 'bob@test.com', permission: 'edit' });

    const bobEditNow = await request(app)
      .patch(`/api/documents/${docId}/content`)
      .set('Authorization', `Bearer ${bob.token}`)
      .send({ content: { type: 'doc', content: [{ type: 'paragraph' }] } });
    expect(bobEditNow.status).toBe(200);

    // Revoking access locks Bob out again.
    await request(app)
      .delete(`/api/documents/${docId}/shares/${bob.user.id}`)
      .set('Authorization', `Bearer ${alice.token}`);

    const bobAfterRevoke = await request(app)
      .get(`/api/documents/${docId}`)
      .set('Authorization', `Bearer ${bob.token}`);
    expect(bobAfterRevoke.status).toBe(403);
  });

  test('requests without a valid token are rejected', async () => {
    const res = await request(app).get('/api/documents');
    expect(res.status).toBe(401);
  });
});
