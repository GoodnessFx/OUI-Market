import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, BadgeCheck, ShoppingCart, CreditCard, X, ChevronRight, MessageSquare, ThumbsUp, ShieldCheck } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { useStore } from "./utils/store";
import { toast } from "sonner";
import { PaymentModal } from "./PaymentModal";

interface Product {
  id: number;
  name: string;
  vendor: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  discount?: number;
  verified: boolean;
  inStock: boolean;
  category?: string;
  description?: string;
}

export function ProductDetailModal({ product, isOpen, onClose }: { product: Product | null, isOpen: boolean, onClose: () => void }) {
  const { reviews, addReview, user } = useStore();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);

  if (!product) return null;

  const productReviews = reviews.filter(r => r.productId === product.id);

  const handleAddReview = () => {
    if (!newComment.trim()) return;
    addReview({
      productId: product.id,
      userName: user?.name || "Anonymous Student",
      rating: newRating,
      comment: newComment
    });
    setNewComment("");
    toast.success("Review posted successfully!");
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden border-none shadow-2xl rounded-[2.5rem] bg-white">
          <div className="grid md:grid-cols-2 h-[85vh] md:h-auto">
            {/* Image Section */}
            <div className="relative bg-slate-50 flex items-center justify-center p-8 border-r border-slate-100">
              <button 
                onClick={onClose}
                className="absolute top-6 left-6 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-all"
              >
                <X className="h-5 w-5" />
              </button>
              
              <motion.img 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                src={product.image} 
                alt={product.name}
                className="w-full aspect-square object-cover rounded-3xl shadow-2xl"
              />
              
              {product.discount && (
                <div className="absolute top-8 right-8 bg-rose-500 text-white px-4 py-1.5 rounded-full text-xs font-black shadow-lg">
                  -{product.discount}% OFF
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="flex flex-col h-full">
              <ScrollArea className="flex-1">
                <div className="p-8 space-y-8">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">
                        {product.category || "General"}
                      </div>
                      {product.verified && (
                        <div className="flex items-center gap-1 text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                          <BadgeCheck className="h-3 w-3" />
                          Verified Vendor
                        </div>
                      )}
                    </div>
                    <h2 className="text-3xl font-black text-[#0F172A] leading-tight tracking-tighter mb-2">{product.name}</h2>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                        ))}
                        <span className="text-sm font-black ml-1">{product.rating}</span>
                      </div>
                      <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{product.reviews} Global Reviews</span>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="text-4xl font-black text-primary">₦{product.price.toLocaleString()}</span>
                      {product.originalPrice && (
                        <span className="text-lg font-bold text-slate-400 line-through">₦{product.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Balance: ₦{user?.walletBalance.toLocaleString() || 0}</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-[#0F172A]">Product Description</h3>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">
                      {product.description || "This high-quality item is verified by the OUI Market team. Perfect for students looking for value and durability. Supports instant delivery and secure escrow payments."}
                    </p>
                  </div>

                  {/* Reviews Section */}
                  <div className="space-y-6 pt-6 border-t border-slate-100">
                    <h3 className="text-sm font-black uppercase tracking-widest text-[#0F172A] flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Student Feedback
                    </h3>
                    
                    <div className="space-y-4">
                      {productReviews.map((review) => (
                        <div key={review.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-black text-[#0F172A]">{review.userName}</span>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-2.5 w-2.5 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-slate-600 font-medium">{review.comment}</p>
                          <p className="text-[9px] text-slate-400 font-bold mt-2 uppercase">{review.time}</p>
                        </div>
                      ))}
                    </div>

                    {/* Add Review */}
                    <div className="space-y-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest">Leave a rating</p>
                      <div className="flex gap-2 mb-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button key={s} onClick={() => setNewRating(s)}>
                            <Star className={`h-5 w-5 ${s <= newRating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                          </button>
                        ))}
                      </div>
                      <textarea 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your experience..."
                        className="w-full bg-white border-none rounded-xl p-3 text-xs font-medium focus:ring-1 ring-primary/20 h-20 resize-none"
                      />
                      <Button onClick={handleAddReview} className="w-full h-10 bg-[#0F172A] text-white font-black text-xs uppercase tracking-widest rounded-xl">
                        Submit Review
                      </Button>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              {/* Action Section */}
              <div className="p-8 border-t bg-white flex gap-3">
                <Button 
                  onClick={() => setIsPaymentOpen(true)}
                  className="flex-1 h-14 bg-primary hover:bg-primary/90 text-white font-black text-lg rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group"
                >
                  <CreditCard className="h-6 w-6 group-hover:rotate-12 transition-transform" />
                  Buy Now
                </Button>
                <Button 
                  variant="outline"
                  className="h-14 w-14 border-2 border-slate-100 rounded-2xl flex items-center justify-center hover:bg-slate-50 transition-all"
                >
                  <ShoppingCart className="h-6 w-6 text-slate-600" />
                </Button>
              </div>
            </div>
          </div>
        </div></DialogContent>
      </Dialog>

      <PaymentModal 
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        amount={`₦${product.price.toLocaleString()}`}
        itemName={product.name}
      />
    </>
  );
}
