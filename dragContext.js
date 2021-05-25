import {provide, computed, reactive, unref, watch} from './vue/vue.js';
import {useDragDiffProvider} from './useDragDiffProvider.js';
import {useSingleSelectionProvider} from './useSelectionProvider.js';
import {useElementListStore} from './useElementListStore.js'
//import {useDroppableProvider} from './useDroppableProvider.js';
import {findDropTarget} from './collisionHelpers.js';
import {computeDragRect, computeSelectionEnclosingRect, computeOverDroppableIds} from './dragUtils.js'

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

        // These are needed by draggables to set themselves as selected. 
        // (when the drag begins, the selected element is moved. )
        provide('setSelection', setSelectedElement);
        provide('selectedElement', selectedElement);



        //==DROPPABLE PROVISION==
        const {
            elementList: droppableList,
            addElement: addDroppableElement,
            removeElement: removeDroppableElement
        } = useElementListStore();
        
        //for the droppables to register themselves. 
        provide('addDroppableElement', addDroppableElement);
        provide('removeDroppableElement', removeDroppableElement);

        //==DRAGGABLE PROVISION==
        const {
            elementList: draggableList,
            addElement: addDraggableElement,
            removeElement: removeDraggableElement
        } = useElementListStore();

        provide('addDraggableElement', addDraggableElement);
        provide('removeDraggableElement', removeDraggableElement);


        //DRAG DIFF PROVISION
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

        const selectionRect = computeSelectionEnclosingRect(selectedElement,draggableList);

        const dragRect = computeDragRect(diffToDownPoint,selectionRect);

        const isOver = computeOverDroppableIds(draggableList,droppableList,selectedElement);  
        
        // this is the main object with the interesting infos for working with the drag
        // 
        const dragData = reactive({
            isDragging: isDragging //are we dragging?
            dragRect:dragRect, //the bounding rect of the dragged object
            isOver:isOver, //droppable elements the draggable element is over
            lastEvent: lastEvent, //last event that happend (probably best to be used with watch())
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
        <ul>
            <li>Is Dragging? {{dragData.isDragging}}</li>
            <li>is Over? {{Array.from(dragData.isOver).toString()}}</li>
            <li>Last Event? {{dragData.lastEvent}}</li>
        </ul>
        
    </div>
    `
}

export { dragContext }