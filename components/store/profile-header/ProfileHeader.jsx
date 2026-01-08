import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function ProfileHeader({ store }) {
  return (
    <div className="relative mb-12">
      {/* Gradient background decoration */}
      <div className="absolute inset-0 -top-20 bg-gradient-to-br from-purple-100 via-pink-50 to-orange-100 rounded-3xl blur-3xl opacity-30 -z-10"></div>
      
      <div className="text-center space-y-5 py-8">
        {/* Avatar with ring */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-400 via-pink-400 to-orange-400 rounded-full blur-lg opacity-50 animate-pulse"></div>
          <Avatar className="h-28 w-28 border-4 border-white shadow-xl relative">
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-2xl font-bold">
              {store.name[0]}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Name and bio */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
            {store.name}
          </h1>
          <p className="text-base text-slate-600 max-w-md mx-auto">
            {store.bio}
          </p>
        </div>

        {/* Social badges */}
        <div className="flex justify-center gap-3 flex-wrap">
          {store.socials.map((social) => (
            <Badge 
              key={social} 
              className="px-4 py-1.5 bg-white border-2 border-slate-200 text-slate-700 hover:border-purple-300 hover:bg-purple-50 transition-all cursor-pointer capitalize font-medium shadow-sm"
            >
              {social}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}