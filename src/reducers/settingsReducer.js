// reducers/settingsReducer.js
const initialState = {
    fetchImages: false,
  };
  
  const settingsReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'TOGGLE_FETCH_IMAGES':
        return {
          ...state,
          fetchImages: !state.fetchImages,
        };
      default:
        return state;
    }
  };
  
  export default settingsReducer;
  