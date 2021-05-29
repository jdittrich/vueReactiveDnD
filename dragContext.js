import {provide, computed, reactive, unref, watch} from './vue/vue.js';
import {useDragDiffProvider} from './useDragDiffProvider.js';
import {useSingleSelectionProvider} from './useSelectionProvider.js';
import {useElementListStore} from './useElementListStore.js'
//import {useDroppableProvider} from './useDroppableProvider.js';
import {findDropTarget} from './collisionHelpers.js';
import {useDragData} from './dragUtils.js'

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

        // ___DRAG DATA PROVISION____

        const dragData = useDragData({
            draggableList,
            droppableList,
            selectedElement,
            isDragging,
            diffToDownPoint
        });
        

        provide ('dragData', dragData);

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
            diffToDownPoint,
            dragData
        };
    },
    template: `
    <div 
        v-on:mousedown="diffHandlerDown" 
        v-on:mousemove="diffHandlerMove"
        v-on:mouseup="callDragEndHandler($event),diffHandlerUp($event) "
    >   
    <div style="
        top:{{dragData.dragRect.y+'px}};
        left: {{dragData.dragRect.x+'px'}};
        width: {{dragData.dragRect.width+'px'}};
        height:{{dragData.dragRect.height+'px'}};
        position: absolute;
        outline: 1px solid blue; 
    ">…</div>
        <slot></slot>        
    </div>
    `
}

export { dragContext }