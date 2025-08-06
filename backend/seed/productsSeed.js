import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";

dotenv.config();

const mongoUri = process.env.MODNO_DB || process.env.MONGO_URI;
if (!mongoUri) {
  console.error("Missing DB connection string");
  process.exit(1);
}

await mongoose.connect(mongoUri);
console.log("Mongo connected");

const items = [
  {
    name: "Satin Slip Dress",
    brand: "Zara",
    price: 49.9,
    image: "/images/zarasatin.jpg",
    countInStock: 12,
    colors: ["#c7e1e6", "#000000"],
    onSale: true,
    salePercent: 20,
    category: "Dress",
    description:
      "Zara’s Satin Slip Dress skims the body with a liquid-satin drape inspired by ’90s minimalism. A gentle cowl neckline, adjustable straps and bias-cut silhouette create effortless elegance. Pair with strappy heels for evening or layer over a tee for daytime chic. Fully lined and machine-washable for easy care.",
    reviews: [
      {
        user: "Lisa P.",
        rating: 5,
        comment: "Gorgeous! Wore it to a wedding and got so many compliments.",
      },
      {
        user: "Ava G.",
        rating: 4,
        comment: "Colour true to photo, fabric feels luxe.",
      },
    ],
  },
  {
    name: "Floral Midi Dress",
    brand: "H&M",
    price: 47.99,
    image: "/images/maxi.jpg",
    countInStock: 20,
    colors: ["#ffffff", "#f5c6ce"],
    onSale: false,
    salePercent: 0,
    category: "Dress",
    description:
      "Cut from breathable viscose crepe, H&M’s Floral Midi Dress showcases pastel blooms on a vintage-inspired sweetheart bodice. Flutter sleeves, smocked back and a swishy A-line skirt make it perfect for garden parties. Soft, eco-conscious printing methods minimise water usage.",
    reviews: [
      {
        user: "Priya S.",
        rating: 4,
        comment: "Lightweight fabric—perfect for brunch. Runs a bit large.",
      },
      {
        user: "Jenny L.",
        rating: 5,
        comment: "Lovely pattern and great value for money!",
      },
    ],
  },
  {
    name: "Nikita Dress",
    brand: "Reformation",
    price: 248,
    image: "/images/nikitadress.jpg",
    countInStock: 8,
    colors: ["#f8e1e7", "#000000"],
    onSale: true,
    salePercent: 15,
    category: "Dress",
    description:
      "Made with Lenzing™ Ecovero™, Reformation’s Nikita Dress balances sustainability and romance. A sweetheart bodice with tie straps meets a gently flared skirt, while hidden pockets and an invisible zip deliver function and polish. Digitally printed florals reduce chemical impact.",
    reviews: [
      {
        user: "Mia R.",
        rating: 5,
        comment: "Fits like a glove and love the eco-friendly message.",
      },
      {
        user: "Clara H.",
        rating: 4,
        comment: "Beautiful but pricey—glad I caught the sale!",
      },
    ],
  },
  {
    name: "Wrap Maxi Dress",
    brand: "ASOS DESIGN",
    price: 82,
    image: "/images/asos.jpg",
    countInStock: 15,
    colors: ["#bae1ff", "#8b0000"],
    onSale: false,
    salePercent: 0,
    category: "Dress",
    description:
      "ASOS DESIGN’s Wrap Maxi delivers vacation ease with a soft crepe fabric, a deep V-neck and adjustable waist tie for a perfect fit. A subtle high-low hem and side slit add feminine movement, making this dress suitcase-ready for beach dinners or city strolls.",
    reviews: [
      {
        user: "Harper T.",
        rating: 4,
        comment: "Stunning colour! Slightly long for my height.",
      },
      {
        user: "Zoe N.",
        rating: 5,
        comment: "So flattering—ideal for destination weddings.",
      },
    ],
  },
  {
    name: "Linen Shirt Dress",
    brand: "Mango",
    price: 99.99,
    image: "/images/mango.jpg",
    countInStock: 10,
    colors: ["#ffffff", "#f3f3f3"],
    onSale: false,
    salePercent: 0,
    category: "Dress",
    description:
      "Tailored from 100 % European-flax linen, Mango’s Shirt Dress features a crisp collar, tortoiseshell buttons and a detachable belt to define the waist. Breathable, antibacterial and naturally luxurious, it transitions from workdays to weekend markets with effortless style.",
    reviews: [
      {
        user: "Emily D.",
        rating: 5,
        comment: "Quality linen—keeps me cool in humid weather.",
      },
      {
        user: "Sandra K.",
        rating: 4,
        comment: "Love it but needs ironing after wash.",
      },
    ],
  },
  {
    name: "Somerset Maxi Dress",
    brand: "Anthropologie",
    price: 168,
    image: "/images/somersetmaxi.jpg",
    countInStock: 5,
    colors: ["#ffdee3", "#dbe7a3"],
    onSale: true,
    salePercent: 10,
    category: "Dress",
    description:
      "Anthropologie’s viral Somerset Maxi flaunts a smocked waistband, tiered skirt and hidden pockets—earning it ‘one-and-done’ status. Crafted from airy cotton-silk voile, this romantic silhouette twirls beautifully at festivals, garden parties or relaxed date nights.",
    reviews: [
      {
        user: "Tara V.",
        rating: 5,
        comment: "Twirl factor is unreal—my go-to summer dress!",
      },
      {
        user: "Hannah J.",
        rating: 4,
        comment: "Runs long but perfect with heels.",
      },
    ],
  },
  {
    name: "Japanese GoWeave Mini Dress",
    brand: "Everlane",
    price: 98,
    image: "/images/Everlane.jpg",
    countInStock: 14,
    colors: ["#000000", "#f5deb3"],
    onSale: false,
    salePercent: 0,
    category: "Dress",
    description:
      "Everlane’s GoWeave Mini utilises a wrinkle-resistant Japanese tri-acetate fabric with a subtle matte finish. A crew neckline, tailored darts and hidden pockets make this a desk-to-dinner hero. Simply change shoes to transform the look.",
    reviews: [
      {
        user: "Natalie M.",
        rating: 5,
        comment: "No creases after sitting all day—amazing!",
      },
      {
        user: "Iris B.",
        rating: 4,
        comment: "Simple and chic. Slightly boxy but I like it.",
      },
    ],
  },
  {
    name: "Adella Slip Dress",
    brand: "Free People",
    price: 128,
    image: "/images/freepeople.jpeg",
    countInStock: 9,
    colors: ["#e4c1f9", "#000000"],
    onSale: true,
    salePercent: 5,
    category: "Dress",
    description:
      "Free People’s Adella Slip pairs its iconic crochet lace bodice with a floaty rayon skirt. Adjustable criss-cross straps and double-layer lining ensure coverage and comfort. From festivals to date nights, it layers effortlessly under denim jackets or chunky knits.",
    reviews: [
      {
        user: "Grace L.",
        rating: 5,
        comment: "So boho and feminine. Perfect length for me!",
      },
      {
        user: "Poppy W.",
        rating: 4,
        comment: "Straps loosen easily—tie a knot and it's fine.",
      },
    ],
  },
  {
    name: "Seersucker Check Dress",
    brand: "Ganni",
    price: 235,
    image: "/images/ganni.jpg",
    countInStock: 6,
    colors: ["#ffffff", "#ffb6c1"],
    onSale: false,
    salePercent: 0,
    category: "Dress",
    description:
      "Ganni’s signature puff-sleeve silhouette meets breezy seersucker checks. The puckered cotton blend never needs ironing, while a square neckline and gathered bodice create modern prairie appeal. Ethically produced in a responsible factory.",
    reviews: [
      {
        user: "Olivia F.",
        rating: 4,
        comment: "Statement sleeves are amazing. Fits slightly large.",
      },
      {
        user: "Bea Z.",
        rating: 5,
        comment: "Comfortable yet dramatic—worth the splurge.",
      },
    ],
  },
  {
    name: "Pleated Georgette Dress",
    brand: "Michael Kors",
    price: 225,
    image: "/images/mkdress.jpeg",
    countInStock: 7,
    colors: ["#000080", "#f8f8ff"],
    onSale: true,
    salePercent: 25,
    category: "Dress",
    description:
      "Sunburst pleats and a self-tie belt lend Michael Kors’ Georgette Dress graceful movement and waist definition. A concealed back zip and fully lined bodice keep the look polished, whether in the boardroom or at evening cocktails.",
    reviews: [
      {
        user: "Sophia K.",
        rating: 5,
        comment: "Pleats stay crisp even after washing!",
      },
      {
        user: "Dana A.",
        rating: 4,
        comment: "Very flattering—belt elevates the look.",
      },
    ],
  },

  /* ───────── Accessories ───────── */
  {
    name: "Dionysus Super Mini Bag",
    brand: "Gucci",
    price: 1100,
    image: "/images/gucci.jpeg",
    countInStock: 4,
    colors: ["#c2b280", "#000000"],
    onSale: false,
    salePercent: 0,
    category: "Accessory",
    description:
      "Gucci’s Dionysus Super Mini distils maximalist heritage into a palm-sized statement. Crafted in GG Supreme canvas with suede trim, it showcases a tiger-head closure referencing Dionysus. Detachable chain strap offers shoulder or belt styling—fits phone, card case, lipstick.",
    reviews: [
      {
        user: "Lydia S.",
        rating: 5,
        comment: "Small but mighty—adds luxury to every outfit.",
      },
      {
        user: "Kate W.",
        rating: 4,
        comment: "Wish it had an inner pocket but still love it.",
      },
    ],
  },
  {
    name: "Re-Nylon Bucket Hat",
    brand: "Prada",
    price: 725,
    image: "/images/prada.jpg",
    countInStock: 9,
    colors: ["#000000", "#f5f5f5"],
    onSale: false,
    salePercent: 0,
    category: "Accessory",
    description:
      "Prada’s iconic bucket hat, now in sustainable Re-Nylon regenerated from ocean plastics. Top-stitched brim, enamelled triangle logo and lightweight packable construction make it a street-style staple with a conscience.",
    reviews: [
      {
        user: "Noah J.",
        rating: 5,
        comment: "Iconic and sustainable—win-win.",
      },
      {
        user: "Lara P.",
        rating: 4,
        comment: "Pricey but craftsmanship is flawless.",
      },
    ],
  },
  {
    name: "Miller Sandals",
    brand: "Tory Burch",
    price: 198,
    image: "/images/Tory.jpg",
    countInStock: 18,
    colors: ["#9c7b4b", "#000000"],
    onSale: false,
    salePercent: 0,
    category: "Accessory",
    description:
      "Beloved for its cushioned foam footbed and polished double-T medallion, Tory Burch’s Miller Sandal pairs hand-stitched leather with a grippy rubber outsole. Slip them on to elevate denim cut-offs or sundresses all summer long.",
    reviews: [
      {
        user: "Emma V.",
        rating: 5,
        comment: "So comfortable—I own three colours.",
      },
      { user: "Sarah G.", rating: 4, comment: "Runs small, size up half." },
    ],
  },
  {
    name: "Tabby Shoulder Bag 26",
    brand: "Coach",
    price: 395,
    image: "/images/coach.jpeg",
    countInStock: 6,
    colors: ["#ffefd5", "#000000"],
    onSale: true,
    salePercent: 30,
    category: "Accessory",
    description:
      "Coach reimagines a 1970s archival design in polished pebble leather. The Tabby 26 offers interchangeable short and cross-body straps, a well-organised interior and the signature C hardware—blending vintage charm with modern utility.",
    reviews: [
      {
        user: "Ruth E.",
        rating: 5,
        comment: "Versatile and roomy for a small bag—love the sale price!",
      },
      {
        user: "Jade Q.",
        rating: 4,
        comment: "Hardware feels sturdy; leather is buttery soft.",
      },
    ],
  },
  {
    name: "Spade Flower Scarf",
    brand: "Kate Spade",
    price: 58,
    image: "/images/katespade.jpg",
    countInStock: 23,
    colors: ["#ff69b4", "#ffffff"],
    onSale: false,
    salePercent: 0,
    category: "Accessory",
    description:
      "Woven from feather-light modal-silk, the Spade Flower Scarf showcases an oversized signature motif. At 200 × 70 cm it doubles as a wrap on chilly flights yet knots effortlessly around a tote handle for a pop of colour.",
    reviews: [
      {
        user: "Bella D.",
        rating: 5,
        comment: "Super soft and vibrant—it brightens any outfit.",
      },
      {
        user: "Natalia F.",
        rating: 4,
        comment: "Wish it were slightly wider, but still beautiful.",
      },
    ],
  },
];

await Product.deleteMany();
await Product.insertMany(items);
console.log("Products seeded ✔");
process.exit();
