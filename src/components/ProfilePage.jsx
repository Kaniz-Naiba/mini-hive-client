import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { User, Mail, Phone, MapPin, Award, DollarSign } from "lucide-react";

export default function ProfilePage() {
  const { userInfo, user } = useContext(AuthContext);

  const name = userInfo?.name || user?.displayName || "User";
  const email = userInfo?.email || user?.email || "Not Provided";
  const phone = userInfo?.phone || "Not Provided";
  const address = userInfo?.address || "Not Provided";
  const role = userInfo?.role || "worker";
  const coins = userInfo?.coins || 0;
  const photo = userInfo?.photo || user?.photoURL || "";

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row gap-8">
      {/* Left: Profile Image */}
      <div className="flex-shrink-0 flex justify-center md:justify-start">
        {photo ? (
          <img
            src={photo}
            alt={name}
            className="w-40 h-40 rounded-full object-cover border-4 border-yellow-500 shadow-md"
          />
        ) : (
          <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center text-5xl font-bold text-gray-500 border-4 border-yellow-500 shadow-md">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Right: Profile Details */}
      <div className="flex-1 flex flex-col justify-center gap-4">
        <h2 className="text-3xl font-bold text-yellow-600">{name}</h2>

        <ProfileInfo icon={<Mail size={18} />} label="Email" value={email} />
        <ProfileInfo icon={<Phone size={18} />} label="Phone" value={phone} />
        <ProfileInfo icon={<MapPin size={18} />} label="Address" value={address} />
        <ProfileInfo icon={<Award size={18} />} label="Role" value={role} />
        <ProfileInfo
          icon={<DollarSign size={18} />}
          label="Coins"
          value={`${coins} Coins`}
        />
      </div>
    </div>
  );
}

const ProfileInfo = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all">
    <div className="text-yellow-500">{icon}</div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{label}</p>
      <p className="text-gray-700 font-semibold">{value}</p>
    </div>
  </div>
);
