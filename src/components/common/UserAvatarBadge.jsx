import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials, getUserFullName } from "@/lib/utils";

const UserAvatarBadge = ({user}) => {
  const { profile_photo } = user;

  const fullName = getUserFullName(user) || getUserFullName(user) || "Unknown";

  return (
    <div className="flex flex-row gap-1 items-center">
      <Avatar className="size-6">
        <AvatarImage src={profile_photo} alt={fullName} />
        <AvatarFallback className="bg-blueSecondary text-xs">{getInitials(user) || "?"}</AvatarFallback>
      </Avatar>
      <span className="text-greyPrimary">{fullName}</span>
    </div>
  );
};

export default UserAvatarBadge;
