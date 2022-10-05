## Description
This is a Jigsaw Puzzle in Javascript, using Canvas.

**NOTE:**
Updated with [Vitejs](https://vitejs.dev/)

```bash
# http://localhost:8080/
npm run dev
```


### Build
```
# For production
npm run build
```

If you want to run as standalone after build, the project will not work throwing an error like `Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at`, this it's because it build for http servers.  
So to make it standalone, we can modifier the [index.html](./dist//index.html) doing:
```html
<!-- Move to end the script tag, and also remove the type & crossorigin, and update the src adding a '.' at the beginning andleaving like: -->
<script src="./assets/index.{some-version}.js"></script>
```