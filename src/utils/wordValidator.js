export function sanitizeWord(word, translations) {
	const sanitizedWord = sanitizeUntranslatedWord(word);
	const sanitizedTranslations = sanitizeTranslations(translations);
	
	return {
		word: sanitizedWord,
		translations: sanitizedTranslations,
	};
}

const sanitizeUntranslatedWord = (word) => {
	const _word = word.trim();
	if (_word.length === 0) {
		throw new Error('Enter word.');
	}
	return _word;
};

const sanitizeTranslations = (translations) => {
	const newWordTranslations = [];
	for (let i = 0; i < translations.length; i++) {
		const wordTranslation = translations[i].trim();
		if (
			wordTranslation !== '' &&
			newWordTranslations.findIndex(
				(x) => x.toLowerCase() === wordTranslation.toLowerCase()
			) === -1
		) {
			newWordTranslations.push(wordTranslation);
		}
	}

	if (newWordTranslations.length === 0) {
		throw new Error('Enter at least one translation.');
	}

	return newWordTranslations;
};
