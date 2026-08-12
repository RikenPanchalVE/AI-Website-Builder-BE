import AIProvider from "./AIProvider";
import { BUSINESS_TYPES, BusinessTypeConfig } from "./businessTypes";

/* -------------------------------------------------------------------------- */
/*                              Constants                                      */
/* -------------------------------------------------------------------------- */

const TESTIMONIALS: Record<string, Array<{ name: string; role: string; content: string; rating: number }>> = {
  Restaurant: [
    { name: "Sarah M.", role: "Food Blogger", content: "Absolutely incredible dining experience. The chef's tasting menu was a journey through flavors I never knew existed.", rating: 5 },
    { name: "James L.", role: "Regular Customer", content: "Best restaurant in town. The ambiance is perfect for date nights and the staff always makes us feel welcome.", rating: 5 },
    { name: "Emily R.", role: "Event Planner", content: "I've hosted multiple events here and every single one was flawless. The catering team is exceptional.", rating: 5 },
  ],
  Healthcare: [
    { name: "Michael T.", role: "Patient", content: "Dr. Smith and the entire team made me feel so comfortable during my procedure. Truly caring professionals.", rating: 5 },
    { name: "Linda K.", role: "Patient", content: "Quick appointments, thorough examinations, and the online portal makes managing my health so easy.", rating: 5 },
    { name: "Robert H.", role: "Patient", content: "The best healthcare experience I've ever had. They take the time to explain everything clearly.", rating: 5 },
  ],
  Education: [
    { name: "Alex P.", role: "Student", content: "The courses are well-structured and the instructors are industry experts. Landing my dream job after completing the program.", rating: 5 },
    { name: "Maria S.", role: "Parent", content: "My son's grades improved dramatically after enrolling. The personalized attention makes all the difference.", rating: 5 },
    { name: "David W.", role: "Professional", content: "The certification program helped me advance my career significantly. Worth every penny invested.", rating: 5 },
  ],
  Beauty: [
    { name: "Jessica L.", role: "Loyal Client", content: "I've been coming here for years and they never disappoint. My hair has never looked better! The stylists truly listen to what you want.", rating: 5 },
    { name: "Amanda R.", role: "Bride", content: "My bridal makeup was absolutely flawless. Everyone at the wedding asked who did my makeup. Best beauty salon experience!", rating: 5 },
    { name: "Sophia M.", role: "Regular Client", content: "The facials here are transformative. My skin has never been so clear and glowing. The staff is incredibly knowledgeable about skincare.", rating: 5 },
  ],
  default: [
    { name: "John D.", role: "Customer", content: "Outstanding service and quality. Highly recommend to anyone looking for a reliable partner.", rating: 5 },
    { name: "Sarah K.", role: "Client", content: "Professional, responsive, and delivered beyond our expectations. Will definitely work with them again.", rating: 5 },
    { name: "Mike R.", role: "Business Owner", content: "They understood our vision perfectly and brought it to life. Exceptional attention to detail.", rating: 5 },
  ],
};

const FAQ_DATA: Record<string, Array<{ question: string; answer: string }>> = {
  Restaurant: [
    { question: "Do you take reservations?", answer: "Yes, we accept reservations for parties of all sizes. You can book online or call us directly." },
    { question: "Do you offer vegetarian/vegan options?", answer: "Absolutely! We have a dedicated section on our menu for vegetarian and vegan dishes." },
    { question: "Is parking available?", answer: "We have a private parking lot with complimentary valet service on weekends." },
  ],
  Healthcare: [
    { question: "Do you accept insurance?", answer: "We accept most major insurance plans. Please contact our office for a complete list of accepted providers." },
    { question: "How do I schedule an appointment?", answer: "You can schedule online through our patient portal or call our office during business hours." },
    { question: "What are your office hours?", answer: "We're open Monday-Friday 8am-6pm and Saturday 9am-1pm for urgent care." },
  ],
  Education: [
    { question: "What certifications do you offer?", answer: "We offer industry-recognized certifications in technology, business, healthcare, and creative fields." },
    { question: "Are courses available online?", answer: "Yes, we offer both online and in-person learning options for maximum flexibility." },
    { question: "Do you provide job placement assistance?", answer: "Yes, our career services team provides resume building, interview prep, and job placement support." },
  ],
  Beauty: [
    { question: "Do I need an appointment?", answer: "We highly recommend booking an appointment to ensure availability. Walk-ins are welcome but subject to availability." },
    { question: "What hair services do you offer?", answer: "We offer cuts, color, highlights, balayage, extensions, keratin treatments, bridal styling, and more." },
    { question: "Do you offer skincare treatments?", answer: "Yes! Our skincare menu includes facials, chemical peels, microdermabrasion, and anti-aging treatments." },
  ],
  default: [
    { question: "How can I get started?", answer: "Simply reach out to us through our contact form or give us a call. We'll schedule a consultation to discuss your needs." },
    { question: "What are your business hours?", answer: "We're open Monday through Friday from 9 AM to 6 PM. Weekend appointments are available upon request." },
    { question: "Do you offer a free consultation?", answer: "Yes, we offer a complimentary initial consultation to understand your requirements and how we can help." },
  ],
};

const SERVICES_DATA: Record<string, Array<{ title: string; description: string; icon: string }>> = {
  Restaurant: [
    { title: "Dine-In Experience", description: "Enjoy our chef-curated menu in an elegant dining atmosphere with impeccable service.", icon: "utensils" },
    { title: "Private Events", description: "Host unforgettable events with our customizable private dining and catering packages.", icon: "calendar" },
    { title: "Chef's Table", description: "An exclusive behind-the-scenes experience with our head chef and wine pairing.", icon: "star" },
  ],
  Healthcare: [
    { title: "Primary Care", description: "Comprehensive health assessments, preventive care, and chronic disease management.", icon: "heart-pulse" },
    { title: "Specialist Referrals", description: "Access to our network of specialist physicians for advanced medical needs.", icon: "stethoscope" },
    { title: "Telehealth", description: "Virtual consultations from the comfort of your home with our experienced physicians.", icon: "video" },
  ],
  Education: [
    { title: "Online Courses", description: "Self-paced learning with video lectures, assignments, and peer collaboration.", icon: "book-open" },
    { title: "Certification Programs", description: "Industry-recognized certifications to advance your career and validate your skills.", icon: "award" },
    { title: "Workshops", description: "Hands-on intensive workshops led by industry professionals and subject matter experts.", icon: "users" },
  ],
  Beauty: [
    { title: "Hair Styling", description: "Expert cuts, color, blowouts, and styling for every occasion. From classic to contemporary looks.", icon: "scissors" },
    { title: "Facials & Skincare", description: "Customized facials, peels, and skincare treatments for radiant, healthy-looking skin.", icon: "sparkles" },
    { title: "Manicure & Pedicure", description: "Luxurious nail care services including gel, acrylics, and spa pedicures.", icon: "hand" },
    { title: "Bridal Makeup", description: "Flawless bridal beauty packages for your special day including trial sessions.", icon: "heart" },
  ],
  default: [
    { title: "Consultation", description: "Expert guidance tailored to your specific needs and goals.", icon: "message-circle" },
    { title: "Custom Solutions", description: "Bespoke services designed to deliver measurable results.", icon: "settings" },
    { title: "Ongoing Support", description: "Continuous partnership to ensure long-term success and satisfaction.", icon: "headphones" },
  ],
};

/* -------------------------------------------------------------------------- */
/*                       Design Style Defaults                                */
/* -------------------------------------------------------------------------- */

const DESIGN_STYLE_DEFAULTS: Record<string, Record<string, string>> = {
  minimal: { hero: "Hero1", services: "Services1", portfolio: "Portfolio1", testimonials: "Testimonials1", pricing: "Pricing1", faq: "FAQ1", cta: "CTA1", contact: "Contact1", gallery: "Gallery1", blog: "BlogPreview" },
  modern: { hero: "Hero2", services: "Services2", portfolio: "Portfolio2", testimonials: "Testimonials2", pricing: "Pricing2", faq: "FAQ2", cta: "CTA2", contact: "Contact2", gallery: "Gallery2", blog: "BlogPreview" },
  premium: { hero: "Hero3", services: "Services3", portfolio: "Portfolio3", testimonials: "Testimonials3", pricing: "Pricing1", faq: "FAQ1", cta: "CTA1", contact: "Contact1", gallery: "Gallery1", blog: "BlogPreview" },
  corporate: { hero: "Hero2", services: "Services2", portfolio: "Portfolio2", testimonials: "Testimonials2", pricing: "Pricing2", faq: "FAQ2", cta: "CTA2", contact: "Contact2", gallery: "Gallery1", blog: "BlogPreview" },
  creative: { hero: "Hero4", services: "Services3", portfolio: "Portfolio3", testimonials: "Testimonials3", pricing: "Pricing1", faq: "FAQ1", cta: "CTA1", contact: "Contact1", gallery: "Gallery2", blog: "BlogPreview" },
  luxury: { hero: "Hero5", services: "Services4", portfolio: "Portfolio3", testimonials: "Testimonials3", pricing: "Pricing1", faq: "FAQ1", cta: "CTA1", contact: "Contact1", gallery: "Gallery2", blog: "BlogPreview" },
  friendly: { hero: "Hero1", services: "Services1", portfolio: "Portfolio1", testimonials: "Testimonials1", pricing: "Pricing2", faq: "FAQ2", cta: "CTA2", contact: "Contact2", gallery: "Gallery1", blog: "BlogPreview" },
  professional: { hero: "Hero2", services: "Services2", portfolio: "Portfolio2", testimonials: "Testimonials2", pricing: "Pricing2", faq: "FAQ2", cta: "CTA2", contact: "Contact2", gallery: "Gallery1", blog: "BlogPreview" },
  bold: { hero: "Hero4", services: "Services3", portfolio: "Portfolio3", testimonials: "Testimonials1", pricing: "Pricing1", faq: "FAQ1", cta: "CTA1", contact: "Contact1", gallery: "Gallery2", blog: "BlogPreview" },
  elegant: { hero: "Hero5", services: "Services4", portfolio: "Portfolio3", testimonials: "Testimonials3", pricing: "Pricing1", faq: "FAQ1", cta: "CTA1", contact: "Contact1", gallery: "Gallery2", blog: "BlogPreview" },
  tech: { hero: "Hero3", services: "Services2", portfolio: "Portfolio2", testimonials: "Testimonials2", pricing: "Pricing2", faq: "FAQ2", cta: "CTA2", contact: "Contact2", gallery: "Gallery1", blog: "BlogPreview" },
  editorial: { hero: "Hero5", services: "Services4", portfolio: "Portfolio3", testimonials: "Testimonials3", pricing: "Pricing1", faq: "FAQ1", cta: "CTA1", contact: "Contact1", gallery: "Gallery2", blog: "BlogPreview" },
};

/* -------------------------------------------------------------------------- */
/*                       Component Map & Resolver                             */
/* -------------------------------------------------------------------------- */

const COMPONENT_MAP: Record<string, string> = {
  hero1: "Hero1", hero2: "Hero2", hero3: "Hero3", hero4: "Hero4", hero5: "Hero5",
  services1: "Services1", services2: "Services2", services3: "Services3", services4: "Services4",
  portfolio1: "Portfolio1", portfolio2: "Portfolio2", portfolio3: "Portfolio3",
  testimonials1: "Testimonials1", testimonials2: "Testimonials2", testimonials3: "Testimonials3",
  pricing1: "Pricing1", pricing2: "Pricing2",
  faq1: "FAQ1", faq2: "FAQ2",
  cta1: "CTA1", cta2: "CTA2",
  contact1: "Contact1", contact2: "Contact2",
  gallery1: "Gallery1", gallery2: "Gallery2",
};

function resolveComponent(
  selections: Record<string, string>,
  category: string,
  fallback: string,
  themeStyle?: string
): string {
  const selected = selections[category];
  if (selected) {
    return COMPONENT_MAP[selected] || selected;
  }
  if (themeStyle) {
    const styleKey = themeStyle.toLowerCase();
    const defaults = DESIGN_STYLE_DEFAULTS[styleKey];
    if (defaults && defaults[category]) {
      return defaults[category];
    }
  }
  return fallback;
}

/* -------------------------------------------------------------------------- */
/*                        Industry Content Maps                               */
/* -------------------------------------------------------------------------- */

const HERO_CONTENT: Record<string, { headline: string; subheadline: string; ctaText: string; badge: string }> = {
  Restaurant: { headline: "Welcome to {name}", subheadline: "Experience authentic flavors crafted with passion by our award-winning chef", ctaText: "View Our Menu", badge: "Chef's Special This Week" },
  Healthcare: { headline: "Your Health, Our Priority", subheadline: "Comprehensive healthcare services with compassionate care", ctaText: "Book Appointment", badge: "Accepting New Patients" },
  Education: { headline: "Unlock Your Potential", subheadline: "World-class courses and certifications to advance your career", ctaText: "Explore Courses", badge: "Enrollment Open" },
  "Real Estate": { headline: "Find Your Dream Home", subheadline: "Premium properties and expert guidance for your real estate journey", ctaText: "Browse Properties", badge: "New Listings" },
  Travel: { headline: "Explore the World with {name}", subheadline: "Curated travel experiences and exclusive vacation packages", ctaText: "Plan Your Trip", badge: "Deals Available" },
  Automotive: { headline: "Drive Your Dream", subheadline: "New and certified pre-owned vehicles with flexible financing", ctaText: "Browse Inventory", badge: "Special Offers" },
  Beauty: { headline: "Discover Your Beauty", subheadline: "Expert hair, skin, and beauty services tailored just for you", ctaText: "Book Appointment", badge: "New Client Special" },
};

const ABOUT_TITLE: Record<string, string> = {
  Restaurant: "Our Story",
  Healthcare: "About Our Practice",
  Education: "About Our Institution",
  "Real Estate": "About Our Agency",
  Travel: "About Us",
};

const BLOG_POSTS: Record<string, Array<{ title: string; excerpt: string; author: string; date: string; readTime: string }>> = {
  Restaurant: [
    { title: "Behind the Kitchen: A Day in Our Chef's Life", excerpt: "Get an exclusive look at how our award-winning dishes come to life.", author: "Chef Marco", date: "2026-01-15", readTime: "5 min read" },
    { title: "5 Wine Pairing Tips from Our Sommelier", excerpt: "Elevate your dining experience with these expert wine selection tips.", author: "Sarah Wilson", date: "2026-01-10", readTime: "4 min read" },
    { title: "Seasonal Ingredients: Why Fresh Matters", excerpt: "Learn about our commitment to locally-sourced, seasonal ingredients.", author: "Chef Marco", date: "2026-01-05", readTime: "3 min read" },
  ],
  Beauty: [
    { title: "Top 10 Hair Care Tips for Healthy Locks", excerpt: "Our expert stylists share their secrets for maintaining beautiful, healthy hair between salon visits.", author: "Lisa Chen", date: "2026-01-15", readTime: "5 min read" },
    { title: "The Ultimate Guide to Facials: What to Expect", excerpt: "Everything you need to know before your first facial treatment, from preparation to aftercare.", author: "Dr. Amara", date: "2026-01-10", readTime: "6 min read" },
    { title: "Bridal Beauty Timeline: When to Start Preparing", excerpt: "A month-by-month beauty preparation guide for brides-to-be.", author: "Lisa Chen", date: "2026-01-05", readTime: "4 min read" },
  ],
  Healthcare: [
    { title: "5 Signs You Should Schedule a Health Checkup", excerpt: "Don't wait for symptoms. Learn the key indicators that it's time for a comprehensive health screening.", author: "Dr. Smith", date: "2026-01-15", readTime: "4 min read" },
    { title: "The Benefits of Preventive Healthcare", excerpt: "How regular checkups and screenings can save you time, money, and improve your quality of life.", author: "Dr. Johnson", date: "2026-01-10", readTime: "5 min read" },
  ],
  Education: [
    { title: "How to Choose the Right Course for Your Career", excerpt: "A comprehensive guide to selecting courses that align with your career goals and learning style.", author: "Prof. Adams", date: "2026-01-15", readTime: "6 min read" },
    { title: "The Rise of Online Learning in 2026", excerpt: "Explore how digital education is transforming the way we learn and grow professionally.", author: "Dr. Lee", date: "2026-01-10", readTime: "4 min read" },
  ],
  default: [
    { title: "Industry Trends to Watch in 2026", excerpt: "Stay ahead of the curve with these emerging trends shaping the industry.", author: "Team", date: "2026-01-15", readTime: "5 min read" },
    { title: "How We Deliver Exceptional Results", excerpt: "A look at our process and commitment to quality that sets us apart.", author: "Team", date: "2026-01-10", readTime: "4 min read" },
  ],
};

const BEAUTY_SALON_SERVICES = [
  { title: "Hair Styling", description: "Expert cuts, color, blowouts, and styling for every occasion.", icon: "scissors" },
  { title: "Facials & Skincare", description: "Customized facials, peels, and treatments for radiant skin.", icon: "sparkles" },
  { title: "Manicure & Pedicure", description: "Luxurious nail care including gel, acrylics, and spa pedicures.", icon: "hand" },
  { title: "Bridal Makeup", description: "Flawless bridal beauty packages for your special day.", icon: "heart" },
  { title: "Hair Treatments", description: "Keratin, deep conditioning, and restorative hair therapies.", icon: "wind" },
  { title: "Waxing Services", description: "Professional waxing for smooth, hair-free skin.", icon: "flower" },
];

const BEAUTY_SALON_TESTIMONIALS = [
  { name: "Jessica L.", role: "Loyal Client", content: "I've been coming here for years and they never disappoint. My hair has never looked better!", rating: 5 },
  { name: "Amanda R.", role: "Bride", content: "My bridal makeup was absolutely flawless. Everyone at the wedding asked who did my makeup.", rating: 5 },
  { name: "Sophia M.", role: "Regular Client", content: "The facials here are transformative. My skin has never been so clear and glowing.", rating: 5 },
];

const BEAUTY_SALON_FAQ = [
  { question: "Do I need an appointment?", answer: "We highly recommend booking an appointment to ensure availability. Walk-ins are welcome but subject to availability." },
  { question: "What hair services do you offer?", answer: "We offer cuts, color, highlights, balayage, extensions, keratin treatments, bridal styling, and more." },
  { question: "Do you offer skincare treatments?", answer: "Yes! Our skincare menu includes facials, chemical peels, microdermabrasion, and anti-aging treatments." },
  { question: "How do I prepare for my appointment?", answer: "Come with clean hair for cuts, and avoid sun exposure 24 hours before facials. We'll handle the rest!" },
];

/* -------------------------------------------------------------------------- */
/*                          Helper Functions                                  */
/* -------------------------------------------------------------------------- */

function getIndustry(industry: string): string {
  const map: Record<string, string> = {
    Restaurant: "Restaurant",
    Healthcare: "Healthcare",
    Education: "Education",
    "Real Estate": "Real Estate",
    Travel: "Travel",
    Automotive: "Automotive",
    Beauty: "Beauty",
    Fashion: "Fashion",
    Electronics: "Electronics",
    Grocery: "Grocery",
    Furniture: "Furniture",
    Sports: "Sports",
    Jewelry: "Jewelry",
    Books: "Books",
    "Pet Store": "Pet Store",
    "Home Services": "Home Services",
    Other: "Other",
  };
  return map[industry] || industry || "Other";
}

function getAboutTitle(industry: string): string {
  return ABOUT_TITLE[industry] || "About Us";
}

function getTestimonials(industry: string): Array<{ name: string; role: string; content: string; rating: number }> {
  return TESTIMONIALS[industry] || TESTIMONIALS["default"];
}

function getFaq(industry: string): Array<{ question: string; answer: string }> {
  return FAQ_DATA[industry] || FAQ_DATA["default"];
}

function getServices(industry: string): Array<{ title: string; description: string; icon: string }> {
  return SERVICES_DATA[industry] || SERVICES_DATA["default"];
}

function getBlogPosts(industry: string): Array<{ title: string; excerpt: string; author: string; date: string; readTime: string }> {
  return BLOG_POSTS[industry] || BLOG_POSTS["default"];
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* -------------------------------------------------------------------------- */
/*                       MockAIProvider Class                                 */
/* -------------------------------------------------------------------------- */

class MockAIProvider extends AIProvider {

  async generateWebsiteSpec(
    questionnaire: Record<string, unknown>,
    assets: Record<string, unknown>[],
    projectId?: string
  ): Promise<Record<string, unknown>> {
    const answers = (questionnaire.answers as Record<string, any>) || {};
    const industry = getIndustry(answers.industry || "");
    const businessName = answers.businessName || "My Business";
    const businessDescription = answers.businessDescription || "";
    const themeStyle = answers.themeStyle || "modern";
    const primaryColor = answers.primaryColor || "#3B82F6";
    const secondaryColor = answers.secondaryColor || "#1E40AF";
    const fontStyle = answers.fontStyle || "";
    const logo = answers.logo || null;

    const selectedPages = answers.selectedPages || answers.pages || ["home"];
    const homepageSections = answers.homepageSections || [];
    const pageSections = answers.pageSections || {};
    const componentSelections = answers.componentSelections || {};
    const socialMedia = answers.socialMedia || {};

    const userServices = answers.services || [];
    const userTestimonials = answers.testimonials || [];
    const userFaq = answers.faq || [];

    const imagePaths = (assets || [])
      .filter((a: any) => a.type === "image" || a.mimeType?.startsWith("image/"))
      .map((a: any) => a.url || a.path || "");

    const config: BusinessTypeConfig = BUSINESS_TYPES[industry] || BUSINESS_TYPES["Other"];
    const colorScheme = config.colorSchemes[0];

    const pages: Array<Record<string, unknown>> = [];
    let sectionOrder = 0;

    for (const pageSlug of selectedPages) {
      const slug = typeof pageSlug === "string" ? pageSlug : (pageSlug as any).slug || "home";
      sectionOrder = 0;

      switch (slug) {
        case "home":
          pages.push({
            slug: "home",
            title: "Home",
            sections: this._buildHomePageSections({
              businessName, businessDescription, industry, config,
              logoPath: logo, imagePaths, homepageSections: pageSections["home"] || homepageSections, socialMedia,
              userServices, userTestimonials, userFaq,
              componentSelections, themeStyle,
            }),
          });
          break;
        case "about":
          pages.push({
            slug: "about",
            title: "About",
            sections: this._buildAboutSections({
              businessName, businessDescription, industry,
              logoPath: logo, imagePaths, componentSelections, themeStyle,
              pageSections: pageSections["about"] || [],
            }),
          });
          break;
        case "services":
        case "service_details":
          pages.push({
            slug,
            title: slug === "services" ? "Services" : "Service Details",
            sections: this._buildServicesSections({
              businessName, businessDescription, industry,
              userServices, componentSelections, themeStyle,
              pageSections: pageSections[slug] || [],
            }),
          });
          break;
        case "portfolio":
        case "portfolio_details":
          pages.push({
            slug,
            title: slug === "portfolio" ? "Portfolio" : "Portfolio Details",
            sections: this._buildPortfolioSections({
              businessName, industry, imagePaths, componentSelections, themeStyle,
            }),
          });
          break;
        case "pricing":
          pages.push({
            slug: "pricing",
            title: "Pricing",
            sections: this._buildPricingSections({
              businessName, industry, componentSelections, themeStyle,
            }),
          });
          break;
        case "blog":
        case "blog_details":
          pages.push({
            slug,
            title: slug === "blog" ? "Blog" : "Blog Details",
            sections: this._buildBlogSections({
              businessName, industry, componentSelections, themeStyle,
            }),
          });
          break;
        case "contact":
          pages.push({
            slug: "contact",
            title: "Contact",
            sections: this._buildContactSections({
              businessName, businessDescription, industry,
              componentSelections, themeStyle,
            }),
          });
          break;
        case "faq":
          pages.push({
            slug: "faq",
            title: "FAQ",
            sections: this._buildFaqSections({
              businessName, industry, userFaq, componentSelections, themeStyle,
            }),
          });
          break;
        case "testimonials":
          pages.push({
            slug: "testimonials",
            title: "Testimonials",
            sections: this._buildTestimonialsSections({
              businessName, industry, userTestimonials, componentSelections, themeStyle,
            }),
          });
          break;
        case "gallery":
          pages.push({
            slug: "gallery",
            title: "Gallery",
            sections: this._buildGallerySections({
              businessName, industry, imagePaths, componentSelections, themeStyle,
            }),
          });
          break;
        case "menu":
          pages.push({
            slug: "menu",
            title: "Menu",
            sections: this._buildMenuSections({
              businessName, industry, componentSelections, themeStyle,
            }),
          });
          break;
        case "reservations":
          pages.push({
            slug: "reservations",
            title: "Reservations",
            sections: this._buildReservationsSections({
              businessName, industry, componentSelections, themeStyle,
            }),
          });
          break;
        case "team":
          pages.push({
            slug: "team",
            title: "Team",
            sections: this._buildTeamSections({
              businessName, industry, componentSelections, themeStyle,
            }),
          });
          break;
        case "booking":
          pages.push({
            slug: "booking",
            title: "Booking",
            sections: this._buildBookingSections({
              businessName, industry, componentSelections, themeStyle,
            }),
          });
          break;
        default:
          pages.push({
            slug,
            title: capitalize(slug.replace(/_/g, " ")),
            sections: this._buildGenericSections({
              businessName, industry, componentSelections, themeStyle,
            }),
          });
          break;
      }
    }

    const footerComp = resolveComponent(componentSelections, "footer", "Footer2", themeStyle);
    const footerLinks = pages.map((p: any) => ({ label: p.title, href: `/${p.slug}` }));
    const footerSocialLinks = Object.entries(socialMedia).map(([platform, href]) => ({ platform, href }));
    for (const page of pages) {
      const p = page as any;
      p.sections.push({
        id: "footer",
        component: footerComp,
        props: {
          brandName: businessName,
          description: businessDescription || `${businessName} - Professional services`,
          links: footerLinks,
          socialLinks: footerSocialLinks,
        },
        order: p.sections.length + 1,
      });
    }

    const theme = this._buildTheme({
      primaryColor, secondaryColor, fontStyle, themeStyle, config,
    });

    const navItems = pages.map((p: any) => ({
      label: p.title,
      href: `/${p.slug}`,
      slug: p.slug,
    }));

    return {
      name: businessName,
      description: businessDescription,
      logo,
      pages,
      theme,
      navigation: { items: navItems },
      footer: {
        copyright: `© ${new Date().getFullYear()} ${businessName}. All rights reserved.`,
        links: navItems.map((n: any) => ({ label: n.label, href: n.href })),
        socialMedia,
      },
      seo: {
        title: businessName,
        description: businessDescription,
        keywords: [industry, businessName, "website"],
      },
    };
  }

  async processRevision(
    websiteSpec: Record<string, unknown>,
    revisionRequest: string
  ): Promise<Record<string, unknown>> {
    const spec = { ...websiteSpec };
    const version = ((spec.version as number) || 1) + 1;
    spec.version = version;

    const pages = (spec.pages as Array<Record<string, unknown>>) || [];
    const homePage = pages.find((p: any) => p.slug === "home");

    if (homePage) {
      const sections = (homePage.sections as Array<Record<string, unknown>>) || [];
      const summarySection = {
        id: `revision_summary_${version}`,
        component: "AboutStory",
        props: {
          title: `Revision ${version}`,
          subtitle: `Changes applied: ${revisionRequest}`,
          content: `Version ${version} includes the following updates: ${revisionRequest}. We've carefully reviewed your feedback and made the necessary adjustments to better align with your vision.`,
        },
        order: -1,
      };
      homePage.sections = [summarySection, ...sections];
    }

    return spec;
  }

  async generateContent(prompt: string): Promise<string> {
    return `Generated content for: ${prompt}`;
  }

  /* -------------------------------------------------------------------------- */
  /*                        Section Builders                                   */
  /* -------------------------------------------------------------------------- */

  private _buildHeroSection(ctx: {
    businessName: string; businessDescription: string; industry: string;
    imagePaths: string[]; logoPath: string | null;
    componentSelections: Record<string, string>; themeStyle: string;
  }): Record<string, unknown> {
    const content = HERO_CONTENT[ctx.industry] || {
      headline: `Welcome to ${ctx.businessName}`,
      subheadline: ctx.businessDescription || "We deliver exceptional results for our clients",
      ctaText: "Get Started",
      badge: "Welcome",
    };

    const headline = content.headline.replace("{name}", ctx.businessName);
    const heroComp = resolveComponent(ctx.componentSelections, "hero", "Hero1", ctx.themeStyle);

    return {
      id: "hero",
      component: heroComp,
      props: {
        headline,
        subheadline: content.subheadline,
        ctaText: content.ctaText,
        ctaLink: "/contact",
        badge: content.badge,
        image: ctx.imagePaths[0] || null,
        logo: ctx.logoPath || null,
      },
      order: 0,
    };
  }

  private _buildHomePageSections(ctx: {
    businessName: string; businessDescription: string; industry: string;
    config: BusinessTypeConfig; logoPath: string | null; imagePaths: string[];
    homepageSections: string[]; socialMedia: Record<string, string>;
    userServices: Array<{ title: string; description: string; icon: string }>;
    userTestimonials: Array<{ name: string; role: string; content: string; rating: number }>;
    userFaq: Array<{ question: string; answer: string }>;
    componentSelections: Record<string, string>; themeStyle: string;
  }): Array<Record<string, unknown>> {
    const sections: Array<Record<string, unknown>> = [];
    let order = 0;

    sections.push({ ...this._buildHeroSection(ctx), order: order++ });

    const testimonials = ctx.userTestimonials.length > 0
      ? ctx.userTestimonials
      : getTestimonials(ctx.industry);

    const services = ctx.userServices.length > 0
      ? ctx.userServices
      : getServices(ctx.industry);

    const faq = ctx.userFaq.length > 0
      ? ctx.userFaq
      : getFaq(ctx.industry);

    for (const sectionId of ctx.homepageSections) {
      switch (sectionId) {
        case "hero_banner":
          break;
        case "testimonials":
          sections.push({
            id: "testimonials",
            component: resolveComponent(ctx.componentSelections, "testimonials", "Testimonials1", ctx.themeStyle),
            props: {
              title: "What Our Clients Say",
              subtitle: "Trusted by hundreds of satisfied customers",
              testimonials,
            },
            order: order++,
          });
          break;
        case "services":
          sections.push({
            id: "services",
            component: resolveComponent(ctx.componentSelections, "services", "Services1", ctx.themeStyle),
            props: {
              title: "Our Services",
              subtitle: "What we offer",
              services,
            },
            order: order++,
          });
          break;
        case "gallery":
          sections.push({
            id: "gallery",
            component: resolveComponent(ctx.componentSelections, "gallery", "Gallery1", ctx.themeStyle),
            props: {
              title: "Our Gallery",
              subtitle: "Take a look at our work",
              images: ctx.imagePaths.length > 0
                ? ctx.imagePaths.map((url, i) => ({ url, alt: `Gallery image ${i + 1}` }))
                : Array.from({ length: 6 }, (_, i) => ({ url: null, alt: `Gallery image ${i + 1}` })),
            },
            order: order++,
          });
          break;
        case "faq":
          sections.push({
            id: "faq",
            component: resolveComponent(ctx.componentSelections, "faq", "FAQ1", ctx.themeStyle),
            props: {
              title: "Frequently Asked Questions",
              subtitle: "Find answers to common questions",
              faq,
            },
            order: order++,
          });
          break;
        case "cta":
          sections.push({
            id: "cta",
            component: resolveComponent(ctx.componentSelections, "cta", "CTA2", ctx.themeStyle),
            props: {
              headline: "Ready to Get Started?",
              subheadline: "Contact us today to learn how we can help you",
              ctaText: "Contact Us",
              ctaLink: "/contact",
            },
            order: order++,
          });
          break;
        case "portfolio":
          sections.push({
            id: "portfolio",
            component: resolveComponent(ctx.componentSelections, "portfolio", "Portfolio2", ctx.themeStyle),
            props: {
              title: "Our Work",
              subtitle: "Recent projects",
              items: ctx.imagePaths.slice(0, 6).map((url, i) => ({
                title: `Project ${i + 1}`,
                description: "A showcase of our work",
                image: url,
              })),
            },
            order: order++,
          });
          break;
        case "pricing":
          sections.push({
            id: "pricing",
            component: resolveComponent(ctx.componentSelections, "pricing", "Pricing2", ctx.themeStyle),
            props: {
              title: "Pricing Plans",
              subtitle: "Choose the plan that works for you",
              plans: [
                { name: "Basic", price: "$29/mo", features: ["Feature 1", "Feature 2", "Feature 3"] },
                { name: "Pro", price: "$79/mo", features: ["Everything in Basic", "Feature 4", "Feature 5"], popular: true },
                { name: "Enterprise", price: "$199/mo", features: ["Everything in Pro", "Feature 6", "Feature 7"] },
              ],
            },
            order: order++,
          });
          break;
        case "brand_showcase":
          sections.push({
            id: "brand_showcase",
            component: "BrandShowcase",
            props: {
              title: "Trusted By Leading Brands",
              brands: ["Brand 1", "Brand 2", "Brand 3", "Brand 4", "Brand 5"],
            },
            order: order++,
          });
          break;
        case "newsletter":
          sections.push({
            id: "newsletter",
            component: "NewsletterSignup",
            props: {
              title: "Stay Updated",
              subtitle: "Subscribe to our newsletter for the latest updates",
            },
            order: order++,
          });
          break;
        case "instagram":
          sections.push({
            id: "instagram",
            component: "InstagramFeed",
            props: {
              title: "Follow Us on Instagram",
              handle: ctx.socialMedia.instagram || "@business",
            },
            order: order++,
          });
          break;
        case "why_choose_us":
          sections.push({
            id: "why_choose_us",
            component: "WhyChooseUs",
            props: {
              title: "Why Choose Us",
              subtitle: "What sets us apart",
              reasons: [
                { title: "Expert Team", description: "Our experienced professionals deliver outstanding results." },
                { title: "Quality Service", description: "We never compromise on quality and attention to detail." },
                { title: "Customer First", description: "Your satisfaction is our top priority in everything we do." },
                { title: "Proven Results", description: "Track record of delivering measurable, impactful outcomes." },
              ],
            },
            order: order++,
          });
          break;
        case "about_story":
          sections.push({
            id: "about_story",
            component: "AboutStory",
            props: {
              title: getAboutTitle(ctx.industry),
              subtitle: "Learn about our journey",
              content: `${ctx.businessName} was founded with a vision to deliver exceptional ${ctx.industry.toLowerCase()} services. Over the years, we've built a reputation for quality, innovation, and customer satisfaction. Our team of dedicated professionals works tirelessly to exceed expectations and deliver results that make a difference.`,
        backgroundImage: ctx.imagePaths[0] || null,
            },
            order: order++,
          });
          break;
        case "team":
          sections.push({
            id: "team",
            component: "TeamSection",
            props: {
              title: "Meet Our Team",
              subtitle: "The people behind our success",
              members: [
                { name: "John Smith", role: "Founder & CEO", avatar: null },
                { name: "Jane Doe", role: "Creative Director", avatar: null },
                { name: "Mike Johnson", role: "Lead Developer", avatar: null },
              ],
            },
            order: order++,
          });
          break;
        case "contact_preview":
          sections.push({
            id: "contact_preview",
            component: "ContactPreview",
            props: {
              title: "Get In Touch",
              subtitle: "We'd love to hear from you",
              phone: "+1 (555) 123-4567",
              email: "hello@example.com",
              address: "123 Business St, Suite 100",
            },
            order: order++,
          });
          break;
        case "blog_preview":
          sections.push({
            id: "blog_preview",
            component: "BlogPreview",
            props: {
              title: "Latest Insights",
              subtitle: "Read our latest thoughts and updates",
              posts: getBlogPosts(ctx.industry).slice(0, 3),
            },
            order: order++,
          });
          break;
        default:
          break;
      }
    }

    if (sections.length <= 1) {
      sections.push({
        id: "services_default",
        component: resolveComponent(ctx.componentSelections, "services", "Services1", ctx.themeStyle),
        props: {
          title: "Our Services",
          subtitle: "What we offer",
          services,
        },
        order: order++,
      });
      sections.push({
        id: "testimonials_default",
        component: resolveComponent(ctx.componentSelections, "testimonials", "Testimonials1", ctx.themeStyle),
        props: {
          title: "What Our Clients Say",
          subtitle: "Trusted by hundreds of satisfied customers",
          testimonials,
        },
        order: order++,
      });
      sections.push({
        id: "cta_default",
        component: resolveComponent(ctx.componentSelections, "cta", "CTA2", ctx.themeStyle),
        props: {
          headline: "Ready to Get Started?",
          subheadline: "Contact us today to learn how we can help you",
          ctaText: "Contact Us",
          ctaLink: "/contact",
        },
        order: order++,
      });
    }

    return sections;
  }

  private _buildAboutSections(ctx: {
    businessName: string; businessDescription: string; industry: string;
    logoPath: string | null; imagePaths: string[];
    componentSelections: Record<string, string>; themeStyle: string;
    pageSections?: string[];
  }): Array<Record<string, unknown>> {
    return [
      {
        id: "page_hero",
        component: resolveComponent(ctx.componentSelections, "hero", "PageHero", ctx.themeStyle),
        props: {
          title: getAboutTitle(ctx.industry),
          subtitle: `Learn more about ${ctx.businessName}`,
          image: ctx.imagePaths[0] || null,
        },
        order: 0,
      },
      {
        id: "about_story",
        component: "AboutStory",
        props: {
          title: getAboutTitle(ctx.industry),
          subtitle: "Our Journey",
          content: `${ctx.businessName} was founded with a vision to deliver exceptional ${ctx.industry.toLowerCase()} services. ${ctx.businessDescription || "We are committed to quality, innovation, and customer satisfaction."} Over the years, we've built a reputation for excellence, serving hundreds of satisfied clients. Our team of dedicated professionals brings together diverse expertise and a shared passion for delivering outstanding results.`,
          image: ctx.imagePaths[1] || ctx.imagePaths[0] || null,
        },
        order: 1,
      },
      {
        id: "about_values",
        component: "AboutValues",
        props: {
          title: "Our Values",
          subtitle: "What drives us every day",
          values: [
            { title: "Excellence", description: "We strive for excellence in everything we do, setting high standards and exceeding expectations.", icon: "star" },
            { title: "Integrity", description: "We conduct our business with honesty, transparency, and ethical practices.", icon: "shield" },
            { title: "Innovation", description: "We embrace new ideas and continuously improve our approach to better serve our clients.", icon: "lightbulb" },
            { title: "Customer Focus", description: "Our clients are at the heart of every decision we make.", icon: "heart" },
          ],
        },
        order: 2,
      },
      {
        id: "team",
        component: "TeamSection",
        props: {
          title: "Meet Our Team",
          subtitle: "The talented people behind our success",
          members: [
            { name: "John Smith", role: "Founder & CEO", avatar: null, bio: "Visionary leader with 15+ years of industry experience." },
            { name: "Jane Doe", role: "Creative Director", avatar: null, bio: "Award-winning creative with a passion for design." },
            { name: "Mike Johnson", role: "Operations Manager", avatar: null, bio: "Ensures seamless delivery of all projects." },
          ],
        },
        order: 3,
      },
      {
        id: "cta",
        component: resolveComponent(ctx.componentSelections, "cta", "CTA2", ctx.themeStyle),
        props: {
          headline: "Want to Work With Us?",
          subheadline: "We'd love to hear about your project",
          ctaText: "Get In Touch",
          ctaLink: "/contact",
        },
        order: 4,
      },
    ];
  }

  private _buildServicesSections(ctx: {
    businessName: string; businessDescription: string; industry: string;
    userServices: Array<{ title: string; description: string; icon: string }>;
    componentSelections: Record<string, string>; themeStyle: string;
    pageSections?: string[];
  }): Array<Record<string, unknown>> {
    const services = ctx.userServices.length > 0
      ? ctx.userServices
      : getServices(ctx.industry);

    return [
      {
        id: "page_hero",
        component: resolveComponent(ctx.componentSelections, "hero", "PageHero", ctx.themeStyle),
        props: {
          title: "Our Services",
          subtitle: `What ${ctx.businessName} offers`,
        },
        order: 0,
      },
      {
        id: "services",
        component: resolveComponent(ctx.componentSelections, "services", "Services1", ctx.themeStyle),
        props: {
          title: "Our Services",
          subtitle: "Comprehensive solutions tailored to your needs",
          services,
        },
        order: 1,
      },
      {
        id: "why_choose_us",
        component: "WhyChooseUs",
        props: {
          title: "Why Choose Us",
          subtitle: "What sets us apart from the competition",
          reasons: [
            { title: "Expert Team", description: "Our professionals bring years of experience to every project." },
            { title: "Quality Guarantee", description: "We stand behind our work with a satisfaction guarantee." },
            { title: "Competitive Pricing", description: "Premium services at fair, transparent prices." },
            { title: "24/7 Support", description: "We're here whenever you need us, day or night." },
          ],
        },
        order: 2,
      },
      {
        id: "testimonials",
        component: resolveComponent(ctx.componentSelections, "testimonials", "Testimonials1", ctx.themeStyle),
        props: {
          title: "What Clients Say About Our Services",
          subtitle: "Don't just take our word for it",
          testimonials: getTestimonials(ctx.industry),
        },
        order: 3,
      },
      {
        id: "cta",
        component: resolveComponent(ctx.componentSelections, "cta", "CTA2", ctx.themeStyle),
        props: {
          headline: "Ready to Experience the Difference?",
          subheadline: "Let's discuss how we can help you",
          ctaText: "Contact Us",
          ctaLink: "/contact",
        },
        order: 4,
      },
    ];
  }

  private _buildPortfolioSections(ctx: {
    businessName: string; industry: string; imagePaths: string[];
    componentSelections: Record<string, string>; themeStyle: string;
  }): Array<Record<string, unknown>> {
    return [
      {
        id: "page_hero",
        component: resolveComponent(ctx.componentSelections, "hero", "PageHero", ctx.themeStyle),
        props: {
          title: "Our Portfolio",
          subtitle: `A showcase of ${ctx.businessName}'s finest work`,
        },
        order: 0,
      },
      {
        id: "portfolio",
        component: resolveComponent(ctx.componentSelections, "portfolio", "Portfolio2", ctx.themeStyle),
        props: {
          title: "Featured Projects",
          subtitle: "Explore our recent work",
          items: ctx.imagePaths.length > 0
            ? ctx.imagePaths.map((url, i) => ({
                title: `Project ${i + 1}`,
                description: "A showcase of our creative work",
                image: url,
                category: "Featured",
              }))
            : Array.from({ length: 6 }, (_, i) => ({
                title: `Project ${i + 1}`,
                description: "A showcase of our creative work",
                image: null,
                category: i % 2 === 0 ? "Featured" : "Recent",
              })),
        },
        order: 1,
      },
      {
        id: "cta",
        component: resolveComponent(ctx.componentSelections, "cta", "CTA2", ctx.themeStyle),
        props: {
          headline: "Like What You See?",
          subheadline: "Let's create something amazing together",
          ctaText: "Start Your Project",
          ctaLink: "/contact",
        },
        order: 2,
      },
    ];
  }

  private _buildPricingSections(ctx: {
    businessName: string; industry: string;
    componentSelections: Record<string, string>; themeStyle: string;
  }): Array<Record<string, unknown>> {
    return [
      {
        id: "page_hero",
        component: resolveComponent(ctx.componentSelections, "hero", "PageHero", ctx.themeStyle),
        props: {
          title: "Pricing",
          subtitle: `Simple, transparent pricing for ${ctx.businessName}`,
        },
        order: 0,
      },
      {
        id: "pricing",
        component: resolveComponent(ctx.componentSelections, "pricing", "Pricing2", ctx.themeStyle),
        props: {
          title: "Choose Your Plan",
          subtitle: "Select the plan that best fits your needs",
          plans: [
            { name: "Starter", price: "$29/mo", description: "Perfect for getting started", features: ["5 Projects", "Basic Analytics", "Email Support", "1GB Storage"], cta: "Get Started" },
            { name: "Professional", price: "$79/mo", description: "Best for growing businesses", features: ["25 Projects", "Advanced Analytics", "Priority Support", "10GB Storage", "Custom Domain", "API Access"], popular: true, cta: "Start Free Trial" },
            { name: "Enterprise", price: "$199/mo", description: "For large-scale operations", features: ["Unlimited Projects", "Full Analytics Suite", "24/7 Dedicated Support", "100GB Storage", "Custom Domain", "API Access", "Custom Integrations", "SLA"], cta: "Contact Sales" },
          ],
        },
        order: 1,
      },
      {
        id: "faq",
        component: resolveComponent(ctx.componentSelections, "faq", "FAQ1", ctx.themeStyle),
        props: {
          title: "Pricing FAQs",
          subtitle: "Common questions about our pricing",
          faq: getFaq(ctx.industry),
        },
        order: 2,
      },
    ];
  }

  private _buildBlogSections(ctx: {
    businessName: string; industry: string;
    componentSelections: Record<string, string>; themeStyle: string;
  }): Array<Record<string, unknown>> {
    const posts = getBlogPosts(ctx.industry);

    return [
      {
        id: "page_hero",
        component: resolveComponent(ctx.componentSelections, "hero", "PageHero", ctx.themeStyle),
        props: {
          title: "Blog",
          subtitle: `Latest news and insights from ${ctx.businessName}`,
        },
        order: 0,
      },
      {
        id: "blog_grid",
        component: "BlogGrid",
        props: {
          title: "Latest Articles",
          subtitle: "Stay informed with our latest posts",
          posts,
        },
        order: 1,
      },
      {
        id: "newsletter",
        component: "NewsletterSignup",
        props: {
          title: "Subscribe to Our Newsletter",
          subtitle: "Get the latest updates delivered to your inbox",
        },
        order: 2,
      },
    ];
  }

  private _buildContactSections(ctx: {
    businessName: string; businessDescription: string; industry: string;
    componentSelections: Record<string, string>; themeStyle: string;
  }): Array<Record<string, unknown>> {
    return [
      {
        id: "page_hero",
        component: resolveComponent(ctx.componentSelections, "hero", "PageHero", ctx.themeStyle),
        props: {
          title: "Contact Us",
          subtitle: `Get in touch with ${ctx.businessName}`,
        },
        order: 0,
      },
      {
        id: "contact_form",
        component: resolveComponent(ctx.componentSelections, "contact", "Contact1", ctx.themeStyle),
        props: {
          title: "Send Us a Message",
          subtitle: "We'll get back to you within 24 hours",
          phone: "+1 (555) 123-4567",
          email: "hello@example.com",
          address: "123 Business St, Suite 100, City, State 12345",
        },
        order: 1,
      },
      {
        id: "map",
        component: "MapEmbed",
        props: {
          title: "Find Us",
          address: "123 Business St, Suite 100, City, State 12345",
        },
        order: 2,
      },
    ];
  }

  private _buildFaqSections(ctx: {
    businessName: string; industry: string;
    userFaq: Array<{ question: string; answer: string }>;
    componentSelections: Record<string, string>; themeStyle: string;
  }): Array<Record<string, unknown>> {
    const faq = ctx.userFaq.length > 0 ? ctx.userFaq : getFaq(ctx.industry);

    return [
      {
        id: "page_hero",
        component: resolveComponent(ctx.componentSelections, "hero", "PageHero", ctx.themeStyle),
        props: {
          title: "FAQ",
          subtitle: "Frequently Asked Questions",
        },
        order: 0,
      },
      {
        id: "faq",
        component: resolveComponent(ctx.componentSelections, "faq", "FAQ1", ctx.themeStyle),
        props: {
          title: "Frequently Asked Questions",
          subtitle: "Find answers to common questions",
          faq,
        },
        order: 1,
      },
      {
        id: "cta",
        component: resolveComponent(ctx.componentSelections, "cta", "CTA2", ctx.themeStyle),
        props: {
          headline: "Still Have Questions?",
          subheadline: "We're here to help",
          ctaText: "Contact Us",
          ctaLink: "/contact",
        },
        order: 2,
      },
    ];
  }

  private _buildTestimonialsSections(ctx: {
    businessName: string; industry: string;
    userTestimonials: Array<{ name: string; role: string; content: string; rating: number }>;
    componentSelections: Record<string, string>; themeStyle: string;
  }): Array<Record<string, unknown>> {
    const testimonials = ctx.userTestimonials.length > 0
      ? ctx.userTestimonials
      : getTestimonials(ctx.industry);

    return [
      {
        id: "page_hero",
        component: resolveComponent(ctx.componentSelections, "hero", "PageHero", ctx.themeStyle),
        props: {
          title: "Testimonials",
          subtitle: "What our clients say about us",
        },
        order: 0,
      },
      {
        id: "testimonials",
        component: resolveComponent(ctx.componentSelections, "testimonials", "Testimonials1", ctx.themeStyle),
        props: {
          title: "Client Testimonials",
          subtitle: "Real stories from real clients",
          testimonials,
        },
        order: 1,
      },
      {
        id: "cta",
        component: resolveComponent(ctx.componentSelections, "cta", "CTA2", ctx.themeStyle),
        props: {
          headline: "Ready to Join Our Happy Clients?",
          subheadline: "Let us help you achieve your goals",
          ctaText: "Get Started",
          ctaLink: "/contact",
        },
        order: 2,
      },
    ];
  }

  private _buildGallerySections(ctx: {
    businessName: string; industry: string; imagePaths: string[];
    componentSelections: Record<string, string>; themeStyle: string;
  }): Array<Record<string, unknown>> {
    return [
      {
        id: "page_hero",
        component: resolveComponent(ctx.componentSelections, "hero", "PageHero", ctx.themeStyle),
        props: {
          title: "Gallery",
          subtitle: `A visual showcase from ${ctx.businessName}`,
        },
        order: 0,
      },
      {
        id: "gallery",
        component: resolveComponent(ctx.componentSelections, "gallery", "Gallery1", ctx.themeStyle),
        props: {
          title: "Our Gallery",
          subtitle: "Browse through our collection",
          images: ctx.imagePaths.length > 0
            ? ctx.imagePaths.map((url, i) => ({ url, alt: `Gallery image ${i + 1}` }))
            : Array.from({ length: 9 }, (_, i) => ({ url: null, alt: `Gallery image ${i + 1}` })),
        },
        order: 1,
      },
    ];
  }

  private _buildBookingSections(ctx: {
    businessName: string; industry: string;
    componentSelections: Record<string, string>; themeStyle: string;
  }): Array<Record<string, unknown>> {
    return [
      {
        id: "page_hero",
        component: resolveComponent(ctx.componentSelections, "hero", "PageHero", ctx.themeStyle),
        props: {
          title: "Book an Appointment",
          subtitle: `Schedule your visit to ${ctx.businessName}`,
        },
        order: 0,
      },
      {
        id: "booking_form",
        component: "ReservationForm",
        props: {
          title: "Book Your Appointment",
          subtitle: "Fill in the details below to schedule your visit",
          businessName: ctx.businessName,
        },
        order: 1,
      },
    ];
  }

  private _buildMenuSections(ctx: {
    businessName: string; industry: string;
    componentSelections: Record<string, string>; themeStyle: string;
  }): Array<Record<string, unknown>> {
    const menuCategories: Record<string, Array<{ name: string; description: string; price: string }>> = {
      Restaurant: [
        { name: "Appetizers", description: "Starters and small plates", price: "" },
        { name: "Mains", description: "Signature entrees", price: "" },
        { name: "Desserts", description: "Sweet endings", price: "" },
        { name: "Drinks", description: "Beverages and cocktails", price: "" },
      ],
      default: [
        { name: "Featured", description: "Our most popular items", price: "" },
        { name: "Specials", description: "Limited time offerings", price: "" },
        { name: "Classics", description: "Customer favorites", price: "" },
      ],
    };
    const categories = menuCategories[ctx.industry] || menuCategories["default"];

    return [
      {
        id: "page_hero",
        component: resolveComponent(ctx.componentSelections, "hero", "PageHero", ctx.themeStyle),
        props: {
          title: "Our Menu",
          subtitle: `Explore what ${ctx.businessName} has to offer`,
        },
        order: 0,
      },
      {
        id: "menu_highlights",
        component: "MenuHighlights",
        props: {
          title: "Our Menu",
          subtitle: "Carefully crafted selections",
          categories,
        },
        order: 1,
      },
      {
        id: "daily_specials",
        component: "DailySpecials",
        props: {
          title: "Today's Specials",
          subtitle: "Chef's picks for today",
        },
        order: 2,
      },
      {
        id: "gallery",
        component: resolveComponent(ctx.componentSelections, "gallery", "Gallery1", ctx.themeStyle),
        props: {
          title: "Food Gallery",
          subtitle: "A taste of what's coming",
          images: [],
        },
        order: 3,
      },
    ];
  }

  private _buildReservationsSections(ctx: {
    businessName: string; industry: string;
    componentSelections: Record<string, string>; themeStyle: string;
  }): Array<Record<string, unknown>> {
    return [
      {
        id: "page_hero",
        component: resolveComponent(ctx.componentSelections, "hero", "PageHero", ctx.themeStyle),
        props: {
          title: "Make a Reservation",
          subtitle: `Book your table at ${ctx.businessName}`,
        },
        order: 0,
      },
      {
        id: "reservation_form",
        component: "ReservationForm",
        props: {
          title: "Reserve a Table",
          subtitle: "Select your preferred date and time",
          businessName: ctx.businessName,
        },
        order: 1,
      },
      {
        id: "contact_info",
        component: "ContactInfo",
        props: {
          methods: [
            { title: "Phone", value: "+1 (555) 123-4567", description: "Call us directly" },
            { title: "Email", value: "reservations@example.com", description: "Send us a message" },
            { title: "Address", value: "123 Business St, City, State 12345", description: "" },
            { title: "Hours", value: "Mon-Sun: 11:00 AM - 10:00 PM", description: "" },
          ],
        },
        order: 2,
      },
    ];
  }

  private _buildTeamSections(ctx: {
    businessName: string; industry: string;
    componentSelections: Record<string, string>; themeStyle: string;
  }): Array<Record<string, unknown>> {
    return [
      {
        id: "page_hero",
        component: resolveComponent(ctx.componentSelections, "hero", "PageHero", ctx.themeStyle),
        props: {
          title: "Our Team",
          subtitle: `Meet the talented people behind ${ctx.businessName}`,
        },
        order: 0,
      },
      {
        id: "team",
        component: "TeamSection",
        props: {
          title: "Meet the Team",
          subtitle: "Dedicated professionals committed to excellence",
          members: [
            { name: "John Smith", role: "Founder & CEO", avatar: null, bio: "Visionary leader with years of industry experience." },
            { name: "Jane Doe", role: "Creative Director", avatar: null, bio: "Award-winning creative with a passion for design." },
            { name: "Mike Johnson", role: "Operations Manager", avatar: null, bio: "Ensures seamless delivery of all projects." },
          ],
        },
        order: 1,
      },
      {
        id: "cta",
        component: resolveComponent(ctx.componentSelections, "cta", "CTA2", ctx.themeStyle),
        props: {
          headline: "Want to Join Our Team?",
          subheadline: "We're always looking for talented people",
          ctaText: "View Open Positions",
          ctaLink: "/contact",
        },
        order: 2,
      },
    ];
  }

  private _buildGenericSections(ctx: {
    businessName: string; industry: string;
    componentSelections: Record<string, string>; themeStyle: string;
  }): Array<Record<string, unknown>> {
    return [
      {
        id: "page_hero",
        component: resolveComponent(ctx.componentSelections, "hero", "PageHero", ctx.themeStyle),
        props: {
          title: capitalize(ctx.industry),
          subtitle: `Welcome to ${ctx.businessName}`,
        },
        order: 0,
      },
      {
        id: "about_story",
        component: "AboutStory",
        props: {
          title: getAboutTitle(ctx.industry),
          subtitle: "Learn More About Us",
          content: `${ctx.businessName} is dedicated to providing exceptional ${ctx.industry.toLowerCase()} services. We pride ourselves on quality, innovation, and customer satisfaction.`,
        },
        order: 1,
      },
      {
        id: "cta",
        component: resolveComponent(ctx.componentSelections, "cta", "CTA2", ctx.themeStyle),
        props: {
          headline: "Ready to Get Started?",
          subheadline: "Contact us today",
          ctaText: "Contact Us",
          ctaLink: "/contact",
        },
        order: 2,
      },
    ];
  }

  /* -------------------------------------------------------------------------- */
  /*                           Theme Builder                                    */
  /* -------------------------------------------------------------------------- */

  private _buildTheme(ctx: {
    primaryColor: string; secondaryColor: string;
    fontStyle: string; themeStyle: string;
    config: BusinessTypeConfig;
  }): Record<string, any> {
    const styleKey = ctx.themeStyle.toLowerCase();

    const styleProfiles: Record<string, {
      font: string; darkMode: boolean; borderRadius: string; buttonStyle: string;
      spacing: string; shadow: string; letterSpacing: string; borderWidth: string;
      backgroundTreatment: string;
    }> = {
      minimal:     { font: "Inter", darkMode: false, borderRadius: "4px", buttonStyle: "square", spacing: "compact", shadow: "none", letterSpacing: "wide", borderWidth: "1px", backgroundTreatment: "plain" },
      modern:      { font: "Inter", darkMode: false, borderRadius: "8px", buttonStyle: "rounded", spacing: "normal", shadow: "sm", letterSpacing: "normal", borderWidth: "1px", backgroundTreatment: "plain" },
      premium:     { font: "Playfair Display", darkMode: true, borderRadius: "2px", buttonStyle: "sharp", spacing: "relaxed", shadow: "lg", letterSpacing: "wide", borderWidth: "2px", backgroundTreatment: "gradient" },
      corporate:   { font: "Roboto", darkMode: false, borderRadius: "4px", buttonStyle: "square", spacing: "normal", shadow: "md", letterSpacing: "normal", borderWidth: "1px", backgroundTreatment: "plain" },
      creative:    { font: "Poppins", darkMode: false, borderRadius: "16px", buttonStyle: "pill", spacing: "relaxed", shadow: "md", letterSpacing: "normal", borderWidth: "0px", backgroundTreatment: "gradient" },
      luxury:      { font: "Playfair Display", darkMode: true, borderRadius: "0px", buttonStyle: "sharp", spacing: "relaxed", shadow: "lg", letterSpacing: "wide", borderWidth: "1px", backgroundTreatment: "gradient" },
      friendly:    { font: "Nunito", darkMode: false, borderRadius: "20px", buttonStyle: "pill", spacing: "normal", shadow: "sm", letterSpacing: "normal", borderWidth: "0px", backgroundTreatment: "plain" },
      professional:{ font: "Roboto", darkMode: false, borderRadius: "6px", buttonStyle: "rounded", spacing: "normal", shadow: "md", letterSpacing: "normal", borderWidth: "1px", backgroundTreatment: "plain" },
      bold:        { font: "Montserrat", darkMode: true, borderRadius: "4px", buttonStyle: "square", spacing: "compact", shadow: "xl", letterSpacing: "tight", borderWidth: "2px", backgroundTreatment: "gradient" },
      elegant:     { font: "Playfair Display", darkMode: true, borderRadius: "0px", buttonStyle: "sharp", spacing: "relaxed", shadow: "lg", letterSpacing: "wide", borderWidth: "1px", backgroundTreatment: "gradient" },
      tech:        { font: "Inter", darkMode: true, borderRadius: "8px", buttonStyle: "rounded", spacing: "compact", shadow: "md", letterSpacing: "normal", borderWidth: "1px", backgroundTreatment: "plain" },
      editorial:   { font: "Merriweather", darkMode: false, borderRadius: "2px", buttonStyle: "sharp", spacing: "relaxed", shadow: "none", letterSpacing: "wide", borderWidth: "1px", backgroundTreatment: "plain" },
    };

    const profile = styleProfiles[styleKey] || styleProfiles["modern"];
    const font = ctx.fontStyle || profile.font;

    const shadowMap: Record<string, string> = {
      none: "none",
      sm: "0 1px 2px 0 rgba(0,0,0,0.05)",
      md: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
      lg: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
      xl: "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
    };

    return {
      primaryColor: ctx.primaryColor,
      secondaryColor: ctx.secondaryColor,
      backgroundColor: profile.darkMode ? "#0F0F0F" : "#FFFFFF",
      foregroundColor: profile.darkMode ? "#F5F5F5" : "#1A1A1A",
      background: profile.darkMode ? "#0F0F0F" : "#FFFFFF",
      textColor: profile.darkMode ? "#F5F5F5" : "#1A1A1A",
      mutedColor: profile.darkMode ? "#262626" : "#F5F5F5",
      borderColor: profile.darkMode ? "#333333" : "#E5E7EB",
      fontStyle: font,
      fontFamily: font,
      darkMode: profile.darkMode,
      borderRadius: ctx.config.designStyle.borderRadius || profile.borderRadius,
      buttonStyle: ctx.config.designStyle.buttonStyle || profile.buttonStyle,
      spacing: profile.spacing,
      shadow: shadowMap[profile.shadow],
      letterSpacing: profile.letterSpacing,
      borderWidth: profile.borderWidth,
      backgroundTreatment: profile.backgroundTreatment,
    };
  }
}

export default MockAIProvider;
