import React, { useReducer } from 'react';

export const WordsContext = React.createContext();

// const initialState = { firstLang: null, secondLang: null, words: [] };
const initialState = {
	firstLang: 'en',
	secondLang: 'pl',
	words: [
		{
			word: 'desktop',
			translations: ['pulpit'],
			createAt: '2020-07-24T08:52:27.644Z',
			acknowledges: [],
			known: false,
		},
		{
			word: 'close',
			translations: ['zamknij'],
			createAt: '2020-07-24T08:52:48.780Z',
			acknowledges: [],
			known: false,
		},
	],
};

const reducer = (state, action) => {
	switch (action.type) {
		case 'ADD_WORD': {
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
		case 'ACKNOWLEDGE_WORD': {
			const { id } = action.payload;
			const updatedWords = [...state.words];
			const idx = updatedWords.findIndex((x) => x.id === id);
			updatedWords[idx] = {
				...updatedWords[idx],
				acknowledges: updatedWords[idx].acknowledges.concat(new Date()),
			};

			return { ...state, words: updatedWords };
		}
		case 'MARK_AS_KNOWN': {
			const { id } = action.payload;
			const updatedWords = [...state.words];
			const idx = updatedWords.findIndex((x) => x.id === id);
			updatedWords[idx] = {
				...updatedWords[idx],
				known: true,
			};

			return { ...state, words: updatedWords };
		}
		case 'UPDATE_WORD': {
			const { word } = action.payload;
			const updatedWords = [...state.words];
			const idx = updatedWords.findIndex((x) => x.id === word.id);
			updatedWords[idx] = { ...word };
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
