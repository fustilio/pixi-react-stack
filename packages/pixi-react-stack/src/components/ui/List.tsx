import { useEffect, useRef } from "react";
import { Container } from "pixi.js";

import { List as PixiList } from "./List.original";
import { LIST_TYPE } from "./utils/HelpTypes";

export type ListType = (typeof LIST_TYPE)[number];

export interface ListProps {
  type?: ListType;
  elementsMargin?: number;
  padding?: number;
  vertPadding?: number;
  horPadding?: number;
  topPadding?: number;
  bottomPadding?: number;
  leftPadding?: number;
  rightPadding?: number;
  items?: Container[];
  maxWidth?: number;
  width?: number;
  height?: number;
  onChildrenArranged?: (children: Container[]) => void;
}

/**
 * React wrapper for the stable class-based Pixi List component.
 * This prevents the dancing/shaking issues by using the proven Pixi.js implementation.
 */
export function List({
  type = "bidirectional",
  elementsMargin = 0,
  padding = 0,
  vertPadding,
  horPadding,
  topPadding,
  bottomPadding,
  leftPadding,
  rightPadding,
  items = [],
  maxWidth = 0,
  width,
  height,
  onChildrenArranged,
}: ListProps) {
  const containerRef = useRef<Container>(null);
  const listRef = useRef<PixiList>(null);

  // Initialize the Pixi List component
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    console.log(
      "🔧 List: Creating new List instance with items:",
      items.length,
      "type:",
      type,
      "maxWidth:",
      maxWidth,
    );

    // Create the Pixi List instance - don't pass items in constructor
    const list = new PixiList({
      type,
      elementsMargin,
      padding,
      vertPadding,
      horPadding,
      topPadding,
      bottomPadding,
      leftPadding,
      rightPadding,
      maxWidth: maxWidth || width || 200, // Ensure maxWidth is set
    });

    // Set the List component's dimensions
    list.width = width || 200;
    list.height = height || 200;

    // Also set the List's internal bounds to match the container
    if (maxWidth > 0) {
      list.maxWidth = maxWidth;
    }

    // Add it to the container
    container.addChild(list);
    listRef.current = list;

    console.log("🔧 List: List created, children count:", list.children.length);
    console.log("🔧 List: List type:", list.type);
    console.log("🔧 List: List maxWidth:", maxWidth);
    console.log("🔧 List: List dimensions:", list.width, "x", list.height);

    // Set up the arranged callback
    if (onChildrenArranged) {
      list.on("childAdded", () => {
        console.log(
          "🔧 List: Child added, total children:",
          list.children.length,
        );
        onChildrenArranged(list.children);
      });
    }

    return () => {
      if (listRef.current) {
        container.removeChild(listRef.current);
        listRef.current.destroy();
        listRef.current = null;
      }
    };
  }, [
    type,
    elementsMargin,
    padding,
    vertPadding,
    horPadding,
    topPadding,
    bottomPadding,
    leftPadding,
    rightPadding,
    maxWidth,
    width,
    height,
  ]);

  // Update items when they change - add them as children to the List
  useEffect(() => {
    if (!listRef.current) return;

    console.log("🔧 List: Updating items, count:", items.length);

    // Clear existing children
    listRef.current.removeChildren();

    // Add new items as children to the List component
    items.forEach((item, index) => {
      console.log(
        "🔧 List: Adding item",
        index,
        "to List, item dimensions:",
        item.width,
        "x",
        item.height,
      );
      listRef.current?.addChild(item);
    });

    console.log(
      "🔧 List: Final children count:",
      listRef.current.children.length,
    );

    // Force arrangement after adding all items
    if (listRef.current.children.length > 0) {
      console.log("🔧 List: Forcing arrangeChildren()");
      listRef.current.arrangeChildren();

      // Debug: Check item positions after arrangement
      console.log("🔧 List: After arrangement, checking item positions:");
      listRef.current.children.forEach((child, index) => {
        console.log(
          "🔧 List: Item",
          index,
          "position:",
          child.x,
          child.y,
          "dimensions:",
          child.width,
          child.height,
        );
      });
    }
  }, [items]);

  return (
    <pixiContainer
      ref={containerRef}
      width={width || 200}
      height={height || 200}
    />
  );
}
