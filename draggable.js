import {inject,  ref, computed, onMounted, onUnmounted} from './vue/vue.js';



const draggable = {
    name:"drag-draggable",
    props:{
        id:String
    },
    setup: function(props, context){
        const domDraggable = ref(null);

        // register as draggable 
        const addDraggableElement = inject("addDraggableElement");
        const removeDraggableElement = inject("removeDraggableElement");

        onMounted(()=>{
            addDraggableElement(props.id,domDraggable);
        });
    
        onUnmounted(()=>{
            removeDraggableElement(props.id);
        });

        const isDragging = inject("isDragging");

        const diffToDownPoint = inject("diffToDownPoint");
        
        // allow setting selection for this element
        const setSelection = inject("setSelection");
        const selection = inject("selectedElement");

        const mousedown = function(e){
            console.log("setSelection");
            setSelection(props.id,domDraggable);
        };

        // provide the transform properties
        const styleTransform = computed(function(){
            let transformValue = "translate("+0+"px,"+ 0 +"px)";
            if(selection.value === props.id){ //if this element is selected
                transformValue = "translate("+diffToDownPoint.value.x+"px,"+ diffToDownPoint.value.y +"px)";
            }

            return {
                "transform":transformValue
            };
         });

        const styleDefault = {
            "user-select":"none"
        }

        return {
            domDraggable, //to set the ref in the template
            isDragging,
            styleTransform,
            styleDefault,
            mousedown, //event handler for selection
        };
    },
    template:`
        <div ref="domDraggable" @mousedown="mousedown" :style="[styleDefault,styleTransform]"><slot></slot>{{isDragging}} {{styleTransform.transform}}</div>`

}

export {draggable};
