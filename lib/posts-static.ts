import matter from 'gray-matter'

export interface Post {
  slug: string
  title: string
  date: string
  time: string
  excerpt: string
  content: string
  readTime: number
  image?: string
  formattedDate: string
  uploadTimestamp: number
  tags: string[]
  categories: string[]
}

function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  const cleanContent = content
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\n+/g, ' ')
    .trim()
  
  const words = cleanContent.split(/\s+/).filter(word => word.length > 0).length
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return dateString
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return dateString
  }
}

function getImagePath(slug: string): string | undefined {
  const imagePath = `/images/posts/${slug}.webp`
  return imagePath // For static export, we'll assume images exist
}

function calculateUploadTimestamp(date: string, time: string): number {
  try {
    const normalizedDate = date.replace(/(\d{4})-(\d{1,2})-(\d{1,2})/, (match: string, year: string, month: string, day: string) => `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`)
    const dateTimeString = time ? `${normalizedDate}T${time}:00` : `${normalizedDate}T00:00:00`
    const parsedDate = new Date(dateTimeString)
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate.getTime()
    }
    return Date.now() // fallback to current time
  } catch {
    return Date.now()
  }
}

// Static posts data
const postsData = [
  {
    slug: "Autumn-Is-Coming-Cozy-Up-Your-Home-with-Etsy-Digital-Prints",
    content: `Autumn Is Coming: Cozy Up Your Home with Etsy Digital Prints

There's something magical about the arrival of autumn—the golden light, the rustle of falling leaves, and the comforting urge to nest indoors. As the season shifts, many of us feel inspired to refresh our spaces with cozy, earthy touches. One of the easiest and most affordable ways to do that? Etsy digital prints.

Why Go Digital This Fall?

Digital prints offer a fast, eco-friendly, and budget-savvy way to decorate your home for the season. Here's why they're perfect for autumn:

Instant Download: No waiting for shipping—download and print the same day.
Endless Variety: From rustic botanicals to minimalist pumpkin quotes, Etsy has it all.
Customizable Sizes: Print at home or at your local shop in any size you need.
Reusable Year After Year: Save your favorite files and redecorate each fall without repurchasing.

Finding the Perfect Autumn Prints

Etsy is brimming with talented creators offering seasonal digital art. Look for themes like:

- Warm-toned florals with dried wheat and eucalyptus  
- Moody landscapes with misty forests and harvest moons  
- Typography prints with cozy quotes like "Hello Autumn" or "Pumpkin Spice & Everything Nice"  
- Minimalist line art of leaves, acorns, or woodland creatures  

Simply search "autumn digital wall art" or "fall printable decor" and filter by "Digital" under item type.

How to Display Your Prints

Once you've downloaded your favorites, printing is a breeze:

1. Choose your paper—matte for a soft look, or cardstock for durability.  
2. Print at home or upload to a local print shop for larger frames.  
3. Pop them into thrifted frames, clipboards, or even lean them on shelves for a relaxed vibe.  

Pro tip: Create a seasonal gallery wall by mixing and matching 3–5 prints in coordinating tones like burnt orange, olive green, and deep burgundy.

Conclusion

Autumn invites us to slow down, savor the moment, and surround ourselves with warmth. With Etsy digital prints, you can effortlessly infuse your home with the spirit of the season—no renovation required. Whether you're styling a reading nook, updating your entryway, or gifting a cozy touch to a friend, these instant downloads bring fall's charm to life in minutes.

So light a candle, pour a mug of apple cider, and let your walls whisper, "Autumn is here."`,
    frontmatter: {
      title: "Autumn Is Coming: Cozy Up Your Home with Etsy Digital Prints",
      date: "2024-10-1",
      time: "12:00",
      excerpt: "As the leaves begin to turn and the air grows crisp, discover how Etsy digital prints can instantly bring warm autumn vibes into your home—no shipping, no wait, just instant seasonal charm.",
      tags: ["home decor", "art", "autumn"],
      categories: ["Reviews"],
      image: "/images/posts/Autumn-Is-Coming-Cozy-Up-Your-Home-with-Etsy-Digital-Prints.webp"
    }
  },
  {
    slug: "Capture-Crisp-Audio-Anywhere-Why-the-RODE-Wireless-ME-Is-a-Game-Changer-for-Content-Creator",
    content: `Capture Crisp Audio Anywhere: Why the RØDE Wireless ME Is a Game-Changer for Content Creators

In the world of content creation, great visuals only tell half the story. Clear, clean audio is what keeps your audience engaged—and that's where the **RØDE Wireless ME** shines. Designed for creators on the go, this compact wireless microphone system brings broadcast-quality sound to your smartphone, mirrorless camera, or tablet without the complexity or cost of traditional setups.

👉 **[Get the RØDE Wireless ME on Amazon (with free shipping and Prime eligibility)](https://amzn.to/48f0UCx)**

Why You'll Love the RØDE Wireless ME

RØDE has long been trusted by professionals, and the Wireless ME distills that expertise into an ultra-portable, user-friendly kit. Here's what makes it stand out:

**All-in-One Simplicity**  
The system includes a compact transmitter with a built-in microphone and a receiver that plugs directly into your device via USB-C, Lightning, or 3.5mm—no extra adapters needed. It's ready to use right out of the box.

**Crystal-Clear Audio**  
With a high-quality omnidirectional mic capsule and 24-bit/48kHz digital transmission, the Wireless ME captures rich, detailed sound while minimizing background noise. Perfect for outdoor shoots, indoor interviews, or even voiceovers.

**Compact & Camera-Mountable**  
Both the transmitter and receiver are lightweight and small enough to clip onto a lapel, bag strap, or camera hot shoe. The included foam windscreen helps reduce wind noise, making it ideal for on-the-move filming.

**Long Battery Life & Secure Connection**  
Enjoy up to 7 hours of continuous use on a single charge, and a stable wireless range of up to 200 meters (line of sight). The secure digital connection ensures no dropouts or interference—unlike Bluetooth alternatives.

**Made for Smartphones (and More)**  
Unlike many pro mics that require extra dongles, the Wireless ME comes with **three cables**: USB-C, Lightning, and TRS. Whether you're using an iPhone, Android, or DSLR, you're covered.

Real-World Use Cases

- **Vloggers**: Capture clean voice audio while walking through a park or city street.  
- **Interviewers**: Get studio-quality sound from your subject without bulky gear.  
- **Educators & Streamers**: Ensure your lessons or live sessions are heard clearly, even in noisy environments.  
- **Travel Creators**: Pack light without sacrificing audio quality.

Final Thoughts

In a market full of gimmicks and half-baked audio solutions, the RØDE Wireless ME delivers professional performance with plug-and-play simplicity. At an accessible price point and with RØDE's legendary reliability, it's one of the smartest investments a modern creator can make.

If your content deserves to be heard as clearly as it's seen—this mic is your new best friend.

> **Pro Tip**: Pair it with a small tripod and your smartphone for a complete mobile studio setup under $300.

🛒 **Ready to upgrade your audio? [Grab the RØDE Wireless ME on Amazon today!](https://amzn.to/48f0UCx)**`,
    frontmatter: {
      title: "Capture Crisp Audio Anywhere: Why the RODE Wireless ME Is a Game Changer for Content Creator",
      date: "2025-10-30",
      time: "12:00",
      excerpt: "The RODE Wireless ME microphone combo delivers studio-quality sound with built-in rechargeable batteries, up to 100 meters of range, intuitive app control, and Safety Channel tech—ideal for YouTubers, podcasters, and filmmakers.",
      tags: ["audio", "microphones", "content creation"],
      categories: ["Reviews"],
      image: "/images/posts/Capture-Crisp-Audio-Anywhere-Why-the-RODE-Wireless-ME-Is-a-Game-Changer-for-Content-Creator.webp"
    }
  }
  // Add more posts here as needed
]

// Convert raw data to Post interface
function createPostFromData(data: typeof postsData[0]): Post {
  const { slug, content, frontmatter } = data
  const image = getImagePath(slug)
  const formattedDate = formatDate(frontmatter.date)
  const time = frontmatter.time
  const uploadTimestamp = calculateUploadTimestamp(frontmatter.date, time)

  return {
    slug,
    title: frontmatter.title,
    date: frontmatter.date,
    time,
    excerpt: frontmatter.excerpt,
    content,
    readTime: calculateReadTime(content),
    image,
    formattedDate,
    uploadTimestamp,
    tags: frontmatter.tags,
    categories: frontmatter.categories,
  }
}

// Static exports
export function getAllPosts(): Post[] {
  return postsData
    .map(createPostFromData)
    .sort((a, b) => {
      const timestampA = a.uploadTimestamp || 0
      const timestampB = b.uploadTimestamp || 0
      return timestampB - timestampA
    })
}

export function getPostBySlug(slug: string): Post | null {
  const postData = postsData.find(post => post.slug === slug)
  return postData ? createPostFromData(postData) : null
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter(post => post.tags.includes(tag))
}

export function getAllTags(): string[] {
  const posts = getAllPosts()
  const tags = new Set<string>()
  posts.forEach(post => {
    post.tags.forEach(tag => tags.add(tag))
  })
  return Array.from(tags).sort()
}

export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter(post => post.categories.includes(category))
}

export function getAllCategories(): string[] {
  const posts = getAllPosts()
  const categories = new Set<string>()
  posts.forEach(post => {
    post.categories.forEach(category => categories.add(category))
  })
  return Array.from(categories).sort()
}
