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
  Agency: [
    { name: "Priya N.", role: "Marketing Director", content: "They rebuilt our entire digital presence in six weeks. Traffic and conversions both doubled within the first quarter.", rating: 5 },
    { name: "Tom R.", role: "Startup Founder", content: "Sharp strategic thinking paired with flawless execution. They feel like an extension of our own team.", rating: 5 },
    { name: "Grace L.", role: "E-commerce Owner", content: "Our brand finally looks as good as our product. Every deliverable exceeded the brief.", rating: 5 },
  ],
  Consulting: [
    { name: "Daniel K.", role: "COO", content: "Their framework cut our operating costs by 18% in the first two quarters without touching headcount.", rating: 5 },
    { name: "Rachel B.", role: "VP Strategy", content: "Clear-eyed analysis and pragmatic recommendations. No fluff, just results we could act on immediately.", rating: 5 },
    { name: "Omar S.", role: "Managing Director", content: "They understood our industry faster than consultants we've paid triple for. Genuinely impressive.", rating: 5 },
  ],
  "Real Estate": [
    { name: "Karen W.", role: "First-Time Buyer", content: "They found us the perfect home in a market we thought we couldn't compete in. Patient, sharp, and honest throughout.", rating: 5 },
    { name: "Victor H.", role: "Property Investor", content: "Consistently ahead of the market. Every property they've placed for me has appreciated faster than expected.", rating: 5 },
    { name: "Nina P.", role: "Seller", content: "Sold above asking in nine days. Their staging and pricing strategy made all the difference.", rating: 5 },
  ],
  Fitness: [
    { name: "Chris D.", role: "Member, 2 years", content: "Down 30 pounds and stronger than I've ever been. The coaches actually know your name and your goals.", rating: 5 },
    { name: "Amara J.", role: "Member", content: "Best community I've trained with. Classes are challenging but the energy keeps you coming back.", rating: 5 },
    { name: "Leo F.", role: "Personal Training Client", content: "My trainer rebuilt my program after an injury and I came back stronger than before. Truly invested in results.", rating: 5 },
  ],
  Technology: [
    { name: "Sam K.", role: "Engineering Lead", content: "Integration took an afternoon, not a sprint. The API documentation alone saved us weeks.", rating: 5 },
    { name: "Ines M.", role: "Product Manager", content: "Our team's shipping velocity jumped noticeably after switching. Support is fast and actually technical.", rating: 5 },
    { name: "Owen T.", role: "CTO", content: "Scales exactly the way they said it would. Zero surprises during our traffic spike over launch week.", rating: 5 },
  ],
  Finance: [
    { name: "Patricia A.", role: "Small Business Owner", content: "They restructured our books and found savings we didn't know existed. Tax season is no longer a nightmare.", rating: 5 },
    { name: "Marcus V.", role: "Client, 5 years", content: "Straightforward advice, no jargon, and my portfolio has consistently outperformed my expectations.", rating: 5 },
    { name: "Helen Q.", role: "Retiree", content: "They made retirement planning feel manageable instead of overwhelming. I trust them completely with my future.", rating: 5 },
  ],
  Portfolio: [
    { name: "Julia S.", role: "Creative Director", content: "Hired them for a single campaign and now they're our go-to for every major launch. Consistently original work.", rating: 5 },
    { name: "Ben C.", role: "Art Buyer", content: "A rare eye for detail and composition. Every project comes back better than the brief asked for.", rating: 5 },
    { name: "Ana R.", role: "Gallery Owner", content: "Their work stopped visitors in their tracks. We've featured them in three shows since.", rating: 5 },
  ],
  Legal: [
    { name: "Frank D.", role: "Client", content: "They walked me through a complicated case with patience and clarity I didn't expect from a law firm.", rating: 5 },
    { name: "Wendy H.", role: "Small Business Owner", content: "Resolved our contract dispute in weeks, not months. Responsive at every step and worth every dollar.", rating: 5 },
    { name: "Curtis M.", role: "Client", content: "Genuinely cared about the outcome, not just the billable hours. Highly recommend for anyone facing litigation.", rating: 5 },
  ],
  "Local Business": [
    { name: "Diane K.", role: "Neighbor", content: "Been coming here for years - always friendly faces and service you just can't get from a big chain.", rating: 5 },
    { name: "Ray P.", role: "Regular Customer", content: "They remember your name and what you need. That kind of care is rare these days.", rating: 5 },
    { name: "Monica T.", role: "Local Resident", content: "Genuinely part of the community. Fast, honest, and fairly priced every single time.", rating: 5 },
  ],
  Startup: [
    { name: "Ravi C.", role: "Early Adopter", content: "Watched this product go from beta to indispensable in our workflow in under a year. Impressive pace.", rating: 5 },
    { name: "Zoe L.", role: "Investor", content: "The team ships fast and listens even faster. One of the sharpest early-stage teams I've backed.", rating: 5 },
    { name: "Marcus E.", role: "Beta User", content: "Gave feedback on a Friday, saw it shipped by Monday. That's the kind of team you want to bet on.", rating: 5 },
  ],
  Automotive: [
    { name: "Gary S.", role: "Customer", content: "No-pressure sales and honest pricing. Drove away in the car I actually wanted, not the one they pushed.", rating: 5 },
    { name: "Renee F.", role: "Repeat Buyer", content: "Third vehicle I've bought here. The service department alone is worth the loyalty.", rating: 5 },
    { name: "Tyrell B.", role: "Customer", content: "Financing was transparent from the first conversation. No last-minute surprises at signing.", rating: 5 },
  ],
  Travel: [
    { name: "Sofia N.", role: "Traveler", content: "Every detail was handled - flights, transfers, even a restaurant reservation we didn't ask for. Flawless trip.", rating: 5 },
    { name: "Derek W.", role: "Repeat Client", content: "Booked our honeymoon and two anniversary trips since. They always find something we wouldn't have discovered alone.", rating: 5 },
    { name: "Priyanka G.", role: "Group Traveler", content: "Coordinated a 12-person trip without a single hiccup. Genuinely stress-free from booking to landing.", rating: 5 },
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
  Agency: [
    { question: "What's included in a typical engagement?", answer: "Strategy, design, build, and a launch plan - scoped together upfront so there are no surprises mid-project." },
    { question: "How long does a project take?", answer: "Most engagements run 4-10 weeks depending on scope. We'll give you a firm timeline before kickoff." },
    { question: "Do you work with our existing brand?", answer: "Yes - we can build on an existing brand system or develop one from scratch, whichever you need." },
  ],
  Consulting: [
    { question: "How do you structure engagements?", answer: "We typically start with a diagnostic phase, then move into a scoped project with clear milestones and deliverables." },
    { question: "Do you work with companies our size?", answer: "We work with organizations from early-stage startups to established enterprises, tailoring our approach accordingly." },
    { question: "What does the first meeting look like?", answer: "A free discovery call to understand your challenges and confirm we're the right fit before any commitment." },
  ],
  "Real Estate": [
    { question: "Do you work with both buyers and sellers?", answer: "Yes, our agents represent buyers, sellers, and investors across the areas we serve." },
    { question: "How do I get a home valuation?", answer: "Request a free, no-obligation valuation through our contact form and an agent will follow up within 24 hours." },
    { question: "Do you offer virtual tours?", answer: "Most of our listings include virtual walkthroughs so you can preview a property before an in-person visit." },
  ],
  Fitness: [
    { question: "Do I need to be in shape to start?", answer: "Not at all - our programs are built for every fitness level, with modifications for beginners in every class." },
    { question: "Can I try a class before committing?", answer: "Yes, we offer a free trial class so you can experience our coaching and community firsthand." },
    { question: "What should I bring to my first session?", answer: "Just comfortable workout clothes and a water bottle. We provide all the equipment you'll need." },
  ],
  Technology: [
    { question: "Is there a free trial?", answer: "Yes, every plan includes a 14-day free trial with full feature access - no credit card required to start." },
    { question: "How does onboarding work?", answer: "Our team provides guided setup and documentation, with live support available during your first 30 days." },
    { question: "Is my data secure?", answer: "We use enterprise-grade encryption and undergo regular third-party security audits to keep your data safe." },
  ],
  Finance: [
    { question: "What services do you offer?", answer: "From bookkeeping and tax planning to investment advisory and retirement planning, tailored to your goals." },
    { question: "Do you work with individuals or businesses?", answer: "Both - we support individual clients as well as small and mid-sized businesses." },
    { question: "How are your fees structured?", answer: "Fees vary by service; we provide a transparent breakdown during your free initial consultation." },
  ],
  Portfolio: [
    { question: "Are you available for freelance projects?", answer: "Yes, I'm currently accepting new projects - reach out with your timeline and scope to check availability." },
    { question: "What's your typical turnaround time?", answer: "Most projects take 2-4 weeks depending on scope, with regular check-ins throughout the process." },
    { question: "Do you offer revisions?", answer: "Every project includes two rounds of revisions to make sure the final result matches your vision." },
  ],
  Legal: [
    { question: "Do you offer free consultations?", answer: "Yes, we offer a complimentary initial consultation to discuss your case and outline your options." },
    { question: "What areas of law do you practice?", answer: "Our attorneys handle a range of practice areas - reach out and we'll match you with the right specialist." },
    { question: "How are fees structured?", answer: "Depending on the case, we offer hourly, flat-fee, and contingency arrangements, explained clearly upfront." },
  ],
  "Local Business": [
    { question: "What are your hours?", answer: "We're open Monday through Saturday - check our contact page for exact hours and holiday schedules." },
    { question: "Do you offer delivery or pickup?", answer: "Yes, both options are available. Reach out or check our contact page for details." },
    { question: "Are walk-ins welcome?", answer: "Absolutely - walk-ins are always welcome, though booking ahead guarantees your spot." },
  ],
  Startup: [
    { question: "Is this product ready for production use?", answer: "Yes, we're live with paying customers today and ship improvements every week based on user feedback." },
    { question: "Do you offer onboarding support?", answer: "Every new account gets a guided onboarding session with our founding team." },
    { question: "What's on the roadmap?", answer: "We share a public roadmap and prioritize features based directly on customer requests." },
  ],
  Automotive: [
    { question: "Do you offer financing?", answer: "Yes, we work with multiple lenders to find financing options that fit your budget, including for all credit types." },
    { question: "Can I trade in my current vehicle?", answer: "Absolutely - bring your vehicle in for a free appraisal and we'll apply the value toward your purchase." },
    { question: "Do you service what you sell?", answer: "Yes, our certified service center handles maintenance and repairs for every vehicle we sell." },
  ],
  Travel: [
    { question: "Do you handle custom itineraries?", answer: "Yes, every trip we plan is built around your preferences, budget, and travel style." },
    { question: "What if my plans change?", answer: "We offer flexible rebooking on most packages and will work with you if your travel dates shift." },
    { question: "Do you assist with travel documents?", answer: "Yes, we provide guidance on visas, passports, and any required travel documentation for your destination." },
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
  Agency: [
    { title: "Brand Strategy", description: "Positioning, messaging, and visual identity that set you apart from the competition.", icon: "target" },
    { title: "Web Design & Development", description: "Fast, conversion-focused websites built to grow with your business.", icon: "layout" },
    { title: "Digital Marketing", description: "SEO, paid media, and content strategy that turn visitors into customers.", icon: "trending-up" },
  ],
  Consulting: [
    { title: "Strategic Advisory", description: "Data-driven recommendations to help you navigate growth, change, and competitive pressure.", icon: "compass" },
    { title: "Operational Efficiency", description: "Streamline processes and cut costs without sacrificing quality or morale.", icon: "settings" },
    { title: "Change Management", description: "Guide your organization through transitions with a clear, structured roadmap.", icon: "git-branch" },
  ],
  "Real Estate": [
    { title: "Buyer Representation", description: "Expert guidance from search to closing, with your best interests always first.", icon: "key" },
    { title: "Seller Services", description: "Strategic pricing, staging, and marketing to sell faster and for more.", icon: "home" },
    { title: "Investment Properties", description: "Identify and evaluate opportunities with strong long-term return potential.", icon: "trending-up" },
  ],
  Fitness: [
    { title: "Group Classes", description: "High-energy, coach-led sessions for every fitness level, from beginner to advanced.", icon: "users" },
    { title: "Personal Training", description: "One-on-one programs tailored to your goals, schedule, and starting point.", icon: "activity" },
    { title: "Nutrition Coaching", description: "Practical, sustainable nutrition guidance to complement your training.", icon: "heart-pulse" },
  ],
  Technology: [
    { title: "Platform Integration", description: "Connect your existing tools with our API in hours, not weeks.", icon: "cpu" },
    { title: "Dedicated Support", description: "Technical support from engineers who actually know the product.", icon: "headphones" },
    { title: "Enterprise Security", description: "SOC 2-aligned infrastructure with encryption at rest and in transit.", icon: "shield" },
  ],
  Finance: [
    { title: "Wealth Management", description: "Personalized investment strategy aligned with your goals and risk tolerance.", icon: "trending-up" },
    { title: "Tax Planning", description: "Proactive tax strategy that keeps more of what you earn, year-round.", icon: "file-text" },
    { title: "Retirement Planning", description: "A clear, achievable path to the retirement you're actually working toward.", icon: "shield" },
  ],
  Portfolio: [
    { title: "Brand & Visual Identity", description: "Distinctive design systems that make brands instantly recognizable.", icon: "star" },
    { title: "Illustration & Art Direction", description: "Original artwork and creative direction tailored to your story.", icon: "sparkles" },
    { title: "Freelance Collaboration", description: "Flexible engagement for one-off projects or ongoing creative partnership.", icon: "message-circle" },
  ],
  Legal: [
    { title: "Litigation & Disputes", description: "Aggressive, strategic representation when you need to protect your interests.", icon: "shield" },
    { title: "Contracts & Compliance", description: "Clear, thorough agreements that protect your business from day one.", icon: "file-text" },
    { title: "Consultation & Advisory", description: "Straightforward legal guidance before problems become expensive ones.", icon: "message-circle" },
  ],
  "Local Business": [
    { title: "In-Store Service", description: "Friendly, knowledgeable service every time you walk through our door.", icon: "users" },
    { title: "Custom Orders", description: "Tell us what you need and we'll make it happen, no matter how specific.", icon: "settings" },
    { title: "Community Support", description: "Proud to sponsor and support the neighborhood that supports us.", icon: "heart" },
  ],
  Startup: [
    { title: "Core Platform", description: "The tools your team needs to move faster, built for how modern teams actually work.", icon: "cpu" },
    { title: "Fast Onboarding", description: "Get your whole team set up and productive in under a day.", icon: "zap" },
    { title: "Responsive Support", description: "Direct access to our founding team when you need help, not a ticket queue.", icon: "message-circle" },
  ],
  Automotive: [
    { title: "New & Certified Pre-Owned", description: "A wide inventory with transparent pricing and no-pressure sales.", icon: "car" },
    { title: "Service & Maintenance", description: "Certified technicians keeping your vehicle running at its best.", icon: "settings" },
    { title: "Flexible Financing", description: "Financing options for every credit profile, with clear terms upfront.", icon: "file-text" },
  ],
  Travel: [
    { title: "Custom Itineraries", description: "Trips designed around your interests, pace, and budget - not a template.", icon: "map" },
    { title: "Group & Corporate Travel", description: "Seamless coordination for teams, families, and large groups.", icon: "users" },
    { title: "24/7 Trip Support", description: "Real help, day or night, if anything changes while you're on the road.", icon: "headphones" },
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
  minimal: { navbar: "Navbar3", hero: "Hero1", services: "Services1", portfolio: "Portfolio1", testimonials: "Testimonials1", pricing: "Pricing1", faq: "FAQ1", cta: "CTA1", contact: "Contact1", gallery: "Gallery1", blog: "BlogPreview", footer: "Footer3", about: "About1" },
  modern: { navbar: "Navbar1", hero: "Hero2", services: "Services2", portfolio: "Portfolio2", testimonials: "Testimonials2", pricing: "Pricing2", faq: "FAQ2", cta: "CTA2", contact: "Contact2", gallery: "Gallery2", blog: "BlogPreview", footer: "Footer2", about: "About2" },
  premium: { navbar: "Navbar2", hero: "Hero3", services: "Services3", portfolio: "Portfolio3", testimonials: "Testimonials3", pricing: "Pricing1", faq: "FAQ1", cta: "CTA1", contact: "Contact1", gallery: "Gallery1", blog: "BlogPreview", footer: "Footer1", about: "About1" },
  corporate: { navbar: "Navbar1", hero: "Hero2", services: "Services2", portfolio: "Portfolio2", testimonials: "Testimonials2", pricing: "Pricing2", faq: "FAQ2", cta: "CTA2", contact: "Contact2", gallery: "Gallery1", blog: "BlogPreview", footer: "Footer1", about: "About2" },
  creative: { navbar: "Navbar2", hero: "Hero4", services: "Services3", portfolio: "Portfolio3", testimonials: "Testimonials3", pricing: "Pricing1", faq: "FAQ1", cta: "CTA1", contact: "Contact1", gallery: "Gallery2", blog: "BlogPreview", footer: "Footer2", about: "About1" },
  luxury: { navbar: "Navbar3", hero: "Hero5", services: "Services4", portfolio: "Portfolio3", testimonials: "Testimonials3", pricing: "Pricing1", faq: "FAQ1", cta: "CTA1", contact: "Contact1", gallery: "Gallery2", blog: "BlogPreview", footer: "Footer3", about: "About1" },
  friendly: { navbar: "Navbar1", hero: "Hero1", services: "Services1", portfolio: "Portfolio1", testimonials: "Testimonials1", pricing: "Pricing2", faq: "FAQ2", cta: "CTA2", contact: "Contact2", gallery: "Gallery1", blog: "BlogPreview", footer: "Footer2", about: "About2" },
  professional: { navbar: "Navbar1", hero: "Hero2", services: "Services2", portfolio: "Portfolio2", testimonials: "Testimonials2", pricing: "Pricing2", faq: "FAQ2", cta: "CTA2", contact: "Contact2", gallery: "Gallery1", blog: "BlogPreview", footer: "Footer1", about: "About2" },
  bold: { navbar: "Navbar2", hero: "Hero4", services: "Services3", portfolio: "Portfolio3", testimonials: "Testimonials1", pricing: "Pricing1", faq: "FAQ1", cta: "CTA1", contact: "Contact1", gallery: "Gallery2", blog: "BlogPreview", footer: "Footer2", about: "About1" },
  elegant: { navbar: "Navbar3", hero: "Hero5", services: "Services4", portfolio: "Portfolio3", testimonials: "Testimonials3", pricing: "Pricing1", faq: "FAQ1", cta: "CTA1", contact: "Contact1", gallery: "Gallery2", blog: "BlogPreview", footer: "Footer3", about: "About1" },
  tech: { navbar: "Navbar2", hero: "Hero3", services: "Services2", portfolio: "Portfolio2", testimonials: "Testimonials2", pricing: "Pricing2", faq: "FAQ2", cta: "CTA2", contact: "Contact2", gallery: "Gallery1", blog: "BlogPreview", footer: "Footer1", about: "About2" },
  editorial: { navbar: "Navbar3", hero: "Hero5", services: "Services4", portfolio: "Portfolio3", testimonials: "Testimonials3", pricing: "Pricing1", faq: "FAQ1", cta: "CTA1", contact: "Contact1", gallery: "Gallery2", blog: "BlogPreview", footer: "Footer3", about: "About1" },
};

/* -------------------------------------------------------------------------- */
/*                       Component Map & Resolver                             */
/* -------------------------------------------------------------------------- */

// Of the five hero layouts, only Hero1 (Full-Screen Statement) and Hero4
// (Image-Focused) are actually built around a photo - Hero2/3/5 are
// text-first and shouldn't be handed a background image even if one was
// uploaded while a different hero style was selected.
// Hero2 (Split Editorial) has an image slot too - its right column falls
// back to a decorative gradient with no image, same as Hero1/Hero4 - it was
// just missing from this set, so an uploaded image was silently dropped.
const IMAGE_HERO_COMPONENTS = new Set(["Hero1", "Hero2", "Hero4"]);

const COMPONENT_MAP: Record<string, string> = {
  navbar1: "Navbar1", navbar2: "Navbar2", navbar3: "Navbar3",
  hero1: "Hero1", hero2: "Hero2", hero3: "Hero3", hero4: "Hero4", hero5: "Hero5",
  services1: "Services1", services2: "Services2", services3: "Services3", services4: "Services4",
  portfolio1: "Portfolio1", portfolio2: "Portfolio2", portfolio3: "Portfolio3",
  testimonials1: "Testimonials1", testimonials2: "Testimonials2", testimonials3: "Testimonials3",
  pricing1: "Pricing1", pricing2: "Pricing2",
  faq1: "FAQ1", faq2: "FAQ2",
  cta1: "CTA1", cta2: "CTA2",
  contact1: "Contact1", contact2: "Contact2",
  gallery1: "Gallery1", gallery2: "Gallery2",
  footer1: "Footer1", footer2: "Footer2", footer3: "Footer3",
  about1: "About1", about2: "About2",
  // The About page's own sections (Company Story, Values, Team, Statistics,
  // Timeline) never had a layout choice at all, unlike every Home page
  // section - picking a design style changed colors/fonts but these five
  // always rendered the exact same fixed layout.
  about_story1: "AboutStory", about_story2: "AboutStory2",
  about_values1: "AboutValues", about_values2: "AboutValues2",
  team1: "TeamSection", team2: "TeamSection2",
  stats1: "Stats", stats2: "Stats2",
  timeline1: "Timeline", timeline2: "Timeline2",
  // Same gap: Why Choose Us, Business Hours, Contact Info, and Map never
  // had a layout choice either.
  why_choose_us1: "WhyChooseUs", why_choose_us2: "WhyChooseUs2",
  business_hours1: "BusinessHours", business_hours2: "BusinessHours2",
  contact_info1: "ContactInfo", contact_info2: "ContactInfo2",
  map1: "MapEmbed", map2: "MapEmbed2",
  // Course Grid / Rooms & Suites / Travel Packages / Programs all share
  // this same card-grid component family (one category covers all four).
  course_grid1: "CourseGrid", course_grid2: "CourseGrid2",
  process1: "LearningPaths", process2: "LearningPaths2",
  daily_specials1: "DailySpecials", daily_specials2: "DailySpecials2",
  agents1: "AgentProfiles", agents2: "AgentProfiles2",
  destination_grid1: "DestinationGrid", destination_grid2: "DestinationGrid2",
  travel_deals1: "TravelDeals", travel_deals2: "TravelDeals2",
  doctors1: "DoctorProfiles", doctors2: "DoctorProfiles2",
  instructors1: "InstructorProfiles", instructors2: "InstructorProfiles2",
  menu_items1: "MenuHighlights", menu_items2: "MenuHighlights2",
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
  Agency: { headline: "We Build Brands That Grow", subheadline: "Strategy, design, and marketing that turn attention into revenue", ctaText: "Start a Project", badge: "Now Booking Q2" },
  Consulting: { headline: "Clarity for Complex Problems", subheadline: "Strategic guidance that turns uncertainty into a clear path forward", ctaText: "Book a Consultation", badge: "Trusted Advisors" },
  Fitness: { headline: "Stronger Starts Today", subheadline: "Expert coaching and a community that keeps you accountable", ctaText: "Start Free Trial", badge: "First Class Free" },
  Technology: { headline: "Ship Faster with {name}", subheadline: "The platform modern teams use to build, launch, and scale", ctaText: "Start Free Trial", badge: "14-Day Free Trial" },
  Finance: { headline: "Plan Your Financial Future", subheadline: "Personalized advisory for wealth, tax, and retirement planning", ctaText: "Book a Consultation", badge: "Fee-Only Advisors" },
  Portfolio: { headline: "Hi, I'm {name}", subheadline: "Selected work across brand, design, and visual storytelling", ctaText: "View My Work", badge: "Available for Projects" },
  Legal: { headline: "Experienced Legal Representation", subheadline: "Straightforward counsel when you need it most", ctaText: "Free Consultation", badge: "Free Case Review" },
  "Local Business": { headline: "Proudly Serving Our Community", subheadline: "Quality service and honest prices from a name you can trust", ctaText: "Get In Touch", badge: "Locally Owned" },
  Startup: { headline: "The Future, Built Today", subheadline: "Join the teams already using {name} to move faster", ctaText: "Get Started Free", badge: "Backed by Leading Investors" },
};

const ABOUT_TITLE: Record<string, string> = {
  Restaurant: "Our Story",
  Healthcare: "About Our Practice",
  Education: "About Our Institution",
  "Real Estate": "About Our Agency",
  Travel: "About Us",
  Agency: "Who We Are",
  Consulting: "Our Approach",
  Fitness: "Our Mission",
  Technology: "About the Platform",
  Finance: "About Our Firm",
  Portfolio: "About Me",
  Legal: "About Our Firm",
  "Local Business": "Our Story",
  Startup: "Our Mission",
  Automotive: "About the Dealership",
  Beauty: "About the Studio",
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
  Agency: [
    { title: "5 Signs Your Brand Needs a Refresh", excerpt: "How to tell when your visual identity is holding your growth back.", author: "Studio Team", date: "2026-01-15", readTime: "4 min read" },
    { title: "What Makes a Website Actually Convert", excerpt: "The design and copy decisions that turn visitors into customers.", author: "Studio Team", date: "2026-01-08", readTime: "5 min read" },
  ],
  Consulting: [
    { title: "Three Levers for Sustainable Growth", excerpt: "The frameworks we use to help clients scale without burning out their teams.", author: "Advisory Team", date: "2026-01-15", readTime: "6 min read" },
    { title: "When to Bring in Outside Perspective", excerpt: "How to know if your team needs an external advisor - and when it doesn't.", author: "Advisory Team", date: "2026-01-08", readTime: "4 min read" },
  ],
  Fitness: [
    { title: "Why Consistency Beats Intensity", excerpt: "The training principle our most successful members swear by.", author: "Coach Team", date: "2026-01-15", readTime: "3 min read" },
    { title: "Fueling Your Workouts: A Beginner's Guide", excerpt: "Simple nutrition changes that make a measurable difference in performance.", author: "Coach Team", date: "2026-01-08", readTime: "5 min read" },
  ],
  Technology: [
    { title: "What's New This Quarter", excerpt: "A roundup of the latest features, integrations, and performance improvements.", author: "Product Team", date: "2026-01-15", readTime: "4 min read" },
    { title: "How Teams Are Using Our API in Production", excerpt: "Three real-world integration patterns from our fastest-growing customers.", author: "Engineering Team", date: "2026-01-08", readTime: "6 min read" },
  ],
  Finance: [
    { title: "Year-End Tax Moves Worth Making", excerpt: "A few practical steps that can meaningfully reduce your tax bill.", author: "Advisory Team", date: "2026-01-15", readTime: "5 min read" },
    { title: "Building a Retirement Plan That Actually Works", excerpt: "The fundamentals we walk every client through before anything else.", author: "Advisory Team", date: "2026-01-08", readTime: "5 min read" },
  ],
  Portfolio: [
    { title: "Behind the Scenes of a Recent Project", excerpt: "A look at the process, from first sketch to final delivery.", author: "Me", date: "2026-01-15", readTime: "4 min read" },
    { title: "Tools I Can't Work Without", excerpt: "The software and hardware in my everyday creative workflow.", author: "Me", date: "2026-01-08", readTime: "3 min read" },
  ],
  Legal: [
    { title: "What to Expect During Your First Consultation", excerpt: "A walkthrough of our process so you know exactly what's ahead.", author: "Firm Team", date: "2026-01-15", readTime: "4 min read" },
    { title: "Common Contract Mistakes Small Businesses Make", excerpt: "Simple clauses that prevent costly disputes down the road.", author: "Firm Team", date: "2026-01-08", readTime: "5 min read" },
  ],
  "Local Business": [
    { title: "Meet the Team Behind the Counter", excerpt: "Get to know the people who make this place what it is.", author: "Team", date: "2026-01-15", readTime: "3 min read" },
    { title: "What's New This Season", excerpt: "The latest additions and updates from around the shop.", author: "Team", date: "2026-01-08", readTime: "3 min read" },
  ],
  Startup: [
    { title: "Our Product Roadmap for 2026", excerpt: "What we're building next, based directly on customer feedback.", author: "Founding Team", date: "2026-01-15", readTime: "4 min read" },
    { title: "Lessons from Our First 1,000 Customers", excerpt: "What surprised us, what we got wrong, and what we'd do again.", author: "Founding Team", date: "2026-01-08", readTime: "6 min read" },
  ],
  default: [
    { title: "Industry Trends to Watch in 2026", excerpt: "Stay ahead of the curve with these emerging trends shaping the industry.", author: "Team", date: "2026-01-15", readTime: "5 min read" },
    { title: "How We Deliver Exceptional Results", excerpt: "A look at our process and commitment to quality that sets us apart.", author: "Team", date: "2026-01-10", readTime: "4 min read" },
  ],
};

/* -------------------------------------------------------------------------- */
/*                          Helper Functions                                  */
/* -------------------------------------------------------------------------- */

// Canonical industry names used as keys across every content dictionary
// above. The questionnaire sends the client's lowercase/hyphenated business
// type slug (e.g. "real-estate", "local-business") - this maps those slugs
// (and a few legacy Title-Case variants) onto the canonical names so content
// selection actually varies by business type instead of silently falling
// through to the generic "default" bucket for almost everyone.
const INDUSTRY_ALIASES: Record<string, string> = {
  restaurant: "Restaurant",
  cafe: "Restaurant",
  "cafe / coffee shop": "Restaurant",
  agency: "Agency",
  consulting: "Consulting",
  "real-estate": "Real Estate",
  "real estate": "Real Estate",
  healthcare: "Healthcare",
  education: "Education",
  fitness: "Fitness",
  travel: "Travel",
  technology: "Technology",
  "corporate-it": "Technology",
  "corporate it": "Technology",
  hotel: "Hotel",
  photography: "Portfolio",
  "interior-design": "Agency",
  "interior design": "Agency",
  finance: "Finance",
  beauty: "Beauty",
  portfolio: "Portfolio",
  "local-business": "Local Business",
  "local business": "Local Business",
  legal: "Legal",
  automotive: "Automotive",
  startup: "Startup",
  fashion: "Fashion",
  electronics: "Electronics",
  grocery: "Grocery",
  furniture: "Furniture",
  sports: "Sports",
  jewelry: "Jewelry",
  books: "Books",
  "pet-store": "Pet Store",
  "pet store": "Pet Store",
  "home-services": "Home Services",
  "home services": "Home Services",
  other: "Other",
};

function getIndustry(industry: string): string {
  if (!industry) return "Other";
  const normalized = industry.trim().toLowerCase();
  return INDUSTRY_ALIASES[normalized] || industry;
}

// The client sends the Typography step's selection id (e.g. "playfair"),
// not a real CSS font-family name. Most ids happened to survive because CSS
// font-family matching is ASCII case-insensitive (so "poppins" ~= "Poppins"),
// but "playfair", "opensans", and "cormorant" don't match their real family
// names ("Playfair Display", "Open Sans", "Cormorant Garamond") at all, so
// those three silently fell back to the design style's default font.
const TYPOGRAPHY_FONT_MAP: Record<string, string> = {
  inter: "Inter",
  poppins: "Poppins",
  playfair: "Playfair Display",
  montserrat: "Montserrat",
  lato: "Lato",
  roboto: "Roboto",
  merriweather: "Merriweather",
  cormorant: "Cormorant Garamond",
  nunito: "Nunito",
  opensans: "Open Sans",
};

function getFontFamily(typographyId: string): string {
  if (!typographyId) return "";
  return TYPOGRAPHY_FONT_MAP[typographyId.trim().toLowerCase()] || typographyId;
}

// The Hero's CTA button used to always link to /contact regardless of what
// it said - "View Our Menu" landed on the Contact form, "View My Work"
// never reached the Portfolio page, etc. Route each known CTA label to the
// page it actually names, but only when that page was selected; otherwise
// fall back to Contact, which always exists.
const CTA_TARGET_PAGE: Record<string, string> = {
  "View Our Menu": "menu",
  "Explore Courses": "courses",
  "Browse Properties": "properties",
  "Plan Your Trip": "destinations",
  "Browse Inventory": "inventory",
  "View My Work": "portfolio",
  "Start Free Trial": "pricing",
  "Get Started Free": "pricing",
};

function resolveCtaLink(ctaText: string, selectedPages: string[]): string {
  const targetSlug = CTA_TARGET_PAGE[ctaText];
  if (targetSlug && selectedPages.includes(targetSlug)) return `/${targetSlug}`;
  return "/contact";
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

// BlogPreview/BlogGrid use post.id as a React key and link to /blog/{slug},
// plus optionally show post.image and post.category - none of which exist on
// the raw BLOG_POSTS entries. Without this the blog sections rendered but
// every card linked to "/blog/undefined" and used index-only keys.
function withBlogMeta(
  posts: Array<{ title: string; excerpt: string; author?: string; date?: string; readTime?: string; image?: string | null; category?: string }>,
  industry: string,
  imagePaths: string[] = []
): Array<Record<string, unknown>> {
  return posts.map((post, i) => ({
    author: "",
    date: "",
    readTime: "",
    ...post,
    id: String(i + 1),
    slug: (post.title || `post-${i + 1}`)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || `post-${i + 1}`,
    image: post.image ?? imagePaths[i] ?? null,
    category: post.category || industry,
  }));
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* -------------------------------------------------------------------------- */
/*                  Per-Page Custom Content Overrides                         */
/* -------------------------------------------------------------------------- */

// What the client typed in for a specific page's Hero / About-story / CTA
// sections while building the questionnaire (see StepPageDetail on the
// client). Any field left blank falls back to the mock industry content -
// custom text always wins over the mock default when provided.
export interface PageContentOverride {
  hero?: {
    headline?: string;
    subheadline?: string;
    ctaText?: string;
    // Hero2 (Split Editorial)'s social-proof line, e.g. "Trusted by 1,000+".
    socialProofText?: string;
    socialProofSubtext?: string;
    // Hero3 (Centered Statement)'s second button and 3-stat bar.
    secondaryCtaText?: string;
    stat1Value?: string;
    stat1Label?: string;
    stat2Value?: string;
    stat2Label?: string;
    stat3Value?: string;
    stat3Label?: string;
  };
  about_story?: { content?: string };
  cta?: { headline?: string; subheadline?: string; ctaText?: string };
}

function heroCopy(
  pageContent: PageContentOverride | undefined,
  fallbackTitle: string,
  fallbackSubtitle: string
): { title: string; subtitle: string } {
  const override = pageContent?.hero;
  return {
    title: override?.headline?.trim() || fallbackTitle,
    subtitle: override?.subheadline?.trim() || fallbackSubtitle,
  };
}

function ctaCopy(
  pageContent: PageContentOverride | undefined,
  fallback: { headline: string; subheadline: string; ctaText: string }
): { headline: string; subheadline: string; ctaText: string } {
  const override = pageContent?.cta;
  return {
    headline: override?.headline?.trim() || fallback.headline,
    subheadline: override?.subheadline?.trim() || fallback.subheadline,
    ctaText: override?.ctaText?.trim() || fallback.ctaText,
  };
}

function aboutStoryCopy(pageContent: PageContentOverride | undefined, fallbackContent: string): string {
  return pageContent?.about_story?.content?.trim() || fallbackContent;
}

// Mixes a hex color toward white or black (amount 0 = pure color, 1 = pure
// white/black). Used to give backgrounds a subtle brand tint instead of a
// flat neutral, so the chosen primary color is visible beyond just buttons -
// including in dark mode, which used to ignore primaryColor entirely and
// hardcode the exact same "#0F0F0F" for every dark-mode design style. That's
// why Premium and Luxury (both dark-mode by default) looked like the same
// color theme: same flat black page, same greys, only a small accent color
// differed.
function mixWithWhite(hex: string, amount: number, towards: "white" | "black" = "white"): string {
  const normalized = hex.replace("#", "");
  const full = normalized.length === 3
    ? normalized.split("").map((c) => c + c).join("")
    : normalized;
  const num = Number.parseInt(full, 16);
  if (Number.isNaN(num)) return hex;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  const target = towards === "white" ? 255 : 0;
  const mix = (channel: number) => Math.round(channel + (target - channel) * amount);
  const toHex = (channel: number) => channel.toString(16).padStart(2, "0");
  return `#${toHex(mix(r))}${toHex(mix(g))}${toHex(mix(b))}`;
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
    const fontStyle = getFontFamily(answers.fontStyle || "");
    const accentStyle = answers.accentStyle || "";
    const logo = answers.logo || null;
    const heroImage = answers.heroImage || null;

    const selectedPages = answers.selectedPages || answers.pages || ["home"];
    const homepageSections = answers.homepageSections || [];
    const pageSections = answers.pageSections || {};
    const componentSelections = answers.componentSelections || {};
    const socialMedia = answers.socialMedia || {};
    const themeMode = answers.themeMode || "auto";
    const footerContent = answers.footerContent || {};

    // Real contact details typed in by the client. Only fall back to generic
    // placeholder text when the field was genuinely left blank, so the
    // generated site always reflects what the client actually entered.
    const contactPhone = answers.phone || "+1 (555) 123-4567";
    const contactEmail = answers.email || "hello@example.com";
    const contactAddress = answers.address || answers.location || "123 Business St, Suite 100";
    const contactContent = answers.contactContent || {};

    const userServices = answers.services || [];
    const userTestimonials = answers.testimonials || [];
    const userFaq = answers.faq || [];
    const userPortfolio = answers.portfolioItems || [];
    const userGalleryImages = answers.galleryImages || [];
    const userTeam = answers.teamMembers || [];
    const userWhyChooseUs = answers.whyChooseUsReasons || [];
    const userAboutValues = answers.aboutValues || [];
    const userPricingPlans = answers.pricingPlans || [];
    const userMenuItems = answers.menuItems || [];
    const userDailySpecials = answers.dailySpecials || [];
    const userBlogPosts = answers.blogPosts || [];
    const userStats = answers.stats || [];
    const userTimeline = answers.timeline || [];
    const userBusinessHours = answers.businessHours || [];
    const userClassSchedule = answers.classSchedule || [];
    const userCourses = answers.courses || [];
    const userDestinations = answers.destinations || [];
    const userSolutions = answers.solutions || [];
    const userIndustries = answers.industries || [];
    const userCaseStudies = answers.caseStudies || [];
    const userRooms = answers.rooms || [];
    const userAmenities = answers.amenities || [];
    const userExperiences = answers.experiences || [];
    const userTravelPackages = answers.travelPackages || [];
    const userProcess = answers.process || [];
    const userPrograms = answers.programs || [];
    const userFacilities = answers.facilities || [];
    const userSkills = answers.skills || [];

    // Custom Hero / About-story / CTA text the client typed in per page
    // (see StepPageDetail on the client). Keyed by page slug.
    const pageContentMap: Record<string, PageContentOverride> = answers.pageContent || {};

    const imagePaths = (assets || [])
      .filter((a: any) => a.type === "image" || a.mimeType?.startsWith("image/"))
      .map((a: any) => a.url || a.path || "");

    const config: BusinessTypeConfig = BUSINESS_TYPES[industry] || BUSINESS_TYPES["Other"];

    const pages: Array<Record<string, unknown>> = [];

    // Normalized page slugs (selectedPages can be a plain string[] or an
    // array of {slug} objects) - used so CTA buttons only ever link to a
    // page that's actually part of this site.
    const selectedPageSlugs: string[] = selectedPages.map((p: any) => (typeof p === "string" ? p : p?.slug || "home"));

    for (const pageSlug of selectedPages) {
      const slug = typeof pageSlug === "string" ? pageSlug : (pageSlug as any).slug || "home";

      switch (slug) {
        case "home":
          pages.push({
            slug: "home",
            title: "Home",
            sections: this._buildHomePageSections({
              businessName, businessDescription, industry, config,
              logoPath: logo, heroImage, imagePaths, homepageSections: pageSections["home"] || homepageSections, socialMedia,
              userServices, userTestimonials, userFaq,
              userPortfolio, userGalleryImages, userTeam, userWhyChooseUs, userPricingPlans,
              userBlogPosts,
              componentSelections, themeStyle,
              contactPhone, contactEmail, contactAddress,
              selectedPages: selectedPageSlugs,
              pageContent: pageContentMap["home"],
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
              pageContent: pageContentMap["about"],
              userTeam, userStats, userTimeline, userAboutValues,
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
              userServices, userWhyChooseUs, userTestimonials,
              componentSelections, themeStyle,
              pageSections: pageSections[slug] || [],
              pageContent: pageContentMap[slug],
            }),
          });
          break;
        case "portfolio":
        case "portfolio_details":
          pages.push({
            slug,
            title: slug === "portfolio" ? "Portfolio" : "Portfolio Details",
            sections: this._buildPortfolioSections({
              businessName, industry, imagePaths, userPortfolio, componentSelections, themeStyle,
              pageContent: pageContentMap[slug],
            }),
          });
          break;
        case "pricing":
          pages.push({
            slug: "pricing",
            title: "Pricing",
            sections: this._buildPricingSections({
              businessName, industry, userPricingPlans, componentSelections, themeStyle,
              pageContent: pageContentMap["pricing"],
            }),
          });
          break;
        case "blog":
        case "blog_details":
          pages.push({
            slug,
            title: slug === "blog" ? "Blog" : "Blog Details",
            sections: this._buildBlogSections({
              businessName, industry, userBlogPosts, componentSelections, themeStyle,
              pageContent: pageContentMap[slug],
            }),
          });
          break;
        case "contact":
          pages.push({
            slug: "contact",
            title: "Contact",
            sections: this._buildContactSections({
              contactContent, projectId,
              businessName, businessDescription, industry,
              componentSelections, themeStyle,
              contactPhone, contactEmail, contactAddress,
              pageSections: pageSections["contact"] || [],
              userBusinessHours,
              pageContent: pageContentMap["contact"],
            }),
          });
          break;
        case "faq":
          pages.push({
            slug: "faq",
            title: "FAQ",
            sections: this._buildFaqSections({
              businessName, industry, userFaq, componentSelections, themeStyle,
              pageContent: pageContentMap["faq"],
            }),
          });
          break;
        case "testimonials":
          pages.push({
            slug: "testimonials",
            title: "Testimonials",
            sections: this._buildTestimonialsSections({
              businessName, industry, userTestimonials, componentSelections, themeStyle,
              pageContent: pageContentMap["testimonials"],
            }),
          });
          break;
        case "gallery":
          pages.push({
            slug: "gallery",
            title: "Gallery",
            sections: this._buildGallerySections({
              businessName, industry, imagePaths, userGalleryImages, componentSelections, themeStyle,
              pageContent: pageContentMap["gallery"],
            }),
          });
          break;
        case "menu":
          pages.push({
            slug: "menu",
            title: "Menu",
            sections: this._buildMenuSections({
              businessName, industry, userMenuItems, userDailySpecials, componentSelections, themeStyle,
              pageContent: pageContentMap["menu"],
            }),
          });
          break;
        case "team":
          pages.push({
            slug: "team",
            title: "Team",
            sections: this._buildTeamSections({
              businessName, industry, userTeam, componentSelections, themeStyle,
              pageContent: pageContentMap["team"],
            }),
          });
          break;
        case "properties":
          pages.push({
            slug: "properties",
            title: "Properties",
            sections: this._buildPropertiesSections({
              businessName, industry, userTeam, componentSelections, themeStyle,
              pageSections: pageSections["properties"] || [],
              pageContent: pageContentMap["properties"],
            }),
          });
          break;
        case "courses":
          pages.push({
            slug: "courses",
            title: "Courses",
            sections: this._buildCoursesSections({
              businessName, industry, userCourses, userWhyChooseUs, userTestimonials, componentSelections, themeStyle,
              pageSections: pageSections["courses"] || [],
              pageContent: pageContentMap["courses"],
            }),
          });
          break;
        case "classes":
          pages.push({
            slug: "classes",
            title: "Classes",
            sections: this._buildClassesSections({
              businessName, industry, userClassSchedule, userTeam, userPricingPlans, componentSelections, themeStyle,
              pageSections: pageSections["classes"] || [],
              pageContent: pageContentMap["classes"],
            }),
          });
          break;
        case "destinations":
          pages.push({
            slug: "destinations",
            title: "Destinations",
            sections: this._buildDestinationsSections({
              businessName, industry, userDestinations, userDailySpecials, userTestimonials, componentSelections, themeStyle,
              pageSections: pageSections["destinations"] || [],
              pageContent: pageContentMap["destinations"],
            }),
          });
          break;
        case "features":
          pages.push({
            slug: "features",
            title: "Features",
            sections: this._buildFeaturesSections({
              businessName, industry, userServices, userWhyChooseUs, userTestimonials, componentSelections, themeStyle,
              pageSections: pageSections["features"] || [],
              pageContent: pageContentMap["features"],
            }),
          });
          break;
        case "inventory":
          pages.push({
            slug: "inventory",
            title: "Inventory",
            sections: this._buildInventorySections({
              businessName, industry, userPortfolio, imagePaths, userTestimonials, componentSelections, themeStyle,
              pageSections: pageSections["inventory"] || [],
              pageContent: pageContentMap["inventory"],
            }),
          });
          break;
        case "solutions":
          pages.push({
            slug: "solutions",
            title: "Solutions",
            sections: this._buildSolutionsSections({
              businessName, industry, userSolutions, componentSelections, themeStyle,
              pageContent: pageContentMap["solutions"],
            }),
          });
          break;
        case "case-studies":
          pages.push({
            slug: "case-studies",
            title: "Case Studies",
            sections: this._buildCaseStudiesSections({
              businessName, industry, userCaseStudies, userTestimonials, componentSelections, themeStyle,
              pageSections: pageSections["case-studies"] || [],
              pageContent: pageContentMap["case-studies"],
            }),
          });
          break;
        case "industries":
          pages.push({
            slug: "industries",
            title: "Industries",
            sections: this._buildIndustriesSections({
              businessName, industry, userIndustries, componentSelections, themeStyle,
              pageContent: pageContentMap["industries"],
            }),
          });
          break;
        case "agents":
          pages.push({
            slug: "agents",
            title: "Agents",
            sections: this._buildAgentsSections({
              businessName, industry, userTeam, componentSelections, themeStyle,
              pageContent: pageContentMap["agents"],
            }),
          });
          break;
        case "location":
          pages.push({
            slug: "location",
            title: "Location",
            sections: this._buildLocationSections({
              businessName, industry, userBusinessHours, componentSelections, themeStyle,
              contactPhone, contactEmail, contactAddress, contactContent,
              pageSections: pageSections["location"] || [],
              pageContent: pageContentMap["location"],
            }),
          });
          break;
        case "our-story":
          pages.push({
            slug: "our-story",
            title: "Our Story",
            sections: this._buildOurStorySections({
              businessName, businessDescription, industry, userTimeline, componentSelections, themeStyle,
              pageSections: pageSections["our-story"] || [],
              pageContent: pageContentMap["our-story"],
            }),
          });
          break;
        case "rooms":
          pages.push({
            slug: "rooms",
            title: "Rooms",
            sections: this._buildRoomsSections({
              businessName, industry, userRooms, componentSelections, themeStyle,
              pageContent: pageContentMap["rooms"],
            }),
          });
          break;
        case "amenities":
          pages.push({
            slug: "amenities",
            title: "Amenities",
            sections: this._buildAmenitiesSections({
              businessName, industry, userAmenities, componentSelections, themeStyle,
              pageContent: pageContentMap["amenities"],
            }),
          });
          break;
        case "experiences":
          pages.push({
            slug: "experiences",
            title: "Experiences",
            sections: this._buildExperiencesSections({
              businessName, industry, userExperiences, userTestimonials, componentSelections, themeStyle,
              pageSections: pageSections["experiences"] || [],
              pageContent: pageContentMap["experiences"],
            }),
          });
          break;
        case "travel-packages":
          pages.push({
            slug: "travel-packages",
            title: "Travel Packages",
            sections: this._buildTravelPackagesSections({
              businessName, industry, userTravelPackages, componentSelections, themeStyle,
              pageContent: pageContentMap["travel-packages"],
            }),
          });
          break;
        case "process":
          pages.push({
            slug: "process",
            title: "Process",
            sections: this._buildProcessSections({
              businessName, industry, userProcess, componentSelections, themeStyle,
              pageContent: pageContentMap["process"],
            }),
          });
          break;
        case "programs":
          pages.push({
            slug: "programs",
            title: "Programs",
            sections: this._buildProgramsSections({
              businessName, industry, userPrograms, userTestimonials, componentSelections, themeStyle,
              pageSections: pageSections["programs"] || [],
              pageContent: pageContentMap["programs"],
            }),
          });
          break;
        case "trainers":
          pages.push({
            slug: "trainers",
            title: "Trainers",
            sections: this._buildTrainersSections({
              businessName, industry, userTeam, componentSelections, themeStyle,
              pageContent: pageContentMap["trainers"],
            }),
          });
          break;
        case "doctors":
          pages.push({
            slug: "doctors",
            title: "Doctors",
            sections: this._buildDoctorsSections({
              businessName, industry, userTeam, componentSelections, themeStyle,
              pageContent: pageContentMap["doctors"],
            }),
          });
          break;
        case "facilities":
          pages.push({
            slug: "facilities",
            title: "Facilities",
            sections: this._buildFacilitiesSections({
              businessName, industry, userFacilities, componentSelections, themeStyle,
              pageContent: pageContentMap["facilities"],
            }),
          });
          break;
        case "instructors":
          pages.push({
            slug: "instructors",
            title: "Instructors",
            sections: this._buildInstructorsSections({
              businessName, industry, userTeam, componentSelections, themeStyle,
              pageContent: pageContentMap["instructors"],
            }),
          });
          break;
        case "skills":
          pages.push({
            slug: "skills",
            title: "Skills",
            sections: this._buildSkillsSections({
              businessName, industry, userSkills, componentSelections, themeStyle,
              pageContent: pageContentMap["skills"],
            }),
          });
          break;
        case "projects":
          pages.push({
            slug: "projects",
            title: "Projects",
            sections: this._buildPortfolioSections({
              businessName, industry, imagePaths, userPortfolio, componentSelections, themeStyle,
              pageContent: pageContentMap["projects"],
            }),
          });
          break;
        case "experience":
          pages.push({
            slug: "experience",
            title: "Experience",
            sections: this._buildExperienceSections({
              businessName, industry, userTimeline, componentSelections, themeStyle,
              pageContent: pageContentMap["experience"],
            }),
          });
          break;
        default:
          pages.push({
            slug,
            title: capitalize(slug.replace(/_/g, " ")),
            sections: this._buildGenericSections({
              businessName, industry, componentSelections, themeStyle,
              pageContent: pageContentMap[slug],
            }),
          });
          break;
      }
    }

    // Navbar and footer are generated like any other section - driven by the
    // client's componentSelections - instead of being hardcoded by the
    // renderer, so the chosen navbar/footer style is what actually ships.
    const navbarComp = resolveComponent(componentSelections, "navbar", "Navbar2", themeStyle);
    const footerComp = resolveComponent(componentSelections, "footer", "Footer2", themeStyle);
    const chromeLinks = pages.map((p: any) => ({ label: p.title, href: `/${p.slug}` }));
    const chromeSocialLinks = Object.entries(socialMedia).map(([platform, href]) => ({ platform, href }));
    for (const page of pages) {
      const p = page as any;
      p.sections.forEach((s: any) => { s.order = s.order + 1; });
      p.sections.unshift({
        id: "navbar",
        component: navbarComp,
        props: {
          logo,
          brandName: businessName,
          links: chromeLinks,
        },
        order: 0,
      });
      p.sections.push({
        id: "footer",
        component: footerComp,
        props: {
          brandName: businessName,
          description: (footerContent.tagline || "").trim() || businessDescription || `${businessName} - Professional services`,
          links: chromeLinks,
          socialLinks: chromeSocialLinks,
          copyrightText: (footerContent.copyrightText || "").trim() || undefined,
          ctaHeading: (footerContent.ctaHeading || "").trim() || undefined,
          ctaSubtext: (footerContent.ctaSubtext || "").trim() || undefined,
          ctaButtonText: (footerContent.ctaButtonText || "").trim() || undefined,
          // Was hardcoded to "#contact" inside Footer1 itself - a fragment
          // with no matching element anywhere on the page, so the button
          // didn't go anywhere when clicked.
          ctaLink: resolveCtaLink((footerContent.ctaButtonText || "").trim() || "Start a Project", selectedPages),
        },
        order: p.sections.length,
      });
    }

    const theme = this._buildTheme({
      primaryColor, secondaryColor, fontStyle, themeStyle, themeMode, accentStyle, config,
      sectionColors: answers.sectionColors || {},
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
        copyright: (footerContent.copyrightText || "").trim() || `© ${new Date().getFullYear()} ${businessName}. All rights reserved.`,
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
    imagePaths: string[]; logoPath: string | null; heroImage?: string | null;
    componentSelections: Record<string, string>; themeStyle: string;
    selectedPages: string[];
    pageContent?: PageContentOverride;
  }): Record<string, unknown> {
    const content = HERO_CONTENT[ctx.industry] || {
      headline: `Welcome to ${ctx.businessName}`,
      subheadline: ctx.businessDescription || "We deliver exceptional results for our clients",
      ctaText: "Get Started",
      badge: "Welcome",
    };

    const defaultHeadline = content.headline.replace("{name}", ctx.businessName);
    const override = ctx.pageContent?.hero;
    const headline = override?.headline?.trim() || defaultHeadline;
    const subheadline = override?.subheadline?.trim() || content.subheadline;
    const ctaText = override?.ctaText?.trim() || content.ctaText;
    const heroComp = resolveComponent(ctx.componentSelections, "hero", "Hero1", ctx.themeStyle);
    const heroOverride = ctx.pageContent?.hero as Record<string, string> | undefined;
    const stat = (n: number, fallback: { value: string; label: string }) => ({
      value: heroOverride?.[`stat${n}Value`]?.trim() || fallback.value,
      label: heroOverride?.[`stat${n}Label`]?.trim() || fallback.label,
    });

    return {
      id: "hero",
      component: heroComp,
      props: {
        headline,
        subheadline,
        ctaText,
        ctaLink: resolveCtaLink(ctaText, ctx.selectedPages),
        badge: content.badge,
        // Hero1-5 all read `backgroundImage`, not `image` - this used to be
        // the wrong prop key entirely, so an uploaded hero image was silently
        // dropped and every image-based hero style just fell back to its
        // default gradient. Hero1 (Full-Screen Statement), Hero2 (Split
        // Editorial), and Hero4 (Image-Focused) are actually built around a
        // photo - the other layouts are text-first, so don't hand them an
        // image even if one was uploaded while a different hero style was
        // selected.
        backgroundImage: IMAGE_HERO_COMPONENTS.has(heroComp) ? ctx.heroImage || ctx.imagePaths[0] || null : null,
        logo: ctx.logoPath || null,
        // Hero2's social-proof line and Hero3's second button/stats bar -
        // harmless no-ops for every other hero, which just ignores whatever
        // extra props it doesn't read.
        socialProofText: heroOverride?.socialProofText?.trim() || undefined,
        socialProofSubtext: heroOverride?.socialProofSubtext?.trim() || undefined,
        secondaryCtaText: heroOverride?.secondaryCtaText?.trim() || undefined,
        stats: [
          stat(1, { value: "500+", label: "Projects" }),
          stat(2, { value: "98%", label: "Satisfaction" }),
          stat(3, { value: "24/7", label: "Support" }),
        ],
      },
      order: 0,
    };
  }

  private _buildHomePageSections(ctx: {
    businessName: string; businessDescription: string; industry: string;
    config: BusinessTypeConfig; logoPath: string | null; heroImage?: string | null; imagePaths: string[];
    homepageSections: string[]; socialMedia: Record<string, string>;
    userServices: Array<{ title: string; description: string; icon: string }>;
    userTestimonials: Array<{ name: string; role: string; content: string; rating: number; avatar?: string | null }>;
    userFaq: Array<{ question: string; answer: string }>;
    userPortfolio: Array<{ title: string; description: string; image?: string | null }>;
    userGalleryImages: Array<{ url: string; alt?: string }>;
    userTeam: Array<{ name: string; role: string; bio?: string; avatar?: string | null }>;
    userWhyChooseUs: Array<{ title: string; description: string }>;
    userPricingPlans: Array<{ name: string; price: string; period?: string; features: string[]; popular?: boolean }>;
    userBlogPosts: Array<{ title: string; excerpt: string; author?: string; date?: string; image?: string | null; category?: string }>;
    componentSelections: Record<string, string>; themeStyle: string;
    contactPhone: string; contactEmail: string; contactAddress: string;
    selectedPages: string[];
    pageContent?: PageContentOverride;
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
        case "gallery": {
          // Gallery1/Gallery2 both expect `images` as a flat array of URL
          // strings (they render <img src={img}>), not {url,alt} objects -
          // passing objects rendered every tile as a broken "[object Object]" src.
          const galleryUrls = ctx.userGalleryImages.length > 0
            ? ctx.userGalleryImages.map((g) => g.url)
            : ctx.imagePaths.length > 0
              ? ctx.imagePaths
              : Array.from({ length: 6 }, () => null as unknown as string);
          sections.push({
            id: "gallery",
            component: resolveComponent(ctx.componentSelections, "gallery", "Gallery1", ctx.themeStyle),
            props: {
              title: "Our Gallery",
              subtitle: "Take a look at our work",
              images: galleryUrls,
            },
            order: order++,
          });
          break;
        }
        case "faq":
          sections.push({
            id: "faq",
            component: resolveComponent(ctx.componentSelections, "faq", "FAQ1", ctx.themeStyle),
            props: {
              title: "Frequently Asked Questions",
              subtitle: "Find answers to common questions",
              // FAQ1/FAQ2 both destructure `faqs` (plural) - the old key
              // meant this prop was always undefined and faqs.map() threw,
              // crashing the section entirely.
              faqs: faq,
            },
            order: order++,
          });
          break;
        case "cta":
          sections.push({
            id: "cta",
            component: resolveComponent(ctx.componentSelections, "cta", "CTA2", ctx.themeStyle),
            props: {
              ...ctaCopy(ctx.pageContent, {
                headline: "Ready to Get Started?",
                subheadline: "Contact us today to learn how we can help you",
                ctaText: "Contact Us",
              }),
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
              // Portfolio1/2/3 all destructure `projects`, not `items` - the
              // old key meant projects.map() ran on undefined and crashed
              // the section entirely. Portfolio3 also uses `category` to
              // build its filter pills, so default it for custom entries.
              projects: ctx.userPortfolio.length > 0
                ? ctx.userPortfolio.map((p) => ({ category: "Featured", ...p }))
                : ctx.imagePaths.slice(0, 6).map((url, i) => ({
                  title: `Project ${i + 1}`,
                  description: "A showcase of our work",
                  image: url,
                  category: "Featured",
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
              plans: ctx.userPricingPlans.length > 0
                ? ctx.userPricingPlans
                : [
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
            component: resolveComponent(ctx.componentSelections, "why_choose_us", "WhyChooseUs", ctx.themeStyle),
            props: {
              title: "Why Choose Us",
              subtitle: "What sets us apart",
              reasons: ctx.userWhyChooseUs.length > 0
                ? ctx.userWhyChooseUs
                : [
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
            component: resolveComponent(ctx.componentSelections, "about_story", "AboutStory", ctx.themeStyle),
            props: {
              title: getAboutTitle(ctx.industry),
              subtitle: "Learn about our journey",
              content: aboutStoryCopy(ctx.pageContent, `${ctx.businessName} was founded with a vision to deliver exceptional ${ctx.industry.toLowerCase()} services. Over the years, we've built a reputation for quality, innovation, and customer satisfaction. Our team of dedicated professionals works tirelessly to exceed expectations and deliver results that make a difference.`),
              // AboutStory reads `image`, not `backgroundImage` - this was
              // silently dropped, so an uploaded photo never showed here.
              image: ctx.imagePaths[0] || null,
            },
            order: order++,
          });
          break;
        case "team":
          sections.push({
            id: "team",
            component: resolveComponent(ctx.componentSelections, "team", "TeamSection", ctx.themeStyle),
            props: {
              title: "Meet Our Team",
              subtitle: "The people behind our success",
              members: ctx.userTeam.length > 0
                ? ctx.userTeam
                : [
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
              phone: ctx.contactPhone,
              email: ctx.contactEmail,
              address: ctx.contactAddress,
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
              posts: ctx.userBlogPosts.length > 0
                ? withBlogMeta(ctx.userBlogPosts, ctx.industry, ctx.imagePaths).slice(0, 3)
                : withBlogMeta(getBlogPosts(ctx.industry), ctx.industry, ctx.imagePaths).slice(0, 3),
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
          ...ctaCopy(ctx.pageContent, {
            headline: "Ready to Get Started?",
            subheadline: "Contact us today to learn how we can help you",
            ctaText: "Contact Us",
          }),
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
    pageContent?: PageContentOverride;
    userTeam: Array<{ name: string; role: string; bio?: string; avatar?: string | null }>;
    userStats: Array<{ label: string; value: string }>;
    userTimeline: Array<{ year: string; title: string; description?: string }>;
    userAboutValues: Array<{ title: string; description: string; icon?: string }>;
  }): Array<Record<string, unknown>> {
    const hero = heroCopy(ctx.pageContent, getAboutTitle(ctx.industry), `Learn more about ${ctx.businessName}`);
    const sections: Array<Record<string, unknown>> = [
      {
        id: "page_hero",
        // Always the compact page-title bar, never the Home hero variant -
        // resolveComponent would otherwise resolve "hero" to whatever
        // Hero1-5 the client picked for the Home page, since both share
        // the same "hero" component-selection category. That meant every
        // single page in the site rendered the exact same full hero.
        component: "PageHero",
        props: {
          title: hero.title,
          subtitle: hero.subtitle,
        },
        order: 0,
      },
    ];
    let order = 1;

    // This page's body used to be a fixed list regardless of which section
    // checkboxes were selected - Statistics and Timeline had no effect at
    // all. Now it actually reflects the client's choices, defaulting to the
    // previous fixed set (story/values/team) when nothing is selected yet.
    const selected = ctx.pageSections && ctx.pageSections.length > 0 ? ctx.pageSections : ["story", "values", "team"];

    for (const sectionId of selected) {
      switch (sectionId) {
        case "story":
          sections.push({
            id: "about_story",
            component: resolveComponent(ctx.componentSelections, "about_story", "AboutStory", ctx.themeStyle),
            props: {
              title: getAboutTitle(ctx.industry),
              subtitle: "Our Journey",
              content: aboutStoryCopy(ctx.pageContent, `${ctx.businessName} was founded with a vision to deliver exceptional ${ctx.industry.toLowerCase()} services. ${ctx.businessDescription || "We are committed to quality, innovation, and customer satisfaction."} Over the years, we've built a reputation for excellence, serving hundreds of satisfied clients. Our team of dedicated professionals brings together diverse expertise and a shared passion for delivering outstanding results.`),
              image: ctx.imagePaths[1] || ctx.imagePaths[0] || null,
            },
            order: order++,
          });
          break;
        case "values": {
          const defaultValues = [
            { title: "Excellence", description: "We strive for excellence in everything we do, setting high standards and exceeding expectations.", icon: "star" },
            { title: "Integrity", description: "We conduct our business with honesty, transparency, and ethical practices.", icon: "shield" },
            { title: "Innovation", description: "We embrace new ideas and continuously improve our approach to better serve our clients.", icon: "lightbulb" },
            { title: "Customer Focus", description: "Our clients are at the heart of every decision we make.", icon: "heart" },
          ];
          sections.push({
            id: "about_values",
            component: resolveComponent(ctx.componentSelections, "about_values", "AboutValues", ctx.themeStyle),
            props: {
              title: "Our Values",
              subtitle: "What drives us every day",
              values: ctx.userAboutValues.length > 0 ? ctx.userAboutValues : defaultValues,
            },
            order: order++,
          });
          break;
        }
        case "team":
          sections.push({
            id: "team",
            component: resolveComponent(ctx.componentSelections, "team", "TeamSection", ctx.themeStyle),
            props: {
              title: "Meet Our Team",
              subtitle: "The talented people behind our success",
              members: ctx.userTeam.length > 0
                ? ctx.userTeam
                : [
                  { name: "John Smith", role: "Founder & CEO", avatar: null, bio: "Visionary leader with 15+ years of industry experience." },
                  { name: "Jane Doe", role: "Creative Director", avatar: null, bio: "Award-winning creative with a passion for design." },
                  { name: "Mike Johnson", role: "Operations Manager", avatar: null, bio: "Ensures seamless delivery of all projects." },
                ],
            },
            order: order++,
          });
          break;
        case "stats":
          sections.push({
            id: "stats",
            component: resolveComponent(ctx.componentSelections, "stats", "Stats", ctx.themeStyle),
            props: {
              title: "By the Numbers",
              stats: ctx.userStats.length > 0
                ? ctx.userStats
                : [
                  { label: "Happy Clients", value: "250+" },
                  { label: "Years of Experience", value: "10+" },
                  { label: "Projects Completed", value: "500+" },
                  { label: "Team Members", value: "15+" },
                ],
            },
            order: order++,
          });
          break;
        case "timeline":
          sections.push({
            id: "timeline",
            component: resolveComponent(ctx.componentSelections, "timeline", "Timeline", ctx.themeStyle),
            props: {
              title: "Our Journey",
              milestones: ctx.userTimeline.length > 0
                ? ctx.userTimeline
                : [
                  { year: "Year One", title: "Founded", description: "Started with a simple idea and a small team." },
                  { year: "Today", title: "Where We Are Now", description: `${ctx.businessName} has grown into a trusted name in the industry.` },
                ],
            },
            order: order++,
          });
          break;
        default:
          break;
      }
    }

    sections.push({
      id: "cta",
      component: resolveComponent(ctx.componentSelections, "cta", "CTA2", ctx.themeStyle),
      props: {
        ...ctaCopy(ctx.pageContent, {
          headline: "Want to Work With Us?",
          subheadline: "We'd love to hear about your project",
          ctaText: "Get In Touch",
        }),
        ctaLink: "/contact",
      },
      order: order++,
    });

    return sections;
  }

  private _buildServicesSections(ctx: {
    businessName: string; businessDescription: string; industry: string;
    userServices: Array<{ title: string; description: string; icon: string }>;
    userWhyChooseUs: Array<{ title: string; description: string }>;
    userTestimonials: Array<{ name: string; role: string; content: string; rating: number; avatar?: string | null }>;
    componentSelections: Record<string, string>; themeStyle: string;
    pageSections?: string[];
    pageContent?: PageContentOverride;
  }): Array<Record<string, unknown>> {
    const services = ctx.userServices.length > 0
      ? ctx.userServices
      : getServices(ctx.industry);
    const testimonials = ctx.userTestimonials.length > 0
      ? ctx.userTestimonials
      : getTestimonials(ctx.industry);
    const hero = heroCopy(ctx.pageContent, "Our Services", `What ${ctx.businessName} offers`);

    return [
      {
        id: "page_hero",
        // Always the compact page-title bar, never the Home hero variant -
        // resolveComponent would otherwise resolve "hero" to whatever
        // Hero1-5 the client picked for the Home page, since both share
        // the same "hero" component-selection category. That meant every
        // single page in the site rendered the exact same full hero.
        component: "PageHero",
        props: {
          title: hero.title,
          subtitle: hero.subtitle,
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
        component: resolveComponent(ctx.componentSelections, "why_choose_us", "WhyChooseUs", ctx.themeStyle),
        props: {
          title: "Why Choose Us",
          subtitle: "What sets us apart from the competition",
          reasons: ctx.userWhyChooseUs.length > 0
            ? ctx.userWhyChooseUs
            : [
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
          testimonials,
        },
        order: 3,
      },
      {
        id: "cta",
        component: resolveComponent(ctx.componentSelections, "cta", "CTA2", ctx.themeStyle),
        props: {
          ...ctaCopy(ctx.pageContent, {
            headline: "Ready to Experience the Difference?",
            subheadline: "Let's discuss how we can help you",
            ctaText: "Contact Us",
          }),
          ctaLink: "/contact",
        },
        order: 4,
      },
    ];
  }

  private _buildPortfolioSections(ctx: {
    businessName: string; industry: string; imagePaths: string[];
    userPortfolio: Array<{ title: string; description: string; image?: string | null }>;
    componentSelections: Record<string, string>; themeStyle: string;
    pageContent?: PageContentOverride;
  }): Array<Record<string, unknown>> {
    const hero = heroCopy(ctx.pageContent, "Our Portfolio", `A showcase of ${ctx.businessName}'s finest work`);
    return [
      {
        id: "page_hero",
        // Always the compact page-title bar, never the Home hero variant -
        // resolveComponent would otherwise resolve "hero" to whatever
        // Hero1-5 the client picked for the Home page, since both share
        // the same "hero" component-selection category. That meant every
        // single page in the site rendered the exact same full hero.
        component: "PageHero",
        props: {
          title: hero.title,
          subtitle: hero.subtitle,
        },
        order: 0,
      },
      {
        id: "portfolio",
        component: resolveComponent(ctx.componentSelections, "portfolio", "Portfolio2", ctx.themeStyle),
        props: {
          title: "Featured Projects",
          subtitle: "Explore our recent work",
          // Portfolio1/2/3 all destructure `projects`, not `items`, and
          // Portfolio3 uses `category` for its filter pills.
          projects: ctx.userPortfolio.length > 0
            ? ctx.userPortfolio.map((p) => ({ category: "Featured", ...p }))
            : ctx.imagePaths.length > 0
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
          ...ctaCopy(ctx.pageContent, {
            headline: "Like What You See?",
            subheadline: "Let's create something amazing together",
            ctaText: "Start Your Project",
          }),
          ctaLink: "/contact",
        },
        order: 2,
      },
    ];
  }

  private _buildPricingSections(ctx: {
    businessName: string; industry: string;
    userPricingPlans: Array<{ name: string; price: string; period?: string; features: string[]; popular?: boolean }>;
    componentSelections: Record<string, string>; themeStyle: string;
    pageContent?: PageContentOverride;
  }): Array<Record<string, unknown>> {
    const hero = heroCopy(ctx.pageContent, "Pricing", `Simple, transparent pricing for ${ctx.businessName}`);
    return [
      {
        id: "page_hero",
        // Always the compact page-title bar, never the Home hero variant -
        // resolveComponent would otherwise resolve "hero" to whatever
        // Hero1-5 the client picked for the Home page, since both share
        // the same "hero" component-selection category. That meant every
        // single page in the site rendered the exact same full hero.
        component: "PageHero",
        props: {
          title: hero.title,
          subtitle: hero.subtitle,
        },
        order: 0,
      },
      {
        id: "pricing",
        component: resolveComponent(ctx.componentSelections, "pricing", "Pricing2", ctx.themeStyle),
        props: {
          title: "Choose Your Plan",
          subtitle: "Select the plan that best fits your needs",
          plans: ctx.userPricingPlans.length > 0
            ? ctx.userPricingPlans
            : [
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
          faqs: getFaq(ctx.industry),
        },
        order: 2,
      },
    ];
  }

  private _buildBlogSections(ctx: {
    businessName: string; industry: string;
    userBlogPosts: Array<{ title: string; excerpt: string; author?: string; date?: string; image?: string | null; category?: string }>;
    componentSelections: Record<string, string>; themeStyle: string;
    pageContent?: PageContentOverride;
  }): Array<Record<string, unknown>> {
    const posts = ctx.userBlogPosts.length > 0
      ? withBlogMeta(ctx.userBlogPosts, ctx.industry)
      : withBlogMeta(getBlogPosts(ctx.industry), ctx.industry);
    const hero = heroCopy(ctx.pageContent, "Blog", `Latest news and insights from ${ctx.businessName}`);

    return [
      {
        id: "page_hero",
        // Always the compact page-title bar, never the Home hero variant -
        // resolveComponent would otherwise resolve "hero" to whatever
        // Hero1-5 the client picked for the Home page, since both share
        // the same "hero" component-selection category. That meant every
        // single page in the site rendered the exact same full hero.
        component: "PageHero",
        props: {
          title: hero.title,
          subtitle: hero.subtitle,
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
    contactPhone: string; contactEmail: string; contactAddress: string;
    contactContent: { heading?: string; intro?: string; submitButtonText?: string; infoHeading?: string; infoSubtitle?: string };
    projectId?: string;
    pageSections?: string[];
    userBusinessHours: Array<{ day: string; hours: string }>;
    pageContent?: PageContentOverride;
  }): Array<Record<string, unknown>> {
    const hero = heroCopy(ctx.pageContent, "Contact Us", `Get in touch with ${ctx.businessName}`);
    const sections: Array<Record<string, unknown>> = [
      {
        id: "page_hero",
        // Always the compact page-title bar, never the Home hero variant -
        // resolveComponent would otherwise resolve "hero" to whatever
        // Hero1-5 the client picked for the Home page, since both share
        // the same "hero" component-selection category. That meant every
        // single page in the site rendered the exact same full hero.
        component: "PageHero",
        props: {
          title: hero.title,
          subtitle: hero.subtitle,
        },
        order: 0,
      },
    ];
    let order = 1;

    // This page used to always render exactly contact_form + map regardless
    // of the section checkboxes - Contact Info and Business Hours had no
    // effect at all. Now it reflects the client's choices, defaulting to
    // the previous fixed pair when nothing is selected yet.
    const selected = ctx.pageSections && ctx.pageSections.length > 0 ? ctx.pageSections : ["contact-form", "map"];

    for (const sectionId of selected) {
      switch (sectionId) {
        case "contact-form":
          sections.push({
            id: "contact_form",
            component: resolveComponent(ctx.componentSelections, "contact", "Contact1", ctx.themeStyle),
            props: {
              title: ctx.contactContent.heading?.trim() || "Send Us a Message",
              subtitle: "We'll get back to you within 24 hours",
              phone: ctx.contactPhone,
              email: ctx.contactEmail,
              address: ctx.contactAddress,
              intro: ctx.contactContent.intro?.trim() || undefined,
              submitButtonText: ctx.contactContent.submitButtonText?.trim() || undefined,
              projectId: ctx.projectId,
            },
            order: order++,
          });
          break;
        case "map":
          sections.push({
            id: "map",
            component: resolveComponent(ctx.componentSelections, "map", "MapEmbed", ctx.themeStyle),
            props: {
              title: "Find Us",
              address: ctx.contactAddress,
            },
            order: order++,
          });
          break;
        case "info":
          sections.push({
            id: "contact_info",
            component: resolveComponent(ctx.componentSelections, "contact_info", "ContactInfo", ctx.themeStyle),
            props: {
              title: ctx.contactContent.infoHeading?.trim() || undefined,
              subtitle: ctx.contactContent.infoSubtitle?.trim() || undefined,
              methods: [
                { title: "Phone", value: ctx.contactPhone, description: "Call us directly" },
                { title: "Email", value: ctx.contactEmail, description: "Send us a message" },
                { title: "Address", value: ctx.contactAddress, description: "" },
              ],
            },
            order: order++,
          });
          break;
        case "hours":
          sections.push({
            id: "business_hours",
            component: resolveComponent(ctx.componentSelections, "business_hours", "BusinessHours", ctx.themeStyle),
            props: {
              title: "Business Hours",
              hours: ctx.userBusinessHours.length > 0
                ? ctx.userBusinessHours
                : [
                  { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM" },
                  { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
                  { day: "Sunday", hours: "Closed" },
                ],
            },
            order: order++,
          });
          break;
        default:
          break;
      }
    }

    return sections;
  }

  private _buildFaqSections(ctx: {
    businessName: string; industry: string;
    userFaq: Array<{ question: string; answer: string }>;
    componentSelections: Record<string, string>; themeStyle: string;
    pageContent?: PageContentOverride;
  }): Array<Record<string, unknown>> {
    const faq = ctx.userFaq.length > 0 ? ctx.userFaq : getFaq(ctx.industry);
    const hero = heroCopy(ctx.pageContent, "FAQ", "Frequently Asked Questions");

    return [
      {
        id: "page_hero",
        // Always the compact page-title bar, never the Home hero variant -
        // resolveComponent would otherwise resolve "hero" to whatever
        // Hero1-5 the client picked for the Home page, since both share
        // the same "hero" component-selection category. That meant every
        // single page in the site rendered the exact same full hero.
        component: "PageHero",
        props: {
          title: hero.title,
          subtitle: hero.subtitle,
        },
        order: 0,
      },
      {
        id: "faq",
        component: resolveComponent(ctx.componentSelections, "faq", "FAQ1", ctx.themeStyle),
        props: {
          title: "Frequently Asked Questions",
          subtitle: "Find answers to common questions",
          faqs: faq,
        },
        order: 1,
      },
      {
        id: "cta",
        component: resolveComponent(ctx.componentSelections, "cta", "CTA2", ctx.themeStyle),
        props: {
          ...ctaCopy(ctx.pageContent, {
            headline: "Still Have Questions?",
            subheadline: "We're here to help",
            ctaText: "Contact Us",
          }),
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
    pageContent?: PageContentOverride;
  }): Array<Record<string, unknown>> {
    const testimonials = ctx.userTestimonials.length > 0
      ? ctx.userTestimonials
      : getTestimonials(ctx.industry);
    const hero = heroCopy(ctx.pageContent, "Testimonials", "What our clients say about us");

    return [
      {
        id: "page_hero",
        // Always the compact page-title bar, never the Home hero variant -
        // resolveComponent would otherwise resolve "hero" to whatever
        // Hero1-5 the client picked for the Home page, since both share
        // the same "hero" component-selection category. That meant every
        // single page in the site rendered the exact same full hero.
        component: "PageHero",
        props: {
          title: hero.title,
          subtitle: hero.subtitle,
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
          ...ctaCopy(ctx.pageContent, {
            headline: "Ready to Join Our Happy Clients?",
            subheadline: "Let us help you achieve your goals",
            ctaText: "Get Started",
          }),
          ctaLink: "/contact",
        },
        order: 2,
      },
    ];
  }

  private _buildGallerySections(ctx: {
    businessName: string; industry: string; imagePaths: string[];
    userGalleryImages: Array<{ url: string; alt?: string }>;
    componentSelections: Record<string, string>; themeStyle: string;
    pageContent?: PageContentOverride;
  }): Array<Record<string, unknown>> {
    const hero = heroCopy(ctx.pageContent, "Gallery", `A visual showcase from ${ctx.businessName}`);
    // Gallery1/Gallery2 expect `images` as a flat string[] of URLs.
    const galleryUrls = ctx.userGalleryImages.length > 0
      ? ctx.userGalleryImages.map((g) => g.url)
      : ctx.imagePaths.length > 0
        ? ctx.imagePaths
        : Array.from({ length: 9 }, () => null as unknown as string);
    return [
      {
        id: "page_hero",
        // Always the compact page-title bar, never the Home hero variant -
        // resolveComponent would otherwise resolve "hero" to whatever
        // Hero1-5 the client picked for the Home page, since both share
        // the same "hero" component-selection category. That meant every
        // single page in the site rendered the exact same full hero.
        component: "PageHero",
        props: {
          title: hero.title,
          subtitle: hero.subtitle,
        },
        order: 0,
      },
      {
        id: "gallery",
        component: resolveComponent(ctx.componentSelections, "gallery", "Gallery1", ctx.themeStyle),
        props: {
          title: "Our Gallery",
          subtitle: "Browse through our collection",
          images: galleryUrls,
        },
        order: 1,
      },
    ];
  }

  private _buildMenuSections(ctx: {
    businessName: string; industry: string;
    userMenuItems: Array<{ name: string; description: string; price: string; image?: string | null }>;
    userDailySpecials: Array<{ name: string; description: string; price: string; tag?: string; originalPrice?: string }>;
    componentSelections: Record<string, string>; themeStyle: string;
    pageContent?: PageContentOverride;
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
    // MenuHighlights/DailySpecials both destructure `items`, not
    // `categories` - the old key meant neither section ever had anything to
    // render, which is exactly why the Menu page looked broken.
    const menuItems = ctx.userMenuItems.length > 0
      ? ctx.userMenuItems
      : menuCategories[ctx.industry] || menuCategories["default"];
    const dailySpecials = ctx.userDailySpecials.length > 0
      ? ctx.userDailySpecials
      : [
        { name: "Today's Special", description: "A limited-time dish available only today.", price: "", tag: "Today's Special" },
        { name: "Weekend Feature", description: "Available Friday through Sunday while supplies last.", price: "", tag: "Weekend Only" },
      ];
    const hero = heroCopy(ctx.pageContent, "Our Menu", `Explore what ${ctx.businessName} has to offer`);

    return [
      {
        id: "page_hero",
        // Always the compact page-title bar, never the Home hero variant -
        // resolveComponent would otherwise resolve "hero" to whatever
        // Hero1-5 the client picked for the Home page, since both share
        // the same "hero" component-selection category. That meant every
        // single page in the site rendered the exact same full hero.
        component: "PageHero",
        props: {
          title: hero.title,
          subtitle: hero.subtitle,
        },
        order: 0,
      },
      {
        id: "menu_highlights",
        component: resolveComponent(ctx.componentSelections, "menu_items", "MenuHighlights", ctx.themeStyle),
        props: {
          title: "Our Menu",
          subtitle: "Carefully crafted selections",
          items: menuItems,
        },
        order: 1,
      },
      {
        id: "daily_specials",
        component: resolveComponent(ctx.componentSelections, "daily_specials", "DailySpecials", ctx.themeStyle),
        props: {
          title: "Today's Specials",
          subtitle: "Chef's picks for today",
          items: dailySpecials,
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

  private _buildTeamSections(ctx: {
    businessName: string; industry: string;
    userTeam: Array<{ name: string; role: string; bio?: string; avatar?: string | null }>;
    componentSelections: Record<string, string>; themeStyle: string;
    pageContent?: PageContentOverride;
  }): Array<Record<string, unknown>> {
    const hero = heroCopy(ctx.pageContent, "Our Team", `Meet the talented people behind ${ctx.businessName}`);
    return [
      {
        id: "page_hero",
        // Always the compact page-title bar, never the Home hero variant -
        // resolveComponent would otherwise resolve "hero" to whatever
        // Hero1-5 the client picked for the Home page, since both share
        // the same "hero" component-selection category. That meant every
        // single page in the site rendered the exact same full hero.
        component: "PageHero",
        props: {
          title: hero.title,
          subtitle: hero.subtitle,
        },
        order: 0,
      },
      {
        id: "team",
        component: resolveComponent(ctx.componentSelections, "team", "TeamSection", ctx.themeStyle),
        props: {
          title: "Meet the Team",
          subtitle: "Dedicated professionals committed to excellence",
          members: ctx.userTeam.length > 0
            ? ctx.userTeam
            : [
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
          ...ctaCopy(ctx.pageContent, {
            headline: "Want to Join Our Team?",
            subheadline: "We're always looking for talented people",
            ctaText: "View Open Positions",
          }),
          ctaLink: "/contact",
        },
        order: 2,
      },
    ];
  }

  private _buildPropertiesSections(ctx: {
    businessName: string; industry: string;
    userTeam: Array<{ name: string; role: string; bio?: string; avatar?: string | null }>;
    componentSelections: Record<string, string>; themeStyle: string;
    pageSections?: string[];
    pageContent?: PageContentOverride;
  }): Array<Record<string, unknown>> {
    const hero = heroCopy(ctx.pageContent, "Our Properties", `Find your next home with ${ctx.businessName}`);
    const sections: Array<Record<string, unknown>> = [
      {
        id: "page_hero",
        // Always the compact page-title bar, never the Home hero variant -
        // resolveComponent would otherwise resolve "hero" to whatever
        // Hero1-5 the client picked for the Home page, since both share
        // the same "hero" component-selection category. That meant every
        // single page in the site rendered the exact same full hero.
        component: "PageHero",
        props: { title: hero.title, subtitle: hero.subtitle },
        order: 0,
      },
    ];
    let order = 1;
    const selected = ctx.pageSections && ctx.pageSections.length > 0 ? ctx.pageSections : ["agents"];

    for (const sectionId of selected) {
      switch (sectionId) {
        case "agents":
          sections.push({
            id: "agents",
            component: resolveComponent(ctx.componentSelections, "agents", "AgentProfiles", ctx.themeStyle),
            props: {
              title: "Meet Our Agents",
              subtitle: "Local experts ready to help you buy or sell",
              agents: ctx.userTeam.length > 0
                ? ctx.userTeam.map((t) => ({ name: t.name, specialty: t.role, avatar: t.avatar }))
                : [
                  { name: "Jordan Blake", specialty: "Residential Sales", avatar: null },
                  { name: "Casey Rivera", specialty: "Luxury Properties", avatar: null },
                  { name: "Morgan Lee", specialty: "First-Time Buyers", avatar: null },
                ],
            },
            order: order++,
          });
          break;
        default:
          break;
      }
    }

    sections.push({
      id: "cta",
      component: resolveComponent(ctx.componentSelections, "cta", "CTA2", ctx.themeStyle),
      props: {
        ...ctaCopy(ctx.pageContent, {
          headline: "Looking to Buy or Sell?",
          subheadline: "Talk to one of our agents today",
          ctaText: "Contact Us",
        }),
        ctaLink: "/contact",
      },
      order: order++,
    });

    return sections;
  }

  private _buildCoursesSections(ctx: {
    businessName: string; industry: string;
    userCourses: Array<{ title: string; description: string; price: string; category?: string; level?: string; duration?: string; image?: string | null }>;
    userWhyChooseUs: Array<{ title: string; description: string }>;
    userTestimonials: Array<{ name: string; role: string; content: string; rating: number; avatar?: string | null }>;
    componentSelections: Record<string, string>; themeStyle: string;
    pageSections?: string[];
    pageContent?: PageContentOverride;
  }): Array<Record<string, unknown>> {
    const hero = heroCopy(ctx.pageContent, "Our Courses", `Learn something new with ${ctx.businessName}`);
    const sections: Array<Record<string, unknown>> = [
      {
        id: "page_hero",
        // Always the compact page-title bar, never the Home hero variant -
        // resolveComponent would otherwise resolve "hero" to whatever
        // Hero1-5 the client picked for the Home page, since both share
        // the same "hero" component-selection category. That meant every
        // single page in the site rendered the exact same full hero.
        component: "PageHero",
        props: { title: hero.title, subtitle: hero.subtitle },
        order: 0,
      },
    ];
    let order = 1;
    const selected = ctx.pageSections && ctx.pageSections.length > 0 ? ctx.pageSections : ["course-grid", "features", "testimonials"];

    for (const sectionId of selected) {
      switch (sectionId) {
        case "course-grid":
          sections.push({
            id: "course_grid",
            component: resolveComponent(ctx.componentSelections, "course_grid", "CourseGrid", ctx.themeStyle),
            props: {
              title: "Our Courses",
              subtitle: "Pick the path that's right for you",
              courses: ctx.userCourses.length > 0
                ? ctx.userCourses
                : [
                  { title: "Getting Started", description: "A foundational course covering everything you need to begin.", price: "$49", category: "Beginner", level: "Beginner", duration: "4 weeks", image: null },
                  { title: "Level Up", description: "Build on the fundamentals with hands-on projects and feedback.", price: "$99", category: "Intermediate", level: "Intermediate", duration: "6 weeks", image: null },
                  { title: "Advanced Mastery", description: "Go deep on advanced techniques with expert-led instruction.", price: "$149", category: "Advanced", level: "Advanced", duration: "8 weeks", image: null },
                ],
            },
            order: order++,
          });
          break;
        case "features":
          sections.push({
            id: "features",
            component: resolveComponent(ctx.componentSelections, "why_choose_us", "WhyChooseUs", ctx.themeStyle),
            props: {
              title: "What's Included",
              subtitle: "Everything you need to succeed",
              reasons: ctx.userWhyChooseUs.length > 0
                ? ctx.userWhyChooseUs
                : [
                  { title: "Expert Instructors", description: "Learn directly from experienced practitioners." },
                  { title: "Lifetime Access", description: "Revisit course materials anytime, at your own pace." },
                  { title: "Certificate of Completion", description: "Showcase your new skills with a shareable certificate." },
                ],
            },
            order: order++,
          });
          break;
        case "testimonials":
          sections.push({
            id: "testimonials",
            component: resolveComponent(ctx.componentSelections, "testimonials", "Testimonials1", ctx.themeStyle),
            props: {
              title: "Student Success Stories",
              subtitle: "Hear from people who've taken our courses",
              testimonials: ctx.userTestimonials.length > 0 ? ctx.userTestimonials : getTestimonials(ctx.industry),
            },
            order: order++,
          });
          break;
        default:
          break;
      }
    }

    sections.push({
      id: "cta",
      component: resolveComponent(ctx.componentSelections, "cta", "CTA2", ctx.themeStyle),
      props: {
        ...ctaCopy(ctx.pageContent, {
          headline: "Ready to Enroll?",
          subheadline: "Start learning with us today",
          ctaText: "Get Started",
        }),
        ctaLink: "/contact",
      },
      order: order++,
    });

    return sections;
  }

  private _buildClassesSections(ctx: {
    businessName: string; industry: string;
    userClassSchedule: Array<{ day: string; time: string; className: string }>;
    userTeam: Array<{ name: string; role: string; bio?: string; avatar?: string | null }>;
    userPricingPlans: Array<{ name: string; price: string; period?: string; features: string[]; popular?: boolean }>;
    componentSelections: Record<string, string>; themeStyle: string;
    pageSections?: string[];
    pageContent?: PageContentOverride;
  }): Array<Record<string, unknown>> {
    const hero = heroCopy(ctx.pageContent, "Our Classes", `Find your next class at ${ctx.businessName}`);
    const sections: Array<Record<string, unknown>> = [
      {
        id: "page_hero",
        // Always the compact page-title bar, never the Home hero variant -
        // resolveComponent would otherwise resolve "hero" to whatever
        // Hero1-5 the client picked for the Home page, since both share
        // the same "hero" component-selection category. That meant every
        // single page in the site rendered the exact same full hero.
        component: "PageHero",
        props: { title: hero.title, subtitle: hero.subtitle },
        order: 0,
      },
    ];
    let order = 1;
    const selected = ctx.pageSections && ctx.pageSections.length > 0 ? ctx.pageSections : ["class-schedule", "trainers", "pricing"];

    for (const sectionId of selected) {
      switch (sectionId) {
        case "class-schedule":
          sections.push({
            id: "class_schedule",
            component: "ClassSchedule",
            props: {
              title: "Class Schedule",
              subtitle: "Find a class that fits your week",
              schedule: ctx.userClassSchedule.length > 0
                ? ctx.userClassSchedule
                : [
                  { day: "Monday", time: "6:00 AM", className: "Morning Strength" },
                  { day: "Wednesday", time: "5:30 PM", className: "Evening Cardio" },
                  { day: "Saturday", time: "9:00 AM", className: "Weekend Bootcamp" },
                ],
            },
            order: order++,
          });
          break;
        case "trainers":
          sections.push({
            id: "trainers",
            component: resolveComponent(ctx.componentSelections, "team", "TeamSection", ctx.themeStyle),
            props: {
              title: "Meet Our Trainers",
              subtitle: "The coaches who keep you moving",
              members: ctx.userTeam.length > 0
                ? ctx.userTeam
                : [
                  { name: "Alex Rivera", role: "Head Trainer", avatar: null, bio: "Certified strength coach with 10+ years of experience." },
                  { name: "Sam Parker", role: "Cardio Specialist", avatar: null, bio: "Loves helping members hit their endurance goals." },
                ],
            },
            order: order++,
          });
          break;
        case "pricing":
          sections.push({
            id: "pricing",
            component: resolveComponent(ctx.componentSelections, "pricing", "Pricing2", ctx.themeStyle),
            props: {
              title: "Membership Plans",
              subtitle: "Choose the plan that fits your goals",
              plans: ctx.userPricingPlans.length > 0
                ? ctx.userPricingPlans
                : [
                  { name: "Drop-In", price: "$20", period: "class", features: ["Single class access"] },
                  { name: "Monthly", price: "$79", period: "mo", features: ["Unlimited classes", "Guest passes"], popular: true },
                  { name: "Annual", price: "$799", period: "yr", features: ["Unlimited classes", "Guest passes", "2 months free"] },
                ],
            },
            order: order++,
          });
          break;
        default:
          break;
      }
    }

    sections.push({
      id: "cta",
      component: resolveComponent(ctx.componentSelections, "cta", "CTA2", ctx.themeStyle),
      props: {
        ...ctaCopy(ctx.pageContent, {
          headline: "Ready to Join a Class?",
          subheadline: "Reserve your spot today",
          ctaText: "Get Started",
        }),
        ctaLink: "/contact",
      },
      order: order++,
    });

    return sections;
  }

  private _buildDestinationsSections(ctx: {
    businessName: string; industry: string;
    userDestinations: Array<{ name: string; price?: string; image?: string | null }>;
    userDailySpecials: Array<{ name: string; description: string; price: string; tag?: string; originalPrice?: string }>;
    userTestimonials: Array<{ name: string; role: string; content: string; rating: number; avatar?: string | null }>;
    componentSelections: Record<string, string>; themeStyle: string;
    pageSections?: string[];
    pageContent?: PageContentOverride;
  }): Array<Record<string, unknown>> {
    const hero = heroCopy(ctx.pageContent, "Destinations", `Explore the world with ${ctx.businessName}`);
    const sections: Array<Record<string, unknown>> = [
      {
        id: "page_hero",
        // Always the compact page-title bar, never the Home hero variant -
        // resolveComponent would otherwise resolve "hero" to whatever
        // Hero1-5 the client picked for the Home page, since both share
        // the same "hero" component-selection category. That meant every
        // single page in the site rendered the exact same full hero.
        component: "PageHero",
        props: { title: hero.title, subtitle: hero.subtitle },
        order: 0,
      },
    ];
    let order = 1;
    const selected = ctx.pageSections && ctx.pageSections.length > 0 ? ctx.pageSections : ["destination-grid", "deals", "testimonials"];

    for (const sectionId of selected) {
      switch (sectionId) {
        case "destination-grid":
          sections.push({
            id: "destination_grid",
            component: resolveComponent(ctx.componentSelections, "destination_grid", "DestinationGrid", ctx.themeStyle),
            props: {
              title: "Popular Destinations",
              subtitle: "Where our travelers love to go",
              destinations: ctx.userDestinations.length > 0
                ? ctx.userDestinations
                : [
                  { name: "Coastal Getaway", price: "$899", image: null },
                  { name: "Mountain Retreat", price: "$1,199", image: null },
                  { name: "City Escape", price: "$649", image: null },
                ],
            },
            order: order++,
          });
          break;
        case "deals":
          sections.push({
            id: "travel_deals",
            component: resolveComponent(ctx.componentSelections, "travel_deals", "TravelDeals", ctx.themeStyle),
            props: {
              title: "Travel Deals",
              subtitle: "Limited-time offers you won't want to miss",
              deals: ctx.userDailySpecials.length > 0
                ? ctx.userDailySpecials.map((d) => ({ title: d.name, description: d.description, price: d.price, originalPrice: d.originalPrice }))
                : [
                  { title: "Early Bird Special", description: "Book 60 days ahead and save.", price: "$799", originalPrice: "$999" },
                  { title: "Last-Minute Deal", description: "Spontaneous getaways at a discount.", price: "$549", originalPrice: "$699" },
                ],
            },
            order: order++,
          });
          break;
        case "testimonials":
          sections.push({
            id: "testimonials",
            component: resolveComponent(ctx.componentSelections, "testimonials", "Testimonials1", ctx.themeStyle),
            props: {
              title: "Traveler Reviews",
              subtitle: "Real trips, real stories",
              testimonials: ctx.userTestimonials.length > 0 ? ctx.userTestimonials : getTestimonials(ctx.industry),
            },
            order: order++,
          });
          break;
        default:
          break;
      }
    }

    sections.push({
      id: "cta",
      component: resolveComponent(ctx.componentSelections, "cta", "CTA2", ctx.themeStyle),
      props: {
        ...ctaCopy(ctx.pageContent, {
          headline: "Ready for Your Next Adventure?",
          subheadline: "Let's start planning your trip",
          ctaText: "Plan Your Trip",
        }),
        ctaLink: "/contact",
      },
      order: order++,
    });

    return sections;
  }

  private _buildFeaturesSections(ctx: {
    businessName: string; industry: string;
    userServices: Array<{ title: string; description: string; icon: string }>;
    userWhyChooseUs: Array<{ title: string; description: string }>;
    userTestimonials: Array<{ name: string; role: string; content: string; rating: number; avatar?: string | null }>;
    componentSelections: Record<string, string>; themeStyle: string;
    pageSections?: string[];
    pageContent?: PageContentOverride;
  }): Array<Record<string, unknown>> {
    const hero = heroCopy(ctx.pageContent, "Features", `Everything ${ctx.businessName} has to offer`);
    const sections: Array<Record<string, unknown>> = [
      {
        id: "page_hero",
        // Always the compact page-title bar, never the Home hero variant -
        // resolveComponent would otherwise resolve "hero" to whatever
        // Hero1-5 the client picked for the Home page, since both share
        // the same "hero" component-selection category. That meant every
        // single page in the site rendered the exact same full hero.
        component: "PageHero",
        props: { title: hero.title, subtitle: hero.subtitle },
        order: 0,
      },
    ];
    let order = 1;
    const selected = ctx.pageSections && ctx.pageSections.length > 0 ? ctx.pageSections : ["feature-grid", "benefits", "testimonials"];

    for (const sectionId of selected) {
      switch (sectionId) {
        case "feature-grid":
          sections.push({
            id: "feature_grid",
            component: resolveComponent(ctx.componentSelections, "services", "Services1", ctx.themeStyle),
            props: {
              title: "Features",
              subtitle: "Everything you get, built in",
              services: ctx.userServices.length > 0 ? ctx.userServices : getServices(ctx.industry),
            },
            order: order++,
          });
          break;
        case "benefits":
          sections.push({
            id: "benefits",
            component: resolveComponent(ctx.componentSelections, "why_choose_us", "WhyChooseUs", ctx.themeStyle),
            props: {
              title: "Why Choose Us",
              subtitle: "What sets us apart",
              reasons: ctx.userWhyChooseUs.length > 0
                ? ctx.userWhyChooseUs
                : [
                  { title: "Built for Speed", description: "Get up and running in minutes, not weeks." },
                  { title: "Reliable Support", description: "Our team is here whenever you need help." },
                  { title: "Room to Grow", description: "Every feature scales with your business." },
                ],
            },
            order: order++,
          });
          break;
        case "testimonials":
          sections.push({
            id: "testimonials",
            component: resolveComponent(ctx.componentSelections, "testimonials", "Testimonials1", ctx.themeStyle),
            props: {
              title: "What Users Say",
              subtitle: "Trusted by teams like yours",
              testimonials: ctx.userTestimonials.length > 0 ? ctx.userTestimonials : getTestimonials(ctx.industry),
            },
            order: order++,
          });
          break;
        default:
          break;
      }
    }

    sections.push({
      id: "cta",
      component: resolveComponent(ctx.componentSelections, "cta", "CTA2", ctx.themeStyle),
      props: {
        ...ctaCopy(ctx.pageContent, {
          headline: "Ready to Get Started?",
          subheadline: "See it for yourself",
          ctaText: "Get Started Free",
        }),
        ctaLink: "/contact",
      },
      order: order++,
    });

    return sections;
  }

  private _buildInventorySections(ctx: {
    businessName: string; industry: string;
    userPortfolio: Array<{ title: string; description: string; image?: string | null }>;
    imagePaths: string[];
    userTestimonials: Array<{ name: string; role: string; content: string; rating: number; avatar?: string | null }>;
    componentSelections: Record<string, string>; themeStyle: string;
    pageSections?: string[];
    pageContent?: PageContentOverride;
  }): Array<Record<string, unknown>> {
    const hero = heroCopy(ctx.pageContent, "Our Inventory", `Browse what's available at ${ctx.businessName}`);
    const sections: Array<Record<string, unknown>> = [
      {
        id: "page_hero",
        // Always the compact page-title bar, never the Home hero variant -
        // resolveComponent would otherwise resolve "hero" to whatever
        // Hero1-5 the client picked for the Home page, since both share
        // the same "hero" component-selection category. That meant every
        // single page in the site rendered the exact same full hero.
        component: "PageHero",
        props: { title: hero.title, subtitle: hero.subtitle },
        order: 0,
      },
    ];
    let order = 1;
    const selected = ctx.pageSections && ctx.pageSections.length > 0 ? ctx.pageSections : ["inventory-grid", "testimonials"];

    for (const sectionId of selected) {
      switch (sectionId) {
        case "inventory-grid":
          sections.push({
            id: "inventory_grid",
            // Reuses the Portfolio component - same "grid of image + title +
            // description" shape as inventory items, and already fixed to
            // take `projects` (not `items`) with a `category` default.
            component: resolveComponent(ctx.componentSelections, "portfolio", "Portfolio2", ctx.themeStyle),
            props: {
              title: "Our Inventory",
              subtitle: "Browse what's currently available",
              projects: ctx.userPortfolio.length > 0
                ? ctx.userPortfolio.map((p) => ({ category: "In Stock", ...p }))
                : ctx.imagePaths.slice(0, 6).map((url, i) => ({
                  title: `Item ${i + 1}`,
                  description: "Available now",
                  image: url,
                  category: "In Stock",
                })),
            },
            order: order++,
          });
          break;
        case "testimonials":
          sections.push({
            id: "testimonials",
            component: resolveComponent(ctx.componentSelections, "testimonials", "Testimonials1", ctx.themeStyle),
            props: {
              title: "Customer Reviews",
              subtitle: "What our customers are saying",
              testimonials: ctx.userTestimonials.length > 0 ? ctx.userTestimonials : getTestimonials(ctx.industry),
            },
            order: order++,
          });
          break;
        default:
          break;
      }
    }

    sections.push({
      id: "cta",
      component: resolveComponent(ctx.componentSelections, "cta", "CTA2", ctx.themeStyle),
      props: {
        ...ctaCopy(ctx.pageContent, {
          headline: "Interested in What You See?",
          subheadline: "Reach out and we'll help you find the right fit",
          ctaText: "Contact Us",
        }),
        ctaLink: "/contact",
      },
      order: order++,
    });

    return sections;
  }

  private _buildSolutionsSections(ctx: {
    businessName: string; industry: string;
    userSolutions: Array<{ title: string; description: string; icon: string }>;
    componentSelections: Record<string, string>; themeStyle: string;
    pageContent?: PageContentOverride;
  }): Array<Record<string, unknown>> {
    const hero = heroCopy(ctx.pageContent, "Our Solutions", `How ${ctx.businessName} solves problems for businesses like yours`);
    return [
      {
        id: "page_hero",
        // Always the compact page-title bar, never the Home hero variant -
        // resolveComponent would otherwise resolve "hero" to whatever
        // Hero1-5 the client picked for the Home page, since both share
        // the same "hero" component-selection category. That meant every
        // single page in the site rendered the exact same full hero.
        component: "PageHero",
        props: { title: hero.title, subtitle: hero.subtitle },
        order: 0,
      },
      {
        id: "solutions",
        component: resolveComponent(ctx.componentSelections, "services", "Services1", ctx.themeStyle),
        props: {
          title: "Our Solutions",
          subtitle: "How we solve problems for businesses like yours",
          services: ctx.userSolutions.length > 0
            ? ctx.userSolutions
            : [
              { title: "Cloud Infrastructure", description: "Scalable, secure infrastructure tailored to your business needs.", icon: "settings" },
              { title: "Custom Software", description: "Purpose-built software that solves your specific challenges.", icon: "star" },
              { title: "IT Consulting", description: "Strategic guidance to help you make the right technology decisions.", icon: "heart" },
            ],
        },
        order: 1,
      },
      {
        id: "cta",
        component: resolveComponent(ctx.componentSelections, "cta", "CTA2", ctx.themeStyle),
        props: {
          ...ctaCopy(ctx.pageContent, {
            headline: "Ready to Get Started?",
            subheadline: "Let's find the right solution for you",
            ctaText: "Contact Us",
          }),
          ctaLink: "/contact",
        },
        order: 2,
      },
    ];
  }

  private _buildCaseStudiesSections(ctx: {
    businessName: string; industry: string;
    userCaseStudies: Array<{ title: string; description: string; image?: string | null }>;
    userTestimonials: Array<{ name: string; role: string; content: string; rating: number; avatar?: string | null }>;
    componentSelections: Record<string, string>; themeStyle: string;
    pageSections?: string[];
    pageContent?: PageContentOverride;
  }): Array<Record<string, unknown>> {
    const hero = heroCopy(ctx.pageContent, "Case Studies", `Real results for real clients of ${ctx.businessName}`);
    const sections: Array<Record<string, unknown>> = [
      {
        id: "page_hero",
        // Always the compact page-title bar, never the Home hero variant -
        // resolveComponent would otherwise resolve "hero" to whatever
        // Hero1-5 the client picked for the Home page, since both share
        // the same "hero" component-selection category. That meant every
        // single page in the site rendered the exact same full hero.
        component: "PageHero",
        props: { title: hero.title, subtitle: hero.subtitle },
        order: 0,
      },
    ];
    let order = 1;
    const selected = ctx.pageSections && ctx.pageSections.length > 0 ? ctx.pageSections : ["case-studies-grid", "testimonials"];

    for (const sectionId of selected) {
      switch (sectionId) {
        case "case-studies-grid":
          sections.push({
            id: "case_studies",
            component: resolveComponent(ctx.componentSelections, "portfolio", "Portfolio2", ctx.themeStyle),
            props: {
              title: "Case Studies",
              projects: (ctx.userCaseStudies.length > 0
                ? ctx.userCaseStudies
                : [
                  { title: "Doubling Conversion Rates", description: "How we helped a growing brand double its online conversion rate in three months.", image: null },
                  { title: "A Full Brand Refresh", description: "From dated to distinctive - a complete visual identity overhaul.", image: null },
                  { title: "Scaling to 10x Traffic", description: "The strategy behind a tenfold increase in organic traffic.", image: null },
                ]
              ).map((c) => ({ category: "Case Study", ...c })),
            },
            order: order++,
          });
          break;
        case "testimonials":
          sections.push({
            id: "testimonials",
            component: resolveComponent(ctx.componentSelections, "testimonials", "Testimonials1", ctx.themeStyle),
            props: {
              title: "Client Feedback",
              testimonials: ctx.userTestimonials.length > 0 ? ctx.userTestimonials : getTestimonials(ctx.industry),
            },
            order: order++,
          });
          break;
        default:
          break;
      }
    }

    return sections;
  }

  private _buildIndustriesSections(ctx: {
    businessName: string; industry: string;
    userIndustries: Array<{ title: string; description: string; icon: string }>;
    componentSelections: Record<string, string>; themeStyle: string;
    pageContent?: PageContentOverride;
  }): Array<Record<string, unknown>> {
    const hero = heroCopy(ctx.pageContent, "Industries We Serve", `Specialized expertise across sectors at ${ctx.businessName}`);
    return [
      {
        id: "page_hero",
        // Always the compact page-title bar, never the Home hero variant -
        // resolveComponent would otherwise resolve "hero" to whatever
        // Hero1-5 the client picked for the Home page, since both share
        // the same "hero" component-selection category. That meant every
        // single page in the site rendered the exact same full hero.
        component: "PageHero",
        props: { title: hero.title, subtitle: hero.subtitle },
        order: 0,
      },
      {
        id: "industries",
        component: resolveComponent(ctx.componentSelections, "services", "Services1", ctx.themeStyle),
        props: {
          title: "Industries We Serve",
          subtitle: "Specialized expertise across sectors",
          services: ctx.userIndustries.length > 0
            ? ctx.userIndustries
            : [
              { title: "Healthcare", description: "Solutions tailored to the unique needs of healthcare organizations.", icon: "heart" },
              { title: "Finance", description: "Secure, compliant solutions for financial institutions.", icon: "star" },
              { title: "Retail", description: "Tools that help retailers compete and grow.", icon: "settings" },
            ],
        },
        order: 1,
      },
      {
        id: "cta",
        component: resolveComponent(ctx.componentSelections, "cta", "CTA2", ctx.themeStyle),
        props: {
          ...ctaCopy(ctx.pageContent, {
            headline: "Ready to Get Started?",
            subheadline: "Let's talk about your industry",
            ctaText: "Contact Us",
          }),
          ctaLink: "/contact",
        },
        order: 2,
      },
    ];
  }

  private _buildAgentsSections(ctx: {
    businessName: string; industry: string;
    userTeam: Array<{ name: string; role: string; bio?: string; avatar?: string | null }>;
    componentSelections: Record<string, string>; themeStyle: string;
    pageContent?: PageContentOverride;
  }): Array<Record<string, unknown>> {
    const hero = heroCopy(ctx.pageContent, "Meet Our Agents", `Local experts ready to help at ${ctx.businessName}`);
    return [
      {
        id: "page_hero",
        // Always the compact page-title bar, never the Home hero variant -
        // resolveComponent would otherwise resolve "hero" to whatever
        // Hero1-5 the client picked for the Home page, since both share
        // the same "hero" component-selection category. That meant every
        // single page in the site rendered the exact same full hero.
        component: "PageHero",
        props: { title: hero.title, subtitle: hero.subtitle },
        order: 0,
      },
      {
        id: "agents",
        component: resolveComponent(ctx.componentSelections, "agents", "AgentProfiles", ctx.themeStyle),
        props: {
          title: "Meet Our Agents",
          subtitle: "Local experts ready to help you buy or sell",
          agents: ctx.userTeam.length > 0
            ? ctx.userTeam.map((t) => ({ name: t.name, specialty: t.role, avatar: t.avatar }))
            : [
              { name: "Jordan Blake", specialty: "Residential Sales", avatar: null },
              { name: "Casey Rivera", specialty: "Luxury Properties", avatar: null },
              { name: "Morgan Lee", specialty: "First-Time Buyers", avatar: null },
            ],
        },
        order: 1,
      },
      {
        id: "cta",
        component: resolveComponent(ctx.componentSelections, "cta", "CTA2", ctx.themeStyle),
        props: {
          ...ctaCopy(ctx.pageContent, {
            headline: "Looking to Buy or Sell?",
            subheadline: "Talk to one of our agents today",
            ctaText: "Contact Us",
          }),
          ctaLink: "/contact",
        },
        order: 2,
      },
    ];
  }

  private _buildLocationSections(ctx: {
    businessName: string; industry: string;
    userBusinessHours: Array<{ day: string; hours: string }>;
    componentSelections: Record<string, string>; themeStyle: string;
    contactPhone: string; contactEmail: string; contactAddress: string;
    contactContent: { heading?: string; intro?: string; submitButtonText?: string; infoHeading?: string; infoSubtitle?: string };
    pageSections?: string[];
    pageContent?: PageContentOverride;
  }): Array<Record<string, unknown>> {
    const hero = heroCopy(ctx.pageContent, "Find Us", `Come say hello at ${ctx.businessName}`);
    const sections: Array<Record<string, unknown>> = [
      {
        id: "page_hero",
        // Always the compact page-title bar, never the Home hero variant -
        // resolveComponent would otherwise resolve "hero" to whatever
        // Hero1-5 the client picked for the Home page, since both share
        // the same "hero" component-selection category. That meant every
        // single page in the site rendered the exact same full hero.
        component: "PageHero",
        props: { title: hero.title, subtitle: hero.subtitle },
        order: 0,
      },
    ];
    let order = 1;
    const selected = ctx.pageSections && ctx.pageSections.length > 0 ? ctx.pageSections : ["map", "info", "hours"];

    for (const sectionId of selected) {
      switch (sectionId) {
        case "map":
          sections.push({
            id: "map",
            component: resolveComponent(ctx.componentSelections, "map", "MapEmbed", ctx.themeStyle),
            props: { title: "Find Us", address: ctx.contactAddress },
            order: order++,
          });
          break;
        case "info":
          sections.push({
            id: "contact_info",
            component: resolveComponent(ctx.componentSelections, "contact_info", "ContactInfo", ctx.themeStyle),
            props: {
              title: ctx.contactContent.infoHeading?.trim() || undefined,
              subtitle: ctx.contactContent.infoSubtitle?.trim() || undefined,
              methods: [
                { title: "Phone", value: ctx.contactPhone, description: "Call us directly" },
                { title: "Email", value: ctx.contactEmail, description: "Send us a message" },
                { title: "Address", value: ctx.contactAddress, description: "" },
              ],
            },
            order: order++,
          });
          break;
        case "hours":
          sections.push({
            id: "business_hours",
            component: resolveComponent(ctx.componentSelections, "business_hours", "BusinessHours", ctx.themeStyle),
            props: {
              title: "Business Hours",
              hours: ctx.userBusinessHours.length > 0
                ? ctx.userBusinessHours
                : [
                  { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM" },
                  { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
                  { day: "Sunday", hours: "Closed" },
                ],
            },
            order: order++,
          });
          break;
        default:
          break;
      }
    }

    return sections;
  }

  private _buildOurStorySections(ctx: {
    businessName: string; businessDescription: string; industry: string;
    userTimeline: Array<{ year: string; title: string; description?: string }>;
    componentSelections: Record<string, string>; themeStyle: string;
    pageSections?: string[];
    pageContent?: PageContentOverride;
  }): Array<Record<string, unknown>> {
    const hero = heroCopy(ctx.pageContent, "Our Story", `How it all began at ${ctx.businessName}`);
    const sections: Array<Record<string, unknown>> = [
      {
        id: "page_hero",
        // Always the compact page-title bar, never the Home hero variant -
        // resolveComponent would otherwise resolve "hero" to whatever
        // Hero1-5 the client picked for the Home page, since both share
        // the same "hero" component-selection category. That meant every
        // single page in the site rendered the exact same full hero.
        component: "PageHero",
        props: { title: hero.title, subtitle: hero.subtitle },
        order: 0,
      },
    ];
    let order = 1;
    const selected = ctx.pageSections && ctx.pageSections.length > 0 ? ctx.pageSections : ["story", "timeline"];

    for (const sectionId of selected) {
      switch (sectionId) {
        case "story":
          sections.push({
            id: "about_story",
            component: resolveComponent(ctx.componentSelections, "about_story", "AboutStory", ctx.themeStyle),
            props: {
              title: "Our Story",
              subtitle: "How it all started",
              content: aboutStoryCopy(ctx.pageContent, `${ctx.businessName} started with a simple idea. ${ctx.businessDescription || "We set out to do things differently, and that mindset still shapes everything we do today."}`),
              image: null,
            },
            order: order++,
          });
          break;
        case "timeline":
          sections.push({
            id: "timeline",
            component: resolveComponent(ctx.componentSelections, "timeline", "Timeline", ctx.themeStyle),
            props: {
              title: "Our Journey",
              milestones: ctx.userTimeline.length > 0
                ? ctx.userTimeline
                : [
                  { year: "Year One", title: "Founded", description: "Started with a simple idea and a small team." },
                  { year: "Today", title: "Where We Are Now", description: `${ctx.businessName} has grown into a place people love to visit.` },
                ],
            },
            order: order++,
          });
          break;
        default:
          break;
      }
    }

    return sections;
  }

  private _buildRoomsSections(ctx: {
    businessName: string; industry: string;
    userRooms: Array<{ title: string; description: string; price: string; category?: string; level?: string; duration?: string; image?: string | null }>;
    componentSelections: Record<string, string>; themeStyle: string;
    pageContent?: PageContentOverride;
  }): Array<Record<string, unknown>> {
    const hero = heroCopy(ctx.pageContent, "Rooms & Suites", `Comfort designed around you at ${ctx.businessName}`);
    return [
      {
        id: "page_hero",
        // Always the compact page-title bar, never the Home hero variant -
        // resolveComponent would otherwise resolve "hero" to whatever
        // Hero1-5 the client picked for the Home page, since both share
        // the same "hero" component-selection category. That meant every
        // single page in the site rendered the exact same full hero.
        component: "PageHero",
        props: { title: hero.title, subtitle: hero.subtitle },
        order: 0,
      },
      {
        id: "rooms",
        component: resolveComponent(ctx.componentSelections, "course_grid", "CourseGrid", ctx.themeStyle),
        props: {
          title: "Rooms & Suites",
          subtitle: "Comfort designed around you",
          courses: ctx.userRooms.length > 0
            ? ctx.userRooms
            : [
              { title: "Deluxe Room", description: "Spacious comfort with a king bed and city views.", price: "$189/night", category: "Deluxe", image: null },
              { title: "Executive Suite", description: "A separate living area and premium amenities.", price: "$289/night", category: "Suite", image: null },
              { title: "Presidential Suite", description: "Our most luxurious accommodations, with panoramic views.", price: "$549/night", category: "Suite", image: null },
            ],
        },
        order: 1,
      },
      {
        id: "cta",
        component: resolveComponent(ctx.componentSelections, "cta", "CTA2", ctx.themeStyle),
        props: {
          ...ctaCopy(ctx.pageContent, {
            headline: "Ready to Book Your Stay?",
            subheadline: "Reserve your room today",
            ctaText: "Contact Us",
          }),
          ctaLink: "/contact",
        },
        order: 2,
      },
    ];
  }

  private _buildAmenitiesSections(ctx: {
    businessName: string; industry: string;
    userAmenities: Array<{ title: string; description: string }>;
    componentSelections: Record<string, string>; themeStyle: string;
    pageContent?: PageContentOverride;
  }): Array<Record<string, unknown>> {
    const hero = heroCopy(ctx.pageContent, "Amenities", `Everything you need for a great stay at ${ctx.businessName}`);
    return [
      {
        id: "page_hero",
        // Always the compact page-title bar, never the Home hero variant -
        // resolveComponent would otherwise resolve "hero" to whatever
        // Hero1-5 the client picked for the Home page, since both share
        // the same "hero" component-selection category. That meant every
        // single page in the site rendered the exact same full hero.
        component: "PageHero",
        props: { title: hero.title, subtitle: hero.subtitle },
        order: 0,
      },
      {
        id: "amenities",
        component: resolveComponent(ctx.componentSelections, "why_choose_us", "WhyChooseUs", ctx.themeStyle),
        props: {
          title: "Amenities",
          subtitle: "Everything you need for a great stay",
          reasons: ctx.userAmenities.length > 0
            ? ctx.userAmenities
            : [
              { title: "Pool & Spa", description: "Unwind in our resort-style pool and full-service spa." },
              { title: "Fitness Center", description: "State-of-the-art equipment, open 24 hours." },
              { title: "Free Wi-Fi", description: "High-speed internet throughout the property." },
            ],
        },
        order: 1,
      },
      {
        id: "cta",
        component: resolveComponent(ctx.componentSelections, "cta", "CTA2", ctx.themeStyle),
        props: {
          ...ctaCopy(ctx.pageContent, {
            headline: "Ready to Get Started?",
            subheadline: "Book your stay today",
            ctaText: "Contact Us",
          }),
          ctaLink: "/contact",
        },
        order: 2,
      },
    ];
  }

  private _buildExperiencesSections(ctx: {
    businessName: string; industry: string;
    userExperiences: Array<{ title: string; description: string; image?: string | null }>;
    userTestimonials: Array<{ name: string; role: string; content: string; rating: number; avatar?: string | null }>;
    componentSelections: Record<string, string>; themeStyle: string;
    pageSections?: string[];
    pageContent?: PageContentOverride;
  }): Array<Record<string, unknown>> {
    const hero = heroCopy(ctx.pageContent, "Experiences", `Curated moments you won't forget at ${ctx.businessName}`);
    const sections: Array<Record<string, unknown>> = [
      {
        id: "page_hero",
        // Always the compact page-title bar, never the Home hero variant -
        // resolveComponent would otherwise resolve "hero" to whatever
        // Hero1-5 the client picked for the Home page, since both share
        // the same "hero" component-selection category. That meant every
        // single page in the site rendered the exact same full hero.
        component: "PageHero",
        props: { title: hero.title, subtitle: hero.subtitle },
        order: 0,
      },
    ];
    let order = 1;
    const selected = ctx.pageSections && ctx.pageSections.length > 0 ? ctx.pageSections : ["experiences-grid", "testimonials"];

    for (const sectionId of selected) {
      switch (sectionId) {
        case "experiences-grid":
          sections.push({
            id: "experiences",
            component: resolveComponent(ctx.componentSelections, "portfolio", "Portfolio2", ctx.themeStyle),
            props: {
              title: "Experiences",
              projects: (ctx.userExperiences.length > 0
                ? ctx.userExperiences
                : [
                  { title: "Sunset Wine Tasting", description: "An evening of curated wines paired with local bites.", image: null },
                  { title: "Guided City Tour", description: "Explore the highlights with a local expert guide.", image: null },
                  { title: "Private Chef's Table", description: "An intimate multi-course dinner prepared just for you.", image: null },
                ]
              ).map((e) => ({ category: "Featured", ...e })),
            },
            order: order++,
          });
          break;
        case "testimonials":
          sections.push({
            id: "testimonials",
            component: resolveComponent(ctx.componentSelections, "testimonials", "Testimonials1", ctx.themeStyle),
            props: {
              title: "Guest Reviews",
              testimonials: ctx.userTestimonials.length > 0 ? ctx.userTestimonials : getTestimonials(ctx.industry),
            },
            order: order++,
          });
          break;
        default:
          break;
      }
    }

    return sections;
  }

  private _buildTravelPackagesSections(ctx: {
    businessName: string; industry: string;
    userTravelPackages: Array<{ title: string; description: string; price: string; category?: string; level?: string; duration?: string; image?: string | null }>;
    componentSelections: Record<string, string>; themeStyle: string;
    pageContent?: PageContentOverride;
  }): Array<Record<string, unknown>> {
    const hero = heroCopy(ctx.pageContent, "Travel Packages", `Thoughtfully planned trips from ${ctx.businessName}, ready to book`);
    return [
      {
        id: "page_hero",
        // Always the compact page-title bar, never the Home hero variant -
        // resolveComponent would otherwise resolve "hero" to whatever
        // Hero1-5 the client picked for the Home page, since both share
        // the same "hero" component-selection category. That meant every
        // single page in the site rendered the exact same full hero.
        component: "PageHero",
        props: { title: hero.title, subtitle: hero.subtitle },
        order: 0,
      },
      {
        id: "travel_packages",
        component: resolveComponent(ctx.componentSelections, "course_grid", "CourseGrid", ctx.themeStyle),
        props: {
          title: "Travel Packages",
          subtitle: "Thoughtfully planned trips, ready to book",
          courses: ctx.userTravelPackages.length > 0
            ? ctx.userTravelPackages
            : [
              { title: "Weekend Getaway", description: "A quick escape to recharge, all-inclusive.", price: "$599", category: "Short Trip", duration: "3 days", image: null },
              { title: "Classic Adventure", description: "Our most popular week-long itinerary.", price: "$1,299", category: "Adventure", duration: "7 days", image: null },
              { title: "Luxury Escape", description: "Premium accommodations and exclusive experiences.", price: "$2,499", category: "Luxury", duration: "10 days", image: null },
            ],
        },
        order: 1,
      },
      {
        id: "cta",
        component: resolveComponent(ctx.componentSelections, "cta", "CTA2", ctx.themeStyle),
        props: {
          ...ctaCopy(ctx.pageContent, {
            headline: "Ready for Your Next Adventure?",
            subheadline: "Let's start planning your trip",
            ctaText: "Plan Your Trip",
          }),
          ctaLink: "/contact",
        },
        order: 2,
      },
    ];
  }

  private _buildProcessSections(ctx: {
    businessName: string; industry: string;
    userProcess: Array<{ title: string; description: string; icon?: string }>;
    componentSelections: Record<string, string>; themeStyle: string;
    pageContent?: PageContentOverride;
  }): Array<Record<string, unknown>> {
    const hero = heroCopy(ctx.pageContent, "Our Process", `How ${ctx.businessName} brings your vision to life`);
    return [
      {
        id: "page_hero",
        // Always the compact page-title bar, never the Home hero variant -
        // resolveComponent would otherwise resolve "hero" to whatever
        // Hero1-5 the client picked for the Home page, since both share
        // the same "hero" component-selection category. That meant every
        // single page in the site rendered the exact same full hero.
        component: "PageHero",
        props: { title: hero.title, subtitle: hero.subtitle },
        order: 0,
      },
      {
        id: "process",
        component: resolveComponent(ctx.componentSelections, "process", "LearningPaths", ctx.themeStyle),
        props: {
          title: "Our Process",
          subtitle: "How we bring your vision to life",
          steps: ctx.userProcess.length > 0
            ? ctx.userProcess
            : [
              { title: "Discover", description: "We start by understanding your goals, space, and style.", icon: "1" },
              { title: "Design", description: "We create a tailored plan and bring it to life in concept form.", icon: "2" },
              { title: "Deliver", description: "We execute the plan and hand over a finished space you'll love.", icon: "3" },
            ],
        },
        order: 1,
      },
      {
        id: "cta",
        component: resolveComponent(ctx.componentSelections, "cta", "CTA2", ctx.themeStyle),
        props: {
          ...ctaCopy(ctx.pageContent, {
            headline: "Ready to Get Started?",
            subheadline: "Let's start your project",
            ctaText: "Contact Us",
          }),
          ctaLink: "/contact",
        },
        order: 2,
      },
    ];
  }

  private _buildProgramsSections(ctx: {
    businessName: string; industry: string;
    userPrograms: Array<{ title: string; description: string; price: string; category?: string; level?: string; duration?: string; image?: string | null }>;
    userTestimonials: Array<{ name: string; role: string; content: string; rating: number; avatar?: string | null }>;
    componentSelections: Record<string, string>; themeStyle: string;
    pageSections?: string[];
    pageContent?: PageContentOverride;
  }): Array<Record<string, unknown>> {
    const hero = heroCopy(ctx.pageContent, "Our Programs", `Find the program that's right for you at ${ctx.businessName}`);
    const sections: Array<Record<string, unknown>> = [
      {
        id: "page_hero",
        // Always the compact page-title bar, never the Home hero variant -
        // resolveComponent would otherwise resolve "hero" to whatever
        // Hero1-5 the client picked for the Home page, since both share
        // the same "hero" component-selection category. That meant every
        // single page in the site rendered the exact same full hero.
        component: "PageHero",
        props: { title: hero.title, subtitle: hero.subtitle },
        order: 0,
      },
    ];
    let order = 1;
    const selected = ctx.pageSections && ctx.pageSections.length > 0 ? ctx.pageSections : ["programs-grid", "testimonials"];

    for (const sectionId of selected) {
      switch (sectionId) {
        case "programs-grid":
          sections.push({
            id: "programs",
            component: resolveComponent(ctx.componentSelections, "course_grid", "CourseGrid", ctx.themeStyle),
            props: {
              title: "Our Programs",
              subtitle: "Find the program that's right for you",
              courses: ctx.userPrograms.length > 0
                ? ctx.userPrograms
                : [
                  { title: "Beginner Program", description: "A gentle introduction built for lasting habits.", price: "$49/mo", category: "Beginner", level: "Beginner", duration: "4 weeks", image: null },
                  { title: "Performance Program", description: "Structured training to hit your next milestone.", price: "$89/mo", category: "Intermediate", level: "Intermediate", duration: "8 weeks", image: null },
                  { title: "Elite Program", description: "Advanced coaching for serious, dedicated athletes.", price: "$149/mo", category: "Advanced", level: "Advanced", duration: "12 weeks", image: null },
                ],
            },
            order: order++,
          });
          break;
        case "testimonials":
          sections.push({
            id: "testimonials",
            component: resolveComponent(ctx.componentSelections, "testimonials", "Testimonials1", ctx.themeStyle),
            props: {
              title: "Member Reviews",
              testimonials: ctx.userTestimonials.length > 0 ? ctx.userTestimonials : getTestimonials(ctx.industry),
            },
            order: order++,
          });
          break;
        default:
          break;
      }
    }

    return sections;
  }

  private _buildTrainersSections(ctx: {
    businessName: string; industry: string;
    userTeam: Array<{ name: string; role: string; bio?: string; avatar?: string | null }>;
    componentSelections: Record<string, string>; themeStyle: string;
    pageContent?: PageContentOverride;
  }): Array<Record<string, unknown>> {
    const hero = heroCopy(ctx.pageContent, "Meet Our Trainers", `The coaches who keep ${ctx.businessName} moving`);
    return [
      {
        id: "page_hero",
        // Always the compact page-title bar, never the Home hero variant -
        // resolveComponent would otherwise resolve "hero" to whatever
        // Hero1-5 the client picked for the Home page, since both share
        // the same "hero" component-selection category. That meant every
        // single page in the site rendered the exact same full hero.
        component: "PageHero",
        props: { title: hero.title, subtitle: hero.subtitle },
        order: 0,
      },
      {
        id: "trainers",
        component: resolveComponent(ctx.componentSelections, "team", "TeamSection", ctx.themeStyle),
        props: {
          title: "Meet Our Trainers",
          subtitle: "The coaches who keep you moving",
          members: ctx.userTeam.length > 0
            ? ctx.userTeam
            : [
              { name: "Alex Rivera", role: "Head Trainer", avatar: null, bio: "Certified strength coach with 10+ years of experience." },
              { name: "Sam Parker", role: "Cardio Specialist", avatar: null, bio: "Loves helping members hit their endurance goals." },
            ],
        },
        order: 1,
      },
      {
        id: "cta",
        component: resolveComponent(ctx.componentSelections, "cta", "CTA2", ctx.themeStyle),
        props: {
          ...ctaCopy(ctx.pageContent, {
            headline: "Ready to Get Started?",
            subheadline: "Book a session with one of our trainers",
            ctaText: "Contact Us",
          }),
          ctaLink: "/contact",
        },
        order: 2,
      },
    ];
  }

  private _buildDoctorsSections(ctx: {
    businessName: string; industry: string;
    userTeam: Array<{ name: string; role: string; bio?: string; avatar?: string | null }>;
    componentSelections: Record<string, string>; themeStyle: string;
    pageContent?: PageContentOverride;
  }): Array<Record<string, unknown>> {
    const hero = heroCopy(ctx.pageContent, "Meet Our Doctors", `Experienced, compassionate care at ${ctx.businessName}`);
    return [
      {
        id: "page_hero",
        // Always the compact page-title bar, never the Home hero variant -
        // resolveComponent would otherwise resolve "hero" to whatever
        // Hero1-5 the client picked for the Home page, since both share
        // the same "hero" component-selection category. That meant every
        // single page in the site rendered the exact same full hero.
        component: "PageHero",
        props: { title: hero.title, subtitle: hero.subtitle },
        order: 0,
      },
      {
        id: "doctors",
        component: resolveComponent(ctx.componentSelections, "doctors", "DoctorProfiles", ctx.themeStyle),
        props: {
          title: "Meet Our Doctors",
          subtitle: "Experienced, compassionate care",
          doctors: ctx.userTeam.length > 0
            ? ctx.userTeam.map((t) => ({ name: t.name, specialty: t.role, image: t.avatar, description: t.bio }))
            : [
              { name: "Dr. Sarah Chen", specialty: "Family Medicine", image: null, description: "Over 12 years of experience in primary care." },
              { name: "Dr. James Patel", specialty: "Internal Medicine", image: null, description: "Focused on preventive care and long-term wellness." },
            ],
        },
        order: 1,
      },
      {
        id: "cta",
        component: resolveComponent(ctx.componentSelections, "cta", "CTA2", ctx.themeStyle),
        props: {
          ...ctaCopy(ctx.pageContent, {
            headline: "Ready to Book an Appointment?",
            subheadline: "We're accepting new patients",
            ctaText: "Contact Us",
          }),
          ctaLink: "/contact",
        },
        order: 2,
      },
    ];
  }

  private _buildFacilitiesSections(ctx: {
    businessName: string; industry: string;
    userFacilities: Array<{ title: string; description: string }>;
    componentSelections: Record<string, string>; themeStyle: string;
    pageContent?: PageContentOverride;
  }): Array<Record<string, unknown>> {
    const hero = heroCopy(ctx.pageContent, "Our Facilities", `A comfortable, modern space for your care at ${ctx.businessName}`);
    return [
      {
        id: "page_hero",
        // Always the compact page-title bar, never the Home hero variant -
        // resolveComponent would otherwise resolve "hero" to whatever
        // Hero1-5 the client picked for the Home page, since both share
        // the same "hero" component-selection category. That meant every
        // single page in the site rendered the exact same full hero.
        component: "PageHero",
        props: { title: hero.title, subtitle: hero.subtitle },
        order: 0,
      },
      {
        id: "facilities",
        component: resolveComponent(ctx.componentSelections, "why_choose_us", "WhyChooseUs", ctx.themeStyle),
        props: {
          title: "Our Facilities",
          subtitle: "A comfortable, modern space for your care",
          reasons: ctx.userFacilities.length > 0
            ? ctx.userFacilities
            : [
              { title: "Modern Exam Rooms", description: "Comfortable, private spaces equipped with the latest technology." },
              { title: "On-Site Lab", description: "Fast, accurate testing without the extra trip." },
              { title: "Accessible Facility", description: "Fully accessible for patients of all mobility levels." },
            ],
        },
        order: 1,
      },
      {
        id: "cta",
        component: resolveComponent(ctx.componentSelections, "cta", "CTA2", ctx.themeStyle),
        props: {
          ...ctaCopy(ctx.pageContent, {
            headline: "Ready to Get Started?",
            subheadline: "Schedule your visit today",
            ctaText: "Contact Us",
          }),
          ctaLink: "/contact",
        },
        order: 2,
      },
    ];
  }

  private _buildInstructorsSections(ctx: {
    businessName: string; industry: string;
    userTeam: Array<{ name: string; role: string; bio?: string; avatar?: string | null }>;
    componentSelections: Record<string, string>; themeStyle: string;
    pageContent?: PageContentOverride;
  }): Array<Record<string, unknown>> {
    const hero = heroCopy(ctx.pageContent, "Meet Your Instructors", `Learn from experienced professionals at ${ctx.businessName}`);
    return [
      {
        id: "page_hero",
        // Always the compact page-title bar, never the Home hero variant -
        // resolveComponent would otherwise resolve "hero" to whatever
        // Hero1-5 the client picked for the Home page, since both share
        // the same "hero" component-selection category. That meant every
        // single page in the site rendered the exact same full hero.
        component: "PageHero",
        props: { title: hero.title, subtitle: hero.subtitle },
        order: 0,
      },
      {
        id: "instructors",
        component: resolveComponent(ctx.componentSelections, "instructors", "InstructorProfiles", ctx.themeStyle),
        props: {
          title: "Meet Your Instructors",
          subtitle: "Learn from experienced professionals",
          instructors: ctx.userTeam.length > 0
            ? ctx.userTeam.map((t) => ({ name: t.name, specialty: t.role, avatar: t.avatar }))
            : [
              { name: "Dr. Amara Osei", specialty: "Lead Instructor", avatar: null },
              { name: "Marcus Webb", specialty: "Curriculum Director", avatar: null },
            ],
        },
        order: 1,
      },
      {
        id: "cta",
        component: resolveComponent(ctx.componentSelections, "cta", "CTA2", ctx.themeStyle),
        props: {
          ...ctaCopy(ctx.pageContent, {
            headline: "Ready to Get Started?",
            subheadline: "Enroll in a course today",
            ctaText: "Get Started",
          }),
          ctaLink: "/contact",
        },
        order: 2,
      },
    ];
  }

  private _buildSkillsSections(ctx: {
    businessName: string; industry: string;
    userSkills: Array<{ title: string; description: string }>;
    componentSelections: Record<string, string>; themeStyle: string;
    pageContent?: PageContentOverride;
  }): Array<Record<string, unknown>> {
    const hero = heroCopy(ctx.pageContent, "Skills & Expertise", `What ${ctx.businessName} brings to every project`);
    return [
      {
        id: "page_hero",
        // Always the compact page-title bar, never the Home hero variant -
        // resolveComponent would otherwise resolve "hero" to whatever
        // Hero1-5 the client picked for the Home page, since both share
        // the same "hero" component-selection category. That meant every
        // single page in the site rendered the exact same full hero.
        component: "PageHero",
        props: { title: hero.title, subtitle: hero.subtitle },
        order: 0,
      },
      {
        id: "skills",
        component: resolveComponent(ctx.componentSelections, "why_choose_us", "WhyChooseUs", ctx.themeStyle),
        props: {
          title: "Skills & Expertise",
          subtitle: "What I bring to every project",
          reasons: ctx.userSkills.length > 0
            ? ctx.userSkills
            : [
              { title: "Brand Strategy", description: "Defining a clear, compelling identity for growing businesses." },
              { title: "Visual Design", description: "Crafting polished, on-brand visuals across every touchpoint." },
              { title: "Web Development", description: "Building fast, accessible, well-crafted websites." },
            ],
        },
        order: 1,
      },
      {
        id: "cta",
        component: resolveComponent(ctx.componentSelections, "cta", "CTA2", ctx.themeStyle),
        props: {
          ...ctaCopy(ctx.pageContent, {
            headline: "Let's Work Together",
            subheadline: "Get in touch to start your project",
            ctaText: "Contact Us",
          }),
          ctaLink: "/contact",
        },
        order: 2,
      },
    ];
  }

  private _buildExperienceSections(ctx: {
    businessName: string; industry: string;
    userTimeline: Array<{ year: string; title: string; description?: string }>;
    componentSelections: Record<string, string>; themeStyle: string;
    pageContent?: PageContentOverride;
  }): Array<Record<string, unknown>> {
    const hero = heroCopy(ctx.pageContent, "Experience", `Where ${ctx.businessName} has been and what I've learned`);
    return [
      {
        id: "page_hero",
        // Always the compact page-title bar, never the Home hero variant -
        // resolveComponent would otherwise resolve "hero" to whatever
        // Hero1-5 the client picked for the Home page, since both share
        // the same "hero" component-selection category. That meant every
        // single page in the site rendered the exact same full hero.
        component: "PageHero",
        props: { title: hero.title, subtitle: hero.subtitle },
        order: 0,
      },
      {
        id: "experience",
        component: resolveComponent(ctx.componentSelections, "timeline", "Timeline", ctx.themeStyle),
        props: {
          title: "Experience",
          milestones: ctx.userTimeline.length > 0
            ? ctx.userTimeline
            : [
              { year: "2018", title: "Started Freelancing", description: "Began taking on independent client projects." },
              { year: "2021", title: "Grew a Client Roster", description: "Built long-term relationships with returning clients." },
              { year: "2024", title: "Where I Am Today", description: "Focused on delivering great work for a small set of clients." },
            ],
        },
        order: 1,
      },
    ];
  }

  private _buildGenericSections(ctx: {
    businessName: string; industry: string;
    componentSelections: Record<string, string>; themeStyle: string;
    pageContent?: PageContentOverride;
  }): Array<Record<string, unknown>> {
    const hero = heroCopy(ctx.pageContent, capitalize(ctx.industry), `Welcome to ${ctx.businessName}`);
    return [
      {
        id: "page_hero",
        // Always the compact page-title bar, never the Home hero variant -
        // resolveComponent would otherwise resolve "hero" to whatever
        // Hero1-5 the client picked for the Home page, since both share
        // the same "hero" component-selection category. That meant every
        // single page in the site rendered the exact same full hero.
        component: "PageHero",
        props: {
          title: hero.title,
          subtitle: hero.subtitle,
        },
        order: 0,
      },
      {
        id: "about_story",
        component: resolveComponent(ctx.componentSelections, "about_story", "AboutStory", ctx.themeStyle),
        props: {
          title: getAboutTitle(ctx.industry),
          subtitle: "Learn More About Us",
          content: aboutStoryCopy(ctx.pageContent, `${ctx.businessName} is dedicated to providing exceptional ${ctx.industry.toLowerCase()} services. We pride ourselves on quality, innovation, and customer satisfaction.`),
        },
        order: 1,
      },
      {
        id: "cta",
        component: resolveComponent(ctx.componentSelections, "cta", "CTA2", ctx.themeStyle),
        props: {
          ...ctaCopy(ctx.pageContent, {
            headline: "Ready to Get Started?",
            subheadline: "Contact us today",
            ctaText: "Contact Us",
          }),
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
    fontStyle: string; themeStyle: string; themeMode?: string; accentStyle?: string;
    config: BusinessTypeConfig;
    sectionColors?: Record<string, any>;
  }): Record<string, any> {
    const styleKey = ctx.themeStyle.toLowerCase();

    const styleProfiles: Record<string, {
      font: string; darkMode: boolean; borderRadius: string; buttonStyle: string;
      spacing: string; shadow: string; letterSpacing: string; borderWidth: string;
      backgroundTreatment: string;
    }> = {
      minimal: { font: "Inter", darkMode: false, borderRadius: "4px", buttonStyle: "square", spacing: "compact", shadow: "none", letterSpacing: "wide", borderWidth: "1px", backgroundTreatment: "plain" },
      modern: { font: "Inter", darkMode: false, borderRadius: "8px", buttonStyle: "rounded", spacing: "normal", shadow: "sm", letterSpacing: "normal", borderWidth: "1px", backgroundTreatment: "plain" },
      premium: { font: "Playfair Display", darkMode: true, borderRadius: "2px", buttonStyle: "sharp", spacing: "relaxed", shadow: "lg", letterSpacing: "wide", borderWidth: "2px", backgroundTreatment: "gradient" },
      corporate: { font: "Source Sans 3", darkMode: false, borderRadius: "4px", buttonStyle: "square", spacing: "normal", shadow: "md", letterSpacing: "normal", borderWidth: "1px", backgroundTreatment: "plain" },
      creative: { font: "Poppins", darkMode: false, borderRadius: "16px", buttonStyle: "pill", spacing: "relaxed", shadow: "md", letterSpacing: "normal", borderWidth: "0px", backgroundTreatment: "gradient" },
      luxury: { font: "Playfair Display", darkMode: true, borderRadius: "0px", buttonStyle: "sharp", spacing: "relaxed", shadow: "lg", letterSpacing: "wide", borderWidth: "1px", backgroundTreatment: "gradient" },
      friendly: { font: "Nunito", darkMode: false, borderRadius: "20px", buttonStyle: "pill", spacing: "normal", shadow: "sm", letterSpacing: "normal", borderWidth: "0px", backgroundTreatment: "plain" },
      professional: { font: "Lato", darkMode: false, borderRadius: "6px", buttonStyle: "rounded", spacing: "normal", shadow: "md", letterSpacing: "normal", borderWidth: "1px", backgroundTreatment: "plain" },
      bold: { font: "Montserrat", darkMode: true, borderRadius: "4px", buttonStyle: "square", spacing: "compact", shadow: "xl", letterSpacing: "tight", borderWidth: "2px", backgroundTreatment: "gradient" },
      elegant: { font: "Cormorant Garamond", darkMode: true, borderRadius: "0px", buttonStyle: "sharp", spacing: "relaxed", shadow: "lg", letterSpacing: "wide", borderWidth: "1px", backgroundTreatment: "gradient" },
      tech: { font: "Inter", darkMode: true, borderRadius: "8px", buttonStyle: "rounded", spacing: "compact", shadow: "md", letterSpacing: "normal", borderWidth: "1px", backgroundTreatment: "plain" },
      editorial: { font: "Playfair Display", darkMode: false, borderRadius: "2px", buttonStyle: "sharp", spacing: "relaxed", shadow: "none", letterSpacing: "wide", borderWidth: "1px", backgroundTreatment: "plain" },
    };

    const profile = styleProfiles[styleKey] || styleProfiles["modern"];
    const font = ctx.fontStyle || profile.font;

    // The client's Accent Style step (Minimal/Bold/Gradient/Monochrome) used
    // to never reach here at all - buttonStyle came only from the design
    // style profile, so every accent choice looked identical. Let an
    // explicit accent choice override the design style's button shape.
    //
    // The button treatment used to only reach a handful of `bg-primary`
    // buttons - most hero CTAs actually use bg-foreground or bg-background,
    // so the accent choice barely showed up anywhere. WebsiteRenderer now
    // targets every CTA button pattern in the library, and each accent has
    // its own fill AND shadow treatment (not just corner radius/border), so
    // the difference reads clearly at a glance instead of needing a
    // side-by-side close-up to spot:
    //   Minimal    - soft round, solid fill, no shadow: quiet and clean.
    //   Bold       - square, solid fill, hard offset "brutalist" shadow that
    //                shifts on hover: loud and graphic.
    //   Gradient   - pill, the button itself is gradient-filled (not just
    //                the page background) with a soft colored glow: vivid.
    //   Monochrome - square, transparent/outlined, fills in on hover, no
    //                shadow: understated and refined.
    const accentOverrides: Record<string, { buttonStyle: string; borderWidth: string; backgroundTreatment: string; buttonFill: string; buttonShadow: string }> = {
      minimal: { buttonStyle: "rounded", borderWidth: "1px", backgroundTreatment: "plain", buttonFill: "solid", buttonShadow: "none" },
      bold: { buttonStyle: "square", borderWidth: "3px", backgroundTreatment: "plain", buttonFill: "solid", buttonShadow: "offset" },
      gradient: { buttonStyle: "pill", borderWidth: "0px", backgroundTreatment: "gradient", buttonFill: "gradient", buttonShadow: "glow" },
      monochrome: { buttonStyle: "sharp", borderWidth: "2px", backgroundTreatment: "plain", buttonFill: "outline", buttonShadow: "none" },
    };
    const accentOverride = accentOverrides[(ctx.accentStyle || "").toLowerCase()];

    // Respect the client's explicit Light/Dark choice; "auto" (or unset)
    // falls back to whatever the design style normally uses.
    const mode = (ctx.themeMode || "auto").toLowerCase();
    const darkMode = mode === "dark" ? true : mode === "light" ? false : profile.darkMode;

    const shadowMap: Record<string, string> = {
      none: "none",
      sm: "0 1px 2px 0 rgba(0,0,0,0.05)",
      md: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
      lg: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
      xl: "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
    };

    // Both light AND dark mode get a subtle tint of the chosen primary
    // color instead of a flat neutral, so the brand color is visible across
    // the whole page, not just on buttons. Dark mode used to hardcode the
    // exact same "#0F0F0F"/"#262626"/"#333333" for every style, so any two
    // dark-mode styles (Premium, Luxury, Bold, Elegant, Tech) rendered an
    // identical page background and only differed by a small accent color -
    // easy to miss, especially between styles with muted/desaturated
    // primaries like Premium's crimson and Luxury's gold.
    const backgroundColor = darkMode ? mixWithWhite(ctx.primaryColor, 0.93, "black") : mixWithWhite(ctx.primaryColor, 0.94);
    const mutedColor = darkMode ? mixWithWhite(ctx.primaryColor, 0.85, "black") : mixWithWhite(ctx.primaryColor, 0.88);
    const borderColor = darkMode ? mixWithWhite(ctx.primaryColor, 0.72, "black") : mixWithWhite(ctx.primaryColor, 0.8);

    return {
      primaryColor: ctx.primaryColor,
      secondaryColor: ctx.secondaryColor,
      backgroundColor,
      foregroundColor: darkMode ? "#F5F5F5" : "#1A1A1A",
      background: backgroundColor,
      textColor: darkMode ? "#F5F5F5" : "#1A1A1A",
      mutedColor,
      borderColor,
      fontStyle: font,
      fontFamily: font,
      darkMode,
      borderRadius: ctx.config.designStyle.borderRadius || profile.borderRadius,
      // An explicit accent choice wins over both the business-type preset
      // and the design style's default button shape.
      buttonStyle: accentOverride?.buttonStyle || ctx.config.designStyle.buttonStyle || profile.buttonStyle,
      spacing: profile.spacing,
      shadow: shadowMap[profile.shadow],
      letterSpacing: profile.letterSpacing,
      borderWidth: accentOverride?.borderWidth || profile.borderWidth,
      backgroundTreatment: accentOverride?.backgroundTreatment || profile.backgroundTreatment,
      buttonFill: accentOverride?.buttonFill || "solid",
      buttonShadow: accentOverride?.buttonShadow || "none",
      // Per-section color overrides, keyed by component category - see
      // client/src/renderer/WebsiteRenderer.tsx's buildSectionStyleOverride,
      // which is what actually applies these (same renderer used for the
      // live preview, the real generated site, and downloaded exports).
      sectionColors: ctx.sectionColors || {},
    };
  }
}

export default MockAIProvider;
