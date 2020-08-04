import React, { useReducer } from 'react';

export const WordsContext = React.createContext();
const wordsSortFunc = (words) => words.sort((a, b) => a.createAt - b.createAt);

export const wordsExample = [
	{
		id: '3452345234sdfdsgf1',
		word: 'desktop',
		translations: ['pulpit', 'komputer stacjonarny'],
		createAt: new Date('2020-07-24T08:52:27.644Z'),
		lastAcknowledge: null,
		acknowledgesCnt: 0,
		collapse: false,
		known: false,
	},
	{
		id: '3452345234sdfdsgf2',
		word: 'close',
		translations: ['zamknij', 'blisko', 'ściśle'],
		createAt: new Date('2020-07-24T08:52:48.780Z'),
		lastAcknowledge: null,
		acknowledgesCnt: 0,
		collapse: false,
		known: false,
	},
	{
		id: '3452345234sdfdsgf3',
		word: 'browser',
		translations: ['przeglądarka'],
		createAt: new Date('2020-07-31T08:20:24.313Z'),
		lastAcknowledge: null,
		acknowledgesCnt: 0,
		collapse: false,
		known: false,
	},
	{
		id: '3452345234sdfdsgf4d',
		word: 'expression',
		translations: [],
		createAt: new Date('2020-07-24T08:52:48.780Z'),
		lastAcknowledge: null,
		acknowledgesCnt: 0,
		collapse: false,
		known: false,
	},
	{
		id: '3452345234sdfdsgf2c',
		word: 'close',
		translations: ['zamknij', 'blisko', 'ściśle'],
		createAt: new Date('2020-07-24T08:51:42.780Z'),
		lastAcknowledge: null,
		acknowledgesCnt: 0,
		collapse: false,
		known: false,
	},
	{
		id: '3452345234sdfdsgf3b',
		word: 'browser',
		translations: ['przeglądarka'],
		createAt: new Date('2020-07-24T08:52:48.780Z'),
		lastAcknowledge: new Date('2020-07-24T11:52:48.780Z'),
		acknowledgesCnt: 1,
		collapse: false,
		known: false,
	},
	{
		id: '3452345234sdfdsgf4a',
		word: 'expression',
		translations: [],
		createAt: new Date('2020-07-24T01:12:15.780Z'),
		lastAcknowledge: null,
		acknowledgesCnt: 0,
		collapse: false,
		known: false,
	},
];

const initialState = {
	firstLang: 'en',
	secondLang: 'pl',
	fetchingWords: false,
	words: [],
	knownWords: [],
	wordsMarkedAsNew: {},
	wordsMarkedAsDeleted: {},
};

export const WordsContextActions = {
	FETCH_WORDS_START: 'WORDS_FETCH_WORDS_START',
	FETCH_WORDS_FINISH: 'WORDS_FETCH_WORDS_FINISH',
	ADD_WORD: 'WORDS_ADD_WORD',
	ACKNOWLEDGE_WORD: 'WORDS_ACKNOWLEDGE_WORD',
	MARK_AS_KNOWN_START: 'WORDS_MARK_AS_KNOWN_START',
	MARK_AS_KNOWN: 'WORDS_MARK_AS_KNOWN',
	UPDATE_WORD: 'WORDS_UPDATE_WORD',
	DELETE_WORD_START: 'WORDS_DELETE_WORD_START',
	DELETE_WORD: 'WORDS_DELETE_WORD',
	SET_MARKED_AS_NEW: 'WORDS_SET_MARKED_AS_NEW',
};

const reducer = (state, action) => {
	switch (action.type) {
		case WordsContextActions['FETCH_WORDS_START']: {
			return { ...state, fetchingWords: true };
		}
		case WordsContextActions['FETCH_WORDS_FINISH']: {
			const sortedWords = wordsSortFunc(action.payload.words);
			return {
				...state,
				fetchingWords: false,
				words: sortedWords,
			};
		}
		case WordsContextActions['ADD_WORD']: {
			const { word } = action.payload;
			const updatedWords = [{ ...word }].concat(state.words);
			const updatedWordsMarkedAsNew = {
				...state.wordsMarkedAsNew,
				[word.id]: true,
			};

			return {
				...state,
				words: updatedWords,
				wordsMarkedAsNew: updatedWordsMarkedAsNew,
			};
		}
		case WordsContextActions['ACKNOWLEDGE_WORD']: {
			const { id } = action.payload;
			const updatedWords = [...state.words];
			const idx = updatedWords.findIndex((x) => x.id === id);
			updatedWords[idx] = {
				...updatedWords[idx],
				lastAcknowledge: new Date(),
				acknowledgesCnt: updatedWords[idx].acknowledgesCnt + 1,
				collapse: true,
			};

			return { ...state, words: updatedWords };
		}
		case WordsContextActions['MARK_AS_KNOWN_START']: {
			const { id } = action.payload;
			const updatedWords = [...state.words];
			const idx = updatedWords.findIndex((x) => x.id === id);
			updatedWords[idx] = {
				...updatedWords[idx],
				lastAcknowledge: new Date(),
				acknowledgesCnt: updatedWords[idx].acknowledgesCnt + 1,
				collapse: true,
				known: true,
			};

			return { ...state, words: updatedWords };
		}
		case WordsContextActions['MARK_AS_KNOWN']: {
			const { id } = action.payload;
			const idx = state.words.findIndex((x) => x.id === id);
			const updatedKnownWords = [...state.knownWords];
			const updatedWords = [...state.words];
			if (idx > -1) {
				const word = state.words[idx];
				updatedKnownWords.push(word);
				updatedWords.splice(idx, 1);
			}

			return { ...state, words: updatedWords, knownWords: updatedKnownWords };
		}
		case WordsContextActions['UPDATE_WORD']: {
			const { word, translations, id } = action.payload;
			const updatedWords = [...state.words];
			const idx = updatedWords.findIndex((x) => x.id === id);
			updatedWords[idx] = {
				...updatedWords[idx],
				word,
				translations: [...translations],
			};

			return { ...state, words: updatedWords };
		}
		case WordsContextActions['DELETE_WORD_START']: {
			const { id } = action.payload;
			const updatedWords = [...state.words];
			const idx = updatedWords.findIndex((x) => x.id === id);
			updatedWords[idx] = {
				...updatedWords[idx],
				collapse: true,
			};
			const updatedWordsMarkedAsDeleted = {
				...state.wordsMarkedAsDeleted,
				[id]: true,
			};

			return {
				...state,
				words: updatedWords,
				wordsMarkedAsDeleted: updatedWordsMarkedAsDeleted,
			};
		}
		case WordsContextActions['DELETE_WORD']: {
			const { id } = action.payload;
			const updatedWords = state.words.filter((x) => x.id !== id);
			return { ...state, words: updatedWords };
		}
		case WordsContextActions['SET_MARKED_AS_NEW']: {
			const { id, isNew } = action.payload;
			const updatedWordsMarkedAsNew = { ...state.wordsMarkedAsNew, [id]: isNew };

			return {
				...state,
				wordsMarkedAsNew: updatedWordsMarkedAsNew,
			};
		}
		default:
			return state;
	}
};

const WordsContextProvider = (props) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	return (
		<WordsContext.Provider value={[state, dispatch]}>
			{props.children}
		</WordsContext.Provider>
	);
};

export default WordsContextProvider;
