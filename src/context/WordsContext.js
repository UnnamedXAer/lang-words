import React, { useReducer } from 'react';

export const WordsContext = React.createContext();

export const wordsSortFunc = (a, b) =>
	(a.lastAcknowledgeAt || a.createAt) - (b.lastAcknowledgeAt || b.createAt);

const initialState = {
	firstLang: 'en',
	secondLang: 'pl',
	fetchingWords: false,
	fetchingKnownWords: false,
	wordsFetched: false,
	knownWordsFetched: false,
	words: [],
	knownWords: [],
	wordsMarkedAsNew: {},
	wordsMarkedAsDeleted: {},
};

export const WordsContextActions = {
	FETCH_WORDS_START: 'WORDS_FETCH_WORDS_START',
	FETCH_WORDS_FINISH: 'WORDS_FETCH_WORDS_FINISH',
	FETCH_KNOWN_WORDS_START: 'WORDS_FETCH_KNOWN_WORDS_START',
	FETCH_KNOWN_WORDS_FINISH: 'WORDS_FETCH_KNOWN_WORDS_FINISH',
	ADD_WORD: 'WORDS_ADD_WORD',
	ACKNOWLEDGE_WORD: 'WORDS_ACKNOWLEDGE_WORD',
	MARK_AS_KNOWN_START: 'WORDS_MARK_AS_KNOWN_START',
	MARK_AS_KNOWN: 'WORDS_MARK_AS_KNOWN',
	UN_MARK_WORD_START: 'WORDS_UN_MARK_WORD_START',
	UN_MARK_WORD: 'WORDS_UN_MARK_WORD',
	UPDATE_WORD: 'WORDS_UPDATE_WORD',
	DELETE_WORD_START: 'WORDS_DELETE_WORD_START',
	DELETE_WORD: 'WORDS_DELETE_WORD',
	SET_MARKED_AS_NEW: 'WORDS_SET_MARKED_AS_NEW',
	TRIGGER_REFRESH: 'WORDS_TRIGGER_REFRESH',
	CLEAR_STATE: 'WORDS_CLEAR_STATE'
};

const reducer = (state, action) => {
	switch (action.type) {
		case WordsContextActions['FETCH_WORDS_START']: {
			return { ...state, fetchingWords: true, wordsFetched: true };
		}
		case WordsContextActions['FETCH_WORDS_FINISH']: {
			return {
				...state,
				fetchingWords: false,
				words: action.payload.words,
			};
		}
		case WordsContextActions['FETCH_KNOWN_WORDS_START']: {
			return { ...state, fetchingKnownWords: true, knownWordsFetched: true };
		}
		case WordsContextActions['FETCH_KNOWN_WORDS_FINISH']: {
			return {
				...state,
				fetchingKnownWords: false,
				knownWords: action.payload.words,
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
			if (idx > -1) {
				updatedWords[idx] = {
					...updatedWords[idx],
					lastAcknowledgeAt: new Date(),
					acknowledgesCnt: updatedWords[idx].acknowledgesCnt + 1,
					collapse: true,
				};
			}
			return { ...state, words: updatedWords };
		}
		case WordsContextActions['MARK_AS_KNOWN_START']: {
			const { id } = action.payload;
			const updatedWords = [...state.words];
			const idx = updatedWords.findIndex((x) => x.id === id);
			if (idx > -1) {
				updatedWords[idx] = {
					...updatedWords[idx],
					lastAcknowledgeAt: new Date(),
					acknowledgesCnt: updatedWords[idx].acknowledgesCnt + 1,
					collapse: true,
					known: true,
				};
			}

			return { ...state, words: updatedWords };
		}
		case WordsContextActions['MARK_AS_KNOWN']: {
			const { id } = action.payload;
			const idx = state.words.findIndex((x) => x.id === id);
			const updatedKnownWords = [...state.knownWords];
			const updatedWords = [...state.words];
			if (idx > -1) {
				const word = { ...state.words[idx], collapse: false, known: true };
				updatedKnownWords.push(word);
				updatedWords.splice(idx, 1);
			}

			return { ...state, words: updatedWords, knownWords: updatedKnownWords };
		}

		case WordsContextActions['UN_MARK_WORD_START']: {
			const { id } = action.payload;
			const updatedKnownWords = [...state.knownWords];
			const idx = updatedKnownWords.findIndex((x) => x.id === id);
			if (idx > -1) {
				updatedKnownWords[idx] = {
					...updatedKnownWords[idx],
					collapse: true,
					known: false,
				};
			}

			return { ...state, knownWords: updatedKnownWords };
		}
		case WordsContextActions['UN_MARK_WORD']: {
			const { id } = action.payload;
			const updatedKnownWords = [...state.knownWords];
			const idx = updatedKnownWords.findIndex((x) => x.id === id);
			const updatedWords = [...state.words];
			if (idx > -1) {
				const word = { ...updatedKnownWords[idx], collapse: false };
				updatedKnownWords.splice(idx, 1);
				updatedWords.push(word);
			}

			return { ...state, words: updatedWords, knownWords: updatedKnownWords };
		}

		case WordsContextActions['UPDATE_WORD']: {
			const { word, translations, id } = action.payload;
			const updatedWords = [...state.words];
			const updatedKnownWords = [...state.knownWords];
			const idx = updatedWords.findIndex((x) => x.id === id);
			if (idx > -1) {
				updatedWords[idx] = {
					...updatedWords[idx],
					word,
					translations: [...translations],
				};
			} else {
				const idx = updatedKnownWords.findIndex((x) => x.id === id);
				if (idx > -1) {
					updatedKnownWords[idx] = {
						...updatedKnownWords[idx],
						word,
						translations: [...translations],
					};
				}
			}

			return { ...state, words: updatedWords, knownWords: updatedKnownWords };
		}
		case WordsContextActions['DELETE_WORD_START']: {
			const { id } = action.payload;
			const updatedWords = [...state.words];
			const updatedKnownWords = [...state.knownWords];
			const idx = updatedWords.findIndex((x) => x.id === id);
			if (idx > -1) {
				updatedWords[idx] = {
					...updatedWords[idx],
					collapse: true,
				};
			} else {
				const knownWordsIdx = updatedKnownWords.findIndex((x) => x.id === id);
				if (knownWordsIdx > -1) {
					updatedWords[idx] = {
						...updatedWords[idx],
						collapse: true,
					};
				}
			}
			const updatedWordsMarkedAsDeleted = {
				...state.wordsMarkedAsDeleted,
				[id]: true,
			};

			return {
				...state,
				words: updatedWords,
				knownWords: updatedKnownWords,
				wordsMarkedAsDeleted: updatedWordsMarkedAsDeleted,
			};
		}
		case WordsContextActions['DELETE_WORD']: {
			const { id } = action.payload;
			const updatedWords = state.words.filter((x) => x.id !== id);
			const updatedKnownWords = state.knownWords.filter((x) => x.id !== id);
			return { ...state, words: updatedWords, knownWords: updatedKnownWords };
		}
		case WordsContextActions['SET_MARKED_AS_NEW']: {
			const { id, isNew } = action.payload;
			const updatedWordsMarkedAsNew = { ...state.wordsMarkedAsNew, [id]: isNew };

			return {
				...state,
				wordsMarkedAsNew: updatedWordsMarkedAsNew,
			};
		}
		case WordsContextActions['TRIGGER_REFRESH']: {
			return {
				...state,
				wordsFetched: false,
				knownWordsFetched: false,
			};
		}
		case WordsContextActions['CLEAR_STATE']: {
			return { ...initialState };
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
