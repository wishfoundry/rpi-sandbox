# rpi-sandbox

to start in dev mode, enter in terminal:
  ```
  npm run dev
  ```

to start in lightweight/production mode
```
npm run build
npm run start
```

setting the GPIO pins is in
```
src/server/commands.js
```

changes to the routine should be done in
```
src/server/runCycle.js
```
