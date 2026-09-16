import axiosClient from './axiosClient';

export async function shareDocument(documentId, email, permission) {
  const res = await axiosClient.post(`/documents/${documentId}/shares`, { email, permission });
  return res.data.data;
}

export async function revokeShare(documentId, userId) {
  const res = await axiosClient.delete(`/documents/${documentId}/shares/${userId}`);
  return res.data.data;
}
