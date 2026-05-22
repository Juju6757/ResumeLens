export const computeMatchScore = (candidateSkills = [], jobSkills = []) => {
  if (!jobSkills || jobSkills.length === 0) return 100;
  if (!candidateSkills || candidateSkills.length === 0) return 0;

  const candidateSkillsLower = candidateSkills.map(s => s.toLowerCase().trim());
  const jobSkillsLower = jobSkills.map(s => s.toLowerCase().trim());

  let matchCount = 0;
  
  for (const skill of jobSkillsLower) {
    if (candidateSkillsLower.includes(skill)) {
      matchCount++;
    } else {
      // Partial matching
      const isPartialMatch = candidateSkillsLower.some(cSkill => cSkill.includes(skill) || skill.includes(cSkill));
      if (isPartialMatch) {
        matchCount += 0.5;
      }
    }
  }

  const score = Math.round((matchCount / jobSkillsLower.length) * 100);
  return Math.min(score, 100);
};
