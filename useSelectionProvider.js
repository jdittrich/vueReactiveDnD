import {reactive,unref,ref} from './vue/vue.js';
import {useElementListStore} from './useElementListStore.js';

const useSingleSelectionProvider = function () {
    const {
        elementList: selectableList,
        addElement: addSelectableElement,
        removeElement: removeSelectableElement
    } = useElementListStore();

    const selectedElement = ref(null);
    
    const setSelectedElement = (id) => {
        id = unref(id);

        if(selectableList.get(id)){
           selectedElement.value = id;
        } else {
            throw new Error("id is not among the selectable elements");
        }
    };

    const clearSelection = () => selectedElement.value = null;

    return {
        clearSelection,
        setSelectedElement,
        addSelectableElement,
        removeSelectableElement,
        selectedElement
    };
};


export {useSingleSelectionProvider};