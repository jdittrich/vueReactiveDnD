/**
 * This component does nothing, it only renders a template
 */

const simpleRect = {
    name:"simple-rect",
    props:{
    },
    setup: function(props, context){//does nothing
     },
    template:`
        <div style="background-color:#AAA">I can be dragged! Yey!</div>`

}

export {simpleRect}