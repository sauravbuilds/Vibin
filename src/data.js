export const SUPPORTED_CITIES = [
  'bangalore', 'bengaluru'
];

export const ACTIVITIES = {
  bangalore: [
    {
      id: 'cubbon', name: 'Cubbon Park', type: 'walk', dur: '1.5 hrs', cost: 0,
      crowd: 'low', indoor: false,
      desc: '300 acres of shaded walking trails, open lawns, and birdsong in the heart of the city. Weekend mornings here feel like the city exhales.',
      why: 'Peaceful, free, and deeply restorative — exactly right for a tired mind that still wants to feel alive.',
      tags: ['walks', 'nature', 'photography'], moods: ['tired but wants fun', 'chill and relaxed', 'introspective']
    },
    {
      id: 'lalbagh', name: 'Lalbagh Botanical Garden', type: 'walk', dur: '2 hrs', cost: 30,
      crowd: 'medium', indoor: false,
      desc: '240 acres of rare trees, a Victorian glass house, and lotus ponds. One of South India\'s finest green spaces.',
      why: 'Beautiful for photography and slow walks. The morning light through the trees is genuinely something.',
      tags: ['walks', 'nature', 'photography'], moods: ['chill and relaxed', 'creative', 'introspective']
    },
    {
      id: 'ngma', name: 'National Gallery of Modern Art', type: 'art', dur: '2 hrs', cost: 20,
      crowd: 'low', indoor: true,
      desc: 'A colonial-era mansion turned gallery, housing some of India\'s finest modern and contemporary art. Cool, calm, and rarely crowded.',
      why: 'Culture without crowds. If you\'re introspective or creative, this will quietly recharge you.',
      tags: ['art', 'introspective', 'creative'], moods: ['introspective', 'creative', 'chill and relaxed']
    },
    {
      id: 'blossom', name: 'Blossom Book House', type: 'books', dur: '1 hr', cost: 0,
      crowd: 'low', indoor: true,
      desc: 'Bangalore\'s most beloved independent bookshop, packed floor-to-ceiling with second-hand finds. Every visit is a treasure hunt.',
      why: 'Free to browse, zero pressure, completely your own pace. Bibliophiles lose track of time here.',
      tags: ['books', 'introspective', 'creative'], moods: ['introspective', 'chill and relaxed', 'creative']
    },
    {
      id: 'matteo', name: 'Matteo Coffea', type: 'coffee', dur: '1 hr', cost: 380,
      crowd: 'medium', indoor: true,
      desc: 'A sleek, plant-filled specialty café on Church Street. Known for single-origin pour-overs and a calm, creative crowd.',
      why: 'The kind of café where time slows down beautifully. Perfect mid-morning pause.',
      tags: ['coffee', 'music', 'social', 'creative'], moods: ['social', 'creative', 'chill and relaxed']
    },
    {
      id: 'dyu', name: 'Dyu Art Café', type: 'music', dur: '2 hrs', cost: 280,
      crowd: 'low', indoor: true,
      desc: 'A café-gallery with rotating art exhibitions and live acoustic music on weekends. Fully vegetarian menu, excellent filter coffee.',
      why: 'Ticks every box — art, music, food, calm vibe. A rare find that rarely disappoints.',
      tags: ['music', 'art', 'food', 'coffee', 'introspective'], moods: ['introspective', 'creative', 'chill and relaxed', 'romantic']
    },
    {
      id: 'attagalatta', name: 'Atta Galatta Bookstore', type: 'books', dur: '1.5 hrs', cost: 220,
      crowd: 'low', indoor: true,
      desc: 'A charming indie bookstore with a café, a stage for literary events, and a wall of handpicked reads. Koramangala\'s quiet gem.',
      why: 'Perfect for recharging. You can spend an hour browsing and another hour over coffee without anyone rushing you.',
      tags: ['books', 'coffee', 'music', 'introspective'], moods: ['introspective', 'chill and relaxed', 'creative']
    },
    {
      id: 'indiranagar', name: '100 Feet Road, Indiranagar', type: 'markets', dur: '2 hrs', cost: 0,
      crowd: 'medium', indoor: false,
      desc: 'Bangalore\'s most walkable commercial strip — indie boutiques, cafés, galleries, and street food all within a pleasant stroll.',
      why: 'Stimulating without being overwhelming. Great for social moods or just drifting.',
      tags: ['markets', 'social', 'food', 'coffee'], moods: ['social', 'adventurous', 'creative']
    },
    {
      id: 'ics', name: 'Indian Coffee House', type: 'coffee', dur: '1 hr', cost: 120,
      crowd: 'low', indoor: true,
      desc: 'A legendary Bangalore institution since the 1950s. Worn wooden chairs, strong filter coffee, and a timeless atmosphere.',
      why: 'Budget-friendly, vegetarian-friendly, and deeply nostalgic. A place that belongs to a slower era.',
      tags: ['coffee', 'books', 'introspective'], moods: ['introspective', 'chill and relaxed', 'tired but wants fun']
    },
    {
      id: 'jaaga', name: 'Jaaga Commons', type: 'art', dur: '1.5 hrs', cost: 0,
      crowd: 'low', indoor: true,
      desc: 'A community creative space in Shivajinagar hosting workshops, exhibitions, and casual creative sessions on weekends.',
      why: 'Free, low-key, and full of interesting people. Good for the creative or socially curious.',
      tags: ['art', 'creative', 'social'], moods: ['creative', 'social', 'adventurous']
    },
  ],

  mumbai: [
    {
      id: 'bandstand', name: 'Bandstand Promenade', type: 'walk', dur: '1.5 hrs', cost: 0,
      crowd: 'medium', indoor: false,
      desc: 'A breezy seaside walkway in Bandra with views of the sea link, old Portuguese ruins, and a lively crowd on weekend mornings.',
      why: 'The sea air and the skyline together make a weekend morning feel genuinely special.',
      tags: ['walks', 'nature', 'photography'], moods: ['chill and relaxed', 'romantic', 'social']
    },
    {
      id: 'csmvs', name: 'Chhatrapati Shivaji Maharaj Museum', type: 'art', dur: '2.5 hrs', cost: 85,
      crowd: 'low', indoor: true,
      desc: 'One of India\'s finest museums — art, natural history, and armoury housed in a stunning Mughal-Gothic dome structure.',
      why: 'Cool, beautiful, and endlessly interesting. A genuinely rewarding couple of hours.',
      tags: ['art', 'introspective', 'creative'], moods: ['introspective', 'creative', 'chill and relaxed']
    },
    {
      id: 'dharavi', name: 'Dharavi Craft Tour', type: 'markets', dur: '2 hrs', cost: 800,
      crowd: 'low', indoor: false,
      desc: 'A guided walking tour through Dharavi\'s famous craft workshops — leather goods, pottery, recycling units, and small bakeries.',
      why: 'Genuinely eye-opening and nothing like a typical day out. Reserved for the adventurous.',
      tags: ['markets', 'art', 'adventurous'], moods: ['adventurous', 'creative', 'social'],
      tradeoff: 'Slightly over budget for experiences, but unlike anything else in the city.'
    },
    {
      id: 'elfinhill', name: 'Mahim Nature Park', type: 'walk', dur: '1.5 hrs', cost: 25,
      crowd: 'low', indoor: false,
      desc: 'A hidden 35-acre mangrove sanctuary in the middle of the city. Boardwalk trails and birdsong with the skyline in the background.',
      why: 'Surreal and peaceful — you forget you\'re in Mumbai entirely. Perfect for the exhausted.',
      tags: ['walks', 'nature', 'photography'], moods: ['tired but wants fun', 'introspective', 'chill and relaxed']
    },
    {
      id: 'kalaghoda', name: 'Kala Ghoda Walk', type: 'art', dur: '2 hrs', cost: 0,
      crowd: 'medium', indoor: false,
      desc: 'Mumbai\'s art district — galleries, heritage buildings, and street art concentrated in a compact, walkable area.',
      why: 'Free, culturally rich, and easy to pace yourself. A photographer\'s dream street.',
      tags: ['art', 'walks', 'photography', 'creative'], moods: ['creative', 'adventurous', 'social']
    },
  ],

  delhi: [
    {
      id: 'lodi', name: 'Lodi Garden', type: 'walk', dur: '1.5 hrs', cost: 0,
      crowd: 'low', indoor: false,
      desc: '90 acres of landscaped grounds surrounding 15th-century Mughal tombs. One of Delhi\'s most serene green spaces.',
      why: 'History embedded in nature. Peaceful enough for an introspective morning, beautiful enough to photograph.',
      tags: ['walks', 'nature', 'photography'], moods: ['introspective', 'chill and relaxed', 'tired but wants fun']
    },
    {
      id: 'ngma_delhi', name: 'National Gallery of Modern Art, Delhi', type: 'art', dur: '2 hrs', cost: 20,
      crowd: 'low', indoor: true,
      desc: 'Housed in a former royal residence, the collection spans 150 years of Indian modern art with world-class rotating exhibitions.',
      why: 'Cool interiors, important art, and rarely crowded on weekday mornings.',
      tags: ['art', 'introspective', 'creative'], moods: ['introspective', 'creative', 'chill and relaxed']
    },
    {
      id: 'hazrat', name: 'Hazrat Nizamuddin Dargah', type: 'music', dur: '1.5 hrs', cost: 0,
      crowd: 'medium', indoor: false,
      desc: 'A 13th-century Sufi shrine where qawwali is performed Thursday and Sunday evenings. One of Delhi\'s most transcendent experiences.',
      why: 'Moving and meditative. For anyone who wants to feel something real.',
      tags: ['music', 'introspective', 'art'], moods: ['introspective', 'romantic', 'chill and relaxed']
    },
    {
      id: 'dilli_haat', name: 'Dilli Haat, INA', type: 'markets', dur: '2 hrs', cost: 100,
      crowd: 'medium', indoor: false,
      desc: 'A permanent crafts fair with artisans from every state, regional food stalls, and live folk performances on weekends.',
      why: 'Stimulating, varied, and surprisingly calm in the mornings. Great for curious moods.',
      tags: ['markets', 'food', 'art', 'music'], moods: ['social', 'adventurous', 'creative']
    },
  ],

  hyderabad: [
    {
      id: 'kbr', name: 'KBR National Park', type: 'walk', dur: '1.5 hrs', cost: 10,
      crowd: 'low', indoor: false,
      desc: 'A 390-acre nature reserve inside the city, home to deer, monitor lizards, and over 100 bird species. Mornings are magical.',
      why: 'Free from noise and concrete. One of the best urban nature walks in India.',
      tags: ['walks', 'nature', 'photography'], moods: ['tired but wants fun', 'introspective', 'chill and relaxed']
    },
    {
      id: 'salar', name: 'Salar Jung Museum', type: 'art', dur: '3 hrs', cost: 20,
      crowd: 'medium', indoor: true,
      desc: 'One of the world\'s largest one-man collections — antiques, weaponry, manuscripts, and art gathered across centuries.',
      why: 'Overwhelming in the best way. A full morning\'s worth of wonder for an inquisitive mind.',
      tags: ['art', 'introspective', 'creative'], moods: ['introspective', 'creative', 'adventurous']
    },
    {
      id: 'hussain', name: 'Hussain Sagar Lake Walk', type: 'walk', dur: '1.5 hrs', cost: 0,
      crowd: 'medium', indoor: false,
      desc: 'A 3km promenade around one of the world\'s largest artificial lakes, with skyline views and street food stalls along the way.',
      why: 'Effortless and pleasant. Good for clearing your head without exerting yourself.',
      tags: ['walks', 'photography', 'social'], moods: ['chill and relaxed', 'social', 'romantic']
    },
  ],

  chennai: [
    {
      id: 'elliot', name: 'Elliot\'s Beach, Besant Nagar', type: 'walk', dur: '1.5 hrs', cost: 0,
      crowd: 'low', indoor: false,
      desc: 'Chennai\'s quieter alternative to Marina — a clean, breezy stretch of beach with a Portuguese church, a café row, and decent waves.',
      why: 'The sea always works. This stretch is calm enough to actually sit and think.',
      tags: ['walks', 'nature', 'photography'], moods: ['chill and relaxed', 'introspective', 'tired but wants fun']
    },
    {
      id: 'dakshinachitra', name: 'DakshinaChitra Museum', type: 'art', dur: '2.5 hrs', cost: 250,
      crowd: 'low', indoor: false,
      desc: 'A living museum of South Indian heritage — restored traditional homes from Tamil Nadu, Kerala, Karnataka, and Andhra.',
      why: 'Quiet, beautiful, and unlike most museums. Walk through 200-year-old homes at your own pace.',
      tags: ['art', 'walks', 'introspective'], moods: ['introspective', 'creative', 'chill and relaxed'],
      tradeoff: 'Entry is slightly higher than most, but the experience is genuinely unique.'
    },
  ],

  pune: [
    {
      id: 'aga_khan', name: 'Aga Khan Palace & Gardens', type: 'walk', dur: '1.5 hrs', cost: 25,
      crowd: 'low', indoor: false,
      desc: 'A grand Italian-style palace set in 19 acres of manicured lawns — also a significant Gandhian historical site.',
      why: 'Peaceful, historic, and large enough to wander without crowds.',
      tags: ['walks', 'art', 'photography'], moods: ['introspective', 'chill and relaxed', 'romantic']
    },
    {
      id: 'tilak_smarak', name: 'Tilak Smarak Mandir', type: 'music', dur: '2 hrs', cost: 0,
      crowd: 'low', indoor: true,
      desc: 'Pune\'s main cultural venue hosts classical music concerts, theatre, and dance performances on most weekend afternoons.',
      why: 'Genuinely world-class performances, often free or extremely affordable.',
      tags: ['music', 'art', 'introspective'], moods: ['introspective', 'romantic', 'chill and relaxed']
    },
  ],

  goa: [
    {
      id: 'fontainhas', name: 'Fontainhas Latin Quarter', type: 'walk', dur: '1.5 hrs', cost: 0,
      crowd: 'low', indoor: false,
      desc: 'Goa\'s heritage neighbourhood — narrow lanes, Portuguese-era tiled houses painted in ochre and indigo, and a quiet riverside.',
      why: 'The most photogenic neighbourhood in India. Walk slowly. Look up often.',
      tags: ['walks', 'photography', 'art'], moods: ['introspective', 'creative', 'romantic']
    },
    {
      id: 'saturday_night', name: 'Arpora Saturday Night Market', type: 'markets', dur: '3 hrs', cost: 0,
      crowd: 'high', indoor: false,
      desc: 'Goa\'s legendary flea market — crafts, live music, global food stalls, and a genuinely festive atmosphere.',
      why: 'Nothing else in India quite like this. Go for the energy, stay for the food.',
      tags: ['markets', 'music', 'food', 'social'], moods: ['social', 'adventurous', 'creative'],
      tradeoff: 'Crowded by nature — not ideal if you prefer quieter spaces.'
    },
  ],

  kolkata: [
    {
      id: 'victorian_memorial', name: 'Victoria Memorial Gardens', type: 'walk', dur: '1.5 hrs', cost: 30,
      crowd: 'low', indoor: false,
      desc: 'A grand marble memorial surrounded by 64 acres of pristine lawns, with fountains, sculptures, and sweeping architecture.',
      why: 'Stately, beautiful, and unexpectedly serene. One of the finest public spaces in India.',
      tags: ['walks', 'photography', 'art'], moods: ['romantic', 'introspective', 'chill and relaxed']
    },
    {
      id: 'college_street', name: 'College Street Book Market', type: 'books', dur: '2 hrs', cost: 0,
      crowd: 'medium', indoor: false,
      desc: 'The world\'s largest second-hand book market, stretching for nearly a kilometre with thousands of titles in every language.',
      why: 'If you love books, this is a pilgrimage. Free to browse, impossible to leave empty-handed.',
      tags: ['books', 'markets', 'introspective'], moods: ['introspective', 'creative', 'adventurous']
    },
  ],

  jaipur: [
    {
      id: 'nahargarh', name: 'Nahargarh Fort Walk', type: 'walk', dur: '2 hrs', cost: 100,
      crowd: 'low', indoor: false,
      desc: 'A Rajput fort perched above the city with sweeping views of Jaipur, the Aravalli hills, and the Jal Mahal lake.',
      why: 'The views alone justify the climb. Mornings before 10am are quiet and golden.',
      tags: ['walks', 'photography', 'nature'], moods: ['adventurous', 'creative', 'introspective']
    },
    {
      id: 'albert_hall', name: 'Albert Hall Museum', type: 'art', dur: '2 hrs', cost: 40,
      crowd: 'low', indoor: true,
      desc: 'A beautiful Indo-Saracenic building housing Rajasthani crafts, Egyptian mummies, natural history, and Mughal-era miniatures.',
      why: 'Eclectic, well-curated, and architecturally magnificent. Worth every rupee.',
      tags: ['art', 'introspective', 'photography'], moods: ['introspective', 'creative', 'chill and relaxed']
    },
  ],
};

export const FOOD = {
  bangalore: [
    { id: 'mtr', name: 'MTR — Mavalli Tiffin Room', cuisine: 'South Indian', veg: true, cph: 320, crowd: 'high', timing: ['breakfast', 'lunch'], desc: 'A Bangalore institution since 1924. The rava idli was invented here. The queue moves fast and the food is worth it.', why: 'Legendary taste, deeply vegetarian, and genuinely affordable. A city rite of passage.', tradeoff: 'Moderately crowded on weekends — but the queue is short and fast.' },
    { id: 'brahmin', name: "Brahmin's Coffee Bar", cuisine: 'South Indian', veg: true, cph: 80, crowd: 'low', timing: ['breakfast'], desc: 'A tiny counter famous for idli-vada and the purest filter coffee in the city. Opens early and wraps by 11am.', why: 'Almost free, purely vegetarian, and deeply satisfying. Perfect first stop.', tradeoff: null },
    { id: 'carrots', name: 'Carrots Restaurant', cuisine: 'Global vegetarian', veg: true, cph: 450, crowd: 'low', timing: ['lunch', 'dinner'], desc: 'A fully vegetarian restaurant with a thoughtful menu spanning Mediterranean, South Indian, and fusion bowls.', why: 'Relaxed, inventive, and never crowded. For anyone eating well.', tradeoff: null },
    { id: 'sattvik', name: 'Sattvik', cuisine: 'Sattvic vegetarian', veg: true, cph: 350, crowd: 'low', timing: ['lunch'], desc: 'Slow-food vegetarian cooking without onion or garlic. Nourishing in both food and atmosphere.', why: 'Perfect for a tired day. The food is restorative and the room is calm.', tradeoff: null },
    { id: 'hole', name: 'The Hole in the Wall Café', cuisine: 'Continental brunch', veg: false, cph: 520, crowd: 'medium', timing: ['brunch', 'lunch'], desc: 'A tucked-away garden café on Vittal Mallya Road. Slow brunch plates, good coffee, and lush outdoor seating.', why: 'Feels like a secret. Outdoor seating in the shade with no rush.', tradeoff: 'Slightly over ₹400/head — but the garden setting makes it worthwhile.' },
    { id: 'vidyarthi', name: 'Vidyarthi Bhavan', cuisine: 'South Indian', veg: true, cph: 100, crowd: 'medium', timing: ['breakfast'], desc: 'Gandhi Bazaar\'s most famous breakfast spot, serving crispy dosas since 1943.', why: 'Legendary and incredibly affordable. If you\'ve never been, today is the day.', tradeoff: null },
    { id: 'thrive', name: 'Thrive Café', cuisine: 'Health café', veg: true, cph: 420, crowd: 'low', timing: ['brunch', 'lunch'], desc: 'A plant-forward café in Koramangala with grain bowls, smoothies, and a calm upstairs seating area.', why: 'Great for creative moods. Nourishing food that doesn\'t slow you down.', tradeoff: null },
    { id: 'koshy', name: "Koshy's Restaurant", cuisine: 'Anglo-Indian', veg: false, cph: 380, crowd: 'low', timing: ['brunch', 'lunch', 'dinner'], desc: 'Bangalore\'s oldest restaurant, opened in 1940. Worn leather booths, old ceiling fans, and a menu unchanged for decades.', why: 'Atmospheric, unhurried, and completely unique. The kind of place that feels like it belongs to you.', tradeoff: 'Not fully vegetarian — ask the kitchen, they can accommodate.' },
  ],

  mumbai: [
    { id: 'kyani', name: "Kyani & Co.", cuisine: 'Irani café', veg: false, cph: 120, crowd: 'low', timing: ['breakfast', 'brunch'], desc: 'A Mumbai institution since 1904. Bun maska, khari biscuit, and chai in a timeless Parsi café setting.', why: 'Budget-friendly, atmospheric, and genuinely old Mumbai.', tradeoff: null },
    { id: 'prakash', name: 'Prakash Shakahari Upahaar', cuisine: 'South Indian / Maharashtrian', veg: true, cph: 80, crowd: 'low', timing: ['breakfast'], desc: 'A Dadar institution beloved for its misal pav and sabudana khichdi. Opens early, closes before noon.', why: 'Absurdly cheap, fully vegetarian, and a local favourite.', tradeoff: null },
    { id: 'prabhat', name: 'Prabhat Restaurant', cuisine: 'Maharashtrian vegetarian', veg: true, cph: 200, crowd: 'medium', timing: ['lunch'], desc: 'Authentic Maharashtrian thali with unlimited dal, bhakri, and seasonal vegetables. A proper midday meal.', why: 'Value, comfort, and vegetarian through and through.', tradeoff: null },
    { id: 'salt_water', name: 'Salt Water Café', cuisine: 'Fusion brunch', veg: false, cph: 600, crowd: 'medium', timing: ['brunch', 'lunch'], desc: 'A beloved Bandra brunch spot with outdoor seating, eggs every which way, and excellent cold brew.', why: 'The perfect unhurried weekend brunch. Slightly slower paced, very worth it.', tradeoff: 'Above average spend — but the experience matches.' },
  ],

  delhi: [
    { id: 'paranthe_wali', name: 'Paranthe Wali Gali', cuisine: 'North Indian street', veg: true, cph: 150, crowd: 'medium', timing: ['breakfast', 'brunch'], desc: 'A narrow alley in Chandni Chowk that has served stuffed parathas since 1872. A Delhi rite of passage.', why: 'Cheap, vegetarian-friendly, and genuinely historic. One of Delhi\'s best morning meals.', tradeoff: null },
    { id: 'saravana', name: 'Saravana Bhavan, Connaught', cuisine: 'South Indian', veg: true, cph: 280, crowd: 'medium', timing: ['breakfast', 'lunch'], desc: 'The Delhi outpost of the legendary Chennai chain. Consistently excellent idli, dosa, and filter coffee.', why: 'Reliable, vegetarian, and easy on the budget.', tradeoff: null },
    { id: 'indian_accent', name: 'Lavaash by Saby', cuisine: 'Armenian-Bengali fusion', veg: false, cph: 900, crowd: 'low', timing: ['lunch', 'dinner'], desc: 'A creative fine-dining restaurant exploring the Armenian-Bengali culinary connection. One of Delhi\'s most interesting menus.', why: 'For a mood that calls for something genuinely special and different.', tradeoff: 'A splurge — significantly above average budget. But a genuinely memorable meal.' },
  ],

  hyderabad: [
    { id: 'nimrah', name: 'Nimrah Café & Bakery', cuisine: 'Hyderabadi', veg: false, cph: 80, crowd: 'low', timing: ['breakfast'], desc: 'A 70-year-old bakery beside the Charminar, beloved for Osmania biscuits and Irani chai. Arrives hot, costs almost nothing.', why: 'Legendary and absurdly affordable. The best ₹80 you\'ll spend all week.', tradeoff: null },
    { id: 'chutneys', name: 'Chutneys', cuisine: 'South Indian vegetarian', veg: true, cph: 280, crowd: 'low', timing: ['breakfast', 'lunch'], desc: 'Hyderabad\'s finest vegetarian South Indian restaurant. The pesarattu and filter coffee are a revelation.', why: 'Consistent, calm, and completely vegetarian. Never a bad meal here.', tradeoff: null },
    { id: 'firdaus', name: 'Firdaus, Taj Krishna', cuisine: 'Hyderabadi dum biryani', veg: false, cph: 950, crowd: 'low', timing: ['lunch', 'dinner'], desc: 'The restaurant that perfected dum biryani. Set inside the Taj Krishna, it\'s a special-occasion meal by design.', why: 'If the day calls for something extraordinary, this is where you go.', tradeoff: 'Well above the standard budget — consider this for an occasion worth marking.' },
  ],

  chennai: [
    { id: 'ratna', name: 'Ratna Café', cuisine: 'Tamil vegetarian', veg: true, cph: 150, crowd: 'medium', timing: ['breakfast', 'lunch'], desc: 'A legendary Triplicane restaurant serving idli, sambar, and filter coffee since 1948. Often imitated, never matched.', why: 'The definitive Chennai breakfast. Affordable, vegetarian, and famous for good reason.', tradeoff: null },
    { id: 'murugan', name: 'Murugan Idli Shop', cuisine: 'Tamil vegetarian', veg: true, cph: 120, crowd: 'medium', timing: ['breakfast', 'brunch'], desc: 'Famous for its extra-soft idlis and the widest variety of chutneys in the city.', why: 'One of those spots every Chennai resident swears by. Cheap and satisfying.', tradeoff: null },
    { id: 'sandy_beach', name: 'Sandy\'s Chocolate Lab', cuisine: 'Café & desserts', veg: false, cph: 450, crowd: 'low', timing: ['brunch', 'lunch'], desc: 'A serious artisanal chocolate café in Nungambakkam. Everything made in-house, including remarkable hot chocolate.', why: 'For a creative or romantic mood — quiet, indulgent, and beautifully done.', tradeoff: null },
  ],

  pune: [
    { id: 'vaishali', name: 'Vaishali Restaurant', cuisine: 'South Indian vegetarian', veg: true, cph: 180, crowd: 'medium', timing: ['breakfast', 'brunch'], desc: 'Pune\'s most beloved breakfast landmark, operating since 1969 on FC Road. Dosas, wadas, and filter coffee under the open sky.', why: 'A Pune institution. The outdoor seating and the crowd make breakfast feel like an event.', tradeoff: null },
    { id: 'kayani', name: 'Kayani Bakery', cuisine: 'Irani bakery', veg: false, cph: 100, crowd: 'low', timing: ['breakfast'], desc: 'An 80-year-old Parsi bakery famous for shrewsbury biscuits, plum cakes, and strong chai.', why: 'Budget, historic, and unlike anywhere else. Worth queuing for.', tradeoff: null },
  ],

  goa: [
    { id: 'fishermans', name: "Fisherman's Wharf", cuisine: 'Goan seafood', veg: false, cph: 700, crowd: 'low', timing: ['lunch', 'dinner'], desc: 'A riverside restaurant in Cavelossim with a shaded deck, fresh catch, and exceptional prawn curry.', why: 'The perfect Goan lunch. Slow, scenic, and completely relaxed.', tradeoff: 'Not vegetarian-friendly — the entire menu is seafood-forward.' },
    { id: 'cafe_bhonsle', name: 'Café Bhonsle', cuisine: 'Goan vegetarian', veg: true, cph: 180, crowd: 'low', timing: ['breakfast', 'brunch'], desc: 'A laid-back local café in Panaji serving poha, upma, and fresh coconut chai on a shaded patio.', why: 'Completely vegetarian, completely unpretentious. The kind of place you find and keep returning to.', tradeoff: null },
  ],

  kolkata: [
    { id: 'flury', name: "Flurys", cuisine: 'Patisserie & continental', veg: false, cph: 450, crowd: 'medium', timing: ['breakfast', 'brunch'], desc: 'Kolkata\'s legendary Swiss patisserie since 1927. Eggs benedict, eclairs, and old-school club sandwiches on Park Street.', why: 'An institution that has survived nearly a century. The atmosphere is worth the visit alone.', tradeoff: null },
    { id: 'kewpies', name: "Kewpie's Kitchen", cuisine: 'Bengali home cooking', veg: false, cph: 350, crowd: 'low', timing: ['lunch'], desc: 'The most authentic Bengali thali in the city. A home-restaurant experience in a residential townhouse.', why: 'Incredibly personal and warm. The food tastes exactly like someone\'s mother cooked it.', tradeoff: 'No vegetarian thali — they will, however, cook to accommodate with advance notice.' },
  ],

  jaipur: [
    { id: 'lmb', name: 'LMB — Laxmi Mishtan Bhandar', cuisine: 'Rajasthani vegetarian', veg: true, cph: 250, crowd: 'medium', timing: ['breakfast', 'lunch'], desc: 'A Jaipur landmark since 1954, famous for its daal baati churma, ghewar, and freshly made mishri mawa.', why: 'Every dish is a Rajasthani classic, done exactly right. A natural first stop in the city.', tradeoff: null },
    { id: 'four_seasons', name: 'Four Seasons Restaurant', cuisine: 'Vegetarian North Indian', veg: true, cph: 320, crowd: 'low', timing: ['lunch', 'dinner'], desc: 'A Jaipur institution on Subhash Marg, beloved for its thali and the richest dal makhani in the region.', why: 'Budget-conscious, fully vegetarian, and consistently excellent.', tradeoff: null },
  ],
};

// Fallback for unsupported cities
export const FALLBACK_ACTIVITIES = ACTIVITIES.bangalore;
export const FALLBACK_FOOD = FOOD.bangalore;

export const MOOD_OPTIONS = [
  { value: 'tired but wants fun', label: 'Tired, but up for something' },
  { value: 'adventurous', label: 'Adventurous' },
  { value: 'chill and relaxed', label: 'Chill and relaxed' },
  { value: 'romantic', label: 'Romantic' },
  { value: 'social', label: 'Social and lively' },
  { value: 'introspective', label: 'Introspective' },
  { value: 'creative', label: 'Creative' },
];

export const INTEREST_OPTIONS = [
  { value: 'food', label: 'Food' },
  { value: 'music', label: 'Music' },
  { value: 'walks', label: 'Walks' },
  { value: 'art', label: 'Art' },
  { value: 'books', label: 'Books' },
  { value: 'nature', label: 'Nature' },
  { value: 'coffee', label: 'Coffee' },
  { value: 'markets', label: 'Markets' },
  { value: 'photography', label: 'Photography' },
  { value: 'cinema', label: 'Cinema' },
];

export const CONSTRAINT_OPTIONS = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'avoid crowds', label: 'Avoid crowds' },
  { value: 'no alcohol', label: 'No alcohol' },
  { value: 'wheelchair', label: 'Wheelchair accessible' },
  { value: 'pet friendly', label: 'Pet friendly' },
  { value: 'kids', label: 'Child friendly' },
  { value: 'indoors', label: 'Indoors only' },
  { value: 'outdoors', label: 'Outdoors only' },
];
