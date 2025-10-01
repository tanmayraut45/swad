import type { Language } from '@/context/language-context';

type LocalizedString = {
  [key in Language]: string;
};

export const navLinks = [
  { href: '#about', label: { en: 'About Us', mr: 'आमच्याबद्दल' } },
  { href: '#gallery', label: { en: 'Gallery', mr: 'गॅलरी' } },
  { href: '#menu', label: { en: 'Menu', mr: 'मेनू' } },
  { href: '#location', label: { en: 'Location', mr: 'स्थान' } },
  { href: '#contact', label: { en: 'Contact', mr: 'संपर्क' } },
];

export const aboutContent = {
    title: { en: 'Our Story', mr: 'आमची कहाणी' },
    paragraph1: { en: "Swad Family Restaurant was born 7 years ago from a shared love for traditional flavors and heartfelt hospitality. Our journey began with a simple idea: to create a place where guests could experience authentic Indian cuisine, comfort, and warm smiles. Since 2018, we have been dedicated to bringing people together over a meal that feels like home.", mr: 'स्वाद फॅमिली रेस्टॉरंटचा जन्म ७ वर्षांपूर्वी पारंपरिक चवी आणि मनःपूर्वक आदरातिथ्याच्या समान प्रेमातून झाला. आमचा प्रवास एका साध्या कल्पनेने सुरू झाला: एक अशी जागा तयार करणे जिथे पाहुणे अस्सल भारतीय खाद्यपदार्थ, आराम आणि उबदार हास्याचा अनुभव घेऊ शकतील. 2018 पासून, आम्ही लोकांना घरच्या जेवणासारखे वाटणाऱ्या जेवणासाठी एकत्र आणण्यासाठी समर्पित आहोत.' },
};

export const menuCategories = [
    { id: 'hot-drinks', name: { en: 'Hot Drinks', mr: 'गरम पेय' } },
    { id: 'cold-beverages', name: { en: 'Cold Beverages', mr: 'थंड पेय' } },
    { id: 'special-dish', name: { en: 'Special Dish', mr: 'विशेष पदार्थ' } },
    { id: 'maharashtrian', name: { en: 'Maharashtrian', mr: 'महाराष्ट्रीयन' } },
    { id: 'fast-items', name: { en: 'Fast Items', mr: 'उपवासाचे पदार्थ' } },
];

export interface MenuItem {
    id: string;
    name: LocalizedString;
    description: LocalizedString;
    price: number;
    category: string;
}

export const menuItems: MenuItem[] = [
    // Hot Drinks
    { id: 'ss-tea', name: { en: 'S.S. Tea', mr: 'स्वा.स्पे. चहा' }, description: { en: 'A special blend of strong spiced tea.', mr: 'मजबूत मसालेदार चहाचा एक विशेष मिश्रण.' }, price: 15, category: 'hot-drinks' },
    { id: 'coffee', name: { en: 'Coffee', mr: 'कॉफी' }, description: { en: 'Freshly brewed aromatic coffee.', mr: 'ताजी, सुगंधी कॉफी.' }, price: 15, category: 'hot-drinks' },
    { id: 'milk', name: { en: 'Milk', mr: 'दूध' }, description: { en: 'A warm glass of fresh milk.', mr: 'ताज्या दुधाचा एक गरम ग्लास.' }, price: 10, category: 'hot-drinks' },
    { id: 'boost', name: { en: 'Boost', mr: 'बुस्ट' }, description: { en: 'A malted chocolate drink for energy.', mr: 'ऊर्जेसाठी एक माल्टेड चॉकलेट पेय.' }, price: 15, category: 'hot-drinks' },
    { id: 'black-tea', name: { en: 'Sugar Free/Black Tea', mr: 'शुगर फ्री/ब्लॅक टी' }, description: { en: 'A simple, refreshing cup of black tea.', mr: 'एक साधा, ताजेतवाना काळा चहा.' }, price: 15, category: 'hot-drinks' },

    // Cold Beverages
    { id: 'butter-milk', name: { en: 'Butter Milk', mr: 'बटर मिल्क' }, description: { en: 'Cool and refreshing spiced buttermilk.', mr: 'थंड आणि ताजेतवाने करणारे मसालेदार ताक.' }, price: 20, category: 'cold-beverages' },
    { id: 'special-lassi', name: { en: 'Spe. Lassi', mr: 'स्पे. लस्सी' }, description: { en: 'A thick, creamy yogurt-based drink.', mr: 'एक घट्ट, मलईदार दह्यापासून बनवलेले पेय.' }, price: 50, category: 'cold-beverages' },
    { id: 'mix-raita', name: { en: 'Mix Raita', mr: 'मिक्स रायता' }, description: { en: 'Yogurt with mixed vegetables and spices.', mr: 'मिक्स भाज्या आणि मसाल्यांसह दही.' }, price: 40, category: 'cold-beverages' },

    // Special Dish
    { id: 'pav-bhaji', name: { en: 'Amul Butter Pav Bhaji', mr: 'अमूल बटर पावभाजी' }, description: { en: 'A flavorful mash of mixed vegetables served with buttery pav.', mr: 'मिक्स भाज्यांची चवदार भाजी बटर लावलेल्या पावासोबत दिली जाते.' }, price: 60, category: 'special-dish' },

    // Maharashtrian
    { id: 'dahi-poha', name: { en: 'Dahi poha', mr: 'दही पोहे' }, description: { en: 'Flattened rice soaked in yogurt, a light and tangy dish.', mr: 'दह्यात भिजवलेले पोहे, एक हलका आणि आंबट पदार्थ.' }, price: 30, category: 'maharashtrian' },
    { id: 'misal', name: { en: 'Misal', mr: 'मिसळ' }, description: { en: 'A spicy curry of sprouted lentils topped with farsan.', mr: 'मोड आलेल्या मटकीची मसालेदार आमटी, फरसाण टाकून.' }, price: 40, category: 'maharashtrian' },
    { id: 'special-misal-pav', name: { en: 'Spe. Misal Pav', mr: 'स्पे. मिसळ पाव' }, description: { en: 'Our signature misal served with soft pav.', mr: 'आमची खास मिसळ मऊ पावासोबत दिली जाते.' }, price: 50, category: 'maharashtrian' },
    { id: 'matki-fri', name: { en: 'Matki fri', mr: 'मटकी फ्राय' }, description: { en: 'Stir-fried sprouted moth beans with spices.', mr: 'मसाल्यांबरोबर परतलेली मोड आलेली मटकी.' }, price: 40, category: 'maharashtrian' },
    { id: 'khamang-upma', name: { en: 'Khamang Upma', mr: 'खमंग उपमा' }, description: { en: 'Savory semolina porridge, a breakfast classic.', mr: 'रव्याची मसालेदार खिचडी, एक नाश्त्याचा क्लासिक.' }, price: 40, category: 'maharashtrian' },
    { id: 'shira', name: { en: 'Shira', mr: 'शिरा' }, description: { en: 'Sweet semolina pudding with nuts and ghee.', mr: 'सुकामेवा आणि तुपासह गोड रव्याचा हलवा.' }, price: 60, category: 'maharashtrian' },
    { id: 'kanda-pakoda', name: { en: 'Kanda Pakoda', mr: 'कांदा पकोडा' }, description: { en: 'Crispy onion fritters, a perfect tea-time snack.', mr: 'कुरकुरीत कांद्याची भजी, चहाच्या वेळेसाठी उत्तम नाश्ता.' }, price: 50, category: 'maharashtrian' },
    { id: 'chilly-pakoda', name: { en: 'Chily Pakoda', mr: 'चिल्ली पकोडा' }, description: { en: 'Spicy green chilies fried in chickpea flour batter.', mr: 'बेसनाच्या पिठात तळलेली मसालेदार हिरवी मिरची.' }, price: 60, category: 'maharashtrian' },
    { id: 'panner-pakoda', name: { en: 'Panner Pakoda', mr: 'पनिर पकोडा' }, description: { en: 'Soft paneer cubes coated and fried to golden perfection.', mr: 'मऊ पनीरचे तुकडे सोनेरी होईपर्यंत तळलेले.' }, price: 140, category: 'maharashtrian' },
    
    // Fast Items
    { id: 'sabudana-usal', name: { en: 'Sabudana Usal', mr: 'शाबुदाना उसळ' }, description: { en: 'A savory dish of tapioca pearls, peanuts, and spices.', mr: 'साबुदाणा, शेंगदाणे आणि मसाल्यांचा एक चवदार पदार्थ.' }, price: 40, category: 'fast-items' },
    { id: 'sabudana-wada', name: { en: 'Sabudana Wada', mr: 'शाबुदाना वडा' }, description: { en: 'Crispy tapioca pearl and potato fritters.', mr: 'कुरकुरीत साबुदाणा आणि बटाट्याचे वडे.' }, price: 60, category: 'fast-items' },
    { id: 'finger-chips', name: { en: 'Finger Chips', mr: 'फिंगर चिप्स' }, description: { en: 'Classic golden-fried potato finger chips.', mr: 'क्लासिक सोनेरी तळलेले बटाट्याचे फिंगर चिप्स.' }, price: 60, category: 'fast-items' },
];

export const contactInfo = {
    title: { en: 'Visit or Call Us', mr: 'भेट द्या किंवा कॉल करा' },
    addressTitle: { en: 'Our Address', mr: 'आमचा पत्ता' },
    address: { en: '123 Main Road, Hingoli, Maharashtra 431513', mr: '१२३ मुख्य रस्ता, हिंगोली, महाराष्ट्र ४३१५१३' },
    phone: '9421382777',
    whatsapp: '919421382777',
    email: 'rashmin.pachlegaonkar@gmail.com',
    call: { en: 'Call Us', mr: 'कॉल करा' },
    whatsappLabel: { en: 'WhatsApp Us', mr: 'व्हाट्सएप करा' },
};

export const openingHours = {
    title: { en: 'Opening Hours', mr: 'उघडण्याची वेळ' },
    hours: [
        { day: { en: 'Monday - Sunday', mr: 'सोमवार - रविवार' }, time: '09:00 AM - 11:00 PM' },
    ],
};

export const contactFormContent = {
    title: { en: 'Book a Table', mr: 'टेबल बुक करा' },
    name: { en: 'Full Name', mr: 'पूर्ण नाव' },
    namePlaceholder: { en: 'e.g. Anand Deshpande', mr: 'उदा. आनंद देशपांडे' },
    phone: { en: 'Phone Number', mr: 'फोन नंबर' },
    phonePlaceholder: { en: '10-digit mobile number', mr: '१०-अंकी मोबाइल नंबर' },
    date: { en: 'Date', mr: 'तारीख' },
    time: { en: 'Time', mr: 'वेळ' },
    guests: { en: 'Guests', mr: 'पाहुणे' },
    message: { en: 'Message (Optional)', mr: 'संदेश (ऐच्छिक)' },
    messagePlaceholder: { en: 'e.g. Special requests, occasion, etc.', mr: 'उदा. विशेष विनंत्या, प्रसंग, इ.' },
    button: { en: 'Submit Booking', mr: 'बुकिंग सबमिट करा' },
};
