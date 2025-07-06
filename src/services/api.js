const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

export async function login(email, password, code) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, code })
  });
  if (!response.ok) {
    throw new Error('Failed to login');
  }
  return response.json();
}

export async function fetchCertificates() {
  const response = await fetch(`${API_BASE_URL}/certificates`);
  if (!response.ok) {
    throw new Error('Failed to fetch certificates');
  }
  return response.json();
}

export async function fetchLeetcodeProblems() {
  const response = await fetch(`${API_BASE_URL}/leetcode`);
  if (!response.ok) {
    throw new Error('Failed to fetch problems');
  }
  return response.json();
}
