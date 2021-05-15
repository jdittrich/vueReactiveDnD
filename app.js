import {createApp, ref, computed} from './vue/vue.js';
import {draggable} from './draggable.js';
import {dragContext} from './dragContext.js';
import {simpleRect} from './simpleRect.js';
import {dragOverlay} from './dragOverlay.js';
import {droppable} from './droppable.js';

let App = {
    components:{
        'drag-draggable':draggable,
        'drag-context':dragContext,
        'drag-overlay':dragOverlay,
        'simple-rect':simpleRect,
        'drag-droppable':droppable
    },
    setup(props,context){
        const onDragend = function(event, selection, dropTargetId){
            console.log(event,selection,dropTargetId)

        };

        return {onDragend};
    },
    template:`
        <drag-context :onDragend="onDragend">
            <drag-draggable id="oneDrag" style="width:100px; height:80px; outline:green 1px solid">
                <simple-rect>test</simple-rect>
            </drag-draggable>
            <drag-draggable id="twoDrag" style="width:100px; height:80px; outline:green 1px solid">
                <simple-rect>test</simple-rect>
            </drag-draggable>

            <drag-droppable id="threeDrop" style="width:10em; height:10em; outline:blue 1px solid">DROP ME</drag-droppable>
            <drag-droppable id="fourDrop" style="width:10em; height:10em; outline:#AABB11 1px solid">DROP ME, too</drag-droppable>
            
            <drag-overlay>
                <simple-rect>overlay yey</simple-rect>
            </drag-overlay>

        </drag-context>
    `
}





/* eslint-disable no-new */
createApp(App).mount('#app');