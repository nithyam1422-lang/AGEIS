import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line, OrbitControls, Stars } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Bot,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  Cpu,
  Database,
  FileText,
  Gauge,
  History,
  Menu,
  PanelTop,
  Play,
  Radar,
  RotateCcw,
  ScanSearch,
  Server,
  Shield,
  ShieldCheck,
  Sparkles,
  Terminal,
  Workflow,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";

type IncidentPhase = "monitoring" | "investigating" | "approval" | "repairing" | "complete" | "learning";
type Workspace =
  | "Command Center"
  | "Live Threats"
  | "AI Investigation"
  | "Memory Graph"
  | "Repair Center"
  | "Incident History"
  | "Adaptive Runbooks"
  | "Post-Mortems"
  | "Learning Analytics";

const navigation: { label: Workspace; icon: typeof PanelTop }[] = [
  { label: "Command Center", icon: PanelTop },
  { label: "Live Threats", icon: Radar },
  { label: "AI Investigation", icon: ScanSearch },
  { label: "Memory Graph", icon: BrainCircuit },
  { label: "Repair Center", icon: ShieldCheck },
  { label: "Incident History", icon: History },
  { label: "Adaptive Runbooks", icon: Workflow },
  { label: "Post-Mortems", icon: FileText },
  { label: "Learning Analytics", icon: Gauge },
];

const investigationSteps = [
  "Security events analyzed",
  "Attack pattern identified",
  "Historical incidents retrieved",
  "Root cause identified",
  "Previous successful repair found",
  "Repair plan generated",
];

const repairSteps = [
  "Isolating compromised account",
  "Revoking compromised sessions",
  "Rotating finance credentials",
  "Verifying system integrity",
];

const memoryIncidents = [
  { id: "INC-0184", similarity: "94%", time: "09m 14s", cause: "Stolen OAuth refresh token", repair: "Session revocation and credential rotation" },
  { id: "INC-0201", similarity: "88%", time: "11m 32s", cause: "Password reused outside organization", repair: "Identity containment and conditional access" },
  { id: "INC-0237", similarity: "82%", time: "07m 48s", cause: "Legacy finance service account", repair: "Token purge and managed identity migration" },
];

function AegisMark({ small = false }: { small?: boolean }) {
  return <div className={`aegis-mark ${small ? "aegis-mark-small" : ""}`} aria-hidden="true"><span /><span /><span /></div>;
}

function StatusDot({ tone = "cyan" }: { tone?: "cyan" | "red" | "amber" | "green" }) {
  return <span className={`status-dot status-dot-${tone}`} />;
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <span className="section-label">{children}</span>;
}

function MiniMetric({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "danger" | "cyan" }) {
  return <div className="mini-metric"><span>{label}</span><strong className={tone}>{value}</strong></div>;
}

function ServerNode({ position, state }: { position: [number, number, number]; state: "healthy" | "compromised" | "repairing" }) {
  const group = useRef<THREE.Group>(null);
  const color = state === "healthy" ? "#39e7dc" : state === "repairing" ? "#f9be4b" : "#fb546b";
  useFrame(({ clock }) => {
    if (group.current) group.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 1.6 + position[0]) * 0.035;
  });
  return (
    <group ref={group} position={position}>
      <pointLight color={color} intensity={state === "compromised" ? 3 : 1.4} distance={3} />
      <mesh position={[0, -0.14, 0]}><boxGeometry args={[1.25, 0.26, 0.78]} /><meshStandardMaterial color="#111b31" emissive="#081122" metalness={0.65} roughness={0.3} /></mesh>
      {[0, 0.28, 0.56].map((offset) => (
        <group key={offset} position={[0, offset, 0]}>
          <mesh><boxGeometry args={[1.15, 0.23, 0.7]} /><meshStandardMaterial color="#172640" emissive="#0d1930" metalness={0.7} roughness={0.25} /></mesh>
          <mesh position={[-0.37, 0.015, 0.356]}><boxGeometry args={[0.18, 0.045, 0.012]} /><meshBasicMaterial color={color} /></mesh>
          <mesh position={[0.05, 0.015, 0.356]}><boxGeometry args={[0.36, 0.045, 0.012]} /><meshBasicMaterial color="#2b486f" /></mesh>
        </group>
      ))}
      <mesh position={[0, -0.33, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[1.02, 40]} /><meshBasicMaterial color={color} transparent opacity={state === "compromised" ? 0.18 : 0.09} /></mesh>
    </group>
  );
}

function CloudNode({ position }: { position: [number, number, number] }) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => { if (group.current) group.current.rotation.y = clock.getElapsedTime() * 0.2; });
  return <group ref={group} position={position}>
    <pointLight color="#5c7dff" intensity={2} distance={3} />
    {[[-0.34, 0, 0], [0, 0.16, 0], [0.34, 0, 0], [0.04, -0.19, 0]].map((pos, index) => <mesh key={index} position={pos as [number, number, number]}><sphereGeometry args={[index === 1 ? 0.42 : 0.32, 28, 28]} /><meshStandardMaterial color="#243b79" emissive="#223f9a" emissiveIntensity={1.2} metalness={0.35} roughness={0.16} /></mesh>)}
    <mesh rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.68, 0.7, 48]} /><meshBasicMaterial color="#68baff" transparent opacity={0.5} /></mesh>
  </group>;
}

function DeviceNode({ position }: { position: [number, number, number] }) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => { if (group.current) group.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 1.3) * 0.03; });
  return <group ref={group} position={position}>
    <pointLight color="#4f9bd9" intensity={1.3} distance={2.5} />
    <mesh><boxGeometry args={[0.74, 0.48, 0.12]} /><meshStandardMaterial color="#172743" emissive="#0d1d3d" metalness={0.75} roughness={0.22} /></mesh>
    <mesh position={[0, 0, 0.065]}><planeGeometry args={[0.62, 0.35]} /><meshBasicMaterial color="#1e7fba" transparent opacity={0.4} /></mesh>
    <mesh position={[0, -0.34, 0]}><boxGeometry args={[0.18, 0.23, 0.12]} /><meshStandardMaterial color="#1c2940" /></mesh>
  </group>;
}

function AICore({ phase }: { phase: IncidentPhase }) {
  const group = useRef<THREE.Group>(null); const ringOne = useRef<THREE.Mesh>(null); const ringTwo = useRef<THREE.Mesh>(null);
  const active = phase === "investigating" || phase === "repairing";
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (group.current) group.current.position.y = 0.36 + Math.sin(time * 1.5) * 0.08;
    if (ringOne.current) ringOne.current.rotation.z = time * (active ? 1.15 : 0.35);
    if (ringTwo.current) ringTwo.current.rotation.x = time * (active ? -0.9 : -0.22);
  });
  return <group ref={group} position={[0, 0.36, 0]}>
    <pointLight color="#58f7ed" intensity={active ? 5.5 : 2.8} distance={5} />
    <mesh><icosahedronGeometry args={[0.55, 2]} /><meshStandardMaterial color="#71fff1" emissive="#1ec7c1" emissiveIntensity={active ? 2.4 : 1.25} metalness={0.55} roughness={0.08} /></mesh>
    <mesh ref={ringOne} rotation={[0.9, 0.3, 0]}><torusGeometry args={[0.92, 0.022, 8, 72]} /><meshBasicMaterial color="#70fff3" transparent opacity={0.76} /></mesh>
    <mesh ref={ringTwo} rotation={[1.75, 0, 0.7]}><torusGeometry args={[1.18, 0.012, 8, 72]} /><meshBasicMaterial color="#4777ff" transparent opacity={0.56} /></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.52, 0]}><ringGeometry args={[1.4, 1.43, 72]} /><meshBasicMaterial color="#3dd9e3" transparent opacity={0.35} /></mesh>
  </group>;
}

function MemoryCore({ phase }: { phase: IncidentPhase }) {
  const group = useRef<THREE.Group>(null); const learning = phase === "learning";
  useFrame(({ clock }) => { if (group.current) group.current.rotation.y = clock.getElapsedTime() * 0.18; });
  return <group ref={group} position={[3.35, 1.7, -0.7]}>
    <pointLight color={learning ? "#7b8cff" : "#a66bff"} intensity={learning ? 4 : 2.2} distance={4} />
    <mesh><octahedronGeometry args={[0.46, 1]} /><meshStandardMaterial color="#8478ff" emissive="#4433a8" emissiveIntensity={learning ? 2.2 : 1} metalness={0.7} roughness={0.12} /></mesh>
    <mesh rotation={[0.9, 0.2, 0]}><torusGeometry args={[0.8, 0.018, 8, 48]} /><meshBasicMaterial color="#a99dff" transparent opacity={0.7} /></mesh>
    {[[0.94, 0.15, 0.1], [-0.82, 0.48, 0], [-0.38, -0.85, 0.24]].map((position, index) => <mesh key={index} position={position as [number, number, number]}><sphereGeometry args={[0.12, 20, 20]} /><meshBasicMaterial color="#a99dff" /></mesh>)}
  </group>;
}

function NetworkLink({ from, to, danger = false, active = false, repairProgress }: { from: [number, number, number]; to: [number, number, number]; danger?: boolean; active?: boolean; repairProgress: number }) {
  const pulse = useRef<THREE.Mesh>(null);
  const color = danger && repairProgress < 30 ? "#f34c65" : danger && repairProgress < 65 ? "#f4c459" : danger ? "#4ee7dc" : "#326eaa";
  useFrame(({ clock }) => {
    if (!pulse.current) return;
    const progress = (Math.sin(clock.getElapsedTime() * (danger ? 2 : 1.2)) + 1) / 2;
    pulse.current.position.lerpVectors(new THREE.Vector3(...from), new THREE.Vector3(...to), progress);
    pulse.current.visible = active || danger;
  });
  return <group><Line points={[from, to]} color={color} lineWidth={danger ? 1.9 : 0.82} transparent opacity={danger ? Math.max(0.18, 0.82 - repairProgress / 125) : 0.33} /><mesh ref={pulse}><sphereGeometry args={[0.065, 12, 12]} /><meshBasicMaterial color={color} /></mesh></group>;
}

function ThreatObject({ phase, repairProgress }: { phase: IncidentPhase; repairProgress: number }) {
  const threat = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!threat.current) return;
    const time = clock.getElapsedTime(); const start = new THREE.Vector3(3.65, 0.7, 0.2); const end = new THREE.Vector3(-3.25, 0.45, 0);
    let travel = (Math.sin(time * 0.42) + 1) / 2; if (phase === "repairing") travel = 0.94;
    if (phase === "complete" || phase === "learning") { threat.current.visible = false; return; }
    threat.current.visible = phase !== "repairing" || repairProgress < 93; threat.current.position.lerpVectors(start, end, travel); threat.current.position.y += Math.sin(time * 4) * 0.18; threat.current.rotation.x = time * 2; threat.current.rotation.y = time * 2.4;
    threat.current.scale.setScalar(phase === "repairing" ? Math.max(0.02, 1 - repairProgress / 100) : 1);
  });
  return <group ref={threat}><pointLight color="#ff3e57" intensity={4} distance={3.5} /><mesh><icosahedronGeometry args={[0.22, 1]} /><meshStandardMaterial color="#ff536a" emissive="#ff233e" emissiveIntensity={2.4} metalness={0.25} roughness={0.16} /></mesh><mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.34, 0.015, 6, 30]} /><meshBasicMaterial color="#ff6d7c" /></mesh></group>;
}

function RepairShield({ active }: { active: boolean }) {
  const shell = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => { if (shell.current) { const scale = active ? 1 + Math.sin(clock.getElapsedTime() * 3) * 0.035 : 0.02; shell.current.scale.setScalar(scale); shell.current.rotation.y = clock.getElapsedTime() * 0.35; } });
  return <mesh ref={shell} position={[-3.25, 0.5, 0]}><sphereGeometry args={[1.15, 24, 18]} /><meshBasicMaterial color="#52f6e6" transparent opacity={active ? 0.11 : 0} wireframe /></mesh>;
}

function ResponseBeam({ phase, repairProgress }: { phase: IncidentPhase; repairProgress: number }) {
  const pulse = useRef<THREE.Mesh>(null);
  const active = phase === "investigating" || phase === "approval" || phase === "repairing";
  const color = phase === "repairing" ? "#f6c859" : "#67f5e9";
  useFrame(({ clock }) => {
    if (!pulse.current) return;
    const direction = phase === "repairing" ? 1 - (Math.sin(clock.getElapsedTime() * 4) + 1) / 2 : (Math.sin(clock.getElapsedTime() * 2.8) + 1) / 2;
    pulse.current.position.lerpVectors(new THREE.Vector3(0, 0.68, 0), new THREE.Vector3(-3.25, 0.6, 0), direction);
    pulse.current.scale.setScalar(phase === "repairing" ? 1.15 - repairProgress / 700 : 0.85);
  });
  return <group visible={active}><Line points={[[0, 0.68, 0], [-3.25, 0.6, 0]]} color={color} lineWidth={phase === "repairing" ? 1.35 : 0.8} transparent opacity={phase === "repairing" ? 0.72 : 0.35} /><mesh ref={pulse}><sphereGeometry args={[0.09, 16, 16]} /><meshBasicMaterial color={color} /></mesh></group>;
}

function RepairSwarm({ phase, repairProgress }: { phase: IncidentPhase; repairProgress: number }) {
  const group = useRef<THREE.Group>(null);
  const active = phase === "repairing" || phase === "complete" || phase === "learning";
  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.rotation.y = clock.getElapsedTime() * 2.1;
    group.current.rotation.z = Math.sin(clock.getElapsedTime() * 1.8) * 0.35;
    const scale = phase === "repairing" ? 0.55 + repairProgress / 135 : 1.28;
    group.current.scale.setScalar(scale);
  });
  return <group ref={group} position={[-3.25, 0.52, 0]} visible={active}>
    {[...Array(10)].map((_, index) => {
      const angle = (index / 10) * Math.PI * 2;
      return <mesh key={index} position={[Math.cos(angle) * (0.78 + (index % 2) * 0.18), Math.sin(angle * 2) * 0.28, Math.sin(angle) * (0.64 + (index % 2) * 0.15)]}><sphereGeometry args={[0.042, 10, 10]} /><meshBasicMaterial color={index % 2 ? "#6cf8ed" : "#f8cd63"} /></mesh>;
    })}
    <pointLight color="#62f9e7" intensity={phase === "repairing" ? 3.5 : 1.6} distance={3} />
  </group>;
}

function RepairWave({ phase, repairProgress }: { phase: IncidentPhase; repairProgress: number }) {
  const wave = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!wave.current) return;
    const active = phase === "repairing" || phase === "complete" || phase === "learning";
    const scale = active ? 0.7 + (repairProgress / 100) * 1.4 + Math.sin(clock.getElapsedTime() * 4) * 0.04 : 0.02;
    wave.current.scale.setScalar(scale);
  });
  return <mesh ref={wave} position={[-3.25, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.68, 0.72, 64]} /><meshBasicMaterial color="#5ff5e7" transparent opacity={phase === "repairing" ? 0.7 : phase === "complete" || phase === "learning" ? 0.32 : 0} /></mesh>;
}

function SceneCamera({ phase }: { phase: IncidentPhase }) {
  const { camera } = useThree();
  useFrame(() => { const repair = phase === "repairing" || phase === "complete" || phase === "learning"; camera.position.lerp(repair ? new THREE.Vector3(-0.7, 3.4, 8.2) : new THREE.Vector3(0, 3.8, 9.8), 0.052); camera.lookAt(repair ? -0.85 : 0, 0.35, 0); });
  return null;
}

function SOCScene({ phase, repairProgress }: { phase: IncidentPhase; repairProgress: number }) {
  const financeState = phase === "repairing" ? "repairing" : phase === "complete" || phase === "learning" ? "healthy" : "compromised";
  const threatActive = phase !== "complete" && phase !== "learning";
  return <Canvas className="soc-canvas" dpr={[1, 1.5]} camera={{ position: [0, 3.8, 9.8], fov: 46 }}>
    <color attach="background" args={["#061023"]} /><fog attach="fog" args={["#061023", 8, 16]} /><ambientLight intensity={0.38} /><directionalLight color="#729aff" position={[4, 6, 3]} intensity={1.1} /><Stars radius={25} depth={18} count={700} factor={2} saturation={0} fade speed={0.35} /><gridHelper args={[16, 18, "#14315a", "#0b1b36"]} position={[0, -0.62, 0]} />
    <NetworkLink from={[-3.25, 0.35, 0]} to={[0, 0.35, 0]} active repairProgress={repairProgress} danger={threatActive} /><NetworkLink from={[0, 0.35, 0]} to={[3.35, 1.7, -0.7]} active repairProgress={repairProgress} /><NetworkLink from={[0, 0.35, 0]} to={[3.55, 0.45, 0.1]} active repairProgress={repairProgress} /><NetworkLink from={[0, 0.35, 0]} to={[-2.3, 1.5, -1.4]} active repairProgress={repairProgress} /><NetworkLink from={[-2.3, 1.5, -1.4]} to={[3.55, 0.45, 0.1]} repairProgress={repairProgress} />
    <ServerNode position={[-3.25, 0.35, 0]} state={financeState} /><ServerNode position={[-2.3, 1.5, -1.4]} state="healthy" /><CloudNode position={[3.55, 0.45, 0.1]} /><DeviceNode position={[2.1, -0.05, -1.4]} /><DeviceNode position={[1.65, 1.65, 0.65]} /><AICore phase={phase} /><MemoryCore phase={phase} /><ThreatObject phase={phase} repairProgress={repairProgress} /><ResponseBeam phase={phase} repairProgress={repairProgress} /><RepairSwarm phase={phase} repairProgress={repairProgress} /><RepairWave phase={phase} repairProgress={repairProgress} /><RepairShield active={phase === "repairing" || phase === "complete" || phase === "learning"} /><SceneCamera phase={phase} /><OrbitControls enablePan={false} enableZoom={false} minPolarAngle={0.85} maxPolarAngle={1.35} autoRotate={phase === "monitoring"} autoRotateSpeed={0.25} />
  </Canvas>;
}

function ThreatStatus({ phase }: { phase: IncidentPhase }) {
  const data = phase === "repairing" ? ["REPAIR IN PROGRESS", <Zap size={15} />, "amber"] : phase === "complete" || phase === "learning" ? ["SYSTEM SECURE", <ShieldCheck size={15} />, "green"] : phase === "investigating" || phase === "approval" ? ["THREAT CONTAINED", <Shield size={15} />, "cyan"] : ["THREAT DETECTED", <AlertTriangle size={15} />, "red"];
  return <div className={`scene-alert scene-alert-${data[2]}`}>{data[1]}<span>{data[0]}</span></div>;
}

function StepRail({ phase, repairProgress }: { phase: IncidentPhase; repairProgress: number }) {
  const labels = ["DETECT", "DIAGNOSE", "RECALL", "REPAIR", "VERIFY", "LEARN"];
  const active = phase === "monitoring" ? 0 : phase === "investigating" ? 1 : phase === "approval" ? 2 : phase === "repairing" ? repairProgress > 86 ? 4 : 3 : phase === "complete" ? 4 : 5;
  return <div className="step-rail">{labels.map((label, index) => <div key={label} className={`rail-step ${index <= active ? "is-active" : ""} ${index === active ? "is-current" : ""}`}><span>{index < active ? <Check size={12} strokeWidth={3} /> : String(index + 1).padStart(2, "0")}</span><small>{label}</small></div>)}</div>;
}

function InvestigationPanel({ phase, investigationIndex, onInvestigate, onAuthorize }: { phase: IncidentPhase; investigationIndex: number; onInvestigate: () => void; onAuthorize: () => void }) {
  const ready = phase === "approval";
  return <section className="panel investigation-panel">
    <div className="panel-heading"><div><SectionLabel>AI Investigation</SectionLabel><h2>{phase === "monitoring" ? "Awaiting analyst direction" : ready ? "Repair strategy established" : "Investigating credential compromise"}</h2></div><Bot className="heading-glyph" size={22} /></div>
    {phase === "monitoring" ? <div className="empty-investigation"><div className="scan-orb"><ScanSearch size={25} /></div><p>AEGIS-X has contained the affected account and is ready to investigate the incident.</p><button className="button button-primary" onClick={onInvestigate}><ScanSearch size={15} /> Investigate incident</button></div> : <>
      <div className="investigation-list">{investigationSteps.map((step, index) => { const visible = index <= investigationIndex || ready || phase === "repairing" || phase === "complete" || phase === "learning"; return <motion.div initial={false} animate={{ opacity: visible ? 1 : 0.32, x: visible ? 0 : -5 }} className="investigation-row" key={step}>{visible ? <CheckCircle2 size={16} /> : <Circle size={16} />}<span>{step}</span>{index === investigationIndex && phase === "investigating" && <i>analyzing</i>}</motion.div>; })}</div>
      {ready && <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="memory-found"><BrainCircuit size={18} /><div><strong>7 similar incidents found</strong><span>Organizational Hindsight memory matched the credential attack pattern.</span></div></motion.div>}
      {ready && <button className="button button-primary full-button" onClick={onAuthorize}><ShieldCheck size={15} /> Review repair recommendation</button>}
    </>}
  </section>;
}

function RepairRecommendation({ phase, onAuthorize }: { phase: IncidentPhase; onAuthorize: () => void }) {
  return <section className={`panel recommendation-panel ${phase === "approval" ? "is-ready" : ""}`}>
    <div className="panel-heading"><div><SectionLabel>Autonomous repair decision</SectionLabel><h2>Recommended repair</h2></div><Sparkles className="heading-glyph" size={20} /></div>
    <ol className="repair-plan"><li><span>01</span><p>Isolate compromised account</p></li><li><span>02</span><p>Revoke active sessions</p></li><li><span>03</span><p>Rotate credentials</p></li><li><span>04</span><p>Verify affected systems</p></li></ol>
    <div className="reason-grid"><div><strong>7</strong><span>historical incidents</span></div><div><strong>5</strong><span>successful outcomes</span></div><div><strong>2</strong><span>matching patterns</span></div></div>
    <div className="approval-band"><div><StatusDot tone="amber" /><span>AI confidence</span><strong>94%</strong></div>{phase === "approval" ? <button className="button button-authorization" onClick={onAuthorize}><Zap size={14} /> Launch now</button> : <span className="waiting-copy">Autonomous policy active</span>}</div>
    {phase === "approval" && <div className="autonomy-note"><Bot size={14} /> AEGIS-X is cleared to self-remediate in this isolated digital twin. Repair begins automatically.</div>}
  </section>;
}

function RepairConsole({ phase, progress, onCommit }: { phase: IncidentPhase; progress: number; onCommit: () => void }) {
  const repairing = phase === "repairing"; const repaired = phase === "complete" || phase === "learning"; const completeIndex = repairing ? Math.min(3, Math.floor(progress / 25)) : repaired ? 4 : 0;
  return <section className={`repair-console ${repaired ? "is-repaired" : ""}`}>
    <div className="repair-console-head"><div><SectionLabel>{repaired ? "Post-repair intelligence" : "Autonomous 3D repair"}</SectionLabel><h2>{repaired ? "Threat neutralized" : "Agent repair sequence"}</h2></div><span className="sim-chip"><Activity size={13} /> SIMULATED</span></div>
    {repairing && <><div className="repair-stage-strip"><span className={progress >= 1 ? "done" : ""}>ISOLATE</span><span className={progress >= 28 ? "done" : ""}>CONTAIN</span><span className={progress >= 55 ? "done" : ""}>REMEDIATE</span><span className={progress >= 82 ? "done" : ""}>VERIFY</span></div><div className="repair-progress-row"><span>REPAIR PROGRESS</span><strong>{String(progress).padStart(2, "0")}%</strong></div><div className="progress-track"><motion.div className="progress-fill" animate={{ width: `${progress}%` }} transition={{ ease: "linear", duration: 0.16 }} /></div><div className="current-action"><Zap size={15} /><div><span>CURRENT ACTION</span><strong>{progress < 28 ? "Deploying zero-trust isolation boundary..." : progress < 55 ? "Revoking compromised sessions..." : progress < 82 ? "Rotating active finance credentials..." : "Running integrity and lateral-movement checks..."}</strong></div></div></>}
    <div className="repair-checklist">{repairSteps.map((step, index) => <div className={index < completeIndex ? "is-complete" : index === completeIndex && repairing ? "is-working" : ""} key={step}>{index < completeIndex ? <Check size={14} strokeWidth={3} /> : index === completeIndex && repairing ? <Activity size={14} /> : <Circle size={14} />}<span>{step}</span></div>)}</div>
    {repaired && <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="neutralized-lockup"><ShieldCheck size={28} /><div><strong>THREAT NEUTRALIZED</strong><span>SYSTEM SECURE</span></div></motion.div>}
    {phase === "complete" && <button className="button button-primary full-button commit-button" onClick={onCommit}><Database size={15} /> Commit to Hindsight memory</button>}{phase === "learning" && <div className="learned-message"><CheckCircle2 size={16} /> AEGIS-X has learned from this incident.</div>}
  </section>;
}

function MemoryPanel({ phase, selectedMemory, onSelect, onDeploy }: { phase: IncidentPhase; selectedMemory: number; onSelect: (index: number) => void; onDeploy?: () => void }) {
  const current = memoryIncidents[selectedMemory];
  return <section className="panel memory-panel"><div className="panel-heading"><div><SectionLabel>Hindsight memory</SectionLabel><h2>Proven response context</h2></div><BrainCircuit className="heading-glyph" size={21} /></div>
    <div className="memory-map"><div className="memory-root"><AegisMark small /><span>CURRENT<br />INCIDENT</span></div><div className="memory-line line-one" /><div className="memory-line line-two" /><div className="memory-line line-three" /><div className="memory-branch-label">HISTORICAL<br />MATCHES</div>{memoryIncidents.map((incident, index) => <button key={incident.id} onClick={() => onSelect(index)} className={`memory-node memory-node-${index} ${selectedMemory === index ? "is-selected" : ""}`}><strong>{incident.id}</strong><span>{incident.similarity} similarity</span></button>)}</div>
    <div className="memory-detail"><div><span>ROOT CAUSE</span><p>{current.cause}</p></div><div><span>REPAIR THAT WORKED</span><p>{current.repair}</p></div><div><span>REPAIR TIME</span><p>{current.time}</p></div></div>{phase === "learning" && <div className="memory-growth"><Sparkles size={14} /> Memory confidence increased by 2.4%</div>}{onDeploy && phase === "monitoring" && <button className="button button-primary memory-deploy" onClick={onDeploy}><Zap size={14} /> Use this proven response</button>}
  </section>;
}

function ComparisonPanel() {
  return <section className="comparison-section"><div className="comparison-copy"><SectionLabel>Operational difference</SectionLabel><h2>Memory turns response into advantage.</h2><p>AEGIS-X does not begin every investigation from zero. Each verified outcome becomes reusable organizational intelligence.</p></div><div className="comparison-columns"><div className="comparison-column without"><span>WITHOUT MEMORY</span><ul><li>Generic response</li><li>No historical context</li><li>Longer investigation</li><li>Repeated mistakes</li></ul></div><div className="comparison-column with"><span>WITH AEGIS-X MEMORY</span><ul><li>Historical context</li><li>Known attack pattern</li><li>Proven repair</li><li>Adaptive response</li></ul></div></div></section>;
}

function DataLine({ title, body, status, danger = false }: { title: string; body: string; status: string; danger?: boolean }) { return <div className="data-line"><div className={`data-line-dot ${danger ? "danger" : ""}`} /><div><strong>{title}</strong><span>{body}</span></div><em className={danger ? "danger" : ""}>{status}</em></div>; }
function MetricBar({ label, amount, value }: { label: string; amount: string; value: number }) { return <div className="metric-bar"><div><span>{label}</span><strong>{amount}</strong></div><i><b style={{ width: `${value}%` }} /></i></div>; }

function ModulePanel({ workspace, phase, onStart, onOpenCommand, onReplay, runbookVersion, onPublishRunbook, postmortemGenerated, onGeneratePostmortem, analyticsRange, onSetAnalyticsRange }: { workspace: Workspace; phase: IncidentPhase; onStart: () => void; onOpenCommand: () => void; onReplay: () => void; runbookVersion: string; onPublishRunbook: () => void; postmortemGenerated: boolean; onGeneratePostmortem: () => void; analyticsRange: "7d" | "30d"; onSetAnalyticsRange: (range: "7d" | "30d") => void }) {
  if (workspace === "Live Threats") return <section className="panel module-panel"><div className="panel-heading"><div><SectionLabel>Live threats</SectionLabel><h2>Active detection queue</h2></div><Radar className="heading-glyph" /></div><div className="data-list"><DataLine title="INC-2847" body="Credential compromise - Finance Server" status={phase === "monitoring" ? "CRITICAL" : phase === "repairing" ? "REPAIRING" : phase === "complete" || phase === "learning" ? "RESOLVED" : "ANALYZING"} danger={phase === "monitoring"} /><DataLine title="INC-2845" body="Unusual MFA fatigue pattern - Sales" status="HIGH" /><DataLine title="INC-2839" body="Cloud storage policy drift - Research" status="MEDIUM" /></div><div className="module-action-row"><div><StatusDot tone={phase === "monitoring" ? "red" : "cyan"} /><span>{phase === "monitoring" ? "Agent is ready to contain INC-2847" : "AEGIS-X is handling the selected incident"}</span></div>{phase === "monitoring" ? <button className="button button-primary" onClick={onStart}><Zap size={14} /> Start autonomous response</button> : <button className="button button-ghost" onClick={onOpenCommand}>Watch live operation</button>}</div></section>;
  if (workspace === "Incident History") return <section className="panel module-panel"><div className="panel-heading"><div><SectionLabel>Incident history</SectionLabel><h2>Verified remediation outcomes</h2></div><History className="heading-glyph" /></div><div className="data-list"><DataLine title="INC-0237" body="Credential compromise - resolved in 07m 48s" status="REPAIRED" /><DataLine title="INC-0201" body="Identity exposure - resolved in 11m 32s" status="REPAIRED" /><DataLine title="INC-0184" body="OAuth token theft - resolved in 09m 14s" status="REPAIRED" /></div><div className="module-action-row"><span>Load a verified credential-compromise outcome into the simulation.</span><button className="button button-ghost" onClick={onReplay}><Play size={14} /> Replay best outcome</button></div></section>;
  if (workspace === "Adaptive Runbooks") return <section className="panel module-panel runbook-panel"><div className="panel-heading"><div><SectionLabel>Adaptive runbooks</SectionLabel><h2>Evidence-driven playbook evolution</h2></div><Workflow className="heading-glyph" /></div><div className="runbook-flow"><div><span>BASELINE</span><strong>Credential Compromise v1.3</strong></div><ChevronRight /><div className="outcome"><span>VERIFIED OUTCOME</span><strong>Session containment worked</strong></div><ChevronRight /><div className="updated"><span>ACTIVE RUNBOOK</span><strong>Credential Compromise {runbookVersion}</strong></div></div><div className="module-action-row"><span>Updated using knowledge from 14 historical incidents.</span><button className={`button ${runbookVersion === "v1.4" ? "button-primary" : "button-ghost"}`} onClick={onPublishRunbook}>{runbookVersion === "v1.4" ? <><Check size={14} /> Published v1.4</> : <><Workflow size={14} /> Publish v1.4</>}</button></div></section>;
  if (workspace === "Post-Mortems") return <section className="panel module-panel"><div className="panel-heading"><div><SectionLabel>Post-mortem</SectionLabel><h2>{postmortemGenerated ? "INC-2847 knowledge artifact" : "Post-repair report queue"}</h2></div><FileText className="heading-glyph" /></div>{postmortemGenerated ? <><div className="postmortem-grid"><div><span>ROOT CAUSE</span><strong>Compromised credentials</strong></div><div><span>SUCCESSFUL REPAIR</span><strong>Session revocation + credential rotation</strong></div><div><span>LESSON LEARNED</span><strong>This response successfully resolved similar incidents.</strong></div></div><div className="module-action-row"><span>Ready to be committed to Hindsight memory.</span><div className="module-action-buttons"><button className="button button-ghost" onClick={onGeneratePostmortem}><RotateCcw size={14} /> Refresh report</button><button className="button button-primary" onClick={onOpenCommand}><Database size={14} /> Open memory commit</button></div></div></> : <div className="empty-module"><FileText size={26} /><p>The post-mortem is automatically assembled when the autonomous repair verifies system integrity.</p><button className="button button-ghost" onClick={phase === "monitoring" ? onStart : onOpenCommand}>{phase === "monitoring" ? "Run autonomous repair" : "View active operation"}</button></div>}</section>;
  const modifier = analyticsRange === "7d" ? 0 : 3;
  return <section className="panel module-panel"><div className="panel-heading"><div><SectionLabel>Learning analytics</SectionLabel><h2>Hindsight performance</h2></div><div className="range-toggle"><button className={analyticsRange === "7d" ? "active" : ""} onClick={() => onSetAnalyticsRange("7d")}>7D</button><button className={analyticsRange === "30d" ? "active" : ""} onClick={() => onSetAnalyticsRange("30d")}>30D</button></div></div><div className="analytics-bars"><MetricBar label="Memory-assisted responses" amount={`${91 + modifier}%`} value={91 + modifier} /><MetricBar label="Median response time improvement" amount={`-${38 + modifier}%`} value={76 + modifier} /><MetricBar label="Verified repair confidence" amount={`${94 + modifier}%`} value={94 + modifier} /></div><div className="module-action-row"><span>Metrics update as validated incident knowledge enters Hindsight.</span><button className="button button-ghost" onClick={onOpenCommand}>View live learning</button></div></section>;
}

function RepairLaunchPanel({ onStart }: { onStart: () => void }) {
  return <section className="panel module-panel repair-launch-panel"><div className="panel-heading"><div><SectionLabel>Autonomous repair center</SectionLabel><h2>Response engine is armed</h2></div><ShieldCheck className="heading-glyph" /></div><div className="repair-launch-content"><div className="launch-orbit"><Zap size={25} /></div><div><strong>Agent-controlled repair workflow</strong><p>AEGIS-X will investigate, isolate, repair, verify, and save the successful response without waiting for manual execution.</p></div></div><button className="button button-primary" onClick={onStart}><Play size={14} fill="currentColor" /> Launch autonomous response</button></section>;
}

export default function App() {
  const [phase, setPhase] = useState<IncidentPhase>("monitoring"); const [workspace, setWorkspace] = useState<Workspace>("Command Center"); const [investigationIndex, setInvestigationIndex] = useState(-1); const [repairProgress, setRepairProgress] = useState(0); const [selectedMemory, setSelectedMemory] = useState(0); const [menuOpen, setMenuOpen] = useState(false); const [runbookVersion, setRunbookVersion] = useState("v1.3"); const [postmortemGenerated, setPostmortemGenerated] = useState(false); const [analyticsRange, setAnalyticsRange] = useState<"7d" | "30d">("7d");
  useEffect(() => { if (phase !== "investigating") return; setInvestigationIndex(-1); const timers = investigationSteps.map((_, index) => window.setTimeout(() => setInvestigationIndex(index), 160 + index * 255)); const complete = window.setTimeout(() => setPhase("approval"), 1760); return () => { timers.forEach(window.clearTimeout); window.clearTimeout(complete); }; }, [phase]);
  useEffect(() => { if (phase !== "approval") return; const timer = window.setTimeout(() => setPhase("repairing"), 760); return () => window.clearTimeout(timer); }, [phase]);
  useEffect(() => { if (phase !== "repairing") return; setRepairProgress(4); const timer = window.setInterval(() => setRepairProgress((value) => { if (value >= 100) { window.clearInterval(timer); window.setTimeout(() => setPhase("complete"), 280); return 100; } return Math.min(100, value + (value < 28 ? 10 : value < 62 ? 8 : 7)); }), 200); return () => window.clearInterval(timer); }, [phase]);
  useEffect(() => { if (phase === "complete") setPostmortemGenerated(true); if (phase === "learning") setRunbookVersion("v1.4"); }, [phase]);
  const reset = () => { setPhase("monitoring"); setInvestigationIndex(-1); setRepairProgress(0); setPostmortemGenerated(false); setRunbookVersion("v1.3"); setWorkspace("Command Center"); };
  const start = () => { setWorkspace("Command Center"); setPostmortemGenerated(false); setRepairProgress(0); setPhase("investigating"); };
  const authorize = () => { setWorkspace("Command Center"); setPhase("repairing"); };
  const commit = () => { setWorkspace("Command Center"); setRunbookVersion("v1.4"); setPhase("learning"); };
  const openCommand = () => setWorkspace("Command Center");
  const replayOutcome = () => { setSelectedMemory(0); setWorkspace("Memory Graph"); };
  const repairVisible = phase === "repairing" || phase === "complete" || phase === "learning";
  return <main className="app-shell">
    <aside className={`sidebar ${menuOpen ? "is-open" : ""}`}><div className="brand-block"><AegisMark /><div><strong>AEGIS-X</strong><span>ADAPTIVE DEFENSE</span></div></div><div className="environment"><span className="environment-pulse" /><div><span>ENVIRONMENT</span><strong>Enterprise North</strong></div><ChevronRight size={14} /></div><nav className="sidebar-nav" aria-label="Main navigation"><span className="nav-heading">OPERATIONS</span>{navigation.map(({ label, icon: Icon }) => <button key={label} onClick={() => { setWorkspace(label); setMenuOpen(false); }} className={`nav-item ${workspace === label ? "active" : ""}`}><Icon size={16} /><span>{label}</span>{label === "Live Threats" && <b>04</b>}</button>)}</nav><div className="sidebar-bottom"><div><StatusDot tone="green" /><span>AI core online</span></div><span>v4.2.0</span></div></aside><div className="sidebar-scrim" onClick={() => setMenuOpen(false)} />
    <div className="dashboard"><header className="topbar"><button className="mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><Menu size={21} /></button><div className="crumbs"><span>Operations</span><ChevronRight size={13} /><strong>{workspace}</strong></div><div className="topbar-right"><span className="sim-status"><StatusDot tone="cyan" /> Simulation mode</span><button className="top-icon"><Terminal size={16} /></button><button className="analyst-avatar">AR</button></div></header>
      <div className="workspace"><section className="workspace-intro"><div><SectionLabel>Adaptive Enterprise Guardian &amp; Intelligence System</SectionLabel><h1>{workspace}</h1><p>Detect. Remember. Repair. Evolve.</p></div><div className="intro-actions"><div className="time-readout"><span>LIVE TELEMETRY</span><strong>14:32:08 UTC</strong></div><button className="button button-ghost" onClick={reset}><RotateCcw size={14} /> Reset demo</button></div></section>
        <section className="stats-grid" aria-label="Security operations metrics"><MiniMetric label="Critical threats" value={phase === "complete" || phase === "learning" ? "03" : "04"} tone="danger" /><MiniMetric label="Active incidents" value={phase === "complete" || phase === "learning" ? "16" : "17"} /><MiniMetric label="Threats repaired" value={phase === "complete" || phase === "learning" ? "129" : "128"} tone="cyan" /><MiniMetric label="Memory-assisted" value={phase === "learning" ? "93%" : "91%"} tone="cyan" /><MiniMetric label="Response time" value={phase === "complete" || phase === "learning" ? "00m 04s" : "08m 42s"} /></section>
        <section className="command-layout"><div className="topology-panel"><div className="topology-header"><div><SectionLabel>Live digital twin</SectionLabel><h2>Enterprise network topology</h2></div><div className="topology-legend"><span><i className="legend-ai" />AI core</span><span><i className="legend-memory" />Hindsight</span><span><i className="legend-threat" />Threat</span></div></div><div className="scene-wrap"><SOCScene phase={phase} repairProgress={repairProgress} /><div className="scene-overlay scene-overlay-left"><ThreatStatus phase={phase} /><div className="scene-entity"><Server size={14} /><div><span>AFFECTED ASSET</span><strong>Finance Server</strong><em className={phase === "complete" || phase === "learning" ? "safe" : phase === "repairing" ? "repairing" : "danger"}>{phase === "complete" || phase === "learning" ? "SECURE" : phase === "repairing" ? "REPAIRING" : "COMPROMISED"}</em></div></div></div><div className="scene-overlay scene-overlay-right"><div className="core-readout"><Cpu size={15} /><div><span>AEGIS-X CORE</span><strong>{phase === "repairing" ? "Executing" : phase === "investigating" ? "Reasoning" : phase === "learning" ? "Learning" : "Online"}</strong></div></div><div className="core-readout memory-readout"><BrainCircuit size={15} /><div><span>HINDSIGHT</span><strong>{phase === "learning" ? "Updated" : "Active"}</strong></div></div></div><div className="scene-caption"><span>Drag to rotate environment</span><span><StatusDot tone="green" /> 187 assets synchronized</span></div></div><StepRail phase={phase} repairProgress={repairProgress} /></div>
          <aside className="incident-panel"><div className="incident-card-top"><div><span className="incident-id">INC-2847</span><h2>Credential<br />Compromise</h2></div><span className="critical-badge">CRITICAL</span></div><div className="incident-detail"><span>Affected</span><strong><Server size={14} /> Finance Server</strong></div><div className="confidence-row"><div><span>AI confidence</span><strong>94%</strong></div><div className="confidence-track"><i /></div></div><div className="similar-row"><BrainCircuit size={18} /><div><span>Similar incidents</span><strong>7 matched in Hindsight</strong></div><ChevronRight size={15} /></div><div className="incident-action">{phase === "monitoring" && <button className="button button-primary full-button" onClick={start}><Play size={15} fill="currentColor" /> Start autonomous response</button>}{phase === "investigating" && <div className="analyzing-button"><Activity size={15} /> AI investigation in progress</div>}{phase === "approval" && <div className="analyzing-button repair"><Zap size={15} /> Repair plan locked, launching</div>}{phase === "repairing" && <div className="analyzing-button repair"><Zap size={15} /> Autonomous repair executing</div>}{(phase === "complete" || phase === "learning") && <div className="secure-button"><ShieldCheck size={15} /> Incident resolved</div>}</div><div className="safe-note"><Shield size={14} /> Safe digital-twin simulation. No production actions are executed.</div></aside></section>
        <AnimatePresence mode="wait"><motion.section key={`${workspace}-${phase}`} initial={{ opacity: 0, y: 9 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.28 }} className="below-grid">
          {workspace === "Command Center" ? <>
            {repairVisible ? <RepairConsole phase={phase} progress={repairProgress} onCommit={commit} /> : phase === "approval" ? <RepairRecommendation phase={phase} onAuthorize={authorize} /> : <InvestigationPanel phase={phase} investigationIndex={investigationIndex} onInvestigate={start} onAuthorize={authorize} />}
            <MemoryPanel phase={phase} selectedMemory={selectedMemory} onSelect={setSelectedMemory} />
          </> : workspace === "Memory Graph" ? <MemoryPanel phase={phase} selectedMemory={selectedMemory} onSelect={setSelectedMemory} onDeploy={start} /> : workspace === "AI Investigation" ? <InvestigationPanel phase={phase} investigationIndex={investigationIndex} onInvestigate={start} onAuthorize={authorize} /> : workspace === "Repair Center" ? (phase === "monitoring" ? <RepairLaunchPanel onStart={start} /> : <RepairConsole phase={phase} progress={repairProgress} onCommit={commit} />) : <ModulePanel workspace={workspace} phase={phase} onStart={start} onOpenCommand={openCommand} onReplay={replayOutcome} runbookVersion={runbookVersion} onPublishRunbook={() => setRunbookVersion("v1.4")} postmortemGenerated={postmortemGenerated} onGeneratePostmortem={() => setPostmortemGenerated(true)} analyticsRange={analyticsRange} onSetAnalyticsRange={setAnalyticsRange} />}
        </motion.section></AnimatePresence>
        {workspace === "Command Center" && <ComparisonPanel />}{phase === "learning" && workspace === "Command Center" && <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="final-message"><span>THREAT REPAIRED.</span><span>KNOWLEDGE CAPTURED.</span><strong>THE NEXT RESPONSE WILL BE SMARTER.</strong></motion.section>}
      </div>
    </div>
  </main>;
}