import {provide, computed, toRaw, readonly } from './vue/vue.js';
import {useDragDiffProvider} from './useDragDiffProvider.js';
import {useSelectionProvider} from './useSelectionProvider.js';
import {useDroppableProvider} from './useDroppableProvider.js';
import {findDropTarget} from './collisionHelpers.js';


const dragContext = {
    name: "dragContext",
    props: {
        onDragend: Function
    },
    setup: function (props, context){

        // SELECTION PROVISION
        let {
            setSelection,
            selectedElements
        } = useSelectionProvider();

        provide('setSelection', setSelection);
        provide('selectedElements', selectedElements);

        //DROPPABLE PROVISION
        let {
            addDroppableElement,
            removeDroppableElement,
            droppableElements
        } = useDroppableProvider();

        provide('addDroppableElement',addDroppableElement);
        provide('removeDroppableElement',removeDroppableElement);

        //DRAG DIFF PROVISION
        let {
            diffToDownPoint,
            isDragging,
            diffHandlerDown,
            diffHandlerMove,
            diffHandlerUp
        } = useDragDiffProvider(props, context);

        provide('isDragging', isDragging)
        provide("diffToDownPoint", diffToDownPoint);


        // DOM RECT (will be interesting as soon as we want to show selection)
        const domRect = computed(function () {
            if (selectedElements[0]) {
                return selectedElements[0].domRef.getBoundingClientRect();
            } else {
                return null;
            }
        });
        
        // CALL PROPed EVENT HANDLERS

        //calls onDragend function passed in via Prop, 
        //so the component itself is agnostic towards it. 
        const callDragEndHandler = function(event){   
            if (isDragging.value == true && props.onDragend) {
                let dropTarget = findDropTarget(readonly(selectedElements[0]),readonly(droppableElements))
                props.onDragend(event, selectedElements, dropTarget);
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