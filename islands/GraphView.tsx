import { useEffect, useRef, useState } from "preact/hooks";
import type { GraphData, GraphEdge, GraphNode } from "@/utils/graph.ts";

interface SimNode extends GraphNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface GraphViewProps {
  initialData: GraphData;
}

export default function GraphView({ initialData }: GraphViewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [showOrphans, setShowOrphans] = useState(true);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [hoveredNodeInfo, setHoveredNodeInfo] = useState<GraphNode | null>(
    null,
  );

  // Simulation & View state held in refs for 60fps rendering without Preact re-render overhead
  const stateRef = useRef<{
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
  }>({
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
  });

  // Sync react states into stateRef
  useEffect(() => {
    stateRef.current.searchQuery = searchQuery.trim().toLowerCase();
    stateRef.current.showOrphans = showOrphans;
    stateRef.current.theme = theme;
    stateRef.current.alpha = Math.max(stateRef.current.alpha, 0.3);
  }, [searchQuery, showOrphans, theme]);

  // Initialize nodes & simulation
  useEffect(() => {
    const rawNodes = initialData.nodes;
    const rawEdges = initialData.edges;

    const edgeMap = new Map<string, Set<string>>();
    for (const edge of rawEdges) {
      if (!edgeMap.has(edge.source)) edgeMap.set(edge.source, new Set());
      if (!edgeMap.has(edge.target)) edgeMap.set(edge.target, new Set());
      edgeMap.get(edge.source)!.add(edge.target);
      edgeMap.get(edge.target)!.add(edge.source);
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

    stateRef.current.nodes = simNodes;
    stateRef.current.edges = rawEdges;
    stateRef.current.edgeMap = edgeMap;
    stateRef.current.alpha = 1;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Resize handler
    const updateSize = () => {
      if (!containerRef.current || !canvas) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = globalThis.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      stateRef.current.alpha = Math.max(stateRef.current.alpha, 0.2);
    };

    updateSize();
    globalThis.addEventListener("resize", updateSize);

    // Animation Loop
    let running = true;
    const stepSimulation = () => {
      if (!running) return;
      const st = stateRef.current;
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
            const force = (repulsion / distSq) * (n1.radius + n2.radius) / 8;
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

      // Colors
      const isDark = st.theme === "dark";
      const bgColor = isDark ? "#090d16" : "#f8fafc";
      const edgeColor = isDark
        ? "rgba(148, 163, 184, 0.2)"
        : "rgba(100, 116, 139, 0.25)";
      const highlightEdgeColor = isDark
        ? "rgba(56, 189, 248, 0.8)"
        : "rgba(2, 132, 199, 0.85)";
      const nodeBaseColor = isDark ? "#64748b" : "#94a3b8";
      const nodeConnectedColor = isDark ? "#38bdf8" : "#0284c7";
      const nodeDimmedColor = isDark
        ? "rgba(51, 65, 85, 0.3)"
        : "rgba(203, 213, 225, 0.4)";
      const textColor = isDark ? "#f1f5f9" : "#0f172a";

      // Clear Canvas
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      // Draw subtle background dots for Obsidian feel
      ctx.save();
      const dotSpacing = 30 * st.zoom;
      if (dotSpacing >= 15) {
        const dotColor = isDark
          ? "rgba(255, 255, 255, 0.04)"
          : "rgba(0, 0, 0, 0.05)";
        ctx.fillStyle = dotColor;
        const startX = ((st.panX + width / 2) % dotSpacing + dotSpacing) %
          dotSpacing;
        const startY = ((st.panY + height / 2) % dotSpacing + dotSpacing) %
          dotSpacing;
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

        const isHighlighted = hovered &&
          (hovered.id === edge.source || hovered.id === edge.target);

        ctx.beginPath();
        ctx.moveTo(src.x, src.y);
        ctx.lineTo(tgt.x, tgt.y);

        if (isHighlighted) {
          ctx.strokeStyle = highlightEdgeColor;
          ctx.lineWidth = 2.0 / st.zoom;
        } else if (hovered) {
          ctx.strokeStyle = isDark
            ? "rgba(71, 85, 105, 0.1)"
            : "rgba(226, 232, 240, 0.3)";
          ctx.lineWidth = 0.8 / st.zoom;
        } else {
          ctx.strokeStyle = edgeColor;
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
        const matchesQuery = query &&
          (node.title.toLowerCase().includes(query) ||
            node.id.toLowerCase().includes(query));

        let nodeColor = nodeBaseColor;
        let scale = 1;

        if (hovered) {
          if (isHovered) {
            nodeColor = "#fbbf24"; // bright amber for current hovered node
            scale = 1.35;
          } else if (isNeighbor) {
            nodeColor = nodeConnectedColor;
            scale = 1.2;
          } else {
            nodeColor = nodeDimmedColor;
          }
        } else if (query) {
          if (matchesQuery) {
            nodeColor = "#f59e0b"; // match highlight
            scale = 1.3;
          } else {
            nodeColor = nodeDimmedColor;
          }
        } else if (node.linkCount > 0) {
          nodeColor = nodeConnectedColor;
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * scale, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.fill();

        // Subtle glow for active/hovered node
        if (isHovered || matchesQuery) {
          ctx.strokeStyle = isDark
            ? "rgba(255, 255, 255, 0.8)"
            : "rgba(0, 0, 0, 0.6)";
          ctx.lineWidth = 1.5 / st.zoom;
          ctx.stroke();
        }

        // Labels: show when zoomed in, or if hovered/neighbor/query match
        const shouldShowLabel = isHovered ||
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
          ctx.font = `${isHovered ? "600" : "400"} ${fontSize}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "top";

          // Label text
          const displayTitle = node.title.length > 25
            ? node.title.slice(0, 24) + "…"
            : node.title;

          // Shadow / background glow for readability
          ctx.fillStyle = isHovered
            ? (isDark ? "#ffffff" : "#0f172a")
            : textColor;
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

    stateRef.current.animId = requestAnimationFrame(stepSimulation);

    return () => {
      running = false;
      globalThis.removeEventListener("resize", updateSize);
      if (stateRef.current.animId !== null) {
        cancelAnimationFrame(stateRef.current.animId);
      }
    };
  }, [initialData]);

  // Coordinate helper
  const screenToWorld = (screenX: number, screenY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const st = stateRef.current;
    const x = (screenX - rect.left - rect.width / 2 - st.panX) / st.zoom;
    const y = (screenY - rect.top - rect.height / 2 - st.panY) / st.zoom;
    return { x, y };
  };

  const findNodeAt = (screenX: number, screenY: number): SimNode | null => {
    const st = stateRef.current;
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
    const st = stateRef.current;
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
    const st = stateRef.current;
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
        setHoveredNodeInfo(hovered);
        if (canvasRef.current) {
          canvasRef.current.style.cursor = hovered ? "pointer" : "grab";
        }
      }
    }
  };

  const handleMouseUp = (_e: MouseEvent) => {
    const st = stateRef.current;
    if (!st.hasDragged && st.draggedNode) {
      // Clicked on node without dragging -> Navigate to post!
      globalThis.location.href = st.draggedNode.path;
    }
    st.draggedNode = null;
    st.isPanning = false;
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const st = stateRef.current;
    const canvas = canvasRef.current;
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
    const st = stateRef.current;
    st.zoom = 1;
    st.panX = 0;
    st.panY = 0;
    st.alpha = 0.5;
  };

  const zoomIn = () => {
    const st = stateRef.current;
    st.zoom = Math.min(st.zoom * 1.25, 4.5);
    st.alpha = Math.max(st.alpha, 0.1);
  };

  const zoomOut = () => {
    const st = stateRef.current;
    st.zoom = Math.max(st.zoom * 0.8, 0.15);
    st.alpha = Math.max(st.alpha, 0.1);
  };

  const isDark = theme === "dark";

  return (
    <div
      ref={containerRef}
      class={`relative w-full h-[calc(100vh-140px)] min-h-[500px] select-none overflow-hidden rounded-xl border ${
        isDark
          ? "bg-slate-950 border-slate-800 text-slate-100"
          : "bg-slate-50 border-slate-200 text-slate-800"
      }`}
    >
      <canvas
        ref={canvasRef}
        class="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      />

      {/* Top Floating Control Bar */}
      <div class="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Search Input & Toggles */}
        <div
          class="flex items-center gap-2 pointer-events-auto bg-opacity-90 backdrop-blur-md px-3 py-2 rounded-lg shadow-lg border text-sm max-w-sm w-full md:w-auto"
          style={{
            backgroundColor: isDark
              ? "rgba(15, 23, 42, 0.85)"
              : "rgba(255, 255, 255, 0.9)",
            borderColor: isDark
              ? "rgba(51, 65, 85, 0.7)"
              : "rgba(226, 232, 240, 0.9)",
          }}
        >
          <svg
            class="w-4 h-4 text-slate-400 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onInput={(e) =>
              setSearchQuery((e.target as HTMLInputElement).value)}
            class="bg-transparent border-none outline-none w-full text-sm placeholder-slate-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              class="text-xs text-slate-400 hover:text-slate-200 px-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div
          class="flex items-center gap-2 pointer-events-auto bg-opacity-90 backdrop-blur-md px-3 py-2 rounded-lg shadow-lg border text-xs"
          style={{
            backgroundColor: isDark
              ? "rgba(15, 23, 42, 0.85)"
              : "rgba(255, 255, 255, 0.9)",
            borderColor: isDark
              ? "rgba(51, 65, 85, 0.7)"
              : "rgba(226, 232, 240, 0.9)",
          }}
        >
          <label class="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showOrphans}
              onChange={(e) =>
                setShowOrphans((e.target as HTMLInputElement).checked)}
              class="rounded text-sky-500 focus:ring-0 cursor-pointer"
            />
            <span>Orphans</span>
          </label>

          <span class="w-px h-4 bg-slate-700/40 mx-1" />

          <button
            type="button"
            onClick={zoomIn}
            class="p-1 rounded hover:bg-slate-700/30 text-base leading-none"
            title="Zoom in"
          >
            +
          </button>
          <button
            type="button"
            onClick={zoomOut}
            class="p-1 rounded hover:bg-slate-700/30 text-base leading-none"
            title="Zoom out"
          >
            −
          </button>
          <button
            type="button"
            onClick={resetView}
            class="p-1 rounded hover:bg-slate-700/30 text-xs"
            title="Reset position"
          >
            ⟲
          </button>

          <span class="w-px h-4 bg-slate-700/40 mx-1" />

          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            class="p-1 rounded hover:bg-slate-700/30 text-xs"
            title="Toggle theme"
          >
            {isDark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </div>

      {/* Bottom Info Bar / Hover details */}
      <div class="absolute bottom-4 left-4 right-4 flex items-end justify-between pointer-events-none text-xs">
        {/* Hovered node card */}
        {hoveredNodeInfo
          ? (
            <div
              class="pointer-events-auto max-w-md bg-opacity-95 backdrop-blur-md p-3 rounded-lg shadow-xl border animate-fade-in"
              style={{
                backgroundColor: isDark
                  ? "rgba(15, 23, 42, 0.95)"
                  : "rgba(255, 255, 255, 0.95)",
                borderColor: isDark
                  ? "rgba(56, 189, 248, 0.6)"
                  : "rgba(2, 132, 199, 0.6)",
              }}
            >
              <div class="font-semibold text-sm mb-1 line-clamp-2">
                <a
                  href={hoveredNodeInfo.path}
                  class="hover:text-sky-400 transition-colors"
                >
                  {hoveredNodeInfo.title}
                </a>
              </div>
              <div class="flex items-center gap-3 text-slate-400">
                <span>{hoveredNodeInfo.publishedAt.slice(0, 10)}</span>
                <span>•</span>
                <span>{hoveredNodeInfo.linkCount} connections</span>
                {hoveredNodeInfo.category && (
                  <>
                    <span>•</span>
                    <span class="bg-sky-500/20 text-sky-400 px-1.5 py-0.5 rounded text-[11px]">
                      {hoveredNodeInfo.category}
                    </span>
                  </>
                )}
              </div>
              <div class="mt-1 text-slate-400 text-[11px]">
                Click node to open article
              </div>
            </div>
          )
          : (
            <div
              class="bg-opacity-80 backdrop-blur-md px-3 py-1.5 rounded-md border text-slate-400"
              style={{
                backgroundColor: isDark
                  ? "rgba(15, 23, 42, 0.7)"
                  : "rgba(255, 255, 255, 0.8)",
                borderColor: isDark
                  ? "rgba(51, 65, 85, 0.5)"
                  : "rgba(226, 232, 240, 0.8)",
              }}
            >
              Hover or drag a node • Scroll to zoom
            </div>
          )}

        {/* Graph statistics badge */}
        <div
          class="bg-opacity-80 backdrop-blur-md px-3 py-1.5 rounded-md border text-slate-400"
          style={{
            backgroundColor: isDark
              ? "rgba(15, 23, 42, 0.7)"
              : "rgba(255, 255, 255, 0.8)",
            borderColor: isDark
              ? "rgba(51, 65, 85, 0.5)"
              : "rgba(226, 232, 240, 0.8)",
          }}
        >
          {initialData.nodes.length} Notes • {initialData.edges.length} Links
        </div>
      </div>
    </div>
  );
}
