// ─────────────────────────────────────────────────────────────────────────────
// words.js  –  Wordle word management
//
// Strategy:
//   • ANSWER_WORDS  – small curated list of common 5-letter words (daily answers)
//   • isValidGuess() – validates any guess against the Free Dictionary API
//     (https://api.dictionaryapi.dev) so we don't need a massive word list file.
//
// Free Dictionary API: no key required, completely free, good English coverage.
// ─────────────────────────────────────────────────────────────────────────────

// ── Curated answer pool ───────────────────────────────────────────────────────
// These are the only words that will ever be chosen as the daily answer.
// Keep this list to common, recognisable words so players don't get frustrated.
const ANSWER_WORDS = [
    'ABOUT', 'ABOVE', 'ABUSE', 'ADMIT', 'ADOPT', 'ADULT', 'AFTER', 'AGAIN',
    'AGENT', 'AGREE', 'AHEAD', 'ALARM', 'ALBUM', 'ALERT', 'ALIKE', 'ALIVE',
    'ALLOW', 'ALONE', 'ALONG', 'ALTER', 'ANGEL', 'ANGER', 'ANGLE', 'ANGRY',
    'APART', 'APPLE', 'APPLY', 'ARENA', 'ARGUE', 'ARISE', 'ARMED', 'ARMOR',
    'ARROW', 'ASIDE', 'ASSET', 'AVOID', 'AWAKE', 'AWARD', 'AWARE', 'BADLY',
    'BEACH', 'BEARD', 'BEAST', 'BEGIN', 'BEING', 'BELOW', 'BENCH', 'BIRTH',
    'BLACK', 'BLADE', 'BLAME', 'BLANK', 'BLIND', 'BLOCK', 'BLOOD', 'BOARD',
    'BOOST', 'BOUND', 'BRAIN', 'BRAND', 'BRASS', 'BRAVE', 'BREAD', 'BREAK',
    'BREED', 'BRICK', 'BRIDE', 'BRIEF', 'BRING', 'BRINK', 'BRISK', 'BROAD',
    'BROKE', 'BROWN', 'BUILD', 'BUILT', 'CABLE', 'CANDY', 'CARGO', 'CARRY',
    'CARVE', 'CATCH', 'CAUSE', 'CHAIN', 'CHAIR', 'CHALK', 'CHAOS', 'CHARM',
    'CHART', 'CHASE', 'CHEAP', 'CHEAT', 'CHECK', 'CHEEK', 'CHEER', 'CHESS',
    'CHEST', 'CHIEF', 'CHILD', 'CHILL', 'CHOSE', 'CHUNK', 'CHURN', 'CIGAR',
    'CIVIC', 'CIVIL', 'CLAIM', 'CLASH', 'CLASS', 'CLEAN', 'CLEAR', 'CLERK',
    'CLICK', 'CLIFF', 'CLIMB', 'CLOAK', 'CLOCK', 'CLONE', 'CLOSE', 'CLOTH',
    'CLOUD', 'CLOWN', 'COACH', 'COAST', 'COLOR', 'COMET', 'COMIC', 'CORAL',
    'CORNY', 'COUCH', 'COULD', 'COUNT', 'COURT', 'COVER', 'CRAFT', 'CRASH',
    'CRATE', 'CRAVE', 'CRAZY', 'CREAM', 'CREEK', 'CREEP', 'CREST', 'CRIME',
    'CRISP', 'CROSS', 'CROWD', 'CROWN', 'CRUDE', 'CRUEL', 'CRUSH', 'CRUST',
    'CURVE', 'CYCLE', 'DAILY', 'DAIRY', 'DAISY', 'DANCE', 'DATED', 'DEATH',
    'DEBUT', 'DECOR', 'DECOY', 'DEITY', 'DELAY', 'DEMON', 'DENSE', 'DEPTH',
    'DERBY', 'DEVIL', 'DIARY', 'DIGIT', 'DINER', 'DIRTY', 'DISCO', 'DITCH',
    'DIVER', 'DIZZY', 'DODGE', 'DONOR', 'DOUBT', 'DOUGH', 'DOZEN', 'DRAFT',
    'DRAIN', 'DRAMA', 'DRANK', 'DRAPE', 'DREAD', 'DREAM', 'DRESS', 'DRIED',
    'DRIFT', 'DRILL', 'DRINK', 'DRIVE', 'DRONE', 'DROWN', 'DRUGS', 'DRUMS',
    'DRUNK', 'DUSTY', 'DYING', 'EAGER', 'EAGLE', 'EARLY', 'EARTH', 'EATEN',
    'EBONY', 'EERIE', 'EIGHT', 'ELBOW', 'ELDER', 'ELECT', 'ELITE', 'ELOPE',
    'ELUDE', 'EMAIL', 'EMBER', 'EMPTY', 'ENEMY', 'ENJOY', 'ENTER', 'ENTRY',
    'ENVOY', 'EPOCH', 'EQUAL', 'EQUIP', 'ERASE', 'ERECT', 'ERROR', 'ERUPT',
    'ESSAY', 'ETHIC', 'EVADE', 'EVENT', 'EVERY', 'EVICT', 'EVOKE', 'EXACT',
    'EXCEL', 'EXERT', 'EXILE', 'EXIST', 'EXPEL', 'EXTRA', 'FABLE', 'FAITH',
    'FALSE', 'FANCY', 'FARCE', 'FATAL', 'FAULT', 'FAUNA', 'FAVOR', 'FEAST',
    'FELON', 'FEMUR', 'FENCE', 'FERAL', 'FERRY', 'FETCH', 'FEVER', 'FEWER',
    'FIBER', 'FIEND', 'FIERY', 'FIFTH', 'FIFTY', 'FIGHT', 'FILLY', 'FILTH',
    'FINAL', 'FINCH', 'FIRST', 'FISHY', 'FIXED', 'FLAME', 'FLASH', 'FLASK',
    'FLAKY', 'FLESH', 'FLICK', 'FLINT', 'FLIRT', 'FLOAT', 'FLOCK', 'FLOOD',
    'FLOOR', 'FLORA', 'FLOUR', 'FLUID', 'FLUKE', 'FLUSH', 'FLUTE', 'FOCAL',
    'FOCUS', 'FOLLY', 'FORAY', 'FORCE', 'FORGE', 'FORTE', 'FORTH', 'FORTY',
    'FORUM', 'FOUND', 'FRAIL', 'FRAME', 'FRANK', 'FRAUD', 'FREAK', 'FREED',
    'FRESH', 'FRIAR', 'FRIED', 'FRISK', 'FROCK', 'FROND', 'FRONT', 'FROST',
    'FROTH', 'FROWN', 'FROZE', 'FRUIT', 'FULLY', 'FUNGI', 'FUNKY', 'FUNNY',
    'FURRY', 'FUSSY', 'FUZZY', 'GHOST', 'GIANT', 'GIDDY', 'GIVEN', 'GLAND',
    'GLARE', 'GLASS', 'GLAZE', 'GLEAM', 'GLIDE', 'GLINT', 'GLOAT', 'GLOBE',
    'GLOOM', 'GLORY', 'GLOSS', 'GLOVE', 'GNASH', 'GNOME', 'GRACE', 'GRADE',
    'GRAFT', 'GRAIN', 'GRAND', 'GRAPE', 'GRASP', 'GRASS', 'GRATE', 'GRAVE',
    'GRAVY', 'GRAZE', 'GREAT', 'GREED', 'GREEN', 'GREET', 'GRIEF', 'GRILL',
    'GRIME', 'GRIMY', 'GRIND', 'GROAN', 'GROOM', 'GROPE', 'GROSS', 'GROUP',
    'GROUT', 'GROVE', 'GROWL', 'GROWN', 'GUARD', 'GUAVA', 'GUESS', 'GUEST',
    'GUIDE', 'GUILD', 'GUILT', 'HAPPY', 'HARDY', 'HARSH', 'HASTE', 'HASTY',
    'HATED', 'HAUNT', 'HAVEN', 'HAVOC', 'HAZEL', 'HEART', 'HEATH', 'HEAVE',
    'HEAVY', 'HEDGE', 'HEIST', 'HELIX', 'HERDS', 'HIPPO', 'HITCH', 'HOARD',
    'HOARY', 'HOBBY', 'HONEY', 'HONOR', 'HORSE', 'HOTEL', 'HOUND', 'HOUSE',
    'HUMAN', 'HUMID', 'HURRY', 'HYENA', 'IDEAL', 'IMAGE', 'IMPLY', 'INDEX',
    'INDIE', 'INFER', 'INNER', 'INPUT', 'INSET', 'INTER', 'INTRO', 'IONIC',
    'IRONY', 'ISSUE', 'IVORY', 'JAPAN', 'JELLY', 'JEWEL', 'JOINT', 'JOKER',
    'JUDGE', 'JUICE', 'JUICY', 'JUMBO', 'JUMPY', 'KEEPS', 'KNACK', 'KNEEL',
    'KNIFE', 'KNOCK', 'KNOWN', 'LABEL', 'LARGE', 'LASER', 'LATCH', 'LATER',
    'LAUGH', 'LAYER', 'LEARN', 'LEASE', 'LEASH', 'LEAST', 'LEGAL', 'LEMON',
    'LEVEL', 'LIGHT', 'LIMIT', 'LINEN', 'LIVER', 'LOCAL', 'LODGE', 'LOGIC',
    'LOOSE', 'LOVER', 'LOWER', 'LOYAL', 'LUCID', 'LUCKY', 'LUNAR', 'LUNCH',
    'LUSTY', 'LYRIC', 'MAGIC', 'MAJOR', 'MAKER', 'MANOR', 'MAPLE', 'MATCH',
    'MAYOR', 'METAL', 'MINOR', 'MINUS', 'MIRTH', 'MOIST', 'MONEY', 'MONTH',
    'MORAL', 'MOTOR', 'MOTTO', 'MOUNT', 'MOURN', 'MOUSE', 'MOUTH', 'MOVIE',
    'MUDDY', 'MUSIC', 'NAIVE', 'NASTY', 'NAVAL', 'NERVE', 'NEVER', 'NIGHT',
    'NOBLE', 'NOISE', 'NORTH', 'NOTED', 'NOVEL', 'NURSE', 'NYMPH', 'OCCUR',
    'OCEAN', 'OFFER', 'OFTEN', 'OLIVE', 'ONSET', 'OPTIC', 'ORDER', 'OTHER',
    'OUTER', 'OXIDE', 'OZONE', 'PAINT', 'PANEL', 'PANIC', 'PAPER', 'PATCH',
    'PAUSE', 'PEACE', 'PEACH', 'PEARL', 'PENNY', 'PHASE', 'PHONE', 'PHOTO',
    'PIANO', 'PIECE', 'PILOT', 'PINCH', 'PIXEL', 'PIZZA', 'PLACE', 'PLAIN',
    'PLANE', 'PLANT', 'PLATE', 'PLAZA', 'PLEAD', 'PLUCK', 'PLUMB', 'PLUME',
    'PLUNK', 'PLUSH', 'POINT', 'POISE', 'POLAR', 'POUND', 'POWER', 'PRESS',
    'PRICE', 'PRIDE', 'PRIME', 'PRINT', 'PRIOR', 'PRISM', 'PRIZE', 'PROBE',
    'PRONG', 'PROOF', 'PROSE', 'PROUD', 'PROVE', 'PROWL', 'PROXY', 'PSALM',
    'PUDGY', 'PULSE', 'PUNCH', 'PUPIL', 'PURGE', 'PUSHY', 'QUEEN', 'QUERY',
    'QUEST', 'QUEUE', 'QUICK', 'QUIET', 'QUOTA', 'QUOTE', 'RADAR', 'RADIO',
    'RAISE', 'RALLY', 'RANCH', 'RANGE', 'RAPID', 'RAVEN', 'REACH', 'READY',
    'REALM', 'REBEL', 'RELAX', 'REMIT', 'REPAY', 'REPEL', 'RESIN', 'RISKY',
    'RIVAL', 'RIVER', 'ROBIN', 'ROBOT', 'ROCKY', 'ROUGE', 'ROUGH', 'ROUND',
    'ROUTE', 'ROYAL', 'RULER', 'RURAL', 'RUSTY', 'SAINT', 'SAUCE', 'SCALE',
    'SCALD', 'SCALP', 'SCAMP', 'SCANT', 'SCARE', 'SCARF', 'SCENE', 'SCONE',
    'SCOOP', 'SCOPE', 'SCORE', 'SCOUT', 'SCRAM', 'SCRAP', 'SCREW', 'SEIZE',
    'SENSE', 'SERVE', 'SEVEN', 'SHAKE', 'SHALL', 'SHAME', 'SHAPE', 'SHARE',
    'SHARP', 'SHAWL', 'SHEER', 'SHELF', 'SHELL', 'SHIFT', 'SHINE', 'SHIRT',
    'SHOCK', 'SHORE', 'SHORT', 'SHOUT', 'SHOVE', 'SHOWN', 'SIGHT', 'SILLY',
    'SINCE', 'SIXTH', 'SIXTY', 'SKILL', 'SKULL', 'SLATE', 'SLAVE', 'SLEEP',
    'SLEEK', 'SLEET', 'SLICK', 'SLIDE', 'SLIM', 'SLIMY', 'SLING', 'SLOPE',
    'SLUMP', 'SLUNG', 'SLUNK', 'SLURP', 'SMALL', 'SMART', 'SMASH', 'SMEAR',
    'SMELL', 'SMILE', 'SMITE', 'SMOCK', 'SMOKE', 'SNACK', 'SNAIL', 'SNAKE',
    'SNARE', 'SNEAK', 'SNEER', 'SNIFF', 'SNORE', 'SNORT', 'SNOWY', 'SOLAR',
    'SOLID', 'SOLVE', 'SORRY', 'SOUTH', 'SPACE', 'SPARE', 'SPARK', 'SPEAK',
    'SPEAR', 'SPEED', 'SPEND', 'SPICE', 'SPIKY', 'SPINE', 'SPOKE', 'SPOON',
    'SPORT', 'SPOUT', 'SPRAY', 'SQUAD', 'SQUAT', 'SQUID', 'STACK', 'STAFF',
    'STAGE', 'STAIN', 'STAIR', 'STAKE', 'STALE', 'STALL', 'STAMP', 'STAND',
    'STARE', 'START', 'STASH', 'STATE', 'STAYS', 'STEAK', 'STEAL', 'STEAM',
    'STEEL', 'STEEP', 'STEER', 'STERN', 'STICK', 'STIFF', 'STILL', 'STING',
    'STOCK', 'STOIC', 'STOMP', 'STONE', 'STOOD', 'STOOP', 'STORM', 'STORY',
    'STOUT', 'STOVE', 'STRAP', 'STRAW', 'STRAY', 'STREP', 'STRIP', 'STRUM',
    'STRUT', 'STUCK', 'STUDY', 'STUMP', 'STUNG', 'STUNK', 'STUNT', 'STYLE',
    'SUGAR', 'SUITE', 'SUNNY', 'SUPER', 'SURGE', 'SWAMP', 'SWEAR', 'SWEAT',
    'SWEEP', 'SWEET', 'SWEPT', 'SWIFT', 'SWILL', 'SWIPE', 'SWIRL', 'SWORD',
    'SWORE', 'SWORN', 'SWUNG', 'TABLE', 'TALON', 'TASTE', 'TATTY', 'TAUNT',
    'TAWNY', 'TEACH', 'TENSE', 'TENTH', 'TEPID', 'TERMS', 'TERSE', 'THEIR',
    'THEME', 'THERE', 'THESE', 'THICK', 'THING', 'THINK', 'THORN', 'THOSE',
    'THREE', 'THREW', 'THROW', 'THUMB', 'THUMP', 'TIDAL', 'TIGER', 'TIGHT',
    'TIMER', 'TIRED', 'TITAN', 'TITLE', 'TODAY', 'TOKEN', 'TONIC', 'TOOTH',
    'TOPAZ', 'TOPIC', 'TOTAL', 'TOUCH', 'TOUGH', 'TOWEL', 'TOWER', 'TOXIC',
    'TRACE', 'TRACK', 'TRADE', 'TRAIL', 'TRAIN', 'TRAIT', 'TRAMP', 'TRASH',
    'TRAWL', 'TREAT', 'TREMBLE', 'TREND', 'TRIAL', 'TRIBE', 'TRICK', 'TRIED',
    'TROOP', 'TROUT', 'TRUCE', 'TRULY', 'TRUMP', 'TRUNK', 'TRUST', 'TRUTH',
    'TULIP', 'TUMOR', 'TUNER', 'TWEAK', 'TWICE', 'TWIST', 'TYING', 'ULTRA',
    'UNIFY', 'UNION', 'UNITY', 'UNTIL', 'UPPER', 'UPSET', 'URBAN', 'USHER',
    'USURP', 'UTTER', 'VAGUE', 'VALID', 'VALUE', 'VALVE', 'VAPOR', 'VAULT',
    'VAUNT', 'VICAR', 'VIDEO', 'VIGOR', 'VILLA', 'VIOLA', 'VIRAL', 'VIRUS',
    'VISTA', 'VITAL', 'VIVID', 'VOCAL', 'VOICE', 'VOTER', 'VYING', 'WASTE',
    'WATCH', 'WATER', 'WEARY', 'WEDGE', 'WEIRD', 'WHALE', 'WHEAT', 'WHEEL',
    'WHERE', 'WHICH', 'WHILE', 'WHITE', 'WHOLE', 'WHOSE', 'WIDER', 'WITCH',
    'WOMEN', 'WORLD', 'WORRY', 'WORSE', 'WORST', 'WORTH', 'WOULD', 'WOUND',
    'WRATH', 'WRIST', 'WROTE', 'YACHT', 'YEARN', 'YIELD', 'YOUNG', 'YOUTH',
    'ZESTY', 'ZONAL',
];

// ── Pick a random answer ───────────────────────────────────────────────────────
function getRandomWord() {
    return ANSWER_WORDS[Math.floor(Math.random() * ANSWER_WORDS.length)];
}

// ── Validate any guess via Free Dictionary API ─────────────────────────────────
// Returns a Promise<boolean>.
// Call this before accepting a player's guess.
//
// Usage in script.js:
//   const valid = await isValidWord(guess);
//   if (!valid) { showError("Not a valid word!"); return; }
//
async function isValidWord(word) {
    // First, allow any word already in our answer list (instant, no network call)
    if (ANSWER_WORDS.includes(word.toUpperCase())) return true;

    try {
        const response = await fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`
        );
        // API returns 200 with definitions array if word exists, 404 if not
        return response.ok;
    } catch (err) {
        // If the API is unreachable (offline / CORS), fail open so game still works
        console.warn('Dictionary API unreachable, allowing guess:', err);
        return true;
    }
}