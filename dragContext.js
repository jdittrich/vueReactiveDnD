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
            clearSelection,
            setSelectedElement
        } = useSingleSelectionProvider();

        provide('setSelection', setSelectedElement);
        provide('selectedElement', selectedElement);

        //DROPPABLE PROVISION
        const droppableList = reactive(new Map());
        const addDroppableElement = (id,domElement) => droppableList.set(unref(id),unref(domElement));
        const removeDroppableElement = (id) => droppableList.delete(unref(id));

        provide('addDroppableElement', addDroppableElement);
        provide('removeDroppableElement', removeDroppableElement);

        //DRAGGABLE PROVISION
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


        // DOM RECT (will be interesting as soon as we want to show selection)
        const domRect = computed(function () {
            if (selectedElement.value) {
                return draggableList.get(selectedElement.value).getBoundingClientRect();
            } else {
                return null;
            }
        });
        
     

        // CALL PROPed EVENT HANDLERS

        //calls onDragend function passed in via Prop, 
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
            domRect,
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