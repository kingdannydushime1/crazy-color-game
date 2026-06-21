import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import MainScene from './game/MainScene';

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (gameRef.current) return;

    const init = async () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const aspect = vw / vh;

      let gameWidth: number, gameHeight: number;

      if (aspect > 1.2) {
        gameWidth = Math.min(vw, 600);
        gameHeight = Math.min(vh, Math.round(gameWidth / 0.75));
      } else {
        gameHeight = Math.min(vh, 800);
        gameWidth = Math.min(vw, Math.round(gameHeight * Math.min(aspect, 0.6)));
      }
      gameWidth = Phaser.Math.Clamp(gameWidth, 320, 600);
      gameHeight = Phaser.Math.Clamp(gameHeight, 500, 900);

      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        parent: 'phaser-container',
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          width: gameWidth,
          height: gameHeight
        },
        physics: {
          default: 'arcade',
          arcade: {
            debug: false,
            gravity: { y: 1500, x: 0 }
          }
        },
        scene: MainScene,
        backgroundColor: '#0a0a0f'
      };

      try {
        if (typeof (window as any).CrazyGames !== 'undefined') {
          await (window as any).CrazyGames.SDK.init();
        }
      } catch (e) {}

      const parentContainer = document.getElementById('phaser-container');
      if (parentContainer) {
        parentContainer.innerHTML = '';
      }

      gameRef.current = new Phaser.Game(config);

      const handleResize = () => {
        if (gameRef.current) {
          const nw = window.innerWidth;
          const nh = window.innerHeight;
          const na = nw / nh;
          let gw: number, gh: number;
          if (na > 1.2) { gw = Math.min(nw, 600); gh = Math.min(nh, Math.round(gw / 0.75)); }
          else { gh = Math.min(nh, 800); gw = Math.min(nw, Math.round(gh * Math.min(na, 0.6))); }
          gw = Phaser.Math.Clamp(gw, 320, 600);
          gh = Phaser.Math.Clamp(gh, 500, 900);
          gameRef.current.scale.resize(gw, gh);
        }
      };

      window.addEventListener('resize', handleResize);

      document.addEventListener('fullscreenchange', () => {
        setTimeout(() => {
          if (gameRef.current) {
            const nw = window.innerWidth;
            const nh = window.innerHeight;
            const na = nw / nh;
            let gw: number, gh: number;
            if (na > 1.2) { gw = Math.min(nw, 600); gh = Math.min(nh, Math.round(gw / 0.75)); }
            else { gh = Math.min(nh, 800); gw = Math.min(nw, Math.round(gh * Math.min(na, 0.6))); }
            gw = Phaser.Math.Clamp(gw, 320, 600);
            gh = Phaser.Math.Clamp(gh, 500, 900);
            gameRef.current.scale.resize(gw, gh);
          }
        }, 200);
      });
    };

    init();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
      const pc = document.getElementById('phaser-container');
      if (pc) pc.innerHTML = '';
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="w-screen h-dvh bg-[#0a0a0f] touch-none select-none overflow-hidden flex items-center justify-center relative">
      <div ref={containerRef} id="phaser-container" className="w-full h-full" />
      <button
        onClick={toggleFullscreen}
        className="absolute top-2 right-2 z-50 bg-black/50 hover:bg-black/70 text-white text-xs px-2 py-1 rounded transition-all"
      >
        ⛶
      </button>
    </div>
  );
}
