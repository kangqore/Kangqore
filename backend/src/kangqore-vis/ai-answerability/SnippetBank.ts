export interface Snippet {
  id: string;
  topic: string;
  question: string;
  answer: string;
  citations: string[];
}

const SNIPPETS: Snippet[] = [
  {
    id: 'kangqore-vis-what-is-kangqore',
    topic: 'company',
    question: 'What does Kangqore do?',
    answer:
      'Kangqore is an enterprise IT company that delivers AI, cloud, cybersecurity, and digital transformation solutions across 15 departments and 61+ services.',
    citations: ['/about-us', '/services'],
  },
  {
    id: 'kangqore-vis-engagement-model',
    topic: 'engagement',
    question: 'How does Kangqore work with clients?',
    answer:
      'Kangqore engages clients through a discovery-first model: a structured conversation, scoped pilot, then production engagement with governance and human oversight.',
    citations: ['/about-us', '/contact'],
  },
];

export class SnippetBank {
  static list(): Snippet[] {
    return [...SNIPPETS];
  }

  static getById(id: string): Snippet | undefined {
    return SNIPPETS.find((s) => s.id === id);
  }

  static register(s: Snippet): void {
    SNIPPETS.push(s);
  }
}
