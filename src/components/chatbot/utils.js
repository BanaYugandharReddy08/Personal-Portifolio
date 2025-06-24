export function extractKnowledgeBase() {
  const ids = ['about', 'education', 'projects', 'experience', 'skills', 'contact'];
  const data = [];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      const text = el.textContent.replace(/\s+/g, ' ').trim();
      if (text) {
        data.push({ id, text });
      }
    }
  });
  return data;
}

function tokenize(str) {
  return str.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}

export function findBestMatch(question, sections) {
  const qTokens = tokenize(question);
  let best = null;
  let bestScore = 0;

  sections.forEach((sec) => {
    const secTokens = tokenize(sec.text);
    const score = qTokens.reduce(
      (count, token) => (secTokens.includes(token) ? count + 1 : count),
      0
    );
    if (score > bestScore) {
      bestScore = score;
      best = sec;
    }
  });

  return bestScore > 0 ? best : null;
}
