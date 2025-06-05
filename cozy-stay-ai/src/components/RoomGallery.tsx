
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RoomGalleryProps {
  images: {
    src: string;
    alt: string;
  }[];
}

const RoomGallery: React.FC<RoomGalleryProps> = ({ images }) => {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((current) => (current + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((current) => (current - 1 + images.length) % images.length);
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={images[currentImage].src}
          alt={images[currentImage].alt}
          className="w-full h-full object-cover transition-opacity duration-500"
        />
        {images.length > 1 && (
          <>
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/70 hover:bg-white/90"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/70 hover:bg-white/90"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
              {images.map((_, index) => (
                <button 
                  key={index} 
                  className={`w-2 h-2 rounded-full transition-all ${currentImage === index ? 'bg-white scale-125' : 'bg-white/50'}`}
                  onClick={() => setCurrentImage(index)}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RoomGallery;
