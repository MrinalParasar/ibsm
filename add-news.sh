#!/bin/bash

# News Management Script
# This script logs in and adds sample news articles to the database

# Configuration - Update these values
ADMIN_EMAIL="s@gmail.com"
ADMIN_PASSWORD="1234567890"
BASE_URL="http://localhost:3000"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== News Management Script ===${NC}\n"

# Step 1: Login and get token
echo -e "${YELLOW}Step 1: Logging in...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/admin/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"${ADMIN_EMAIL}\",
    \"password\": \"${ADMIN_PASSWORD}\"
  }")

# Check if login was successful
if echo "$LOGIN_RESPONSE" | grep -q "token"; then
  TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
  echo -e "${GREEN}✓ Login successful${NC}\n"
else
  echo -e "${RED}✗ Login failed: $LOGIN_RESPONSE${NC}"
  exit 1
fi

# Function to create news article
create_news() {
  local title="$1"
  local slug="$2"
  local category="$3"
  local excerpt="$4"
  local content="$5"
  local featured_image="$6"
  local post_type="$7"
  local author="$8"
  local publish_date="$9"
  local comments_count="${10}"
  local tags="${11}"
  local is_popular="${12}"
  local video_url="${13}"
  local quote_text="${14}"
  local gallery_images="${15}"
  local slider_images="${16}"

  # Build JSON payload
  local payload="{"
  payload+="\"title\":\"${title}\","
  payload+="\"slug\":\"${slug}\","
  payload+="\"category\":\"${category}\","
  payload+="\"excerpt\":\"${excerpt}\","
  payload+="\"content\":\"${content}\","
  payload+="\"featuredImage\":\"${featured_image}\","
  payload+="\"postType\":\"${post_type}\","
  payload+="\"author\":\"${author}\","
  payload+="\"publishDate\":\"${publish_date}\","
  payload+="\"commentsCount\":${comments_count},"
  payload+="\"tags\":[${tags}],"
  payload+="\"isPopularFeed\":${is_popular}"

  # Add optional fields based on post type
  if [ "$post_type" = "video" ] && [ -n "$video_url" ]; then
    payload+=",\"videoUrl\":\"${video_url}\""
  fi
  if [ "$post_type" = "quote" ] && [ -n "$quote_text" ]; then
    payload+=",\"quoteText\":\"${quote_text}\""
  fi
  if [ "$post_type" = "gallery" ] && [ -n "$gallery_images" ]; then
    payload+=",\"galleryImages\":[${gallery_images}]"
  fi
  if [ "$post_type" = "slider" ] && [ -n "$slider_images" ]; then
    payload+=",\"sliderImages\":[${slider_images}]"
  fi

  payload+="}"

  echo -e "${YELLOW}Creating: ${title}...${NC}"
  RESPONSE=$(curl -s -X POST "${BASE_URL}/api/admin/news" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${TOKEN}" \
    -d "$payload")

  if echo "$RESPONSE" | grep -q "successfully"; then
    echo -e "${GREEN}✓ Created successfully${NC}\n"
  else
    echo -e "${RED}✗ Failed: $RESPONSE${NC}\n"
  fi
}

# Sample News Articles

echo -e "${YELLOW}Step 2: Creating news articles...${NC}\n"

# Article 1: Regular Post
create_news \
  "Achieving Fashion Elegant Design Runway Life" \
  "achieving-fashion-elegant-design-runway-life" \
  "Digital Marketing" \
  "There are many variations of passages of Lorem Ipsum available, but majority have suffered teration in some form, by injected humour, or randomised words which don't look even slight believable." \
  "With worldwide annual spend on digital advertising surpassing \$325 billion, it's no surprise that different approaches to online marketing are becoming available. One of these new approaches is performance marketing or digital performance marketing. Keep reading to learn all about performance marketing, from how it works to how it compares to digital marketing." \
  "/assets/img/news/post-1.jpg" \
  "regular" \
  "Shikhon .Ha" \
  "2024-03-24" \
  "35" \
  "\"Marketing\",\"Design\",\"Fashion\"" \
  "true" \
  "" \
  "" \
  "" \
  ""

# Article 2: Regular Post
create_news \
  "List of 5 ways Generating Real Time Audio Sentiment Analysis" \
  "list-of-5-ways-generating-real-time-audio-sentiment-analysis" \
  "SEO optimization" \
  "There are many variations of passages of Lorem Ipsum available, but majority have suffered teration in some form, by injected humour, or randomised words." \
  "Performance marketing is an approach to digital marketing or advertising where businesses only pay when a specific result occurs. This result could be a new lead, sale, or other outcome agreed upon by the advertiser and business." \
  "/assets/img/news/post-2.jpg" \
  "regular" \
  "John Doe" \
  "2024-03-25" \
  "28" \
  "\"SEO\",\"Analytics\",\"Marketing\"" \
  "true" \
  "" \
  "" \
  "" \
  ""

# Article 3: Video Post
create_news \
  "Video Content Marketing Strategies" \
  "video-content-marketing-strategies" \
  "Content Marketing" \
  "Watch our latest video content about digital marketing strategies and learn how to create engaging video content." \
  "Video marketing has become one of the most effective ways to engage with your audience. In this post, we explore various strategies for creating compelling video content that drives engagement and conversions." \
  "/assets/img/news/post-6.jpg" \
  "video" \
  "Sarah Johnson" \
  "2024-03-24" \
  "15" \
  "\"Video\",\"Marketing\",\"Content\"" \
  "false" \
  "https://www.youtube.com/watch?v=Cn4G2lZ_g2I" \
  "" \
  "" \
  ""

# Article 4: Quote Post
create_news \
  "Inspirational Business Quote" \
  "inspirational-business-quote" \
  "Marketing" \
  "An inspiring quote about success and achievement in business." \
  "This quote post highlights an important message about business success and perseverance." \
  "/assets/img/news/post-4.jpg" \
  "quote" \
  "Jane Smith" \
  "2024-03-24" \
  "25" \
  "\"Quote\",\"Inspiration\",\"Business\"" \
  "true" \
  "" \
  "Excepteur sint occaecat cupida tat non proident, sunt in." \
  "" \
  ""

# Article 5: Audio Post
create_news \
  "How to Remedy Tailbone Back Problems" \
  "how-to-remedy-tailbone-back-problems" \
  "Content Marketing" \
  "Listen to our audio content about health and wellness, specifically addressing tailbone and back problems." \
  "In this audio post, we discuss various remedies and exercises for tailbone and back problems. The content is available in audio format for easy listening." \
  "/assets/img/news/post-5.jpg" \
  "audio" \
  "Dr. Michael Chen" \
  "2024-03-24" \
  "12" \
  "\"Audio\",\"Health\",\"Wellness\"" \
  "false" \
  "" \
  "" \
  "" \
  ""

# Article 6: Gallery Post
create_news \
  "Photo Gallery Showcase" \
  "photo-gallery-showcase" \
  "Design" \
  "A collection of beautiful images showcasing our work and design projects." \
  "This gallery post displays multiple images in a grid layout, showcasing various design projects and creative work." \
  "/assets/img/news/post-7.jpg" \
  "gallery" \
  "Photography Team" \
  "2024-03-24" \
  "8" \
  "\"Gallery\",\"Photography\",\"Design\"" \
  "false" \
  "" \
  "" \
  "\"/assets/img/news/post-7.jpg\",\"/assets/img/news/post-8.jpg\",\"/assets/img/news/post-9.jpg\"" \
  ""

# Article 7: Slider Post
create_news \
  "Slider Post Example" \
  "slider-post-example" \
  "Marketing" \
  "A slider post with multiple images that can be navigated through." \
  "This slider post displays images in a carousel format with navigation arrows, allowing users to browse through multiple images." \
  "/assets/img/news/post-7.jpg" \
  "slider" \
  "Design Team" \
  "2024-03-24" \
  "20" \
  "\"Slider\",\"Images\",\"Marketing\"" \
  "true" \
  "" \
  "" \
  "" \
  "\"/assets/img/news/post-7.jpg\",\"/assets/img/news/post-8.jpg\",\"/assets/img/news/post-9.jpg\""

# Article 8: Regular Post - Your Guide
create_news \
  "Your Guide To Becoming A Preferred Shipper" \
  "your-guide-to-becoming-a-preferred-shipper" \
  "Digital Marketing" \
  "With worldwide annual spend on digital advertising surpassing \$325 billion, it's no surprise that different approaches to online marketing are becoming available." \
  "With worldwide annual spend on digital advertising surpassing \$325 billion, it's no surprise that different approaches to online marketing are becoming available. One of these new approaches is performance marketing or digital performance marketing. Keep reading to learn all about performance marketing, from how it works to how it compares to digital marketing. Plus, get insight into the benefits and risks of performance marketing and how it can affect your company's long-term success and profitability. Performance marketing is an approach to digital marketing or advertising where businesses only pay when a specific result occurs. This result could be a new lead, sale, or other outcome agreed upon by the advertiser and business. Performance marketing involves channels such as affiliate marketing, online advertising." \
  "/assets/img/news/post-4.jpg" \
  "regular" \
  "Shikhon .Ha" \
  "2024-02-04" \
  "15" \
  "\"Marketing\",\"SEO\",\"Content\"" \
  "true" \
  "" \
  "" \
  "" \
  ""

echo -e "${GREEN}=== Script completed ===${NC}"
echo -e "Visit ${BASE_URL}/news to see your news articles"

