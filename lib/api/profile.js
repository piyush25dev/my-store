export async function getUserProfile() {
  const response = await fetch('/api/profile');
  const data = await response.json();
 
  if (response.status === 401) return null;
  if (!response.ok) throw new Error(data.error);
 
  return data.profile;
}
 
export async function updateUserProfile(updates) {
  const response = await fetch('/api/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
 
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
 
  return data.profile;
}