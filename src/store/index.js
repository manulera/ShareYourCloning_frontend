import { configureStore } from '@reduxjs/toolkit';
import { tg_modalState } from '@teselagen/ui';
import { vectorEditorReducer as VectorEditor, vectorEditorMiddleware } from '@teselagen/ove';
import thunk from 'redux-thunk';
import { reducer as form } from 'redux-form';
import cloningReducer from './cloning';
import primerReducer from './primers';

// const composeEnhancer =
//   (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
//     window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
//       actionsBlacklist: ["HOVEREDANNOTATIONUPDATE", "HOVEREDANNOTATIONCLEAR"],
//       // actionSanitizer,
//       latency: 1000,
//       name: "openVE"
//     })) ||
//   compose;


// Create a store using configureStore
const store = configureStore({
  reducer: {
    form,
    tg_modalState,
    VectorEditor: VectorEditor(),
    cloning: cloningReducer,
    primers: primerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thunk, vectorEditorMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;