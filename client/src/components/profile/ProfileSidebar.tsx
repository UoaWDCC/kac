import { ChevronRight, Pencil, Star, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getCurrentProfileImage,
  postCurrentProfileImage,
} from "../../api/imageApi";
import { useAuth } from "../../auth/useAuth";
import type { ProfileSection } from "../../pages/Profile.tsx";
import "../../style/image_block/ImageBlock.css";
import { UploadModal } from "../image_block/UploadModal.tsx";

const profileImageUpdatedEvent = "profile-image-updated";

type ProfileSidebarProps = {
  activeSection: ProfileSection;
  onSectionChange: (section: ProfileSection) => void;
};

export default function ProfileSidebar({
  activeSection,
  onSectionChange,
}: ProfileSidebarProps) {
  const { user } = useAuth();
  const [isProfileImageLoading, setIsProfileImageLoading] = useState(true);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [showProfileUpload, setShowProfileUpload] = useState(false);

  const navItems: { icon: LucideIcon; label: string; value: ProfileSection }[] =
    [
      { icon: UserRound, label: "Personal Information", value: "profile" },
      { icon: Star, label: "Events Attended", value: "attended" },
    ];

  const loadProfileImage = useCallback(async () => {
    setIsProfileImageLoading(true);

    try {
      const image = await getCurrentProfileImage();
      setProfileImageUrl(image.signedUrl ?? null);
    } catch (error) {
      console.error("Failed to load profile image:", error);
    } finally {
      setIsProfileImageLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProfileImage();
  }, [loadProfileImage]);

  const profileInitials = useMemo(() => {
    const displayName = user?.displayName?.trim() ?? "";
    const initials = displayName
      .split(/\s+/)
      .slice(0, 2)
      .map((name) => name.charAt(0))
      .join("");

    return initials.toUpperCase() || "KAC";
  }, [user?.displayName]);

  const imageUrl = profileImageUrl ?? user?.photos?.[0]?.value ?? null;

  return (
    <aside className="w-full shrink-0 rounded-[1.35rem] bg-white px-8 py-7 shadow-[6px_6px_0_var(--color-yellow-medium)] sm:w-[18.5rem] lg:sticky lg:top-8 lg:self-start">
      <div className="flex justify-center">
        <div className="relative h-45 w-45">
          <div className="h-full w-full overflow-hidden rounded-full bg-yellow-light ring-4 ring-yellow-medium">
            {imageUrl ? (
              <img
                alt="Profile"
                className="h-full w-full object-cover"
                src={imageUrl}
              />
            ) : isProfileImageLoading ? (
              <div className="flex h-full w-full items-center justify-center text-blue-medium">
                <UserRound aria-hidden="true" className="h-12 w-12" />
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center text-blue-medium">
                <span className="font-sans text-3xl font-bold">
                  {profileInitials}
                </span>
              </div>
            )}
          </div>
          <button
            className="image-block__edit-btn right-3! top-3! h-11! w-11!"
            onClick={() => setShowProfileUpload(true)}
            title="Edit profile picture"
            type="button"
          >
            <Pencil aria-hidden="true" size={20} />
          </button>
        </div>
      </div>

      <nav className="flex flex-col gap-6 mt-8">
        {navItems.map((item) => {
          const isActive = activeSection === item.value;
          const Icon = item.icon;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onSectionChange(item.value)}
              className="group flex w-full items-center gap-3 bg-transparent p-0 text-left text-blue-medium"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center text-yellow-dark">
                <Icon
                  aria-hidden="true"
                  className={`h-7 w-7 ${item.value === "attended" ? "fill-yellow-dark" : ""}`}
                  strokeWidth={2.4}
                />
              </span>
              <span
                className={`flex min-h-9 items-center rounded-full px-4 text-base font-bold leading-none transition ${
                  isActive
                    ? "bg-yellow-dark"
                    : "bg-transparent group-hover:bg-yellow-medium"
                }`}
              >
                {item.label}
                {item.value === "attended" && (
                  <ChevronRight aria-hidden="true" className="ml-1 h-4 w-4" />
                )}
              </span>
            </button>
          );
        })}
      </nav>

      {showProfileUpload ? (
        <UploadModal
          onClose={() => setShowProfileUpload(false)}
          onSuccess={() => {
            setShowProfileUpload(false);
            void loadProfileImage();
            globalThis.dispatchEvent(new Event(profileImageUpdatedEvent));
          }}
          title="UPLOAD PROFILE PICTURE"
          uploadImage={postCurrentProfileImage}
        />
      ) : null}
    </aside>
  );
}
