import {inject,onMounted,onUnmounted} from './vue/vue.js';

function makeDroppable(id, domRef){
    // whoAmI is like a selection: ID+Dom Element Ref
    const addDroppableElement = inject("addDroppableElement");
    const removeDroppableElement = inject("removeDroppableElement");

    let isOver = false;
    

    onMounted(()=>{
        addDroppableElement(id,domRef);
    });

    onUnmounted(()=>{
        removeDroppableElement(id);
    });

    return {isOver};
}

export {makeDroppable};
