import {inject,  ref, computed} from './vue/vue.js';



const draggable = {
    name:"drag-draggable",
    props:{
        id:String
    },
    setup: function(props, context){
        const domDraggable = ref(null);
        
        const isDragging = inject("isDragging");

        const diffToDownPoint = inject("diffToDownPoint");
        
        // allow setting selection for this element
        const setSelection = inject("setSelection");

        const mousedown = function(e){
            setSelection({
                "id":props.id,
                "domRef":domDraggable
            });
        };

        // provide the transform properties
        const styleTransform = computed(function(){
            return {
                "transform":"translate("+diffToDownPoint.value.x+"px,"+ diffToDownPoint.value.y +"px)"
            }
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
