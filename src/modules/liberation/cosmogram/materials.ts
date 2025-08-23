import * as THREE from 'three';

export const outlineMaterial = new THREE.MeshBasicMaterial({
  color: '#ffffff',
  side: THREE.BackSide,
  transparent: true,
  opacity: 0.3,
});
