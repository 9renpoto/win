import type { GraphData, GraphEdge, GraphNode } from "../types.ts";

interface SimNode extends GraphNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

type GraphState = {
  nodes: SimNode[];
  edges: GraphEdge[];
  edgeMap: Map<string, Set<string>>;
  zoom: number;
  panX: number;
  panY: number;
  isPanning: boolean;
  draggedNode: SimNode | null;
  hoveredNode: SimNode | null;
  dragStartX: number;
  dragStartY: number;
  hasDragged: boolean;
  alpha: number;
  animId: number | null;
  searchQuery: string;
  showOrphans: boolean;
  theme: "dark" | "light";
};

export interface GraphController {
  setOptions(options: {
    searchQuery: string;
    showOrphans: boolean;
    theme: "dark" | "light";
  }): void;
  zoomIn(): void;
  zoomOut(): void;
  resetView(): void;
  dispose(): void;
}

export function createGraphView(
  canvas: HTMLCanvasElement,
  container: HTMLDivElement,
  initialData: GraphData,
  onHover: (node: GraphNode | null) => void,
  navigate: (path: string) => Promise<void>,
): GraphController {
  // Share the CSS/Figma palette with canvas drawing. Read once per view.
  const style = getComputedStyle(container);
  const token = (name: string) => style.getPropertyValue(name).trim();
  const palette = (theme: "dark" | "light") => ({
    background: token(`--graph-background-${theme}`),
    edge: token(`--graph-edge-${theme}`),
    edgeHighlight: token(`--graph-edge-highlight-${theme}`),
    edgeDim: token(`--graph-edge-dim-${theme}`),
    node: token(`--graph-node-${theme}`),
    nodeConnected: token(`--graph-node-connected-${theme}`),
    nodeDim: token(`--graph-node-dim-${theme}`),
    nodeHover: token("--graph-node-hover"),
    nodeMatch: token("--graph-node-match"),
    nodeOutline: token(`--graph-node-outline-${theme}`),
    dot: token(`--graph-dot-${theme}`),
    label: token(`--graph-label-${theme}`),
    labelHover: token(`--graph-label-hover-${theme}`),
  });
  const colors = { dark: palette("dark"), light: palette("light") };
  const labelFont = token("--font-family-body");
  const state: GraphState = {
    nodes: [],
    edges: [],
    edgeMap: new Map(),
    zoom: 1,
    panX: 0,
    panY: 0,
    isPanning: false,
    draggedNode: null,
    hoveredNode: null,
    dragStartX: 0,
    dragStartY: 0,
    hasDragged: false,
    alpha: 1,
    animId: null,
    searchQuery: "",
    showOrphans: true,
    theme: "dark",
  };
  const disposeSimulation = (() => {
    const rawNodes = initialData.nodes;
    const rawEdges = initialData.edges;

    const edgeMap = new Map<string, Set<string>>();
    for (const edge of rawEdges) {
      if (!edgeMap.has(edge.source)) edgeMap.set(edge.source, new Set());
      if (!edgeMap.has(edge.target)) edgeMap.set(edge.target, new Set());
      edgeMap.get(edge.source)?.add(edge.target);
      edgeMap.get(edge.target)?.add(edge.source);
    }

    // Spread nodes initial positions in a spiral
    const simNodes: SimNode[] = rawNodes.map((n, i) => {
      const angle = i * 0.5;
      const radius = 30 + Math.sqrt(i) * 35;
      const r = Math.min(14, Math.max(4, 3 + Math.sqrt(n.linkCount) * 2.5));
      return {
        ...n,
        x: Math.cos(angle) * radius + (Math.random() - 0.5) * 20,
        y: Math.sin(angle) * radius + (Math.random() - 0.5) * 20,
        vx: 0,
        vy: 0,
        radius: r,
      };
    });

    state.nodes = simNodes;
    state.edges = rawEdges;
    state.edgeMap = edgeMap;
    state.alpha = 1;

    if (!canvas) return;

    // Resize handler
    const updateSize = () => {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      const dpr = globalThis.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      state.alpha = Math.max(state.alpha, 0.2);
    };

    updateSize();
    globalThis.addEventListener("resize", updateSize);
    const observer = new ResizeObserver(updateSize);
    observer.observe(container);

    // Animation Loop
    let running = true;
    const stepSimulation = () => {
      if (!running) return;
      const st = state;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = globalThis.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      // 1. Force Simulation physics step if alpha > 0.001
      if (st.alpha > 0.002) {
        const visibleNodes = st.nodes.filter(
          (n) => st.showOrphans || n.linkCount > 0,
        );
        const nodeCount = visibleNodes.length;

        // Center gravity
        const centerStrength = 0.012 * st.alpha;
        for (let i = 0; i < nodeCount; i++) {
          const n = visibleNodes[i];
          n.vx -= n.x * centerStrength;
          n.vy -= n.y * centerStrength;
        }

        // Node-node repulsion (Coulomb force)
        const repulsion = 450 * st.alpha;
        for (let i = 0; i < nodeCount; i++) {
          const n1 = visibleNodes[i];
          for (let j = i + 1; j < nodeCount; j++) {
            const n2 = visibleNodes[j];
            const dx = n2.x - n1.x;
            const dy = n2.y - n1.y;
            const distSq = dx * dx + dy * dy + 16;
            const dist = Math.sqrt(distSq);
            if (dist > 350) continue; // optimization cut-off
            const force = ((repulsion / distSq) * (n1.radius + n2.radius)) / 8;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            n1.vx -= fx;
            n1.vy -= fy;
            n2.vx += fx;
            n2.vy += fy;
          }
        }

        // Spring force on edges
        const springLength = 70;
        const springStrength = 0.06 * st.alpha;
        const nodeMap = new Map(st.nodes.map((n) => [n.id, n]));

        for (const edge of st.edges) {
          const src = nodeMap.get(edge.source);
          const tgt = nodeMap.get(edge.target);
          if (!src || !tgt) continue;
          if (!st.showOrphans && (src.linkCount === 0 || tgt.linkCount === 0)) {
            continue;
          }

          const dx = tgt.x - src.x;
          const dy = tgt.y - src.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const diff = dist - springLength;
          const force = diff * springStrength;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          src.vx += fx;
          src.vy += fy;
          tgt.vx -= fx;
          tgt.vy -= fy;
        }

        // Update positions with damping
        const damping = 0.85;
        for (let i = 0; i < nodeCount; i++) {
          const n = visibleNodes[i];
          if (n === st.draggedNode) continue;
          n.vx *= damping;
          n.vy *= damping;
          n.x += n.vx;
          n.y += n.vy;
        }

        // Cool down
        st.alpha *= 0.985;
      }

      // 2. Render Frame
      ctx.save();
      ctx.scale(dpr, dpr);

      const themeColors = colors[st.theme];

      // Clear Canvas
      ctx.fillStyle = themeColors.background;
      ctx.fillRect(0, 0, width, height);

      // Draw subtle background dots for Obsidian feel
      ctx.save();
      const dotSpacing = 30 * st.zoom;
      if (dotSpacing >= 15) {
        ctx.fillStyle = themeColors.dot;
        const startX =
          (((st.panX + width / 2) % dotSpacing) + dotSpacing) % dotSpacing;
        const startY =
          (((st.panY + height / 2) % dotSpacing) + dotSpacing) % dotSpacing;
        for (let x = startX; x < width; x += dotSpacing) {
          for (let y = startY; y < height; y += dotSpacing) {
            ctx.beginPath();
            ctx.arc(x, y, 1, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      ctx.restore();

      // Transform for pan & zoom
      ctx.save();
      ctx.translate(width / 2 + st.panX, height / 2 + st.panY);
      ctx.scale(st.zoom, st.zoom);

      const nodeMap = new Map(st.nodes.map((n) => [n.id, n]));
      const hovered = st.hoveredNode;
      const neighbors = hovered ? st.edgeMap.get(hovered.id) : null;
      const query = st.searchQuery;

      // Draw Edges
      for (const edge of st.edges) {
        const src = nodeMap.get(edge.source);
        const tgt = nodeMap.get(edge.target);
        if (!src || !tgt) continue;
        if (!st.showOrphans && (src.linkCount === 0 || tgt.linkCount === 0)) {
          continue;
        }

        const isHighlighted =
          hovered && (hovered.id === edge.source || hovered.id === edge.target);

        ctx.beginPath();
        ctx.moveTo(src.x, src.y);
        ctx.lineTo(tgt.x, tgt.y);

        if (isHighlighted) {
          ctx.strokeStyle = themeColors.edgeHighlight;
          ctx.lineWidth = 2.0 / st.zoom;
        } else if (hovered) {
          ctx.strokeStyle = themeColors.edgeDim;
          ctx.lineWidth = 0.8 / st.zoom;
        } else {
          ctx.strokeStyle = themeColors.edge;
          ctx.lineWidth = 1.0 / st.zoom;
        }
        ctx.stroke();
      }

      // Draw Nodes
      const visibleNodes = st.nodes.filter(
        (n) => st.showOrphans || n.linkCount > 0,
      );

      for (const node of visibleNodes) {
        const isHovered = hovered?.id === node.id;
        const isNeighbor = neighbors?.has(node.id);
        const matchesQuery =
          query &&
          (node.title.toLowerCase().includes(query) ||
            node.id.toLowerCase().includes(query));

        let nodeColor = themeColors.node;
        let scale = 1;

        if (hovered) {
          if (isHovered) {
            nodeColor = themeColors.nodeHover;
            scale = 1.35;
          } else if (isNeighbor) {
            nodeColor = themeColors.nodeConnected;
            scale = 1.2;
          } else {
            nodeColor = themeColors.nodeDim;
          }
        } else if (query) {
          if (matchesQuery) {
            nodeColor = themeColors.nodeMatch;
            scale = 1.3;
          } else {
            nodeColor = themeColors.nodeDim;
          }
        } else if (node.linkCount > 0) {
          nodeColor = themeColors.nodeConnected;
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * scale, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.fill();

        // Subtle glow for active/hovered node
        if (isHovered || matchesQuery) {
          ctx.strokeStyle = themeColors.nodeOutline;
          ctx.lineWidth = 1.5 / st.zoom;
          ctx.stroke();
        }

        // Labels: show when zoomed in, or if hovered/neighbor/query match
        const shouldShowLabel =
          isHovered ||
          isNeighbor ||
          matchesQuery ||
          st.zoom >= 1.5 ||
          (st.zoom >= 0.9 && node.linkCount >= 3);

        if (
          shouldShowLabel &&
          (!hovered || isHovered || isNeighbor || matchesQuery)
        ) {
          const fontSize = Math.max(
            10,
            Math.min(14, (isHovered ? 13 : 11) / Math.sqrt(st.zoom)),
          );
          ctx.font = `${isHovered ? "600" : "400"} ${fontSize}px ${labelFont}`;
          ctx.textAlign = "center";
          ctx.textBaseline = "top";

          // Label text
          const displayTitle =
            node.title.length > 25 ? `${node.title.slice(0, 24)}…` : node.title;

          // Shadow / background glow for readability
          ctx.fillStyle = isHovered
            ? themeColors.labelHover
            : themeColors.label;
          ctx.fillText(
            displayTitle,
            node.x,
            node.y + node.radius * scale + 3 / st.zoom,
          );
        }
      }

      ctx.restore(); // restore zoom & pan
      ctx.restore(); // restore dpr

      st.animId = requestAnimationFrame(stepSimulation);
    };

    state.animId = requestAnimationFrame(stepSimulation);

    return () => {
      running = false;
      observer.disconnect();
      globalThis.removeEventListener("resize", updateSize);
      if (state.animId !== null) {
        cancelAnimationFrame(state.animId);
      }
    };
  })();
  // Coordinate helper
  const screenToWorld = (screenX: number, screenY: number) => {
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const st = state;
    const x = (screenX - rect.left - rect.width / 2 - st.panX) / st.zoom;
    const y = (screenY - rect.top - rect.height / 2 - st.panY) / st.zoom;
    return { x, y };
  };

  const findNodeAt = (screenX: number, screenY: number): SimNode | null => {
    const st = state;
    const { x, y } = screenToWorld(screenX, screenY);
    const visibleNodes = st.nodes.filter(
      (n) => st.showOrphans || n.linkCount > 0,
    );

    // Search in reverse so top drawn nodes are picked first
    for (let i = visibleNodes.length - 1; i >= 0; i--) {
      const n = visibleNodes[i];
      const dx = n.x - x;
      const dy = n.y - y;
      const hitRadius = (n.radius + 6) / Math.min(st.zoom, 1);
      if (dx * dx + dy * dy <= hitRadius * hitRadius) {
        return n;
      }
    }
    return null;
  };

  // Mouse / Touch handlers
  const handleMouseDown = (e: MouseEvent) => {
    if (e.button !== 0) return; // Left click only
    const st = state;
    const node = findNodeAt(e.clientX, e.clientY);
    st.dragStartX = e.clientX;
    st.dragStartY = e.clientY;
    st.hasDragged = false;

    if (node) {
      st.draggedNode = node;
      st.alpha = Math.max(st.alpha, 0.4);
    } else {
      st.isPanning = true;
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    const st = state;
    const dist = Math.hypot(
      e.clientX - st.dragStartX,
      e.clientY - st.dragStartY,
    );
    if (dist > 4) {
      st.hasDragged = true;
    }

    if (st.draggedNode) {
      const { x, y } = screenToWorld(e.clientX, e.clientY);
      st.draggedNode.x = x;
      st.draggedNode.y = y;
      st.draggedNode.vx = 0;
      st.draggedNode.vy = 0;
      st.alpha = Math.max(st.alpha, 0.3);
    } else if (st.isPanning) {
      const dx = e.movementX;
      const dy = e.movementY;
      st.panX += dx;
      st.panY += dy;
    } else {
      const hovered = findNodeAt(e.clientX, e.clientY);
      if (hovered !== st.hoveredNode) {
        st.hoveredNode = hovered;
        onHover(hovered);
        if (canvas) {
          canvas.style.cursor = hovered ? "pointer" : "grab";
        }
      }
    }
  };

  const handleMouseUp = (_e: MouseEvent) => {
    const st = state;
    if (!st.hasDragged && st.draggedNode) {
      // Clicked on node without dragging -> Navigate to post!
      void navigate(st.draggedNode.path);
    }
    st.draggedNode = null;
    st.isPanning = false;
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const st = state;

    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88;
    const newZoom = Math.min(Math.max(st.zoom * zoomFactor, 0.15), 4.5);

    // Zoom toward cursor position
    const originX = mouseX - rect.width / 2 - st.panX;
    const originY = mouseY - rect.height / 2 - st.panY;
    st.panX -= originX * (newZoom / st.zoom - 1);
    st.panY -= originY * (newZoom / st.zoom - 1);
    st.zoom = newZoom;
    st.alpha = Math.max(st.alpha, 0.1);
  };

  const resetView = () => {
    const st = state;
    st.zoom = 1;
    st.panX = 0;
    st.panY = 0;
    st.alpha = 0.5;
  };

  const zoomIn = () => {
    const st = state;
    st.zoom = Math.min(st.zoom * 1.25, 4.5);
    st.alpha = Math.max(st.alpha, 0.1);
  };

  const zoomOut = () => {
    const st = state;
    st.zoom = Math.max(st.zoom * 0.8, 0.15);
    st.alpha = Math.max(st.alpha, 0.1);
  };

  const down = (event: PointerEvent) => {
    if (event.button !== 0) return;
    canvas.setPointerCapture(event.pointerId);
    handleMouseDown(event);
  };
  const up = (event: PointerEvent) => {
    handleMouseUp(event);
    if (canvas.hasPointerCapture(event.pointerId))
      canvas.releasePointerCapture(event.pointerId);
  };
  const cancel = () => {
    state.draggedNode = null;
    state.isPanning = false;
  };
  const leave = () => {
    if (!state.draggedNode && !state.isPanning) {
      state.hoveredNode = null;
      onHover(null);
    }
  };
  canvas.addEventListener("pointerdown", down);
  canvas.addEventListener("pointermove", handleMouseMove);
  canvas.addEventListener("pointerup", up);
  canvas.addEventListener("pointercancel", cancel);
  canvas.addEventListener("pointerleave", leave);
  canvas.addEventListener("wheel", handleWheel, { passive: false });
  return {
    setOptions(options) {
      state.searchQuery = options.searchQuery.trim().toLowerCase();
      state.showOrphans = options.showOrphans;
      state.theme = options.theme;
      state.alpha = Math.max(state.alpha, 0.3);
    },
    zoomIn,
    zoomOut,
    resetView,
    dispose() {
      disposeSimulation?.();
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", handleMouseMove);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", cancel);
      canvas.removeEventListener("pointerleave", leave);
      canvas.removeEventListener("wheel", handleWheel);
    },
  };
}
