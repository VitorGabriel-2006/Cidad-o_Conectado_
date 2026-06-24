const SENSITIVE_WORDS = [
  'palavrão', 'idiota', 'golpe', 'fraude', 'vagabundo', 'merda', 'lixo', 'imundo'
];

export function moderateText(text: string): string {
  let moderatedText = text;
  SENSITIVE_WORDS.forEach(word => {
    // Busca insensitive case para palavras inteiras
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    moderatedText = moderatedText.replace(regex, '***');
  });
  return moderatedText;
}
