import {computed} from './vue/vue.js';
import {findDropTarget} from './collisionHelpers.js';

const useDragData = function(paramObject){
    const {
        draggableList, 
        droppableList,
        selectableList,
        selectedElement,
        isDragging,
        diffToDownPoint
    } = paramObject;

    
    const computedDragData = computed(()=>{
        let dragData = {
            isOver:null,
            dragRect:null
        }; 

        if(isDragging && selectedElement.size > 0){ //is dragging does not mean that an element is dragged, it just concerns the mere mouse movement
            const selectionEnclosingRect = getSelectionEnclosingRect(selectedElement,selectableElements);
            const dragRect = getDragRect(diffToDragPoint,selectionEnclosingRect);
    
            const isOver = overDroppableIds(draggableList,droppableList,selectedElement);
    
            dragData.isOver = isOver;
            dragData.dragRect = dragRect;
        }
    
        return dragData;
    });

    return computedDragData;    
}

const overDroppableIds = function(draggableList,droppableList, selectedElement){
        const elementIdsOverData = new Set(); 
        elementIdsOverData.add(
            findDropTarget(draggableList,droppableList, selectedElement)
        );
        return elementIdsOverData;
};

//get a rectangle, shifted by the distance of the drag
const getDragRect = function(dragdiff, selectionRect){
    const dragRect = computed(()=>{
         return {
             x: selectionRect.x + dragdiff.x, 
             y: selectionRect.y + dragdiff.x,
             width: selectionRect.width,
             height: selectionRect.height 
         }; 
    });

    return dragRect; 
};

//get a rectangle enclosing the selected elements 
const getSelectionEnclosingRect = function(selectedElementsId,selectableElements){
        let selectionRectData = {
            x:null, 
            y:null,
            width: null, 
            height: null
        };

        selectedElementsId.forEach(id => {
            singleElementBoundingRect = selectableElements.get(id).getBoundingClientRect();
            //take position coordinates that are more top-left
            selectionRectData.x     = selectionRectData.x < singleElementBoundingRect.x ? selectionRectData.x: singleElementBoundingRect.x;
            selectionRectData.y     = selectionRectData.y < singleElementBoundingRect.y ? selectionRectData.y: singleElementBoundingRect.y;
            //take size coordinates if more  bottom-right
            selectionRectData.width = selectionRectData.width > singleElementBoundingRect.width ? selectionRectData.width: singleElementBoundingRect.width;
            selectionRectData.heigth = selectionRectData.heigth > singleElementBoundingRect.heigth ? selectionRectData.heigth: singleElementBoundingRect.heigth;
        });

        return selectionRectData;
};

export {useDragData};