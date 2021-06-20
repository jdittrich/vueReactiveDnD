import {provide, computed, reactive, unref, watch} from '../vue/vue.js';
import {useDragDiffProvider} from '../composables/useDragDiffProvider.js';
import {useSingleSelectionProvider} from '../composables/useSelectionProvider.js';
import {useElementListStore} from '../composables/useElementListStore.js'
import {findDropTarget} from '../utils/collisionUtils.js';

const dragContext = {
    name: "dragContext",
    props: {
        onDragend: Function
    },
    setup: function (props, context){
        // ____SELECTION PROVISION____
        let {
            selectedElement,
            clearSelection, //currently, we never clear selection, it is just the element you clicked on last. 
            setSelectedElement,
            addSelectableElement,
            removeSelectableElement
        } = useSingleSelectionProvider();

        // These are needed by draggables to set themselves as selected. 
        // (when the drag begins, the selected element is moved. )
        provide('setSelection', setSelectedElement);
        provide('selectedElement', selectedElement);

        provide('addSelectableElement', addSelectableElement);
        provide('removeSelectableElement', removeSelectableElement);
       



        //___DROPPABLE PROVISION_____
        const {
            elementList: droppableList,
            addElement: addDroppableElement,
            removeElement: removeDroppableElement
        } = useElementListStore();
        
        //for the droppables to register themselves. 
        provide('addDroppableElement', addDroppableElement);
        provide('removeDroppableElement', removeDroppableElement);

        //____DRAGGABLE PROVISION____
        const {
            elementList: draggableList,
            addElement: addDraggableElement,
            removeElement: removeDraggableElement
        } = useElementListStore();

        provide('addDraggableElement', addDraggableElement);
        provide('removeDraggableElement', removeDraggableElement);


        //____DRAG DIFF PROVISION____
        let {
            lastEvent,
            diffToDownPoint,
            isDragging,
            diffHandlerDown,
            diffHandlerMove,
            diffHandlerUp
        } = useDragDiffProvider(props, context);

        provide('isDragging', isDragging);
        provide('diffToDownPoint', diffToDownPoint);

        // CALL PROPed EVENT HANDLERS
        //calls onDragend function passed in via Prop (in the demo this is done in app.js), 
        //so the component itself is agnostic towards it. 
        const callDragEndHandler = function(event){   
            if (isDragging.value == true && props.onDragend) {
                let dropTargetId = findDropTarget(draggableList,droppableList, selectedElement);
                props.onDragend(event, selectedElement, dropTargetId);
            }
        };

        //drag Event data
        //over which droppable elements is the currently dragged element?
        //a set of ids

        //which droppable elements could the currently dragged element be dropped on?
        //a set of ids

        


        // PASS TO TEMPLATE
        return {
            diffHandlerDown,
            diffHandlerMove,
            diffHandlerUp,
            callDragEndHandler,
            diffToDownPoint,
        };
    },
    template: `
    <div 
        v-on:mousedown="diffHandlerDown" 
        v-on:mousemove="diffHandlerMove"
        v-on:mouseup="callDragEndHandler($event),diffHandlerUp($event) "
    >   
    <div style="
        position: absolute;
        outline: 1px solid blue; 
    ">…</div>
        <slot></slot>        
    </div>
    `
}

export { dragContext }