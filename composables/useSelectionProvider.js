import {unref, ref} from '../vue/vue.js';

const useSingleSelectionProvider = function () {
    const selectedElement = ref(null);
    
    const setSelectedElement = (id) => {
        selectedElement.value = unref(id); 
        //Note: I dislike the un-refing of ids, but otherwise, it seems to get hard to compare them, 
        //as pure string id, ref-ed id and reactive object id are different things for javascript. 
    };

    const clearSelection = () => selectedElement.value = null;

    return {
        clearSelection,
        setSelectedElement,
        selectedElement
    };
};


export {useSingleSelectionProvider};