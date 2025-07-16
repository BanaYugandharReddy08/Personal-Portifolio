const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

export async function login(email, password) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Failed to login');
  }
  return data;
}

export async function signup(fullName, email, password) {
  const response = await fetch(`${API_BASE_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName, email, password })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Failed to signup');
  }
  return data;
}

export async function fetchCertificates() {
  const response = await fetch(`${API_BASE_URL}/certificates`);
  if (!response.ok) {
    throw new Error('Failed to fetch certificates');
  }
  return response.json();
}

export async function createCertificate(certificate) {
  const response = await fetch(`${API_BASE_URL}/certificates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(certificate)
  });
  if (!response.ok) {
    throw new Error('Failed to create certificate');
  }
  return response.json();
}

export async function updateCertificate(id, certificate) {
  const response = await fetch(`${API_BASE_URL}/certificates/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(certificate)
  });
  if (!response.ok) {
    throw new Error('Failed to update certificate');
  }
  return response.json();
}

export async function deleteCertificate(id) {
  const response = await fetch(`${API_BASE_URL}/certificates/${id}`, {
    method: 'DELETE'
  });
  if (response.status === 204) {
    return true;
  }
  if (!response.ok) {
    throw new Error('Failed to delete certificate');
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

export async function fetchExperiences() {
  const response = await fetch(`${API_BASE_URL}/experiences`);
  if (!response.ok) {
    throw new Error('Failed to fetch experiences');
  }
  return response.json();
}

export async function fetchProjects() {
  const response = await fetch(`${API_BASE_URL}/projects`);
  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }
  return response.json();
}

export async function createLeetcodeProblem(problem) {
  const response = await fetch(`${API_BASE_URL}/leetcode`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(problem)
  });
  if (!response.ok) {
    throw new Error('Failed to create problem');
  }
  return response.json();
}

export async function updateLeetcodeProblem(id, problem) {
  const response = await fetch(`${API_BASE_URL}/leetcode/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(problem)
  });
  if (!response.ok) {
    throw new Error('Failed to update problem');
  }
  return response.json();
}

export async function deleteLeetcodeProblem(id) {
  const response = await fetch(`${API_BASE_URL}/leetcode/${id}`, {
    method: 'DELETE'
  });
  if (response.status === 204) {
    return true;
  }
  if (!response.ok) {
    throw new Error('Failed to delete problem');
  }
  return response.json();
}

export async function createExperience(experience) {
  const response = await fetch(`${API_BASE_URL}/experiences`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(experience)
  });
  if (!response.ok) {
    throw new Error('Failed to create experience');
  }
  return response.json();
}

export async function updateExperience(id, experience) {
  const response = await fetch(`${API_BASE_URL}/experiences/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(experience)
  });
  if (!response.ok) {
    throw new Error('Failed to update experience');
  }
  return response.json();
}

export async function deleteExperience(id) {
  const response = await fetch(`${API_BASE_URL}/experiences/${id}`, {
    method: 'DELETE'
  });
  if (response.status === 204) {
    return true;
  }
  if (!response.ok) {
    throw new Error('Failed to delete experience');
  }
  return response.json();
}

export async function createProject(project) {
  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project)
  });
  if (!response.ok) {
    throw new Error('Failed to create project');
  }
  return response.json();
}

export async function updateProject(id, project) {
  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...project, id })
  });
  if (!response.ok) {
    throw new Error('Failed to update project');
  }
  return response.json();
}

export async function deleteProject(id) {
  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: 'DELETE'
  });
  if (response.status === 204) {
    return true;
  }
  if (!response.ok) {
    throw new Error('Failed to delete project');
  }
  return response.json();
}

export async function fetchDocs() {
  const response = await fetch(`${API_BASE_URL}/documents`);
  if (!response.ok) {
    throw new Error('Failed to fetch documents');
  }
  return response.json();
}

export async function uploadDocument(type, file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/documents/${type}`, {
    method: 'POST',
    body: formData,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Failed to upload document');
  }
  return data;
}

export async function fetchLatestDocument(type) {
  const response = await fetch(`${API_BASE_URL}/documents/${type}`);
  if (!response.ok) {
    return null;
  }
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

export async function uploadProjectReport(id, file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/projects/${id}/report`, {
    method: 'POST',
    body: formData,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Failed to upload project report');
  }
  return data;
}

export async function fetchProjectReport(id) {
  const response = await fetch(`${API_BASE_URL}/projects/${id}/report`);
  if (!response.ok) {
    return null;
  }
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

export async function uploadUserPhoto(id, file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/users/${id}/photo`, {
    method: 'POST',
    body: formData,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Failed to upload photo');
  }
  return data;
}

export async function fetchUserPhoto(id) {
  const response = await fetch(`${API_BASE_URL}/users/${id}/photo`);
  if (!response.ok) {
    return null;
  }
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}
