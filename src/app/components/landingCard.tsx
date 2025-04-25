"use client";

interface LandingCardProps {
  header: string;
  description: string;
  imageUrl: string;
  altText?: string;
  bgColor: string;
  textColor: string;
}

export default function LandingCard({
  header,
  description,
  imageUrl,
  altText,
  bgColor,
  textColor,
}: LandingCardProps) {
  return (
    <div
      className={`relative my-10 z-10 w-4/5 mx-auto flex flex-col items-center ${bgColor} rounded-2xl shadow-lg overflow-hidden`}
    >
      <div className="my-5 mx-20 flex flex-col items-center">
        <h3 className={`text-2xl font-bold ${textColor} mb-2`}>{header}</h3>
        <p className={`${textColor} opacity-80 text-base`}>{description}</p>
      </div>
      <img
        src={imageUrl}
        alt={altText || header}
        className="drop-shadow-2xl mb-5 rounded-xl w-50"
      />
    </div>
  );
}
