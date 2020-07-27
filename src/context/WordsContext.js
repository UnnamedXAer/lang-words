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
};

export const WordsContextActions = {
	ADD_WORD: 'ADD_WORD',
	ACKNOWLEDGE_WORD: 'ACKNOWLEDGE_WORD',
	MARK_AS_KNOWN: 'MARK_AS_KNOWN',
	UPDATE_WORD: 'UPDATE_WORD',
	DELETE_WORD: 'DELETE_WORD',
};

const reducer = (state, action) => {
	switch (action.type) {
		case WordsContextActions['ADD_WORD']: {
			const { word, translations, id } = action.payload;
			const updatedWords = state.words.concat({
				id,
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
		case WordsContextActions['MARK_AS_KNOWN']: {
			const { id } = action.payload;
			const updatedWords = [...state.words];
			const idx = updatedWords.findIndex((x) => x.id === id);
			updatedWords[idx] = {
				...updatedWords[idx],
				known: true,
			};

			return { ...state, words: updatedWords };
		}
		case WordsContextActions['UPDATE_WORD']: {
			const { word } = action.payload;
			const updatedWords = [...state.words];
			const idx = updatedWords.findIndex((x) => x.id === word.id);
			updatedWords[idx] = { ...word };
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
