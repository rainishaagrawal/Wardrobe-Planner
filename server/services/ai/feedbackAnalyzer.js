const extractAttributes = (outfit) => {
  const attrs = [];
  if (!outfit || !outfit.items) return attrs;

  for (const item of outfit.items) {
    if (item.primaryColor) attrs.push({ type: 'colors', value: item.primaryColor });
    if (item.fit) attrs.push({ type: 'fits', value: item.fit });
    if (item.pattern) attrs.push({ type: 'patterns', value: item.pattern });
    if (item.material) attrs.push({ type: 'materials', value: item.material });
    if (item.aesthetics && Array.isArray(item.aesthetics)) {
      item.aesthetics.forEach(a => attrs.push({ type: 'aesthetics', value: a }));
    }
  }

  // Deduplicate
  const unique = [];
  const seen = new Set();
  for (const a of attrs) {
    const key = `${a.type}:${a.value}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(a);
    }
  }

  return unique;
};

module.exports = { extractAttributes };
