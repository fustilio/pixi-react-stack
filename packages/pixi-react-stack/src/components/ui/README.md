# UI Components Documentation

This document provides comprehensive documentation for the core UI components: Viewport, ScrollBar, and ScrollBox.

## Table of Contents

- [Viewport](#viewport)
- [ScrollBar](#scrollbar)
- [ScrollBox](#scrollbox)
- [Usage Examples](#usage-examples)
- [Component Relationships](#component-relationships)

---

## Viewport

A powerful camera/viewport component built on top of `pixi-viewport` that provides interactive panning, zooming, and mouse edge scrolling capabilities.

### Features

- **Interactive Panning**: Drag to move the viewport around the world
- **Mouse Wheel Zooming**: Zoom in/out with mouse wheel
- **Mouse Edge Scrolling**: Auto-scroll when mouse approaches viewport edges
- **Clamping**: Restrict viewport movement to world boundaries
- **Event System**: Comprehensive event handling for moved, zoomed, and edge events

### Props

```typescript
interface ViewportProps {
  // Core dimensions
  screenWidth?: number;
  screenHeight?: number;
  worldWidth?: number;
  worldHeight?: number;
  
  // Interaction options
  dragOptions?: IDragOptions;
  wheelOptions?: IWheelOptions;
  pinchOptions?: IPinchOptions;
  bounceOptions?: IBounceOptions;
  decelerateOptions?: IDecelerateOptions;
  clampZoomOptions?: IClampZoomOptions;
  clampOptions?: IClampOptions;
  mouseEdgesOptions?: IMouseEdgesOptions;
  
  // Event handlers
  onMoved?: (event: MovedEvent) => void;
  onZoomed?: (event: ZoomedEvent) => void;
  onBounceX?: (event: MovedEvent) => void;
  onBounceY?: (event: MovedEvent) => void;
  onMouseEdgeStart?: (event: MovedEvent) => void;
  onMouseEdgeEnd?: (event: MovedEvent) => void;
  onMovedEnd?: (viewport: PixiViewport) => void;
  
  // Ref forwarding
  ref?: React.ForwardedRef<PixiViewport>;
}
```

### Mouse Edge Options

The viewport supports two mouse edge modes:

#### Distance Mode
```typescript
mouseEdgesOptions={{
  distance: 50,        // Fixed distance from each edge
  speed: 8,           // Scroll speed
  allowButtons: true, // Allow mouse buttons during edge scroll
}}
```

#### Radius Mode
```typescript
mouseEdgesOptions={{
  radius: 150,        // Circular zone from center
  speed: 8,           // Scroll speed
  allowButtons: true, // Allow mouse buttons during edge scroll
}}
```

### Example Usage

```typescript
import { Viewport } from './Viewport';

function MyViewport() {
  const ref = useRef<PixiViewport>(null);
  
  const handleMoved = useCallback((event: MovedEvent) => {
    console.log('Viewport moved to:', event.viewport.corner);
  }, []);
  
  const handleZoomed = useCallback((event: ZoomedEvent) => {
    console.log('Zoom level:', event.viewport.scale.x);
  }, []);
  
  return (
    <Viewport
      ref={ref}
      screenWidth={600}
      screenHeight={400}
      worldWidth={2000}
      worldHeight={2000}
      onMoved={handleMoved}
      onZoomed={handleZoomed}
      mouseEdgesOptions={{
        distance: 50,
        speed: 8,
        allowButtons: true,
      }}
      clampZoomOptions={{
        minScale: 0.1,
        maxScale: 5,
      }}
    >
      {/* Your content here */}
    </Viewport>
  );
}
```

---

## ScrollBar

A customizable horizontal/vertical scrollbar component with smooth easing animations, inspired by MUI Base UI ScrollArea.

### Features

- **Smooth Easing**: Configurable easing animations for value changes
- **Drag Interaction**: Precise thumb dragging with visual feedback
- **Track Clicking**: Page increment/decrement with repeat while held
- **Arrow Buttons**: Small step navigation
- **Auto-hide**: Hides when content fits within viewport
- **MUI Pattern**: Separates visual updates from state updates for smooth interaction

### Props

```typescript
interface ScrollBarProps {
  // Layout
  orientation?: "horizontal" | "vertical";
  length?: number;           // Total length including buttons
  thickness?: number;        // Cross-axis size
  buttonSize?: number;       // Arrow button size
  thumbSize?: number;        // Draggable thumb size
  
  // Value
  value?: number;            // Position (0-1)
  
  // Visual styling
  trackColor?: number;
  trackAlpha?: number;
  thumbColor?: number;
  thumbRadius?: number;
  
  // Easing configuration
  enableEasing?: boolean;
  easingDuration?: number;   // Animation duration in ms
  easingFunction?: "easeOut" | "easeInOut";
  
  // Event handlers
  onChange?: (value: number) => void;
  onChangeEnd?: (value: number) => void;
  onDecrement?: () => void;
  onIncrement?: () => void;
  onPageDecrement?: () => void;
  onPageIncrement?: () => void;
}
```

### Easing Functions

- **`"easeOut"`**: Fast start, slow finish (default, feels snappy)
- **`"easeInOut"`**: Slow start, fast middle, slow finish (feels smooth)

### Interaction Behavior

1. **Thumb Dragging**: Immediate visual feedback, commits final position on release
2. **Track Clicking**: Page jump + immediate drag capability
3. **Arrow Buttons**: Small step with easing
4. **Track Repeat**: Hold track for repeated page jumps (200ms interval)

### Example Usage

```typescript
import { ScrollBar } from './ScrollBar';

function MyScrollBar() {
  const [value, setValue] = useState(0);
  
  const handleChange = useCallback((newValue: number) => {
    setValue(newValue);
    console.log('Scroll position:', newValue);
  }, []);
  
  return (
    <ScrollBar
      orientation="horizontal"
      length={400}
      thickness={16}
      value={value}
      enableEasing={true}
      easingDuration={300}
      easingFunction="easeOut"
      onChange={handleChange}
      onDecrement={() => console.log('Small step left')}
      onIncrement={() => console.log('Small step right')}
      onPageDecrement={() => console.log('Page left')}
      onPageIncrement={() => console.log('Page right')}
    />
  );
}
```

---

## ScrollBox

A complete scrolling solution that combines Viewport and ScrollBar with synchronized behavior and smooth animations.

### Features

- **Auto-hide Scrollbar**: Hides when content fits within viewport
- **Synchronized Movement**: ScrollBar and Viewport stay in sync
- **Smooth Animations**: Both scrollbar thumb and viewport content animate together
- **Configurable Steps**: Customizable small and page step sizes
- **Scroll Events**: Start/end event callbacks with debouncing
- **Easing Support**: Coordinated easing between scrollbar and viewport

### Props

```typescript
interface ScrollBoxProps {
  // Layout
  width?: number;
  height?: number;
  children?: React.ReactNode;
  
  // World dimensions
  worldWidth?: number;
  worldHeight?: number;
  
  // Step configuration
  smallStepPx?: number;      // Small step size in pixels
  pageStepPx?: number;       // Page step size in pixels
  
  // Event callbacks
  onScrollStart?: (value: number) => void;
  onScrollEnd?: (value: number) => void;
  
  // Easing configuration
  enableEasing?: boolean;
  easingDuration?: number;
  easingFunction?: "easeOut" | "easeInOut";
}
```

### Behavior

- **Track Clicks**: Smooth eased viewport movement
- **Arrow Buttons**: Smooth eased incremental movement
- **Thumb Dragging**: Immediate viewport following (no lag)
- **Auto-hide**: Scrollbar disappears when `worldWidth <= width`

### Example Usage

```typescript
import { ScrollBox } from './ScrollBox';

function MyScrollBox() {
  const handleScrollStart = useCallback((value: number) => {
    console.log('Scrolling started at:', value);
  }, []);
  
  const handleScrollEnd = useCallback((value: number) => {
    console.log('Scrolling ended at:', value);
  }, []);
  
  return (
    <ScrollBox
      width={500}
      height={200}
      worldWidth={1000}
      worldHeight={180}
      smallStepPx={50}
      pageStepPx={400}
      enableEasing={true}
      easingDuration={300}
      easingFunction="easeOut"
      onScrollStart={handleScrollStart}
      onScrollEnd={handleScrollEnd}
    >
      {/* Your scrollable content */}
      <div style={{ width: 1000, height: 180 }}>
        {/* Content that's wider than the viewport */}
      </div>
    </ScrollBox>
  );
}
```

---

## Usage Examples

### Basic Viewport Demo

```typescript
// From ViewportDemoTwo.tsx
function ViewportDemo() {
  const [currentZoom, setCurrentZoom] = useState(1);
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<PixiViewport>(null);
  
  const handleViewportMoved = useCallback((event: MovedEvent) => {
    setCurrentPosition({
      x: Math.round(event.viewport.corner.x),
      y: Math.round(event.viewport.corner.y),
    });
  }, []);
  
  const handleViewportZoomed = useCallback((event: ZoomedEvent) => {
    setCurrentZoom(Math.round(event.viewport.scale.x * 100) / 100);
  }, []);
  
  return (
    <Viewport
      ref={ref}
      screenWidth={600}
      screenHeight={400}
      worldWidth={2000}
      worldHeight={2000}
      onMoved={handleViewportMoved}
      onZoomed={handleViewportZoomed}
      mouseEdgesOptions={{
        distance: 50,
        speed: 8,
        allowButtons: true,
      }}
    >
      {/* Grid and objects */}
    </Viewport>
  );
}
```

### ScrollBox with Custom Content

```typescript
function ScrollableList() {
  return (
    <ScrollBox
      width={400}
      height={300}
      worldWidth={800}
      smallStepPx={40}
      pageStepPx={320}
      enableEasing={true}
      easingDuration={250}
    >
      <div style={{ 
        width: 800, 
        display: 'flex', 
        flexDirection: 'row',
        gap: 20 
      }}>
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} style={{ 
            width: 100, 
            height: 100, 
            backgroundColor: `hsl(${i * 18}, 70%, 60%)` 
          }}>
            Item {i + 1}
          </div>
        ))}
      </div>
    </ScrollBox>
  );
}
```

---

## Component Relationships

```
ScrollBox
├── Viewport (handles content scrolling)
│   ├── Content (your scrollable elements)
│   └── Event handlers (moved, zoomed, etc.)
└── ScrollBar (horizontal only, auto-hidden)
    ├── Track (page increment/decrement)
    ├── Thumb (draggable position indicator)
    └── Arrow buttons (small steps)
```

### Data Flow

1. **User interacts with ScrollBar** → ScrollBar calls `onChange` → ScrollBox updates Viewport
2. **User interacts with Viewport** → Viewport calls `onMoved` → ScrollBox updates ScrollBar
3. **Easing animations** → Both components animate together for smooth experience

### Key Design Principles

- **Separation of Concerns**: Viewport handles content, ScrollBar handles navigation
- **Synchronized State**: Both components stay in sync through callbacks
- **Smooth Animations**: Coordinated easing between visual elements
- **Immediate Feedback**: Direct interactions (drag, manual scroll) are immediate
- **Eased Transitions**: Indirect interactions (buttons, track clicks) are eased

---

## Performance Considerations

- **Throttled Updates**: Viewport events are throttled to reduce re-renders
- **RequestAnimationFrame**: Easing animations use RAF for smooth 60fps
- **Debounced Events**: Scroll start/end events are debounced to prevent spam
- **Auto-hide**: ScrollBar is hidden when not needed to save resources
- **Minimal Re-renders**: State updates are optimized to prevent unnecessary renders

## Browser Compatibility

- **Modern Browsers**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **PIXI.js**: Requires PIXI.js v7+ and pixi-viewport
- **React**: Requires React 16.8+ (hooks support)
- **TypeScript**: Full TypeScript support with comprehensive type definitions