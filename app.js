import {createApp, ref, computed} from './vue/vue.js';
import {draggable} from './draggable.js';
import {dragContext} from './dragContext.js';
import {simpleRect} from './simpleRect.js'
let App = {
    components:{
        'drag-draggable':draggable,
        'drag-context':dragContext,
        'simple-rect':simpleRect},
    setup(props,context){
        const onDragend = function(event, selection){
            console.log(event,selection)

        };

        return {onDragend}
    },
    template:`
        <drag-context :onDragend="onDragend">
            <drag-draggable>
                <simple-rect>test</simple-rect>
            </drag-draggable>
        </drag-context>

        

    `
}





/* eslint-disable no-new */
createApp(App).mount('#app');