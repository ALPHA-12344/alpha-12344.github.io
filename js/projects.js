/* ==========================================================================
   PROJECTS DATA
   --------------------------------------------------------------------------
   This is the ONLY file you need to edit to add, remove or change projects.
   main.js reads this list and builds the project cards automatically.

   Each project is an object { ... } with these fields:

     title        (text)    Project name
     description  (text)    1–2 short sentences about what it does
     tags         (list)    Technologies used, e.g. ["PHP", "MySQL"]
     category     (text)    "business" or "webapp" (must match a filter button)
     image        (text)    Path to a screenshot, e.g. "images/my-project.jpg"
     imageAlt     (text)    Short description of the screenshot (for accessibility)
     liveUrl      (text)    Link to the live site. Leave "" to hide the button.
     githubUrl    (text)    Link to the code. Leave "" to hide the button.
     featured     (true/false)  Featured projects are shown first with a badge

   Tip: screenshots look best at 1200 × 750 px (16:10). Keep them under
   ~200 KB (use https://squoosh.app to compress them).
   ========================================================================== */

const projects = [
  {
    title: "Nana's Kitchen",
    description:
      "A demo website for a fictional restaurant in Osu, Accra. Customers can browse the menu with prices, check opening hours and location, and order straight on WhatsApp.",
    tags: ["WordPress", "Responsive design", "WhatsApp ordering"],
    category: "business",
    image: "images/nanas-kitchen.svg",
    imageAlt: "Nana's Kitchen restaurant website shown on a laptop and phone",
    liveUrl: "https://nanaskitchen.infinityfreeapp.com", // TODO: paste your live URL, e.g. "https://nanaskitchen.example.com"
    githubUrl: "",
    featured: true,
  },
  {
    title: "SafeArrival",
    description:
      "An escrow-based web platform that protects student tenants from rental fraud. Rent is held securely until the student confirms the room is real and as described.",
    tags: ["PHP", "MySQL", "JavaScript"], // TODO: change to ["Laravel", "MySQL"] if you used Laravel
    category: "webapp",
    image: "images/safearrival.svg",
    imageAlt: "SafeArrival dashboard showing a protected rental payment",
    liveUrl: "", // TODO: live URL
    githubUrl: "", // TODO: GitHub repository URL
    featured: true,
  },
  {
    title: "FoodFusion",
    description:
      "A cooking community website where users can discover recipes, create an account and share their own dishes and culinary tips.", // TODO: check this matches your project
    tags: ["PHP", "MySQL", "HTML", "CSS"],
    category: "webapp",
    image: "images/foodfusion.svg",
    imageAlt: "FoodFusion recipe website home page",
    liveUrl: "", // TODO: live URL
    githubUrl: "", // TODO: GitHub repository URL
    featured: false,
  },
];
