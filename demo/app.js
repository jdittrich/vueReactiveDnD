import {createApp, ref, computed} from '../vue/vue.js'; //vue, duh. 

import {draggable} from '../components/draggable.js'; //sets the selected element, gets coordinates for dragging from dragContext
import {droppable} from '../components/droppable.js'; //registers itself as drop target
import {dragContext} from '../components/dragContext.js'; //this is where most of the work is done

import {simpleRect} from '../components/simpleRect.js'; //just template rendering, no function


let App = {
    components:{
        'drag-draggable':draggable,
        'drag-context':dragContext,
        // 'drag-overlay':dragOverlay,
        'simple-rect':simpleRect,
        'drag-droppable':droppable
    },
    setup(props,context){
        let logMessage = ref("log message here");
        const onDragend = function(event, selection, dropTargetId){
            logMessage.value = "you dropped the element on the drop target with the ID: "+dropTargetId;
            console.log(logMessage.value);
        };

        return {onDragend,logMessage};
    },
    template:`
        <drag-context :onDragend="onDragend">
            <drag-draggable id="oneDrag" style="width:100px; height:80px; outline:green 1px solid">
                <simple-rect>test (I'm "oneDrag")</simple-rect>
            </drag-draggable>

            <drag-draggable id="twoDrag" style="width:100px; height:80px; outline:green 1px solid">
                <simple-rect> (I'm "two Drag")</simple-rect>
            </drag-draggable>

            <drag-droppable id="threeDrop" style="width:10em; height:10em; outline:blue 1px solid">DROP ME (I'm "threeDrop")</drag-droppable>
            
            <drag-droppable id="fourDrop" style="width:10em; height:10em; outline:#AABB11 1px solid">DROP ME, too (I'm "fourDrop")</drag-droppable>
        </drag-context>
        <div>{{logMessage}}</div>
    `
}





/* eslint-disable no-new */
createApp(App).mount('#app');