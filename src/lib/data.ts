import type { Language } from '@/context/language-context';

type LocalizedString = {
  [key in Language]: string;
};

export const navLinks = [
  { href: '#about', label: { en: 'About Us', mr: 'आमच्याबद्दल' } },
  { href: '#menu', label: { en: 'Menu', mr: 'मेनू' } },
  { href: '#gallery', label: { en: 'Gallery', mr: 'गॅलरी' } },
  { href: '#location', label: { en: 'Location', mr: 'स्थान' } },
  { href: '#contact', label: { en: 'Contact', mr: 'संपर्क' } },
];

export const aboutContent = {
    title: { en: 'Our Story', mr: 'आमची कहाणी' },
    paragraph1: { en: "Nestled in the heart of Maharashtra, Maha Zaika is a family's dream brought to life. Our journey began with a passion for authentic Maharashtrian cuisine, using recipes passed down through generations. We are more than a restaurant; we are custodians of a rich culinary heritage.", mr: 'महाराष्ट्राच्या हृदयात वसलेले, महा झैका हे एका कुटुंबाचे स्वप्न आहे जे सत्यात उतरले आहे. पिढ्यानपिढ्या चालत आलेल्या पाककृतींचा वापर करून, अस्सल महाराष्ट्रीयन पदार्थांच्या आवडीतून आमचा प्रवास सुरू झाला. आम्ही केवळ एक रेस्टॉरंट नाही; आम्ही एका समृद्ध पाककलेच्या वारशाचे संरक्षक आहोत.' },
    paragraph2: { en: "We pride ourselves on using locally-sourced spices and the freshest ingredients to create dishes that tell a story. Each meal is a celebration of flavor, tradition, and the love of food. We welcome you to our table to experience the true taste of Maharashtra.", mr: 'स्थानिक मसाले आणि ताज्या घटकांचा वापर करून कथा सांगणारे पदार्थ तयार करण्यात आम्हाला अभिमान वाटतो. प्रत्येक जेवण म्हणजे चव, परंपरा आणि अन्नावरील प्रेमाचा उत्सव. महाराष्ट्राची खरी चव अनुभवण्यासाठी आम्ही तुमचे आमच्या टेबलवर स्वागत करतो.' },
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
    image: string;
}

export const menuItems: MenuItem[] = [
    // Hot Drinks
    { id: 'ss-tea', name: { en: 'S.S. Tea', mr: 'एस.एस. चहा' }, description: { en: 'A special blend of strong spiced tea.', mr: 'मजबूत मसालेदार चहाचा एक विशेष मिश्रण.' }, price: 15, category: 'hot-drinks', image: 'https://picsum.photos/seed/h1/600/400' },
    { id: 'coffee', name: { en: 'Coffee', mr: 'कॉफी' }, description: { en: 'Freshly brewed aromatic coffee.', mr: 'ताजी, सुगंधी कॉफी.' }, price: 15, category: 'hot-drinks', image: 'https://picsum.photos/seed/h2/600/400' },
    { id: 'milk', name: { en: 'Milk', mr: 'दूध' }, description: { en: 'A warm glass of fresh milk.', mr: 'ताज्या दुधाचा एक गरम ग्लास.' }, price: 15, category: 'hot-drinks', image: 'https://picsum.photos/seed/h3/600/400' },
    { id: 'boost', name: { en: 'Boost', mr: 'बूस्ट' }, description: { en: 'A malted chocolate drink for energy.', mr: 'ऊर्जेसाठी एक माल्टेड चॉकलेट पेय.' }, price: 10, category: 'hot-drinks', image: 'https://picsum.photos/seed/h4/600/400' },
    { id: 'black-tea', name: { en: 'Sugar Free/Black Tea', mr: 'शुगर फ्री/ब्लॅक टी' }, description: { en: 'A simple, refreshing cup of black tea.', mr: 'एक साधा, ताजेतवाना काळा चहा.' }, price: 15, category: 'hot-drinks', image: 'https://picsum.photos/seed/h5/600/400' },

    // Cold Beverages
    { id: 'butter-milk', name: { en: 'Butter Milk', mr: 'ताक' }, description: { en: 'Cool and refreshing spiced buttermilk.', mr: 'थंड आणि ताजेतवाने करणारे मसालेदार ताक.' }, price: 20, category: 'cold-beverages', image: 'https://picsum.photos/seed/c1/600/400' },
    { id: 'special-lassi', name: { en: 'Special Lassi', mr: 'विशेष लस्सी' }, description: { en: 'A thick, creamy yogurt-based drink.', mr: 'एक घट्ट, मलईदार दह्यापासून बनवलेले पेय.' }, price: 50, category: 'cold-beverages', image: 'https://picsum.photos/seed/c2/600/400' },
    { id: 'mix-raita', name: { en: 'Mix Raita', mr: 'मिक्स रायता' }, description: { en: 'Yogurt with mixed vegetables and spices.', mr: 'मिक्स भाज्या आणि मसाल्यांसह दही.' }, price: 40, category: 'cold-beverages', image: 'https://picsum.photos/seed/c3/600/400' },

    // Special Dish
    { id: 'pav-bhaji', name: { en: 'Amul Butter Pav Bhaji', mr: 'अमूल बटर पावभाजी' }, description: { en: 'A flavorful mash of mixed vegetables served with buttery pav.', mr: 'मिक्स भाज्यांची चवदार भाजी बटर लावलेल्या पावासोबत दिली जाते.' }, price: 60, category: 'special-dish', image: 'https://picsum.photos/seed/s1/600/400' },

    // Maharashtrian
    { id: 'dahi-poha', name: { en: 'Dahi Poha', mr: 'दही पोहे' }, description: { en: 'Flattened rice soaked in yogurt, a light and tangy dish.', mr: 'दह्यात भिजवलेले पोहे, एक हलका आणि आंबट पदार्थ.' }, price: 30, category: 'maharashtrian', image: 'https://picsum.photos/seed/m1/600/400' },
    { id: 'misal', name: { en: 'Misal', mr: 'मिसळ' }, description: { en: 'A spicy curry of sprouted lentils topped with farsan.', mr: 'मोड आलेल्या मटकीची मसालेदार आमटी, फरसाण टाकून.' }, price: 50, category: 'maharashtrian', image: 'https://picsum.photos/seed/m2/600/400' },
    { id: 'special-misal-pav', name: { en: 'Special Misal Pav', mr: 'विशेष मिसळ पाव' }, description: { en: 'Our signature misal served with soft pav.', mr: 'आमची खास मिसळ मऊ पावासोबत दिली जाते.' }, price: 55, category: 'maharashtrian', image: 'https://picsum.photos/seed/m3/600/400' },
    { id: 'matki-fry', name: { en: 'Matki Fry', mr: 'मटकी फ्राय' }, description: { en: 'Stir-fried sprouted moth beans with spices.', mr: 'मसाल्यांबरोबर परतलेली मोड आलेली मटकी.' }, price: 50, category: 'maharashtrian', image: 'https://picsum.photos/seed/m4/600/400' },
    { id: 'khamang-upma', name: { en: 'Khamang Upma', mr: 'खामंग उपमा' }, description: { en: 'Savory semolina porridge, a breakfast classic.', mr: 'रव्याची मसालेदार खिचडी, एक नाश्त्याचा क्लासिक.' }, price: 50, category: 'maharashtrian', image: 'https://picsum.photos/seed/m5/600/400' },
    { id: 'shira', name: { en: 'Shira', mr: 'शिरा' }, description: { en: 'Sweet semolina pudding with nuts and ghee.', mr: 'सुकामेवा आणि तुपासह गोड रव्याचा हलवा.' }, price: 60, category: 'maharashtrian', image: 'https://picsum.photos/seed/m6/600/400' },
    { id: 'kanda-pakoda', name: { en: 'Kanda Pakoda', mr: 'कांदा पकोडा' }, description: { en: 'Crispy onion fritters, a perfect tea-time snack.', mr: 'कुरकुरीत कांद्याची भजी, चहाच्या वेळेसाठी उत्तम नाश्ता.' }, price: 60, category: 'maharashtrian', image: 'https://picsum.photos/seed/m7/600/400' },
    { id: 'chilly-pakoda', name: { en: 'Chilly Pakoda', mr: 'मिरची पकोडा' }, description: { en: 'Spicy green chilies fried in chickpea flour batter.', mr: 'बेसनाच्या पिठात तळलेली मसालेदार हिरवी मिरची.' }, price: 60, category: 'maharashtrian', image: 'https://picsum.photos/seed/m8/600/400' },
    { id: 'paneer-pakoda', name: { en: 'Paneer Pakoda', mr: 'पनीर पकोडा' }, description: { en: 'Soft paneer cubes coated and fried to golden perfection.', mr: 'मऊ पनीरचे तुकडे सोनेरी होईपर्यंत तळलेले.' }, price: 140, category: 'maharashtrian', image: 'https://picsum.photos/seed/m9/600/400' },
    { id: 'puri-bhaji', name: { en: 'Puri Bhaji', mr: 'पुरी भाजी' }, description: { en: 'Fluffy puris served with a spiced potato curry.', mr: 'मसालेदार बटाट्याच्या भाजीसोबत फुगलेल्या पुऱ्या.' }, price: 60, category: 'maharashtrian', image: 'https://picsum.photos/seed/m10/600/400' },

    // Fast Items
    { id: 'sabudana-usal', name: { en: 'Sabudana Usal', mr: 'साबुदाणा उसळ' }, description: { en: 'A savory dish of tapioca pearls, peanuts, and spices.', mr: 'साबुदाणा, शेंगदाणे आणि मसाल्यांचा एक चवदार पदार्थ.' }, price: 50, category: 'fast-items', image: 'https://picsum.photos/seed/f1/600/400' },
    { id: 'sabudana-wada', name: { en: 'Sabudana Wada', mr: 'साबुदाणा वडा' }, description: { en: 'Crispy tapioca pearl and potato fritters.', mr: 'कुरकुरीत साबुदाणा आणि बटाट्याचे वडे.' }, price: 60, category: 'fast-items', image: 'https://picsum.photos/seed/f2/600/400' },
    { id: 'finger-chips', name: { en: 'Finger Chips', mr: 'फिंगर चिप्स' }, description: { en: 'Classic golden-fried potato finger chips.', mr: 'क्लासिक सोनेरी तळलेले बटाट्याचे फिंगर चिप्स.' }, price: 60, category: 'fast-items', image: 'https://picsum.photos/seed/f3/600/400' },
];

export const contactInfo = {
    title: { en: 'Visit or Call Us', mr: 'भेट द्या किंवा कॉल करा' },
    addressTitle: { en: 'Our Address', mr: 'आमचा पत्ता' },
    address: { en: '123 Main Road, Hingoli, Maharashtra 431513', mr: '१२३ मुख्य रस्ता, हिंगोली, महाराष्ट्र ४३१५१३' },
    phone: '919876543210',
    whatsapp: '919876543210',
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
    button: { en: 'Submit Booking', mr: 'बुकिंग सबमिट करा' },
};
