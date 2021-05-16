# vueReactiveDnD

Experiment to create a drag and drop mechanism similar to [DnD-kit](https://github.com/clauderic/dnd-kit/) (DnD-kit is for react, though)

Structure: 

* _app.js_: sets up components in template, passes ids as props, sets onDragEnd function (which gives you the debug message at the botton of the screen and on console)
* _draggable.js_:
   * registers DOM element and Id as draggable, 
   * Sets itself as selected on mousedown (gets functions for this via inject from dragContext)
   * moves via transform:translate when selected and drag is ongoing (gets coordinates for this via inject from dragContext)
* _droppable.js_: 
   * registers DOM element and Id as droppable (gets functions for this via inject from dragContext)
* _simpleRect.js_:  does nothing, only template
* _dragContext.js_: most stuff happens here
   * Provides selection and setter for itself
   * Provides list of droppable elements 
   * Provides list of draggable elements
   * provides isDragging boolean and the difference between mousedown (dragstart) and current mouse position (as long as the drag is ongoing) 
   * calls the DragEnd event handler (if provided via prop in the app.js) 

The rest are functions imported in the components – makeDraggable and makeDroppable provide most of the non-template/event related setup for their respective components, collisionHelpers find the element the currently selected element was dropped on. It currently only uses the "whereIsRectContained" strategy.