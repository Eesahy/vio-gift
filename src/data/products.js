const IMG = {
  ramadan: "https://images.unsplash.com/photo-1642582431503-5276a6b9798d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
  luxury: "https://images.unsplash.com/photo-1762874925436-e7ad69caabe1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
  romantic: "https://images.unsplash.com/photo-1739912061342-280525e3c20f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
  feminine: "https://images.unsplash.com/photo-1770022006632-f065c8f02c85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
  tea: "https://images.unsplash.com/photo-1760074057726-e94ee8ff1eb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
  honey: "https://images.unsplash.com/photo-1645549826194-1956802d83c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
  incense: "https://images.unsplash.com/photo-1767281076118-3b3562ce9707?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
  snacks: "https://images.unsplash.com/photo-1723962807917-ffab0600929c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
};

export const allProducts = [
  // RAMADAN
  { id: "ram-1", name: "Sacred Serenity Box", description: "Premium dates, herbal tea, organic honey, and incense for peaceful moments during the holy month.", price: 85, image: IMG.ramadan, image2: IMG.tea, theme: "ramadan", tags: ["Best Seller", "Ramadan Special"], items: ["Herbal Tea", "Organic Honey", "Artisanal Incense", "Premium Dates"], perfectFor: ["Ramadan gifting", "Family & friends", "Colleagues"], stock: 12, category: "events" },
  { id: "ram-2", name: "Blessed Ramadan Gift", description: "Elegant collection of wellness essentials for the holy month.", price: 95, image: IMG.tea, image2: IMG.honey, theme: "ramadan", tags: ["Limited Edition"], items: ["Herbal Tea", "Organic Honey", "Healthy Snacks", "Prayer Mat"], perfectFor: ["Family", "Close friends", "Religious occasions"], stock: 8, category: "events" },
  { id: "ram-3", name: "Iftar Delights Package", description: "Thoughtful selection for breaking fast with family and loved ones.", price: 75, image: IMG.honey, image2: IMG.snacks, theme: "ramadan", tags: ["Ramadan Special"], items: ["Herbal Tea", "Dates", "Healthy Snacks", "Honey"], perfectFor: ["Iftar gatherings", "Family", "Neighbours"], stock: 15, category: "events" },

  // EID
  { id: "eid-1", name: "Eid Celebration Box", description: "Premium wellness gifts to celebrate the joyous occasion of Eid.", price: 90, image: IMG.luxury, image2: IMG.incense, theme: "eid", tags: ["Best Seller"], items: ["Herbal Tea", "Organic Honey", "Artisanal Incense", "Gourmet Snacks"], perfectFor: ["Eid celebrations", "Family", "Friends & colleagues"], stock: 10, category: "events" },
  { id: "eid-2", name: "Joyful Eid Collection", description: "Elegant assortment for festive Eid celebrations.", price: 105, image: IMG.tea, image2: IMG.luxury, theme: "eid", tags: ["Limited Edition"], items: ["Premium Tea Set", "Honey", "Incense", "Dates", "Treats"], perfectFor: ["Eid Al Fitr", "Eid Al Adha", "VIP gifting"], stock: 6, category: "events" },

  // FRIENDSHIP
  { id: "fri-1", name: "Friendship Wellness Box", description: "Show appreciation with premium wellness products for your closest friends.", price: 70, image: IMG.romantic, image2: IMG.tea, theme: "friendship", tags: ["Best Seller"], items: ["Herbal Tea", "Healthy Snacks", "Artisanal Incense", "Honey"], perfectFor: ["Birthdays", "Just because", "Thank you gifts"], stock: 14, category: "health" },
  { id: "fri-2", name: "BFF Pamper Package", description: "Luxury self-care treats to celebrate your favourite friendship.", price: 80, image: IMG.feminine, image2: IMG.honey, theme: "friendship", tags: ["New"], items: ["Rose Tea Collection", "Honey", "Face Mask", "Aromatherapy"], perfectFor: ["Best friends", "Galentines", "Celebrations"], stock: 9, category: "health" },

  // MUM
  { id: "mum-1", name: "Mother's Serenity Package", description: "Luxurious wellness gifts for the most special woman in your life.", price: 95, image: IMG.feminine, image2: IMG.tea, theme: "mum", tags: ["Best Seller"], items: ["Premium Tea Collection", "Organic Honey", "Aromatherapy", "Spa Items"], perfectFor: ["Mother's Day", "Her birthday", "Just to say thank you"], stock: 11, category: "health" },
  { id: "mum-2", name: "Pamper Mum Box", description: "Self-care essentials for her to enjoy at her leisure.", price: 85, image: IMG.tea, image2: IMG.honey, theme: "mum", tags: ["Limited Edition"], items: ["Herbal Tea", "Honey", "Incense", "Wellness Treats"], perfectFor: ["Mother's Day", "Appreciation gifts", "Birthdays"], stock: 7, category: "health" },

  // DAD
  { id: "dad-1", name: "Dad's Wellness Collection", description: "Premium gifts for the man who deserves the very best.", price: 90, image: IMG.luxury, image2: IMG.snacks, theme: "dad", tags: ["Best Seller"], items: ["Premium Coffee & Tea", "Organic Honey", "Healthy Snacks", "Grooming"], perfectFor: ["Father's Day", "His birthday", "Appreciation"], stock: 10, category: "health" },
  { id: "dad-2", name: "Strong & Balanced Box", description: "Crafted for the health-conscious dad who appreciates quality.", price: 80, image: IMG.snacks, image2: IMG.tea, theme: "dad", tags: ["New"], items: ["Energy Tea", "Protein Snacks", "Honey", "Wellness Journal"], perfectFor: ["Active dads", "Birthdays", "Father's Day"], stock: 13, category: "health" },

  // HUSBAND
  { id: "hus-1", name: "Husband's Luxury Box", description: "Thoughtful wellness package crafted for your partner.", price: 95, image: IMG.luxury, image2: IMG.tea, theme: "husband", tags: ["Limited Edition"], items: ["Tea & Coffee", "Honey", "Protein Snacks", "Wellness Items"], perfectFor: ["Anniversary", "His birthday", "Valentine's Day"], stock: 8, category: "health" },

  // WIFE
  { id: "wif-1", name: "Wife's Luxury Collection", description: "Exquisite wellness gifts for your beloved.", price: 100, image: IMG.feminine, image2: IMG.incense, theme: "wife", tags: ["Best Seller", "Limited Edition"], items: ["Premium Tea", "Organic Honey", "Aromatherapy", "Luxury Treats"], perfectFor: ["Anniversary", "Valentine's Day", "Her birthday"], stock: 9, category: "health" },
  { id: "wif-2", name: "Her Sanctuary Box", description: "A spa-like experience delivered to her door.", price: 115, image: IMG.tea, image2: IMG.feminine, theme: "wife", tags: ["New"], items: ["Floral Tea Set", "Honey", "Bath Salts", "Candles", "Chocolates"], perfectFor: ["Anniversaries", "Surprise gifts", "Date night in"], stock: 5, category: "health" },

  // COUPLE
  { id: "cou-1", name: "Couples' Harmony Box", description: "Shared wellness moments for two, designed to be enjoyed together.", price: 120, image: IMG.romantic, image2: IMG.luxury, theme: "couple", tags: ["Best Seller"], items: ["Tea for Two", "Honey", "Incense", "Gourmet Treats", "Candles"], perfectFor: ["Anniversary", "Valentine's Day", "Romantic evenings"], stock: 10, category: "health" },
  { id: "cou-2", name: "Together & Thriving Bundle", description: "A wellness journey for two to share and savour.", price: 135, image: IMG.luxury, image2: IMG.romantic, theme: "couple", tags: ["Limited Edition"], items: ["Duo Tea Set", "Raw Honey", "Artisan Incense", "Luxury Snacks", "Couple Journal"], perfectFor: ["New couples", "Anniversaries", "Date nights"], stock: 6, category: "health" },

  // NEW BABY
  { id: "bab-1", name: "New Arrival Blessing Box", description: "Wellness gifts for new parents to celebrate precious new beginnings.", price: 85, image: IMG.luxury, image2: IMG.honey, theme: "newbaby", tags: ["Best Seller"], items: ["Calming Tea", "Organic Honey", "Wellness Snacks", "Baby Keepsake"], perfectFor: ["New parents", "Baby shower", "Celebrating new arrivals"], stock: 14, category: "kids" },

  // CORPORATE
  { id: "cor-1", name: "Corporate Prestige Box", description: "Sophisticated gifting to impress clients and reward your team.", price: 120, image: IMG.luxury, image2: IMG.tea, theme: "corporate", tags: ["Best Seller", "Corporate"], items: ["Premium Tea Set", "Honey", "Artisan Biscuits", "Branded Notebook"], perfectFor: ["Client appreciation", "Team rewards", "Business milestones"], stock: 50, category: "corporate" },
  { id: "cor-2", name: "Executive Wellness Bundle", description: "Premium wellness for discerning professionals.", price: 150, image: IMG.tea, image2: IMG.luxury, theme: "corporate", tags: ["Premium", "Corporate"], items: ["Luxury Tea Collection", "Premium Honey", "Incense", "Executive Planner"], perfectFor: ["VIP clients", "Leadership gifts", "Company events"], stock: 30, category: "corporate" },
  { id: "cor-3", name: "Team Appreciation Pack", description: "Thoughtful team gifts that show you care.", price: 65, image: IMG.snacks, image2: IMG.honey, theme: "corporate", tags: ["Value", "Corporate"], items: ["Tea", "Honey", "Healthy Snacks", "Thank You Card"], perfectFor: ["Team gifting", "Bulk orders", "Staff appreciation"], stock: 100, category: "corporate" },

  // KIDS
  { id: "kid-1", name: "Little Joys Bundle", description: "Fun and healthy treats curated especially for children.", price: 55, image: IMG.snacks, image2: IMG.honey, theme: "kids", tags: ["Kids Favourite"], items: ["Fruit Tea", "Honey Sticks", "Healthy Snacks", "Fun Activity Book"], perfectFor: ["Children's birthdays", "School celebrations", "Holiday gifts"], stock: 20, category: "kids" },

  // TEACHER
  { id: "tea-1", name: "Teacher's Appreciation Box", description: "A heartfelt thank you for those who shape young minds.", price: 70, image: IMG.tea, image2: IMG.honey, theme: "teacher", tags: ["Best Seller"], items: ["Premium Tea", "Honey", "Artisan Biscuits", "Personalised Card"], perfectFor: ["End of term", "Teacher appreciation", "Thank you gifts"], stock: 18, category: "events" },

  // TEENAGER
  { id: "tee-1", name: "Teen Wellness Vibe Box", description: "Cool and contemporary wellness for the modern teenager.", price: 60, image: IMG.snacks, image2: IMG.tea, theme: "teenager", tags: ["Trending"], items: ["Fruity Tea Blend", "Energy Snacks", "Honey", "Wellness Journal"], perfectFor: ["Teens", "Birthdays", "Exam season support"], stock: 16, category: "health" },

  // BOSS
  { id: "bos-1", name: "Boss Class Gift Box", description: "Premium gifting for exceptional leaders.", price: 130, image: IMG.luxury, image2: IMG.tea, theme: "boss", tags: ["Executive", "Best Seller"], items: ["Luxury Tea Set", "Premium Honey", "Artisan Chocolates", "Crystal Gift Set"], perfectFor: ["Boss appreciation", "Milestones", "Farewell gifts"], stock: 12, category: "corporate" },

  // UNCLE
  { id: "unc-1", name: "Uncle's Favourites Box", description: "A premium collection for the uncle who has great taste.", price: 80, image: IMG.luxury, image2: IMG.snacks, theme: "uncle", tags: ["New"], items: ["Coffee & Tea Blend", "Honey", "Gourmet Snacks", "Quality Treats"], perfectFor: ["Birthdays", "Eid gifts", "Appreciation"], stock: 10, category: "health" },

  // AUNTY
  { id: "aut-1", name: "Auntie's Treasures Box", description: "Curated with warmth for the aunty who deserves all the love.", price: 80, image: IMG.feminine, image2: IMG.tea, theme: "aunty", tags: ["New"], items: ["Floral Tea Blend", "Honey", "Aromatherapy", "Wellness Treats"], perfectFor: ["Birthdays", "Eid gifts", "Thank you gifts"], stock: 10, category: "health" },

  // GRANDMA
  { id: "grm-1", name: "Grandma's Garden Box", description: "Gentle wellness treasures for the grandmother you adore.", price: 85, image: IMG.tea, image2: IMG.honey, theme: "grandma", tags: ["Best Seller"], items: ["Calming Herbal Tea", "Honey", "Soft Chocolates", "Lavender Sachet"], perfectFor: ["Grandma's birthday", "Mother's Day", "Eid gifts"], stock: 8, category: "health" },

  // GRANDPA
  { id: "grp-1", name: "Grandpa's Classic Collection", description: "Timeless quality gifts for the grandfather who means the world.", price: 85, image: IMG.luxury, image2: IMG.snacks, theme: "grandpa", tags: ["Best Seller"], items: ["Premium Tea", "Honey", "Gourmet Biscuits", "Classic Treats"], perfectFor: ["Grandpa's birthday", "Father's Day", "Eid gifts"], stock: 8, category: "health" },

  // BROTHER
  { id: "bro-1", name: "Brother Bond Box", description: "Celebrating the bond between brothers with premium picks.", price: 75, image: IMG.snacks, image2: IMG.luxury, theme: "brother", tags: ["New"], items: ["Energy Tea", "Protein Snacks", "Honey", "Grooming Treats"], perfectFor: ["Birthdays", "Eid", "Congratulations"], stock: 12, category: "health" },

  // SISTER
  { id: "sis-1", name: "Sister Love Collection", description: "Beautiful wellness gifts for the sister who lights up your world.", price: 75, image: IMG.feminine, image2: IMG.honey, theme: "sister", tags: ["New"], items: ["Floral Tea", "Honey", "Aromatherapy", "Luxury Treats"], perfectFor: ["Birthdays", "Eid", "Just because"], stock: 12, category: "health" },

  // WEDDING
  { id: "wed-1", name: "Newlywed Bliss Box", description: "A luxurious celebration of love and new beginnings.", price: 140, image: IMG.romantic, image2: IMG.luxury, theme: "wedding", tags: ["Best Seller", "Special Occasion"], items: ["Celebration Tea Set", "Premium Honey", "Incense", "Candles", "Chocolates"], perfectFor: ["Wedding gifts", "Bridal showers", "Engagement parties"], stock: 15, category: "events" },

  // RETIREMENT
  { id: "ret-1", name: "Golden Years Wellness Box", description: "A premium tribute to a lifetime of dedication.", price: 110, image: IMG.luxury, image2: IMG.tea, theme: "retirement", tags: ["Special Occasion"], items: ["Premium Tea Collection", "Honey", "Artisan Biscuits", "Memory Journal"], perfectFor: ["Retirement parties", "Career milestones", "Long service awards"], stock: 10, category: "events" },

  // GRADUATION
  { id: "gra-1", name: "Graduation Celebration Bundle", description: "Marking achievements with premium wellness treats.", price: 90, image: IMG.snacks, image2: IMG.tea, theme: "graduation", tags: ["Best Seller"], items: ["Energy Tea Blend", "Honey", "Healthy Snacks", "Success Journal"], perfectFor: ["Graduation ceremonies", "Academic achievements", "New beginnings"], stock: 18, category: "events" },

  // HOUSEWARMING
  { id: "hou-1", name: "Home Blessing Box", description: "Warm, aromatic wellness gifts to bless a new home.", price: 95, image: IMG.incense, image2: IMG.honey, theme: "housewarming", tags: ["Best Seller"], items: ["Herbal Tea", "Honey", "Premium Incense", "Aromatherapy", "Snacks"], perfectFor: ["Housewarming parties", "New home gifts", "Friends moving"], stock: 14, category: "household" },

  // PROMOTION
  { id: "pro-1", name: "Climb Higher Gift Set", description: "Celebrating professional wins with premium wellness.", price: 100, image: IMG.luxury, image2: IMG.tea, theme: "promotion", tags: ["Corporate", "New"], items: ["Premium Tea", "Honey", "Artisan Chocolates", "Success Planner"], perfectFor: ["Job promotions", "Career milestones", "New roles"], stock: 12, category: "corporate" },

  // THANK YOU
  { id: "thy-1", name: "With Gratitude Box", description: "A heartfelt thank you beautifully expressed.", price: 70, image: IMG.honey, image2: IMG.tea, theme: "thankyou", tags: ["Popular"], items: ["Herbal Tea", "Honey", "Artisan Biscuits", "Thank You Card"], perfectFor: ["Thank you gifts", "Appreciation", "Showing gratitude"], stock: 20, category: "events" },

  // CONGRATULATIONS
  { id: "con-1", name: "Celebration Wellness Bundle", description: "Mark every milestone with premium curated wellness.", price: 85, image: IMG.luxury, image2: IMG.snacks, theme: "congratulations", tags: ["Popular"], items: ["Celebration Tea", "Honey", "Gourmet Snacks", "Gold Ribbon Box"], perfectFor: ["Any achievement", "New ventures", "Personal milestones"], stock: 16, category: "events" },
];

export const getProductsByTheme = (theme) =>
  allProducts.filter((p) => p.theme === theme);

export const getProductById = (id) =>
  allProducts.find((p) => p.id === id);

export const getProductsByCategory = (category) =>
  category === "all" ? allProducts : allProducts.filter((p) => p.category === category);

export const themeCards = [
  // General Themes
  { id: "friendship", name: "Friendship", image: "https://images.unsplash.com/photo-1739912061342-280525e3c20f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800", description: "Honor meaningful connections" },
  { id: "mum", name: "Mum", image: "https://images.unsplash.com/photo-1770022006632-f065c8f02c85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800", description: "Show her your love and gratitude" },
  { id: "dad", name: "Dad", image: "https://images.unsplash.com/photo-1762874925436-e7ad69caabe1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800", description: "Premium gifts for the best dad" },
  { id: "husband", name: "Husband", image: "https://images.unsplash.com/photo-1762874925436-e7ad69caabe1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800", description: "Thoughtful wellness for him" },
  { id: "wife", name: "Wife", image: "https://images.unsplash.com/photo-1770022006632-f065c8f02c85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800", description: "Luxury care she deserves" },
  { id: "couple", name: "Couple", image: "https://images.unsplash.com/photo-1739912061342-280525e3c20f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800", description: "Shared moments of wellness" },
  { id: "newbaby", name: "New Baby", image: "https://images.unsplash.com/photo-1762874925436-e7ad69caabe1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800", description: "Welcome precious new beginnings" },
  { id: "corporate", name: "Corporate", image: "https://images.unsplash.com/photo-1762874925436-e7ad69caabe1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800", description: "Professional elegance for business" },
  { id: "kids", name: "Kids", image: "https://images.unsplash.com/photo-1723962807917-ffab0600929c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800", description: "Fun & healthy treats for little ones" },
  { id: "teacher", name: "Teacher", image: "https://images.unsplash.com/photo-1760074057726-e94ee8ff1eb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800", description: "Celebrate those who inspire" },
  { id: "teenager", name: "Teenager", image: "https://images.unsplash.com/photo-1723962807917-ffab0600929c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800", description: "Cool wellness for modern teens" },
  { id: "boss", name: "Boss", image: "https://images.unsplash.com/photo-1762874925436-e7ad69caabe1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800", description: "Premium gifts for exceptional leaders" },
  { id: "uncle", name: "Uncle", image: "https://images.unsplash.com/photo-1762874925436-e7ad69caabe1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800", description: "For the uncle with great taste" },
  { id: "aunty", name: "Aunty", image: "https://images.unsplash.com/photo-1770022006632-f065c8f02c85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800", description: "Curated warmth for the aunty" },
  { id: "grandma", name: "Grandma", image: "https://images.unsplash.com/photo-1770022006632-f065c8f02c85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800", description: "Gentle wellness for grandma" },
  { id: "grandpa", name: "Grandpa", image: "https://images.unsplash.com/photo-1762874925436-e7ad69caabe1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800", description: "Timeless quality for grandpa" },
  { id: "brother", name: "Brother", image: "https://images.unsplash.com/photo-1723962807917-ffab0600929c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800", description: "Celebrating the brotherhood bond" },
  { id: "sister", name: "Sister", image: "https://images.unsplash.com/photo-1770022006632-f065c8f02c85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800", description: "For the sister who lights your world" },
];

export const themeDisplayNames = {
  ramadan: "Ramadan", eid: "Eid", friendship: "Friendship", mum: "Mum", dad: "Dad",
  husband: "Husband", wife: "Wife", couple: "Couple", newbaby: "New Baby",
  corporate: "Corporate", kids: "Kids", teacher: "Teacher", teenager: "Teenager",
  boss: "Boss", uncle: "Uncle", aunty: "Aunty", grandma: "Grandma", grandpa: "Grandpa",
  brother: "Brother", sister: "Sister", wedding: "Wedding", retirement: "Retirement",
  graduation: "Graduation", housewarming: "Housewarming", promotion: "Promotion",
  thankyou: "Thank You", congratulations: "Congratulations",
};

export const occasionCards = [
  { id: "ramadan", name: "Ramadan", image: "https://images.unsplash.com/photo-1642582431503-5276a6b9798d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800", description: "Sacred moments, beautifully curated" },
  { id: "eid", name: "Eid", image: "https://images.unsplash.com/photo-1762874925436-e7ad69caabe1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800", description: "Celebrate with wellness and joy" },
  { id: "wedding", name: "Wedding", image: "https://images.unsplash.com/photo-1739912061342-280525e3c20f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800", description: "Celebrating love and new beginnings" },
  { id: "graduation", name: "Graduation", image: "https://images.unsplash.com/photo-1723962807917-ffab0600929c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800", description: "Marking every achievement" },
  { id: "retirement", name: "Retirement", image: "https://images.unsplash.com/photo-1762874925436-e7ad69caabe1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800", description: "A tribute to a lifetime of dedication" },
  { id: "housewarming", name: "Housewarming", image: "https://images.unsplash.com/photo-1767281076118-3b3562ce9707?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800", description: "Bless every new home with warmth" },
  { id: "promotion", name: "Promotion", image: "https://images.unsplash.com/photo-1762874925436-e7ad69caabe1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800", description: "Celebrate professional milestones" },
  { id: "thankyou", name: "Thank You", image: "https://images.unsplash.com/photo-1645549826194-1956802d83c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800", description: "Gratitude expressed beautifully" },
  { id: "congratulations", name: "Congratulations", image: "https://images.unsplash.com/photo-1762874925436-e7ad69caabe1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800", description: "Mark every milestone with joy" },
];
