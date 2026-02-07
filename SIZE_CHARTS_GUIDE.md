# Size Charts Guide - Three Categories

The system now supports **three different size charts** that automatically display based on the collection category!

## 📏 Size Chart Types

### 1. Women's/Adult (Default)
**Columns:** Size, Bust, Waist, Hip  
**Sizes:** S, M, L, XL  
**Used for:** All collections except Kids and Menswear

| Size | Bust (in) | Waist (in) | Hip (in) |
|------|-----------|------------|----------|
| S | 32-34 | 26-28 | 34-36 |
| M | 34-36 | 28-30 | 36-38 |
| L | 36-38 | 30-32 | 38-40 |
| XL | 38-40 | 32-34 | 40-42 |

---

### 2. Kidswear ✨
**Columns:** Size, Age, Height, Chest  
**Sizes:** 1, 2, 3, 4, 5 (numbered)  
**Used for:** Little Wonders collection (`category: "kidswear"`)

| Size | Age | Height (in) | Chest (in) |
|------|-----|-------------|------------|
| 1 | 2-3 years | 35-38 | 20-21 |
| 2 | 4-5 years | 39-43 | 22-23 |
| 3 | 6-7 years | 44-48 | 24-25 |
| 4 | 8-9 years | 49-52 | 26-27 |
| 5 | 10-12 years | 53-58 | 28-30 |

**Note:** Sizes are numbered 1-5 for simplicity and clarity for children's wear.

---

### 3. Menswear ✨ NEW
**Columns:** Size, Chest, Waist, Shoulder  
**Sizes:** S, M, L, XL, XXL  
**Used for:** Modern Gentleman collection (`category: "menswear"`)

| Size | Chest (in) | Waist (in) | Shoulder (in) |
|------|------------|------------|---------------|
| S | 36-38 | 30-32 | 17-17.5 |
| M | 38-40 | 32-34 | 17.5-18 |
| L | 40-42 | 34-36 | 18-18.5 |
| XL | 42-44 | 36-38 | 18.5-19 |
| XXL | 44-46 | 38-40 | 19-19.5 |

**Note:** Includes shoulder measurements for proper fit and tailoring.

---

## 🎯 How It Works

The system automatically detects which size chart to show based on the collection:

```typescript
// Checks collection category
const isKidswear = collections.some(
  collection => collection.category === 'kidswear' && 
  collection.dresses.includes(dress.slug)
)

const isMenswear = collections.some(
  collection => collection.category === 'menswear' && 
  collection.dresses.includes(dress.slug)
)
```

**Logic:**
1. If dress is in a collection with `category: "kidswear"` → Show Kids chart
2. If dress is in a collection with `category: "menswear"` → Show Men's chart
3. Otherwise → Show Women's/Adult chart

---

## 📝 Updating Sizes in Shop Data

### For Kidswear Items
Update `lib/data/shop.ts` to use numbered sizes:

```typescript
{
  "slug": "3dress",
  "name": "Kids Dress 3",
  "sizes": ["1", "2", "3", "4", "5"],  // ← Numbered sizes
  // ... rest
}
```

### For Menswear Items
Use standard sizes with optional XXL:

```typescript
{
  "slug": "5dress",
  "name": "Men's Shirt 5",
  "sizes": ["S", "M", "L", "XL", "XXL"],  // ← Include XXL if needed
  // ... rest
}
```

### For Women's Items
Use standard sizes:

```typescript
{
  "slug": "1dress",
  "name": "Dress 1",
  "sizes": ["S", "M", "L", "XL"],
  // ... rest
}
```

---

## 🧪 Testing

### Test Kidswear Chart
Visit: http://localhost:3000/shop/3dress or http://localhost:3000/shop/4dress
- Should show numbered sizes (1, 2, 3, 4, 5)
- Chart shows: Age, Height, Chest

### Test Menswear Chart
Visit: http://localhost:3000/shop/5dress
- Should show sizes (S, M, L, XL, XXL)
- Chart shows: Chest, Waist, Shoulder

### Test Women's Chart
Visit: http://localhost:3000/shop/1dress or any other dress
- Should show sizes (S, M, L, XL)
- Chart shows: Bust, Waist, Hip

---

## ✨ Benefits

1. **Automatic Detection** - No manual tagging per dress
2. **Category-Specific** - Appropriate measurements for each category
3. **Professional** - Industry-standard size charts
4. **Clear Sizing** - Numbered sizes for kids (1-5) are easier to understand
5. **Comprehensive** - Covers all three major categories

---

## 📋 Current Collection Distribution

**Women's Collections:**
- Signature Elegance (4 dresses)
- Evening Atelier (3 dresses)
- Contemporary Craft (4 dresses)
- Minimalist Poetry (6 dresses)

**Kids Collection:**
- Little Wonders (2 dresses) - Sizes: 1, 2, 3, 4, 5

**Men's Collection:**
- Modern Gentleman (1 dress) - Sizes: S, M, L, XL, XXL

---

**All three size charts are now live and working!** 🎨✨

---

## 🖼️ Thumbnail Image Specifications

### Recommended Thumbnail Sizes

For optimal display quality across all devices (including retina displays), thumbnail images in `public/images/shop/thumbnails` should follow these specifications:

**Dimensions:** 192px × 256px  
**Aspect Ratio:** 3:4 (portrait)  
**Format:** WebP (for optimal performance and file size)  
**Quality:** 80-85% (balance between quality and file size)

### Why These Dimensions?

The thumbnails display at different sizes across devices:
- **Mobile:** 48px wide (w-12)
- **Tablet:** 56px wide (w-14)
- **Desktop:** 64px wide (w-16)

At **192px × 256px**, thumbnails are **3x the largest display size** (64px × 3 = 192px), ensuring:
- ✅ Sharp, crisp images on retina/high-DPI displays
- ✅ No pixelation when scaled
- ✅ Reasonable file sizes with WebP compression
- ✅ Fast loading times

### File Naming Convention

Follow the existing pattern:
```
public/images/shop/thumbnails/
  ├── 1dress/
  │   ├── 1dress-cover.webp
  │   └── 1dress-1.webp
  ├── 2dress/
  │   ├── 2dress-cover.webp
  │   ├── 2dress-1.webp
  │   ├── 2dress-2.webp
  │   └── 2dress-3.webp
  └── ...
```

### Conversion Tips

If converting from existing JPG images:

```bash
# Using ImageMagick or similar tool
convert input.jpg -resize 192x256^ -gravity center -extent 192x256 -quality 85 output.webp
```

Or use online tools like:
- Squoosh.app (Google's image optimizer)
- CloudConvert
- TinyPNG (also supports WebP)

### Current Implementation

Thumbnails are displayed with:
- Compact sizing across all screens (48px → 56px → 64px)
- 3:4 aspect ratio maintained
- Gold ring highlight when active
- Smooth hover and selection effects
- Minimal gaps between thumbnails (gap-1.5 sm:gap-2)

**Result:** Clean, gallery-like presentation that works beautifully on all devices! 📱💻🖥️
