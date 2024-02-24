<!DOCTYPE html>
<html lang="en">
  <head>
    <script type="module" src="/@vite/client"></script>

    <style>
      html,
      body {
        margin: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }
    </style>
    <base href="/" />
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, shrink-to-fit=no" />

    <meta name="description" content="Ethereal Engine" />
    <title>Ethereal Engine</title>
    
    <meta name="monetization" content="" />

    <link rel="dns-prefetch" href="https://fonts.googleapis.com">
    <link rel="dns-prefetch" href="https://fonts.gstatic.com">
    <link rel="preconnect" crossorigin="anonymous" href="https://fonts.googleapis.com">
    <link rel="preconnect" crossorigin="anonymous" href="https://fonts.gstatic.com">
    <link rel="stylesheet" crossorigin="anonymous" href="https://fonts.googleapis.com/css?family=Lato:300,400,700|PT+Sans:400,400italic,700,700italic|Quicksand:400,300|Raleway:400|Roboto:300,400,700|Source+Sans+Pro:300,400,700|Khula:300,400,700&display=swap" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

    <script type="text/javascript">
      var global = globalThis
      var exports = { __esModule: true }
      
      if('serviceWorker' in navigator && `` !== '') {
        window.addEventListener('load', () => {
          console.log(`[PWA] Registering sw at ${window.location.origin}/`)

          // Register the service worker
          navigator.serviceWorker
            .register(`${window.location.origin}/`, {
              scope: `./`,

            })
            .then(function (reg) {
              console.log("[PWA] SW registered at " + reg.scope);
            })
        })
      }
    </script>
</head>
  <body>
    <div id="root"  style='z-index: 1; margin: 0; width: 100%; height: 100%; position: absolute; pointer-events: none;'></div>
    <script type="module" src="/src/main.tsx"></script>
    <canvas id='engine-renderer-canvas' tabindex="1" style='outline: none; z-index: 0; width: 100%; height: 100%; position: fixed; -webkit-user-select: none; pointer-events: auto; user-select: none'></canvas>
  </body>
</html>