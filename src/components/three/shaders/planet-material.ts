import { SCENE_COLORS } from '@/constants/scene';
import { NOISE_CHUNK } from '@/utils/glsl/noise.glsl';
import { shaderMaterial } from '@react-three/drei/core/shaderMaterial';
import * as THREE from 'three';

export { NOISE_CHUNK };

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
    float dotNV = abs(dot(vNormal, vViewDir));
    float falloff = smoothstep(0.0, 0.65, dotNV);
    float glow = pow(falloff, 2.6);
    float alpha = clamp(glow * uIntensity * 0.42, 0.0, 0.75);
    vec3 finalColor = uColor * (0.9 + glow * 0.6);

    gl_FragColor = vec4(finalColor, alpha);
  }
  `
);

export const AAA_PlanetMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color(),
    uType: 0,
    uLightDir: new THREE.Vector3(1, 0.5, 0.5).normalize(),
    uLite: 0,
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
    
    if (uLite > 0.5) {
    } else if (uType == 0 || uType == 3 || uType == 5) { 
      float disp = fbm(position * 3.0 + uTime * 0.02) * 0.02;
      transformed += normal * disp;
    } else if (uType == 2) { 
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

    if (uType == 0) { 
      float n = fbm(nPos * 4.0);
      float craters = fbm_ridged(nPos * 8.0);
      baseColor = mix(uColor * 0.4, uColor, n + craters * 0.2);
      roughness = 0.9 + craters * 0.1;

      diffuse = max(diffuse - craters * 0.3, 0.0);
    }
    
    else if (uType == 1) { 
      float n = fbm(nPos * 3.0);
      
      float landMask = smoothstep(0.1, 0.3, n);
      
      vec3 waterColor = mix(uColor * 0.2, uColor * 0.6, snoise(nPos * 8.0) * 0.5 + 0.5);
      
      vec3 landColor = mix(vec3(0.1, 0.4, 0.2), vec3(0.4, 0.3, 0.1), fbm(nPos * 10.0));
      
      baseColor = mix(waterColor, landColor, landMask);
      roughness = mix(0.1, 0.85, landMask); 
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
    
    else if (uType == 2) { 
      float cracks = fbm_ridged(nPos * 4.0);
      float heat = smoothstep(0.3, 0.7, cracks);
      float crust = fbm(nPos * 8.0);

      vec3 darkCrust = mix(vec3(0.02), vec3(0.15, 0.05, 0.02), crust);
      baseColor = darkCrust;
      
      float magmaFlow = snoise(nPos * 5.0 + uTime * 0.2) * 0.5 + 0.5;
      vec3 magmaColor = mix(vec3(1.0, 0.2, 0.0), vec3(1.0, 0.8, 0.1), magmaFlow);
      
      emissive = magmaColor * heat * 3.5; 
      roughness = 0.9 - heat * 0.5;
    }
    
    else if (uType == 3) { 
      float fac = fbm_ridged(nPos * 6.0);
      baseColor = mix(uColor * 0.3, uColor * 1.5, fac);
      
      roughness = 0.1;
      metalness = 0.9;
      
      float pulse = (sin(uTime * 1.5) * 0.5 + 0.5);
      emissive = uColor * fac * pulse * 0.5;
    }
    
    else if (uType == 4) { 
      vec3 q = domainWarp(
        nPos,
        vec3(0.0, uTime * 0.02, 0.0),
        vec3(5.2, 1.3, uTime * 0.05),
        vec3(1.1, uTime * 0.03, 7.5)
      );

      vec3 warpedPos = nPos + q * 1.5;
      warpedPos.y *= 5.0; 
      
      float n = fbm(warpedPos);
      
      vec3 col1 = uColor;
      vec3 col2 = mix(uColor, vec3(1.0), 0.5);
      vec3 col3 = mix(uColor, vec3(0.2), 0.5); 
      
      if (n < 0.3) baseColor = mix(col3, col1, n / 0.3);
      else if (n < 0.6) baseColor = mix(col1, col2, (n - 0.3)/0.3);
      else baseColor = mix(col2, col3, (n - 0.6)/0.4);
      
      roughness = 0.9;
      metalness = 0.0;
    }
    
    else if (uType == 5) { 
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
);

export const SunMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorPrimary: new THREE.Color(SCENE_COLORS.sun.flare),
    uColorSecondary: new THREE.Color(SCENE_COLORS.sun.secondary),
    uIntensity: 1.5,
    uLite: 0,
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
    
    float disp = uLite > 0.5 ? 0.0 : fbm(position * 2.5 + uTime * 0.3) * 0.06;
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
    vec3 q = domainWarp(
      nPos,
      vec3(0.0, uTime * 0.1, 0.0),
      vec3(5.2, 1.3, uTime * 0.1),
      vec3(1.1, uTime * 0.1, 7.5)
    );

    float noise = fbm(nPos * 4.0 + q * 2.0);
    
    vec3 color = mix(uColorSecondary, uColorPrimary, noise);
    
    float flare = smoothstep(0.6, 1.0, noise);
    color += vec3(1.0, 0.9, 0.6) * flare * 2.5; 
    
    gl_FragColor = vec4(color * uIntensity, 1.0);
  }
  `
);
