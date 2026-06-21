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

      if (aspect > 0.8) {
        gameWidth = 600;
        gameHeight = 800;
      } else {
        gameWidth = Math.min(vw, 480);
        gameHeight = Math.round(gameWidth / 0.6);
      }

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
          if (na > 0.8) { gw = 600; gh = 800; }
          else { gw = Math.min(nw, 480); gh = Math.round(gw / 0.6); }
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
            if (na > 0.8) { gw = 600; gh = 800; }
            else { gw = Math.min(nw, 480); gh = Math.round(gw / 0.6); }
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
