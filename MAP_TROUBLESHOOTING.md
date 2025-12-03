# 🗺️ Map Not Showing? - Troubleshooting Guide

## ✅ Issues Fixed

I've made the following fixes to ensure the map displays correctly:

### 1. **Updated `nuxt.config.ts`**
- Changed CSS import to load Leaflet directly from `node_modules`
- Now: `css: ['leaflet/dist/leaflet.css', '~/assets/css/main.css']`
- Before: Was trying to import from custom file

### 2. **Enhanced `assets/css/main.css`**
- Added Leaflet-specific styles
- Set proper height/width constraints
- Fixed z-index layering for map elements

### 3. **Improved `pages/index.vue`**
- Added explicit `style="height: 100vh"` to map container
- Both `class="w-full h-full"` AND inline styles for maximum compatibility
- Enhanced scoped styles with `:deep()` selectors

### 4. **Created `app.vue`**
- New root component for proper HTML structure
- Sets `height: 100%` on `html`, `body`, and `#__nuxt`
- Ensures full viewport coverage

---

## 🚀 How to Fix (If Map Still Doesn't Show)

### Step 1: Clear Cache and Reinstall
```bash
cd watersko
rm -rf node_modules package-lock.json .nuxt
npm install
npm run dev
```

### Step 2: Check Browser Console
1. Press **F12** to open Developer Tools
2. Go to **Console** tab
3. Look for any errors (red text)
4. Common errors:
   - `Cannot find module 'leaflet'` → Run `npm install`
   - `LMap is not defined` → Check imports in index.vue
   - Network errors → Check internet connection

### Step 3: Verify Network Tab
1. Open Developer Tools → **Network** tab
2. Reload page
3. Look for `leaflet.css` file
4. Should show `200` status (success), not `404` (not found)

### Step 4: Check Leaflet Components Are Loaded
```javascript
// Paste in browser console:
console.log('LMap available:', typeof window.LMap)
console.log('Leaflet available:', typeof window.L)
```

---

## 🔍 Detailed Troubleshooting

### Map container shows but is gray/empty

**Cause**: Leaflet CSS not loaded

**Solution**:
1. Check if `leaflet.css` appears in browser's Network tab
2. In nuxt.config.ts, verify:
   ```typescript
   css: [
     'leaflet/dist/leaflet.css',  // This line is critical
     '~/assets/css/main.css'
   ]
   ```
3. Restart dev server: `npm run dev`

### Map shows but no markers

**Cause**: Water body data not loading OR markers URL broken

**Solution**:
1. Check if `waterBodies` array has data:
   ```javascript
   // In browser console:
   console.log(document.querySelector('[data-testid="water-bodies"]'))
   ```
2. Verify marker icon URLs load in browser
3. Try opening this in browser address bar:
   ```
   https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-22c55e.png
   ```
   Should show a green marker image

### Map is zoomed out too far / controls don't work

**Cause**: Height/width not properly constrained

**Solution**:
1. Check that index.vue has:
   ```vue
   <LMap
     :zoom="9"
     :center="[54.5, 68.5]"
     class="w-full h-full"
     style="height: 100vh"
   >
   ```
2. Verify parent div also has:
   ```vue
   <div class="relative w-full" style="height: 100vh">
   ```
3. Restart dev server

---

## 📋 Checklist Before Running

- [ ] Run `npm install` (all dependencies installed)
- [ ] Check internet connection (Leaflet tiles loaded from CDN)
- [ ] Have at least 2GB RAM available
- [ ] Using modern browser (Chrome, Firefox, Edge)
- [ ] Not behind strict proxy/firewall blocking CDN

---

## 🧪 Quick Test

Copy this into `pages/test.vue` to verify Leaflet is working:

```vue
<template>
  <ClientOnly>
    <div style="height: 100vh; width: 100vw">
      <LMap :zoom="10" :center="[54.5, 68.5]" style="height: 100%; width: 100%">
        <LTileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap"
        />
      </LMap>
    </div>
  </ClientOnly>
</template>

<script setup>
import { LMap, LTileLayer } from '@vue-leaflet/vue-leaflet'
</script>
```

Navigate to `http://localhost:3000/test` to see if basic map works.

---

## 🔧 Package Versions to Verify

```bash
npm list leaflet @vue-leaflet/vue-leaflet nuxt vue
```

Should show:
- `leaflet@^1.9.4` ✓
- `@vue-leaflet/vue-leaflet@^0.10.1` ✓
- `nuxt@^4.2.1` ✓
- `vue@^3.5.25` ✓

---

## 💡 Advanced: Rebuild from Scratch

If nothing works:

```bash
cd watersko
npm run build
npm run generate
npm run preview
```

This builds for production and previews it locally. If it works in preview, the issue is with dev server.

---

## 📞 Still Not Working?

1. **Check console for specific error messages** - copy the full error text
2. **Verify all files were created**:
   - `app.vue` exists
   - `pages/index.vue` exists
   - `composables/useWaterBodies.ts` exists
3. **Check nuxt.config.ts** matches exactly:
   ```typescript
   export default defineNuxtConfig({
     compatibilityDate: '2025-07-15',
     devtools: { enabled: true },
     modules: ['@nuxtjs/tailwindcss'],
     css: [
       'leaflet/dist/leaflet.css',
       '~/assets/css/main.css'
     ]
   })
   ```

---

## ✨ Map Should Now Display With:

✓ Interactive OpenStreetMap tiles
✓ Color-coded markers (🟢 Green, 🟡 Yellow, 🔴 Red)
✓ Click-to-open popups with water body info
✓ Legend panel (top-left)
✓ Stats panel (top-right)
✓ Navigation buttons (bottom-left)
✓ Profile button (bottom-right)

---

**Last Updated**: November 26, 2025
