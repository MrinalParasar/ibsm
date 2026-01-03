# News API - Curl Examples

## Step 1: Login to get JWT Token

First, you need to login to get an authentication token:

```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your-password"
  }'
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-id",
    "email": "admin@example.com",
    "name": "Admin Name"
  }
}
```

Save the `token` value for the next step.

---

## Step 2: Create News Articles

Use the token from Step 1 in the Authorization header.

### Example 1: Regular News Post

```bash
curl -X POST http://localhost:3000/api/admin/news \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Achieving Fashion Elegant Design Runway Life",
    "slug": "achieving-fashion-elegant-design-runway-life",
    "category": "Digital Marketing",
    "excerpt": "There are many variations of passages of Lorem Ipsum available, but majority have suffered teration in some form, by injected humour, or randomised words which don't look even slight believable.",
    "content": "With worldwide annual spend on digital advertising surpassing $325 billion, it's no surprise that different approaches to online marketing are becoming available. One of these new approaches is performance marketing or digital performance marketing. Keep reading to learn all about performance marketing, from how it works to how it compares to digital marketing. Plus, get insight into the benefits and risks of performance marketing and how it can affect your company's long-term success and profitability.",
    "featuredImage": "/assets/img/news/post-1.jpg",
    "postType": "regular",
    "author": "Shikhon .Ha",
    "authorImage": "/assets/img/news/author-1.jpg",
    "publishDate": "2024-03-24",
    "commentsCount": 35,
    "tags": ["Marketing", "Design", "Fashion"],
    "isPopularFeed": true
  }'
```

### Example 2: Video Post

```bash
curl -X POST http://localhost:3000/api/admin/news \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Video Post Example",
    "slug": "video-post-example",
    "category": "Content Marketing",
    "excerpt": "Watch our latest video content about digital marketing strategies.",
    "content": "This is a video post that includes embedded video content. The video URL will be used to display a play button overlay on the featured image.",
    "featuredImage": "/assets/img/news/post-6.jpg",
    "postType": "video",
    "videoUrl": "https://www.youtube.com/watch?v=Cn4G2lZ_g2I",
    "author": "John Doe",
    "publishDate": "2024-03-24",
    "commentsCount": 15,
    "tags": ["Video", "Marketing", "Content"],
    "isPopularFeed": false
  }'
```

### Example 3: Quote Post

```bash
curl -X POST http://localhost:3000/api/admin/news \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Inspirational Quote",
    "slug": "inspirational-quote",
    "category": "SEO optimization",
    "excerpt": "An inspiring quote about success and achievement.",
    "content": "This is a quote post that displays a highlighted quote with special styling.",
    "featuredImage": "/assets/img/news/post-4.jpg",
    "postType": "quote",
    "quoteText": "Excepteur sint occaecat cupida tat non proident, sunt in.",
    "author": "Jane Smith",
    "publishDate": "2024-03-24",
    "commentsCount": 25,
    "tags": ["Quote", "Inspiration"],
    "isPopularFeed": true
  }'
```

### Example 4: Audio Post

```bash
curl -X POST http://localhost:3000/api/admin/news \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "How to Remedy Tailbone Back Problems",
    "slug": "how-to-remedy-tailbone-back-problems",
    "category": "Content Marketing",
    "excerpt": "Listen to our audio content about health and wellness.",
    "content": "This post includes an embedded audio player. The audio embed code should be an iframe or embed code from your audio hosting service.",
    "featuredImage": "/assets/img/news/post-5.jpg",
    "postType": "audio",
    "audioEmbed": "<iframe allow=\"autoplay\" src=\"https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/316547873&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true\" />",
    "author": "Dr. Sarah Johnson",
    "publishDate": "2024-03-24",
    "commentsCount": 12,
    "tags": ["Audio", "Health", "Wellness"],
    "isPopularFeed": false
  }'
```

### Example 5: Gallery Post

```bash
curl -X POST http://localhost:3000/api/admin/news \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Photo Gallery Showcase",
    "slug": "photo-gallery-showcase",
    "category": "Design",
    "excerpt": "A collection of beautiful images showcasing our work.",
    "content": "This is a gallery post that displays multiple images in a grid layout.",
    "featuredImage": "/assets/img/news/post-7.jpg",
    "postType": "gallery",
    "galleryImages": [
      "/assets/img/news/post-7.jpg",
      "/assets/img/news/post-8.jpg",
      "/assets/img/news/post-9.jpg"
    ],
    "author": "Photography Team",
    "publishDate": "2024-03-24",
    "commentsCount": 8,
    "tags": ["Gallery", "Photography", "Design"],
    "isPopularFeed": false
  }'
```

### Example 6: Slider Post

```bash
curl -X POST http://localhost:3000/api/admin/news \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Slider Post Example",
    "slug": "slider-post-example",
    "category": "Marketing",
    "excerpt": "A slider post with multiple images that can be navigated.",
    "content": "This is a slider post that displays images in a carousel format with navigation arrows.",
    "featuredImage": "/assets/img/news/post-7.jpg",
    "postType": "slider",
    "sliderImages": [
      "/assets/img/news/post-7.jpg",
      "/assets/img/news/post-8.jpg",
      "/assets/img/news/post-9.jpg"
    ],
    "author": "Design Team",
    "publishDate": "2024-03-24",
    "commentsCount": 20,
    "tags": ["Slider", "Images", "Marketing"],
    "isPopularFeed": true
  }'
```

---

## Complete Workflow Example

Here's a complete example that logs in and creates a news post in one script:

```bash
#!/bin/bash

# Step 1: Login
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your-password"
  }')

# Extract token (requires jq: brew install jq)
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')

echo "Token: $TOKEN"

# Step 2: Create News
curl -X POST http://localhost:3000/api/admin/news \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Your Guide To Becoming A Preferred Shipper",
    "slug": "your-guide-to-becoming-a-preferred-shipper",
    "category": "Digital Marketing",
    "excerpt": "With worldwide annual spend on digital advertising surpassing $325 billion, it's no surprise that different approaches to online marketing are becoming available.",
    "content": "With worldwide annual spend on digital advertising surpassing $325 billion, it's no surprise that different approaches to online marketing are becoming available. One of these new approaches is performance marketing or digital performance marketing. Keep reading to learn all about performance marketing, from how it works to how it compares to digital marketing. Plus, get insight into the benefits and risks of performance marketing and how it can affect your company's long-term success and profitability.\n\nPerformance marketing is an approach to digital marketing or advertising where businesses only pay when a specific result occurs. This result could be a new lead, sale, or other outcome agreed upon by the advertiser and business. Performance marketing involves channels such as affiliate marketing, online advertising.",
    "featuredImage": "/assets/img/news/post-4.jpg",
    "postType": "regular",
    "author": "Shikhon .Ha",
    "authorImage": "/assets/img/news/author-1.jpg",
    "publishDate": "2024-02-04",
    "commentsCount": 15,
    "tags": ["Marketing", "SEO", "Content"],
    "isPopularFeed": true
  }'
```

---

## Quick Test Script

Save this as `add-news.sh` and make it executable:

```bash
chmod +x add-news.sh
```

Then run:
```bash
./add-news.sh
```

---

## Notes

- Replace `YOUR_TOKEN_HERE` with the actual token from the login response
- Replace `admin@example.com` and `your-password` with your actual admin credentials
- Replace image paths with actual image URLs or paths
- The `slug` field is optional - it will be auto-generated from the title if not provided
- Date format should be `YYYY-MM-DD` (e.g., "2024-03-24")
- `isPopularFeed` determines if the news appears in the sidebar's "Popular Feeds" section
- `tags` should be an array of strings
- `commentsCount` defaults to 0 if not provided

