import { useSpaceStore } from '@/store/space-store';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { WebGLError } from '../../ui/overlays/webgl-error';
import { FallbackExperience } from './fallback-experience';

interface ExperienceBoundaryProps {
  children: ReactNode;
}

interface ExperienceBoundaryState {
  disabled: boolean;
  failed: boolean;
}

export class ExperienceBoundary extends Component<
  ExperienceBoundaryProps,
  ExperienceBoundaryState
> {
  state: ExperienceBoundaryState = { disabled: false, failed: false };

  static getDerivedStateFromError(): Partial<ExperienceBoundaryState> {
    return { failed: true };
  }

  private enableCompatibilityMode = () => {
    const state = useSpaceStore.getState();
    state.setGraphicsMode('2d');
    state.setCursorVariant('default');
    state.setExperienceSetting('customCursor', false);
    state.setIsLoaded(true);
  };

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('SpaceExperience initialization failed', error, info.componentStack);
    this.enableCompatibilityMode();
  }

  private continueWithout3D = () => {
    this.enableCompatibilityMode();
    this.setState({ disabled: true, failed: false });
  };

  render() {
    if (this.state.disabled) {
      return <FallbackExperience />;
    }

    if (this.state.failed) {
      return <WebGLError variant="unavailable" onContinue={this.continueWithout3D} />;
    }

    return this.props.children;
  }
}
