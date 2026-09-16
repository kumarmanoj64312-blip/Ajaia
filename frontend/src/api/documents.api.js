import axiosClient from './axiosClient';

export async function listDocuments() {
  const res = await axiosClient.get('/documents');
  return res.data.data;
}

export async function getDocument(id) {
  const res = await axiosClient.get(`/documents/${id}`);
  return res.data.data;
}

export async function createDocument(title) {
  const res = await axiosClient.post('/documents', title ? { title } : {});
  return res.data.data;
}

export async function renameDocument(id, title) {
  const res = await axiosClient.patch(`/documents/${id}/title`, { title });
  return res.data.data;
}

export async function saveDocumentContent(id, content) {
  const res = await axiosClient.patch(`/documents/${id}/content`, { content });
  return res.data.data;
}

export async function deleteDocument(id) {
  await axiosClient.delete(`/documents/${id}`);
}

export async function importDocument(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await axiosClient.post('/uploads/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data;
}
