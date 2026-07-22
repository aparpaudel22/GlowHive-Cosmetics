'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, MapPin, CreditCard, Truck,
  User, Edit3, Plus
} from 'lucide-react';
import { IoIosCash } from 'react-icons/io';
import { BsBank } from 'react-icons/bs';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

// ── Complete Nepal cities with their provinces and postal codes ──
const NEPAL_CITIES = {
  'Baglung': { province: 'Gandaki', postalCode: '33300' },
  'Baitadi': { province: 'Sudurpashchim', postalCode: '10200' },
  'Bajhang': { province: 'Sudurpashchim', postalCode: '10500' },
  'Bajura': { province: 'Sudurpashchim', postalCode: '10700' },
  'Banke': { province: 'Lumbini', postalCode: '21900' },
  'Bara': { province: 'Province 2', postalCode: '44400' },
  'Bardiya': { province: 'Lumbini', postalCode: '21800' },
  'Bhaktapur': { province: 'Bagmati', postalCode: '44800' },
  'Bhojpur': { province: 'Province 1', postalCode: '57000' },
  'Chitwan': { province: 'Bagmati', postalCode: '44200' },
  'Dadeldhura': { province: 'Sudurpashchim', postalCode: '10400' },
  'Dailekh': { province: 'Karnali', postalCode: '21600' },
  'Dang': { province: 'Lumbini', postalCode: '21700' },
  'Darchula': { province: 'Sudurpashchim', postalCode: '10100' },
  'Dhading': { province: 'Bagmati', postalCode: '45100' },
  'Dhankuta': { province: 'Province 1', postalCode: '56800' },
  'Dhanusha': { province: 'Province 2', postalCode: '45600' },
  'Dholkha': { province: 'Bagmati', postalCode: '45500' },
  'Dolpa': { province: 'Karnali', postalCode: '21400' },
  'Doti': { province: 'Sudurpashchim', postalCode: '10800' },
  'Gandaki': { province: 'Gandaki', postalCode: '33700' },
  'Gorkha': { province: 'Gandaki', postalCode: '34000' },
  'Gulmi': { province: 'Lumbini', postalCode: '32600' },
  'Humla': { province: 'Karnali', postalCode: '21100' },
  'Ilam': { province: 'Province 1', postalCode: '57300' },
  'Jajarkot': { province: 'Karnali', postalCode: '21500' },
  'Jhapa': { province: 'Province 1', postalCode: '57200' },
  'Jumla': { province: 'Karnali', postalCode: '21200' },
  'Kailali': { province: 'Sudurpashchim', postalCode: '10900' },
  'Kalikot': { province: 'Karnali', postalCode: '21300' },
  'Kanchanpur': { province: 'Sudurpashchim', postalCode: '10300' },
  'Kapilvastu': { province: 'Lumbini', postalCode: '32800' },
  'Kaski': { province: 'Gandaki', postalCode: '33700' },
  'Kathmandu': { province: 'Bagmati', postalCode: '44600' },
  'Kavrepalanchok': { province: 'Bagmati', postalCode: '45200' },
  'Khotang': { province: 'Province 1', postalCode: '56000' },
  'Lalitpur': { province: 'Bagmati', postalCode: '44700' },
  'Lamjung': { province: 'Gandaki', postalCode: '33600' },
  'Mahottari': { province: 'Province 2', postalCode: '45700' },
  'Makwanpur': { province: 'Bagmati', postalCode: '44100' },
  'Manang': { province: 'Gandaki', postalCode: '33500' },
  'Morang': { province: 'Province 1', postalCode: '56600' },
  'Mugu': { province: 'Karnali', postalCode: '21100' },
  'Mustang': { province: 'Gandaki', postalCode: '33100' },
  'Myagdi': { province: 'Gandaki', postalCode: '33200' },
  'Nawalparasi': { province: 'Lumbini', postalCode: '33000' },
  'Nuwakot': { province: 'Bagmati', postalCode: '44900' },
  'Okhaldhunga': { province: 'Province 1', postalCode: '56100' },
  'Palpa': { province: 'Lumbini', postalCode: '32500' },
  'Panchthar': { province: 'Province 1', postalCode: '57400' },
  'Parbat': { province: 'Gandaki', postalCode: '33400' },
  'Parsa': { province: 'Province 2', postalCode: '44300' },
  'Pyuthan': { province: 'Lumbini', postalCode: '32700' },
  'Ramechhap': { province: 'Bagmati', postalCode: '45400' },
  'Rasuwa': { province: 'Bagmati', postalCode: '45000' },
  'Rautahat': { province: 'Province 2', postalCode: '44500' },
  'Rolpa': { province: 'Lumbini', postalCode: '22400' },
  'Rukum': { province: 'Karnali', postalCode: '22000' },
  'Rupandehi': { province: 'Lumbini', postalCode: '32900' },
  'Salyan': { province: 'Karnali', postalCode: '22200' },
  'Sankhuwasabha': { province: 'Province 1', postalCode: '56900' },
  'Saptari': { province: 'Province 2', postalCode: '56400' },
  'Sarlahi': { province: 'Province 2', postalCode: '45800' },
  'Sindhuli': { province: 'Bagmati', postalCode: '45900' },
  'Sindhupalchok': { province: 'Bagmati', postalCode: '45300' },
  'Siraha': { province: 'Province 2', postalCode: '56500' },
  'Solukhumbu': { province: 'Province 1', postalCode: '56000' },
  'Sunsari': { province: 'Province 1', postalCode: '56700' },
  'Surkhet': { province: 'Karnali', postalCode: '21700' },
  'Syangja': { province: 'Gandaki', postalCode: '33800' },
  'Tanahu': { province: 'Gandaki', postalCode: '33900' },
  'Taplejung': { province: 'Province 1', postalCode: '57500' },
  'Terhathum': { province: 'Province 1', postalCode: '57100' },
  'Udayapur': { province: 'Province 1', postalCode: '56300' }
};

// ── Get all city names sorted alphabetically ──
const CITIES = Object.keys(NEPAL_CITIES).sort();

// ── Get unique provinces from the data ──
const PROVINCES = [...new Set(Object.values(NEPAL_CITIES).map(c => c.province))].sort();

const PAYMENT_METHODS = [
  {
    id: 'cod', name: 'Cash on Delivery',
    desc: 'Pay when you receive your order',
    icon: <IoIosCash size={20} color="#b76e79" />,
  },
  {
    id: 'esewa', name: 'eSewa',
    desc: 'Pay via eSewa wallet',
    icon: <img src="/esewa.png" alt="esewa" style={{ width: 22, height: 22, objectFit: 'contain' }} />,
  },
  {
    id: 'khalti', name: 'Khalti',
    desc: 'Pay via Khalti wallet',
    icon: <img src="/khalti.png" alt="khalti" style={{ width: 22, height: 22, objectFit: 'contain' }} />,
  },
  {
    id: 'bank', name: 'Bank Transfer',
    desc: 'Direct bank transfer',
    icon: <BsBank size={18} color="#b76e79" />,
  },
];

const labelStyle = {
  display: 'block', fontSize: '12px', fontWeight: 700,
  color: '#3d1f25', marginBottom: '6px', textTransform: 'uppercase',
  letterSpacing: '0.5px',
};
const inp = (err) => ({
  width: '100%', padding: '11px 14px', fontFamily: 'inherit',
  border: `1.5px solid ${err ? '#f87171' : '#fde8ec'}`,
  borderRadius: '12px', fontSize: '14px', outline: 'none',
  background: '#fff', color: '#3d1f25', transition: 'border 0.2s',
});

const BLANK_ADDRESS = { address: '', city: '', province: '', postalCode: '' };
const BLANK_PROFILE = { firstName: '', lastName: '', email: '', phone: '' };

export default function CheckoutPage() {
  const router = useRouter();
  const { 
    cartItems, 
    selectedItems, 
    getSelectedItems,
    getSelectedTotal,
    getSelectedCount,
    removePurchasedItems,
    clearCart 
  } = useCart?.() ?? { 
    cartItems: [], 
    selectedItems: [],
    getSelectedItems: () => [],
    getSelectedTotal: () => 0,
    getSelectedCount: () => 0,
    removePurchasedItems: () => {},
    clearCart: () => {} 
  };
  const { user, isAuthenticated, hydrated } = useAuth();

  const [step,            setStep]            = useState(1);
  const [savedProfile,    setSavedProfile]    = useState(null);
  const [savedAddresses,  setSavedAddresses]  = useState([]);
  const [selectedAddrIdx, setSelectedAddrIdx] = useState(0);
  const [editingProfile,  setEditingProfile]  = useState(false);
  const [addingAddress,   setAddingAddress]   = useState(false);
  const [profile,         setProfile]         = useState(BLANK_PROFILE);
  const [addrForm,        setAddrForm]        = useState(BLANK_ADDRESS);
  const [profileErrors,   setProfileErrors]   = useState({});
  const [addrErrors,      setAddrErrors]      = useState({});
  const [selectedMethod,  setSelectedMethod]  = useState(null);
  const [placing,         setPlacing]         = useState(false);
  const [citiesByProvince, setCitiesByProvince] = useState([]);
  const [isLoading,       setIsLoading]       = useState(true);

  // ── Get selected items for checkout ──
  const checkoutItems = getSelectedItems?.() || [];
  const subtotal = getSelectedTotal?.() || 0;
  const itemCount = getSelectedCount?.() || 0;

  // ── Get cities for selected province ──
  useEffect(() => {
    if (addrForm.province) {
      const cities = Object.keys(NEPAL_CITIES)
        .filter(city => NEPAL_CITIES[city].province === addrForm.province)
        .sort();
      setCitiesByProvince(cities);
      
      if (addrForm.city && !cities.includes(addrForm.city)) {
        setAddrForm(prev => ({ ...prev, city: '', postalCode: '' }));
      }
    } else {
      setCitiesByProvince([]);
    }
  }, [addrForm.province]);

  // ── Auto-fill postal code when city is selected ──
  useEffect(() => {
    if (addrForm.city && NEPAL_CITIES[addrForm.city]) {
      const cityData = NEPAL_CITIES[addrForm.city];
      if (!addrForm.province || addrForm.province !== cityData.province) {
        setAddrForm(prev => ({ 
          ...prev, 
          province: cityData.province,
          postalCode: cityData.postalCode 
        }));
      } else {
        setAddrForm(prev => ({ ...prev, postalCode: cityData.postalCode }));
      }
    }
  }, [addrForm.city]);

  // ── Load personal details & addresses on mount ──
  useEffect(() => {
    const loadData = async () => {
      if (!hydrated) {
        setIsLoading(true);
        return;
      }
      
      if (!isAuthenticated) {
        router.replace('/account?from=checkout');
        return;
      }

      try {
        // ── FIRST: Get user data from users list ──
        let userData = null;
        try {
          const users = JSON.parse(localStorage.getItem('glowhive_users') || '[]');
          userData = users.find(u => u.email?.toLowerCase() === user?.email?.toLowerCase());
        } catch (_) {}

        // ── SECOND: Load saved profile ──
        let savedP = null;
        try {
          const savedProfileStr = localStorage.getItem('glowhive_profile');
          if (savedProfileStr) {
            savedP = JSON.parse(savedProfileStr);
          }
        } catch (_) {}

        // ── Build profile data ──
        let profileData = { ...BLANK_PROFILE };
        
        if (savedP) {
          profileData = {
            firstName: savedP.firstName || userData?.name?.split(' ')[0] || '',
            lastName: savedP.lastName || userData?.name?.split(' ').slice(1).join(' ') || '',
            email: user?.email || savedP.email || '',
            phone: savedP.phone || userData?.phone || '',
          };
        } else if (userData) {
          const nameParts = (userData.name || '').trim().split(' ');
          profileData = {
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            email: userData.email || user?.email || '',
            phone: userData.phone || '',
          };
        } else if (user) {
          const nameParts = (user.name || '').trim().split(' ');
          profileData = {
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            email: user.email || '',
            phone: user.phone || '',
          };
        }

        setProfile(profileData);
        setSavedProfile(profileData);
        
        if (profileData.firstName && profileData.email) {
          try {
            localStorage.setItem('glowhive_profile', JSON.stringify(profileData));
          } catch (_) {}
        }

        const hasPhone = profileData.phone && profileData.phone.replace(/\D/g, '').length >= 10;
        setEditingProfile(!hasPhone);

        // ── THIRD: Load saved addresses ──
        let loadedAddresses = [];
        try {
          const savedA = localStorage.getItem('glowhive_addresses');
          if (savedA) {
            loadedAddresses = JSON.parse(savedA);
            // Ensure it's an array
            if (!Array.isArray(loadedAddresses)) {
              loadedAddresses = [];
            }
          }
        } catch (_) {
          loadedAddresses = [];
        }

        // ── If no addresses found, try to load from orders ──
        if (loadedAddresses.length === 0) {
          try {
            const orders = JSON.parse(localStorage.getItem('glowhive_orders') || '[]');
            if (orders.length > 0 && orders[0].address) {
              const lastAddress = orders[0].address;
              if (lastAddress.address && lastAddress.city) {
                loadedAddresses = [lastAddress];
                // Save to localStorage
                localStorage.setItem('glowhive_addresses', JSON.stringify(loadedAddresses));
              }
            }
          } catch (_) {}
        }

        // ── Set addresses ──
        if (loadedAddresses.length > 0) {
          setSavedAddresses(loadedAddresses);
          setAddrForm(loadedAddresses[0]);
          setSelectedAddrIdx(0);
          setAddingAddress(false);
        } else {
          setSavedAddresses([]);
          setAddrForm(BLANK_ADDRESS);
          setAddingAddress(true);
        }

      } catch (error) {
        console.error('Error loading checkout data:', error);
        setProfile(BLANK_PROFILE);
        setAddrForm(BLANK_ADDRESS);
        setSavedAddresses([]);
        setEditingProfile(true);
        setAddingAddress(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [hydrated, isAuthenticated, user, router]);

  // ── Guards ──
  if (!hydrated || isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#fff8f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#b76e79', fontWeight: 600, fontSize: '15px' }}>Loading…</p>
      </div>
    );
  }
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', background: '#fff8f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#b76e79', fontWeight: 600, fontSize: '15px' }}>Redirecting to login…</p>
      </div>
    );
  }

  // ── Check if cart is empty or no items selected ──
  if (cartItems.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#fff8f5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>🛒</div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#3d1f25', fontFamily: "'Playfair Display', Georgia, serif", marginBottom: '10px' }}>Your cart is empty</h2>
        <p style={{ fontSize: '14px', color: '#8c6468', marginBottom: '24px' }}>Looks like you haven't added any items to your cart yet.</p>
        <Link href="/products" style={{ padding: '12px 32px', background: 'linear-gradient(135deg, #b76e79, #c2748a)', color: '#fff', border: 'none', borderRadius: '50px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', textDecoration: 'none' }}>
          Start Shopping
        </Link>
      </div>
    );
  }

  if (checkoutItems.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#fff8f5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>📦</div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#3d1f25', fontFamily: "'Playfair Display', Georgia, serif", marginBottom: '10px' }}>No items selected</h2>
        <p style={{ fontSize: '14px', color: '#8c6468', marginBottom: '24px' }}>Please select items from your cart to proceed with checkout.</p>
        <Link href="/cart" style={{ padding: '12px 32px', background: 'linear-gradient(135deg, #b76e79, #c2748a)', color: '#fff', border: 'none', borderRadius: '50px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', textDecoration: 'none' }}>
          Go to Cart
        </Link>
      </div>
    );
  }

  const shipping = addrForm.city === 'Kathmandu' ? 0 : 150;
  const total    = subtotal + shipping;

  const updateProfile = (k, v) => {
    setProfile(p => ({ ...(p ?? BLANK_PROFILE), [k]: v }));
    if (profileErrors[k]) setProfileErrors(e => ({ ...e, [k]: '' }));
  };
  const updateAddr = (k, v) => {
    setAddrForm(a => ({ ...(a ?? BLANK_ADDRESS), [k]: v }));
    if (addrErrors[k]) setAddrErrors(e => ({ ...e, [k]: '' }));
  };

  const validateProfile = () => {
    const e = {};
    if (!profile.firstName?.trim()) e.firstName = 'Required';
    if (!profile.lastName?.trim())  e.lastName  = 'Required';
    if (!profile.email?.trim())     e.email     = 'Required';
    else if (!/\S+@\S+\.\S+/.test(profile.email)) e.email = 'Invalid email';
    if (!profile.phone?.trim())     e.phone     = 'Phone number is required';
    else if (profile.phone.replace(/\D/g, '').length < 10) e.phone = 'Must be 10 digits';
    setProfileErrors(e);
    return !Object.keys(e).length;
  };
  const validateAddr = () => {
    const e = {};
    if (!addrForm.address?.trim()) e.address  = 'Required';
    if (!addrForm.city)            e.city     = 'Required';
    if (!addrForm.province)        e.province = 'Required';
    setAddrErrors(e);
    return !Object.keys(e).length;
  };

  // ── Save address to localStorage (keeps ALL addresses) ──
  const saveAddressToStorage = (address) => {
    try {
      let addrs = [];
      const savedA = localStorage.getItem('glowhive_addresses');
      if (savedA) {
        addrs = JSON.parse(savedA);
        if (!Array.isArray(addrs)) {
          addrs = [];
        }
      }
      
      // Check if address already exists
      const exists = addrs.some(a => 
        a.address === address.address && 
        a.city === address.city && 
        a.province === address.province
      );
      
      if (!exists) {
        // Add new address at the beginning
        addrs = [address, ...addrs];
        // Keep only last 5 addresses
        if (addrs.length > 5) {
          addrs = addrs.slice(0, 5);
        }
        localStorage.setItem('glowhive_addresses', JSON.stringify(addrs));
      }
      return addrs;
    } catch (e) {
      console.error('Error saving address:', e);
      return [];
    }
  };

  const handleNext = () => {
    if (!editingProfile) {
      const currentProfile = savedProfile ?? profile;
      if (!currentProfile?.phone?.trim() || currentProfile.phone.replace(/\D/g, '').length < 10) {
        setEditingProfile(true);
        setProfileErrors({ phone: 'Phone number is required to continue' });
        return;
      }
    }

    const profileOk = editingProfile ? validateProfile() : true;
    const addrOk    = addingAddress  ? validateAddr()    : true;
    if (!profileOk || !addrOk) return;

    const finalProfile = editingProfile ? profile : (savedProfile ?? profile);
    
    try {
      localStorage.setItem('glowhive_profile', JSON.stringify(finalProfile));
    } catch (_) {}
    
    setSavedProfile(finalProfile);
    setEditingProfile(false);

    // ── Save address to localStorage (keeps ALL addresses) ──
    if (addingAddress) {
      const savedAddrs = saveAddressToStorage(addrForm);
      setSavedAddresses(savedAddrs);
      setSelectedAddrIdx(0);
      setAddingAddress(false);
    } else {
      // Make sure we have the current address selected
      const currentAddr = savedAddresses[selectedAddrIdx] || addrForm;
      setAddrForm(currentAddr);
    }
    setStep(2);
  };

  const handlePlaceOrder = () => {
    if (!selectedMethod) { 
      alert('Please select a payment method');
      return; 
    }

    const fp = savedProfile ?? profile;
    if (!fp?.phone?.trim() || fp.phone.replace(/\D/g, '').length < 10) {
      setStep(1);
      setEditingProfile(true);
      setProfileErrors({ phone: 'Phone number is required to place an order' });
      return;
    }

    setPlacing(true);

    const fa = addingAddress ? addrForm : (savedAddresses[selectedAddrIdx] ?? addrForm);
    const orderId = 'GH-' + Date.now();
    const order = {
      id: orderId,
      date: new Date().toISOString(),
      items: checkoutItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || null
      })),
      profile: {
        firstName: fp.firstName || '',
        lastName: fp.lastName || '',
        email: fp.email || '',
        phone: fp.phone || '',
      },
      address: {
        address: fa.address || '',
        city: fa.city || '',
        province: fa.province || '',
        postalCode: fa.postalCode || '',
      },
      paymentMethod: selectedMethod.id,
      paymentName: selectedMethod.name,
      subtotal: subtotal,
      shipping: shipping,
      total: total,
      status: 'placed',
      statusHistory: [{ status: 'placed', label: 'Order Placed', time: new Date().toISOString() }],
      estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
        .toLocaleDateString('en-NP', { weekday: 'long', month: 'long', day: 'numeric' }),
    };

    try {
      // ── Save order ──
      let existing = [];
      try {
        const existingStr = localStorage.getItem('glowhive_orders');
        if (existingStr) {
          existing = JSON.parse(existingStr);
        }
      } catch (_) {}
      
      const updated = [order, ...existing];
      localStorage.setItem('glowhive_orders', JSON.stringify(updated));
      
      // ── Backup to scoped storage ──
      if (user?.email) {
        const scopedKey = `glowhive_${encodeURIComponent(user.email)}_orders`;
        localStorage.setItem(scopedKey, JSON.stringify(updated));
      }
      
      // ── Dispatch events ──
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('ordersUpdated'));
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'glowhive_orders',
          newValue: JSON.stringify(updated),
          oldValue: JSON.stringify(existing),
        }));
      }
      
      // ─── REMOVE PURCHASED ITEMS FROM CART ───
      const purchasedIds = checkoutItems.map(item => item.id);
      if (typeof removePurchasedItems === 'function') {
        removePurchasedItems(purchasedIds);
      } else {
        // Fallback: manually remove purchased items
        const remainingItems = cartItems.filter(item => !purchasedIds.includes(item.id));
        localStorage.setItem('glowhive_cart', JSON.stringify(remainingItems));
        const remainingSelected = selectedItems.filter(id => !purchasedIds.includes(id));
        localStorage.setItem('glowhive_cart_selected', JSON.stringify(remainingSelected));
      }
      
    } catch (error) {
      console.error('Error saving order:', error);
      alert('There was an error placing your order. Please try again.');
      setPlacing(false);
      return;
    }

    setTimeout(() => router.push('/checkout/success?id=' + orderId), 400);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff8f5' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg,#fdf0f3,#fff8f5)',
        borderBottom: '1px solid #fde8ec', padding: '24px 28px',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <button onClick={() => router.back()} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'none', border: 'none', color: '#b76e79',
            fontSize: '14px', fontWeight: 600, cursor: 'pointer', marginBottom: '12px',
          }}>
            <ArrowLeft size={15} /> Back
          </button>
          <h1 style={{
            fontSize: '26px', fontWeight: 800, color: '#3d1f25',
            fontFamily: "'Playfair Display', Georgia, serif",
          }}>Checkout</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px' }}>
            {[{ n: 1, label: 'Delivery' }, { n: 2, label: 'Payment' }].map((s, i) => (
              <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: step >= s.n ? 'linear-gradient(135deg,#b76e79,#c2748a)' : '#fde8ec',
                  color: step >= s.n ? '#fff' : '#9ca3af',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: 800,
                }}>
                  {step > s.n ? '✓' : s.n}
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: step >= s.n ? '#3d1f25' : '#9ca3af' }}>
                  {s.label}
                </span>
                {i === 0 && (
                  <div style={{ width: '48px', height: '2px', borderRadius: '2px', background: step >= 2 ? '#b76e79' : '#fde8ec' }} />
                )}
              </div>
            ))}
          </div>
          
          {/* Show selected items count */}
          <p style={{ fontSize: '13px', color: '#8c6468', marginTop: '10px' }}>
            {itemCount} item{itemCount !== 1 ? 's' : ''} selected for checkout
          </p>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '28px', alignItems: 'start' }}>

          {/* LEFT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {step === 1 && (
              <>
                {/* Profile Card */}
                <div style={{ background: '#fff', border: '1px solid #fde8ec', borderRadius: '20px', padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#fde8ec', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={17} color="#b76e79" />
                      </div>
                      <div>
                        <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#3d1f25', margin: 0 }}>
                          {savedProfile && !editingProfile ? 'Your Profile' : 'Personal Details'}
                        </h2>
                        {editingProfile && (
                          <p style={{ fontSize: '11px', color: '#b76e79', margin: '2px 0 0', fontWeight: 600 }}>
                            Please fill in your details to continue.
                          </p>
                        )}
                      </div>
                    </div>
                    {savedProfile && !editingProfile && (
                      <button onClick={() => setEditingProfile(true)} style={{
                        display: 'flex', alignItems: 'center', gap: '5px',
                        background: '#fdf0f3', border: '1px solid #fde8ec',
                        borderRadius: '50px', padding: '6px 14px', cursor: 'pointer',
                        fontSize: '12px', fontWeight: 700, color: '#b76e79',
                      }}>
                        <Edit3 size={11} /> Edit
                      </button>
                    )}
                  </div>

                  {savedProfile && !editingProfile ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      {[
                        ['Name',  `${savedProfile.firstName} ${savedProfile.lastName}`.trim()],
                        ['Phone', savedProfile.phone || '—'],
                        ['Email', savedProfile.email, '1 / -1'],
                      ].map(([lbl, val, col]) => (
                        <div key={lbl} style={{ background: '#fdf6f0', borderRadius: '10px', padding: '10px 14px', gridColumn: col }}>
                          <div style={{ fontSize: '10px', fontWeight: 700, color: '#b76e79', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '2px' }}>{lbl}</div>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: '#3d1f25' }}>{val || '—'}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      {[
                        { key: 'firstName', label: 'First Name *', placeholder: 'Ram', type: 'text' },
                        { key: 'lastName', label: 'Last Name *', placeholder: 'Sharma', type: 'text' },
                        { key: 'email', label: 'Email *', placeholder: 'ram@email.com', type: 'email', col: '1/-1' },
                        { key: 'phone', label: 'Phone *', placeholder: '98XXXXXXXX', type: 'tel', col: '1/-1' },
                      ].map(f => (
                        <div key={f.key} style={{ gridColumn: f.col || 'auto' }}>
                          <label style={labelStyle}>{f.label}</label>
                          <input
                            type={f.type}
                            value={(profile ?? BLANK_PROFILE)[f.key] || ''}
                            onChange={e => updateProfile(f.key, e.target.value)}
                            placeholder={f.placeholder}
                            style={inp(profileErrors[f.key])}
                          />
                          {profileErrors[f.key] && (
                            <p style={{ fontSize: '11px', color: '#f87171', marginTop: '4px', fontWeight: 600 }}>
                              {profileErrors[f.key]}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Delivery Address */}
                <div style={{ background: '#fff', border: '1px solid #fde8ec', borderRadius: '20px', padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#fde8ec', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MapPin size={17} color="#b76e79" />
                      </div>
                      <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#3d1f25' }}>Delivery Location</h2>
                    </div>
                    {savedAddresses.length > 0 && !addingAddress && (
                      <button onClick={() => setAddingAddress(true)} style={{
                        display: 'flex', alignItems: 'center', gap: '5px',
                        background: 'linear-gradient(135deg,#b76e79,#c2748a)',
                        border: 'none', borderRadius: '50px', padding: '7px 14px',
                        cursor: 'pointer', fontSize: '12px', fontWeight: 700, color: '#fff',
                      }}>
                        <Plus size={11} /> New Address
                      </button>
                    )}
                  </div>

                  {savedAddresses.length > 0 && !addingAddress && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px' }}>
                      {savedAddresses.map((addr, i) => (
                        <motion.div key={i} whileHover={{ y: -2 }}
                          onClick={() => { setSelectedAddrIdx(i); setAddrForm(addr); }}
                          style={{
                            border: `2px solid ${selectedAddrIdx === i ? '#b76e79' : '#fde8ec'}`,
                            borderRadius: '14px', padding: '14px 16px', cursor: 'pointer',
                            background: selectedAddrIdx === i ? '#fef5f7' : '#fff',
                            transition: 'all 0.2s', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                          }}>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: 700, color: '#3d1f25', marginBottom: '3px' }}>{addr.address}</div>
                            <div style={{ fontSize: '12px', color: '#8c6468' }}>{addr.city}, {addr.province} {addr.postalCode && `– ${addr.postalCode}`}</div>
                          </div>
                          <div style={{
                            width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0, marginTop: '2px',
                            border: `2px solid ${selectedAddrIdx === i ? '#b76e79' : '#fde8ec'}`,
                            background: selectedAddrIdx === i ? '#b76e79' : '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            {selectedAddrIdx === i && <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#fff' }} />}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  <AnimatePresence>
                    {addingAddress && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                        {savedAddresses.length > 0 && (
                          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={() => setAddingAddress(false)}
                              style={{ background: 'none', border: 'none', color: '#8c6468', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                              ✕ Cancel
                            </button>
                          </div>
                        )}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                          <div style={{ gridColumn: '1/-1' }}>
                            <label style={labelStyle}>Street Address *</label>
                            <input value={addrForm.address} onChange={e => updateAddr('address', e.target.value)} placeholder="Tole, Ward No., Street" style={inp(addrErrors.address)} />
                            {addrErrors.address && <p style={{ fontSize: '11px', color: '#f87171', marginTop: '4px' }}>{addrErrors.address}</p>}
                          </div>
                          <div>
                            <label style={labelStyle}>Province *</label>
                            <select 
                              value={addrForm.province} 
                              onChange={e => {
                                updateAddr('province', e.target.value);
                                setAddrForm(prev => ({ ...prev, city: '', postalCode: '' }));
                              }} 
                              style={{ ...inp(addrErrors.province), cursor: 'pointer' }}
                            >
                              <option value="">Select province</option>
                              {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                            {addrErrors.province && <p style={{ fontSize: '11px', color: '#f87171', marginTop: '4px' }}>{addrErrors.province}</p>}
                          </div>
                          <div>
                            <label style={labelStyle}>City *</label>
                            <select 
                              value={addrForm.city} 
                              onChange={e => updateAddr('city', e.target.value)} 
                              style={{ ...inp(addrErrors.city), cursor: 'pointer' }}
                              disabled={!addrForm.province}
                            >
                              <option value="">{addrForm.province ? 'Select city' : 'Select province first'}</option>
                              {citiesByProvince.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            {addrErrors.city && <p style={{ fontSize: '11px', color: '#f87171', marginTop: '4px' }}>{addrErrors.city}</p>}
                          </div>
                          <div>
                            <label style={labelStyle}>Postal Code</label>
                            <input 
                              value={addrForm.postalCode} 
                              onChange={e => updateAddr('postalCode', e.target.value)} 
                              placeholder="Auto-filled" 
                              style={{ ...inp(), background: '#fdf6f0' }}
                              readOnly
                            />
                            <p style={{ fontSize: '10px', color: '#8c6468', marginTop: '4px' }}>
                              Postal code is auto-filled based on the selected city.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 10px 32px rgba(183,110,121,0.30)' }}
                  whileTap={{ scale: 0.97 }} onClick={handleNext}
                  style={{
                    background: 'linear-gradient(135deg,#b76e79,#c2748a)',
                    color: '#fff', width: '100%', padding: '15px',
                    borderRadius: '14px', border: 'none', fontWeight: 800,
                    fontSize: '15px', cursor: 'pointer',
                  }}>
                  Continue to Payment →
                </motion.button>
              </>
            )}

            {step === 2 && (
              <div style={{ background: '#fff', border: '1px solid #fde8ec', borderRadius: '20px', padding: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#fde8ec', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CreditCard size={17} color="#b76e79" />
                  </div>
                  <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#3d1f25' }}>Payment Method</h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {PAYMENT_METHODS.map(m => (
                    <motion.div key={m.id} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedMethod(m)}
                      style={{
                        border: `2px solid ${selectedMethod?.id === m.id ? '#b76e79' : '#fde8ec'}`,
                        borderRadius: '14px', padding: '16px', cursor: 'pointer',
                        background: selectedMethod?.id === m.id ? '#fef5f7' : '#fff',
                        display: 'flex', alignItems: 'center', gap: '14px', transition: 'all 0.2s',
                      }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#fde8ec', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {m.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: '#3d1f25', fontSize: '14px' }}>{m.name}</div>
                        <div style={{ fontSize: '12px', color: '#8c6468', marginTop: '2px' }}>{m.desc}</div>
                      </div>
                      <div style={{
                        width: '20px', height: '20px', borderRadius: '50%',
                        border: `2px solid ${selectedMethod?.id === m.id ? '#b76e79' : '#fde8ec'}`,
                        background: selectedMethod?.id === m.id ? '#b76e79' : '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        {selectedMethod?.id === m.id && <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#fff' }} />}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div style={{ marginTop: '20px', background: '#fdf6f0', borderRadius: '12px', padding: '14px 16px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <Truck size={16} color="#b76e79" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <p style={{ fontSize: '12px', color: '#5a3a40', lineHeight: 1.6 }}>
                    Your order will be delivered within <strong>3–5 business days</strong>.
                    {addrForm.city === 'Kathmandu' ? ' Free shipping applies! 🎉' : ' A shipping charge of Rs. 150 applies.'}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <motion.button whileHover={{ background: '#fde8ec' }} whileTap={{ scale: 0.97 }}
                    onClick={() => setStep(1)}
                    style={{ background: '#fff', color: '#b76e79', border: '1.5px solid #b76e79', padding: '13px 20px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', flex: 1, fontSize: '14px' }}>
                    ← Back
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 10px 32px rgba(183,110,121,0.30)' }}
                    whileTap={{ scale: 0.96 }} onClick={handlePlaceOrder} disabled={placing}
                    style={{
                      background: 'linear-gradient(135deg,#b76e79,#c2748a)',
                      color: '#fff', border: 'none', padding: '13px 20px',
                      borderRadius: '12px', fontWeight: 800, cursor: placing ? 'wait' : 'pointer',
                      flex: 2, fontSize: '15px',
                    }}>
                    {placing ? 'Placing Order…' : 'Place Order 🛍️'}
                  </motion.button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — Order Summary */}
          <div style={{ background: '#fff', border: '1px solid #fde8ec', borderRadius: '20px', padding: '24px', position: 'sticky', top: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
              <Truck size={17} color="#b76e79" />
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#3d1f25' }}>Order Summary</h3>
              <span style={{ fontSize: '11px', color: '#b76e79', fontWeight: 600, marginLeft: 'auto' }}>
                {itemCount} item{itemCount !== 1 ? 's' : ''}
              </span>
            </div>

            <div style={{ maxHeight: '260px', overflowY: 'auto', marginBottom: '14px' }}>
              {checkoutItems.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px' }}>
                  <span style={{ color: '#8c6468', maxWidth: '160px', lineHeight: 1.4 }}>
                    {item.name} <span style={{ fontWeight: 700 }}>× {item.quantity}</span>
                  </span>
                  <span style={{ fontWeight: 700, color: '#3d1f25', flexShrink: 0 }}>
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #fde8ec', paddingTop: '14px' }}>
              {[
                ['Subtotal', `Rs. ${subtotal.toLocaleString()}`],
                ['Shipping', shipping === 0 ? 'FREE' : `Rs. ${shipping}`],
              ].map(([lbl, val]) => (
                <div key={lbl} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                  <span style={{ color: '#8c6468' }}>{lbl}</span>
                  <span style={{ fontWeight: 600, color: lbl === 'Shipping' && shipping === 0 ? '#22c55e' : '#3d1f25' }}>{val}</span>
                </div>
              ))}
              <div style={{ borderTop: '2px solid #fde8ec', marginTop: '10px', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '17px', color: '#3d1f25' }}>
                <span>Total</span>
                <span>Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            {(addrForm.city || savedAddresses[selectedAddrIdx]?.city) && (
              <div style={{ marginTop: '14px', background: '#fdf6f0', borderRadius: '10px', padding: '10px 12px', fontSize: '12px', color: '#5a3a40', lineHeight: 1.6 }}>
                <div style={{ fontWeight: 700, color: '#b76e79', marginBottom: '3px', fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase' }}>Delivering to</div>
                📍 {(addingAddress ? addrForm : savedAddresses[selectedAddrIdx])?.address},{' '}
                {(addingAddress ? addrForm : savedAddresses[selectedAddrIdx])?.city},{' '}
                {(addingAddress ? addrForm : savedAddresses[selectedAddrIdx])?.province}
                {(addingAddress ? addrForm : savedAddresses[selectedAddrIdx])?.postalCode && 
                  ` – ${(addingAddress ? addrForm : savedAddresses[selectedAddrIdx])?.postalCode}`
                }
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}