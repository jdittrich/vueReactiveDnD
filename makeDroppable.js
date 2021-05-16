import {inject,onMounted,onUnmounted} from './vue/vue.js';

function makeDroppable(id, domRef){
    const addDroppableElement = inject("addDroppableElement");
    const removeDroppableElement = inject("removeDroppableElement");

    
    onMounted(()=>{
        addDroppableElement(id,domRef);
    });

    onUnmounted(()=>{
        removeDroppableElement(id);
    });

    return {};
}

export {makeDroppable};
