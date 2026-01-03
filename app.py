from flask import Flask, render_template, request, jsonify
import urllib.parse
import subprocess
import os
import random

app = Flask(__name__)

# --- Trie for autocomplete ---
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_word = False
        self.titles = set()

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, key, title):
        node = self.root
        for ch in key:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
            node.titles.add(title)
        node.is_word = True
        node.titles.add(title)

    def starts_with(self, prefix, limit=8):
        node = self.root
        for ch in prefix:
            if ch not in node.children:
                return []
            node = node.children[ch]
        # return up to `limit` titles from this node.titles
        # sort to keep deterministic order
        out = sorted(node.titles)
        return out[:limit]

TRIE = Trie()

def build_trie_from_mock():
    seen = set()
    for genre, movies in MOCK_MOVIES.items():
        for entry in movies:
            # avoid depending on parse_entry (may be defined later)
            title = entry[0] if len(entry) > 0 else ''
            if not title:
                continue
            key = title.lower()
            if key in seen:
                continue
            seen.add(key)
            TRIE.insert(key, title)

# Mock movie database with language support - English, Hindi, Kannada focus
MOCK_MOVIES = {
    'Sci-Fi': [
        # English
        ('Inception', 8.8, 'English', '148 min'),
        ('The Matrix', 8.7, 'English', '136 min'),
        ('Interstellar', 8.6, 'English', '169 min'),
        ('Blade Runner 2049', 8.0, 'English', '164 min'),
        ('Tenet', 7.3, 'English', '150 min'),
        ('Dune', 8.0, 'English', '155 min'),
        ('Ex Machina', 7.7, 'English'),
        ('Arrival', 7.9, 'English'),
        ('Dark City', 7.7, 'English'),
        ('The Time Machine', 6.8, 'English'),
        ('Avatar', 7.8, 'English', '162 min'),
        ('Minority Report', 7.6, 'English', '145 min'),
        ('Total Recall', 7.5, 'English', '113 min'),
        ('Elysium', 6.6, 'English'),
        ('Oblivion', 7.0, 'English'),
        ('Edge of Tomorrow', 7.9, 'English'),
        ('Gravity', 7.7, 'English'),
        ('Martian', 8.0, 'English'),
        # Hindi
        ('Robot 2.0', 5.8, 'Hindi'),
        ('Padmaavat', 7.5, 'Hindi'),
        ('Shivaay', 6.5, 'Hindi'),
        ('Krrish', 6.9, 'Hindi'),
        ('RA.One', 6.2, 'Hindi'),
        ('PK', 7.7, 'Hindi'),
        ('Chandni', 7.3, 'Hindi'),
        ('अक्षय (Akshay)', 6.8, 'Hindi'),
        ('थोर हिंदी (Thor)', 7.3, 'Hindi'),
        ('स्पेस मिशन (Space Quest)', 6.7, 'Hindi'),
        ('भविष्य (Bhavishya)', 6.5, 'Hindi'),
        ('ग्रह (Graha)', 7.1, 'Hindi'),
        ('मंगल (Mangal)', 7.0, 'Hindi'),
        ('नक्षत्र (Nakshatra)', 6.9, 'Hindi'),
        ('विज्ञान (Vigyan)', 7.2, 'Hindi'),
        # Kannada
        ('Robot', 7.1, 'Kannada'),
        ('ರೋಬೋಟ್ (Robot)', 7.1, 'Kannada'),
        ('ಅಂತರಿಕ್ಷ (Antariksha)', 7.2, 'Kannada'),
        ('ಭವಿಷ್ಯತ (Bhavishyat)', 6.8, 'Kannada'),
        ('ನೋಡಬೇಕು (Nodabeku)', 6.7, 'Kannada'),
        ('ಬಾಹ್ಯ (Baahya)', 7.0, 'Kannada'),
        ('ಚಿಪ್ಪು (Chippu)', 6.6, 'Kannada'),
        ('ಬೆಳಕು (Belaku)', 7.3, 'Kannada'),
        ('ತರಂಗ (Tarang)', 6.9, 'Kannada'),
        ('ಆಕಾಶ (Akasha)', 7.1, 'Kannada'),
        # more recent / extra sci-fi picks
        ('The Batman', 7.9, 'English', '176 min'),
        ('Spider-Man: Across the Spider-Verse', 8.4, 'English', '140 min'),
        ('Everything Everywhere All at Once', 8.1, 'English', '139 min'),
        ('Brahmastra', 5.8, 'Hindi'),
        ('KGF Chapter 1', 8.2, 'Kannada', '156 min'),
        ('Spider-Man: No Way Home', 8.3, 'English'),
        ('Doctor Strange in the Multiverse of Madness', 6.6, 'English'),
        ('The Super Mario Bros. Movie', 6.5, 'English'),
        ('Mission: Impossible - Dead Reckoning', 7.1, 'English'),
        ('Kantara', 8.1, 'Kannada', '153 min'),
    ],
    # Recent / latest Sci-Fi additions
    'Sci-Fi-Latest-Extras': [
        ('Dune: Part Two', 8.2, 'English', '150 min'),
        ('The Creator', 6.5, 'English', '128 min'),
        ('Avatar: The Way of Water', 7.6, 'English', '192 min')
    ],
    'Action': [
        # English
        ('The Dark Knight', 9.0, 'English', '152 min'),
        ('Mad Max Fury Road', 8.1, 'English', '120 min'),
        ('John Wick', 7.4, 'English', '101 min'),
        ('Mission Impossible Fallout', 7.7, 'English'),
        ('Deadpool', 7.6, 'English'),
        ('Captain America Civil War', 7.8, 'English'),
        ('Atomic Blonde', 6.8, 'English'),
        ('The Raid', 7.6, 'English'),
        ('Kill Bill Vol 1', 8.1, 'English'),
        ('Commando', 7.0, 'English'),
        ('Die Hard', 8.3, 'English'),
        ('Speed', 7.3, 'English'),
        ('The Fugitive', 7.6, 'English'),
        ('Terminator 2', 8.5, 'English'),
        ('RoboCop', 7.9, 'English'),
        ('Predator', 7.8, 'English'),
        ('Fast & Furious 7', 7.1, 'English'),
        ('Top Gun Maverick', 8.3, 'English'),
        # Hindi
        ('मर्दानी (Mardani)', 7.5, 'Hindi'),
        ('विरासत (Virasat)', 7.1, 'Hindi'),
        ('धूम (Dhoom)', 7.2, 'Hindi'),
        ('धूम २ (Dhoom 2)', 7.3, 'Hindi'),
        ('खून भरी माटी (Khoon Bhari Mati)', 7.0, 'Hindi'),
        ('बाहुबली (Baahubali)', 8.0, 'Hindi'),
        ('शूटआउट एट वड़ोदरा (Shootout)', 7.2, 'Hindi'),
        ('एक्सन जैकसन (Action Jackson)', 5.8, 'Hindi'),
        ('सिंहासन (Sinhaasan)', 7.0, 'Hindi'),
        ('जय भीम (Jai Bhim)', 8.6, 'Hindi'),
        ('खेल (Khel)', 6.9, 'Hindi'),
        ('युद्ध (Yuddh)', 6.8, 'Hindi'),
        ('शूटआउट एट लोधिपुर (Shootout)', 7.1, 'Hindi'),
        ('बॉम्बे (Bombay)', 7.1, 'Hindi'),
        ('दिल सेज़ (DilSe)', 7.5, 'Hindi'),
        ('तूफान (Toofan)', 7.3, 'Hindi'),
        # Kannada
        ('ಸಿಂಹ (Simha)', 7.3, 'Kannada'),
        ('ರಾಜ (Raj)', 7.0, 'Kannada'),
        ('ವಾರಿಯರ್ (Warrior)', 7.2, 'Kannada'),
        ('ಲೋಹ (Loha)', 6.9, 'Kannada'),
        ('ಶೂಟ್ (Shoot)', 6.8, 'Kannada'),
        ('ಕಾರ್ತೀಕ (Karthik)', 7.1, 'Kannada'),
        ('ವಜ್ರ (Vajra)', 7.0, 'Kannada'),
        ('ಗುಂಡಾ (Gunda)', 6.7, 'Kannada'),
        ('ಭರತಕೆ (Bharate)', 7.3, 'Kannada'),
        ('ವೀರ (Veer)', 7.2, 'Kannada'),
    ],
    # append more action picks into main action list
    'Action-Additional': [
        ('Spider-Man: Far From Home', 7.5, 'English'),
        ('Black Panther: Wakanda Forever', 6.7, 'English'),
        ('The Equalizer 2', 6.6, 'English'),
        ('Drishyam 2', 8.2, 'Malayalam'),
        ('Animal', 7.4, 'Hindi')
    ],
    # more recent action picks
    'Action-Extras-Recent': [
        ('Pathaan', 6.6, 'Hindi'),
        ('Jawan', 7.1, 'Hindi'),
        ('Vikram', 8.4, 'Tamil'),
        ('War', 6.6, 'Hindi'),
        ('The Gray Man', 6.5, 'English')
    ],
    # Recent / latest Action additions
    'Action-Latest-Extras': [
        ('KGF: Chapter 2', 8.2, 'Kannada', '170 min'),
        ('Pushpa: The Rise', 7.2, 'Telugu'),
        ('Extraction', 6.7, 'English'),
        ('Nobody', 7.4, 'English'),
        ('Jailer', 7.0, 'Tamil')
    ],
    'Sports': [
        # English
        ('Rocky', 8.8, 'English', '119 min'),
        ('Raging Bull', 8.2, 'English'),
        ('Million Dollar Baby', 8.1, 'English'),
        ('Field of Dreams', 7.6, 'English'),
        ('Rocky II', 7.3, 'English'),
        ('Hoop Dreams', 7.4, 'English'),
        ('Miracle', 7.5, 'English'),
        ('Creed', 7.6, 'English'),
        ('Remember the Titans', 7.2, 'English'),
        ('Jerry Maguire', 7.3, 'English'),
        ('Rocky Balboa', 7.5, 'English'),
        ('Cinderella Man', 8.0, 'English'),
        ('The Fighter', 8.0, 'English'),
        ('Warrior', 8.2, 'English'),
        ('Southpaw', 7.4, 'English'),
        ('Rocky III', 7.2, 'English'),
        ('Invictus', 7.3, 'English'),
        ('Draft Day', 6.7, 'English'),
        # Hindi
        ('दंगल (Dangal)', 8.4, 'Hindi'),
        ('सलाम (Salam)', 7.3, 'Hindi'),
        ('छुपा रुस्तम (Chhupa Rustam)', 6.9, 'Hindi'),
        ('शूटआउट एट वड़ोदरा (Shootout)', 7.2, 'Hindi'),
        ('गदर (Gadar)', 7.5, 'Hindi'),
        ('खेल (Khel)', 6.9, 'Hindi'),
        ('जॉन डे (John Day)', 6.8, 'Hindi'),
        ('चल भैया चल (Chal Bhaiya)', 6.6, 'Hindi'),
        ('स्पिरिट (Spirit)', 7.1, 'Hindi'),
        ('शक्ति (Shakti)', 7.0, 'Hindi'),
        ('विजय (Vijay)', 7.4, 'Hindi'),
        ('शैंपियन (Champion)', 7.5, 'Hindi'),
        ('पहलवान (Pahalwan)', 6.8, 'Hindi'),
        ('विरासत (Virasat)', 7.3, 'Hindi'),
        ('भारत (Bharat)', 7.2, 'Hindi'),
        # Kannada
        ('ಚಾಂಪಿಯನ್ (Champion)', 7.2, 'Kannada'),
        ('ವಿಜಯ (Vijay)', 7.1, 'Kannada'),
        ('ಖೇಳಾರ (Khel)', 7.0, 'Kannada'),
        ('ಶಕ್ತಿ (Shakti)', 6.9, 'Kannada'),
        ('ಭರತ (Bharat)', 7.3, 'Kannada'),
        ('ರಾಜ (Raj)', 6.8, 'Kannada'),
        ('ಪರಿಶ್ರಮ (Parishram)', 7.2, 'Kannada'),
        ('ಗೋಲ್ಡ್ (Gold)', 7.0, 'Kannada'),
        ('ಗಲ್ಲಂಟ (Gallant)', 6.7, 'Kannada'),
    ],
    # more recent sports picks
    'Sports-Extras-Recent': [
        ('The Last Duel', 7.1, 'English'),
        ('The Boys in the Boat', 7.6, 'English')
    ],
    # Recent / latest Sports additions
    'Sports-Latest-Extras': [
        ('King Richard', 7.5, 'English'),
        ('83', 7.8, 'Hindi')
    ],
    # more sports entries
    'Sports-Additional': [
        ('Remember the Titans', 7.2, 'English'),
        ('Facing the Giants', 6.0, 'English')
    ],
    'Drama': [
        # English
        ('The Shawshank Redemption', 9.3, 'English'),
        ('The Godfather', 9.2, 'English'),
        ('Pulp Fiction', 8.9, 'English'),
        ('Forrest Gump', 8.8, 'English'),
        ('The Dark Knight', 9.0, 'English'),
        ('12 Angry Men', 9.0, 'English'),
        ('Schindler\'s List', 8.9, 'English'),
        ('The Pursuit of Happyness', 8.0, 'English'),
        ('Slumdog Millionaire', 8.0, 'English'),
        ('The Pianist', 8.5, 'English'),
        ('Requiem for a Dream', 8.4, 'English'),
        ('Saving Private Ryan', 8.6, 'English'),
        ('Parasite', 8.5, 'English'),
        ('Oldboy', 8.4, 'English'),
        ('In the Mood for Love', 8.1, 'English'),
        ('Seven Samurai', 8.6, 'English'),
        ('City of God', 8.8, 'English'),
        ('Amélie', 8.3, 'English'),
        # Hindi
        ('दिलवाले दुल्हनिया ले जाएंगे (DDLJ)', 8.0, 'Hindi'),
        ('3 Idiots', 8.4, 'Hindi'),
        ('अंगूर (Angoor)', 7.6, 'Hindi'),
        ('चित्रलेखा (Chitralekha)', 7.2, 'Hindi'),
        ('गांधी (Gandhi)', 8.0, 'Hindi'),
        ('अरुण (Arun)', 7.3, 'Hindi'),
        ('तारे ज़मीन पर (Taare Zameen Par)', 8.4, 'Hindi'),
        ('बायस्कोप (Bioscope)', 7.5, 'Hindi'),
        ('रंग डे बसंती (Rang De Basanti)', 8.0, 'Hindi'),
        ('मुन्ना (Munna)', 7.4, 'Hindi'),
        ('पिंक (Pink)', 7.2, 'Hindi'),
        ('दिल धड़कने दो (Dil Dhadakne Do)', 7.0, 'Hindi'),
        ('नटराज (Natraj)', 7.1, 'Hindi'),
        ('आशा (Asha)', 7.3, 'Hindi'),
        ('प्यार (Pyar)', 7.5, 'Hindi'),
        ('प्रतिशोध (Pratishodh)', 6.9, 'Hindi'),
        # Kannada
        ('Jai Bhim', 8.6, 'Kannada'),
        ('ನಾಟಕ (Nataka)', 7.5, 'Kannada'),
        ('ನಾಥ (Natha)', 7.3, 'Kannada'),
        ('ತುಳು (Tulu)', 7.1, 'Kannada'),
        ('ಭರತ (Bharat)', 7.4, 'Kannada'),
        ('ಪ್ರೇಮ (Prem)', 7.2, 'Kannada'),
        ('ಸುಖ (Sukha)', 7.0, 'Kannada'),
        ('ದುಃಖ (Dukh)', 6.9, 'Kannada'),
        ('ಜೀವನ (Jeevana)', 7.3, 'Kannada'),
        ('ಅಭಿನಯ (Abhinaya)', 7.1, 'Kannada'),
    ],
    # more recent drama picks
    'Drama-Extras-Recent': [
        ('Killers of the Flower Moon', 7.9, 'English'),
        ('Glass Onion', 7.0, 'English'),
        ('Jhund', 7.3, 'Hindi')
    ],
    # Recent / latest Drama additions
    'Drama-Latest-Extras': [
        ('Oppenheimer', 8.5, 'English'),
        ('RRR', 8.0, 'Telugu'),
        ('The Fabelmans', 7.4, 'English')
    ],
    'Drama-Additional': [
        ('The Whale', 7.3, 'English'),
        ('The Irishman', 7.8, 'English'),
        ('Drishyam', 8.2, 'Malayalam')
    ],
    'Comedy': [
        # English
        ('The Grand Budapest Hotel', 8.1, 'English'),
        ('Superbad', 7.6, 'English'),
        ('Tropic Thunder', 7.0, 'English'),
        ('Zombieland', 7.6, 'English'),
        ('Step Brothers', 6.9, 'English'),
        ('The Hangover', 7.7, 'English'),
        ('Mrs. Doubtfire', 7.0, 'English'),
        ('Bridesmaids', 7.5, 'English'),
        ('Anchorman', 7.2, 'English'),
        ('Elf', 7.3, 'English'),
        ('Ghostbusters', 7.8, 'English'),
        ('Singin\' in the Rain', 8.3, 'English'),
        ('Some Like It Hot', 8.2, 'English'),
        ('Breakfast at Tiffany\'s', 7.8, 'English'),
        ('It Happened One Night', 8.1, 'English'),
        ('Roman Holiday', 8.0, 'English'),
        ('Gentlemen Prefer Blondes', 7.4, 'English'),
        ('Funny Girl', 7.6, 'English'),
        # Hindi
        ('पडोसन (Padosan)', 7.9, 'Hindi'),
        ('हेरा फेरी (Hera Pheri)', 7.4, 'Hindi'),
        ('नया दौर (Naya Daur)', 7.5, 'Hindi'),
        ('अंटीपोडि (Antipodi)', 7.1, 'Hindi'),
        ('शर्तिया (Shartiya)', 6.8, 'Hindi'),
        ('राज (Raj)', 7.3, 'Hindi'),
        ('गोलमाल (Golmaal)', 7.2, 'Hindi'),
        ('ढाबा (Dhaba)', 7.0, 'Hindi'),
        ('अजब दास्तान (Ajab Dastan)', 7.1, 'Hindi'),
        ('मज़हब नहीं सिखाता (Mazhab)', 7.2, 'Hindi'),
        ('राजा (Raja)', 6.9, 'Hindi'),
        ('खट्टा (Khatta)', 7.0, 'Hindi'),
        ('मजा (Maza)', 6.8, 'Hindi'),
        ('जोकर्स (Jokers)', 6.7, 'Hindi'),
        ('हास्य (Hasya)', 7.1, 'Hindi'),
        # Kannada
        ('ಕಾಮಿಕ್ ಫ್ಲಿಪ್ (Comic Flip)', 6.9, 'Kannada'),
        ('ಹಾಸ್ಯ (Hasya)', 7.1, 'Kannada'),
        ('ನಗೆ (Nage)', 6.8, 'Kannada'),
        ('ಸಿರಿ (Siri)', 7.0, 'Kannada'),
        ('ಮಾತೃ (Matri)', 6.9, 'Kannada'),
        ('ಕೋಮಾ (Koma)', 6.7, 'Kannada'),
        ('ಸೆಳೆತ (Seletha)', 7.2, 'Kannada'),
        ('ಗೆಳೆತ (Geletha)', 6.9, 'Kannada'),
        ('ಆನಂದ (Ananda)', 7.3, 'Kannada'),
        ('ಸುಖ (Sukha)', 7.0, 'Kannada'),
    ],
    # more recent comedy picks
    'Comedy-Extras-Recent': [
        ('Goodbye', 6.0, 'Hindi'),
        ('Liger', 5.2, 'Telugu')
    ],
    # Recent / latest Comedy additions
    'Comedy-Latest-Extras': [
        ('Barbie', 7.0, 'English'),
        ('Jawan', 7.1, 'Hindi')
    ],
    'Comedy-Additional': [
        ('Bhediya', 6.6, 'Hindi'),
        ('Jungle Cry', 6.0, 'English')
    ],
    'Horror': [
        # English
        ('The Shining', 8.4, 'English'),
        ('Hereditary', 7.6, 'English'),
        ('Get Out', 7.7, 'English'),
        ('A Quiet Place', 7.5, 'English'),
        ('The Ring', 7.1, 'English'),
        ('Insidious', 6.8, 'English'),
        ('The Conjuring', 7.5, 'English'),
        ('It Follows', 6.8, 'English'),
        ('The Exorcist', 8.1, 'English'),
        ('The Omen', 7.5, 'English'),
        ('Poltergeist', 7.4, 'English'),
        ('The Babadook', 6.8, 'English'),
        ('Sinister', 7.0, 'English'),
        ('Insidious 2', 6.6, 'English'),
        ('The Woman in Black', 6.9, 'English'),
        ('Drag Me to Hell', 6.6, 'English'),
        ('Evil Dead', 6.6, 'English'),
        ('Jaws', 8.0, 'English'),
        # Hindi
        ('भूतनाथ (Bhoothnath)', 7.1, 'Hindi'),
        ('प्रेत (Pret)', 6.7, 'Hindi'),
        ('नरक (Narak)', 6.5, 'Hindi'),
        ('भूल (Bhool)', 6.4, 'Hindi'),
        ('डर (Dar)', 7.2, 'Hindi'),
        ('डरावना (Daravna)', 6.6, 'Hindi'),
        ('भय (Bhay)', 6.8, 'Hindi'),
        ('भीषण (Bhishan)', 6.5, 'Hindi'),
        ('आतंक (Aatank)', 6.9, 'Hindi'),
        ('रहस्य (Rahasya)', 7.0, 'Hindi'),
        ('खतरा (Khatara)', 6.7, 'Hindi'),
        ('भयावह (Bhayavah)', 6.6, 'Hindi'),
        ('डरोह (Daroh)', 6.5, 'Hindi'),
        ('भयभीत (Bhayabhit)', 6.4, 'Hindi'),
        # Kannada
        ('ಭೂತ (Bhuta)', 6.8, 'Kannada'),
        ('ಭಯ (Bhaya)', 6.7, 'Kannada'),
        ('ಪ್ರೇತ (Preta)', 6.6, 'Kannada'),
        ('ಸಾಯುವ (Sayuva)', 6.5, 'Kannada'),
        ('ಮರಣ (Marana)', 6.9, 'Kannada'),
        ('ರಕ್ತ (Rakta)', 6.8, 'Kannada'),
        ('ಪಾಪ (Papa)', 6.6, 'Kannada'),
        ('ದೋಷ (Dosha)', 6.7, 'Kannada'),
        ('ಆತ್ಮ (Atma)', 7.0, 'Kannada'),
        ('ಸೋಮನ್ಸ (Somans)', 6.5, 'Kannada'),
    ]
    ,
    # more recent horror picks
    'Horror-Extras-Recent': [
        ('No One Gets Out Alive', 5.4, 'English'),
        ('C U Soon', 6.2, 'Malayalam')
    ]
    ,
    # Recent / latest Horror additions
    'Horror-Latest-Extras': [
        ('Smile', 6.5, 'English'),
        ('Tumbbad', 7.3, 'Hindi')
    ]

    ,
    'Horror-Additional': [
        ('Stree', 7.1, 'Hindi'),
        ('Pari', 6.3, 'Hindi')
    ]
}

# build trie after MOCK_MOVIES is defined
build_trie_from_mock()

def parse_entry(entry):
    """Normalize a movie tuple to (title, score, language, time)
    Entries may be 3-tuples (title, score, language) or 4-tuples with time as fourth element.
    If time is missing, a reasonable default is returned using heuristics or a small title map.
    """
    def get_default_time(title, genre=None):
        # Known title durations (minutes)
        mapping = {
            'inception': '148 min',
            'the matrix': '136 min',
            'interstellar': '169 min',
            'blade runner 2049': '164 min',
            'tenet': '150 min',
            'dune': '155 min',
            'avatar': '162 min',
            'minority report': '145 min',
            'total recall': '113 min',
            'the batman': '176 min',
            'spider-man: across the spider-verse': '140 min',
            'everything everywhere all at once': '139 min',
            'the dark knight': '152 min',
            'mad max fury road': '120 min',
            'john wick': '101 min',
            'the shawshank redemption': '142 min',
            'the godfather': '175 min',
            'pulp fiction': '154 min',
            'forrest gump': '142 min',
            'the matrix': '136 min',
            'rocky': '119 min',
            'the shining': '146 min',
            'get out': '104 min',
            'the ring': '115 min'
        }

        key = title.lower() if title else ''
        if key in mapping:
            return mapping[key]

        # Genre-based heuristics
        if genre:
            g = genre.lower()
            if 'sci' in g or 'sci-fi' in g or 'science' in g:
                return '120 min'
            if 'action' in g:
                return '110 min'
            if 'drama' in g:
                return '125 min'
            if 'comedy' in g:
                return '100 min'
            if 'horror' in g:
                return '95 min'
            if 'sports' in g:
                return '110 min'

        # fallback
        return '100 min'

    title = entry[0] if len(entry) > 0 else ''
    score = entry[1] if len(entry) > 1 else 0.0
    language = entry[2] if len(entry) > 2 else 'Unknown'
    time = entry[3] if len(entry) > 3 and entry[3] else None
    # try to infer genre when possible in calling contexts; default None here
    inferred_time = time or get_default_time(title)
    return title, score, language, inferred_time


def parse_time_to_minutes(s):
    """Parse various time strings into integer minutes.
    Examples: '120', '120 min', '2h', '2h 10m', '2 hrs', '1.5h'
    Heuristics: if a plain number <= 6, treat as hours; otherwise minutes.
    """
    if not s:
        return None
    s = str(s).strip().lower()
    # direct digits
    import re
    # hours with h
    m = re.search(r"(\d+(?:\.\d+)?)\s*h", s)
    if m:
        try:
            hours = float(m.group(1))
            return int(hours * 60)
        except Exception:
            pass
    # hours written as 'hrs' or 'hour'
    m = re.search(r"(\d+(?:\.\d+)?)\s*(hrs|hr|hours|hour)", s)
    if m:
        try:
            hours = float(m.group(1))
            return int(hours * 60)
        except Exception:
            pass
    # minutes
    m = re.search(r"(\d+)\s*min", s)
    if m:
        try:
            return int(m.group(1))
        except Exception:
            pass
    # mixed like '2h 10m'
    m = re.search(r"(\d+)\s*h(?:ou)?r?s?\s*(\d+)\s*m", s)
    if m:
        try:
            return int(m.group(1)) * 60 + int(m.group(2))
        except Exception:
            pass
    # plain number
    m = re.search(r"^(\d+(?:\.\d+)?)$", s)
    if m:
        try:
            val = float(m.group(1))
            if val <= 6:
                return int(val * 60)
            return int(val)
        except Exception:
            pass
    # fallback: extract first number and decide
    m = re.search(r"(\d+)", s)
    if m:
        v = int(m.group(1))
        if v <= 6:
            return int(v * 60)
        return v
    return None

def get_all_languages():
    """Extract all unique languages from movies"""
    languages = set()
    for genre in MOCK_MOVIES.values():
        for movie in genre:
            _, _score, lang, _time = parse_entry(movie)
            languages.add(lang)
    return sorted(list(languages))

def use_mock_recommender(genre, rating, language=None):
    """Returns mock movie recommendations filtered by genre, rating, and optionally language"""
    rating = float(rating)
    
    if genre not in MOCK_MOVIES:
        return []
    
    # Filter movies by rating and language
    filtered = []
    for entry in MOCK_MOVIES[genre]:
        title, score, lang, time = parse_entry(entry)
        if score >= rating:
            # If language is specified and not 'All', filter by language
            if language and language != 'All Languages':
                if lang == language:
                    filtered.append({'title': title, 'score': score, 'language': lang, 'time': time})
            else:
                # If no language filter, include all
                filtered.append({'title': title, 'score': score, 'language': lang, 'time': time})
    
    # Sort by score descending
    filtered.sort(key=lambda x: x['score'], reverse=True)
    
    return filtered

def use_cpp_recommender(genre, rating, language=None):
    """Uses C++ recommender executable"""
    try:
        exe_path = os.path.join(os.path.dirname(__file__), 'cpp', 'recommender.exe')
        
        if not os.path.exists(exe_path):
            return None
        
        process = subprocess.Popen(
            [exe_path],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

        output, error = process.communicate(f"{genre} {rating}", timeout=10)

        if error:
            print(f"Recommender error: {error}")
            return None

        results = []
        for line in output.strip().split('\n'):
            if line.strip():
                try:
                    parts = line.rsplit(" ", 1)
                    if len(parts) == 2:
                        title, score = parts
                        results.append({
                            "title": title.strip(),
                            "score": float(score),
                            "language": "Unknown"
                        })
                except (ValueError, IndexError):
                    continue

        results.sort(key=lambda x: x['score'], reverse=True)
        return results if results else None

    except subprocess.TimeoutExpired:
        process.kill()
        return None
    except Exception as e:
        print(f"C++ Error: {e}")
        return None

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/languages', methods=['GET'])
def get_languages():
    """Return list of available languages"""
    languages = get_all_languages()
    return jsonify({'languages': languages})


@app.route('/search', methods=['POST'])
def search_movie():
    """Search movies by name across all genres"""
    try:
        name = request.form.get('name', '').strip()
        avail = request.form.get('available_time', '').strip()
        # if neither name nor available_time provided, nothing to search
        if not name and not avail:
            return jsonify([])

        # gather all movies into a normalized index
        movie_index = {}  # title_lower -> {title, score, language, genres:set}
        for genre, movies in MOCK_MOVIES.items():
            for entry in movies:
                title, score, language, time = parse_entry(entry)
                key = title.lower()
                if key not in movie_index:
                    movie_index[key] = {'title': title, 'score': score, 'language': language, 'time': time, 'genres': set([genre])}
                else:
                    movie_index[key]['genres'].add(genre)
                    # keep highest score if duplicate
                    if score and score > (movie_index[key].get('score') or 0):
                        movie_index[key]['score'] = score

        # find matches (case-insensitive substring)
        matches = []
        for key, info in movie_index.items():
            if name.lower() in key:
                matches.append({'title': info['title'], 'score': info['score'], 'language': info['language'], 'time': info.get('time'), 'genres': list(info['genres'])})

        # sort matches by score desc
        matches.sort(key=lambda x: x.get('score', 0), reverse=True)

        # if we have at least one match, build similarity graph and BFS from the first match
        suggestions = []
        if matches:
            # build adjacency by shared genre or same language
            titles = list(movie_index.keys())
            adj = {t: set() for t in titles}
            for i, a in enumerate(titles):
                for b in titles[i+1:]:
                    ai = movie_index[a]
                    bi = movie_index[b]
                    # connect if share language or any genre
                    if ai['language'] == bi['language'] or (ai['genres'] & bi['genres']):
                        adj[a].add(b)
                        adj[b].add(a)

            # BFS limited depth to get similar picks
            start = matches[0]['title'].lower()
            visited = set([start])
            queue = [(start, 0)]
            max_depth = 2
            max_suggestions = 8
            while queue and len(suggestions) < max_suggestions:
                node, depth = queue.pop(0)
                if depth >= 1:
                    info = movie_index.get(node)
                    if info and info['title'].lower() != start:
                        suggestions.append({'title': info['title'], 'score': info.get('score'), 'language': info.get('language'), 'time': info.get('time'), 'genres': list(info.get('genres', [])), 'is_suggestion': True, 'suggested_for': movie_index[start]['title']})
                if depth < max_depth:
                    for nb in adj.get(node, []):
                        if nb not in visited:
                            visited.add(nb)
                            queue.append((nb, depth+1))

        # attach poster/helpful fields using same normalization used elsewhere
        images_dir = os.path.join(os.path.dirname(__file__), 'static', 'images')
        available = {}
        def norm_key(s):
            digit_map = {'0':'zero','1':'one','2':'two','3':'three','4':'four','5':'five','6':'six','7':'seven','8':'eight','9':'nine'}
            tmp = ''.join(c if c.isalnum() else '_' for c in s).lower()
            for d, w in digit_map.items():
                tmp = tmp.replace(d, '_' + w + '_')
            while '__' in tmp:
                tmp = tmp.replace('__', '_')
            return tmp.strip('_')

        if os.path.isdir(images_dir):
            for fname in os.listdir(images_dir):
                name, _ext = os.path.splitext(fname)
                key = norm_key(name)
                available[key] = os.path.join('static', 'images', fname).replace('\\', '/')

        def choose_poster(title):
            safe = norm_key(title)
            if safe in available:
                return '/' + available[safe]
            for key, rel in available.items():
                if safe in key or key in safe:
                    return '/' + rel
            # token overlap heuristic
            safe_tokens = set(safe.split('_'))
            best = None
            best_score = 0
            for key, rel in available.items():
                key_tokens = set(key.split('_'))
                score = len(safe_tokens & key_tokens)
                if score > best_score:
                    best_score = score
                    best = rel
            if best_score >= 2:
                return '/' + best
            q = urllib.parse.quote(title)
            return f'https://via.placeholder.com/400x220.png?text={q}'

        # merge results: return first matched items (as-is) then suggestions
        out = []
        # include matches preserving original fields
        for m in matches:
            item = {'title': m['title'], 'score': m.get('score'), 'language': m.get('language'), 'time': m.get('time'), 'genre': (m.get('genres') or [None])[0]}
            item['poster'] = choose_poster(item['title'])
            out.append(item)

        # append suggestions (dedupe)
        seen_titles = set([i['title'].lower() for i in out])
        for s in suggestions:
            if s['title'].lower() in seen_titles:
                continue
            item = {'title': s['title'], 'score': s.get('score'), 'language': s.get('language'), 'time': s.get('time'), 'genre': (s.get('genres') or [None])[0], 'is_suggestion': True, 'suggested_for': s.get('suggested_for')}
            item['poster'] = choose_poster(item['title'])
            out.append(item)

        # if user provided available_time, run knapsack to pick best-rated set fitting within time
        if avail:
            cap = parse_time_to_minutes(avail)
            if cap and cap > 0:
                # prepare items for knapsack from 'out'
                items = []
                for idx, it in enumerate(out):
                    dur = parse_time_to_minutes(it.get('time') or '')
                    # if we couldn't parse duration, skip item for packing
                    if not dur or dur <= 0:
                        continue
                    # value: score * 10 -> integer
                    val = int((it.get('score') or 0) * 10)
                    items.append({'idx': idx, 'weight': dur, 'value': val})

                n = len(items)
                if n > 0:
                    # DP table
                    dp = [[0] * (cap + 1) for _ in range(n + 1)]
                    for i in range(1, n + 1):
                        wi = items[i - 1]['weight']
                        vi = items[i - 1]['value']
                        for w in range(cap + 1):
                            if wi <= w:
                                dp[i][w] = max(dp[i - 1][w], dp[i - 1][w - wi] + vi)
                            else:
                                dp[i][w] = dp[i - 1][w]

                    # reconstruct picks
                    w = cap
                    picks = []
                    for i in range(n, 0, -1):
                        if dp[i][w] != dp[i - 1][w]:
                            picks.append(items[i - 1]['idx'])
                            w -= items[i - 1]['weight']

                    # mark picks in output
                    for p in picks:
                        if 0 <= p < len(out):
                            out[p]['time_pick'] = True
                    # attach meta info
                    total_time = sum(parse_time_to_minutes(out[p].get('time') or '') for p in picks)
                    total_score = sum((out[p].get('score') or 0) for p in picks)
                    # provide summary as first element (non-breaking change: keep list format)
                    summary = {'time_request': avail, 'time_capacity_min': cap, 'selected_count': len(picks), 'selected_total_time_min': total_time, 'selected_total_score': total_score}
                    # attach summary as a separate key at the end of list
                    out.append({'_time_summary': summary})

        return jsonify(out)
    except Exception as e:
        print(f"Search error: {e}")
        return jsonify([]), 500


@app.route('/autocomplete', methods=['GET'])
def autocomplete():
    try:
        q = request.args.get('q', '').strip().lower()
        if not q:
            return jsonify([])
        # use trie for prefix suggestions
        suggestions = TRIE.starts_with(q, limit=12)
        return jsonify(suggestions)
    except Exception as e:
        print(f"Autocomplete error: {e}")
        return jsonify([]), 500


@app.route('/featured', methods=['GET'])
def featured():
    """Return a small curated set of featured movies across languages"""
    try:
        top_by_lang = {}
        for genre, movies in MOCK_MOVIES.items():
            for entry in movies:
                title, score, language, time = parse_entry(entry)
                if language not in top_by_lang or score > top_by_lang[language]['score']:
                    top_by_lang[language] = {'title': title, 'score': score, 'language': language, 'genre': genre, 'time': time}

        # Pick top entries across languages, sorted by score
        featured_list = sorted(top_by_lang.values(), key=lambda x: x['score'], reverse=True)

        # Curated additional picks (ensure these appear on homepage)
        curated_titles = [
            'Oppenheimer', 'RRR', 'Kantara', 'Spider-Man: No Way Home', 'Jawan',
            'Barbie', 'KGF: Chapter 2', 'Dune: Part Two', 'Jai Bhim', '83',
            'Brahmastra', 'Drishyam 2', 'Everything Everywhere All at Once'
        ]

        # Helper: find movie by title in MOCK_MOVIES
        curated = []
        seen = set([m['title'] for m in featured_list])
        for ct in curated_titles:
            if ct in seen:
                continue
            found = False
            for genre, movies in MOCK_MOVIES.items():
                for entry in movies:
                    title, score, language, time = parse_entry(entry)
                    if title and title.lower() == ct.lower():
                        curated.append({'title': title, 'score': score, 'language': language, 'genre': genre, 'time': time})
                        seen.add(title)
                        found = True
                        break
                if found:
                    break

        # Combine curated (first) then top_by_lang picks, remove duplicates, limit to 12
        combined = curated + [m for m in featured_list if m['title'] not in seen]
        # Final dedupe preserving order
        final = []
        final_seen = set()
        for m in combined:
            if m['title'] in final_seen:
                continue
            final.append(m)
            final_seen.add(m['title'])

        # Attach a poster URL: scan local `static/images/` and try to fuzzy-match filenames
        images_dir = os.path.join(os.path.dirname(__file__), 'static', 'images')
        available = {}
        def norm_key(s):
            # sanitize, replace non-alnum with underscore, collapse underscores, map digits to words
            digit_map = {'0':'zero','1':'one','2':'two','3':'three','4':'four','5':'five','6':'six','7':'seven','8':'eight','9':'nine'}
            tmp = ''.join(c if c.isalnum() else '_' for c in s).lower()
            # replace digits with words
            for d, w in digit_map.items():
                tmp = tmp.replace(d, '_' + w + '_')
            # collapse multiple underscores
            while '__' in tmp:
                tmp = tmp.replace('__', '_')
            return tmp.strip('_')

        if os.path.isdir(images_dir):
            for fname in os.listdir(images_dir):
                name, _ext = os.path.splitext(fname)
                key = norm_key(name)
                available[key] = os.path.join('static', 'images', fname).replace('\\', '/')

        for item in final:
            title = item.get('title', '')
            safe = norm_key(title)
            poster = None

            # direct key
            if safe in available:
                poster = '/' + available[safe]
            else:
                # try fuzzy matches: substring or token overlap
                for key, rel in available.items():
                    if safe in key or key in safe:
                        poster = '/' + rel
                        break
                if not poster:
                    # token overlap heuristic
                    safe_tokens = set(safe.split('_'))
                    best = None
                    best_score = 0
                    for key, rel in available.items():
                        key_tokens = set(key.split('_'))
                        score = len(safe_tokens & key_tokens)
                        if score > best_score:
                            best_score = score
                            best = rel
                    if best_score >= 2:
                        poster = '/' + best

            if poster:
                item['poster'] = poster
            else:
                q = urllib.parse.quote(title)
                item['poster'] = f'https://via.placeholder.com/400x220.png?text={q}'

        return jsonify(final[:12])
    except Exception as e:
        print(f"Featured error: {e}")
        return jsonify([]), 500

@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        genre = request.form.get('genre', '')
        rating = request.form.get('rating', '0')
        language = request.form.get('language', 'All Languages')
        
        if not genre:
            return jsonify({'error': 'Genre is required'}), 400

        # Try C++ first, fall back to mock
        print(f"Getting recommendations for: {genre}, rating: {rating}, language: {language}")
        
        results = use_cpp_recommender(genre, rating, language)
        
        # If C++ fails, use mock recommender
        if results is None:
            print("C++ recommender failed, using mock data")
            results = use_mock_recommender(genre, rating, language)
        
        # Ensure each result includes genre (use requested genre when missing)
        for r in results:
            if 'genre' not in r:
                r['genre'] = genre

        if not results:
            return jsonify({'error': f'No movies found for {genre} (rating >= {rating}, language: {language})'}), 404
        
        return jsonify(results)

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/update_movie', methods=['POST'])
def update_movie():
    """Update an existing movie in MOCK_MOVIES. Matches by original title (case-insensitive) and updates fields.

    Accepts form fields: original_title (required), title, genre, rating, language, optional file: poster
    """
    try:
        original = request.form.get('original_title', '').strip()
        new_title = request.form.get('title', '').strip()
        new_genre = request.form.get('genre', '').strip()
        rating = request.form.get('rating', '0')
        language = request.form.get('language', 'Unknown').strip()
        time_val = request.form.get('time', '').strip()
        poster_file = request.files.get('poster')

        if not original:
            return jsonify({'error': 'original_title is required'}), 400

        try:
            score = float(rating)
        except ValueError:
            score = 0.0

        # find movie by title (first match)
        found = False
        found_genre = None
        found_index = None
        for genre, movies in MOCK_MOVIES.items():
            for idx, entry in enumerate(movies):
                title = entry[0]
                if title and title.lower() == original.lower():
                    found = True
                    found_genre = genre
                    found_index = idx
                    break
            if found:
                break

        if not found:
            return jsonify({'error': f'Movie "{original}" not found'}), 404

        # remove original entry
        try:
            MOCK_MOVIES[found_genre].pop(found_index)
        except Exception:
            pass

        # insert into new_genre list
        if new_genre not in MOCK_MOVIES:
            MOCK_MOVIES[new_genre] = []
        # store time as fourth element (may be empty string)
        MOCK_MOVIES[new_genre].append((new_title, score, language, time_val))

        # handle poster upload
        poster = None
        if poster_file and poster_file.filename:
            try:
                images_dir = os.path.join(os.path.dirname(__file__), 'static', 'images')
                os.makedirs(images_dir, exist_ok=True)

                digit_map = {'0':'zero','1':'one','2':'two','3':'three','4':'four','5':'five','6':'six','7':'seven','8':'eight','9':'nine'}
                tmp = ''.join(c if c.isalnum() else '_' for c in new_title).lower()
                for d,w in digit_map.items():
                    tmp = tmp.replace(d, '_' + w + '_')
                while '__' in tmp:
                    tmp = tmp.replace('__', '_')
                safe_title = tmp.strip('_')

                _, ext = os.path.splitext(poster_file.filename)
                if not ext:
                    ext = '.jpg'
                safe_filename = safe_title + ext.lower()
                filepath = os.path.join(images_dir, safe_filename)
                poster_file.save(filepath)
                poster = f'/static/images/{safe_filename}'
            except Exception as file_err:
                print(f"File upload error: {file_err}")
                poster = None

        if not poster:
            q = urllib.parse.quote(new_title)
            poster = f'https://via.placeholder.com/400x220.png?text={q}'

        return jsonify({'title': new_title, 'score': score, 'language': language, 'time': time_val or None, 'genre': new_genre, 'poster': poster}), 200

    except Exception as e:
        print(f"Update movie error: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/add_movie', methods=['POST'])
def add_movie():
    """Add a movie to the in-memory MOCK_MOVIES store (no persistence).

    Expects form fields: title, genre, rating, language, and optional file: poster
    Returns the created movie object with a poster URL.
    """
    try:
        title = request.form.get('title', '').strip()
        genre = request.form.get('genre', '').strip()
        rating = request.form.get('rating', '0')
        language = request.form.get('language', 'Unknown').strip()
        time_val = request.form.get('time', '').strip()
        poster_file = request.files.get('poster')

        if not title or not genre:
            return jsonify({'error': 'title and genre are required'}), 400

        try:
            score = float(rating)
        except ValueError:
            score = 0.0

        # create genre key if missing
        if genre not in MOCK_MOVIES:
            MOCK_MOVIES[genre] = []

        # append to in-memory DB (include time as optional 4th element)
        MOCK_MOVIES[genre].append((title, score, language, time_val))

        # handle poster file upload
        poster = None
        if poster_file and poster_file.filename:
            try:
                images_dir = os.path.join(os.path.dirname(__file__), 'static', 'images')
                os.makedirs(images_dir, exist_ok=True)
                
                # sanitize filename using norm_key
                def norm_key(s):
                    digit_map = {'0':'zero','1':'one','2':'two','3':'three','4':'four','5':'five','6':'six','7':'seven','8':'eight','9':'nine'}
                    tmp = ''.join(c if c.isalnum() else '_' for c in s).lower()
                    for d, w in digit_map.items():
                        tmp = tmp.replace(d, '_' + w + '_')
                    while '__' in tmp:
                        tmp = tmp.replace('__', '_')
                    return tmp.strip('_')
                
                safe_title = norm_key(title)
                # preserve extension
                _, ext = os.path.splitext(poster_file.filename)
                if not ext:
                    ext = '.jpg'
                safe_filename = safe_title + ext.lower()
                filepath = os.path.join(images_dir, safe_filename)
                poster_file.save(filepath)
                poster = f'/static/images/{safe_filename}'
            except Exception as file_err:
                print(f"File upload error: {file_err}")
                # fallback to placeholder
                q = urllib.parse.quote(title)
                poster = f'https://via.placeholder.com/400x220.png?text={q}'
        else:
            # no file, use placeholder
            q = urllib.parse.quote(title)
            poster = f'https://via.placeholder.com/400x220.png?text={q}'

        return jsonify({'title': title, 'score': score, 'language': language, 'time': time_val or None, 'genre': genre, 'poster': poster}), 201

    except Exception as e:
        print(f"Add movie error: {e}")
        return jsonify({'error': str(e)}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({'error': 'Server error'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
