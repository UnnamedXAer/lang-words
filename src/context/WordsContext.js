import React, { useReducer } from 'react';

export const WordsContext = React.createContext();

// const initialState = { firstLang: null, secondLang: null, words: [] };
const initialState = {
	firstLang: 'en',
	secondLang: 'pl',
	words: [
		{
			id: '3452345234sdfdsgf1',
			word: 'desktop',
			translations: ['pulpit', 'komputer stacjonarny'],
			createAt: '2020-07-24T08:52:27.644Z',
			acknowledges: [],
			collapse: false,
			known: false,
		},
		{
			id: '3452345234sdfdsgf2',
			word: 'close',
			translations: ['zamknij', 'blisko', 'ściśle'],
			createAt: '2020-07-24T08:52:48.780Z',
			acknowledges: [],
			collapse: false,
			known: false,
		},
		{
			id: '3452345234sdfdsgf3',
			word: 'browser',
			translations: ['przeglądarka'],
			createAt: '2020-07-24T08:52:48.780Z',
			acknowledges: [],
			collapse: false,
			known: false,
		},
		{
			id: '3452345234sdfdsgf4',
			word: 'expression',
			translations: [],
			createAt: '2020-07-24T08:52:48.780Z',
			acknowledges: [],
			collapse: false,
			known: false,
		},
	],
	knownWords: [],
};

export const WordsContextActions = {
	ADD_WORD: 'ADD_WORD',
	ACKNOWLEDGE_WORD: 'ACKNOWLEDGE_WORD',
	MARK_AS_KNOWN_START: 'MARK_AS_KNOWN_START',
	MARK_AS_KNOWN: 'MARK_AS_KNOWN',
	UPDATE_WORD: 'UPDATE_WORD',
	DELETE_WORD: 'DELETE_WORD',
};

const reducer = (state, action) => {
	switch (action.type) {
		case WordsContextActions['ADD_WORD']: {
			const { word, translations, id } = action.payload;
			const updatedWords = state.words.concat({
				id: id || Math.round().toString(),
				word,
				translations: [...translations],
				createAt: new Date(),
				acknowledges: [],
				known: false,
			});
			return {
				...state,
				words: updatedWords,
			};
		}
		case WordsContextActions['ACKNOWLEDGE_WORD']: {
			const { id } = action.payload;
			const updatedWords = [...state.words];
			const idx = updatedWords.findIndex((x) => x.id === id);
			updatedWords[idx] = {
				...updatedWords[idx],
				acknowledges: updatedWords[idx].acknowledges.concat(new Date()),
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
			updatedWords[idx] = { ...updatedWords[idx], word, translations };
			return { ...state, words: updatedWords };
		}
		case WordsContextActions['DELETE_WORD']: {
			const { id } = action.payload;
			const updatedWords = state.words.filter((x) => x.id !== id);
			return { ...state, words: updatedWords };
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
