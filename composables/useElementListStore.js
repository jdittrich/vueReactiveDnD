import {reactive, unref} from '../vue/vue.js';

const useElementListStore = function(){
    const elementList = reactive(new Map());
    const addElement = (id,domElement) => elementList.set(unref(id),unref(domElement));
    const removeElement = (id) => droppableList.delete(unref(id));

    return {
        elementList,
        addElement,
        removeElement
    };
}

export {useElementListStore};