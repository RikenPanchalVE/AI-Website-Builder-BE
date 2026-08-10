import { v4 as uuidv4 } from "uuid";
import AIProvider from "./AIProvider";
import { ISection, IPage } from "../../types";
import { BUSINESS_TYPES, BusinessTypeConfig } from "./businessTypes";

interface Answers {
  businessName?: string;
  businessDescription?: string;
  industry?: string;
  targetAudience?: string;
  targetCountries?: string[];
  currency?: string;
  pages?: string[];
  categories?: string[];
  selectedPages?: string[];
  productCount?: number;
  hasCategories?: boolean;
  hasVariants?: boolean;
  variantTypes?: string[];
  hasReviews?: boolean;
  features?: string[];
  paymentMethods?: string[];
  shippingType?: string;
  shippingOptions?: string[];
  logo?: string;
  brandGuidelines?: string;
  productImages?: string[];
  bannerImages?: string[];
  videos?: string[];
  themeStyle?: string;
  primaryColor?: string;
  secondaryColor?: string;
  fontStyle?: string;
  buttonStyle?: string;
  borderRadius?: string;
  animationLevel?: string;
  homepageSections?: string[];
  seoKeywords?: string[];
  seoLocation?: string;
  metaTitle?: string;
  metaDescription?: string;
  socialMedia?: Record<string, string>;
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹",
  JPY: "¥",
  CAD: "C$",
  AUD: "A$",
  SGD: "S$",
  AED: "د.إ",
  SAR: "﷼",
};

const TESTIMONIALS: Record<string, Array<{ name: string; role: string; content: string; rating: number }>> = {
  Restaurant: [
    { name: "Sarah Mitchell", role: "Regular Diner", content: "The best dining experience in town! Every dish is crafted with passion and the ambiance is perfect for date nights.", rating: 5 },
    { name: "James Rodriguez", role: "Food Blogger", content: "I've reviewed hundreds of restaurants and this place stands out. The truffle bruschetta alone is worth the visit.", rating: 5 },
    { name: "Emily Chen", role: "Private Event Host", content: "We hosted our anniversary dinner here and everything was flawless. The chef personally checked on our table.", rating: 5 },
    { name: "Michael Thompson", role: "Local Resident", content: "Our go-to family restaurant. The kids love the pasta and we love the wine selection. Consistently excellent.", rating: 4 },
  ],
  Healthcare: [
    { name: "Robert Williams", role: "Patient", content: "Dr. Smith and the entire team are incredibly professional. I feel genuinely cared for at every visit.", rating: 5 },
    { name: "Lisa Anderson", role: "Patient", content: "The telehealth service is so convenient. Same quality of care from the comfort of my home.", rating: 5 },
    { name: "David Kim", role: "Patient", content: "The online booking system made scheduling my appointment effortless. No more waiting on hold.", rating: 4 },
    { name: "Priya Sharma", role: "Patient", content: "Clean facilities, friendly staff, and thorough examinations. I recommend this practice to everyone.", rating: 5 },
  ],
  Education: [
    { name: "Alex Johnson", role: "Student", content: "The bootcamp completely transformed my career. I landed a developer job within 2 months of graduating.", rating: 5 },
    { name: "Maria Garcia", role: "Working Professional", content: "The self-paced courses fit perfectly into my busy schedule. Quality content at an affordable price.", rating: 5 },
    { name: "David Chen", role: "Student", content: "The instructors are industry experts who make complex topics easy to understand. Highly recommended.", rating: 5 },
    { name: "Sophie Williams", role: "Parent", content: "My son loved the coding camp! The instructors were patient and engaging. He's already asking to go back.", rating: 4 },
  ],
  default: [
    { name: "Sarah Mitchell", role: "Loyal Customer", content: "Absolutely love the quality! The products exceeded my expectations and the shipping was incredibly fast.", rating: 5 },
    { name: "James Rodriguez", role: "First-Time Buyer", content: "Great shopping experience from start to finish. The website is easy to navigate and checkout was seamless.", rating: 5 },
    { name: "Emily Chen", role: "Repeat Customer", content: "I keep coming back for more. The customer service team is responsive and helpful every time.", rating: 5 },
    { name: "Michael Thompson", role: "Verified Buyer", content: "Excellent value for money. The craftsmanship is outstanding and you can tell these are premium products.", rating: 4 },
  ],
};

const BLOG_POSTS: Record<string, Array<{ title: string; excerpt: string; date: string; readTime: string; category: string }>> = {
  Restaurant: [
    { title: "Meet Our Chef: A Culinary Journey", excerpt: "Learn about our head chef's passion for food and the inspiration behind our seasonal menu.", date: "2026-01-15", readTime: "5 min read", category: "Behind the Scenes" },
    { title: "5 Wine Pairing Tips for Your Next Dinner", excerpt: "Our sommelier shares expert tips on selecting the perfect wine to complement your meal.", date: "2026-01-10", readTime: "4 min read", category: "Food & Wine" },
    { title: "Farm-to-Table: Our Local Partners", excerpt: "Discover the local farms and suppliers that help us bring the freshest ingredients to your plate.", date: "2026-01-05", readTime: "6 min read", category: "Sustainability" },
  ],
  Healthcare: [
    { title: "Understanding Your Annual Health Checkup", excerpt: "A comprehensive guide to what's included in a health checkup and why it matters.", date: "2026-01-15", readTime: "7 min read", category: "Health Tips" },
    { title: "Telehealth: When to Use Virtual Visits", excerpt: "Learn when a telehealth appointment is appropriate and how to prepare for one.", date: "2026-01-10", readTime: "5 min read", category: "Patient Resources" },
    { title: "5 Ways to Boost Your Immune System", excerpt: "Simple, science-backed strategies to strengthen your immune system naturally.", date: "2026-01-05", readTime: "4 min read", category: "Wellness" },
  ],
  default: [
    { title: "Top 10 Trends to Watch This Season", excerpt: "Discover the hottest trends that are dominating the market this season.", date: "2026-01-15", readTime: "5 min read", category: "Trends" },
    { title: "How to Choose the Right Product", excerpt: "Our comprehensive guide to help you make informed purchasing decisions.", date: "2026-01-10", readTime: "7 min read", category: "Buying Guide" },
    { title: "The Story Behind Our Collection", excerpt: "Go behind the scenes and learn about the inspiration behind our latest collection.", date: "2026-01-05", readTime: "4 min read", category: "Behind the Scenes" },
  ],
};

class MockAIProvider extends AIProvider {
  async generateWebsiteSpec(
    questionnaire: Record<string, unknown>,
    assets: Record<string, unknown>[]
  ): Promise<Record<string, unknown>> {
    const rawAnswers = (questionnaire.answers as Record<string, any>) || {};
    const answers: Answers = rawAnswers;

    const businessName = answers.businessName || "My Store";
    const businessDescription = answers.businessDescription || "Premium products for the modern consumer.";
    const industry = (answers.industry as string) || "Other";
    const currency = (answers.currency as string) || "USD";
    const symbol = CURRENCY_SYMBOLS[currency] || "$";
    const selectedPagesRaw = (answers.pages as string[]) || ["Home"];
    // Convert display names to slugs: "About Us" -> "about_us", "Home" -> "home"
    const slugify = (name: string): string => name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/_+$/, "").replace(/^_+/, "");
    const selectedPages = selectedPagesRaw.map((p) => slugify(p));
    // Always ensure "home" is included
    if (!selectedPages.includes("home")) selectedPages.unshift("home");
    const homepageSections = (answers.homepageSections as string[]) || [];
    const features = (answers.features as string[]) || [];
    const paymentMethods = (answers.paymentMethods as string[]) || [];
    const shippingOptions = (answers.shippingOptions as string[]) || [];
    const hasCategories = answers.hasCategories !== false;
    const hasReviews = answers.hasReviews !== false;
    const socialMedia = (answers.socialMedia as Record<string, string>) || {};

    const config = BUSINESS_TYPES[industry] || BUSINESS_TYPES["Other"];
    const selectedCategories = (answers.categories as string[]) || [];
    const allProducts = config.defaultProducts.map((p) => ({
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice,
      description: p.description,
      category: p.category,
      rating: p.rating,
      reviewCount: p.reviewCount,
      badge: p.badge,
    }));
    // Filter products to only include selected categories
    const products = selectedCategories.length > 0
      ? allProducts.filter((p) => selectedCategories.includes(p.category))
      : allProducts;

    const logoAsset = assets.find((a) => a.type === "logo");
    const imageAssets = assets.filter((a) => a.type === "image");
    const logoPath = logoAsset
      ? `/uploads/${logoAsset.project}/${logoAsset.filename}`
      : null;
    const imagePaths = imageAssets.map(
      (a) => `/uploads/${a.project}/${a.filename}`
    );

    const resolvedPrimaryColor = answers.primaryColor || config.colorSchemes[0].primary;
    const resolvedSecondaryColor = answers.secondaryColor || config.colorSchemes[0].secondary;
    const resolvedThemeStyle = answers.themeStyle || config.designStyle.themeStyle;
    const resolvedFontStyle = answers.fontStyle || config.designStyle.fontStyle;
    const resolvedButtonStyle = answers.buttonStyle || config.designStyle.buttonStyle;
    const resolvedBorderRadius = answers.borderRadius || config.designStyle.borderRadius;

    const theme = this._buildTheme({
      ...answers,
      primaryColor: resolvedPrimaryColor,
      secondaryColor: resolvedSecondaryColor,
      themeStyle: resolvedThemeStyle,
      fontStyle: resolvedFontStyle,
      buttonStyle: resolvedButtonStyle,
      borderRadius: resolvedBorderRadius,
    });

    const resolvedHomepageSections = homepageSections.length > 0
      ? homepageSections.map((s) => this._normalizeHomepageSection(s))
      : this._getDefaultHomepageSections(industry);

    const resolvedPaymentMethods = paymentMethods.length > 0
      ? paymentMethods
      : this._getDefaultPaymentMethods(industry);
    const resolvedShippingOptions = shippingOptions.length > 0
      ? shippingOptions
      : this._getDefaultShippingOptions(industry);

    const ctx = {
      businessName,
      businessDescription,
      industry,
      config,
      symbol,
      products,
      logoPath,
      imagePaths,
      theme,
      homepageSections: resolvedHomepageSections,
      features,
      paymentMethods: resolvedPaymentMethods,
      shippingOptions: resolvedShippingOptions,
      hasCategories,
      hasReviews,
      socialMedia,
      selectedPages,
    };

    const generatedPages: IPage[] = selectedPages.map((slug) =>
      this._buildPage(slug, ctx)
    );

    const navItems = this._buildNavigation(selectedPages, hasCategories, config);
    const footerLinks = this._buildFooterLinks(selectedPages);

    return {
      name: businessName,
      description: businessDescription,
      theme,
      pages: generatedPages,
      navigation: { items: navItems },
      footer: {
        copyright: `© ${new Date().getFullYear()} ${businessName}. All rights reserved.`,
        links: footerLinks,
        socialMedia,
      },
      seo: {
        metaTitle: answers.metaTitle || `${businessName} - ${businessDescription}`,
        metaDescription: answers.metaDescription || businessDescription,
        keywords: answers.seoKeywords || [],
      },
    };
  }

  async processRevision(
    websiteSpec: Record<string, unknown>,
    revisionRequest: string
  ): Promise<Record<string, unknown>> {
    const updatedSpec = {
      ...websiteSpec,
      version: ((websiteSpec.version as number) || 1) + 1,
      description: `${websiteSpec.description || "A polished website"}. Revision request: ${revisionRequest}`,
      pages: (websiteSpec.pages as Array<Record<string, unknown>> | undefined)?.map((page) => {
        if (page.slug === "home") {
          return {
            ...page,
            sections: [
              {
                id: uuidv4(),
                component: "AboutStory",
                order: 1,
                props: {
                  title: "Updated to match your request",
                  content: `We adjusted the experience based on: ${revisionRequest}`,
                  image: null,
                  stats: [
                    { value: "1", label: "Revision Applied" },
                    { value: "100%", label: "Aligned" },
                  ],
                },
              },
              ...(page.sections as Array<Record<string, unknown>> | undefined || []),
            ],
          };
        }
        return page;
      }) || [],
    };

    return updatedSpec;
  }

  async generateContent(prompt: string): Promise<string> {
    return "Mock-generated content. Replace with real AI provider.";
  }

  // Map friendly display names (from the questionnaire) to internal section keys.
  private _normalizeHomepageSection(name: string): string {
    const map: Record<string, string> = {
      "hero": "hero_banner",
      "hero_banner": "hero_banner",
      "new releases": "new_releases",
      "new arrivals": "new_arrivals",
      "bestsellers": "bestsellers",
      "best sellers": "best_sellers",
      "book of the month": "book_of_month",
      "staff picks": "staff_picks",
      "categories": "featured_categories",
      "featured categories": "featured_categories",
      "featured products": "featured_products",
      "featured collections": "featured_collections",
      "shop by category": "featured_categories",
      "shop by concern": "shop_by_concern",
      "shop by sport": "shop_by_sport",
      "shop by pet": "shop_by_pet",
      "author spotlights": "testimonials",
      "testimonials": "testimonials",
      "reviews": "testimonials",
      "customer reviews": "testimonials",
      "tech reviews": "tech_reviews",
      "today's deals": "deals_of_the_day",
      "deals of the day": "deals_of_the_day",
      "deals": "deals",
      "daily deals": "daily_deals",
      "flash sale": "flash_sale",
      "special offers": "special_offers",
      "menu highlights": "menu_highlights",
      "daily specials": "daily_specials",
      "chef's table": "chef_table",
      "reservations": "reservation_cta",
      "book appointment": "book_appointment",
      "book now": "book_now",
      "services": "services",
      "our doctors": "our_doctors",
      "health resources": "health_resources",
      "popular courses": "popular_courses",
      "learning paths": "learning_paths",
      "student success": "student_success",
      "student success stories": "student_success",
      "instructors": "instructors",
      "featured properties": "featured_properties",
      "property search": "property_search",
      "neighborhoods": "neighborhoods",
      "agents": "agents",
      "popular destinations": "popular_destinations",
      "featured packages": "featured_packages",
      "travel guides": "travel_guides",
      "pet care tips": "pet_care_tips",
      "pet grooming": "pet_grooming_booking",
      "featured vehicles": "featured_vehicles",
      "inventory search": "inventory_search",
      "service center": "service_center",
      "before & after": "before_after",
      "before and after": "before_after",
      "home services list": "home_services_list",
      "newsletter": "newsletter_signup",
      "newsletter signup": "newsletter_signup",
      "instagram feed": "instagram_feed",
      "contact": "contact_form",
      "contact us": "contact_form",
      "faq": "faq",
      "store locator": "store_locator",
      "top brands": "brand_showcase",
      "brand showcase": "brand_showcase",
      "brands": "brand_showcase",
      "why choose us": "why_choose_us",
      "delivery info": "delivery_info",
      "room ideas": "room_ideas",
      "design inspiration": "design_inspo",
      "beauty tips": "beauty_tips",
      "training tips": "training_tips",
      "gift guide": "gift_guide",
      "trending now": "featured_products",
      "featured": "featured_products",
      "fresh arrivals": "fresh_arrivals",
      "recipe ideas": "blog_preview",
      "blog preview": "blog_preview",
      "contact preview": "contact_preview",
      "faq preview": "faq_preview",
      "new launches": "new_arrivals",
      "tech blog": "blog_preview",
      "popular products": "featured_products",
      "sale": "flash_sale",
      "customer gallery": "instagram_feed",
      "athlete stories": "testimonials",
      "custom design": "featured_products",
      "certifications": "featured_categories",
      "about us": "about_story",
      "gallery": "instagram_feed",
      "patient portal": "featured_products",
      "resources": "featured_products",
      "pricing": "featured_products",
      "search": "property_search",
      "market insights": "testimonials",
      "rewards program": "newsletter_signup",
      "build & price": "featured_products",
      "build and price": "featured_products",
      "financing": "flash_sale",
      "service areas": "store_locator",
    };
    return map[(name || "").trim().toLowerCase()] || name;
  }

  private _getDefaultHomepageSections(industry: string): string[] {
    const sectionMap: Record<string, string[]> = {
      Restaurant: ["hero_banner", "menu_highlights", "daily_specials", "chef_table", "testimonials"],
      Electronics: ["hero_banner", "featured_products", "deals_of_the_day", "brand_showcase", "tech_reviews"],
      Grocery: ["hero_banner", "daily_deals", "featured_categories", "fresh_arrivals", "delivery_info"],
      Furniture: ["hero_banner", "featured_collections", "room_ideas", "new_arrivals", "design_inspo"],
      Beauty: ["hero_banner", "best_sellers", "new_arrivals", "shop_by_concern", "beauty_tips"],
      Sports: ["hero_banner", "featured_products", "shop_by_sport", "new_arrivals", "training_tips"],
      Jewelry: ["hero_banner", "featured_collections", "new_arrivals", "best_sellers", "gift_guide"],
      Books: ["hero_banner", "new_releases", "bestsellers", "book_of_month", "staff_picks"],
      Healthcare: ["hero_banner", "services", "book_appointment", "our_doctors", "health_resources"],
      Education: ["hero_banner", "popular_courses", "learning_paths", "student_success", "instructors"],
      "Real Estate": ["hero_banner", "featured_properties", "property_search", "neighborhoods", "agents"],
      Travel: ["hero_banner", "popular_destinations", "deals", "featured_packages", "travel_guides"],
      "Pet Store": ["hero_banner", "shop_by_pet", "best_sellers", "new_arrivals", "pet_care_tips", "pet_grooming_booking"],
      Automotive: ["hero_banner", "featured_vehicles", "special_offers", "inventory_search", "service_center"],
      "Home Services": ["hero_banner", "home_services_list", "book_now", "before_after", "testimonials"],
    };
    return sectionMap[industry] || ["hero_banner", "featured_categories", "featured_products", "testimonials"];
  }

  private _getDefaultPaymentMethods(industry: string): string[] {
    const map: Record<string, string[]> = {
      Restaurant: ["credit_debit", "cash", "digital_wallets"],
      Healthcare: ["credit_debit", "insurance", "hsa_fsa", "payment_plans"],
      Education: ["credit_debit", "paypal", "installments"],
      "Real Estate": ["credit_debit", "bank_transfer", "escrow"],
      Travel: ["credit_debit", "paypal", "bank_transfer"],
    };
    return map[industry] || ["credit_debit", "paypal", "stripe"];
  }

  private _getDefaultShippingOptions(industry: string): string[] {
    const map: Record<string, string[]> = {
      Restaurant: ["pickup", "delivery"],
      Healthcare: ["digital", "in_person"],
      Education: ["digital_access"],
      "Real Estate": ["digital_documents", "in_person_viewing"],
      Travel: ["e_ticket", "mobile_pass"],
    };
    return map[industry] || ["standard", "express", "free"];
  }

  private _buildTheme(answers: Answers): Record<string, unknown> {
    const style = (answers.themeStyle as string) || "modern";
    const primaryColor = answers.primaryColor || "#2563EB";
    const secondaryColor = answers.secondaryColor || "#1E40AF";
    const buttonStyle = answers.buttonStyle || "rounded";
    const borderRadius = answers.borderRadius || "medium";
    const animations = answers.animationLevel === "none" ? false : (answers.animationLevel || "moderate");

    const fontMap: Record<string, string> = {
      elegant: "Playfair Display", professional: "Roboto", clean: "Inter",
      friendly: "Nunito", sophisticated: "Cormorant Garamond", luxe: "Lora",
      dynamic: "Montserrat", classic: "Merriweather", inviting: "Open Sans",
      inspiring: "Nunito Sans", playful: "Quicksand", bold: "Barlow",
      reliable: "Open Sans", versatile: "Lato", modern: "Inter",
      luxury: "Playfair Display", minimal: "Inter", premium: "Roboto",
      dark: "Inter", colorful: "Poppins",
    };

    const borderRadiusMap: Record<string, string> = {
      none: "0px", small: "4px", medium: "8px", large: "16px",
    };

    const buttonStyleMap: Record<string, string> = {
      rounded: "rounded", square: "square", pill: "pill",
      sharp: "square", soft: "rounded", minimal: "square",
      warm: "rounded", trustworthy: "rounded", athletic: "square",
      adventurous: "pill", fun: "pill", powerful: "square",
      "action-oriented": "rounded", elegant: "rounded", bold: "square",
    };

    const hexToRgb = (hex: string) => {
      const n = hex.replace("#", "");
      const full = n.length === 3 ? n.split("").map(c => c + c).join("") : n;
      const v = Number.parseInt(full, 16);
      return { r: (v >> 16) & 255, g: (v >> 8) & 255, b: v & 255 };
    };

    const luminance = (hex: string) => {
      const { r, g, b } = hexToRgb(hex);
      return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    };

    const adjustColor = (hex: string, factor: number): string => {
      const { r, g, b } = hexToRgb(hex);
      const nr = Math.min(255, Math.max(0, Math.round(r * factor)));
      const ng = Math.min(255, Math.max(0, Math.round(g * factor)));
      const nb = Math.min(255, Math.max(0, Math.round(b * factor)));
      return `#${((1 << 24) + (nr << 16) + (ng << 8) + nb).toString(16).slice(1)}`;
    };

    const mixWithWhite = (hex: string, amount: number): string => {
      const { r, g, b } = hexToRgb(hex);
      const nr = Math.round(r + (255 - r) * amount);
      const ng = Math.round(g + (255 - g) * amount);
      const nb = Math.round(b + (255 - b) * amount);
      return `#${((1 << 24) + (nr << 16) + (ng << 8) + nb).toString(16).slice(1)}`;
    };

    const mixWithBlack = (hex: string, amount: number): string => {
      const { r, g, b } = hexToRgb(hex);
      const nr = Math.round(r * (1 - amount));
      const ng = Math.round(g * (1 - amount));
      const nb = Math.round(b * (1 - amount));
      return `#${((1 << 24) + (nr << 16) + (ng << 8) + nb).toString(16).slice(1)}`;
    };

    const isDark = style === "dark";

    // Generate a complete, colorful palette derived from the selected colors.
    // The main background is clearly tinted with the brand color (NOT near-white)
    // so the chosen theme is unmistakably visible across the whole site.
    const backgroundColor = isDark
      ? mixWithBlack(primaryColor, 0.82)
      : mixWithWhite(primaryColor, 0.78);
    const foregroundColor = isDark
      ? "#f1f5f9"
      : luminance(backgroundColor) > 0.7 ? "#16181d" : "#f8fafc";
    const mutedColor = isDark
      ? mixWithBlack(primaryColor, 0.68)
      : mixWithWhite(primaryColor, 0.68);
    const mutedForegroundColor = isDark ? "#a0aec0" : "#4b5563";
    const borderColor = isDark
      ? mixWithBlack(primaryColor, 0.55)
      : mixWithWhite(primaryColor, 0.58);
    const cardColor = isDark
      ? mixWithBlack(primaryColor, 0.72)
      : mixWithWhite(primaryColor, 0.88);

    // Advanced-theme tokens used by the renderer for gradients, tints and accents.
    const accentColor = secondaryColor;
    const primarySoft = mixWithWhite(primaryColor, 0.82);
    const secondarySoft = mixWithWhite(secondaryColor, 0.82);
    const surfaceStrong = mixWithWhite(primaryColor, 0.72);
    const gradientFrom = isDark ? primaryColor : mixWithBlack(primaryColor, 0.12);
    const gradientTo = secondaryColor;
    const ringGlow = mixWithWhite(primaryColor, 0.55);

    return {
      style,
      primaryColor,
      secondaryColor,
      backgroundColor,
      foregroundColor,
      mutedColor,
      mutedForegroundColor,
      borderColor,
      cardColor,
      // additional advanced tokens
      accentColor,
      primarySoft,
      secondarySoft,
      surfaceStrong,
      gradientFrom,
      gradientTo,
      ringGlow,
      fontFamily: answers.fontStyle || fontMap[style.toLowerCase()] || "Inter",
      borderRadius: borderRadiusMap[borderRadius] || borderRadius || "8px",
      buttonStyle: buttonStyleMap[buttonStyle.toLowerCase()] || buttonStyle || "rounded",
      animations,
    };
  }

  private _buildPage(
    slug: string,
    ctx: {
      businessName: string;
      businessDescription: string;
      industry: string;
      config: BusinessTypeConfig;
      symbol: string;
      products: Array<{ name: string; price: number; originalPrice?: number; description: string; category: string; rating: number; reviewCount: number; badge?: string }>;
      logoPath: string | null;
      imagePaths: string[];
      theme: Record<string, unknown>;
      homepageSections: string[];
      features: string[];
      paymentMethods: string[];
      shippingOptions: string[];
      hasCategories: boolean;
      hasReviews: boolean;
      socialMedia: Record<string, string>;
      selectedPages: string[];
    }
  ): IPage {
    const builders: Record<string, () => ISection[]> = {
      home: () => this._buildHomePageSections(ctx),
      shop: () => this._buildShopPageSections(ctx),
      product_details: () => this._buildProductDetailsSections(ctx),
      categories: () => this._buildCategoriesSections(ctx),
      about: () => this._buildAboutSections(ctx),
      about_us: () => this._buildAboutSections(ctx),
      contact: () => this._buildContactSections(ctx),
      contact_us: () => this._buildContactSections(ctx),
      blog: () => this._buildBlogSections(ctx),
      faq: () => this._buildFaqSections(ctx),
      track_order: () => this._buildTrackOrderSections(ctx),
      wishlist: () => this._buildWishlistSections(ctx),
      cart: () => this._buildCartSections(ctx),
      checkout: () => this._buildCheckoutSections(ctx),
      privacy_policy: () => this._buildLegalSections(ctx, "Privacy Policy"),
      terms_conditions: () => this._buildLegalSections(ctx, "Terms & Conditions"),
      refund_policy: () => this._buildLegalSections(ctx, "Refund Policy"),
      menu: () => this._buildMenuSections(ctx),
      reservations: () => this._buildReservationsSections(ctx),
      services: () => this._buildServicesSections(ctx),
      book_appointment: () => this._buildBookAppointmentSections(ctx),
      properties: () => this._buildPropertiesSections(ctx),
      listings: () => this._buildListingsSections(ctx),
      courses: () => this._buildCoursesSections(ctx),
      admissions: () => this._buildAdmissionsSections(ctx),
      destinations: () => this._buildDestinationsSections(ctx),
      itineraries: () => this._buildItinerariesSections(ctx),
    };

    const builder = builders[slug] || builders.home;
    const sections = builder();

    const titleMap: Record<string, string> = {
      home: ctx.businessName,
      shop: ctx.industry === "Restaurant" ? "Menu" : "Shop",
      product_details: "Details",
      categories: "Categories",
      about: this._getAboutTitle(ctx.industry),
      about_us: this._getAboutTitle(ctx.industry),
      contact: "Contact Us",
      contact_us: "Contact Us",
      blog: "Blog",
      faq: "FAQ",
      track_order: "Track Order",
      wishlist: "Wishlist",
      cart: "Cart",
      checkout: "Checkout",
      privacy_policy: "Privacy Policy",
      terms_conditions: "Terms & Conditions",
      refund_policy: "Refund Policy",
      menu: "Our Menu",
      reservations: "Reservations",
      services: "Our Services",
      book_appointment: "Book Appointment",
      properties: "Properties",
      listings: "Listings",
      courses: "Courses",
      admissions: "Admissions",
      destinations: "Destinations",
      itineraries: "Itineraries",
    };

    return {
      slug,
      title: titleMap[slug] || slug.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      sections,
    };
  }

  private _getAboutTitle(industry: string): string {
    const titleMap: Record<string, string> = {
      Restaurant: "Our Story",
      Healthcare: "About Our Practice",
      Education: "About Our Institution",
      "Real Estate": "About Our Agency",
      Travel: "About Us",
      "Home Services": "About Us",
    };
    return titleMap[industry] || "About Us";
  }

  private _buildHomePageSections(ctx: {
    businessName: string;
    businessDescription: string;
    industry: string;
    config: BusinessTypeConfig;
    symbol: string;
    products: Array<{ name: string; price: number; originalPrice?: number; description: string; category: string; rating: number; reviewCount: number; badge?: string }>;
    logoPath: string | null;
    imagePaths: string[];
    homepageSections: string[];
    hasCategories: boolean;
    hasReviews: boolean;
    socialMedia: Record<string, string>;
  }): ISection[] {
    const sectionBuilders: Record<string, () => ISection> = {
      hero_banner: () => this._buildHeroSection(ctx),
      featured_categories: () => ({
        id: uuidv4(), component: "FeaturedCategories", order: 2,
        props: {
          title: "Browse by Category", subtitle: "Find exactly what you're looking for",
          categories: ctx.config.categories.map((cat) => ({ ...cat, image: ctx.imagePaths[0] || null, slug: cat.name.toLowerCase().replace(/\s+/g, "-") })),
        },
      }),
      featured_products: () => ({
        id: uuidv4(), component: "FeaturedProducts", order: 3,
        props: {
          title: "Featured Products", subtitle: "Handpicked just for you",
          products: ctx.products.slice(0, 6).map((p) => ({
            id: uuidv4(), name: p.name, price: `${ctx.symbol}${p.price.toFixed(2)}`,
            originalPrice: p.originalPrice ? `${ctx.symbol}${p.originalPrice.toFixed(2)}` : null,
            description: p.description, image: ctx.imagePaths[0] || null,
            rating: p.rating, reviewCount: p.reviewCount, slug: p.name.toLowerCase().replace(/\s+/g, "-"),
            category: p.category, badge: p.badge,
          })),
        },
      }),
      best_sellers: () => ({
        id: uuidv4(), component: "BestSellers", order: 4,
        props: {
          title: "Best Sellers", subtitle: "Our most loved products",
          products: ctx.products.filter((p) => p.badge === "Best Seller" || p.rating >= 4.7).slice(0, 4).map((p) => ({
            id: uuidv4(), name: p.name, price: `${ctx.symbol}${p.price.toFixed(2)}`,
            originalPrice: p.originalPrice ? `${ctx.symbol}${p.originalPrice.toFixed(2)}` : `${ctx.symbol}${(p.price * 1.25).toFixed(2)}`,
            description: p.description, image: ctx.imagePaths[0] || null,
            rating: p.rating, reviewCount: p.reviewCount, badge: "Best Seller",
            slug: p.name.toLowerCase().replace(/\s+/g, "-"), category: p.category,
          })),
          viewAllLink: "/shop",
        },
      }),
      new_arrivals: () => ({
        id: uuidv4(), component: "NewArrivals", order: 5,
        props: {
          title: "New Arrivals", subtitle: "Fresh styles just dropped",
          products: ctx.products.slice(2, 6).map((p) => ({
            id: uuidv4(), name: p.name, price: `${ctx.symbol}${p.price.toFixed(2)}`,
            description: p.description, image: ctx.imagePaths[0] || null,
            badge: "New", slug: p.name.toLowerCase().replace(/\s+/g, "-"),
          })),
        },
      }),
      testimonials: () => ({
        id: uuidv4(), component: "Testimonials", order: 10,
        props: {
          title: "What Our Customers Say", subtitle: "Trusted by thousands of happy customers",
          testimonials: (TESTIMONIALS[ctx.industry] || TESTIMONIALS["default"]).map((t) => ({ ...t, avatar: null })),
        },
      }),
      why_choose_us: () => ({
        id: uuidv4(), component: "WhyChooseUs", order: 11,
        props: {
          title: "Why Choose Us", subtitle: "We're committed to delivering the best experience",
          features: [
            { icon: "truck", title: "Free Shipping", description: "Free shipping on orders over $50" },
            { icon: "shield", title: "Secure Payment", description: "100% secure payment processing" },
            { icon: "refresh", title: "Easy Returns", description: "30-day hassle-free returns" },
            { icon: "headphones", title: "24/7 Support", description: "Round-the-clock customer support" },
          ],
        },
      }),
      menu_highlights: () => ({
        id: uuidv4(), component: "MenuHighlights", order: 2,
        props: {
          title: "Menu Highlights", subtitle: "Chef's signature dishes, crafted with love",
          items: ctx.products.slice(0, 6).map((p) => ({
            name: p.name, price: p.price.toFixed(2),
            description: p.description, image: ctx.imagePaths[0] || null,
            badge: p.category,
          })),
        },
      }),
      daily_specials: () => ({
        id: uuidv4(), component: "DailySpecials", order: 3,
        props: {
          title: "Daily Specials", subtitle: "Today's special dishes - limited availability",
          items: ctx.products.filter((p) => p.originalPrice).slice(0, 3).map((p) => ({
            name: p.name, price: (p.price * 0.8).toFixed(2),
            originalPrice: p.price.toFixed(2),
            description: p.description, image: ctx.imagePaths[0] || null,
          })),
        },
      }),
      chef_table: () => ({
        id: uuidv4(), component: "ChefTable", order: 4,
        props: {
          title: "The Chef's Table",
          description: `Behind every great dish at ${ctx.businessName} is a story of passion, tradition, and innovation. Our executive chef brings decades of culinary experience, blending classic techniques with modern flavors.`,
          image: ctx.imagePaths[1] || ctx.imagePaths[0] || null,
          ctaText: "Reserve Your Table",
          ctaLink: "/reservations",
        },
      }),
      deals_of_the_day: () => ({
        id: uuidv4(), component: "FlashSale", order: 3,
        props: {
          title: "Deals of the Day", subtitle: "Limited time offers on top tech",
          endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
          products: ctx.products.filter((p) => p.originalPrice).slice(0, 4).map((p) => ({
            id: uuidv4(), name: p.name, price: `${ctx.symbol}${(p.price * 0.85).toFixed(2)}`,
            originalPrice: `${ctx.symbol}${p.price.toFixed(2)}`, discount: "15%",
            image: ctx.imagePaths[0] || null, slug: p.name.toLowerCase().replace(/\s+/g, "-"),
          })),
        },
      }),
      brand_showcase: () => ({
        id: uuidv4(), component: "BrandShowcase", order: 4,
        props: {
          title: "Top Brands", subtitle: "Shop from the brands you love",
          brands: ["Apple", "Samsung", "Sony", "LG", "Dell", "HP", "Lenovo", "JBL"].map((b) => ({ name: b, logo: null })),
        },
      }),
      tech_reviews: () => ({
        id: uuidv4(), component: "Testimonials", order: 5,
        props: {
          title: "Customer Reviews", subtitle: "See what tech enthusiasts are saying",
          testimonials: [
            { name: "Tech Enthusiast", role: "Verified Buyer", content: "Amazing product quality and fast delivery. The specs are exactly as advertised!", rating: 5, avatar: null },
            { name: "Gadget Lover", role: "Power User", content: "Best purchase I've made this year. Performance exceeded my expectations.", rating: 5, avatar: null },
            { name: "Digital Nomad", role: "Frequent Traveler", content: "Perfect for on-the-go use. Battery life is incredible and build quality is solid.", rating: 4, avatar: null },
          ],
        },
      }),
      daily_deals: () => ({
        id: uuidv4(), component: "FlashSale", order: 2,
        props: {
          title: "Today's Fresh Deals", subtitle: "Save big on today's freshest picks",
          endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
          products: ctx.products.filter((p) => p.originalPrice).slice(0, 3).map((p) => ({
            id: uuidv4(), name: p.name, price: `${ctx.symbol}${(p.price * 0.8).toFixed(2)}`,
            originalPrice: `${ctx.symbol}${p.price.toFixed(2)}`, discount: "20%",
            image: ctx.imagePaths[0] || null, slug: p.name.toLowerCase().replace(/\s+/g, "-"),
          })),
        },
      }),
      fresh_arrivals: () => ({
        id: uuidv4(), component: "NewArrivals", order: 3,
        props: {
          title: "Fresh Arrivals", subtitle: "Just arrived at our store today",
          products: ctx.products.slice(0, 4).map((p) => ({
            id: uuidv4(), name: p.name, price: `${ctx.symbol}${p.price.toFixed(2)}`,
            description: p.description, image: ctx.imagePaths[0] || null,
            badge: "Fresh", slug: p.name.toLowerCase().replace(/\s+/g, "-"),
          })),
        },
      }),
      delivery_info: () => ({
        id: uuidv4(), component: "WhyChooseUs", order: 4,
        props: {
          title: "Delivery Information", subtitle: `${ctx.businessName} delivers fresh to your door`,
          features: [
            { icon: "truck", title: "Same Day Delivery", description: "Order before 2pm for same-day delivery" },
            { icon: "shield", title: "Freshness Guarantee", description: "100% satisfaction guarantee on all products" },
            { icon: "clock", title: "Scheduled Delivery", description: "Choose your preferred delivery window" },
            { icon: "credit-card", title: "Easy Payment", description: "Multiple payment options accepted" },
          ],
        },
      }),
      featured_collections: () => ({
        id: uuidv4(), component: "FeaturedCategories", order: 2,
        props: {
          title: "Featured Collections", subtitle: "Explore our curated collections",
          categories: ctx.config.categories.map((cat) => ({ ...cat, image: ctx.imagePaths[0] || null, slug: cat.name.toLowerCase().replace(/\s+/g, "-") })),
        },
      }),
      room_ideas: () => ({
        id: uuidv4(), component: "FeaturedCategories", order: 3,
        props: {
          title: "Shop by Room", subtitle: "Get inspired for every space",
          categories: [
            { name: "Living Room", description: "Create a cozy living space", productCount: 45, image: null, slug: "living-room" },
            { name: "Bedroom", description: "Design your dream bedroom", productCount: 38, image: null, slug: "bedroom" },
            { name: "Office", description: "Productive workspace setup", productCount: 32, image: null, slug: "office" },
            { name: "Outdoor", description: "Alfresco living & dining", productCount: 28, image: null, slug: "outdoor" },
          ],
        },
      }),
      design_inspo: () => ({
        id: uuidv4(), component: "InstagramFeed", order: 4,
        props: { title: "Design Inspiration", subtitle: "Follow us for daily inspiration", images: Array(6).fill(null) },
      }),
      shop_by_concern: () => ({
        id: uuidv4(), component: "FeaturedCategories", order: 2,
        props: {
          title: "Shop by Concern", subtitle: "Find products for your specific needs",
          categories: ctx.config.categories.map((cat) => ({ ...cat, image: ctx.imagePaths[0] || null, slug: cat.name.toLowerCase().replace(/\s+/g, "-") })),
        },
      }),
      beauty_tips: () => ({
        id: uuidv4(), component: "BlogPreview", order: 3,
        props: {
          title: "Beauty Tips & Guides", subtitle: "Expert advice for your beauty routine",
          posts: [
            { title: "5-Minute Morning Skincare Routine", excerpt: "Start your day with glowing skin using these simple steps.", image: null, slug: "morning-skincare-routine" },
            { title: "How to Choose Your Foundation Shade", excerpt: "Our guide to finding your perfect match.", image: null, slug: "foundation-shade-guide" },
            { title: "Summer Hair Care Essentials", excerpt: "Protect and nourish your hair during summer.", image: null, slug: "summer-hair-care" },
          ],
        },
      }),
      shop_by_sport: () => ({
        id: uuidv4(), component: "FeaturedCategories", order: 2,
        props: {
          title: "Shop by Sport", subtitle: "Find gear for your favorite activities",
          categories: ctx.config.categories.map((cat) => ({ ...cat, image: ctx.imagePaths[0] || null, slug: cat.name.toLowerCase().replace(/\s+/g, "-") })),
        },
      }),
      training_tips: () => ({
        id: uuidv4(), component: "BlogPreview", order: 3,
        props: {
          title: "Training Tips", subtitle: "Expert advice to maximize your performance",
          posts: [
            { title: "Beginner's Guide to Strength Training", excerpt: "Build a solid foundation with these essential tips.", image: null, slug: "strength-training-guide" },
            { title: "Running Form 101", excerpt: "Improve your form and prevent injuries.", image: null, slug: "running-form" },
            { title: "Recovery: Why It Matters", excerpt: "The science behind rest and muscle recovery.", image: null, slug: "recovery-guide" },
          ],
        },
      }),
      gift_guide: () => ({
        id: uuidv4(), component: "FeaturedCategories", order: 2,
        props: {
          title: "Gift Guide", subtitle: "Perfect gifts for every occasion",
          categories: [
            { name: "Under $100", description: "Affordable luxury gifts", productCount: 25, image: null, slug: "under-100" },
            { name: "For Her", description: "Gifts she'll love", productCount: 30, image: null, slug: "for-her" },
            { name: "For Him", description: "Gifts he'll appreciate", productCount: 28, image: null, slug: "for-him" },
            { name: "Luxury Gifts", description: "Premium gift selections", productCount: 15, image: null, slug: "luxury-gifts" },
          ],
        },
      }),
      new_releases: () => ({
        id: uuidv4(), component: "FeaturedProducts", order: 2,
        props: {
          title: "New Releases", subtitle: "Fresh off the press",
          products: ctx.products.slice(0, 4).map((p) => ({
            id: uuidv4(), name: p.name, price: `${ctx.symbol}${p.price.toFixed(2)}`,
            description: p.description, image: ctx.imagePaths[0] || null,
            rating: p.rating, reviewCount: p.reviewCount, slug: p.name.toLowerCase().replace(/\s+/g, "-"),
            category: p.category, badge: "New",
          })),
        },
      }),
      bestsellers: () => ({
        id: uuidv4(), component: "BestSellers", order: 3,
        props: {
          title: "Bestsellers", subtitle: "Most popular books right now",
          products: ctx.products.filter((p) => p.badge === "Best Seller" || p.rating >= 4.7).slice(0, 4).map((p) => ({
            id: uuidv4(), name: p.name, price: `${ctx.symbol}${p.price.toFixed(2)}`,
            originalPrice: `${ctx.symbol}${(p.price * 1.2).toFixed(2)}`,
            description: p.description, image: ctx.imagePaths[0] || null,
            rating: p.rating, reviewCount: p.reviewCount, badge: "Best Seller",
            slug: p.name.toLowerCase().replace(/\s+/g, "-"), category: p.category,
          })),
          viewAllLink: "/shop",
        },
      }),
      book_of_month: () => {
        const book = ctx.products[0];
        return {
          id: uuidv4(), component: "AboutStory", order: 4,
          props: {
            title: "Book of the Month",
            content: `${book.name} - ${book.description} This month's pick has captivated readers worldwide.`,
            image: ctx.imagePaths[0] || null,
            stats: [
              { value: "4.8", label: "Rating" }, { value: "1.2K+", label: "Reviews" },
              { value: "#1", label: "Bestseller" }, { value: "320", label: "Pages" },
            ],
          },
        };
      },
      staff_picks: () => ({
        id: uuidv4(), component: "FeaturedProducts", order: 5,
        props: {
          title: "Staff Picks", subtitle: "Books our team can't stop recommending",
          products: ctx.products.slice(0, 4).map((p) => ({
            id: uuidv4(), name: p.name, price: `${ctx.symbol}${p.price.toFixed(2)}`,
            description: p.description, image: ctx.imagePaths[0] || null,
            rating: p.rating, reviewCount: p.reviewCount, slug: p.name.toLowerCase().replace(/\s+/g, "-"),
            category: p.category, badge: "Staff Pick",
          })),
        },
      }),
      services: () => ({
        id: uuidv4(), component: "Services", order: 2,
        props: {
          title: "Our Services", subtitle: "Professional services tailored to your needs",
          services: ctx.products.slice(0, 6).map((p) => ({
            name: p.name, title: p.name, price: p.price.toFixed(2),
            description: p.description, icon: "✦",
          })),
        },
      }),
      book_appointment: () => ({
        id: uuidv4(), component: "AppointmentBooking", order: 3,
        props: {
          title: "Book an Appointment", subtitle: "Schedule your visit with our team",
          submitText: "Book Appointment",
        },
      }),
      our_doctors: () => ({
        id: uuidv4(), component: "DoctorProfiles", order: 4,
        props: {
          title: "Our Medical Team", subtitle: "Experienced professionals dedicated to your health",
          doctors: [
            { name: "Dr. Sarah Johnson", specialty: "Family Medicine", avatar: null },
            { name: "Dr. Michael Chen", specialty: "Internal Medicine", avatar: null },
            { name: "Dr. Emily Williams", specialty: "Pediatrics", avatar: null },
            { name: "Dr. Robert Davis", specialty: "Cardiology", avatar: null },
          ],
        },
      }),
      health_resources: () => ({
        id: uuidv4(), component: "HealthResources", order: 5,
        props: {
          title: "Health Resources", subtitle: "Stay informed with our health articles",
          resources: [
            { title: "Understanding Your Blood Test Results", description: "A simple guide to reading and understanding lab reports.", image: null, category: "Wellness" },
            { title: "Managing Stress for Better Health", description: "Practical strategies for reducing stress in daily life.", image: null, category: "Mental Health" },
            { title: "Nutrition Myths Debunked", description: "Separating fact from fiction in nutrition science.", image: null, category: "Nutrition" },
          ],
        },
      }),
      popular_courses: () => ({
        id: uuidv4(), component: "CourseGrid", order: 2,
        props: {
          title: "Popular Courses", subtitle: "Most enrolled courses by our students",
          courses: ctx.products.filter((p) => p.badge === "Best Seller" || p.rating >= 4.7).slice(0, 6).map((p) => ({
            title: p.name, price: p.price.toFixed(2),
            description: p.description, image: ctx.imagePaths[0] || null,
            category: p.category, duration: "8 weeks", level: "Intermediate",
          })),
        },
      }),
      learning_paths: () => ({
        id: uuidv4(), component: "LearningPaths", order: 3,
        props: {
          title: "Learning Paths", subtitle: "Structured programs to achieve your goals",
          paths: ctx.config.categories.map((cat) => ({
            title: cat.name, description: cat.description || `Master ${cat.name} with our structured program`,
            icon: "🎯", courses: Math.floor(Math.random() * 8) + 3,
          })),
        },
      }),
      student_success: () => ({
        id: uuidv4(), component: "StudentSuccess", order: 4,
        props: {
          title: "Student Success Stories", subtitle: "Hear from our graduates who transformed their careers",
          testimonials: [
            { name: "Alex Johnson", role: "Full-Stack Developer at Google", content: "The bootcamp gave me the skills and confidence to land my dream job.", rating: 5, avatar: null },
            { name: "Maria Garcia", role: "Data Scientist at Meta", content: "The data science program was comprehensive and practical.", rating: 5, avatar: null },
            { name: "David Chen", role: "UX Designer at Apple", content: "The UX design path taught me everything from research to prototyping.", rating: 5, avatar: null },
          ],
        },
      }),
      instructors: () => ({
        id: uuidv4(), component: "InstructorProfiles", order: 5,
        props: {
          title: "Expert Instructors", subtitle: "Learn from industry professionals",
          instructors: [
            { name: "Prof. Sarah Chen", specialty: "Web Development", avatar: null },
            { name: "Dr. James Wilson", specialty: "Data Science", avatar: null },
            { name: "Lisa Park", specialty: "UX Design", avatar: null },
            { name: "Mark Thompson", specialty: "Business Strategy", avatar: null },
          ],
        },
      }),
      featured_properties: () => ({
        id: uuidv4(), component: "PropertyGrid", order: 2,
        props: {
          title: "Featured Properties", subtitle: "Handpicked properties for you",
          properties: ctx.products.slice(0, 6).map((p) => ({
            title: p.name, price: p.price.toLocaleString(),
            description: p.description, image: ctx.imagePaths[0] || null,
            badge: p.badge, type: p.category,
            beds: Math.floor(Math.random() * 4) + 1,
            baths: Math.floor(Math.random() * 3) + 1,
            sqft: Math.floor(Math.random() * 2000) + 800,
            address: "123 Main St, City, State",
          })),
        },
      }),
      property_search: () => ({
        id: uuidv4(), component: "PropertySearch", order: 3,
        props: {
          title: "Search Properties",
          filters: [
            { name: "Property Type", type: "select", options: ["House", "Condo", "Apartment", "Townhouse", "Land", "Commercial"] },
            { name: "Price Range", type: "range", min: 0, max: 5000000, currency: "$" },
            { name: "Bedrooms", type: "select", options: ["1+", "2+", "3+", "4+", "5+"] },
          ],
          layout: "sidebar",
        },
      }),
      neighborhoods: () => ({
        id: uuidv4(), component: "NeighborhoodGuide", order: 4,
        props: {
          title: "Explore Neighborhoods", subtitle: "Discover the perfect area for your lifestyle",
          neighborhoods: [
            { name: "Downtown", description: "Urban living with city amenities", image: null, href: "#" },
            { name: "Suburbs", description: "Family-friendly communities", image: null, href: "#" },
            { name: "Waterfront", description: "Properties with stunning views", image: null, href: "#" },
            { name: "Historic District", description: "Charming character homes", image: null, href: "#" },
          ],
        },
      }),
      agents: () => ({
        id: uuidv4(), component: "AgentProfiles", order: 5,
        props: {
          title: "Our Agents", subtitle: "Expert guidance for your property journey",
          agents: [
            { name: "Jennifer Adams", specialty: "Senior Agent", avatar: null },
            { name: "Robert Martinez", specialty: "Buyer's Agent", avatar: null },
            { name: "Sarah Kim", specialty: "Commercial Specialist", avatar: null },
            { name: "David Thompson", specialty: "Property Manager", avatar: null },
          ],
        },
      }),
      popular_destinations: () => ({
        id: uuidv4(), component: "DestinationGrid", order: 2,
        props: {
          title: "Popular Destinations", subtitle: "Trending travel spots our travelers love",
          destinations: ctx.config.categories.map((cat) => ({
            name: cat.name, description: cat.description || `Explore ${cat.name}`,
            image: ctx.imagePaths[0] || null, price: Math.floor(Math.random() * 2000) + 500,
          })),
        },
      }),
      deals: () => ({
        id: uuidv4(), component: "TravelDeals", order: 3,
        props: {
          title: "Travel Deals", subtitle: "Limited-time offers on top destinations",
          deals: ctx.products.filter((p) => p.originalPrice).slice(0, 4).map((p) => ({
            title: p.name, price: p.price.toLocaleString(),
            originalPrice: p.originalPrice?.toLocaleString(), discount: "25",
            description: p.description, image: ctx.imagePaths[0] || null,
          })),
        },
      }),
      featured_packages: () => ({
        id: uuidv4(), component: "PackageGrid", order: 4,
        props: {
          title: "Featured Packages", subtitle: "All-inclusive vacation experiences",
          packages: ctx.products.filter((p) => p.category === "Packages").slice(0, 6).map((p, idx) => ({
            title: p.name, price: p.price.toLocaleString(), period: "person",
            description: p.description, image: ctx.imagePaths[idx % Math.max(1, ctx.imagePaths.length)] || null,
            duration: `${Math.floor(Math.random() * 7) + 3} days`, badge: p.badge,
            featured: idx === 0,
            cta: "Book This Package",
            features: [
              "Round-trip flights & transfers",
              `${Math.floor(Math.random() * 4) + 3}-star hotel accommodation`,
              "Daily breakfast included",
              "Guided local experiences",
              "24/7 travel support",
            ].slice(0, 4),
          })),
        },
      }),
      travel_guides: () => ({
        id: uuidv4(), component: "TravelGuides", order: 5,
        props: {
          title: "Travel Guides", subtitle: "Expert tips for your next adventure",
          guides: [
            { title: "Packing Essentials for Any Trip", description: "The ultimate packing checklist for stress-free travel.", image: null, destination: "Tips" },
            { title: "Budget Travel Tips", description: "How to see the world without breaking the bank.", image: null, destination: "Budget" },
            { title: "Solo Travel Safety Guide", description: "Stay safe while exploring the world alone.", image: null, destination: "Safety" },
          ],
        },
      }),
      shop_by_pet: () => ({
        id: uuidv4(), component: "FeaturedCategories", order: 2,
        props: {
          title: "Shop by Pet", subtitle: "Find everything for your furry, feathery, or scaly friend",
          categories: ctx.config.categories.map((cat) => ({ ...cat, image: ctx.imagePaths[0] || null, slug: cat.name.toLowerCase().replace(/\s+/g, "-") })),
        },
      }),
      pet_care_tips: () => ({
        id: uuidv4(), component: "PetCareTips", order: 3,
        props: {
          title: "Pet Care Tips", subtitle: "Expert advice for happy, healthy pets",
          posts: [
            { title: "Nutrition Guide for Dogs", excerpt: "What to feed your dog at every life stage. A balanced diet is essential for your dog's health and longevity. Learn about the key nutrients, feeding schedules, and common dietary mistakes to avoid.", image: null, slug: "dog-nutrition-guide", category: "Dogs" },
            { title: "Cat Enrichment Ideas", excerpt: "Keep your indoor cat active and entertained. Indoor cats need mental and physical stimulation to stay healthy. Discover creative ways to enrich your cat's environment with toys, climbing structures, and interactive play.", image: null, slug: "cat-enrichment", category: "Cats" },
            { title: "Aquarium Setup Basics", excerpt: "Everything you need to start a fish tank. From choosing the right tank size to understanding water cycling, this guide covers all the essentials for setting up a thriving aquarium.", image: null, slug: "aquarium-setup", category: "Fish" },
            { title: "Bird Training Tips", excerpt: "Teach your bird new tricks and commands. Positive reinforcement training strengthens the bond between you and your feathered friend while keeping them mentally stimulated.", image: null, slug: "bird-training", category: "Birds" },
          ],
        },
      }),
      pet_grooming_booking: () => ({
        id: uuidv4(), component: "PetGroomingBooking", order: 4,
        props: {
          title: "Pet Grooming & Boarding", subtitle: "Book professional grooming or boarding services",
          services: [
            { name: "Full Grooming", price: "$65", description: "Bath, haircut, nail trim, ear cleaning", icon: "✂️" },
            { name: "Bath & Brush", price: "$35", description: "Bath, blow dry, and brush out", icon: "🛁" },
            { name: "Nail Trim", price: "$15", description: "Nail clipping and filing", icon: "🐾" },
            { name: "Boarding (per night)", price: "$45", description: "Overnight stay with meals and playtime", icon: "🏠" },
          ],
        },
      }),
      featured_vehicles: () => ({
        id: uuidv4(), component: "VehicleGrid", order: 2,
        props: {
          title: "Featured Vehicles", subtitle: "Top picks from our inventory",
          products: ctx.products.filter((p) => ["Cars", "SUVs", "EVs", "Trucks"].includes(p.category)).slice(0, 4).map((p) => ({
            id: uuidv4(), name: p.name, price: `${ctx.symbol}${p.price.toLocaleString()}`,
            description: p.description, image: ctx.imagePaths[0] || null,
            rating: p.rating, reviewCount: p.reviewCount, slug: p.name.toLowerCase().replace(/\s+/g, "-"),
            category: p.category, badge: p.badge,
          })),
        },
      }),
      special_offers: () => ({
        id: uuidv4(), component: "FlashSale", order: 3,
        props: {
          title: "Special Offers", subtitle: "Limited time deals on vehicles and services",
          endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          products: ctx.products.filter((p) => p.originalPrice).slice(0, 3).map((p) => ({
            id: uuidv4(), name: p.name, price: `${ctx.symbol}${p.price.toLocaleString()}`,
            originalPrice: `${ctx.symbol}${p.originalPrice!.toLocaleString()}`, discount: "10%",
            image: ctx.imagePaths[0] || null, slug: p.name.toLowerCase().replace(/\s+/g, "-"),
          })),
        },
      }),
      inventory_search: () => ({
        id: uuidv4(), component: "PropertySearch", order: 4,
        props: {
          title: "Search Inventory",
          filters: [
            { name: "Vehicle Type", type: "select", options: ["Sedan", "SUV", "Truck", "Coupe", "Hatchback", "Electric"] },
            { name: "Price Range", type: "range", min: 0, max: 100000, currency: "$" },
            { name: "Year", type: "select", options: ["2026", "2025", "2024", "2023", "2022"] },
          ],
          layout: "sidebar",
        },
      }),
      service_center: () => ({
        id: uuidv4(), component: "AutomotiveServicePackages", order: 5,
        props: {
          title: "Service Center", subtitle: "Professional maintenance and repair",
          services: [
            { name: "Oil Change", title: "Oil Change", price: "49.99", description: "Full synthetic oil change with filter", icon: "🔧" },
            { name: "Brake Service", title: "Brake Service", price: "199.99", description: "Brake pad replacement and rotor resurfacing", icon: "🛑" },
            { name: "Tire Rotation", title: "Tire Rotation", price: "29.99", description: "Tire rotation and pressure check", icon: "🔄" },
            { name: "Full Detail", title: "Full Detail", price: "149.99", description: "Complete interior and exterior detailing", icon: "✨" },
          ],
        },
      }),
      book_now: () => ({
        id: uuidv4(), component: "AppointmentBooking", order: 3,
        props: {
          title: "Book a Service", subtitle: "Schedule your appointment online",
          submitText: "Book Now",
          services: [
            { name: "Cleaning", label: "House Cleaning" },
            { name: "Plumbing", label: "Plumbing Repair" },
            { name: "Electrical", label: "Electrical Work" },
            { name: "Painting", label: "Interior Painting" },
            { name: "Landscaping", label: "Lawn & Garden" },
            { name: "HVAC", label: "Heating & Cooling" },
          ],
        },
      }),
      before_after: () => ({
        id: uuidv4(), component: "BeforeAfterGallery", order: 3,
        props: {
          title: "Before & After", subtitle: "See the difference we make",
          items: [
            { before: null, after: null, title: "Kitchen Renovation", category: "Painting" },
            { before: null, after: null, title: "Lawn Transformation", category: "Landscaping" },
            { before: null, after: null, title: "Bathroom Remodel", category: "Plumbing" },
            { before: null, after: null, title: "Living Room Makeover", category: "Painting" },
            { before: null, after: null, title: "Garden Design", category: "Landscaping" },
            { before: null, after: null, title: "Deck Restoration", category: "Cleaning" },
          ],
        },
      }),
      home_services_list: () => ({
        id: uuidv4(), component: "HomeServicePackages", order: 2,
        props: {
          title: "Our Services", subtitle: "Professional services tailored to your needs",
          services: ctx.products.slice(0, 6).map((p) => ({
            name: p.name, title: p.name, price: `$${p.price.toFixed(2)}`,
            description: p.description, icon: "🔧",
          })),
        },
      }),
      flash_sale: () => ({
        id: uuidv4(), component: "FlashSale", order: 5,
        props: {
          title: "Flash Sale", subtitle: "Limited time offers - up to 40% off",
          endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          products: ctx.products.filter((p) => p.originalPrice).slice(0, 3).map((p) => ({
            id: uuidv4(), name: p.name, price: `${ctx.symbol}${(p.price * 0.6).toFixed(2)}`,
            originalPrice: `${ctx.symbol}${p.price.toFixed(2)}`, discount: "40%",
            image: ctx.imagePaths[0] || null, slug: p.name.toLowerCase().replace(/\s+/g, "-"),
          })),
        },
      }),
      newsletter_signup: () => ({
        id: uuidv4(), component: "NewsletterSignup", order: 12,
        props: {
          title: "Stay in the Loop", subtitle: "Subscribe for exclusive offers, new arrivals, and style inspiration.",
          placeholder: "Enter your email address", buttonText: "Subscribe", discount: "Get 10% off your first order",
        },
      }),
      instagram_feed: () => ({
        id: uuidv4(), component: "InstagramFeed", order: 13,
        props: { title: "Follow Us on Instagram", subtitle: ctx.socialMedia.instagram || "@yourbrand", images: Array(6).fill(null) },
      }),
      reservation_cta: () => ({
        id: uuidv4(), component: "CTABanner", order: 14,
        props: {
          title: "Reserve Your Table", subtitle: "Book ahead and skip the wait. Perfect for special occasions and intimate dinners.",
          ctaText: "Make a Reservation", ctaLink: "/reservations",
          backgroundImage: ctx.imagePaths[2] || null,
        },
      }),
      contact_form: () => ({
        id: uuidv4(), component: "ContactPreview", order: 15,
        props: {
          title: "Get in Touch", subtitle: "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
          submitText: "Send Message",
        },
      }),
      faq: () => ({
        id: uuidv4(), component: "FAQPreview", order: 16,
        props: {
          title: "Frequently Asked Questions",
          faqs: [
            { question: "What are your opening hours?", answer: "We're open Monday-Sunday from 10 AM to 10 PM. Holiday hours may vary." },
            { question: "Do you offer delivery?", answer: "Yes! We offer delivery through our partners. Check our delivery page for more details." },
            { question: "How can I track my order?", answer: "Once your order ships, you'll receive a tracking number via email." },
          ],
          link: "/faq", linkText: "View All FAQs",
        },
      }),
      store_locator: () => ({
        id: uuidv4(), component: "StoreLocator", order: 17,
        props: {
          title: "Visit Us", address: ctx.businessDescription || "123 Main Street",
          phone: "(555) 123-4567", email: `info@${ctx.businessName.toLowerCase().replace(/\s+/g, "")}.com`,
          hours: "Mon-Sun: 10 AM - 10 PM",
        },
      }),
      brands: () => ({
        id: uuidv4(), component: "BrandShowcase", order: 18,
        props: {
          title: "Brands We Work With", subtitle: "Trusted by leading brands worldwide",
          brands: (ctx.config.defaultProducts || []).slice(0, 6).map((p) => ({ name: p.category, logo: null })),
        },
      }),
      blog_preview: () => ({
        id: uuidv4(), component: "BlogPreview", order: 6,
        props: {
          title: "From the Blog", subtitle: "Latest news, tips, and updates",
          posts: [
            { title: "Top 10 Trends This Season", excerpt: "Discover the trends shaping the market right now.", image: null, slug: "top-10-trends" },
            { title: "How to Choose the Best Products", excerpt: "Our expert guide to making the right choice.", image: null, slug: "choosing-best-products" },
            { title: "Behind the Scenes", excerpt: "A look at what makes our business special.", image: null, slug: "behind-the-scenes" },
          ],
        },
      }),
      about_story: () => ({
        id: uuidv4(), component: "AboutStory", order: 7,
        props: {
          title: `${ctx.businessName} at a Glance`,
          content: ctx.businessDescription,
          image: ctx.imagePaths[1] || ctx.imagePaths[0] || null,
          stats: [
            { value: "10K+", label: "Happy Customers" },
            { value: "50+", label: "Products" },
            { value: "5+", label: "Years of Excellence" },
            { value: "98%", label: "Satisfaction" },
          ],
        },
      }),
    };

    const sections: ISection[] = [];
    let order = 1;
    for (const sectionKey of ctx.homepageSections) {
      const builder = sectionBuilders[sectionKey];
      if (builder) {
        const section = builder();
        section.order = order++;
        sections.push(section);
      }
    }
    // Guarantee the homepage is never empty: if no configured sections could be
    // built (e.g. label mismatch), fall back to the industry defaults.
    if (sections.length === 0) {
      const fallbackKeys = this._getDefaultHomepageSections(ctx.industry);
      for (const sectionKey of fallbackKeys) {
        const builder = sectionBuilders[sectionKey];
        if (builder) {
          const section = builder();
          section.order = order++;
          sections.push(section);
        }
      }
    }
    return sections;
  }

  private _buildHeroSection(ctx: { businessName: string; businessDescription: string; industry: string; imagePaths: string[]; logoPath: string | null }): ISection {
    const heroContent: Record<string, { headline: string; subheadline: string; ctaText: string; badge: string }> = {
      Restaurant: { headline: `Welcome to ${ctx.businessName}`, subheadline: "Experience authentic flavors crafted with passion by our award-winning chef", ctaText: "View Our Menu", badge: "Chef's Special This Week" },
      Electronics: { headline: `Welcome to ${ctx.businessName}`, subheadline: "Discover the latest technology at unbeatable prices", ctaText: "Shop Tech", badge: "New Arrivals" },
      Grocery: { headline: `Fresh from Farm to ${ctx.businessName}`, subheadline: "Locally sourced, organic produce delivered fresh daily", ctaText: "Shop Fresh", badge: "Fresh Today" },
      Furniture: { headline: `Design Your Dream Space`, subheadline: "Premium furniture and home decor to transform every room", ctaText: "Explore Collections", badge: "New Collection" },
      Beauty: { headline: `Discover Your Natural Beauty`, subheadline: "Premium skincare and beauty products for every skin type", ctaText: "Shop Beauty", badge: "Best Sellers" },
      Sports: { headline: `Gear Up for Greatness`, subheadline: "Professional sports equipment for athletes at every level", ctaText: "Shop Sports", badge: "Top Rated" },
      Jewelry: { headline: `Timeless Elegance, Redefined`, subheadline: "Exquisite fine jewelry and watches for life's precious moments", ctaText: "Explore Collections", badge: "Luxury Collection" },
      Books: { headline: `Your Next Great Read Awaits`, subheadline: "Discover bestsellers, new releases, and hidden gems", ctaText: "Browse Books", badge: "New Releases" },
      Healthcare: { headline: `Your Health, Our Priority`, subheadline: "Comprehensive healthcare services with compassionate care", ctaText: "Book Appointment", badge: "Accepting New Patients" },
      Education: { headline: `Unlock Your Potential`, subheadline: "World-class courses and certifications to advance your career", ctaText: "Explore Courses", badge: "Enrollment Open" },
      "Real Estate": { headline: `Find Your Dream Home`, subheadline: "Premium properties and expert guidance for your real estate journey", ctaText: "Browse Properties", badge: "New Listings" },
      Travel: { headline: `Explore the World with ${ctx.businessName}`, subheadline: "Curated travel experiences and exclusive vacation packages", ctaText: "Plan Your Trip", badge: "Deals Available" },
      "Pet Store": { headline: `Everything Your Pet Needs`, subheadline: "Premium pet supplies and expert advice for happy, healthy pets", ctaText: "Shop by Pet", badge: "New Arrivals" },
      Automotive: { headline: `Drive Your Dream`, subheadline: "New and certified pre-owned vehicles with flexible financing", ctaText: "Browse Inventory", badge: "Special Offers" },
      "Home Services": { headline: `Professional Home Services`, subheadline: "Licensed experts for all your home repair and maintenance needs", ctaText: "Book Now", badge: "24/7 Emergency Service" },
    };
    const content = heroContent[ctx.industry] || { headline: `Welcome to ${ctx.businessName}`, subheadline: ctx.businessDescription, ctaText: "Shop Now", badge: "New Season" };
    return {
      id: uuidv4(), component: "HeroEcommerce", order: 1,
      props: {
        headline: content.headline, subheadline: content.subheadline,
        ctaText: content.ctaText, ctaLink: ctx.industry === "Restaurant" ? "/menu" : "/shop",
        secondaryCtaText: "Learn More", secondaryCtaLink: "/about",
        backgroundImage: ctx.imagePaths[0] || null, logo: ctx.logoPath, badge: content.badge,
      },
    };
  }

  private _buildShopPageSections(ctx: {
    businessName: string; industry: string; symbol: string;
    products: Array<{ name: string; price: number; originalPrice?: number; description: string; category: string; rating: number; reviewCount: number; badge?: string }>;
    config: BusinessTypeConfig; imagePaths: string[]; hasCategories: boolean; hasReviews: boolean;
  }): ISection[] {
    return [
      { id: uuidv4(), component: "ShopHero", order: 1, props: { title: ctx.industry === "Restaurant" ? "Our Menu" : "Shop", subtitle: "Browse our curated selection", backgroundImage: ctx.imagePaths[0] || null } },
      {
        id: uuidv4(), component: "ProductFilters", order: 2, props: {
          filters: [
            { name: "Category", type: "checkbox", options: [...new Set(ctx.products.map((p) => p.category))].map((c) => ({ label: c, value: c.toLowerCase().replace(/\s+/g, "-"), count: ctx.products.filter((p) => p.category === c).length })) },
            { name: "Price Range", type: "range", min: 0, max: Math.max(...ctx.products.map((p) => p.price)) * 1.5, currency: ctx.symbol },
            { name: "Sort By", type: "select", options: [{ label: "Newest", value: "newest" }, { label: "Price: Low to High", value: "price_asc" }, { label: "Price: High to Low", value: "price_desc" }, { label: "Best Selling", value: "best_selling" }, { label: "Top Rated", value: "top_rated" }] },
          ], layout: "sidebar",
        },
      },
      {
        id: uuidv4(), component: "ProductGrid", order: 3, props: {
          products: ctx.products.map((p) => ({
            id: uuidv4(), name: p.name, price: `${ctx.symbol}${p.price.toFixed(2)}`,
            originalPrice: p.originalPrice ? `${ctx.symbol}${p.originalPrice.toFixed(2)}` : null,
            description: p.description, image: ctx.imagePaths[0] || null,
            rating: p.rating, reviewCount: p.reviewCount, slug: p.name.toLowerCase().replace(/\s+/g, "-"),
            category: p.category, inStock: true, badge: p.badge,
          })),
          pagination: { currentPage: 1, totalPages: 3, totalProducts: ctx.products.length * 3, perPage: ctx.products.length },
          showViewToggle: true,
        },
      },
    ];
  }

  private _buildProductDetailsSections(ctx: {
    businessName: string; industry: string; symbol: string;
    products: Array<{ name: string; price: number; originalPrice?: number; description: string; category: string; rating: number; reviewCount: number; badge?: string }>;
    imagePaths: string[]; hasReviews: boolean; features: string[];
  }): ISection[] {
    const product = ctx.products[0];
    const relatedProducts = ctx.products.slice(1, 5);
    const sections: ISection[] = [
      {
        id: uuidv4(), component: "Breadcrumbs", order: 1, props: {
          items: [
            { label: "Home", href: "/" }, { label: ctx.industry === "Restaurant" ? "Menu" : "Shop", href: "/shop" },
            { label: product.category, href: "/shop?category=" + product.category.toLowerCase().replace(/\s+/g, "-") },
            { label: product.name, href: "#" },
          ],
        },
      },
      {
        id: uuidv4(), component: "ProductDetails", order: 2, props: {
          product: {
            id: uuidv4(), name: product.name, price: `${ctx.symbol}${product.price.toFixed(2)}`,
            originalPrice: product.originalPrice ? `${ctx.symbol}${product.originalPrice.toFixed(2)}` : null,
            description: product.description,
            fullDescription: product.description + " Crafted with attention to detail and premium quality from " + ctx.businessName + ".",
            images: ctx.imagePaths.length > 0 ? ctx.imagePaths : [null, null, null, null],
            rating: product.rating, reviewCount: product.reviewCount,
            sku: "SKU-" + Math.floor(Math.random() * 90000 + 10000),
            inStock: true, stockCount: Math.floor(Math.random() * 50) + 10,
            category: product.category, brand: ctx.businessName, badge: product.badge,
          },
          hasWishlist: ctx.features.includes("wishlist"), hasCompare: ctx.features.includes("compare"),
          shareLinks: { facebook: "#", twitter: "#", pinterest: "#" },
        },
      },
    ];
    if (ctx.hasReviews) {
      sections.push({
        id: uuidv4(), component: "ProductReviews", order: 3, props: {
          summary: {
            average: product.rating, total: product.reviewCount, distribution: [
              { stars: 5, count: Math.floor(product.reviewCount * 0.6), percentage: 60 },
              { stars: 4, count: Math.floor(product.reviewCount * 0.25), percentage: 25 },
              { stars: 3, count: Math.floor(product.reviewCount * 0.1), percentage: 10 },
              { stars: 2, count: Math.floor(product.reviewCount * 0.03), percentage: 3 },
              { stars: 1, count: Math.floor(product.reviewCount * 0.02), percentage: 2 },
            ]
          },
          reviews: [
            { id: uuidv4(), author: "Sarah M.", date: "2026-01-10", rating: 5, title: "Excellent!", content: "Amazing quality and great value. Highly recommend!", verified: true, helpful: 24, images: [] },
            { id: uuidv4(), author: "James R.", date: "2026-01-05", rating: 5, title: "Great value", content: "Exceeded my expectations. Fast delivery and excellent packaging.", verified: true, helpful: 18, images: [] },
          ],
          canWriteReview: true,
        },
      });
    }
    sections.push({
      id: uuidv4(), component: "RelatedProducts", order: 4, props: {
        title: "You May Also Like",
        products: relatedProducts.map((p) => ({ id: uuidv4(), name: p.name, price: `${ctx.symbol}${p.price.toFixed(2)}`, image: ctx.imagePaths[0] || null, rating: p.rating, slug: p.name.toLowerCase().replace(/\s+/g, "-") })),
      },
    });
    return sections;
  }

  private _buildCategoriesSections(ctx: { businessName: string; config: BusinessTypeConfig; imagePaths: string[] }): ISection[] {
    return [
      { id: uuidv4(), component: "PageHero", order: 1, props: { title: "Categories", subtitle: "Explore our curated collections", backgroundImage: ctx.imagePaths[0] || null } },
      {
        id: uuidv4(), component: "CategoryGrid", order: 2, props: {
          categories: ctx.config.categories.map((cat) => ({ id: uuidv4(), name: cat.name, description: cat.description, image: ctx.imagePaths[0] || null, productCount: cat.productCount, slug: cat.name.toLowerCase().replace(/\s+/g, "-") })),
          layout: "grid", columns: 3,
        },
      },
    ];
  }

  private _buildAboutSections(ctx: { businessName: string; businessDescription: string; industry: string; config: BusinessTypeConfig; imagePaths: string[] }): ISection[] {
    const aboutContent: Record<string, { title: string; story: string; values: Array<{ icon: string; title: string; description: string }>; team: Array<{ name: string; role: string; bio: string }> }> = {
      Restaurant: {
        title: "Our Story",
        story: `${ctx.businessName} was born from a deep love for authentic cuisine and the belief that great food brings people together. Our journey began in a small kitchen with a simple dream: to share the flavors we grew up with. Today, every dish we serve carries that same passion.`,
        values: [
          { icon: "leaf", title: "Farm-to-Table", description: "We partner with local farms for the freshest seasonal ingredients." },
          { icon: "heart", title: "Passion for Quality", description: "Every dish is prepared with care, from sourcing to plating." },
          { icon: "users", title: "Community", description: "We believe in supporting our local community and suppliers." },
          { icon: "award", title: "Excellence", description: "Our commitment to culinary excellence drives everything we do." },
        ],
        team: [
          { name: "Chef Marco Bellini", role: "Executive Chef", bio: "15 years of culinary excellence across Europe and North America." },
          { name: "Sofia Rivera", role: "Sous Chef", bio: "Trained at Le Cordon Bleu with a passion for fusion cuisine." },
          { name: "David Park", role: "Sommelier", bio: "Certified sommelier with expertise in Old World wines." },
          { name: "Lisa Chen", role: "Restaurant Manager", bio: "Ensuring every guest has an exceptional dining experience." },
        ],
      },
      Healthcare: {
        title: "About Our Practice",
        story: `${ctx.businessName} has been serving our community with compassionate, high-quality healthcare for over 20 years. Our team of board-certified physicians is dedicated to personalized medical care.`,
        values: [
          { icon: "heart", title: "Patient-Centered Care", description: "Your health and comfort are our top priorities." },
          { icon: "shield", title: "Medical Excellence", description: "Board-certified physicians using the latest evidence-based practices." },
          { icon: "clock", title: "Accessibility", description: "Same-day appointments and telehealth options." },
          { icon: "users", title: "Community Health", description: "Committed to improving health outcomes in our community." },
        ],
        team: [
          { name: "Dr. Sarah Johnson", role: "Medical Director", bio: "Board-certified in Family Medicine with 15 years of experience." },
          { name: "Dr. Michael Chen", role: "Chief of Internal Medicine", bio: "Specialist in preventive care and chronic disease management." },
          { name: "Dr. Emily Williams", role: "Pediatric Specialist", bio: "Dedicated to providing compassionate care for children." },
          { name: "Dr. Robert Davis", role: "Cardiologist", bio: "Leading heart health specialist with advanced training." },
        ],
      },
      Education: {
        title: "About Our Institution",
        story: `${ctx.businessName} was founded with a mission to make quality education accessible to everyone. We believe learning should be engaging, practical, and aligned with industry needs.`,
        values: [
          { icon: "book-open", title: "Quality Education", description: "Curriculum designed by industry experts and updated regularly." },
          { icon: "users", title: "Student Success", description: "Our students' career outcomes are our measure of success." },
          { icon: "globe", title: "Accessibility", description: "Learn from anywhere in the world, at your own pace." },
          { icon: "lightbulb", title: "Innovation", description: "Cutting-edge tools and methodologies for effective learning." },
        ],
        team: [
          { name: "Prof. Sarah Chen", role: "Academic Director", bio: "10+ years in tech education and curriculum development." },
          { name: "Dr. James Wilson", role: "Head of Data Science", bio: "PhD in Machine Learning, published researcher." },
          { name: "Lisa Park", role: "Head of Design", bio: "Award-winning designer with a passion for teaching." },
          { name: "Mark Thompson", role: "Career Services Director", bio: "Helping students launch successful careers in tech." },
        ],
      },
      "Real Estate": {
        title: "About Our Agency",
        story: `${ctx.businessName} has been helping families and investors find their perfect property for over 15 years. Our experienced agents combine deep local market knowledge with innovative strategies.`,
        values: [
          { icon: "shield", title: "Trust & Integrity", description: "Honest, transparent dealings in every transaction." },
          { icon: "home", title: "Local Expertise", description: "Deep knowledge of neighborhoods, schools, and market trends." },
          { icon: "users", title: "Client-First", description: "Your goals drive our strategy." },
          { icon: "trending-up", title: "Market Insight", description: "Data-driven pricing and marketing for optimal results." },
        ],
        team: [
          { name: "Jennifer Adams", role: "Managing Broker", bio: "15+ years in residential and commercial real estate." },
          { name: "Robert Martinez", role: "Buyer's Specialist", bio: "Expert in finding the perfect home for first-time buyers." },
          { name: "Sarah Kim", role: "Listing Agent", bio: "Marketing specialist who gets properties sold fast." },
          { name: "David Thompson", role: "Investment Advisor", bio: "Helping investors build wealth through real estate." },
        ],
      },
      default: {
        title: "Our Story",
        story: `${ctx.businessName} was born from a passion for quality and a commitment to excellence. What started as a small venture has grown into a trusted brand loved by customers worldwide.`,
        values: [
          { icon: "heart", title: "Quality First", description: "We never compromise on quality." },
          { icon: "leaf", title: "Sustainability", description: "We're committed to eco-friendly practices." },
          { icon: "users", title: "Customer Focus", description: "Our customers are at the heart of everything we do." },
          { icon: "lightbulb", title: "Innovation", description: "We constantly push boundaries to bring you the best." },
        ],
        team: [
          { name: "Alex Johnson", role: "Founder & CEO", bio: "Visionary leader with 15+ years in the industry." },
          { name: "Maria Garcia", role: "Head of Operations", bio: "Expert in streamlining processes and delivering excellence." },
          { name: "David Chen", role: "Head of Product", bio: "Passionate about creating products customers love." },
          { name: "Sophie Williams", role: "Customer Experience Lead", bio: "Dedicated to making every interaction memorable." },
        ],
      },
    };
    const content = aboutContent[ctx.industry] || aboutContent["default"];
    return [
      { id: uuidv4(), component: "PageHero", order: 1, props: { title: `${content.title} ${ctx.businessName}`, subtitle: ctx.businessDescription, backgroundImage: ctx.imagePaths[0] || null } },
      {
        id: uuidv4(), component: "AboutStory", order: 2, props: {
          title: content.title, content: content.story,
          image: ctx.imagePaths[1] || ctx.imagePaths[0] || null,
          stats: [{ value: "10K+", label: "Happy Customers" }, { value: "50+", label: ctx.industry === "Restaurant" ? "Menu Items" : "Products" }, { value: "5+", label: "Years Experience" }, { value: "98%", label: "Satisfaction Rate" }],
        },
      },
      { id: uuidv4(), component: "AboutValues", order: 3, props: { title: "Our Values", values: content.values } },
      {
        id: uuidv4(), component: "TeamSection", order: 4, props: {
          title: ctx.industry === "Healthcare" ? "Our Medical Team" : "Meet Our Team",
          subtitle: `The people behind ${ctx.businessName}`,
          members: content.team.map((t) => ({ ...t, image: null })),
        },
      },
      {
        id: uuidv4(), component: "CTABanner", order: 5, props: {
          headline: ctx.industry === "Restaurant" ? "Ready to Dine with Us?" : `Ready to Experience ${ctx.businessName}?`,
          subheadline: ctx.industry === "Restaurant" ? "Reserve your table today" : "Discover our collection and see what makes us different.",
          ctaText: ctx.industry === "Restaurant" ? "Reserve a Table" : "Shop Now",
          ctaLink: ctx.industry === "Restaurant" ? "/menu" : "/shop",
          backgroundImage: ctx.imagePaths[2] || null,
        },
      },
    ];
  }

  private _buildContactSections(ctx: { businessName: string; industry: string }): ISection[] {
    const contactMethodsMap: Record<string, Array<{ icon: string; title: string; value: string; description: string }>> = {
      Restaurant: [
        { icon: "phone", title: "Reservations", value: "+1 (555) 123-4567", description: "Call to reserve your table" },
        { icon: "mail", title: "Email Us", value: "reservations@" + ctx.businessName.toLowerCase().replace(/\s+/g, "") + ".com", description: "For event inquiries" },
        { icon: "clock", title: "Hours", value: "Mon-Sun: 11am-10pm", description: "Kitchen closes at 9:30pm" },
        { icon: "map-pin", title: "Location", value: "123 Gourmet Avenue, NYC", description: "Free valet parking" },
      ],
      Healthcare: [
        { icon: "phone", title: "Appointment Line", value: "+1 (555) 123-4567", description: "Mon-Fri 8am-6pm" },
        { icon: "phone", title: "Emergency", value: "+1 (555) 911-HELP", description: "24/7 Emergency Hotline" },
        { icon: "mail", title: "Patient Portal", value: "portal@" + ctx.businessName.toLowerCase().replace(/\s+/g, "") + ".com", description: "Secure message your doctor" },
        { icon: "map-pin", title: "Location", value: "123 Medical Center Dr, Suite 100", description: "Free parking available" },
      ],
      Education: [
        { icon: "phone", title: "Admissions", value: "+1 (555) 123-4567", description: "Mon-Fri 9am-6pm EST" },
        { icon: "mail", title: "Email Us", value: "admissions@" + ctx.businessName.toLowerCase().replace(/\s+/g, "") + ".com", description: "Inquiries welcome" },
        { icon: "message-circle", title: "Live Chat", value: "Available 24/7", description: "Instant support" },
        { icon: "map-pin", title: "Campus", value: "123 Education Lane", description: "Schedule a campus visit" },
      ],
      "Real Estate": [
        { icon: "phone", title: "Call Us", value: "+1 (555) 123-4567", description: "Mon-Sat 8am-8pm" },
        { icon: "mail", title: "Email Us", value: "info@" + ctx.businessName.toLowerCase().replace(/\s+/g, "") + ".com", description: "Property inquiries" },
        { icon: "map-pin", title: "Office", value: "123 Main Street, Suite 200", description: "Walk-ins welcome" },
        { icon: "message-circle", title: "Virtual Tour", value: "Available Online", description: "Schedule a virtual showing" },
      ],
      default: [
        { icon: "mail", title: "Email Us", value: "support@" + ctx.businessName.toLowerCase().replace(/\s+/g, "") + ".com", description: "We'll respond within 24 hours" },
        { icon: "phone", title: "Call Us", value: "+1 (555) 123-4567", description: "Mon-Fri 9am-6pm EST" },
        { icon: "map-pin", title: "Visit Us", value: "123 Commerce Street, New York, NY 10001", description: "Walk-ins welcome" },
        { icon: "message-circle", title: "Live Chat", value: "Available 24/7", description: "Instant support" },
      ],
    };
    const formFieldsMap: Record<string, Array<{ name: string; label: string; type: string; required: boolean; options?: string[] }>> = {
      Restaurant: [
        { name: "name", label: "Full Name", type: "text", required: true },
        { name: "email", label: "Email Address", type: "email", required: true },
        { name: "phone", label: "Phone Number", type: "tel", required: true },
        { name: "party_size", label: "Party Size", type: "select", required: true, options: ["1-2 Guests", "3-4 Guests", "5-6 Guests", "7-8 Guests", "8+ Guests"] },
        { name: "date", label: "Preferred Date", type: "date", required: true },
        { name: "message", label: "Special Requests", type: "textarea", required: false },
      ],
      Healthcare: [
        { name: "name", label: "Full Name", type: "text", required: true },
        { name: "email", label: "Email Address", type: "email", required: true },
        { name: "phone", label: "Phone Number", type: "tel", required: true },
        { name: "dob", label: "Date of Birth", type: "date", required: true },
        { name: "service", label: "Service Needed", type: "select", required: true, options: ["General Checkup", "Specialist Consultation", "Lab Work", "Vaccination", "Telehealth Visit"] },
        { name: "insurance", label: "Insurance Provider", type: "text", required: false },
        { name: "message", label: "Symptoms/Concerns", type: "textarea", required: false },
      ],
      Education: [
        { name: "name", label: "Full Name", type: "text", required: true },
        { name: "email", label: "Email Address", type: "email", required: true },
        { name: "phone", label: "Phone Number", type: "tel", required: false },
        { name: "interest", label: "Program of Interest", type: "select", required: true, options: ["Web Development", "Data Science", "UX Design", "Digital Marketing"] },
        { name: "experience", label: "Experience Level", type: "select", required: true, options: ["Beginner", "Intermediate", "Advanced", "Professional"] },
        { name: "message", label: "Tell Us About Yourself", type: "textarea", required: false },
      ],
      "Real Estate": [
        { name: "name", label: "Full Name", type: "text", required: true },
        { name: "email", label: "Email Address", type: "email", required: true },
        { name: "phone", label: "Phone Number", type: "tel", required: true },
        { name: "inquiry", label: "I'm Interested In", type: "select", required: true, options: ["Buying a Home", "Selling a Home", "Renting", "Investment Property"] },
        { name: "budget", label: "Budget Range", type: "select", required: false, options: ["Under $200K", "$200K-$500K", "$500K-$1M", "$1M-$5M", "$5M+"] },
        { name: "message", label: "Requirements", type: "textarea", required: false },
      ],
      default: [
        { name: "name", label: "Full Name", type: "text", required: true },
        { name: "email", label: "Email Address", type: "email", required: true },
        { name: "phone", label: "Phone Number", type: "tel", required: false },
        { name: "subject", label: "Subject", type: "select", required: true, options: ["General Inquiry", "Order Support", "Returns & Exchanges", "Wholesale", "Partnership"] },
        { name: "message", label: "Message", type: "textarea", required: true },
      ],
    };
    return [
      { id: uuidv4(), component: "PageHero", order: 1, props: { title: "Contact Us", subtitle: "We'd love to hear from you. Get in touch with our team." } },
      { id: uuidv4(), component: "ContactInfo", order: 2, props: { methods: contactMethodsMap[ctx.industry] || contactMethodsMap["default"] } },
      {
        id: uuidv4(), component: "ContactForm", order: 3, props: {
          title: ctx.industry === "Healthcare" ? "Request an Appointment" : ctx.industry === "Restaurant" ? "Make a Reservation" : "Send Us a Message",
          fields: formFieldsMap[ctx.industry] || formFieldsMap["default"],
          submitText: ctx.industry === "Healthcare" ? "Request Appointment" : ctx.industry === "Restaurant" ? "Request Reservation" : "Send Message",
        },
      },
      { id: uuidv4(), component: "MapEmbed", order: 4, props: { address: "123 Commerce Street, New York, NY 10001", lat: 40.7128, lng: -74.006 } },
    ];
  }

  private _buildBlogSections(ctx: { businessName: string; industry: string; imagePaths: string[] }): ISection[] {
    const posts = BLOG_POSTS[ctx.industry] || BLOG_POSTS["default"];
    return [
      { id: uuidv4(), component: "PageHero", order: 1, props: { title: "Blog", subtitle: `Stories, tips, and updates from ${ctx.businessName}`, backgroundImage: ctx.imagePaths[0] || null } },
      {
        id: uuidv4(), component: "BlogGrid", order: 2, props: {
          posts: posts.map((post) => ({ id: uuidv4(), title: post.title, excerpt: post.excerpt, date: post.date, readTime: post.readTime, category: post.category, image: ctx.imagePaths[0] || null, slug: post.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""), author: { name: "Editorial Team", avatar: null } })),
          pagination: { currentPage: 1, totalPages: 3, totalPosts: 24 },
        },
      },
    ];
  }

  private _buildFaqSections(ctx: { businessName: string; industry: string }): ISection[] {
    const faqCategoriesMap: Record<string, Array<{ name: string; faqs: Array<{ question: string; answer: string }> }>> = {
      Restaurant: [
        {
          name: "Reservations & Dining", faqs: [
            { question: "Do you accept walk-ins?", answer: "Yes, but we recommend reservations for parties of 4+ and on weekends." },
            { question: "Do you accommodate dietary restrictions?", answer: "Yes! Our menu includes vegetarian, vegan, and gluten-free options." },
            { question: "Do you have a dress code?", answer: "Smart casual. No flip-flops or tank tops." },
          ]
        },
        {
          name: "Menu & Pricing", faqs: [
            { question: "Do you offer takeout?", answer: "Yes! Order online or by phone during all business hours." },
            { question: "Do you have a kids' menu?", answer: "Yes! We have a kids' menu and highchairs available." },
            { question: "Do you offer private dining?", answer: "Yes, our private dining room seats up to 20 guests." },
          ]
        },
      ],
      Healthcare: [
        {
          name: "Appointments", faqs: [
            { question: "How do I book an appointment?", answer: "Book online, call our office, or use our mobile app." },
            { question: "Do you offer telehealth?", answer: "Yes, many appointments can be conducted via secure video." },
            { question: "What should I bring?", answer: "Insurance card, photo ID, list of current medications." },
          ]
        },
        {
          name: "Insurance & Billing", faqs: [
            { question: "What insurance do you accept?", answer: "We accept most major plans including Blue Cross, Aetna, UnitedHealthcare." },
            { question: "Do you offer payment plans?", answer: "Yes, flexible options for uninsured patients." },
            { question: "How do I get my records?", answer: "Request through our patient portal or contact our records department." },
          ]
        },
      ],
      Education: [
        {
          name: "Enrollment", faqs: [
            { question: "How do I enroll?", answer: "Click 'Enroll Now' on any course page, create an account, and complete payment." },
            { question: "Can I try before I buy?", answer: "Yes! Many courses offer free preview lessons and a 7-day money-back guarantee." },
            { question: "Are there prerequisites?", answer: "Prerequisites vary by course. Each course page lists required skills." },
          ]
        },
        {
          name: "Learning Experience", faqs: [
            { question: "How long do I have access?", answer: "Lifetime access! Revisit materials anytime including future updates." },
            { question: "Do you offer certificates?", answer: "Yes, all completed programs include an industry-recognized certificate." },
            { question: "Is there instructor support?", answer: "Yes, ask questions in forums and attend live office hours." },
          ]
        },
      ],
      default: [
        {
          name: "Orders & Shipping", faqs: [
            { question: "How long does shipping take?", answer: "Standard: 3-7 business days. Express: 1-2 business days." },
            { question: "Do you ship internationally?", answer: "Yes, to over 50 countries. Rates calculated at checkout." },
            { question: "How can I track my order?", answer: "You'll receive a tracking number via email once shipped." },
          ]
        },
        {
          name: "Returns & Exchanges", faqs: [
            { question: "What is your return policy?", answer: "30-day return policy on all items in original condition." },
            { question: "How do I start a return?", answer: "Log into your account, go to Order History, click 'Return Item'." },
            { question: "When will I receive my refund?", answer: "Refunds processed within 3-5 business days of receiving the return." },
          ]
        },
        {
          name: "Products & Care", faqs: [
            { question: "How do I find my size?", answer: "Each product page includes a detailed size guide." },
            { question: "Are your products sustainable?", answer: "Many products use organic, recycled, or responsibly sourced materials." },
            { question: "How should I care for my products?", answer: "Care instructions are included on each product label and page." },
          ]
        },
        {
          name: "Account & Payment", faqs: [
            { question: "What payment methods do you accept?", answer: "All major credit/debit cards, PayPal, Apple Pay, Google Pay." },
            { question: "Do I need an account to order?", answer: "No, you can checkout as a guest." },
            { question: "Is my payment information secure?", answer: "Yes, we use SSL encryption and are PCI DSS compliant." },
          ]
        },
      ],
    };
    const faqCategories = faqCategoriesMap[ctx.industry] || faqCategoriesMap["default"];
    return [
      { id: uuidv4(), component: "PageHero", order: 1, props: { title: "Frequently Asked Questions", subtitle: `Find answers to common questions about ${ctx.businessName}` } },
      { id: uuidv4(), component: "FAQAccordion", order: 2, props: { categories: faqCategories, contactLink: "/contact", contactText: "Still have questions? Contact us" } },
    ];
  }

  private _buildTrackOrderSections(_ctx: { businessName: string }): ISection[] {
    return [
      { id: uuidv4(), component: "PageHero", order: 1, props: { title: "Track Your Order", subtitle: "Enter your order details to check the status" } },
      {
        id: uuidv4(), component: "OrderTracking", order: 2, props: {
          formFields: [
            { name: "orderNumber", label: "Order Number", type: "text", placeholder: "e.g., ORD-12345", required: true },
            { name: "email", label: "Email Address", type: "email", placeholder: "your@email.com", required: true },
          ],
          submitText: "Track Order",
          sampleOrder: {
            orderNumber: "ORD-12345", status: "shipped", estimatedDelivery: "January 20, 2026",
            steps: [
              { label: "Order Placed", date: "January 12, 2026", completed: true },
              { label: "Processing", date: "January 13, 2026", completed: true },
              { label: "Shipped", date: "January 14, 2026", completed: true, current: true },
              { label: "Out for Delivery", date: "January 19, 2026", completed: false },
              { label: "Delivered", date: "Estimated Jan 20, 2026", completed: false },
            ],
            carrier: "FedEx", trackingNumber: "FX9876543210",
          },
        },
      },
    ];
  }

  private _buildWishlistSections(ctx: { symbol: string; products: Array<{ name: string; price: number; description: string; category: string }>; imagePaths: string[] }): ISection[] {
    return [
      { id: uuidv4(), component: "PageHero", order: 1, props: { title: "My Wishlist", subtitle: "Your saved items" } },
      {
        id: uuidv4(), component: "WishlistGrid", order: 2, props: {
          products: ctx.products.slice(0, 4).map((p) => ({ id: uuidv4(), name: p.name, price: `${ctx.symbol}${p.price.toFixed(2)}`, image: ctx.imagePaths[0] || null, slug: p.name.toLowerCase().replace(/\s+/g, "-"), inStock: true, addedDate: "2026-01-10" })),
          emptyState: { title: "Your wishlist is empty", message: "Browse our collection and save items you love.", ctaText: "Start Shopping", ctaLink: "/shop" },
        },
      },
    ];
  }

  private _buildCartSections(ctx: { businessName: string; symbol: string; products: Array<{ name: string; price: number; description: string; category: string }>; imagePaths: string[]; shippingOptions: string[] }): ISection[] {
    return [
      { id: uuidv4(), component: "PageHero", order: 1, props: { title: "Shopping Cart", subtitle: "Review your items before checkout" } },
      {
        id: uuidv4(), component: "CartItems", order: 2, props: {
          items: ctx.products.slice(0, 3).map((p) => ({ id: uuidv4(), name: p.name, price: `${ctx.symbol}${p.price.toFixed(2)}`, quantity: Math.floor(Math.random() * 3) + 1, image: ctx.imagePaths[0] || null, slug: p.name.toLowerCase().replace(/\s+/g, "-"), color: "Midnight Blue", size: "M", maxQuantity: 10 })),
          emptyState: { title: "Your cart is empty", message: "Looks like you haven't added anything yet.", ctaText: "Continue Shopping", ctaLink: "/shop" },
        },
      },
      {
        id: uuidv4(), component: "CartSummary", order: 3, props: {
          subtotal: `${ctx.symbol}299.97`, shipping: ctx.shippingOptions.includes("free") ? "Free" : `${ctx.symbol}9.99`,
          tax: `${ctx.symbol}24.00`, total: `${ctx.symbol}333.96`,
          couponCode: { placeholder: "Enter coupon code", buttonText: "Apply" },
          checkoutLink: "/checkout", continueShoppingLink: "/shop",
          shippingOptions: ctx.shippingOptions.map((opt) => ({ label: opt.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), value: opt })),
        },
      },
    ];
  }

  private _buildCheckoutSections(ctx: { businessName: string; symbol: string; paymentMethods: string[]; shippingOptions: string[]; features: string[] }): ISection[] {
    const paymentLabels: Record<string, string> = { credit_debit: "Credit / Debit Card", upi: "UPI", paypal: "PayPal", stripe: "Stripe", razorpay: "Razorpay", cod: "Cash on Delivery", bank_transfer: "Bank Transfer" };
    return [
      { id: uuidv4(), component: "PageHero", order: 1, props: { title: "Checkout", subtitle: "Complete your order" } },
      {
        id: uuidv4(), component: "CheckoutForm", order: 2, props: {
          steps: [{ id: "shipping", label: "Shipping", icon: "truck" }, { id: "payment", label: "Payment", icon: "credit-card" }, { id: "review", label: "Review", icon: "check-circle" }],
          shippingForm: {
            fields: [
              { name: "email", label: "Email Address", type: "email", required: true, halfWidth: false },
              { name: "firstName", label: "First Name", type: "text", required: true, halfWidth: true },
              { name: "lastName", label: "Last Name", type: "text", required: true, halfWidth: true },
              { name: "address", label: "Street Address", type: "text", required: true, halfWidth: false },
              { name: "city", label: "City", type: "text", required: true, halfWidth: true },
              { name: "state", label: "State / Province", type: "text", required: true, halfWidth: true },
              { name: "zip", label: "ZIP / Postal Code", type: "text", required: true, halfWidth: true },
              { name: "country", label: "Country", type: "select", required: true, halfWidth: true, options: ["United States", "Canada", "United Kingdom", "Australia", "India"] },
              { name: "phone", label: "Phone Number", type: "tel", required: true, halfWidth: false },
            ],
          },
          paymentMethods: ctx.paymentMethods.map((m) => ({ id: m, label: paymentLabels[m] || m, icon: m })),
          shippingMethods: ctx.shippingOptions.map((opt) => ({ id: opt, label: opt.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), price: opt === "free" ? "Free" : `${ctx.symbol}9.99`, estimatedDays: opt === "free" ? "5-7 business days" : "2-3 business days" })),
          orderSummary: { items: [{ name: "Product 1", quantity: 1, price: `${ctx.symbol}49.99` }, { name: "Product 2", quantity: 2, price: `${ctx.symbol}119.98` }], subtotal: `${ctx.symbol}169.97`, shipping: `${ctx.symbol}9.99`, tax: `${ctx.symbol}13.60`, total: `${ctx.symbol}193.56` },
          hasCoupon: ctx.features.includes("coupon_system"), hasGiftCards: ctx.features.includes("gift_cards"), secureCheckout: true, placeOrderText: "Place Order",
        },
      },
    ];
  }

  private _buildLegalSections(ctx: { businessName: string }, title: string): ISection[] {
    const contentMap: Record<string, string> = {
      "Privacy Policy": `# Privacy Policy\n\n**Last Updated:** January 1, 2026\n\n## 1. Introduction\n\nWelcome to ${ctx.businessName}. We are committed to protecting your personal information and your right to privacy.\n\n## 2. Information We Collect\n\nWe may collect personal information including name, contact details, payment information, and usage data.\n\n## 3. How We Use Your Information\n\nWe use your information to process orders, communicate with you, personalize your experience, and improve our services.\n\n## 4. Data Security\n\nWe implement industry-standard security measures including SSL encryption and secure servers.\n\n## 5. Contact Us\n\nFor privacy-related inquiries, contact us at privacy@${ctx.businessName.toLowerCase().replace(/\s+/g, "")}.com`,
      "Terms & Conditions": `# Terms & Conditions\n\n**Last Updated:** January 1, 2026\n\n## 1. Acceptance of Terms\n\nBy using ${ctx.businessName} services, you agree to these terms.\n\n## 2. Products and Services\n\nAll product descriptions, images, and prices are subject to change without notice.\n\n## 3. Returns and Refunds\n\nReturns must be initiated within 30 days. Items must be in original condition.\n\n## 4. Contact\n\nFor questions, contact legal@${ctx.businessName.toLowerCase().replace(/\s+/g, "")}.com`,
      "Refund Policy": `# Refund Policy\n\n**Last Updated:** January 1, 2026\n\n## 1. Overview\n\nAt ${ctx.businessName}, your satisfaction is our priority.\n\n## 2. Return Eligibility\n\nItems must be unused, in original packaging, within 30 days of delivery.\n\n## 3. Refund Timeline\n\nRefunds are processed within 3-5 business days.\n\n## 4. Contact Us\n\nFor refund questions, contact support@${ctx.businessName.toLowerCase().replace(/\s+/g, "")}.com`,
    };
    return [
      { id: uuidv4(), component: "PageHero", order: 1, props: { title, subtitle: ctx.businessName + " " + title.toLowerCase() } },
      { id: uuidv4(), component: "LegalContent", order: 2, props: { content: contentMap[title] || "# " + title + "\n\nContent coming soon.", lastUpdated: "January 1, 2026" } },
    ];
  }

  private _buildMenuSections(ctx: { businessName: string; symbol: string; products: Array<{ name: string; price: number; description: string; category: string }>; config: BusinessTypeConfig; imagePaths: string[] }): ISection[] {
    return [
      { id: uuidv4(), component: "PageHero", order: 1, props: { title: "Our Menu", subtitle: "Explore our delicious offerings", backgroundImage: ctx.imagePaths[0] || null } },
      { id: uuidv4(), component: "CategoryGrid", order: 2, props: { categories: ctx.config.categories.map((cat) => ({ id: uuidv4(), name: cat.name, description: cat.description, image: ctx.imagePaths[0] || null, count: cat.productCount, slug: cat.name.toLowerCase().replace(/\s+/g, "-") })) } },
      {
        id: uuidv4(), component: "MenuHighlights", order: 3, props: {
          title: "Featured Dishes", subtitle: "Chef's recommendations",
          items: ctx.products.slice(0, 8).map((p) => ({ name: p.name, price: p.price.toFixed(2), description: p.description, image: ctx.imagePaths[0] || null, badge: p.category })),
        },
      },
    ];
  }

  private _buildReservationsSections(ctx: { businessName: string }): ISection[] {
    return [
      { id: uuidv4(), component: "PageHero", order: 1, props: { title: "Reservations", subtitle: "Book your table at " + ctx.businessName } },
      {
        id: uuidv4(), component: "ReservationForm", order: 2, props: {
          title: "Reserve a Table",
          submitText: "Request Reservation",
        },
      },
    ];
  }

  private _buildServicesSections(ctx: { businessName: string; industry: string; config: BusinessTypeConfig; symbol: string; products: Array<{ name: string; price: number; description: string; category: string; rating: number; reviewCount: number }>; imagePaths: string[] }): ISection[] {
    return [
      { id: uuidv4(), component: "PageHero", order: 1, props: { title: "Our Services", subtitle: `Professional services from ${ctx.businessName}`, backgroundImage: ctx.imagePaths[0] || null } },
      {
        id: uuidv4(), component: "Services", order: 2, props: {
          title: "What We Offer", subtitle: "Quality services you can trust",
          services: ctx.products.slice(0, 6).map((p) => ({ name: p.name, title: p.name, price: p.price.toFixed(2), description: p.description, icon: "✦" })),
        },
      },
      {
        id: uuidv4(), component: "CTABanner", order: 3, props: {
          headline: "Ready to Get Started?",
          subheadline: "Contact us today for a free consultation",
          ctaText: "Contact Us",
          ctaLink: "/contact",
        },
      },
    ];
  }

  private _buildBookAppointmentSections(ctx: { businessName: string }): ISection[] {
    return [
      { id: uuidv4(), component: "PageHero", order: 1, props: { title: "Book an Appointment", subtitle: "Schedule your visit with our team" } },
      {
        id: uuidv4(), component: "AppointmentBooking", order: 2, props: {
          title: "Request an Appointment",
          submitText: "Request Appointment",
        },
      },
    ];
  }

  private _buildPropertiesSections(ctx: { businessName: string; symbol: string; products: Array<{ name: string; price: number; description: string; category: string; rating: number; reviewCount: number; badge?: string }>; config: BusinessTypeConfig; imagePaths: string[] }): ISection[] {
    return [
      { id: uuidv4(), component: "PageHero", order: 1, props: { title: "Properties", subtitle: "Browse our available properties", backgroundImage: ctx.imagePaths[0] || null } },
      {
        id: uuidv4(), component: "PropertySearch", order: 2, props: {
          title: "Search Properties",
        },
      },
      {
        id: uuidv4(), component: "PropertyGrid", order: 3, props: {
          title: "Available Properties", subtitle: "Find your dream home",
          properties: ctx.products.slice(0, 6).map((p) => ({
            title: p.name, price: p.price.toLocaleString(),
            description: p.description, image: ctx.imagePaths[0] || null,
            badge: p.badge, type: p.category,
            beds: Math.floor(Math.random() * 4) + 1,
            baths: Math.floor(Math.random() * 3) + 1,
            sqft: Math.floor(Math.random() * 2000) + 800,
            address: "123 Main St, City, State",
          })),
        },
      },
    ];
  }

  private _buildListingsSections(ctx: { businessName: string; symbol: string; products: Array<{ name: string; price: number; description: string; category: string; rating: number; reviewCount: number; badge?: string }>; config: BusinessTypeConfig; imagePaths: string[] }): ISection[] {
    return this._buildPropertiesSections(ctx);
  }

  private _buildCoursesSections(ctx: { businessName: string; symbol: string; products: Array<{ name: string; price: number; originalPrice?: number; description: string; category: string; rating: number; reviewCount: number; badge?: string }>; config: BusinessTypeConfig; imagePaths: string[] }): ISection[] {
    return [
      { id: uuidv4(), component: "PageHero", order: 1, props: { title: "Courses", subtitle: "Explore our programs and courses", backgroundImage: ctx.imagePaths[0] || null } },
      {
        id: uuidv4(), component: "CourseGrid", order: 2, props: {
          courses: ctx.products.map((p) => ({ id: uuidv4(), title: p.name, price: `${ctx.symbol}${p.price.toFixed(2)}`, description: p.description, image: ctx.imagePaths[0] || null, slug: p.name.toLowerCase().replace(/\s+/g, "-"), category: p.category, rating: p.rating, duration: "8 weeks", level: "Intermediate" })),
        },
      },
    ];
  }

  private _buildAdmissionsSections(ctx: { businessName: string }): ISection[] {
    return [
      { id: uuidv4(), component: "PageHero", order: 1, props: { title: "Admissions", subtitle: "Start your learning journey with " + ctx.businessName } },
      {
        id: uuidv4(), component: "ContactForm", order: 2, props: {
          title: "Apply Now",
          fields: [
            { name: "name", label: "Full Name", type: "text", required: true },
            { name: "email", label: "Email Address", type: "email", required: true },
            { name: "phone", label: "Phone Number", type: "tel", required: true },
            { name: "program", label: "Program of Interest", type: "select", required: true, options: ["Web Development", "Data Science", "UX Design", "Digital Marketing"] },
            { name: "experience", label: "Experience Level", type: "select", required: true, options: ["Beginner", "Intermediate", "Advanced", "Professional"] },
            { name: "goals", label: "Career Goals", type: "textarea", required: false },
            { name: "start_date", label: "Preferred Start Date", type: "date", required: true },
          ],
          submitText: "Submit Application",
        },
      },
    ];
  }

  private _buildDestinationsSections(ctx: { businessName: string; symbol: string; products: Array<{ name: string; price: number; description: string; category: string; rating: number; reviewCount: number; badge?: string }>; config: BusinessTypeConfig; imagePaths: string[] }): ISection[] {
    return [
      { id: uuidv4(), component: "PageHero", order: 1, props: { title: "Destinations", subtitle: "Explore our top travel destinations", backgroundImage: ctx.imagePaths[0] || null } },
      {
        id: uuidv4(), component: "DestinationGrid", order: 2, props: {
          destinations: ctx.products.map((p) => ({ id: uuidv4(), name: p.name, price: `${ctx.symbol}${p.price.toFixed(2)}`, description: p.description, image: ctx.imagePaths[0] || null, slug: p.name.toLowerCase().replace(/\s+/g, "-"), category: p.category, rating: p.rating })),
        },
      },
    ];
  }

  private _buildItinerariesSections(ctx: { businessName: string; symbol: string; products: Array<{ name: string; price: number; description: string; category: string; rating: number; reviewCount: number; badge?: string }>; imagePaths: string[] }): ISection[] {
    return [
      { id: uuidv4(), component: "PageHero", order: 1, props: { title: "Itineraries", subtitle: "Curated travel itineraries for every adventurer", backgroundImage: ctx.imagePaths[0] || null } },
      {
        id: uuidv4(), component: "PackageGrid", order: 2, props: {
          packages: ctx.products.slice(0, 6).map((p) => ({ id: uuidv4(), title: p.name, price: `${ctx.symbol}${p.price.toLocaleString()}`, description: p.description, image: ctx.imagePaths[0] || null, slug: p.name.toLowerCase().replace(/\s+/g, "-"), category: p.category, rating: p.rating, duration: "7 days", badge: p.badge })),
        },
      },
    ];
  }

  private _buildNavigation(selectedPages: string[], hasCategories: boolean, config: BusinessTypeConfig): Array<{ label: string; href: string; children?: Array<{ label: string; href: string }> }> {
    const navMap: Record<string, { label: string; href: string }> = {
      home: { label: "Home", href: "/" }, shop: { label: "Shop", href: "/shop" },
      categories: { label: "Categories", href: "/categories" }, about: { label: "About", href: "/about" },
      about_us: { label: "About Us", href: "/about" },
      blog: { label: "Blog", href: "/blog" }, contact: { label: "Contact", href: "/contact" },
      contact_us: { label: "Contact Us", href: "/contact" },
      menu: { label: "Menu", href: "/menu" }, reservations: { label: "Reservations", href: "/reservations" },
      services: { label: "Services", href: "/services" }, book_appointment: { label: "Book Appointment", href: "/book-appointment" },
      properties: { label: "Properties", href: "/properties" }, listings: { label: "Listings", href: "/listings" },
      courses: { label: "Courses", href: "/courses" }, admissions: { label: "Admissions", href: "/admissions" },
      destinations: { label: "Destinations", href: "/destinations" }, itineraries: { label: "Itineraries", href: "/itineraries" },
      faq: { label: "FAQ", href: "/faq" }, track_order: { label: "Track Order", href: "/track-order" },
      privacy_policy: { label: "Privacy Policy", href: "/privacy-policy" },
      terms_conditions: { label: "Terms & Conditions", href: "/terms-conditions" },
      refund_policy: { label: "Refund Policy", href: "/refund-policy" },
    };
    const navItems: Array<{ label: string; href: string; children?: Array<{ label: string; href: string }> }> = [];
    // Build nav from ALL selected pages, keeping the order user chose
    for (const slug of selectedPages) {
      if (slug === "home") continue; // Home is implicit
      const item = navMap[slug];
      if (item) {
        if ((slug === "shop" || slug === "menu") && hasCategories) {
          navItems.push({ ...item, children: config.categories.slice(0, 5).map((cat) => ({ label: cat.name, href: `/${slug === "menu" ? "menu" : "shop"}?category=${cat.name.toLowerCase().replace(/\s+/g, "-")}` })) });
        } else {
          navItems.push(item);
        }
      }
    }
    return navItems;
  }

  private _buildFooterLinks(selectedPages: string[]): Array<{ label: string; href: string }> {
    const links: Array<{ label: string; href: string }> = [];
    const linkMap: Record<string, { label: string; href: string }> = {
      about: { label: "About Us", href: "/about" }, about_us: { label: "About Us", href: "/about" },
      contact: { label: "Contact", href: "/contact" }, contact_us: { label: "Contact Us", href: "/contact" },
      blog: { label: "Blog", href: "/blog" }, faq: { label: "FAQ", href: "/faq" },
      shop: { label: "Shop", href: "/shop" }, categories: { label: "Categories", href: "/categories" },
      menu: { label: "Menu", href: "/menu" }, reservations: { label: "Reservations", href: "/reservations" },
      services: { label: "Services", href: "/services" }, courses: { label: "Courses", href: "/courses" },
      properties: { label: "Properties", href: "/properties" }, destinations: { label: "Destinations", href: "/destinations" },
      privacy_policy: { label: "Privacy Policy", href: "/privacy-policy" },
      terms_conditions: { label: "Terms & Conditions", href: "/terms-conditions" },
      refund_policy: { label: "Refund Policy", href: "/refund-policy" },
      track_order: { label: "Track Order", href: "/track-order" },
    };
    // Add all selected pages as footer links
    for (const slug of selectedPages) {
      if (slug === "home") continue;
      if (linkMap[slug]) {
        // Avoid duplicates
        if (!links.find((l) => l.href === linkMap[slug].href)) {
          links.push(linkMap[slug]);
        }
      }
    }
    return links;
  }
}

export default MockAIProvider;