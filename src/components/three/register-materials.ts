import { extend } from '@react-three/fiber';
import { AdvancedAtmosphereMaterial } from './shaders/atmosphere-material';
import { AAA_PlanetMaterial } from './shaders/planet-material';
import { SunMaterial } from './shaders/sun-material';

extend({
  AdvancedAtmosphereMaterial,
  AaaPlanetMaterial: AAA_PlanetMaterial,
  SunMaterial,
});
