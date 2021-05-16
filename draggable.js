import {ref} from './vue/vue.js';
import {makeDraggable} from './makeDraggable.js';makeDraggable

const draggable = {
    name:"drag-draggable",
    props:{
        id:String
    },
    setup: function(props, context){
        const domDraggable = ref(null);
        
        const{
            isDragging,
            styleTransform,
            mousedown
        }= makeDraggable(props.id,domDraggable);
       

        const styleDefault = {
            "user-select":"none"
        }

        return {
            domDraggable, //to set the ref in the template
            styleDefault,
            //from hook: 
            isDragging,
            styleTransform,
            mousedown
        };
    },
    template:`
        <div ref="domDraggable" @mousedown="mousedown" :style="[styleDefault,styleTransform]"><slot></slot></div>`

}

export {draggable};
