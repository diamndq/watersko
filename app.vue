<template>
  <div id="app" class="w-screen min-h-screen">
    <NuxtPage />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
}

#app {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

#__nuxt {
  width: 100%;
  height: 100%;
}

/* Only apply no-scroll to map page */
#map-page {
  height: 100vh;
  overflow: hidden;
}
</style>
