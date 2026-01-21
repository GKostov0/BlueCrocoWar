import { Application, Graphics, Text, Sprite, Assets, TilingSprite } from "pixi.js";
import { initDevtools } from "@pixi/devtools";

(async () => {
    const app = new Application();
    await app.init({
        resizeTo: window,
        backgroundAlpha: 0.2
    });

    initDevtools({app});
    globalThis.__PIXI_APP__ = app;

    app.canvas.style.position = 'absolute';

    document.body.appendChild(app.canvas);

    await Assets.init({manifest: '/manifest.json'});

    const backgroundAsset = await Assets.loadBundle('backgrounds');
    const backgroundSprite = Sprite.from(backgroundAsset.background);
    
    // Calculate scale to fill the entire screen
    const screenWidth = app.renderer.screen.width;
    const screenHeight = app.renderer.screen.height;
    const scaleX = screenWidth / backgroundSprite.width;
    const scaleY = screenHeight / backgroundSprite.height;
    const scale = Math.max(scaleX, scaleY); // Use max to fill entire screen

    backgroundSprite.scale.set(scale, scale);
    backgroundSprite.position.set(screenWidth / 2, screenHeight / 2);
    backgroundSprite.anchor.set(0.5, 0.5); // Center the sprite

    app.stage.addChild(backgroundSprite);

    app.stage.addChild(backgroundSprite);
})();