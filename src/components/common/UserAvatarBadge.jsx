import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials, getUserFullName } from "@/lib/utils";
import avatar1 from "/avatar1.svg";
import avatar2 from "/avatar2.svg";
import avatar3 from "/avatar3.svg";
import avatar4 from "/avatar4.svg";
import avatar5 from "/avatar5.svg";
import avatar6 from "/avatar6.svg";
import avatar7 from "/avatar7.svg";
import avatar8 from "/avatar8.svg";
import avatar9 from "/avatar9.svg";

const MALE_USER_AVATARS = [avatar2, avatar6, avatar7];
const FEMALE_USER_AVATARS = [
  avatar1,
  avatar3,
  avatar4,
  avatar5,
  avatar8,
  avatar9,
];

function getAvatarForUsername(username, avatars) {
  if (!username) return avatars[0];
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash += username.charCodeAt(i);
  }
  return avatars[hash % avatars.length];
}

const UserAvatarBadge = ({ user, showEmail, className, iconClassName }) => {
  const { profile_photo, username, gender } = user || {};

  const fullName = getUserFullName(user) || getUserFullName(user) || "Unknown";
  const avatarSrc =
    profile_photo ||
    getAvatarForUsername(
      username,
      gender === 0 ? MALE_USER_AVATARS : FEMALE_USER_AVATARS
    );

  return (
    <div
      className={cn(
        "flex flex-row gap-2 items-center justify-center",
        className
      )}
    >
      <Avatar className={iconClassName}>
        <AvatarImage src={avatarSrc} alt={fullName} />
        <AvatarFallback className="bg-blueSecondary text-xs">
          {getInitials(user) || "?"}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col justify-center">
        <span className="text-greyPrimary">{fullName}</span>
        {showEmail && (
          <span className="text-[#7C7C7C] text-xs">{user.email}</span>
        )}
      </div>
    </div>
  );
};

export default UserAvatarBadge;
