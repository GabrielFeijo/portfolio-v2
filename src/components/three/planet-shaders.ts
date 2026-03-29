import * as THREE from 'three'
import { shaderMaterial } from '@react-three/drei'

export const NOISE_CHUNK = `
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  float n_ = 1.0/7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

float fbm(vec3 x) {
  float v = 0.0;
  float a = 0.5;
  vec3 shift = vec3(100);
  for (int i = 0; i < 5; ++i) {
    v += a * snoise(x);
    x = x * 2.0 + shift;
    a *= 0.5;
  }
  return v;
}

float fbm_ridged(vec3 p) {
  float f = 0.0;
  float weight = 0.5;
  for(int i = 0; i < 4; i++){
    float n = abs(snoise(p));
    n = 1.0 - n;
    n *= n;
    f += n * weight;
    weight *= 0.5;
    p *= 2.0;
  }
  return f;
}
`

export const AdvancedAtmosphereMaterial = shaderMaterial(
  {
    uColor: new THREE.Color(),
    uIntensity: 1.0,
    uTime: 0.0,
  },
 `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vViewDir;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
  `,
 `
  uniform vec3 uColor;
  uniform float uIntensity;
  uniform float uTime;
  
  varying vec3 vNormal;
  varying vec3 vViewDir;
  
  void main() {
    float dotNV = dot(vNormal, vViewDir);
    float rim = smoothstep(0.0, 1.0, 1.0 - abs(dotNV));
    
    float core = pow(rim, 3.0) * 1.5;
    
    float edge = pow(rim, 6.0) * 3.0;

    float alpha = clamp(core + edge, 0.0, 1.0);
    
    vec3 finalColor = uColor * (core + edge * 2.0);
    
    gl_FragColor = vec4(finalColor, alpha * uIntensity * 0.45);
  }
  `
)

export const AAA_PlanetMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color(),
    uType: 0, // 0=rocky, 1=oceanic, 2=lava, 3=crystal, 4=gas, 5=ice
    uLightDir: new THREE.Vector3(1, 0.5, 0.5).normalize(),
  },
`
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  uniform float uTime;
  uniform int uType;

  ${NOISE_CHUNK}

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;

    vec3 transformed = position;
    
    if (uType == 0 || uType == 3 || uType == 5) { // Rocky/Crystal/Ice
      float disp = fbm(position * 3.0 + uTime * 0.02) * 0.02;
      transformed += normal * disp;
    } else if (uType == 2) { // Lava
      float disp = fbm_ridged(position * 2.0) * 0.03;
      transformed += normal * disp;
    }

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
  `,
`
  uniform float uTime;
  uniform int uType;
  uniform vec3 uColor;
  uniform vec3 uLightDir;
  
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  
  ${NOISE_CHUNK}
  
  void main() {
    vec3 baseColor = vec3(0.0);
    vec3 emissive = vec3(0.0);
    float roughness = 0.8;
    float metalness = 0.1;
    
    vec3 nPos = normalize(vPosition);
    vec3 lightDir = normalize(uLightDir);
    float diffuse = max(dot(vNormal, lightDir), 0.0);
    
    float ambient = 0.05;

    if (uType == 0) { // ROCKY
      float n = fbm(nPos * 4.0);
      float craters = fbm_ridged(nPos * 8.0);
      baseColor = mix(uColor * 0.4, uColor, n + craters * 0.2);
      roughness = 0.9 + craters * 0.1;

      diffuse = max(diffuse - craters * 0.3, 0.0);
    }
    
    else if (uType == 1) { // OCEANIC
      float n = fbm(nPos * 3.0);
      
      float landMask = smoothstep(0.1, 0.3, n);
      
      vec3 waterColor = mix(uColor * 0.2, uColor * 0.6, snoise(nPos * 8.0) * 0.5 + 0.5);
      
      vec3 landColor = mix(vec3(0.1, 0.4, 0.2), vec3(0.4, 0.3, 0.1), fbm(nPos * 10.0));
      
      baseColor = mix(waterColor, landColor, landMask);
      roughness = mix(0.1, 0.85, landMask); // water shiny, land rough
      metalness = mix(0.5, 0.0, landMask);
      
      float clouds = fbm(nPos * 5.0 + uTime * 0.05);
      float cloudMask = smoothstep(0.4, 0.8, clouds);
      baseColor = mix(baseColor, vec3(0.9), cloudMask);
      roughness = mix(roughness, 0.9, cloudMask);
      
      float nightSide = smoothstep(0.2, -0.2, dot(vNormal, lightDir));
      if (nightSide > 0.0 && landMask > 0.5 && cloudMask < 0.2) {
        float cities = smoothstep(0.6, 1.0, fbm(nPos * 20.0));
        emissive = vec3(1.0, 0.8, 0.4) * cities * nightSide * 1.5;
      }
    }
    
    else if (uType == 2) { // LAVA
      float cracks = fbm_ridged(nPos * 4.0);
      float heat = smoothstep(0.3, 0.7, cracks);
      float crust = fbm(nPos * 8.0);

      vec3 darkCrust = mix(vec3(0.02), vec3(0.15, 0.05, 0.02), crust);
      baseColor = darkCrust;
      
      float magmaFlow = snoise(nPos * 5.0 + uTime * 0.2) * 0.5 + 0.5;
      vec3 magmaColor = mix(vec3(1.0, 0.2, 0.0), vec3(1.0, 0.8, 0.1), magmaFlow);
      
      emissive = magmaColor * heat * 3.5; // Very bright for Bloom
      roughness = 0.9 - heat * 0.5;
    }
    
    else if (uType == 3) { // CRYSTAL
      float fac = fbm_ridged(nPos * 6.0);
      baseColor = mix(uColor * 0.3, uColor * 1.5, fac);
      
      roughness = 0.1;
      metalness = 0.9;
      
      float pulse = (sin(uTime * 1.5) * 0.5 + 0.5);
      emissive = uColor * fac * pulse * 0.5;
    }
    
    else if (uType == 4) { // GAS GIANT
      vec3 q = vec3(fbm(nPos + vec3(0.0, uTime * 0.02, 0.0)),
                    fbm(nPos + vec3(5.2, 1.3, uTime * 0.05)),
                    fbm(nPos + vec3(1.1, uTime * 0.03, 7.5)));
                    
      vec3 warpedPos = nPos + q * 1.5;
      warpedPos.y *= 5.0; 
      
      float n = fbm(warpedPos);
      
      vec3 col1 = uColor;
      vec3 col2 = mix(uColor, vec3(1.0), 0.5);
      vec3 col3 = mix(uColor, vec3(0.2), 0.5); // darker bands
      
      if (n < 0.3) baseColor = mix(col3, col1, n / 0.3);
      else if (n < 0.6) baseColor = mix(col1, col2, (n - 0.3)/0.3);
      else baseColor = mix(col2, col3, (n - 0.6)/0.4);
      
      roughness = 0.9;
      metalness = 0.0;
    }
    
    else if (uType == 5) { // ICE
      float ice = fbm(nPos * 5.0);
      float cracks = fbm_ridged(nPos * 12.0);
      baseColor = mix(vec3(0.7, 0.9, 1.0), vec3(1.0, 1.0, 1.0), ice);
      
      baseColor = mix(baseColor, vec3(0.1, 0.4, 0.8), smoothstep(0.4, 0.6, cracks));
      
      roughness = 0.2;
      metalness = 0.3;
      
      emissive = vec3(0.05, 0.15, 0.3) * (1.0 - diffuse) * (1.0 - cracks) * 0.5;
    }

    vec3 lighting = baseColor * (diffuse + ambient);
    
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(vNormal, halfDir), 0.0), 32.0 * (1.1 - roughness));
    lighting += vec3(1.0) * spec * (1.0 - roughness) * (metalness + 0.2);
    
    float rim = 1.0 - max(dot(viewDir, vNormal), 0.0);
    rim = smoothstep(0.6, 1.0, rim);
    lighting += uColor * rim * 0.3;

    gl_FragColor = vec4(lighting + emissive, 1.0);
    
    gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(1.0 / 2.2));
  }
  `
)

export const SunMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorPrimary: new THREE.Color('#FFB800'),
    uColorSecondary: new THREE.Color('#FF4500'),
    uIntensity: 1.5,
  },
 `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float uTime;
  
  ${NOISE_CHUNK}

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    
    float disp = fbm(position * 2.5 + uTime * 0.3) * 0.06;
    vec3 transformed = position + normal * disp;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
  `,
 `
  uniform float uTime;
  uniform vec3 uColorPrimary;
  uniform vec3 uColorSecondary;
  uniform float uIntensity;
  
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  ${NOISE_CHUNK}

  void main() {
    vec3 nPos = normalize(vPosition);
    
    vec3 q = vec3(fbm(nPos + vec3(0.0, uTime * 0.1, 0.0)),
                  fbm(nPos + vec3(5.2, 1.3, uTime * 0.1)),
                  fbm(nPos + vec3(1.1, uTime * 0.1, 7.5)));
                  
    float noise = fbm(nPos * 4.0 + q * 2.0);
    
    vec3 color = mix(uColorSecondary, uColorPrimary, noise);
    
    float flare = smoothstep(0.6, 1.0, noise);
    color += vec3(1.0, 0.9, 0.6) * flare * 2.5; // push above 1.0 for Bloom
    
    gl_FragColor = vec4(color * uIntensity, 1.0);
  }
  `
)
