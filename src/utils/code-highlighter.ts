import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';

export const SUPPORTED_LANGUAGES = [
  { id: 'plaintext', name: 'Plain Text' },
  { id: 'javascript', name: 'JavaScript' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'python', name: 'Python' },
  { id: 'java', name: 'Java' },
  { id: 'css', name: 'CSS' },
  { id: 'json', name: 'JSON' },
  { id: 'markup', name: 'HTML' },
  { id: 'sql', name: 'SQL' },
  { id: 'bash', name: 'Bash' },
  { id: 'go', name: 'Go' },
  { id: 'rust', name: 'Rust' },
];

export const highlightCode = (code: string, language: string): string => {
  const lang = Prism.languages[language] ? language : 'plaintext';
  try {
    return Prism.highlight(code, Prism.languages[lang], lang);
  } catch {
    return Prism.highlight(code, Prism.languages.plaintext, 'plaintext');
  }
};

export const getLanguageName = (languageId: string): string => {
  const lang = SUPPORTED_LANGUAGES.find((l) => l.id === languageId);
  return lang ? lang.name : 'Plain Text';
};
