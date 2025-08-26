import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TreePine, BookOpen, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface SephirahData {
  id: number;
  name: string;
  hebrew: string;
  meaning: string;
  position: [number, number, number];
  color: string;
  attribute: string;
  description: string;
  correspondences: string[];
}

const sephiroth: SephirahData[] = [
  { id: 1, name: "Kether", hebrew: "כתר", meaning: "Crown", position: [0, 4, 0], color: "#ffffff", attribute: "Divine Will", description: "The first emanation of the divine, pure consciousness and unlimited potential.", correspondences: ["Unity", "Crown chakra", "Pure light", "Source"] },
  { id: 2, name: "Chokmah", hebrew: "חכמה", meaning: "Wisdom", position: [-2, 3, 0], color: "#808080", attribute: "Divine Wisdom", description: "The first active force, divine masculine energy and cosmic consciousness.", correspondences: ["Intuition", "Masculine", "Stars", "Dynamic force"] },
  { id: 3, name: "Binah", hebrew: "בינה", meaning: "Understanding", position: [2, 3, 0], color: "#000000", attribute: "Divine Understanding", description: "The divine feminine, the great mother who gives form to wisdom.", correspondences: ["Receptivity", "Feminine", "Ocean", "Form-giver"] },
  { id: 4, name: "Chesed", hebrew: "חסד", meaning: "Mercy", position: [-2, 1, 0], color: "#0080ff", attribute: "Divine Love", description: "Boundless love and mercy, expansion and generosity of spirit.", correspondences: ["Compassion", "Jupiter", "Expansion", "Benevolence"] },
  { id: 5, name: "Geburah", hebrew: "גבורה", meaning: "Severity", position: [2, 1, 0], color: "#ff0000", attribute: "Divine Justice", description: "Divine strength and judgment, necessary restriction and discipline.", correspondences: ["Justice", "Mars", "Strength", "Boundaries"] },
  { id: 6, name: "Tiphereth", hebrew: "תפארת", meaning: "Beauty", position: [0, 0, 0], color: "#ffff00", attribute: "Divine Harmony", description: "The heart center, beauty and harmony that balances all forces.", correspondences: ["Heart", "Sun", "Balance", "Christ consciousness"] },
  { id: 7, name: "Netzach", hebrew: "נצח", meaning: "Victory", position: [-2, -1, 0], color: "#00ff00", attribute: "Divine Eternity", description: "Endurance and victory, the eternal nature of divine love.", correspondences: ["Nature", "Venus", "Art", "Emotions"] },
  { id: 8, name: "Hod", hebrew: "הוד", meaning: "Glory", position: [2, -1, 0], color: "#ff8000", attribute: "Divine Splendor", description: "Intellectual glory and the power of communication and magic.", correspondences: ["Mind", "Mercury", "Communication", "Magic"] },
  { id: 9, name: "Yesod", hebrew: "יסוד", meaning: "Foundation", position: [0, -2, 0], color: "#8000ff", attribute: "Divine Foundation", description: "The astral foundation, linking the material and spiritual worlds.", correspondences: ["Moon", "Astral", "Dreams", "Subconscious"] },
  { id: 10, name: "Malkuth", hebrew: "מלכות", meaning: "Kingdom", position: [0, -4, 0], color: "#8b4513", attribute: "Divine Presence", description: "The material world, where divine energy manifests in physical form.", correspondences: ["Earth", "Physical", "Manifestation", "Body"] }
];

const pathData = [
  { from: 1, to: 2, hebrew: 'א', tarot: 'The Fool' }, { from: 1, to: 3, hebrew: 'ב', tarot: 'The Magician' },
  { from: 1, to: 6, hebrew: 'ג', tarot: 'The High Priestess' }, { from: 2, to: 3, hebrew: 'ד', tarot: 'The Empress' },
  { from: 2, to: 6, hebrew: 'ה', tarot: 'The Emperor' }, { from: 2, to: 4, hebrew: 'ו', tarot: 'The Hierophant' },
  { from: 3, to: 6, hebrew: 'ז', tarot: 'The Lovers' }, { from: 3, to: 5, hebrew: 'ח', tarot: 'The Chariot' },
  { from: 4, to: 5, hebrew: 'ט', tarot: 'Strength' }, { from: 4, to: 6, hebrew: 'י', tarot: 'The Hermit' },
  { from: 4, to: 7, hebrew: 'כ', tarot: 'Wheel of Fortune' }, { from: 5, to: 6, hebrew: 'ל', tarot: 'Justice' },
  { from: 5, to: 8, hebrew: 'מ', tarot: 'The Hanged Man' }, { from: 6, to: 7, hebrew: 'נ', tarot: 'Death' },
  { from: 6, to: 8, hebrew: 'ס', tarot: 'Temperance' }, { from: 6, to: 9, hebrew: 'ע', tarot: 'The Devil' },
  { from: 7, to: 8, hebrew: 'פ', tarot: 'The Tower' }, { from: 7, to: 9, hebrew: 'צ', tarot: 'The Star' },
  { from: 7, to: 10, hebrew: 'ק', tarot: 'The Moon' }, { from: 8, to: 9, hebrew: 'ר', tarot: 'The Sun' },
  { from: 8, to: 10, hebrew: 'ש', tarot: 'Judgement' }, { from: 9, to: 10, hebrew: 'ת', tarot: 'The World' }
];


interface SephirahProps {
  sephirah: SephirahData;
  isSelected: boolean;
  onSelect: () => void;
}

function Sephirah({ sephirah, isSelected, onSelect }: SephirahProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      const scale = isSelected ? 1.3 + Math.sin(state.clock.elapsedTime * 3) * 0.1 : 1;
      meshRef.current.scale.setScalar(scale);
    }
  });
  return (
    <group position={sephirah.position}>
      <mesh ref={meshRef} onClick={onSelect}>
        <sphereGeometry args={[0.3, 16, 12]} />
        <meshStandardMaterial color={sephirah.color} emissive={sephirah.color} emissiveIntensity={isSelected ? 0.5 : 0.2} />
      </mesh>
      <Html position={[0, -0.6, 0]} center><div className="font-semibold pointer-events-none text-center" style={{ color: "#ffffff", fontSize: '12px', textShadow: '0 0 4px rgba(0,0,0,0.8)' }}>{sephirah.name}</div></Html>
      <Html position={[0, -0.8, 0]} center><div className="font-medium pointer-events-none text-center" style={{ color: "#cccccc", fontSize: '10px', textShadow: '0 0 4px rgba(0,0,0,0.8)' }}>{sephirah.hebrew}</div></Html>
    </group>
  );
}

function InteractivePath({ path, from, to }: { path: any, from: SephirahData, to: SephirahData }) {
  const [hovered, setHovered] = useState(false);
  const midPoint = new THREE.Vector3().addVectors(new THREE.Vector3(...from.position), new THREE.Vector3(...to.position)).multiplyScalar(0.5);

  return (
    <>
      <Line
        points={[from.position, to.position]}
        color={hovered ? "gold" : "#666666"}
        lineWidth={hovered ? 3 : 1.5}
        transparent
        opacity={hovered ? 1 : 0.5}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      />
      {hovered && (
        <Html position={midPoint}>
          <div className="bg-black/70 text-white p-2 rounded-md text-xs pointer-events-none">
            <div><strong>Path:</strong> {path.hebrew}</div>
            <div><strong>Tarot:</strong> {path.tarot}</div>
          </div>
        </Html>
      )}
    </>
  )
}

function TreePaths() {
  return (
    <group>
      {pathData.map((path, index) => {
        const fromSeph = sephiroth.find(s => s.id === path.from);
        const toSeph = sephiroth.find(s => s.id === path.to);
        if (!fromSeph || !toSeph) return null;
        return <InteractivePath key={index} path={path} from={fromSeph} to={toSeph} />;
      })}
    </group>
  );
}

export default function KabbalahTreeOfLife3D() {
  const [selectedSephirah, setSelectedSephirah] = useState<SephirahData | null>(null);
  const [showPaths, setShowPaths] = useState(true);

  const pillars = {
    mercy: { name: "Pillar of Mercy", sephiroth: [2, 4, 7], description: "The active, masculine pillar of expansion and love" },
    severity: { name: "Pillar of Severity", sephiroth: [3, 5, 8], description: "The receptive, feminine pillar of form and judgment" },
    balance: { name: "Middle Pillar", sephiroth: [1, 6, 9, 10], description: "The pillar of equilibrium and consciousness" }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-background via-purple-950/30 to-blue-950/20 relative overflow-hidden">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, 5]} intensity={0.5} color="#purple" />
        {showPaths && <TreePaths />}
        {sephiroth.map((sephirah) => (
          <Sephirah key={sephirah.id} sephirah={sephirah} isSelected={selectedSephirah?.id === sephirah.id} onSelect={() => setSelectedSephirah(selectedSephirah?.id === sephirah.id ? null : sephirah)} />
        ))}
        <Html position={[0, 5.5, 0]} center><div className="font-bold pointer-events-none text-center" style={{ color: "#ffffff", fontSize: '20px', textShadow: '0 0 8px rgba(0,0,0,0.8)' }}>Kabbalah Tree of Life</div></Html>
        <OrbitControls enablePan={false} maxDistance={12} minDistance={4} />
      </Canvas>
      <div className="absolute top-6 left-6 z-10">
        <Card className="bg-background/80 backdrop-blur-sm border-primary/20 max-w-sm">
          <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2"><TreePine className="h-5 w-5 text-green-500" />Tree of Life Explorer</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" onClick={() => setShowPaths(!showPaths)} className="w-full">{showPaths ? 'Hide Paths' : 'Show Paths'}</Button>
            <div>
              <h4 className="text-sm font-medium mb-2">The Three Pillars:</h4>
              {Object.entries(pillars).map(([key, pillar]) => (
                <div key={key} className="text-xs text-muted-foreground mb-1"><span className="font-medium">{pillar.name}:</span> {pillar.description}</div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      {selectedSephirah && (
        <motion.div initial={{ opacity: 0, x: 300 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 300 }} className="absolute top-6 right-6 z-10 max-w-md">
          <Card className="bg-background/90 backdrop-blur-sm border-primary/20">
            <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-yellow-500" />{selectedSephirah.name} ({selectedSephirah.hebrew})</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground">Meaning:</span><div className="font-medium">{selectedSephirah.meaning}</div></div>
                <div><span className="text-muted-foreground">Attribute:</span><div className="font-medium">{selectedSephirah.attribute}</div></div>
              </div>
              <p className="text-sm text-muted-foreground">{selectedSephirah.description}</p>
              <div>
                <h4 className="text-sm font-medium mb-2">Correspondences:</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedSephirah.correspondences.map((correspondence) => (<Badge key={correspondence} variant="secondary" className="text-xs">{correspondence}</Badge>))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
      <div className="absolute bottom-6 right-6 z-10 max-w-md">
        <Card className="bg-background/90 backdrop-blur-sm border-primary/20">
          <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-purple-500" />Sacred Wisdom</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">The Tree of Life represents the divine blueprint of creation, showing how consciousness descends from unity to manifestation through ten spheres (Sephiroth) connected by 22 paths.</p>
            <div className="text-xs space-y-1">
              <div><strong>22 Paths:</strong> Corresponding to Hebrew letters and Tarot Major Arcana</div>
              <div><strong>4 Worlds:</strong> Emanation, Creation, Formation, Action</div>
              <div><strong>Lightning Flash:</strong> The path of divine emanation downward</div>
              <div><strong>Serpent Path:</strong> The path of human ascension upward</div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="absolute bottom-6 left-6 z-10">
        <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
          <CardContent className="p-4"><p className="text-sm text-muted-foreground">Click Sephiroth to explore • Drag to rotate • Scroll to zoom</p></CardContent>
        </Card>
      </div>
    </div>
  );
}