const interpretRequest = (requestText) => {
  const context = { occasion: 'casual', mood: null, aesthetic: null };
  if (!requestText) return context;
  
  const text = requestText.toLowerCase();

  if (text.includes('office') || text.includes('date') || text.includes('smart')) context.occasion = 'smartCasual';
  if (text.includes('wedding') || text.includes('formal') || text.includes('suit')) context.occasion = 'formal';
  if (text.includes('college')) context.occasion = 'casual';
  
  if (text.includes('comfort')) context.mood = 'comfortable';
  if (text.includes('bold')) context.mood = 'bold';
  
  if (text.includes('minimal')) context.aesthetic = 'minimal';
  if (text.includes('street')) context.aesthetic = 'streetwear';
  
  return context;
};

module.exports = { interpretRequest };
