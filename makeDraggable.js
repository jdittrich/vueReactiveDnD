import { inject, computed, onMounted, onUnmounted } from './vue/vue.js';

function makeDraggable(id, domDraggable){
    // register as draggable 
    const addDraggableElement = inject("addDraggableElement");
    const removeDraggableElement = inject("removeDraggableElement");

    onMounted(()=>{
        addDraggableElement(id,domDraggable);
    });

    onUnmounted(()=>{
        removeDraggableElement(id);
    });

    const isDragging = inject("isDragging");

    // allow setting selection for this element
    const setSelection = inject("setSelection");
    const selection = inject("selectedElement");
    
    const mousedown = function(e){
        setSelection(id,domDraggable);
    };
    
    
    
    // provide the transform properties
    
    const diffToDownPoint = inject("diffToDownPoint");
    
    const styleTransform = computed(function(){
        let transformValue = "translate("+0+"px,"+ 0 +"px)";
        if(selection.value === id){ //if this element is selected
            transformValue = "translate("+diffToDownPoint.value.x+"px,"+ diffToDownPoint.value.y +"px)";
        }
        return {
            "transform":transformValue
        };
     });

     return{
        isDragging,
        styleTransform,
        mousedown, //event handler for selection
     };
}

export {makeDraggable};
