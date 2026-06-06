
import React, { useState, useRef, useEffect, useMemo, Suspense } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { MessageSquare, Star, Send, ThumbsUp, Heart, Award, Quote, Upload, Building2, User, Share2, MapPin, Sparkles, Zap, Linkedin, Instagram, Facebook } from 'lucide-react';
import { useToast } from '../../../hooks/use-toast';
import DashboardLayout from '../../../components/DashboardLayout';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

// --- 3D Background Components ---


function CustomStarField({ count = 2000 }) {
  return <StarFieldImpl count={count} />;
}

function StarFieldImpl({ count }) {
  const { scene } = useThree();
  const meshRef = useRef();

  useEffect(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
        const r = 40; 
        const theta = 2 * Math.PI * Math.random();
        const phi = Math.acos(2 * Math.random() - 1);
        
        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta) + (Math.random() - 0.5) * 10;
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) + (Math.random() - 0.5) * 10;
        positions[i * 3 + 2] = r * Math.cos(phi) + (Math.random() - 0.5) * 10;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
        size: 0.15,
        color: 0xffffff,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const mesh = new THREE.Points(geometry, material);
    meshRef.current = mesh;
    scene.add(mesh);
    
    return () => {
        scene.remove(mesh);
        geometry.dispose();
        material.dispose();
    };
  }, [count, scene]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y -= delta * 0.05;
      meshRef.current.rotation.x -= delta * 0.02;
    }
  });

  return null;
}

const FeedbackScene = () => {
  const { scene } = useThree();

  useEffect(() => {
    // 1. Create lights explicitly
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    
    const pointLight1 = new THREE.PointLight(0x3b82f6, 0.8);
    pointLight1.position.set(10, 10, 10);
    
    const pointLight2 = new THREE.PointLight(0xec4899, 0.5);
    pointLight2.position.set(-10, -10, -10);
    
    // 2. Add to scene
    scene.add(ambientLight);
    scene.add(pointLight1);
    scene.add(pointLight2);
    
    // 3. Cleanup
    return () => {
      scene.remove(ambientLight);
      scene.remove(pointLight1);
      scene.remove(pointLight2);
      
      // Dispose if necessary (lights usually don't need explicit dispose unless they have maps/shadows)
      ambientLight.dispose && ambientLight.dispose();
      pointLight1.dispose();
      pointLight2.dispose();
    };
  }, [scene]);

  return <CustomStarField count={3000} />;
};

// --- Main Component ---

const ClientFeedback = ({ isTabContent = false }) => {
    // State
    const [nps, setNps] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [testimonial, setTestimonial] = useState('');
    const [designation, setDesignation] = useState('');
    const [clientName, setClientName] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [showThankYou, setShowThankYou] = useState(false);
    
    // Refs
    const logoInputRef = useRef(null);
    const photoInputRef = useRef(null);
    const containerRef = useRef(null);
    
    // Hooks
    const { toast } = useToast();

    // GSAP Animations
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(".anim-entry", 
                { y: 50, opacity: 0, scale: 0.95 },
                { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: "back.out(1.2)" }
            );
            
            gsap.fromTo(".anim-bg",
                { opacity: 0 },
                { opacity: 1, duration: 2, ease: "power2.out" }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const queryClient = useQueryClient();

    // Fetch Feedback History
    const { data: feedbackHistory = [] } = useQuery({
        queryKey: ['client-feedback-history'],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${BACKEND_URL}/api/feedback`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        }
    });

    // Handlers
    const handleFileUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            if (type === 'logo') setUploadingLogo(true);
            else setUploadingPhoto(true);

            const token = localStorage.getItem('token');
            const res = await axios.post(`${BACKEND_URL}/api/uploads/single`, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            const url = res.data.file?.url || res.data.url;
            if (type === 'logo') setLogoUrl(url);
            else setPhotoUrl(url);
            
            toast({ title: "Upload successful", description: "Image attached successfully." });
        } catch (error) {
            console.error(error);
            toast({ title: "Upload failed", variant: "destructive" });
        } finally {
            if (type === 'logo') setUploadingLogo(false);
            else setUploadingPhoto(false);
        }
    };

    const handleSubmit = async () => {
        if (nps === 0) {
            toast({ title: "Please select a score", variant: "destructive" });
            return;
        }

        try {
            setSubmitting(true);
            const token = localStorage.getItem('token');
            const res = await axios.get(`${BACKEND_URL}/api/projects`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const projectId = res.data.projects[0]?.id;

            await axios.post(`${BACKEND_URL}/api/feedback`, {
                projectId,
                npsScore: nps,
                comment,
                testimonial,
                designation,
                clientName,
                idNumber,
                companyName,
                logoUrl,
                photoUrl,
                isPublic
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Show thank you modal
            setShowThankYou(true);
            
            // Reset form after a delay
            setTimeout(() => {
                setNps(0);
                setComment('');
                setTestimonial('');
                setDesignation('');
                setClientName('');
                setIdNumber('');
                setCompanyName('');
                setLogoUrl('');
                setPhotoUrl('');
                setIsPublic(false);
            }, 500);
            
            queryClient.invalidateQueries(['client-feedback-history']);
        } catch (e) {
            toast({ title: "Submission failed", variant: "destructive" });
        } finally {
            setSubmitting(false);
        }
    };

    const content = (
        <>
            {/* Thank You Modal Overlay */}
            {showThankYou && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
                    onClick={() => setShowThankYou(false)}
                >
                    <div 
                        className="relative bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[3rem] p-12 max-w-xl mx-4 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-500"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Decorative Elements */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden"></div>
                        
                        {/* Content */}
                        <div className="relative z-10 text-center space-y-6">
                            {/* Icon */}
                            <div className="inline-flex justify-center mb-2">
                                <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-full border-4 border-white shadow-lg">
                                    <Heart className="w-12 h-12 text-brand-blue fill-brand-blue animate-pulse" />
                                </div>
                            </div>
                            
                            {/* Title */}
                            <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-brand-gradient tracking-tight">
                                Thank You!
                            </h2>
                            
                            {/* Message */}
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-md mx-auto">
                                Your feedback has been <span className="font-bold text-brand-blue">successfully submitted</span>. We deeply value your insights and are committed to continuous improvement.
                            </p>
                            
                            {/* Subtext */}
                            <p className="text-sm text-gray-500 italic">
                                Our team will review your feedback and reach out if needed.
                            </p>
                            
                            {/* Close Button */}
                            <button
                                onClick={() => setShowThankYou(false)}
                                className="mt-8 px-8 py-4 bg-brand-gradient text-white rounded-2xl font-bold text-base hover:scale-105 active:scale-95 transition-all shadow-lg"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Full Screen Wrapper with Negative Margins to Break out of Dashboard Padding */}
            <div 
                ref={containerRef} 
                className={`relative bg-gray-50 dark:bg-gray-800 dark:border-gray-700 ${
                    isTabContent 
                        ? 'min-h-[calc(100vh-14rem)] -mx-4 sm:-mx-6 lg:-mx-8 mt-6 rounded-t-3xl overflow-hidden shadow-inner' 
                        : 'min-h-[calc(100vh-6rem)] -m-4 sm:-m-6 lg:-m-8 -mt-8 sm:-mt-10 lg:-mt-12'
                }`}
            >
                
                {/* 3D Background Canvas - Light Gray */}
                <div className="absolute inset-0 z-0 bg-gray-50 dark:bg-[#050505] anim-bg">
                    <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
                       <Suspense fallback={null}>
                           <FeedbackScene />
                       </Suspense>
                    </Canvas>
                </div>

                {/* Main Content Overlay - Glassmorphism */}
                <div className="relative z-10 w-full h-full p-6 md:p-12 overflow-y-auto">
                    <div className="max-w-4xl mx-auto space-y-8">
                        
                        {/* Header Section */}
                        <div className="text-center space-y-4 anim-entry pt-4 md:pt-12">
                            <div className="inline-flex justify-center mb-4">
                                <div className="p-4 bg-white dark:bg-gray-900 dark:border-gray-800/80 backdrop-blur-md rounded-full border border-blue-100 shadow-lg animate-pulse">
                                    <Heart className="w-10 h-10 text-brand-blue fill-brand-blue" />
                                </div>
                            </div>
                            <h1 className="text-6xl font-black text-slate-900 dark:text-white tracking-tight drop-shadow-sm">
                                Client <span className="text-transparent bg-clip-text bg-brand-gradient">Feedback</span>
                            </h1>
                            <p className="text-xl text-slate-600 dark:text-gray-400 font-medium max-w-2xl mx-auto">
                                Your insights drive our innovation engine.
                            </p>
                        </div>

                        {/* Main Feedback Card */}
                        <div className="bg-white dark:bg-gray-900 dark:border-gray-800/60 backdrop-blur-xl rounded-[3rem] p-8 md:p-12 shadow-2xl border border-white/40 space-y-12 anim-entry relative overflow-hidden group">
                            {/* Card Glow Effect - Lighter */}
                            

                            {/* NPS Scale */}
                            <div className="space-y-8 relative z-10">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <Sparkles className="w-4 h-4 text-brand-blue" />
                                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-transparent bg-clip-text bg-brand-gradient">Satisfaction Score</span>
                                    <Sparkles className="w-4 h-4 text-brand-blue" />
                                </div>
                                <h3 className="text-3xl text-center font-bold text-slate-900 dark:text-white mb-6">How likely are you to recommend us?</h3>
                                
                                {/* Half-Star Gradient Definition - Not needed with overlay approach, but keeping for reference if needed */}
                                
                                <div className="flex justify-center gap-3 sm:gap-6 group">
                                    {[1, 2, 3, 4, 5].map((starIndex) => {
                                        const ratingValue = hoverRating || nps;
                                        // Calculate display state
                                        const isFull = ratingValue >= starIndex * 2;
                                        const isHalf = ratingValue >= (starIndex * 2) - 1 && !isFull;
                                        
                                        return (
                                            <button 
                                                key={starIndex}
                                                // Mouse movement logic for half-star precision
                                                onMouseMove={(e) => {
                                                    const rect = e.currentTarget.getBoundingClientRect();
                                                    const isLeftHalf = (e.clientX - rect.left) < (rect.width / 2);
                                                    const newRating = isLeftHalf ? (starIndex * 2) - 1 : starIndex * 2;
                                                    setHoverRating(newRating);
                                                }}
                                                onMouseLeave={() => setHoverRating(0)}
                                                onClick={() => {
                                                    setNps(hoverRating);
                                                }}
                                                className="relative p-2 transition-transform hover:scale-110 focus:outline-none active:scale-95 duration-300"
                                            >
                                                {/* Base Empty Star (Slate) */}
                                                <Star 
                                                    className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 stroke-[1.5]" 
                                                />
                                                
                                                {/* Overlay Filled/Half Star (Golden) */}
                                                <div className={`absolute top-2 left-2 overflow-hidden transition-all duration-0 ${
                                                    isFull ? 'w-[calc(100%-1rem)]' : 
                                                    isHalf ? 'w-[calc(50%-0.5rem)]' : 'w-0'
                                                }`}>
                                                    <Star 
                                                        className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-500 fill-yellow-500 stroke-[1.5]" 
                                                    />
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                                
                                <div className="flex justify-between max-w-md mx-auto text-[10px] font-black text-slate-400 uppercase px-4 tracking-widest">
                                    <span>Not Likely</span>
                                    <span>Highly Likely</span>
                                </div>
                            </div>

                            {/* Client Identity Grid - Updated Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-200/50">
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-slate-900 dark:text-white uppercase flex items-center gap-2">
                                        <Building2 className="w-4 h-4 text-slate-900 dark:text-white" /> Company Identity
                                    </label>
                                    <div className="relative group/input space-y-4">
                                        <input 
                                            type="text"
                                            placeholder="Company Name"
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                            className="w-full p-4 pl-5 bg-white dark:bg-gray-900 dark:border-gray-800/50 border border-slate-200 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all outline-none"
                                        />
                                         <div 
                                            onClick={() => logoInputRef.current?.click()}
                                            className="w-full p-4 border border-dashed border-slate-300 rounded-2xl flex items-center justify-center cursor-pointer hover:border-brand-blue hover:bg-blue-50 dark:bg-blue-900/20 transition-all group active:scale-95"
                                        >
                                            {logoUrl ? (
                                                <div className="flex items-center gap-2 text-green-600 font-bold text-sm"><Upload className="w-5 h-5" /> Logo Uploaded</div>
                                            ) : (
                                                <div className="text-slate-900 dark:text-white flex flex-col items-center gap-1 group-hover:text-brand-blue transition-colors">
                                                    <span className="text-xs font-bold uppercase tracking-wider">Upload Company Logo</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <input type="file" ref={logoInputRef} onChange={(e) => handleFileUpload(e, 'logo')} className="hidden" accept="image/*" />
                                </div>

                                <div className="space-y-4">
                                     <label className="text-xs font-black text-slate-900 dark:text-white uppercase flex items-center gap-2">
                                        <User className="w-4 h-4 text-slate-900 dark:text-white" /> Personal Details
                                    </label>
                                    <div className="relative group/input space-y-3">
                                        <input 
                                            type="text"
                                            placeholder="Full Name"
                                            value={clientName}
                                            onChange={(e) => setClientName(e.target.value)}
                                            className="w-full p-4 pl-5 bg-white dark:bg-gray-900 dark:border-gray-800/50 border border-slate-200 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all outline-none"
                                        />
                                        <div className="grid grid-cols-2 gap-3">
                                            <input 
                                                type="text"
                                                placeholder="Designation"
                                                value={designation}
                                                onChange={(e) => setDesignation(e.target.value)}
                                                className="w-full p-4 pl-5 bg-white dark:bg-gray-900 dark:border-gray-800/50 border border-slate-200 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all outline-none"
                                            />
                                            <input 
                                                type="text"
                                                placeholder="ID Number"
                                                value={idNumber}
                                                onChange={(e) => setIdNumber(e.target.value)}
                                                className="w-full p-4 pl-5 bg-white dark:bg-gray-900 dark:border-gray-800/50 border border-slate-200 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all outline-none"
                                            />
                                        </div>
                                        
                                        <div 
                                            onClick={() => photoInputRef.current?.click()}
                                            className="mt-3 w-full p-4 border border-dashed border-slate-300 rounded-2xl flex items-center justify-center cursor-pointer hover:border-brand-blue hover:bg-blue-50 dark:bg-blue-900/20 transition-all group active:scale-95"
                                        >
                                            {photoUrl ? (
                                                <div className="flex items-center gap-2 text-green-600 font-bold text-sm"><Upload className="w-5 h-5" /> Photo Uploaded</div>
                                            ) : (
                                                <div className="text-slate-900 dark:text-white flex flex-col items-center gap-1 group-hover:text-brand-blue transition-colors">
                                                    <span className="text-xs font-bold uppercase tracking-wider">Upload Clients Image</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <input type="file" ref={photoInputRef} onChange={(e) => handleFileUpload(e, 'photo')} className="hidden" accept="image/*" />
                                </div>
                            </div>

                            {/* Inputs */}
                            <div className="space-y-4">
                                <label className="text-xs font-black text-slate-900 dark:text-white uppercase flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-slate-900 dark:text-white" /> Specific Feedback
                                </label>
                                <textarea 
                                    className="w-full p-6 bg-white dark:bg-gray-900 dark:border-gray-800/50 border border-slate-200 rounded-[2rem] text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all outline-none resize-none"
                                    placeholder="What can we do better? Be as detailed as you'd like."
                                    rows={4}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                            </div>

                            {/* Testimonial */}
                            <div className="space-y-4 pt-4">
                                <label className="text-xs font-black text-slate-900 dark:text-white uppercase flex items-center gap-2">
                                    <Award className="w-4 h-4 text-slate-900 dark:text-white" /> Testimonial
                                </label>
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-1 rounded-[2rem] border border-blue-100">
                                    <textarea 
                                        className="w-full p-6 bg-transparent text-slate-800 placeholder:text-slate-400 outline-none resize-none italic text-lg text-center font-serif leading-relaxed"
                                        placeholder="&ldquo;Summarize your experience in one sentence...&rdquo;"
                                        rows={3}
                                        value={testimonial}
                                        onChange={(e) => setTestimonial(e.target.value)}
                                    />
                                </div>
                                <label className="flex items-center gap-3 cursor-pointer group justify-center pt-2">
                                    <div className={`w-5 h-5 rounded border transition-all ${isPublic ? 'bg-brand-blue border-brand-blue shadow-md' : 'bg-white dark:bg-gray-900 dark:border-gray-800 border-slate-300 group-hover:border-brand-blue'}`}>
                                        {isPublic && <ThumbsUp className="w-3 h-3 text-white mx-auto mt-0.5" />}
                                    </div>
                                    <input type="checkbox" className="hidden" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-brand-blue transition-colors">Permissions granted for public display</span>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button 
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="w-full py-6 bg-brand-gradient text-white rounded-[2rem] font-black text-xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white dark:bg-black/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-[2rem]"></div>
                                <span className="relative z-10">{submitting ? "Transmitting..." : "Submit Review"}</span>
                                {!submitting && <Send className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </div>

                        {/* Premium Referral Card - Brand Gradient */}
                        <div className="anim-entry relative overflow-hidden bg-brand-gradient rounded-[2.5rem] p-10 shadow-2xl border border-white/10 group hover:border-white/20 transition-all duration-500">
                            {/* Animated Background Mesh for Card */}
                            <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
                            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white dark:bg-black/10 blur-[100px] rounded-full group-hover:bg-white dark:bg-black/20 transition-all duration-700"></div>

                            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 text-center lg:text-left">
                                <div className="space-y-4 max-w-xl">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-gray-900 dark:border-gray-800/10 border border-white/20 text-yellow-300 text-[10px] font-black uppercase tracking-widest shadow-lg backdrop-blur-sm">
                                        <Star className="w-3 h-3 fill-current" />
                                        Kangqore Ambassador
                                    </div>
                                    <h3 className="text-3xl font-black text-white tracking-tight leading-tight">
                                        Love working with <span className="text-blue-100">Kangqore?</span>
                                    </h3>
                                    <p className="text-blue-50 font-medium text-base leading-relaxed opacity-90">
                                        Join our exclusive circle of visionaries. Recommend us to your network.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto min-w-[320px]">
                                    <a 
                                        href="https://g.page/r/CHECK_YOUR_GOOGLE_BUSINESS_ID/review" 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="flex-1 px-6 py-5 bg-white dark:bg-gray-900 dark:border-gray-800/95 backdrop-blur-sm text-gray-800 dark:text-gray-50 rounded-2xl font-bold text-sm shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgba(66,133,244,0.3)] hover:scale-[1.03] transition-all flex flex-col items-center justify-center gap-2.5 group border border-gray-100"
                                    >
                                        <div className="flex items-center gap-3">
                                            {/* Google 'G' Logo */}
                                            <svg className="w-5 h-5" viewBox="0 0 48 48">
                                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                                                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                                                <path fill="none" d="M0 0h48v48H0z"/>
                                            </svg>
                                            <span className="bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent">Rate on Google</span>
                                        </div>
                                        {/* 5-Star Visual Indicator */}
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                            ))}
                                        </div>
                                    </a>
                                    <button 
                                        onClick={async () => {
                                            if (navigator.share) {
                                                try {
                                                    await navigator.share({
                                                        title: 'Recommended: Kangqore',
                                                        text: 'Check out Kangqore for enterprise software solutions.',
                                                        url: 'https://kangqore.com'
                                                    });
                                                } catch (err) {
                                                    // Ignore share cancellation
                                                    console.debug('Share dialog canceled or failed', err);
                                                }
                                            } else {
                                                toast({ title: "Link copied to clipboard!" });
                                                navigator.clipboard.writeText('https://kangqore.com');
                                            }
                                        }}
                                        className="flex-1 px-8 py-4 bg-transparent border border-white/30 text-white rounded-xl font-bold text-sm hover:bg-white dark:bg-gray-900 dark:border-gray-800/10 hover:border-white transition-all flex items-center justify-center gap-3 group"
                                    >
                                        <Share2 className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
                                        <span>Refer a Friend</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Social Media Sharing Section */}
                        <div className="anim-entry bg-white dark:bg-gray-900 dark:border-gray-800/60 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-white/40 space-y-6">
                            <div className="text-center space-y-3">
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                                    Share Your Experience
                                </h3>
                                <p className="text-slate-600 dark:text-gray-400 text-sm max-w-2xl mx-auto">
                                    Help others discover Kangqore! Share your journey and experience with your professional network.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                {/* LinkedIn */}
                                <a
                                    href="https://www.linkedin.com/sharing/share-offsite/?url=https://kangqore.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                                >
                                    <Linkedin className="w-8 h-8 text-white" />
                                    <span className="text-white font-bold text-sm">LinkedIn</span>
                                </a>

                                {/* Instagram */}
                                <button
                                    onClick={() => {
                                        toast({ 
                                            title: "Share on Instagram", 
                                            description: "Open Instagram app to share your story!" 
                                        });
                                    }}
                                    className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                                >
                                    <Instagram className="w-8 h-8 text-white" />
                                    <span className="text-white font-bold text-sm">Instagram</span>
                                </button>

                                {/* X (Twitter) */}
                                <a
                                    href="https://twitter.com/intent/tweet?text=Check%20out%20Kangqore%20for%20enterprise%20software%20solutions!&url=https://kangqore.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-slate-800 to-slate-950 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                                >
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                    </svg>
                                    <span className="text-white font-bold text-sm">X</span>
                                </a>

                                {/* Facebook */}
                                <a
                                    href="https://www.facebook.com/sharer/sharer.php?u=https://kangqore.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                                >
                                    <Facebook className="w-8 h-8 text-white" />
                                    <span className="text-white font-bold text-sm">Facebook</span>
                                </a>

                                {/* Reddit */}
                                <a
                                    href="https://www.reddit.com/submit?url=https://kangqore.com&title=Check%20out%20Kangqore"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                                >
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                                    </svg>
                                    <span className="text-white font-bold text-sm">Reddit</span>
                                </a>

                                {/* Discord */}
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText('Check out Kangqore: https://kangqore.com');
                                        toast({ 
                                            title: "Link Copied!", 
                                            description: "Paste in Discord to share" 
                                        });
                                    }}
                                    className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                                >
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026c.462-.62.874-1.275 1.226-1.963.021-.04.001-.088-.041-.104a13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z"/>
                                    </svg>
                                    <span className="text-white font-bold text-sm">Discord</span>
                                </button>
                            </div>
                        </div>

                        {/* Feedback History */}
                        {feedbackHistory.length > 0 && (
                            <div className="anim-entry space-y-6 pb-20">
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white px-4">Your Previous Feedback</h3>
                                <div className="grid gap-4">
                                    {feedbackHistory.map((item) => (
                                        <div key={item.id} className="bg-white dark:bg-gray-900 dark:border-gray-800/60 backdrop-blur-md rounded-2xl p-6 border border-white/50 shadow-sm hover:shadow-md transition-all">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex gap-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star 
                                                                key={i} 
                                                                className={`w-4 h-4 ${
                                                                    (item.npsScore / 2) > i 
                                                                        ? 'text-yellow-500 fill-yellow-500' 
                                                                        : 'text-slate-200'
                                                                }`} 
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-700 dark:text-gray-300 ml-2">{item.project?.title || 'General Feedback'}</span>
                                                </div>
                                                <span className="text-xs text-slate-400 font-medium">{new Date(item.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            {item.comment && (
                                                <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed mb-3">"{item.comment}"</p>
                                            )}
                                            {item.adminResponse && (
                                                <div className="bg-blue-50 dark:bg-blue-900/20/50 rounded-xl p-4 mt-4 border border-blue-100 flex gap-3">
                                                    <div className="w-1 bg-brand-blue rounded-full"></div>
                                                    <div>
                                                        <p className="text-xs font-bold text-brand-blue uppercase mb-1">Kangqore Response</p>
                                                        <p className="text-sm text-slate-700 dark:text-gray-300">{item.adminResponse}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </>
    );

    if (isTabContent) return content;

    return (
        <DashboardLayout role="client" title={null}>
            {content}
        </DashboardLayout>
    );
}

export default ClientFeedback;
