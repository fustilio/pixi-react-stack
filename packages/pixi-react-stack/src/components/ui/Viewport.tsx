import React, { useEffect, useImperativeHandle, useRef } from "react";
import { useApplication, type PixiReactElementProps } from "@pixi/react";
import {
  Viewport as PixiViewport,
  type IBounceOptions,
  type IClampOptions,
  type IClampZoomOptions,
  type IDecelerateOptions,
  type IDragOptions,
  type IFollowOptions,
  type IMouseEdgesOptions,
  type IPinchOptions,
  type IWheelOptions,
} from "pixi-viewport";
import type { MovedEvent, ZoomedEvent } from "pixi-viewport/dist/types";
import { Container } from "pixi.js";
import { useDeepCompareMemo } from "use-deep-compare";

export type ViewportProps = Omit<
  PixiReactElementProps<typeof PixiViewport>,
  "events"
> & {
  dragOptions?: IDragOptions;
  wheelOptions?: IWheelOptions;
  pinchOptions?: IPinchOptions;
  bounceOptions?: IBounceOptions;
  decelerateOptions?: IDecelerateOptions;
  clampZoomOptions?: IClampZoomOptions;
  followOptions?: IFollowOptions & {
    targetRef: React.RefObject<Container>;
  };
  mouseEdgesOptions?: IMouseEdgesOptions;
  clampOptions?: IClampOptions;
  onBounceX?: (event: MovedEvent) => void;
  onMoved?: (event: MovedEvent) => void;
  onZoomed?: (event: ZoomedEvent) => void;
  onBounceY?: (event: MovedEvent) => void;
  onMouseEdgeStart?: (event: MovedEvent) => void;
  onMouseEdgeEnd?: (event: MovedEvent) => void;
  onMovedEnd?: (event: PixiViewport) => void;
  ref?: React.ForwardedRef<PixiViewport>;
};

/**
 * simplified version of pixiViewport with convenience props
 */
export function Viewport(props: ViewportProps) {
  const {
    dragOptions,
    clampOptions,
    wheelOptions,
    pinchOptions,
    decelerateOptions,
    clampZoomOptions,
    bounceOptions,
    followOptions,
    mouseEdgesOptions,
    onMoved,
    onZoomed,
    onBounceX,
    onBounceY,
    onMouseEdgeStart,
    onMouseEdgeEnd,
    onMovedEnd,
    ref,
    ...rest
  } = props;
  const { app } = useApplication();

  const _ref = useRef<PixiViewport>(null);

  useImperativeHandle(ref, () => _ref.current as PixiViewport);

  const isMouseEdgeActive = useRef(false);

  const stableDragOptions = useDeepCompareMemo(
    () => dragOptions,
    [dragOptions]
  );
  const stableClampOptions = useDeepCompareMemo(
    () => ({
      left: 0,
      top: 0,
      right: rest.worldWidth,
      bottom: rest.worldHeight,
      ...clampOptions,
    }),
    [clampOptions]
  );
  const stableWheelOptions = useDeepCompareMemo(
    () => wheelOptions,
    [wheelOptions]
  );

  const stablePinchOptions = useDeepCompareMemo(
    () => pinchOptions,
    [pinchOptions]
  );
  const stableDecelerateOptions = useDeepCompareMemo(
    () => decelerateOptions,
    [decelerateOptions]
  );
  const stableClampZoomOptions = useDeepCompareMemo(
    () => clampZoomOptions || { minScale: 0.1, maxScale: 5 },
    [clampZoomOptions]
  );
  const stableBounceOptions = useDeepCompareMemo(
    () => bounceOptions,
    [bounceOptions]
  );
  const stableFollowOptions = useDeepCompareMemo(
    () => followOptions,
    [followOptions]
  );
  const stableMouseEdgesOptions = useDeepCompareMemo(
    () => ({
      ...mouseEdgesOptions,
    }),
    [mouseEdgesOptions]
  );
  useEffect(() => {
    const currentRef = _ref.current;
    if (!currentRef) return;

    currentRef
      .drag(stableDragOptions)
      .wheel(stableWheelOptions)
      .pinch(stablePinchOptions)
      .clamp(stableClampOptions)
      .clampZoom(stableClampZoomOptions);

    if (stableDecelerateOptions) {
      currentRef.decelerate(stableDecelerateOptions);
    }
    if (stableBounceOptions) {
      currentRef.bounce(stableBounceOptions);
    }

    if (stableFollowOptions && stableFollowOptions.targetRef) {
      currentRef.follow(
        stableFollowOptions.targetRef.current,
        stableFollowOptions
      );
    }

    if (stableMouseEdgesOptions) {
      currentRef.mouseEdges(stableMouseEdgesOptions);
    }

    if (onMoved) {
      currentRef.on("moved", onMoved);
    }

    if (onZoomed) {
      currentRef.on("zoomed", onZoomed);
    }

    if (onBounceX) {
      currentRef.on("moved", (event: MovedEvent) => {
        if (event.type === "bounce-x") {
          onBounceX(event);
        }
      });
    }

    if (onBounceY) {
      currentRef.on("moved", (event: MovedEvent) => {
        if (event.type === "bounce-y") {
          onBounceY(event);
        }
      });
    }

    if (onMovedEnd) {
      currentRef.on("moved-end", (viewport: PixiViewport) => {
        onMovedEnd(viewport);
      });
    }

    currentRef.on("moved", (event: MovedEvent) => {
      if (event.type === "mouse-edges") {
        // if not yet active
        if (isMouseEdgeActive.current) {
          isMouseEdgeActive.current = true;
          onMouseEdgeStart?.(event);
        }
      }
    });

    currentRef.on("moved-end", (viewport: PixiViewport) => {
      // if mouse edge is active, call the end event
      if (isMouseEdgeActive.current) {
        isMouseEdgeActive.current = false;
        onMouseEdgeEnd?.({ type: "mouse-edges", viewport });
      }
    });

    // for some reason this event is not being called
    currentRef.on("mouse-edge-end", (viewport: PixiViewport) => {
      isMouseEdgeActive.current = false;
      onMouseEdgeEnd?.({ type: "mouse-edges", viewport });
    });

    return () => {
      currentRef.off("moved");
      currentRef.off("zoomed");
      currentRef.off("mouse-edge-end");
      currentRef.off("moved-end");
      // clean up all plugins
      currentRef.plugins.removeAll();
    };
  }, [
    stableDragOptions,
    onMoved,
    onZoomed,
    stableClampOptions,
    stableWheelOptions,
    rest.worldWidth,
    rest.worldHeight,
    stablePinchOptions,
    stableDecelerateOptions,
    stableClampZoomOptions,
    stableBounceOptions,
    stableFollowOptions,
    stableMouseEdgesOptions,
    onBounceX,
    onBounceY,
    onMovedEnd,
    onMouseEdgeStart,
    onMouseEdgeEnd,
    _ref,
  ]);

  return <pixiViewport {...rest} events={app.renderer.events} ref={_ref} />;
}
