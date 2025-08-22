# React Three Fiber Correct Patterns

## CRITICAL: Correct Geometry Usage

### ✅ CORRECT - Use geometries inside mesh
```tsx
<mesh>
  <sphereGeometry args={[radius, widthSegments, heightSegments]} />
  <meshStandardMaterial color="#ffffff" />
</mesh>

<mesh>
  <boxGeometry args={[width, height, depth]} />
  <meshStandardMaterial color="#ffffff" />
</mesh>

<mesh>
  <cylinderGeometry args={[radiusTop, radiusBottom, height, radialSegments]} />
  <meshStandardMaterial color="#ffffff" />
</mesh>
```

### ❌ WRONG - Don't use drei components as children of mesh
```tsx
// This causes: TypeError: Cannot read properties of undefined (reading 'lov')
<mesh>
  <Sphere args={[radius, widthSegments, heightSegments]}>
    <meshStandardMaterial color="#ffffff" />
  </Sphere>
</mesh>

<mesh>
  <Box args={[width, height, depth]}>
    <meshStandardMaterial color="#ffffff" />
  </Box>
</mesh>
```

## Fixed Modules
- ✅ SovereigntyField3D.tsx
- ✅ TrustTransmission3D.tsx (was already correct)
- ✅ ChoiceArchitecture3D.tsx
- ✅ SpeedOfTrust3D.tsx

## Reference for Future Modules
Always use `<geometryType args={[...]} />` + `<materialType />` inside `<mesh>` tags.
Never nest drei component helpers like `<Sphere>`, `<Box>`, etc. inside `<mesh>`.