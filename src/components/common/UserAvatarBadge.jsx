import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials, getUserFullName } from "@/lib/utils";

const UserAvatarBadge = ({user, showEmail, className, iconClassName}) => {
  const { profile_photo, } = user;

  const fullName = getUserFullName(user) || getUserFullName(user) || "Unknown";

  return (
    <div className={cn("flex flex-row gap-2 items-center justify-center", className)}>
      <Avatar className={iconClassName}>
        <AvatarImage src={profile_photo} alt={fullName} />
        <AvatarFallback className="bg-blueSecondary text-xs">{getInitials(user) || "?"}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col justify-center">
        <span className="text-greyPrimary">{fullName}</span>
        {showEmail && <span className="text-[#7C7C7C] text-xs">{user.email}</span>}
      </div>
    </div>
  );
};

export default UserAvatarBadge;
