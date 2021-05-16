import {provide, computed, reactive, unref, watch} from './vue/vue.js';
import {useDragDiffProvider} from './useDragDiffProvider.js';
import {useSingleSelectionProvider} from './useSelectionProvider.js';
//import {useElementListStore} from './useElementListStore.js'
//import {useDroppableProvider} from './useDroppableProvider.js';
import {findDropTarget} from './collisionHelpers.js';


const dragContext = {
    name: "dragContext",
    props: {
        onDragend: Function
    },
    setup: function (props, context){
        // SELECTION PROVISION
        let {
            selectedElement,
            clearSelection, //currently, we never clear selection, it is just the element you clicked on last. 
            setSelectedElement
        } = useSingleSelectionProvider();

        //these are needed by droppables to set themselves as selected. 
        // (when the drag begins, selected elements are moved. )
        //(currenty, only one element can be selected and thus dragged)
        provide('setSelection', setSelectedElement);
        provide('selectedElement', selectedElement);

        //==DROPPABLE PROVISION==
        // create a reactive map of droppable DOM Elements, accessible by their IDs
        const droppableList = reactive(new Map());
        
        //getter and setter functions which are…
        const addDroppableElement = (id,domElement) => droppableList.set(unref(id),unref(domElement));
        const removeDroppableElement = (id) => droppableList.delete(unref(id));
        //(Note: I dislike the un-ref-ing.)
        
        //…passed to all descendants which inject them
        provide('addDroppableElement', addDroppableElement);
        provide('removeDroppableElement', removeDroppableElement);

        //==DRAGGABLE PROVISION==
        // same as above!
        const draggableList = reactive(new Map());
        const addDraggableElement = (id,domElement) => draggableList.set(unref(id),unref(domElement));
        const removeDraggableElement = (id) => draggableList.delete(unref(id));

        provide('addDraggableElement', addDraggableElement);
        provide('removeDraggableElement', removeDraggableElement);


        //DRAG DIFF PROVISION
        let {
            diffToDownPoint,
            isDragging,
            diffHandlerDown,
            diffHandlerMove,
            diffHandlerUp
        } = useDragDiffProvider(props, context);

        provide('isDragging', isDragging);
        provide('diffToDownPoint', diffToDownPoint);

        /*
        // DOM RECT (will be interesting as soon as we want to show selection)
        const domRect = computed(function () {
            if (selectedElement.value) {
                return draggableList.get(selectedElement.value).getBoundingClientRect();
            } else {
                return null;
            }
        });*/
        
     

        // CALL PROPed EVENT HANDLERS

        //calls onDragend function passed in via Prop (in the demo this is done in app.js), 
        //so the component itself is agnostic towards it. 
        const callDragEndHandler = function(event){   
            if (isDragging.value == true && props.onDragend) {
                let dropTargetId = findDropTarget(draggableList,droppableList, selectedElement);
                props.onDragend(event, selectedElement, dropTargetId);
            }
        };



        // PASS TO TEMPLATE
        return {
            diffHandlerDown,
            diffHandlerMove,
            diffHandlerUp,
            callDragEndHandler,
            diffToDownPoint
        };
    },
    template: `
    <div 
        v-on:mousedown="diffHandlerDown" 
        v-on:mousemove="diffHandlerMove"
        v-on:mouseup="callDragEndHandler($event),diffHandlerUp($event) "
    >
        <slot></slot>
        
        <span v-if=domRect>x: {{domRect.x}}, y: {{domRect.y}}, w: {{domRect.width}}  h:{{domRect.height}}</span><br>
        <span v-if=diffToDownPoint.x> x: {{diffToDownPoint.x}}, y: {{diffToDownPoint.y}} </span>
    
    </div>
    `
}

export { dragContext }