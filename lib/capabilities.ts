import { Capabilities, CandidateSkill } from '@/types';

/**
 * Static capability mapping - skills to capability groups
 * This is presentation logic only, not matching logic
 */
const CAPABILITY_MAP: Record<string, string[]> = {
  'Frontend': [
    'Angular', 'React', 'Next.js', 'Vue', 'Vue.js', 'Svelte', 'TypeScript',
    'JavaScript', 'HTML', 'CSS', 'Tailwind', 'SASS', 'Redux', 'GraphQL Client',
    'React Native', 'Flutter', 'Ionic', 'Electron'
  ],
  'Backend': [
    'Node.js', 'NestJS', '.NET', 'C#', 'Java', 'Spring', 'Spring Boot',
    'Python', 'Django', 'FastAPI', 'Flask', 'Ruby', 'Rails', 'Ruby on Rails',
    'Go', 'Golang', 'Rust', 'PHP', 'Laravel', 'Express', 'Koa', 'GraphQL'
  ],
  'Infrastructure': [
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'DynamoDB',
    'AWS', 'Azure', 'GCP', 'Google Cloud', 'Docker', 'Kubernetes', 'K8s',
    'Terraform', 'Ansible', 'Jenkins', 'GitHub Actions', 'CI/CD', 'Linux',
    'Nginx', 'Apache', 'Vercel', 'Netlify', 'Heroku'
  ],
  'Practices': [
    'System Design', 'APIs', 'REST', 'REST APIs', 'Microservices',
    'Payments', 'Stripe', 'Security', 'OAuth', 'Authentication',
    'Testing', 'TDD', 'Agile', 'Scrum', 'DevOps', 'Architecture',
    'Performance', 'Optimization', 'Monitoring', 'Observability'
  ],
  'Data & AI': [
    'Machine Learning', 'ML', 'AI', 'Data Science', 'TensorFlow', 'PyTorch',
    'Pandas', 'NumPy', 'Data Engineering', 'ETL', 'Apache Spark', 'Kafka',
    'Data Analysis', 'SQL', 'BigQuery', 'Snowflake', 'dbt'
  ],
  'Mobile': [
    'iOS', 'Swift', 'SwiftUI', 'Android', 'Kotlin', 'React Native', 'Flutter',
    'Mobile Development', 'Objective-C', 'Xamarin'
  ]
};

/**
 * Derive capabilities from raw skills
 * Used as fallback if backend doesn't provide capabilities
 */
export function deriveCapabilities(skills: CandidateSkill[] | string[]): Capabilities {
  const capabilities: Capabilities = {};

  // Normalize skills to string array
  const skillNames = skills.map(s =>
    typeof s === 'string' ? s : s.skillName
  );

  // Assign each skill to at most one capability group
  const assignedSkills = new Set<string>();

  for (const [capability, mappedSkills] of Object.entries(CAPABILITY_MAP)) {
    const matchingSkills: string[] = [];

    for (const skill of skillNames) {
      if (assignedSkills.has(skill.toLowerCase())) continue;

      // Check if skill matches any in this capability (case-insensitive)
      const isMatch = mappedSkills.some(mapped =>
        mapped.toLowerCase() === skill.toLowerCase() ||
        skill.toLowerCase().includes(mapped.toLowerCase()) ||
        mapped.toLowerCase().includes(skill.toLowerCase())
      );

      if (isMatch) {
        matchingSkills.push(skill);
        assignedSkills.add(skill.toLowerCase());
      }
    }

    if (matchingSkills.length > 0) {
      capabilities[capability] = matchingSkills;
    }
  }

  return capabilities;
}

/**
 * Check if capabilities object has any skills
 */
export function hasCapabilities(capabilities: Capabilities | undefined): boolean {
  if (!capabilities) return false;
  return Object.values(capabilities).some(skills => skills.length > 0);
}

/**
 * Get capability group order for consistent display
 */
export function getCapabilityOrder(): string[] {
  return ['Frontend', 'Backend', 'Infrastructure', 'Practices', 'Data & AI', 'Mobile'];
}
