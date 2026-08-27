// src/components/rooms/RoomCard.jsx
import { Link } from 'react-router-dom';
import { useState } from 'react';

const RoomCard = ({ room }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % room.images.length);
  };

  return (
    <div 
      className="group relative card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Gallery */}
      <div className="relative h-64 overflow-hidden">
        {room.images?.map((img, index) => (
          <img
            key={index}
            src={`http://localhost:5000${img}`}
            alt={`${room.room_type} - imagine ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              index === currentImage ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        
        {/* Image Navigation Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {room.images?.map((_, index) => (
            <button
              key={index}
              onClick={(e) => { e.stopPropagation(); setCurrentImage(index); }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentImage ? 'bg-white w-4' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Price Badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
          <span className="text-2xl font-serif font-bold text-primary-600">
            £{room.price_per_night}
          </span>
          <span className="text-xs text-gray-500">/ noapte</span>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium">
          ⭐ {room.averageRating || 5.0} ({room.reviewCount || 0})
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-serif text-xl font-bold text-gray-800 group-hover:text-primary-600 transition-colors">
              {room.room_type}
            </h3>
            <p className="text-sm text-gray-500">Camera {room.room_number}</p>
          </div>
          // Wave Rating Component - înlocuiește stelele
        <div className="flex items-center space-x-1 text-blue-400">
          {[...Array(5)].map((_, i) => (
            <svg 
              key={i} 
              className="w-4 h-4 fill-current" 
              viewBox="0 0 24 24"
            >
              <path d="M12 2C8.5 2 5.5 4.5 4.5 8C3.5 11.5 5 15 8 17C9.5 18 11 18.5 12 19C13 18.5 14.5 18 16 17C19 15 20.5 11.5 19.5 8C18.5 4.5 15.5 2 12 2Z" />
            </svg>
          ))}
        </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {room.description}
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {room.features?.slice(0, 3).map((feature, index) => (
            <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              {feature}
            </span>
          ))}
          {room.features?.length > 3 && (
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{room.features.length - 3}
            </span>
          )}
        </div>

        <Link
          to={`/rooms/${room.id}`}
          className={`w-full py-3 rounded-xl font-medium transition-all duration-300 text-center block ${
            isHovered
              ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {isHovered ? '🔍 Vezi Detalii' : 'Află Mai Multe'}
        </Link>
      </div>
    </div>
  );
};

export default RoomCard;