# 🌊 WaterSKO - Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
cd watersko
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open in Browser
Navigate to: **http://localhost:3000**

---

## 🗺️ Site Map

### Pages Available

| Page | URL | Purpose |
|------|-----|---------|
| 🏠 **Home (Map)** | `/` | Interactive map with water body markers |
| 📊 **Scientific Data** | `/scientific-data` | Measurement tables, export, analytics |
| 💬 **Resident Reviews** | `/resident-reviews` | Community feedback & ratings |
| 🌱 **Eco-Activism** | `/eco-activism` | Cleanup events & conservation hub |
| 👤 **User Profile** | `/profile` | User accounts & role management |

---

## 🎯 How to Use Each Feature

### 1. 🏠 Home Page (Interactive Map)

**What you'll see:**
- Interactive map of North Kazakhstan
- Color-coded markers (🟢 Clean, 🟡 At Risk, 🔴 Polluted)
- Water body statistics panel
- Navigation menu

**What you can do:**
- **Click a marker** → View water body details in popup
- **Click "View Details"** → Open full water body card with info
- **Use navigation buttons** → Jump to other features
- **Check stats** → See overview of water body conditions

**Try this:**
```
1. Click on "Imantau Lake" (red marker)
2. Click "View Details" in the popup
3. See temperature, transparency, conductivity info
4. Click "Leave a Review" to go to reviews page
```

---

### 2. 📊 Scientific Data Page

**What you'll see:**
- Table of hydrological measurements
- Filter controls (water body, date range)
- Export buttons (CSV, PDF, Print)
- Statistics dashboard (avg temp, transparency, conductivity)

**What you can do:**
- **Filter by water body** → Select from dropdown
- **Filter by date** → Set from/to dates
- **Sort columns** → Click column headers (↑/↓)
- **Export data** → Download as CSV or print
- **View statistics** → See aggregated measurements

**Try this:**
```
1. Filter by "Imantau Lake"
2. Sort by "Date" (descending for newest first)
3. Export to CSV
4. View average temperature
```

---

### 3. 💬 Resident Reviews Page

**What you'll see:**
- List of community reviews
- Review submission form
- Star ratings and comments
- Filtered by water body

**What you can do:**
- **Leave a review** → Click "✏️ Leave a Review"
  - Select water body
  - Rate with stars (1-5)
  - Write comment
  - Submit
- **Read reviews** → See what others observed
- **Filter reviews** → Select water body to see specific feedback

**Try this:**
```
1. Click "Leave a Review"
2. Select "Shalkar Lake"
3. Give 4 stars
4. Comment: "Water is clearer than last time!"
5. Submit review
```

---

### 4. 🌱 Eco-Activism Hub

**What you'll see:**
- Cleanup event list
- Create event form
- Polluted spots grid
- Random spot motivator

**What you can do:**
- **Create event** → Click "+ Create Cleanup Event"
  - Choose location
  - Set date
  - Add description
  - Submit
- **Join event** → Click "🤝 I'm Going!" on any event
- **Track progress** → See events move from Planned → In Progress → Completed
- **Random spot** → Click "🎲 Random Problematic Spot" for motivation
- **Mark as going** → "I'm Going to Clean This!"

**Try this:**
```
1. Click "🎲 Random Problematic Spot"
2. See random polluted location
3. Click "✓ I'm Going to Clean This!"
4. Create cleanup event for that location
5. Invite others to join
```

---

### 5. 👤 User Profile

**What you'll see:**
- Role selection screen (demo)
- User dashboard with capabilities
- Activity statistics
- Recent activity feed

**What you can do:**
- **Select role** → Choose Guest, Activist, or Researcher
- **See capabilities** → Learn what each role can do
  - **Guest**: Read, comment, rate
  - **Activist**: Create events, mark cleanup status
  - **Researcher**: Add measurements, export data
- **Switch roles** → Change roles dynamically
- **View activity** → See your contributions
- **Logout** → Return to role selection

**Try this:**
```
1. Login as "Researcher"
2. See researcher features highlighted
3. Click "Switch to Activist"
4. See different capabilities
5. Check activity stats
```

---

## 🎨 Color Meanings

| Color | Status | Meaning |
|-------|--------|---------|
| 🟢 Green | Clean | Safe water quality |
| 🟡 Yellow | At Risk | Moderate concerns |
| 🔴 Red | Polluted | Needs intervention |

---

## 📊 Sample Data Included

### Water Bodies (5)
- Imantau Lake (Polluted)
- Ishim River (Clean)
- Shalkar Lake (At Risk)
- Bolshoy Tarangul Lake (Clean)
- Pestroye Lake (Polluted)

### Measurements (5)
- Temperature: 14-20°C
- Transparency: 1.5-3.5m
- Conductivity: 280-520 μS/cm

### Reviews (5)
- Various ratings (2-5 stars)
- Community feedback examples

### Events (3)
- Different statuses (Planned, In Progress, Completed)
- Multiple participants

---

## 🔧 Common Tasks

### Export Measurement Data
```
1. Go to Scientific Data page
2. Filter by date/water body (optional)
3. Click "📥 Export CSV" or "📄 Export PDF"
4. File will download to your computer
```

### Create a Cleanup Event
```
1. Go to Eco-Activism page
2. Click "+ Create Cleanup Event"
3. Select polluted water body
4. Choose date
5. Describe the cleanup work
6. Click "✓ Create Event"
7. Others can join from the event list
```

### Review a Water Body
```
1. Go to Resident Reviews page
2. Click "✏️ Leave a Review"
3. Select water body
4. Rate 1-5 stars
5. Write observation
6. Submit
```

### Find a Random Cleanup Spot
```
1. Go to Eco-Activism page
2. Click "🎲 Random Problematic Spot"
3. See motivation with random polluted location
4. Click "✓ I'm Going to Clean This!"
5. Optionally create event for that spot
```

---

## 🛠️ Development Commands

### Build Production
```bash
npm run build
```

### Generate Static Site
```bash
npm run generate
```

### Preview Production Build
```bash
npm run preview
```

---

## 📱 Mobile-Friendly

All pages are responsive! Features adapt for:
- **Desktop**: Full layout with multiple columns
- **Tablet**: Adjusted spacing and sizing
- **Mobile**: Single column, compact buttons

Try resizing your browser to see responsive changes!

---

## ❓ Troubleshooting

### Map not showing?
- Check that Leaflet CDN is accessible
- Try refreshing the page
- Check browser console for errors

### Can't create event?
- Make sure water body is selected
- Date must be set
- Description field can be empty

### Export not working?
- CSV export is ready to use
- PDF export requires jsPDF library (coming soon)
- Print uses browser print dialog

### Performance issues?
- Reduce number of visible markers (filter by water body)
- Check network connection
- Try refreshing the page

---

## 🎓 Learn More

For development guidelines and architecture:
→ See `.github/copilot-instructions.md`

For implementation details:
→ See `IMPLEMENTATION.md`

---

## 🌟 Key Features Highlight

✨ **Interactive Map** - See water bodies at a glance
📊 **Data Export** - CSV & print capabilities
👥 **Community** - Share observations with others
🌱 **Action** - Organize cleanup events
🎭 **Roles** - Different access levels (Guest/Activist/Researcher)

---

**Happy exploring! 🚀**

Need help? Check the in-app buttons for more details on each feature.
