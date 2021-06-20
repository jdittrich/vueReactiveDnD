import {computed} from '../vue/vue.js';
import {findDropTarget} from './collisionUtils.js'

const computeOverDroppableIds = function(draggableList,droppableList, selectedElement){
    const isOver = computed(()=>{   
        const elementIdsOverData = new Set(); 
        elementIdsOverData.add(
            findDropTarget(draggableList,droppableList, selectedElement)
        );
        return elementIdsOverData;
    });
    
    return isOver;
};

//get a rectangle, shifted by the distance of the drag
const computeDragRect = function(dragdiff, selectionRect){
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
const computeSelectionEnclosingRect = function(selectedElementsId,selectableElements){

    const selectionRect = computed(()=>{
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
    });

    return selectionRect;
};

export {computeDragRect, computeSelectionEnclosingRect, computeOverDroppableIds};