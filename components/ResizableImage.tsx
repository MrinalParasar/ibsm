"use client";

import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";

export default function ResizableImage(props: NodeViewProps) {
    const { node, updateAttributes, selected } = props;
    const [width, setWidth] = useState(node.attrs.width || "100%");

    // Update local state if node attributes change externally
    useEffect(() => {
        if (node.attrs.width) {
            setWidth(node.attrs.width);
        }
    }, [node.attrs.width]);

    const handleResize = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            const startX = e.clientX;
            const startWidth = parseInt(
                window.getComputedStyle(e.currentTarget.parentElement!).width,
                10
            );

            const onMouseMove = (moveEvent: MouseEvent) => {
                const currentX = moveEvent.clientX;
                const diffX = currentX - startX;
                const newWidth = Math.max(100, startWidth + diffX); // Min width 100px
                setWidth(`${newWidth}px`);
                updateAttributes({ width: `${newWidth}px` });
            };

            const onMouseUp = () => {
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
            };

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        },
        [updateAttributes]
    );

    return (
        <NodeViewWrapper className="resizable-image-wrapper" style={{ display: 'inline-block', position: 'relative', margin: '1rem 0' }}>
            <Box
                sx={{
                    position: "relative",
                    display: "inline-block",
                    border: selected ? "2px solid #1800ad" : "2px solid transparent",
                    borderRadius: 1,
                    lineHeight: 0,
                }}
            >
                <img
                    src={node.attrs.src}
                    alt={node.attrs.alt}
                    style={{
                        width: width,
                        maxWidth: "100%",
                        height: "auto",
                        borderRadius: 4,
                        display: "block",
                    }}
                />
                {selected && (
                    <Box
                        onMouseDown={handleResize}
                        sx={{
                            position: "absolute",
                            bottom: 5,
                            right: 5,
                            width: 12,
                            height: 12,
                            bgcolor: "white",
                            border: "1px solid #1800ad",
                            borderRadius: "50%",
                            cursor: "nwse-resize",
                            zIndex: 10,
                            boxShadow: 1
                        }}
                    />
                )}
            </Box>
        </NodeViewWrapper>
    );
}
