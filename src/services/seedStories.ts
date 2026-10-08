import { SavedStoryItem } from '../types';

export const INITIAL_MASTER_STORIES: SavedStoryItem[] = [
  {
    id: 'seed-gravity-100',
    title: 'The Great Gravity Rollercoaster',
    topic: 'Gravity & Planetary Orbits',
    age_group: '8-10',
    language: 'English',
    reading_level: 'Grade 3-4 (Intermediate)',
    date: 'Mastery Completed',
    story: `Once upon a sunny afternoon in Starlight Observatory, Leo and Maya built a miniature magnetic coaster track. "Why does the coaster car stick to the track when it speeds around the loop, but falls if it moves too slow?" asked Leo, adjusting his goggles.

Doctor Nova, their astronomer mentor, smiled and held up a shiny metal sphere. "It all comes down to two grand partners in physics: gravity and momentum! Gravity is the invisible pull exerted by massive objects, like our Earth, drawing everything gently toward its center."

"So gravity pulls the cart downward," Maya deduced, sketching the loop in her laboratory notebook. "And as long as the cart travels fast enough, its forward velocity pushes outward against the track, balancing gravity perfectly!"

They tested a marble launch with three different speeds. At top speed, the marble glided smoothly through the apex of the loop-de-loop without tumbling! "Physics works every single time," Leo cheered, high-fiving Maya. They realized that the exact same gravitational balance keeps the Moon traveling safely around Earth and Earth revolving around the Sun.`,
    vocabulary: [
      { word: 'Gravity', meaning: 'The universal attractive force that pulls objects toward one another.' },
      { word: 'Momentum', meaning: 'The quantity of motion an object has, determined by its mass and speed.' },
      { word: 'Orbit', meaning: 'The curved path a celestial object takes around a star or planet.' },
      { word: 'Velocity', meaning: 'The speed of an object in a specific given direction.' }
    ],
    fun_facts: [
      'The Moon has 1/6th of Earth gravity, meaning you could jump six times higher there!',
      'Without Earth gravity, all atmosphere, water, and clouds would drift into deep space.'
    ],
    hands_on_activity: {
      title: 'Backyard Parachute Gravity Drop',
      materials: ['Coffee filter or square napkin', 'Piece of string (4 cuts)', 'Small toy figurine or coin', 'Timer'],
      instructions: [
        'Tie a piece of string to each corner of the paper napkin.',
        'Tie all four loose ends together to the small figurine.',
        'Drop the toy from shoulder height with and without the napkin parachute.',
        'Observe how air resistance gently opposes gravitational pull to produce a soft landing!'
      ]
    },
    discussion_questions: [
      'Why do astronauts in orbit appear to float inside the International Space Station?',
      'How does mass affect the gravitational pull between two celestial bodies?'
    ],
    audioScript: 'Once upon a sunny afternoon in Starlight Observatory, Leo and Maya built a miniature coaster track...',
    quizScore: {
      score: 5,
      total: 5
    }
  },
  {
    id: 'seed-photosynthesis-100',
    title: 'The Secret Photosynthesis Factory',
    topic: 'Plant Food & Photosynthesis',
    age_group: '8-10',
    language: 'English',
    reading_level: 'Grade 3-4 (Intermediate)',
    date: 'Mastery Completed',
    story: `Deep inside a giant emerald oak leaf lived Chlora, a cheerful chlorophyll molecule who loved morning sunshine. Every morning, Chlora strapped on her tool belt and prepared the leaf kitchen for breakfast.

"Attention team!" Chlora called out through the microscopic cellular corridors. "Sunlight photons are arriving from above, water droplets are arriving from the root xylem pipes, and carbon dioxide gas is entering through the tiny leaf windows called stomata!"

With a cheerful zap of solar energy, Chlora combined six carbon dioxide molecules and six water molecules. Through the wonder of photosynthesis, the plant produced sweet glucose sugar for growth and released fresh, crisp oxygen bubbles into the air for humans and animals to breathe!

"Thank you, green leaves!" whispered the forest animals as the fresh breeze brushed across the canopy. Chlora smiled, satisfied with another day of feeding the planet.`,
    vocabulary: [
      { word: 'Photosynthesis', meaning: 'The biological process by which green plants make food using sunlight, water, and carbon dioxide.' },
      { word: 'Chlorophyll', meaning: 'The green pigment in plant cells that captures light energy.' },
      { word: 'Stomata', meaning: 'Microscopic pores on leaf surfaces that open and close to breathe gases.' },
      { word: 'Glucose', meaning: 'A simple sugar molecule used by plants and animals for vital metabolic energy.' }
    ],
    fun_facts: [
      'Over half of the world oxygen is produced by microscopic oceanic phytoplankton!',
      'A single mature tree can absorb over 48 pounds of carbon dioxide gas every year.'
    ],
    hands_on_activity: {
      title: 'Underwater Leaf Oxygen Bubbles Experiment',
      materials: ['Fresh green leaf plucked from a bush', 'Clear glass bowl or cup', 'Water', 'Sunny windowsill'],
      instructions: [
        'Submerge the fresh green leaf completely in a glass of water.',
        'Place the glass on a bright sunny windowsill for 1 to 2 hours.',
        'Observe the tiny oxygen bubbles forming along the edge of the leaf as photosynthesis happens in real time!'
      ]
    },
    discussion_questions: [
      'What would happen to animal life if green plants stopped photosynthesizing?',
      'Why do deciduous leaves turn yellow and red when autumn arrives?'
    ],
    audioScript: 'Deep inside a giant emerald oak leaf lived Chlora, a cheerful chlorophyll molecule...',
    quizScore: {
      score: 5,
      total: 5
    }
  },
  {
    id: 'seed-circuits-100',
    title: 'Sparky the Electron & The Closed Circuit',
    topic: 'Electricity & Closed Circuits',
    age_group: '8-10',
    language: 'English',
    reading_level: 'Grade 3-4 (Intermediate)',
    date: 'Mastery Completed',
    story: `Sparky was a tiny, high-energy electron resting inside a chemical AA battery cell. One evening, young engineer Nina connected a copper wire from the battery terminal, through a switch, and into a tiny LED lamp.

"Ready to race?" shouted Sparky. The moment Nina clicked the switch down, the electrical bridge closed shut. Sparky and billions of fellow electrons zoomed at lightning speed through the copper conductor wires!

When they passed through the semiconductor diode of the LED, their kinetic energy transformed into brilliant, warm yellow light. "Look, Dad, the flashlight turned on!" exclaimed Nina.

When Nina lifted the switch back up, a tiny air gap interrupted the path. "Circuit open! Time to halt!" Sparky called out. The electrons safely rested until the next bridge closed.`,
    vocabulary: [
      { word: 'Circuit', meaning: 'A complete, closed loop pathway through which an electric current flows.' },
      { word: 'Conductor', meaning: 'A material (like copper or aluminum) that allows electrical charges to travel freely.' },
      { word: 'Insulator', meaning: 'A material (like rubber or plastic) that prevents electrons from escaping or passing through.' },
      { word: 'Voltage', meaning: 'The electrical pressure that pushes electrons through a conductive loop.' }
    ],
    fun_facts: [
      'Copper is used in wires because electrons can slide between its atoms with almost zero friction!',
      'A single bolt of lightning contains enough electrical energy to toast 100,000 slices of bread.'
    ],
    hands_on_activity: {
      title: 'Squishy Salt-Dough Conductive Circuit',
      materials: ['Table salt dough (conductor)', 'Sugar dough (insulator)', '9V battery snap', 'Low-voltage LED diode'],
      instructions: [
        'Roll two conductive salt-dough tracks side by side.',
        'Place an insulating sugar-dough barrier between them.',
        'Connect the battery wires to opposite sides and insert the LED legs.',
        'Watch the LED illuminate as electricity flows across the salty dough bridge!'
      ]
    },
    discussion_questions: [
      'Why are power cords wrapped in rubber or plastic coating?',
      'What is the difference between a series circuit and a parallel circuit?'
    ],
    audioScript: 'Sparky was a tiny, high-energy electron resting inside a chemical AA battery cell...',
    quizScore: {
      score: 5,
      total: 5
    }
  },
  {
    id: 'seed-water-100',
    title: 'Pip the Water Droplet Journey to the Clouds',
    topic: 'The Water Cycle & Evaporation',
    age_group: '8-10',
    language: 'English',
    reading_level: 'Grade 3-4 (Intermediate)',
    date: 'Mastery Completed',
    story: `Pip was a happy blue water molecule swimming in the warm ripples of Coral Bay. One sunny morning, the warm rays of the sun heated the bay waters.

"Wheee!" shouted Pip, feeling lighter and lighter as heat energy sped up his molecules. In a flash of evaporation, Pip transformed from liquid into invisible water vapor and floated high up into the cool atmosphere.

High in the sky, the cold air chilled Pip down. Pip linked hands with billions of other vapor droplets, condensing into a fluffy white cumulus cloud. "Condensation party!" Pip laughed.

As the cloud grew dense and heavy, gravity pulled Pip down in a refreshing summer raindrop. He splashed onto a mountain stream, danced past river rocks, and made his way back to Coral Bay, ready to begin the magnificent cycle once again.`,
    vocabulary: [
      { word: 'Evaporation', meaning: 'The phase transition when liquid water turns into invisible gaseous vapor from heat.' },
      { word: 'Condensation', meaning: 'The process where cooled water vapor collects into liquid droplets to form clouds.' },
      { word: 'Precipitation', meaning: 'Moisture falling from clouds to Earth as rain, snow, sleet, or hail.' },
      { word: 'Transpiration', meaning: 'The release of water vapor from the leaves of plants into the atmosphere.' }
    ],
    fun_facts: [
      'The water molecules you drink today are the exact same molecules dinosaurs drank millions of years ago!',
      'Over 97% of Earth water resides in oceans, while less than 1% is accessible fresh drinking water.'
    ],
    hands_on_activity: {
      title: 'Water Cycle in a Sealed Ziploc Bag',
      materials: ['Clear plastic Ziploc bag', 'Permanent marker', 'Water with 2 drops of blue food coloring', 'Tape'],
      instructions: [
        'Draw a sun and clouds near the top of the plastic bag.',
        'Pour 2 ounces of blue water into the bottom and seal the bag tightly.',
        'Tape the bag to a sunlit window.',
        'Watch water evaporate into vapor, condense onto the bag walls, and rain back down!'
      ]
    },
    discussion_questions: [
      'How does the Sun act as the primary engine driving Earth weather systems?',
      'Why doesn the total amount of water on planet Earth change over time?'
    ],
    audioScript: 'Pip was a happy blue water molecule swimming in Coral Bay...',
    quizScore: {
      score: 5,
      total: 5
    }
  }
];
